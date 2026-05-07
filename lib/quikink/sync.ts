// lib/quikink/sync.ts
import { prisma } from '@/lib/prisma'
import { quikinkClient } from './client'
import { Category } from '@prisma/client'

// Map Quikink category names to our enum
function mapCategory(quikinkCategory: string): Category {
  const map: Record<string, Category> = {
    'printed-tshirt': 'PRINTED_TSHIRT',
    'printed_tshirt': 'PRINTED_TSHIRT',
    't-shirt': 'PRINTED_TSHIRT',
    'tshirt': 'PRINTED_TSHIRT',
    'oversized': 'OVERSIZED_TEE',
    'oversized-tee': 'OVERSIZED_TEE',
    'hoodie': 'HOODIE',
    'sweatshirt': 'SWEATSHIRT',
    'cap': 'CAP',
    'accessory': 'ACCESSORY',
    'accessories': 'ACCESSORY',
  }
  return map[quikinkCategory.toLowerCase()] || 'PRINTED_TSHIRT'
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function generateUniqueSlug(base: string, existingSlugs: Set<string>): string {
  let slug = base
  let counter = 1
  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  return slug
}

export async function syncQuikinkProducts(): Promise<{
  synced: number
  errors: string[]
  total: number
}> {
  const errors: string[] = []
  let synced = 0
  let total = 0
  let page = 1
  let hasMore = true

  // Get existing slugs to avoid conflicts
  const existingProducts = await prisma.product.findMany({
    select: { slug: true, quikinkId: true },
  })
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))
  const existingQuikinkIds = new Set(existingProducts.map((p) => p.quikinkId).filter(Boolean))

  while (hasMore) {
    try {
      const catalogResponse = await quikinkClient.getCatalog(page, 50)
      const products = catalogResponse.products || catalogResponse.data || []
      total += products.length
      hasMore = catalogResponse.hasMore || catalogResponse.pagination?.hasNextPage || false
      page++

      for (const qProduct of products) {
        try {
          // Skip if already synced (just update)
          const isExisting = existingQuikinkIds.has(qProduct.id)

          const slug = isExisting
            ? existingProducts.find((p) => p.quikinkId === qProduct.id)?.slug || generateSlug(qProduct.name)
            : generateUniqueSlug(generateSlug(qProduct.name), existingSlugs)

          if (!isExisting) existingSlugs.add(slug)

          const variantsData = qProduct.variants || []

          await prisma.product.upsert({
            where: { quikinkId: qProduct.id },
            create: {
              quikinkId: qProduct.id,
              name: qProduct.name,
              slug,
              description: qProduct.description || '',
              category: mapCategory(qProduct.category),
              tags: qProduct.tags || [],
              basePrice: qProduct.basePrice || qProduct.price || 1000,
              comparePrice: qProduct.comparePrice || null,
              images: qProduct.images || [],
              mockupImages: qProduct.mockupImages || qProduct.images || [],
              isActive: true,
              variants: {
                create: variantsData.map((v: any) => ({
                  quikinkSkuId: v.id,
                  size: v.size,
                  color: v.color,
                  colorHex: v.colorHex || null,
                  stock: v.stock || 100,
                  price: v.price || qProduct.basePrice || 1000,
                  isAvailable: v.isAvailable !== false,
                })),
              },
              sizeChart: {
                create: {
                  data: generateDefaultSizeChart(qProduct.category),
                },
              },
            },
            update: {
              name: qProduct.name,
              description: qProduct.description || '',
              basePrice: qProduct.basePrice || qProduct.price || 1000,
              comparePrice: qProduct.comparePrice || null,
              images: qProduct.images || [],
              mockupImages: qProduct.mockupImages || qProduct.images || [],
              updatedAt: new Date(),
            },
          })

          synced++
        } catch (err: any) {
          errors.push(`Product ${qProduct.id}: ${err.message}`)
        }
      }
    } catch (err: any) {
      errors.push(`Page ${page}: ${err.message}`)
      hasMore = false
    }
  }

  return { synced, errors, total }
}

function generateDefaultSizeChart(category: string) {
  const isOversized = category.toLowerCase().includes('oversized')
  const isHoodie = category.toLowerCase().includes('hoodie') || category.toLowerCase().includes('sweatshirt')

  return {
    sizes: [
      {
        size: 'XS',
        chest: isOversized ? 40 : 36,
        length: isHoodie ? 26 : 27,
        shoulder: 16,
        minHeight: 150,
        maxHeight: 160,
        minWeight: 40,
        maxWeight: 55,
      },
      {
        size: 'S',
        chest: isOversized ? 42 : 38,
        length: isHoodie ? 27 : 28,
        shoulder: 17,
        minHeight: 158,
        maxHeight: 168,
        minWeight: 52,
        maxWeight: 65,
      },
      {
        size: 'M',
        chest: isOversized ? 46 : 40,
        length: isHoodie ? 28 : 29,
        shoulder: 18,
        minHeight: 165,
        maxHeight: 175,
        minWeight: 62,
        maxWeight: 75,
      },
      {
        size: 'L',
        chest: isOversized ? 50 : 42,
        length: isHoodie ? 29 : 30,
        shoulder: 19,
        minHeight: 172,
        maxHeight: 182,
        minWeight: 72,
        maxWeight: 88,
      },
      {
        size: 'XL',
        chest: isOversized ? 54 : 44,
        length: isHoodie ? 30 : 31,
        shoulder: 20,
        minHeight: 178,
        maxHeight: 188,
        minWeight: 85,
        maxWeight: 100,
      },
      {
        size: 'XXL',
        chest: isOversized ? 58 : 48,
        length: isHoodie ? 31 : 32,
        shoulder: 21,
        minHeight: 183,
        maxHeight: 195,
        minWeight: 98,
        maxWeight: 120,
      },
    ],
  }
}

export async function submitOrderToQuikink(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { variant: true },
      },
      address: true,
      user: true,
    },
  })

  if (!order) throw new Error('Order not found')

  const quikinkPayload = {
    externalOrderId: order.id,
    customer: {
      name: order.address.name,
      email: order.user.email!,
      phone: order.address.phone,
    },
    shippingAddress: {
      line1: order.address.line1,
      line2: order.address.line2 || undefined,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
      country: order.address.country,
    },
    items: order.items
      .filter((item) => item.variant.quikinkSkuId)
      .map((item) => ({
        skuId: item.variant.quikinkSkuId!,
        quantity: item.quantity,
        price: item.price,
      })),
  }

  try {
    const quikinkResponse = await quikinkClient.createOrder(quikinkPayload)

    await prisma.quikinkOrderTracking.upsert({
      where: { orderId },
      create: {
        orderId,
        quikinkOrderId: quikinkResponse.orderId || quikinkResponse.id,
        status: quikinkResponse.status || 'SUBMITTED',
        rawResponse: quikinkResponse,
      },
      update: {
        quikinkOrderId: quikinkResponse.orderId || quikinkResponse.id,
        status: quikinkResponse.status || 'SUBMITTED',
        rawResponse: quikinkResponse,
        updatedAt: new Date(),
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    })
  } catch (err: any) {
    // Log error but don't fail - manual retry possible
    console.error('[Quikink Order Submit Error]', err)

    await prisma.quikinkOrderTracking.upsert({
      where: { orderId },
      create: {
        orderId,
        status: 'SUBMIT_FAILED',
        rawResponse: { error: err.message },
      },
      update: {
        status: 'SUBMIT_FAILED',
        rawResponse: { error: err.message },
        updatedAt: new Date(),
      },
    })

    throw err
  }
}

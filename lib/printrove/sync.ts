import { prisma } from '@/lib/prisma'
import { printroveClient, PrintroveOrderPayload } from './client'
import { Category } from '@prisma/client'

function mapCategory(category: string): Category {
  const normalized = category.toLowerCase()
  const map: Record<string, Category> = {
    'printed-tshirt': 'PRINTED_TSHIRT',
    'printed_tshirt': 'PRINTED_TSHIRT',
    't-shirt': 'PRINTED_TSHIRT',
    tshirt: 'PRINTED_TSHIRT',
    tee: 'PRINTED_TSHIRT',
    oversized: 'OVERSIZED_TEE',
    'oversized-tee': 'OVERSIZED_TEE',
    hoodie: 'HOODIE',
    sweatshirt: 'SWEATSHIRT',
    cap: 'CAP',
    accessory: 'ACCESSORY',
    accessories: 'ACCESSORY',
  }

  if (normalized.includes('hoodie')) return 'HOODIE'
  if (normalized.includes('sweatshirt')) return 'SWEATSHIRT'
  if (normalized.includes('oversized')) return 'OVERSIZED_TEE'
  if (normalized.includes('cap')) return 'CAP'
  if (normalized.includes('accessor')) return 'ACCESSORY'
  return map[normalized] || 'PRINTED_TSHIRT'
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
  let slug = base || 'printrove-product'
  let counter = 1
  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  return slug
}

function toArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.categories)) return payload.categories
  if (Array.isArray(payload?.products)) return payload.products
  if (Array.isArray(payload?.variants)) return payload.variants
  return []
}

function getId(item: any) {
  return String(item?.id ?? item?.product_id ?? item?.variant_id ?? item?.child_product_id ?? '')
}

function getImages(item: any): string[] {
  const images = item?.images || item?.mockups || item?.image || item?.image_url || item?.thumbnail
  if (Array.isArray(images)) return images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
  return typeof images === 'string' ? [images] : []
}

function parseVariantName(variant: any) {
  const source = `${variant?.sku || variant?.name || variant?.title || ''}`
  const sizeMatch = source.match(/\b(XS|S|M|L|XL|XXL|XXXL)\b/i)
  const color = variant?.color || variant?.colour || variant?.color_name || 'Default'
  return {
    size: String(variant?.size || variant?.size_name || sizeMatch?.[1] || 'One Size').toUpperCase(),
    color: String(color),
  }
}

export async function syncPrintroveProducts(): Promise<{
  synced: number
  errors: string[]
  total: number
}> {
  if ((process.env.PRINTROVE_SYNC_SOURCE || 'product-library') === 'product-library') {
    return syncPrintroveProductLibrary()
  }

  const errors: string[] = []
  let synced = 0
  let total = 0

  const existingProducts = await prisma.product.findMany({
    select: { slug: true, printroveId: true },
  })
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))
  const existingPrintroveIds = new Set(existingProducts.map((p) => p.printroveId).filter(Boolean))

  const configuredCategoryIds = (process.env.PRINTROVE_SYNC_CATEGORY_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  const categories = configuredCategoryIds.length
    ? configuredCategoryIds.map((id) => ({ id, name: id }))
    : toArray(await printroveClient.getCategories())

  for (const category of categories) {
    const categoryId = getId(category)
    if (!categoryId) continue

    try {
      const products = toArray(await printroveClient.getParentProducts(categoryId))
      total += products.length

      for (const product of products) {
        const productId = getId(product)
        const parentSku = product.parent_sku || product.parentSku || product.sku || productId
        if (!productId) continue

        try {
          const variantsResponse = await printroveClient.getProductVariants(categoryId, parentSku)
          const variantsData = toArray(variantsResponse)
          const name = product.name || product.title || `Printrove Product ${productId}`
          const isExisting = existingPrintroveIds.has(productId)
          const slug = isExisting
            ? existingProducts.find((p) => p.printroveId === productId)?.slug || generateSlug(name)
            : generateUniqueSlug(generateSlug(name), existingSlugs)

          if (!isExisting) existingSlugs.add(slug)

          const images = getImages(product)
          await prisma.product.upsert({
            where: { printroveId: productId },
            create: {
              printroveId: productId,
              name,
              slug,
              description: product.description || product.details || '',
              category: mapCategory(product.category || product.category_name || category.name || ''),
              tags: product.tags || ['printrove'],
              basePrice: Number(product.price || product.base_price || product.selling_price || 1000),
              comparePrice: product.compare_price ? Number(product.compare_price) : null,
              images,
              mockupImages: images,
              isActive: true,
              variants: {
                create: variantsData.map((variant: any) => {
                  const parsed = parseVariantName(variant)
                  return {
                    printroveSkuId: getId(variant),
                    size: parsed.size,
                    color: parsed.color,
                    colorHex: variant.color_hex || variant.hex || null,
                    stock: Number(variant.stock || variant.quantity || 100),
                    price: Number(variant.price || variant.selling_price || product.price || 1000),
                    isAvailable: variant.is_available !== false,
                  }
                }),
              },
              sizeChart: { create: { data: generateDefaultSizeChart(product.category || category.name || '') } },
            },
            update: {
              name,
              description: product.description || product.details || '',
              basePrice: Number(product.price || product.base_price || product.selling_price || 1000),
              comparePrice: product.compare_price ? Number(product.compare_price) : null,
              images,
              mockupImages: images,
              updatedAt: new Date(),
            },
          })

          synced++
        } catch (err: any) {
          errors.push(`Product ${productId}: ${err.message}`)
        }
      }
    } catch (err: any) {
      errors.push(`Category ${categoryId}: ${err.message}`)
    }
  }

  return { synced, errors, total }
}

async function syncPrintroveProductLibrary(): Promise<{
  synced: number
  errors: string[]
  total: number
}> {
  const errors: string[] = []
  let synced = 0
  let total = 0
  let page = 1
  let hasMore = true

  const existingProducts = await prisma.product.findMany({
    select: { slug: true, printroveId: true },
  })
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))
  const existingPrintroveIds = new Set(existingProducts.map((p) => p.printroveId).filter(Boolean))

  while (hasMore) {
    try {
      const response = await printroveClient.listProducts({
        page: String(page),
        per_page: process.env.PRINTROVE_SYNC_PER_PAGE || '50',
      })
      const products = toArray(response)
      total += products.length
      hasMore = products.length > 0 && Boolean(response?.next_page_url || response?.links?.next || response?.meta?.next_page)

      for (const product of products) {
        const productId = getId(product)
        if (!productId) continue

        try {
          const detail = await printroveClient.getLibraryProduct(productId).catch(() => product)
          const source = detail?.data || detail?.product || detail
          const variantsData = toArray(source?.variants || source?.product_variants || source?.skus || source)
          const name = source.name || source.title || product.name || product.title || `Printrove Product ${productId}`
          const isExisting = existingPrintroveIds.has(productId)
          const slug = isExisting
            ? existingProducts.find((p) => p.printroveId === productId)?.slug || generateSlug(name)
            : generateUniqueSlug(generateSlug(name), existingSlugs)

          if (!isExisting) existingSlugs.add(slug)

          const images = getImages(source).length ? getImages(source) : getImages(product)

          await prisma.product.upsert({
            where: { printroveId: productId },
            create: {
              printroveId: productId,
              name,
              slug,
              description: source.description || source.details || '',
              category: mapCategory(source.category || source.category_name || ''),
              tags: source.tags || ['printrove'],
              basePrice: Number(source.price || source.selling_price || source.retail_price || 1000),
              comparePrice: source.compare_price ? Number(source.compare_price) : null,
              images,
              mockupImages: images,
              isActive: true,
              variants: {
                create: variantsData.map((variant: any) => {
                  const parsed = parseVariantName(variant)
                  return {
                    printroveSkuId: getId(variant),
                    size: parsed.size,
                    color: parsed.color,
                    colorHex: variant.color_hex || variant.hex || null,
                    stock: Number(variant.stock || variant.quantity || 100),
                    price: Number(variant.price || variant.selling_price || variant.retail_price || source.price || 1000),
                    isAvailable: variant.is_available !== false,
                  }
                }),
              },
              sizeChart: { create: { data: generateDefaultSizeChart(source.category || source.category_name || '') } },
            },
            update: {
              name,
              description: source.description || source.details || '',
              basePrice: Number(source.price || source.selling_price || source.retail_price || 1000),
              comparePrice: source.compare_price ? Number(source.compare_price) : null,
              images,
              mockupImages: images,
              updatedAt: new Date(),
            },
          })

          synced++
        } catch (err: any) {
          errors.push(`Product Library ${productId}: ${err.message}`)
        }
      }

      page++
    } catch (err: any) {
      errors.push(`Product Library page ${page}: ${err.message}`)
      hasMore = false
    }
  }

  return { synced, errors, total }
}

function generateDefaultSizeChart(category: string) {
  const normalized = category.toLowerCase()
  const isOversized = normalized.includes('oversized')
  const isHoodie = normalized.includes('hoodie') || normalized.includes('sweatshirt')

  return {
    sizes: [
      { size: 'XS', chest: isOversized ? 40 : 36, length: isHoodie ? 26 : 27, shoulder: 16, minHeight: 150, maxHeight: 160, minWeight: 40, maxWeight: 55 },
      { size: 'S', chest: isOversized ? 42 : 38, length: isHoodie ? 27 : 28, shoulder: 17, minHeight: 158, maxHeight: 168, minWeight: 52, maxWeight: 65 },
      { size: 'M', chest: isOversized ? 46 : 40, length: isHoodie ? 28 : 29, shoulder: 18, minHeight: 165, maxHeight: 175, minWeight: 62, maxWeight: 75 },
      { size: 'L', chest: isOversized ? 50 : 42, length: isHoodie ? 29 : 30, shoulder: 19, minHeight: 172, maxHeight: 182, minWeight: 72, maxWeight: 88 },
      { size: 'XL', chest: isOversized ? 54 : 44, length: isHoodie ? 30 : 31, shoulder: 20, minHeight: 178, maxHeight: 188, minWeight: 85, maxWeight: 100 },
      { size: 'XXL', chest: isOversized ? 58 : 48, length: isHoodie ? 31 : 32, shoulder: 21, minHeight: 183, maxHeight: 195, minWeight: 98, maxWeight: 120 },
    ],
  }
}

function printroveDesign() {
  const frontId = process.env.PRINTROVE_DEFAULT_FRONT_DESIGN_ID
  const backId = process.env.PRINTROVE_DEFAULT_BACK_DESIGN_ID
  const dimensions = {
    width: Number(process.env.PRINTROVE_DESIGN_WIDTH || 3000),
    height: Number(process.env.PRINTROVE_DESIGN_HEIGHT || 3000),
    top: Number(process.env.PRINTROVE_DESIGN_TOP || 10),
    left: Number(process.env.PRINTROVE_DESIGN_LEFT || 50),
  }

  return {
    ...(frontId ? { front: { id: Number(frontId), dimensions } } : {}),
    ...(backId ? { back: { id: Number(backId), dimensions } } : {}),
  }
}

function printroveOrderId(response: any) {
  return String(response?.id || response?.order_id || response?.data?.id || response?.data?.order_id || '')
}

export async function submitOrderToPrintrove(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { variant: true, product: true } },
      address: true,
      user: true,
    },
  })

  if (!order) throw new Error('Order not found')

  const orderProducts = order.items
    .filter((item) => item.variant.printroveSkuId || item.product.printroveId)
    .map((item) => ({
      ...(item.variant.printroveSkuId ? { variant_id: Number(item.variant.printroveSkuId) } : {}),
      ...(!item.variant.printroveSkuId && item.product.printroveId
        ? { product_id: Number(item.product.printroveId), design: printroveDesign() }
        : {}),
      quantity: item.quantity,
    }))

  if (!orderProducts.length) {
    throw new Error('No Printrove product or variant IDs found for this order')
  }

  const payload: PrintroveOrderPayload = {
    reference_number: order.id,
    retail_price: order.total,
    customer: {
      name: order.address.name,
      email: order.user.email || undefined,
      number: order.address.phone.replace(/\D/g, '').slice(-10),
      address1: order.address.line1,
      address2: order.address.line2 || order.address.city,
      pincode: order.address.pincode,
      state: order.address.state,
      city: order.address.city,
      country: order.address.country || 'India',
    },
    order_products: orderProducts,
    ...(process.env.PRINTROVE_DEFAULT_COURIER_ID
      ? { courier_id: Number(process.env.PRINTROVE_DEFAULT_COURIER_ID) }
      : {}),
    cod: process.env.PRINTROVE_COD === 'true',
  }

  try {
    const response = await printroveClient.createOrder(payload)
    const providerOrderId = printroveOrderId(response)

    await prisma.printroveOrderTracking.upsert({
      where: { orderId },
      create: {
        orderId,
        printroveOrderId: providerOrderId || null,
        status: response.status || response?.data?.status || 'SUBMITTED',
        rawResponse: response,
      },
      update: {
        printroveOrderId: providerOrderId || null,
        status: response.status || response?.data?.status || 'SUBMITTED',
        rawResponse: response,
        updatedAt: new Date(),
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    })
  } catch (err: any) {
    console.error('[Printrove Order Submit Error]', err)

    await prisma.printroveOrderTracking.upsert({
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

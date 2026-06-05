// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SAMPLE_PRODUCTS = [
  {
    name: 'Scene Kya Hai Tee',
    slug: 'scene-kya-hai-tee',
    description: "The official uniform of people who always know what's happening.",
    category: 'PRINTED_TSHIRT' as const,
    tags: ['scene kya hai', 'indian internet', 'desi culture', 'heavyweight'],
    basePrice: 1199,
    comparePrice: 1499,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Desi Lore Oversized Tee',
    slug: 'desi-lore-oversized-tee',
    description: "Some things don't need explanation.",
    category: 'OVERSIZED_TEE' as const,
    tags: ['desi lore', 'oversized', 'drop-shoulder', 'streetwear'],
    basePrice: 1399,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Bollywood Brainrot Hoodie',
    slug: 'bollywood-brainrot-hoodie',
    description: 'For people whose internal monologue has background music.',
    category: 'HOODIE' as const,
    tags: ['bollywood brainrot', 'hoodie', 'heavyweight', 'cinema'],
    basePrice: 1899,
    comparePrice: 2199,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Setting Ho Jayega Cap',
    slug: 'setting-ho-jayega-cap',
    description: "If there's a way, we'll find it.",
    category: 'CAP' as const,
    tags: ['setting ho jayega', 'jugaad', 'cap', 'accessories'],
    basePrice: 999,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Aukaat Pending Crewneck',
    slug: 'aukaat-pending-crewneck',
    description: 'Rich in potential. Financially loading.',
    category: 'SWEATSHIRT' as const,
    tags: ['aukaat pending', 'luxury loading', 'crewneck', 'sweatshirt'],
    basePrice: 1599,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'],
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Kalesh Loading Tee',
    slug: 'kalesh-loading-tee',
    description: 'Modern Indian internet behaviour, printed on heavyweight cotton.',
    category: 'PRINTED_TSHIRT' as const,
    tags: ['kalesh', 'scene kya hai', 'printed tee', 'indian internet'],
    basePrice: 1099,
    comparePrice: 1299,
    images: ['https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80'],
    mockupImages: ['https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80'],
    isFeatured: false,
    isTrending: true,
  },
]

const COLORS = [
  { color: 'Black', colorHex: '#0A0A0A' },
  { color: 'White', colorHex: '#F5F0E8' },
  { color: 'Olive', colorHex: '#6B7048' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin@InkTheory123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@inktheory.in' },
    update: {},
    create: {
      name: 'InkTheory Admin',
      email: 'admin@inktheory.in',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create sample products
  for (const product of SAMPLE_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } })
    if (existing) continue

    const variantsData = COLORS.flatMap((c) =>
      SIZES.map((size) => ({
        size,
        color: c.color,
        colorHex: c.colorHex,
        stock: Math.floor(Math.random() * 50) + 10,
        price: product.basePrice + (size === 'XL' || size === 'XXL' ? 100 : 0),
        isAvailable: true,
      }))
    )

    await prisma.product.create({
      data: {
        ...product,
        isActive: true,
        variants: { create: variantsData },
        sizeChart: {
          create: {
            data: {
              sizes: [
                { size: 'XS', chest: 36, length: 27, shoulder: 16, minHeight: 150, maxHeight: 160, minWeight: 40, maxWeight: 55 },
                { size: 'S', chest: 38, length: 28, shoulder: 17, minHeight: 158, maxHeight: 168, minWeight: 52, maxWeight: 65 },
                { size: 'M', chest: 40, length: 29, shoulder: 18, minHeight: 165, maxHeight: 175, minWeight: 62, maxWeight: 75 },
                { size: 'L', chest: 42, length: 30, shoulder: 19, minHeight: 172, maxHeight: 182, minWeight: 72, maxWeight: 88 },
                { size: 'XL', chest: 44, length: 31, shoulder: 20, minHeight: 178, maxHeight: 188, minWeight: 85, maxWeight: 100 },
                { size: 'XXL', chest: 48, length: 32, shoulder: 21, minHeight: 183, maxHeight: 195, minWeight: 98, maxWeight: 120 },
              ],
            },
          },
        },
      },
    })
    console.log(`✅ Created: ${product.name}`)
  }

  // Sample coupons
  await prisma.coupon.upsert({
    where: { code: 'InkTheory10' },
    update: {},
    create: { code: 'InkTheory10', type: 'PERCENTAGE', value: 10, minOrderValue: 1000, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: 'FIRST200' },
    update: {},
    create: { code: 'FIRST200', type: 'FIXED', value: 200, minOrderValue: 1500, isActive: true, maxUses: 100 },
  })

  console.log('✅ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

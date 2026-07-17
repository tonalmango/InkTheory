// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      products: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      warning: 'DATABASE_URL is not configured',
    })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') as Category | null
  const search = searchParams.get('q')
  const normalizedSearch = search?.toLowerCase()
  const dashedSearch = normalizedSearch?.replace(/\s+/g, '-')
  const tags = searchParams.get('tags')?.split(',').filter(Boolean)
  const minPrice = Number(searchParams.get('minPrice')) || 0
  const maxPrice = Number(searchParams.get('maxPrice')) || 99999
  const featured = searchParams.get('featured') === 'true'
  const trending = searchParams.get('trending') === 'true'
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 12

  const where: any = {
    isActive: true,
    basePrice: { gte: minPrice, lte: maxPrice },
    ...(category && { category }),
    ...(featured && { isFeatured: true }),
    ...(trending && { isTrending: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search, normalizedSearch, dashedSearch].filter(Boolean) as string[] } },
      ],
    }),
    ...(tags?.length && { tags: { hasSome: tags } }),
  }

  const orderBy: any =
    sort === 'price_asc'
      ? { basePrice: 'asc' }
      : sort === 'price_desc'
      ? { basePrice: 'desc' }
      : sort === 'popular'
      ? { isFeatured: 'desc' }
      : { createdAt: 'desc' }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: { where: { isAvailable: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[Products API Error]', error)
    return NextResponse.json(
      { products: [], pagination: { page, limit, total: 0, pages: 0 }, error: 'Unable to load products' },
      { status: 500 }
    )
  }
}

// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ products: [] })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: [q.toLowerCase()] } },
          { category: { equals: q.toUpperCase() as any } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        basePrice: true,
        category: true,
      },
      take: 8,
      orderBy: { isFeatured: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('[Search API Error]', error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}

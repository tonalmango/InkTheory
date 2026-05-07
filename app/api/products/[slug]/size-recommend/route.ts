// app/api/products/[slug]/size-recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recommendSize } from '@/lib/ai/sizeRecommender'
import { z } from 'zod'

const schema = z.object({
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(20).max(200),
  fitPreference: z.enum(['slim', 'regular', 'oversized']).optional(),
})

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { sizeChart: true },
  })

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const sizeChart = (product.sizeChart?.data as any)?.sizes || []
  const result = recommendSize(parsed.data, sizeChart)

  return NextResponse.json({ result })
}

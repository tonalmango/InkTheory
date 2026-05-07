// app/api/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRelatedProducts, getTrendingProducts, getCustomersAlsoBought } from '@/lib/ai/productRecommender'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'trending'
  const productId = searchParams.get('productId') || ''
  const limit = Number(searchParams.get('limit')) || 4

  let products

  switch (type) {
    case 'related':
      products = productId ? await getRelatedProducts(productId, limit) : []
      break
    case 'also_bought':
      products = productId ? await getCustomersAlsoBought(productId, limit) : []
      break
    case 'trending':
    default:
      products = await getTrendingProducts(limit)
  }

  return NextResponse.json({ products })
}

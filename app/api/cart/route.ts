// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ items: [] })

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: { select: { id: true, name: true, images: true, slug: true } },
      variant: true,
    },
  })

  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, variantId, quantity = 1 } = await req.json()

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  })
  if (!variant || !variant.isAvailable) {
    return NextResponse.json({ error: 'Variant unavailable' }, { status: 400 })
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_variantId: { userId: session.user.id, variantId } },
    create: { userId: session.user.id, productId, variantId, quantity },
    update: { quantity: { increment: quantity } },
    include: {
      product: { select: { id: true, name: true, images: true, slug: true } },
      variant: true,
    },
  })

  return NextResponse.json({ item })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { variantId } = await req.json()

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, variantId },
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { variantId, quantity } = await req.json()

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, variantId },
    })
    return NextResponse.json({ success: true })
  }

  const item = await prisma.cartItem.update({
    where: { userId_variantId: { userId: session.user.id, variantId } },
    data: { quantity: Math.min(quantity, 10) },
    include: {
      product: { select: { id: true, name: true, images: true, slug: true } },
      variant: true,
    },
  })

  return NextResponse.json({ item })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { applyCoupon, calculateShipping, calculateTax } from '@/lib/utils'
import { createPayPalOrder } from '@/lib/payments/paypal'

const orderSchema = z.object({
  addressId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().min(1).max(10),
    })
  ),
  couponCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { addressId, items, couponCode } = parsed.data

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  })
  if (!address) return NextResponse.json({ error: 'Invalid address' }, { status: 400 })

  const variantIds = items.map((i) => i.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { select: { name: true, images: true, id: true } } },
  })

  if (variants.length !== items.length) {
    return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
  }

  let subtotal = 0
  const orderItems = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!
    const lineTotal = variant.price * item.quantity
    subtotal += lineTotal

    return {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: variant.price,
      name: variant.product.name,
      image: variant.product.images[0] || '',
      size: variant.size,
      color: variant.color,
    }
  })

  let discount = 0
  let couponId: string | undefined

  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          { OR: [{ maxUses: null }, { usedCount: { lt: prisma.coupon.fields.maxUses } }] },
        ],
      },
    })

    if (coupon) {
      discount = applyCoupon(subtotal, coupon)
      couponId = coupon.id
    }
  }

  const shipping = calculateShipping(subtotal - discount)
  const taxableAmount = subtotal - discount
  const tax = calculateTax(taxableAmount)
  const total = taxableAmount + shipping + tax

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponId,
      paymentMethod: 'paypal',
      items: { create: orderItems },
    },
  })

  try {
    const paypalOrder = await createPayPalOrder({ orderId: order.id, total })

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalOrderId: paypalOrder.id },
    })

    return NextResponse.json({
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      currency: process.env.PAYPAL_CURRENCY || 'INR',
    })
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'FAILED' },
    })

    throw error
  }
}

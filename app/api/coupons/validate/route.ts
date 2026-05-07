// app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { applyCoupon } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, subtotal } = await req.json()

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  })

  if (!coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid or expired coupon' })
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' })
  }

  if (subtotal < coupon.minOrderValue) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order value ₹${coupon.minOrderValue} required`,
    })
  }

  const discount = applyCoupon(subtotal, coupon)

  return NextResponse.json({
    valid: true,
    discount,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
  })
}

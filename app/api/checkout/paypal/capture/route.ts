import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/payments/paypal'
import { submitOrderToQuikink } from '@/lib/quikink/sync'
import { sendOrderConfirmationEmail } from '@/lib/email/mailer'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { paypalOrderId, orderId } = await req.json()
  if (!paypalOrderId || !orderId) {
    return NextResponse.json({ error: 'Missing PayPal order details' }, { status: 400 })
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
      paypalOrderId,
    },
    include: {
      user: true,
      items: true,
      address: true,
    },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  try {
    const capture = await capturePayPalOrder(paypalOrderId)
    const captureId =
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
      capture.id ||
      paypalOrderId

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paypalCaptureId: captureId,
      },
    })

    if (order.couponId) {
      await prisma.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      })
    }

    submitOrderToQuikink(orderId).catch((err) => {
      console.error('[Quikink Submit Error]', err)
    })

    if (order.user.email) {
      sendOrderConfirmationEmail(order as any, order.user.email).catch(console.error)
    }

    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'FAILED' },
    })

    throw error
  }
}

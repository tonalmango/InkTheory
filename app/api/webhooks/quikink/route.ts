// app/api/webhooks/quikink/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendShippingEmail } from '@/lib/email/mailer'

function verifyQuikinkSignature(payload: string, signature: string): boolean {
  const secret = process.env.QUIKINK_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-quikink-signature') || ''

  // Verify webhook signature
  if (process.env.QUIKINK_WEBHOOK_SECRET && !verifyQuikinkSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event, data } = payload
  const quikinkOrderId = data?.orderId || data?.id

  if (!quikinkOrderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
  }

  try {
    const tracking = await prisma.quikinkOrderTracking.findUnique({
      where: { quikinkOrderId },
      include: {
        order: {
          include: { user: true },
        },
      },
    })

    if (!tracking) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Append webhook payload to history
    const updatedPayloads = [...(tracking.webhookPayloads as any[]), { event, data, receivedAt: new Date() }]

    // Map Quikink status to our OrderStatus
    const statusMap: Record<string, string> = {
      'order.accepted': 'CONFIRMED',
      'order.processing': 'PROCESSING',
      'order.shipped': 'SHIPPED',
      'order.delivered': 'DELIVERED',
      'order.cancelled': 'CANCELLED',
    }

    const newOrderStatus = statusMap[event]

    // Update tracking record
    await prisma.quikinkOrderTracking.update({
      where: { quikinkOrderId },
      data: {
        status: data.status || tracking.status,
        trackingNumber: data.trackingNumber || tracking.trackingNumber,
        trackingUrl: data.trackingUrl || tracking.trackingUrl,
        carrier: data.carrier || tracking.carrier,
        webhookPayloads: updatedPayloads,
        updatedAt: new Date(),
      },
    })

    // Update main order status
    if (newOrderStatus) {
      await prisma.order.update({
        where: { id: tracking.orderId },
        data: { status: newOrderStatus as any },
      })
    }

    // Send shipping email
    if (event === 'order.shipped' && data.trackingNumber && tracking.order.user.email) {
      await sendShippingEmail(
        tracking.order.user.email,
        tracking.orderId.slice(-8).toUpperCase(),
        data.trackingNumber,
        data.trackingUrl || '#',
        data.carrier || 'Partner Courier'
      )
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Quikink Webhook Error]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

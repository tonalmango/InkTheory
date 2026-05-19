// app/api/webhooks/printrove/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendShippingEmail } from '@/lib/email/mailer'

function verifyPrintroveSignature(payload: string, signature: string): boolean {
  const secret = process.env.PRINTROVE_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-printrove-signature') || ''

  // Verify webhook signature
  if (process.env.PRINTROVE_WEBHOOK_SECRET && !verifyPrintroveSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event, data = payload } = payload
  const printroveOrderId = String(data?.order_id || data?.orderId || data?.id || '')

  if (!printroveOrderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
  }

  try {
    const tracking = await prisma.printroveOrderTracking.findUnique({
      where: { printroveOrderId },
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

    // Map Printrove status to our OrderStatus
    const statusMap: Record<string, string> = {
      'order.accepted': 'CONFIRMED',
      'order.confirmed': 'CONFIRMED',
      'order.processing': 'PROCESSING',
      'order.shipped': 'SHIPPED',
      'order.delivered': 'DELIVERED',
      'order.cancelled': 'CANCELLED',
      confirmed: 'CONFIRMED',
      processing: 'PROCESSING',
      shipped: 'SHIPPED',
      delivered: 'DELIVERED',
      cancelled: 'CANCELLED',
    }

    const eventName = event || String(data.status || '').toLowerCase()
    const newOrderStatus = statusMap[eventName]
    const trackingNumber = data.tracking_number || data.trackingNumber

    // Update tracking record
    await prisma.printroveOrderTracking.update({
      where: { printroveOrderId },
      data: {
        status: data.status || eventName || tracking.status,
        trackingNumber: trackingNumber || tracking.trackingNumber,
        trackingUrl: data.tracking_url || data.trackingUrl || tracking.trackingUrl,
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
    if (newOrderStatus === 'SHIPPED' && trackingNumber && tracking.order.user.email) {
      await sendShippingEmail(
        tracking.order.user.email,
        tracking.orderId.slice(-8).toUpperCase(),
        trackingNumber,
        data.tracking_url || data.trackingUrl || '#',
        data.carrier || 'Partner Courier'
      )
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Printrove Webhook Error]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

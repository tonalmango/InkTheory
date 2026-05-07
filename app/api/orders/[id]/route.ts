// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findFirst({
    where: {
      id: params.id,
      // Admin can see all orders, user only their own
      ...(session.user.role !== 'ADMIN' ? { userId: session.user.id } : {}),
    },
    include: {
      items: true,
      address: true,
      quikink: true,
      coupon: { select: { code: true, type: true, value: true } },
      user: { select: { name: true, email: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  return NextResponse.json({ order })
}

// Cancel order
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, reason } = await req.json()

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  if (action === 'cancel') {
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    // Try to cancel in Quikink if submitted
    if (order.id) {
      const tracking = await prisma.quikinkOrderTracking.findUnique({
        where: { orderId: order.id },
      })
      if (tracking?.quikinkOrderId) {
        const { quikinkClient } = await import('@/lib/quikink/client')
        quikinkClient.cancelOrder(tracking.quikinkOrderId, reason || 'Customer request').catch(console.error)
      }
    }

    return NextResponse.json({ order: updated })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

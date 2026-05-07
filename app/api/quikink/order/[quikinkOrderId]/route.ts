// app/api/quikink/order/[quikinkOrderId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { quikinkClient } from '@/lib/quikink/client'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { quikinkOrderId: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const status = await quikinkClient.getOrderStatus(params.quikinkOrderId)

    // Sync latest status to DB
    await prisma.quikinkOrderTracking.update({
      where: { quikinkOrderId: params.quikinkOrderId },
      data: {
        status: status.status,
        trackingNumber: status.trackingNumber || undefined,
        trackingUrl: status.trackingUrl || undefined,
        carrier: status.carrier || undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

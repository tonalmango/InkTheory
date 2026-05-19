// app/api/printrove/order/[printroveOrderId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { printroveClient } from '@/lib/printrove/client'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { printroveOrderId: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const status = await printroveClient.getOrderStatus(params.printroveOrderId)

    // Sync latest status to DB
    await prisma.printroveOrderTracking.update({
      where: { printroveOrderId: params.printroveOrderId },
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

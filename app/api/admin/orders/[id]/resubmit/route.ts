// app/api/admin/orders/[id]/resubmit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { submitOrderToPrintrove } from '@/lib/printrove/sync'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await submitOrderToPrintrove(params.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

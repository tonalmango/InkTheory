// app/api/admin/orders/[id]/resubmit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { submitOrderToQuikink } from '@/lib/quikink/sync'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await submitOrderToQuikink(params.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

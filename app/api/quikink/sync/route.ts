// app/api/quikink/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { syncQuikinkProducts } from '@/lib/quikink/sync'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  // Only allow admin
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncQuikinkProducts()
    return NextResponse.json({
      success: true,
      message: `Synced ${result.synced} of ${result.total} products`,
      ...result,
    })
  } catch (err: any) {
    console.error('[Quikink Sync Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

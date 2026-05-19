// app/api/printrove/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { syncPrintroveProducts } from '@/lib/printrove/sync'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  // Only allow admin
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncPrintroveProducts()
    return NextResponse.json({
      success: true,
      message: `Synced ${result.synced} of ${result.total} products`,
      ...result,
    })
  } catch (err: any) {
    console.error('[Printrove Sync Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// app/api/addresses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const address = await prisma.address.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 })

  // Check if any pending orders use this address
  const orderCount = await prisma.order.count({
    where: { addressId: params.id, status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } },
  })

  if (orderCount > 0) {
    return NextResponse.json(
      { error: 'Cannot delete address linked to active orders' },
      { status: 400 }
    )
  }

  await prisma.address.delete({ where: { id: params.id } })

  // If deleted was default, make oldest remaining the default
  if (address.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { id: 'asc' },
    })
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } })
    }
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { isDefault } = await req.json()

  const address = await prisma.address.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!address) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    })
  }

  const updated = await prisma.address.update({
    where: { id: params.id },
    data: { isDefault },
  })

  return NextResponse.json({ address: updated })
}

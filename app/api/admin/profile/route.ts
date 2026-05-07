import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().transform((value) => value.toLowerCase()),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = profileSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid profile details' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })

  const data: { name: string; email: string; password?: string } = {
    name: parsed.data.name,
    email: parsed.data.email,
  }

  if (parsed.data.newPassword) {
    if (!parsed.data.currentPassword || !user.password) {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
    }

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

    if (parsed.data.newPassword.length < 10) {
      return NextResponse.json({ error: 'New password must be at least 10 characters' }, { status: 400 })
    }

    data.password = await bcrypt.hash(parsed.data.newPassword, 12)
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  })

  return NextResponse.json({ ok: true })
}

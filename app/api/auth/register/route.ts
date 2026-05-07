// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getRequestIp, rateLimit } from '@/lib/security/rateLimit'

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[0-9]/, 'Password must include a number'),
  company: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  const limited = rateLimit(`register:${getRequestIp(req)}`, 5, 60 * 60 * 1000)
  if (!limited.success) {
    return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password, company } = parsed.data
  if (company) return NextResponse.json({ user: null }, { status: 201 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}

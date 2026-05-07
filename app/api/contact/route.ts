import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { getRequestIp, rateLimit } from '@/lib/security/rateLimit'

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
  company: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)
  const limited = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
  if (!limited.success) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
  }

  const parsed = contactSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 })
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, RESEND_API_KEY } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    if (!RESEND_API_KEY || !EMAIL_FROM) {
      return NextResponse.json(
        { error: 'Contact email is not configured yet. Add Resend or SMTP credentials to enable this form.' },
        { status: 503 }
      )
    }

    let response: Response
    try {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [process.env.CONTACT_TO_EMAIL || 'support@inktheory.in'],
          reply_to: parsed.data.email,
          subject: `[InkTheory Contact] ${parsed.data.subject}`,
          text: [
            `Name: ${parsed.data.name}`,
            `Email: ${parsed.data.email}`,
            `Subject: ${parsed.data.subject}`,
            '',
            parsed.data.message,
          ].join('\n'),
        }),
      })
    } catch (error) {
      console.error('[Resend Contact Error]', error)
      return NextResponse.json(
        { error: 'Email provider is unavailable from this environment. Please try again later.' },
        { status: 502 }
      )
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.message || 'Resend could not send the message.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: process.env.CONTACT_TO_EMAIL || SMTP_USER,
    replyTo: parsed.data.email,
    subject: `[InkTheory Contact] ${parsed.data.subject}`,
    text: [
      `Name: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      `Subject: ${parsed.data.subject}`,
      '',
      parsed.data.message,
    ].join('\n'),
  })

  return NextResponse.json({ ok: true })
}

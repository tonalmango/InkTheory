import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTransactionalEmail } from '@/lib/email/mailer'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: hashedToken,
        expires: expiresAt,
      },
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`
    const resetLink = `<a href="${resetUrl}" style="background-color: #000; color: #f5f0e8; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>`

    await sendTransactionalEmail({
      to: user.email!,
      subject: 'Password Reset Request - InkTheory',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p style="margin: 30px 0;">
            ${resetLink}
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">© InkTheory. All rights reserved.</p>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Forgot Password Error]', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

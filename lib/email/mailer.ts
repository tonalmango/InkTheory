// lib/email/mailer.ts
import nodemailer from 'nodemailer'
import { Order } from '@/types'

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendTransactionalEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Resend email failed')
    }
    return
  }

  const transporter = createTransporter()
  if (!transporter) throw new Error('Email provider is not configured')

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
}

export async function sendOrderConfirmationEmail(order: Order, userEmail: string) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #EDE8DC;">
        <img src="${item.image}" width="60" style="border-radius:4px;vertical-align:middle;margin-right:12px;" />
        ${item.name} (${item.size} / ${item.color})
      </td>
      <td style="padding:12px;border-bottom:1px solid #EDE8DC;text-align:center;">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #EDE8DC;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Order Confirmation</title></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#0A0A0A;padding:32px 40px;text-align:center;">
      <h1 style="color:#F5F0E8;font-size:28px;letter-spacing:4px;margin:0;">InkTheory</h1>
      <p style="color:#C8A951;font-size:13px;letter-spacing:2px;margin:8px 0 0;">PREMIUM STREETWEAR</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="color:#0A0A0A;font-size:22px;margin:0 0 8px;">Order Confirmed ✓</h2>
      <p style="color:#6B6B6B;margin:0 0 24px;">
        Thank you! Your order <strong style="color:#0A0A0A;">#${order.id.slice(-8).toUpperCase()}</strong> 
        has been received and is being processed.
      </p>

      <!-- Items Table -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#F5F0E8;">
            <th style="padding:12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Item</th>
            <th style="padding:12px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
            <th style="padding:12px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Order Summary -->
      <div style="background:#F5F0E8;border-radius:8px;padding:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#6B6B6B;">Subtotal</span>
          <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${order.discount > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#6B6B6B;">Discount</span>
          <span style="color:#22c55e;">-₹${order.discount.toLocaleString('en-IN')}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#6B6B6B;">Shipping</span>
          <span>${order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
        </div>
        <hr style="border:none;border-top:1px solid #EDE8DC;margin:12px 0;" />
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:18px;">
          <span>Total</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="margin-top:24px;">
        <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6B6B6B;margin:0 0 8px;">Shipping To</h3>
        <p style="margin:0;color:#0A0A0A;line-height:1.6;">
          ${order.address.name}<br/>
          ${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}<br/>
          ${order.address.city}, ${order.address.state} ${order.address.pincode}
        </p>
      </div>

      <div style="margin-top:32px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" 
           style="background:#0A0A0A;color:#F5F0E8;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:14px;letter-spacing:1px;display:inline-block;">
          TRACK YOUR ORDER
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F5F0E8;padding:24px 40px;text-align:center;">
      <p style="color:#6B6B6B;font-size:12px;margin:0;">
        Questions? Email us at <a href="mailto:support@inktheory.in" style="color:#C8A951;">support@inktheory.in</a>
      </p>
      <p style="color:#A8A8A8;font-size:11px;margin:8px 0 0;">
        © 2024 InkTheory. Premium Streetwear.
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    await sendTransactionalEmail({
      to: userEmail,
      subject: `Order Confirmed #${order.id.slice(-8).toUpperCase()} - InkTheory`,
      html,
    })
  } catch (err) {
    console.error('[Email Error]', err)
    // Don't throw — email failure shouldn't fail the order
  }
}

export async function sendShippingEmail(
  userEmail: string,
  orderRef: string,
  trackingNumber: string,
  trackingUrl: string,
  carrier: string
) {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#0A0A0A;padding:32px 40px;text-align:center;">
      <h1 style="color:#F5F0E8;font-size:28px;letter-spacing:4px;margin:0;">InkTheory</h1>
    </div>
    <div style="padding:40px;text-align:center;">
      <h2 style="color:#0A0A0A;font-size:24px;">Your order is on its way! 📦</h2>
      <p style="color:#6B6B6B;">Order <strong>#${orderRef}</strong> has been shipped via ${carrier}.</p>
      <p style="font-size:20px;font-weight:700;letter-spacing:2px;color:#0A0A0A;">${trackingNumber}</p>
      <a href="${trackingUrl}" style="background:#C8A951;color:#0A0A0A;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block;margin-top:16px;">
        TRACK PACKAGE
      </a>
    </div>
  </div>
</body>
</html>`

  try {
    await sendTransactionalEmail({
      to: userEmail,
      subject: 'Your InkTheory order is shipped',
      html,
    })
  } catch (err) {
    console.error('[Shipping Email Error]', err)
  }
}

// app/account/orders/[id]/page.tsx
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '@/lib/utils'
import { Package, MapPin, CheckCircle2 } from 'lucide-react'

export default async function OrderDetailPage({
  params, searchParams,
}: {
  params: { id: string }
  searchParams: { success?: string }
}) {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      items: true,
      address: true,
      printrove: true,
      coupon: true,
    },
  })

  if (!order) notFound()

  const isSuccess = searchParams.success === 'true'

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStep = steps.indexOf(order.status)

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Success banner */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 p-4 mb-8 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Order placed successfully!</p>
              <p className="text-xs text-green-600 mt-0.5">
                You'll receive a confirmation email shortly. Your order is being submitted to our fulfillment partner.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-1">Order Details</p>
            <h1 className="display-heading text-2xl md:text-3xl">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-smoke text-sm mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-block px-4 py-2 text-sm font-mono rounded-sm ${orderStatusColor(order.status)}`}>
            {orderStatusLabel(order.status)}
          </span>
        </div>

        {/* Order progress */}
        {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
          <div className="mb-8 p-5 border border-ink/10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-3 h-px bg-ink/10" />
              <div className="absolute left-0 top-3 h-px bg-accent transition-all"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
              {steps.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2">
                  <div className={`w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center ${
                    i <= currentStep ? 'bg-accent border-accent' : 'bg-cream border-ink/20'
                  }`}>
                    {i < currentStep && <span className="text-ink text-[10px]">✓</span>}
                    {i === currentStep && <span className="w-2 h-2 bg-ink rounded-full" />}
                  </div>
                  <span className="text-[9px] font-mono text-smoke tracking-widest uppercase text-center w-14">
                    {step.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-mono text-sm tracking-[3px] uppercase">Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-ink/10 p-4">
                <div className="w-16 h-20 bg-cream-dark flex-shrink-0 overflow-hidden">
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={64} height={80}
                      className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-smoke font-mono mt-0.5">{item.size} · {item.color}</p>
                  <p className="text-xs text-smoke mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="space-y-5">
            {/* Price breakdown */}
            <div className="border border-ink/10 p-4 space-y-2 text-sm">
              <h2 className="font-mono text-xs tracking-[3px] uppercase mb-3">Payment</h2>
              <div className="flex justify-between text-smoke">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-smoke">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-smoke">
                <span>Tax</span><span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-ink/10 pt-2">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
              <p className="text-xs text-smoke mt-2 font-mono">
                {order.paymentStatus === 'PAID' ? '✓ Payment received' : order.paymentStatus}
              </p>
            </div>

            {/* Delivery address */}
            <div className="border border-ink/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-accent" />
                <h2 className="font-mono text-xs tracking-[3px] uppercase">Delivery Address</h2>
              </div>
              <p className="text-sm">{order.address.name}</p>
              <p className="text-sm text-smoke">{order.address.phone}</p>
              <p className="text-sm text-smoke mt-1">{order.address.line1}</p>
              {order.address.line2 && <p className="text-sm text-smoke">{order.address.line2}</p>}
              <p className="text-sm text-smoke">{order.address.city}, {order.address.state} {order.address.pincode}</p>
            </div>

            {/* Tracking */}
            {order.printrove?.trackingNumber && (
              <div className="border border-ink/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={14} className="text-accent" />
                  <h2 className="font-mono text-xs tracking-[3px] uppercase">Tracking</h2>
                </div>
                <p className="text-sm font-mono text-ink">{order.printrove.trackingNumber}</p>
                {order.printrove.carrier && <p className="text-xs text-smoke mt-1">{order.printrove.carrier}</p>}
                {order.printrove.trackingUrl && (
                  <a href={order.printrove.trackingUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent-dark mt-2 block">
                    Track Package →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/account" className="text-sm text-smoke hover:text-ink transition-colors">
            ← Back to Account
          </Link>
        </div>
      </div>
    </div>
  )
}

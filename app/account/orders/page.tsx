// app/account/orders/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '@/lib/utils'
import { ChevronRight, Package } from 'lucide-react'

export const metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { take: 3 },
      fulfillment: { select: { status: true, trackingNumber: true, trackingUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-smoke hover:text-ink transition-colors text-sm">
            Account
          </Link>
          <span className="text-mist">/</span>
          <span className="text-sm">Orders</span>
        </div>

        <div className="mb-8">
          <p className="section-label mb-2">History</p>
          <h1 className="display-heading text-3xl md:text-4xl">My Orders</h1>
          <p className="text-smoke text-sm mt-1">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-ink/10">
            <Package size={48} className="text-mist mb-4" />
            <p className="text-smoke font-mono text-sm tracking-widest mb-6">NO ORDERS YET</p>
            <Link href="/shop" className="btn-primary text-xs">START SHOPPING</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-ink/10 hover:border-ink/30 transition-colors p-5 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: order meta */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${orderStatusColor(order.status)}`}>
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-smoke">{formatDate(order.createdAt)}</p>

                    {/* Tracking */}
                    {order.fulfillment?.trackingNumber && (
                      <p className="text-xs text-smoke mt-1">
                        Tracking:{' '}
                        <span className="font-mono text-ink">{order.fulfillment.trackingNumber}</span>
                      </p>
                    )}

                    {/* Item thumbnails */}
                    <div className="flex gap-2 mt-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="w-10 h-12 bg-cream-dark overflow-hidden flex-shrink-0"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-12 bg-cream-dark flex items-center justify-center text-xs font-mono text-smoke">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: price + arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      <p className="text-xs text-smoke mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-smoke group-hover:text-ink transition-colors flex-shrink-0"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

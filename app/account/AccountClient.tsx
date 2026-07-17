// app/account/AccountClient.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, MapPin, Heart, LogOut, ChevronRight, ShoppingBag, LayoutDashboard } from 'lucide-react'
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '@/lib/utils'
import { signOut } from 'next-auth/react'

interface Props {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string | null }
  orders: any[]
  addresses: any[]
}

export function AccountClient({ user, orders, addresses }: Props) {
  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image src={user.image} alt={user.name || ''} width={56} height={56} className="rounded-full" />
            ) : (
              <div className="w-14 h-14 bg-ink text-cream flex items-center justify-center text-xl font-display">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h1 className="display-heading text-2xl">{user.name || 'My Account'}</h1>
              <p className="text-smoke text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="btn-secondary inline-flex items-center gap-2 text-xs py-2.5">
                <LayoutDashboard size={14} /> Admin Dashboard
              </Link>
            )}
            <button onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-smoke hover:text-ink transition-colors font-mono">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick links */}
          <div className="space-y-3">
            {[
              ...(user.role === 'ADMIN'
                ? [{ icon: LayoutDashboard, label: 'Admin Dashboard', href: '/admin' }]
                : []),
              { icon: Package, label: 'My Orders', href: '/account/orders', count: orders.length },
              { icon: Heart, label: 'Wishlist', href: '/wishlist' },
              { icon: MapPin, label: 'Addresses', href: '/account/addresses', count: addresses.length },
            ].map(({ icon: Icon, label, href, count }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between p-4 border border-ink/10 hover:border-ink/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-smoke group-hover:text-ink transition-colors" />
                  <span className="text-sm font-medium">{label}</span>
                  {count !== undefined && (
                    <span className="text-xs font-mono text-smoke">({count})</span>
                  )}
                </div>
                <ChevronRight size={14} className="text-smoke group-hover:text-ink transition-colors" />
              </Link>
            ))}
          </div>

          {/* Recent orders */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-sm tracking-[3px] uppercase">Recent Orders</h2>
              <Link href="/account/orders" className="text-xs text-accent hover:text-accent-dark transition-colors">View All</Link>
            </div>

            {orders.length === 0 ? (
              <div className="border border-ink/10 p-12 text-center">
                <ShoppingBag size={32} className="text-mist mx-auto mb-3" />
                <p className="text-smoke text-sm font-mono tracking-widest">NO ORDERS YET</p>
                <Link href="/shop" className="btn-primary text-xs mt-4 inline-block">SHOP NOW</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="border border-ink/10 p-4 hover:border-ink/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-mono text-smoke mb-1">{formatDate(order.createdAt)}</p>
                        <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-smoke mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block text-xs font-mono px-2 py-1 rounded-sm ${orderStatusColor(order.status)}`}>
                          {orderStatusLabel(order.status)}
                        </span>
                        <p className="text-sm font-medium mt-2">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    {order.printrove?.trackingNumber && (
                      <div className="mt-3 pt-3 border-t border-ink/5">
                        <p className="text-xs text-smoke">
                          Tracking: <span className="font-mono text-ink">{order.printrove.trackingNumber}</span>
                          {order.printrove.trackingUrl && (
                            <a href={order.printrove.trackingUrl} target="_blank" rel="noopener noreferrer"
                              className="ml-2 text-accent hover:underline">Track →</a>
                          )}
                        </p>
                      </div>
                    )}
                    <Link href={`/account/orders/${order.id}`}
                      className="text-xs text-smoke hover:text-ink mt-3 flex items-center gap-1 transition-colors">
                      View Details <ChevronRight size={12} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

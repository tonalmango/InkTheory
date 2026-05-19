// app/admin/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '@/lib/utils'
import { Package, Users, ShoppingBag, TrendingUp, RefreshCw } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const [totalOrders, totalUsers, totalProducts, totalRevenue, recentOrders] = await Promise.all([
    prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 1 },
        printrove: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const stats = [
    { icon: Package, label: 'Total Orders', value: totalOrders.toString(), color: 'text-blue-600' },
    { icon: Users, label: 'Customers', value: totalUsers.toString(), color: 'text-green-600' },
    { icon: ShoppingBag, label: 'Active Products', value: totalProducts.toString(), color: 'text-purple-600' },
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: formatPrice(totalRevenue._sum.total || 0),
      color: 'text-accent',
    },
  ]

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label mb-2">Admin</p>
            <h1 className="display-heading text-3xl md:text-4xl">Dashboard</h1>
          </div>
          <form action="/api/printrove/sync" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 btn-secondary text-xs py-2.5"
            >
              <RefreshCw size={13} /> Sync Printrove
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="border border-ink/10 p-5">
              <Icon size={20} className={`${color} mb-3`} />
              <p className="text-2xl font-display font-bold">{value}</p>
              <p className="text-xs font-mono text-smoke tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Manage Products', href: '/admin/products', desc: 'Add, edit, toggle active' },
            { label: 'All Orders', href: '/admin/orders', desc: 'View & update order statuses' },
            { label: 'Coupons', href: '/admin/coupons', desc: 'Create & manage discount codes' },
            { label: 'Admin Settings', href: '/admin/settings', desc: 'Change admin email and password' },
          ].map(({ label, href, desc }) => (
            <Link key={href} href={href}
              className="border border-ink/10 p-5 hover:border-ink/30 transition-colors group">
              <p className="font-medium group-hover:text-accent transition-colors">{label}</p>
              <p className="text-sm text-smoke mt-1">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-mono text-sm tracking-[3px] uppercase mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Fulfillment'].map((h) => (
                    <th key={h} className="pb-3 pr-4 text-xs font-mono text-smoke tracking-widest uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-dark/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs hover:text-accent transition-colors">
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs">{order.user.name}</p>
                      <p className="text-xs text-smoke">{order.user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-smoke whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-xs">{order.items.length}</td>
                    <td className="py-3 pr-4 text-xs font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${orderStatusColor(order.status)}`}>
                        {orderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-mono text-smoke">
                        {order.printrove?.status || 'Not submitted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link href="/admin/orders" className="text-xs text-accent hover:text-accent-dark transition-colors">
              View all orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

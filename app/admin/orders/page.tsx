// app/admin/orders/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '@/lib/utils'
import { AdminOrderActions } from './AdminOrderActions'

export const metadata = { title: 'Admin — Orders' }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string }
}) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const status = searchParams.status || ''
  const page = Number(searchParams.page) || 1
  const limit = 20

  const where: any = { paymentStatus: 'PAID' }
  if (status) where.status = status

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        address: { select: { city: true, state: true, pincode: true } },
        printrove: { select: { status: true, printroveOrderId: true, trackingNumber: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  const statuses = ['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-smoke hover:text-ink text-sm transition-colors">Admin</Link>
          <span className="text-mist">/</span>
          <span className="text-sm">Orders</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="display-heading text-3xl">Orders ({total})</h1>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((s) => (
            <Link key={s} href={`/admin/orders${s ? `?status=${s}` : ''}`}
              className={`text-xs font-mono px-3 py-1.5 border transition-colors ${
                status === s ? 'bg-ink text-cream border-ink' : 'border-ink/20 text-smoke hover:border-ink'
              }`}>
              {s || 'All'}
            </Link>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left">
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Printrove', 'Actions'].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs font-mono text-smoke tracking-widest uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/account/orders/${order.id}`}
                      className="font-mono text-xs hover:text-accent transition-colors">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-xs font-medium">{order.user.name}</p>
                    <p className="text-xs text-smoke truncate max-w-[160px]">{order.user.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-smoke whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 pr-4 text-xs">{order._count.items}</td>
                  <td className="py-3 pr-4 text-xs font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${orderStatusColor(order.status)}`}>
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-xs">
                      <p className="font-mono text-smoke">{order.printrove?.status || '—'}</p>
                      {order.printrove?.trackingNumber && (
                        <p className="text-ink font-mono">{order.printrove.trackingNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <AdminOrderActions orderId={order.id} currentStatus={order.status}
                      hasPrintrove={!!order.printrove?.printroveOrderId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
              <Link key={i} href={`/admin/orders?${status ? `status=${status}&` : ''}page=${i + 1}`}
                className={`w-8 h-8 text-xs font-mono flex items-center justify-center border transition-colors ${
                  page === i + 1 ? 'bg-ink text-cream border-ink' : 'border-ink/20 text-smoke hover:border-ink'
                }`}>
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

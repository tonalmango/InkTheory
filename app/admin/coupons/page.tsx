// app/admin/coupons/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/lib/utils'
import { CreateCouponForm } from './CreateCouponForm'

export const metadata = { title: 'Admin — Coupons' }

export default async function AdminCouponsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin" className="text-smoke hover:text-ink text-sm transition-colors">Admin</Link>
          <span className="text-mist">/</span>
          <span className="text-sm">Coupons</span>
        </div>
        <h1 className="display-heading text-3xl mb-8">Coupons</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create form */}
          <div>
            <h2 className="font-mono text-sm tracking-[3px] uppercase mb-4">Create Coupon</h2>
            <CreateCouponForm />
          </div>

          {/* List */}
          <div>
            <h2 className="font-mono text-sm tracking-[3px] uppercase mb-4">
              Active Coupons ({coupons.length})
            </h2>
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`border p-4 ${coupon.isActive ? 'border-ink/10' : 'border-ink/5 opacity-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-sm font-bold tracking-widest">{coupon.code}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-smoke">
                          {coupon.type === 'PERCENTAGE'
                            ? `${coupon.value}% off`
                            : `${formatPrice(coupon.value)} off`}
                        </span>
                        {coupon.minOrderValue > 0 && (
                          <span className="text-xs text-mist">
                            · min {formatPrice(coupon.minOrderValue)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-mist">
                        <span>
                          Used: {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}
                        </span>
                        {coupon.expiresAt && (
                          <span>Expires: {formatDate(coupon.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 ${
                        coupon.isActive
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

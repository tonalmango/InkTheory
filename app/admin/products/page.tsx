// app/admin/products/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ToggleProductButton } from './ToggleProductButton'
import { categoryLabel } from '@/lib/utils'

export const metadata = { title: 'Admin — Products' }

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const products = await prisma.product.findMany({
    include: {
      _count: { select: { variants: true, orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-smoke hover:text-ink text-sm transition-colors">Admin</Link>
              <span className="text-mist">/</span>
              <span className="text-sm">Products</span>
            </div>
            <h1 className="display-heading text-3xl">Products ({products.length})</h1>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left">
                {['Product', 'Category', 'Price', 'Variants', 'Orders', 'Featured', 'Trending', 'Active'].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs font-mono text-smoke tracking-widest uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-cream-dark overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.name}
                            width={40} height={48} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <Link href={`/product/${product.slug}`} target="_blank"
                          className="text-xs font-medium hover:text-accent transition-colors line-clamp-2 max-w-[180px]">
                          {product.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-smoke">{categoryLabel(product.category)}</td>
                  <td className="py-3 pr-4 text-xs font-medium">{formatPrice(product.basePrice)}</td>
                  <td className="py-3 pr-4 text-xs">{product._count.variants}</td>
                  <td className="py-3 pr-4 text-xs">{product._count.orderItems}</td>
                  <td className="py-3 pr-4">
                    <ToggleProductButton productId={product.id} field="isFeatured" value={product.isFeatured} />
                  </td>
                  <td className="py-3 pr-4">
                    <ToggleProductButton productId={product.id} field="isTrending" value={product.isTrending} />
                  </td>
                  <td className="py-3 pr-4">
                    <ToggleProductButton productId={product.id} field="isActive" value={product.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

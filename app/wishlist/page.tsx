// app/wishlist/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<{ product: Product }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/wishlist')
      return
    }
    if (status === 'authenticated') {
      fetch('/api/wishlist')
        .then((r) => r.json())
        .then((d) => setItems(d.items || []))
        .finally(() => setLoading(false))
    }
  }, [status])

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <p className="section-label mb-2">Saved</p>
          <h1 className="display-heading text-3xl md:text-4xl">My Wishlist</h1>
          {!loading && <p className="text-smoke text-sm mt-2">{items.length} items</p>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-product bg-cream-dark animate-pulse" />
                <div className="h-3 w-3/4 bg-cream-dark animate-pulse" />
                <div className="h-3 w-1/2 bg-cream-dark animate-pulse" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={48} className="text-mist mb-4" />
            <p className="text-smoke font-mono text-sm tracking-widest mb-6">Saving for later? Respect.</p>
            <Link href="/collections" className="btn-primary text-xs">EXPLORE COLLECTIONS</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map(({ product }) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

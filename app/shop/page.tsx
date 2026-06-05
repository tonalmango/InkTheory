// app/shop/page.tsx
import { Suspense } from 'react'
import { ShopClient } from './ShopClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Streetwear inspired by modern Indian culture.',
}

export default function ShopPage() {
  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient />
      </Suspense>
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 w-48 bg-cream-dark animate-pulse rounded mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-product bg-cream-dark animate-pulse" />
            <div className="h-4 w-3/4 bg-cream-dark animate-pulse" />
            <div className="h-4 w-1/2 bg-cream-dark animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

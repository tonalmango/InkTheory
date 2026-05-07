// components/home/TrendingSection.tsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types'

export function TrendingSection({ products }: { products: Product[] }) {
  if (!products.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.p className="section-label mb-3 flex items-center gap-2"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Flame size={12} className="text-accent" /> What's Hot
          </motion.p>
          <motion.h2 className="display-heading text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Trending<br /><span className="font-display italic text-smoke">Right Now</span>
          </motion.h2>
        </div>
        <Link href="/shop?trending=true" className="group flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-smoke hover:text-ink transition-colors">
          See All Trending <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}

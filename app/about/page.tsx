// app/about/page.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt="InkTheory" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 h-full flex items-end px-6 md:px-12 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <p className="section-label text-cream/50 mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-7xl text-cream">About InkTheory</h1>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl">Born from the streets, made for the bold.</h2>
            <p className="text-smoke leading-relaxed">
              InkTheory started as a small design project in 2022, born from the frustration of finding
              genuinely unique streetwear in India. We believed that clothing should be a canvas —
              a statement of identity, not just fabric.
            </p>
            <p className="text-smoke leading-relaxed">
              Partnering with Printrove's print-on-demand infrastructure, we made it possible to offer
              hundreds of designs without holding inventory. Every piece is printed fresh when you
              order it — zero waste, 100% quality.
            </p>
            <p className="text-smoke leading-relaxed">
              Today, InkTheory ships to every corner of India, with 10,000+ customers who wear their
              identity every day.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Why print-on-demand?', a: 'It means every piece is made to order. No overstocking, no dead inventory, no environmental waste.' },
              { q: 'Who makes the designs?', a: 'Our in-house creative team, plus collaborations with independent artists from across India.' },
              { q: 'How fast is delivery?', a: 'Most orders ship within 2-3 business days and arrive in 5-7 days across India.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-ink/10 pb-4">
                <p className="font-medium text-sm mb-2">{q}</p>
                <p className="text-smoke text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <p className="section-label mb-8">Our Values</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: 'Zero Waste', body: 'Every item printed on demand. No unsold stock ends up in landfills.' },
              { title: 'Authentic Design', body: 'Original graphics. No mass-market templates. Art that means something.' },
              { title: 'Pan India Pride', body: 'Made in India, for India. Celebrating the culture of our streets.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <div className="w-8 h-px bg-accent mb-4" />
                <h3 className="font-display text-xl mb-2">{title}</h3>
                <p className="text-smoke text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            SHOP THE COLLECTION <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

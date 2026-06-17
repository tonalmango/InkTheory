'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

const points = [
  '₹999–₹1,999. Fits that make sense.',
  'Printed oversized tees + hoodies that hold shape.',
  'Made for college days and late-night scrolls.',
  'Comfort first. Style always.',
]


export function WhyInkTheory() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label mb-3">Why InkTheory</p>
          <h2 className="display-heading text-4xl md:text-5xl">
            Premium fits.
            <br />Zero corporate energy.
          </h2>
          <p className="text-smoke text-sm md:text-base leading-relaxed mt-5 max-w-lg">
            Streetwear for India—made to look expensive and feel effortless.
          </p>

        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {points.map((point) => (
              <div key={point} className="flex gap-3 border-t border-ink/10 pt-4">
                <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-smoke leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-ink hover:text-accent transition-colors">
            Shop Now <ArrowRight size={14} />
          </Link>

        </motion.div>
      </div>
    </section>
  )
}

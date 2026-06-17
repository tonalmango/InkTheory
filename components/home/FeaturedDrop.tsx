'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function FeaturedDrop() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-stretch">
          <motion.div
            className="relative min-h-[420px] lg:min-h-[560px] overflow-hidden bg-ink border-2 border-accent-dark/30"

            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85"
              alt="InkTheory featured streetwear drop"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            style={{
              background: `linear-gradient(135deg, #0E0B1B20, transparent)`
            }} />

            <div className="absolute left-6 bottom-6 right-6 text-cream">
              <p className="font-mono text-xs tracking-widest uppercase text-accent-dark mb-3 font-semibold">Limited Drops</p>
              <p className="font-display text-5xl md:text-6xl leading-tight font-bold">DROP<br />LIVE</p>
            </div>

          </motion.div>

          <motion.div
            className="bg-ink text-cream p-8 sm:p-10 md:p-14 flex flex-col justify-between min-h-[420px] relative overflow-hidden border-l-4 border-accent-dark"

            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #D97706 0 1px, transparent 1px 24px), repeating-linear-gradient(0deg, #D97706 0 1px, transparent 1px 24px)',
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-3 text-accent-dark mb-6">

                <Sparkles size={18} />
                <span className="font-mono text-xs tracking-widest uppercase font-semibold">Limited Drops</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight max-w-xl font-bold">
                Don’t
                <br />
                Miss Your Size.
              </h2>
              <p className="text-cream/65 leading-relaxed mt-8 max-w-lg font-light text-base">
                Small batch prints. Big energy. When it’s gone—yeah, it’s gone.
              </p>

            </div>

            <div className="relative mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/shop?featured=true" className="inline-flex items-center justify-center gap-2 bg-accent-dark text-cream px-8 py-4 font-mono tracking-widest uppercase text-sm font-semibold hover:bg-charcoal transition-colors duration-300">

                Shop Drops <ArrowRight size={14} />
              </Link>

              <Link href="/collections" className="inline-flex items-center justify-center border-2 border-cream/30 text-cream hover:border-accent-dark hover:text-cream px-8 py-4 font-mono tracking-widest uppercase text-sm font-semibold transition-colors duration-300">

                Explore All
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

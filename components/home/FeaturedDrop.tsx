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
            className="relative min-h-[420px] lg:min-h-[560px] overflow-hidden bg-ink"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85"
              alt="InkTheory featured streetwear drop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute left-5 bottom-5 right-5 text-cream">
              <p className="font-mono text-xs tracking-[4px] uppercase text-accent mb-2">Featured Drop</p>
              <p className="font-display text-4xl md:text-5xl leading-tight">SCENE KYA HAI?™</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-ink text-cream p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[420px] relative overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #F5F0E8 0 1px, transparent 1px 18px), repeating-linear-gradient(0deg, #C8A951 0 1px, transparent 1px 18px)',
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-accent mb-6">
                <Sparkles size={16} />
                <span className="font-mono text-xs tracking-[3px] uppercase">Indian Internet Energy</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight max-w-xl">
                Not another boring clothing brand.
              </h2>
              <p className="text-cream/55 leading-relaxed mt-6 max-w-lg">
                We turn internet culture, Bollywood energy and everyday Indian experiences into wearable stories.
              </p>
            </div>
            <div className="relative mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/shop?trending=true" className="btn-accent inline-flex items-center justify-center gap-2">
                SHOP FEATURED <ArrowRight size={14} />
              </Link>
              <Link href="/collections" className="btn-secondary border-cream/30 text-cream hover:bg-cream hover:text-ink inline-flex items-center justify-center">
                VIEW COLLECTIONS
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

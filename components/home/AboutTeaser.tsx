'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stats = [
  {
    number: '05',
    label: 'Collections',
  },
  {
    number: '50+',
    label: 'Design Concepts',
  },
  {
    number: '100%',
    label: 'Indian Culture',
  },
  {
    number: '∞',
    label: 'Stories To Tell',
  },
]

export function AboutTeaser() {
  return (
    <section className="bg-ink text-cream py-24 md:py-40 overflow-hidden relative border-t-2 border-saffron/30">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,119,6,0.12),transparent_26%),radial-gradient(circle_at_82%_62%,rgba(245,240,232,0.06),transparent_28%)]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(217,119,6,0.2) 1px, transparent 1px), linear-gradient(45deg, rgba(217,119,6,0.15) 1px, transparent 1px)',
            backgroundSize: '36px 36px, 58px 58px',
          }}
        />
      </div>

      <div className="absolute -right-16 top-12 hidden lg:block pointer-events-none">
        <motion.div
          className="w-[420px] h-[420px] rounded-full border border-saffron/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-10 rounded-full border border-cream/10" />
          <div className="absolute inset-24 rounded-full border border-saffron/15" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label text-saffron/60 mb-4">
              The Origin Story
            </p>

            <h2 className="cinema-title text-cream leading-tight mb-8">
              Built For
              <br />
              <span className="italic text-saffron">Modern India.</span>
            </h2>

            <p className="text-cream/65 leading-relaxed mb-10 max-w-xl font-light">
              We grew up on Bollywood, memes, internet culture, wedding dance
              floors, engineering colleges, startup dreams and endless group
              chats. InkTheory turns those moments into wearable stories. Not
              another Scandinavian luxury brand.
            </p>

            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-saffron hover:text-cream transition-colors duration-300 border-b-2 border-saffron pb-1"
            >
              Read The Full Story

              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 sm:gap-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`border-2 border-saffron/30 bg-gradient-to-br from-saffron/5 to-transparent p-6 md:p-8 backdrop-blur-sm hover:border-saffron/60 transition-all duration-300 ${
                  index === 1 || index === 2
                    ? 'lg:translate-y-10'
                    : ''
                }`}
              >
                <p className="font-display text-4xl md:text-5xl text-saffron mb-2 font-bold">
                  {stat.number}
                </p>

                <p className="text-cream/50 text-[10px] md:text-xs font-mono tracking-widest uppercase leading-relaxed font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stats = [
  { number: '5', label: 'Lore Drops' },
  { number: '24/7', label: 'Group Chat Energy' },
  { number: '5-7', label: 'Day Delivery' },
  { number: '100%', label: 'Made To Order' },
]

export function AboutTeaser() {
  return (
    <section className="bg-ink text-cream py-20 md:py-32 overflow-hidden relative">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(200,169,81,0.18),transparent_26%),radial-gradient(circle_at_82%_62%,rgba(245,240,232,0.08),transparent_28%)]" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(245,240,232,0.28) 1px, transparent 1px), linear-gradient(45deg, rgba(200,169,81,0.18) 1px, transparent 1px)',
            backgroundSize: '34px 34px, 56px 56px',
          }}
        />
      </div>

      <div className="absolute -right-16 top-12 hidden lg:block pointer-events-none">
        <motion.div
          className="w-[420px] h-[420px] rounded-full border border-accent/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-10 rounded-full border border-cream/10" />
          <div className="absolute inset-24 rounded-full border border-accent/15" />
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
            <p className="section-label text-cream/45 mb-4">The Lore</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream leading-tight mb-6">
              Built For<br />
              <span className="italic text-accent">Modern India.</span>
            </h2>
            <p className="text-cream/58 leading-relaxed mb-8 max-w-xl">
              We grew up on Bollywood, memes, internet culture, wedding dance floors,
              engineering colleges, startup dreams and endless group chats.
              InkTheory turns those moments into wearable stories.
            </p>
            <Link href="/about"
              className="group inline-flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-accent hover:text-cream transition-colors border-b border-accent/30 pb-1">
              Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`border border-cream/10 bg-cream/[0.03] p-5 md:p-7 backdrop-blur-sm ${
                  index === 1 || index === 2 ? 'lg:translate-y-10' : ''
                }`}
              >
                <p className="font-display text-3xl md:text-5xl text-cream mb-1">{stat.number}</p>
                <p className="text-cream/42 text-[10px] md:text-xs font-mono tracking-widest uppercase leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

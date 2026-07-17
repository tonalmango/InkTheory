'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function InstagramCommunity() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-3">Instagram Community</p>
            <h2 className="display-heading text-4xl md:text-5xl">
              Post the fit.
              <br />
              Get reposted.
            </h2>

            <p className="text-smoke text-sm md:text-base leading-relaxed mt-4 max-w-xl">
              Your fit belongs on the timeline. Tag us and we’ll repost the best chaos.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-ink hover:text-accent transition-colors duration-300"
            >
              Follow @inktheory
              <ArrowUpRight size={14} />
            </Link>
            <p className="text-mist text-xs mt-3 font-mono">Use #InkTheoryDrops</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-ink border border-ink/10 aspect-square rounded-2xl overflow-hidden"
            />
          ))}
        </div>
      </div>
    </section>
  )
}


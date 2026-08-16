'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { STOREFRONT_CATEGORIES } from '@/lib/storefrontCategories'

const categoryImages = [
  '/categories/trending.png',
  '/categories/pop-culture.png',
  '/categories/together-different.png',
  '/categories/comic-mode.png',
]

export function CategoryGrid() {
  return (
    <section className="bg-cream-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              className="section-label mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Categories
            </motion.p>
            <motion.h2
              className="display-heading text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Pick Your Category.
            </motion.h2>
            <p className="text-sm text-smoke mt-4 max-w-xl">
              Four lanes. Same premium InkTheory energy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STOREFRONT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={cat.href}
                className="group block relative min-h-[380px] overflow-hidden border border-ink/10 bg-cream shadow-editorial transition-all duration-500 hover:-translate-y-1 hover:border-accent/45 hover:shadow-editorial-hover"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

                <div className="relative h-48 overflow-hidden bg-ink">
                  <Image
                    src={categoryImages[i]}
                    alt={`${cat.title} category`}
                    fill
                    className="object-cover opacity-[0.82] transition-transform duration-700 group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="absolute left-4 top-4 border border-cream/35 bg-ink/58 px-3 py-1.5 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[2.5px] text-cream/80">
                      {cat.cue}
                    </span>
                  </div>
                </div>

                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-cream/40 text-cream/80 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                  <ArrowUpRight size={17} />
                </div>

                <div className="relative bg-cream p-6">
                  <p className="mb-4 h-px w-12 bg-accent" />
                  <h3 className="font-display text-3xl leading-tight text-ink">
                    {cat.title}
                  </h3>
                  <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-smoke">
                    {cat.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-ink transition-colors group-hover:text-accent">
                    Shop Category <ArrowUpRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

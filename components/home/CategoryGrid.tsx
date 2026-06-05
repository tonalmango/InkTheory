'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { BRAND_COLLECTIONS } from '@/lib/brand'

const categories = [
  {
    ...BRAND_COLLECTIONS[0],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85',
    className: 'lg:col-span-2 lg:row-span-2',
  },
  {
    ...BRAND_COLLECTIONS[1],
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=85',
    className: 'lg:col-span-1',
  },
  {
    ...BRAND_COLLECTIONS[2],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=85',
    className: 'lg:col-span-1',
  },
  {
    ...BRAND_COLLECTIONS[3],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=85',
    className: 'lg:col-span-1',
  },
  {
    ...BRAND_COLLECTIONS[4],
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=85',
    className: 'lg:col-span-1',
  },
]

export function CategoryGrid() {
  return (
    <section className="bg-cream-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              className="section-label mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Collections
            </motion.p>
            <motion.h2
              className="display-heading text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Choose Your<br />
              <span className="font-display italic text-smoke">Lore.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-sm text-smoke leading-relaxed">
            Five moods. One cultural group chat. Pick the one currently running your life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[230px] gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={cat.className}
            >
              <Link
                href={cat.href}
                className="group block relative overflow-hidden bg-ink h-full min-h-[260px] sm:min-h-[300px] lg:min-h-0"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                <div className="absolute top-4 right-4 w-10 h-10 border border-cream/30 flex items-center justify-center text-cream/80 group-hover:bg-accent group-hover:text-ink group-hover:border-accent transition-colors">
                  <ArrowUpRight size={17} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <p className="text-cream font-display text-2xl md:text-3xl leading-tight">
                    {cat.title}
                  </p>
                  <p className="text-cream/65 text-xs font-mono tracking-widest mt-2 uppercase">
                    {cat.description}
                  </p>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-cream/10 group-hover:ring-accent/50 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

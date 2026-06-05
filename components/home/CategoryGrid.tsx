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
  const collectionAccents = [
    { key: 0, accentColor: '#D97706', label: 'Internet Culture' },
    { key: 1, accentColor: '#C9A227', label: 'Cinema' },
    { key: 2, accentColor: '#1E40AF', label: 'Classified Files' },
    { key: 3, accentColor: '#991B1B', label: 'Luxury' },
    { key: 4, accentColor: '#D97706', label: 'Unofficial Systems' },
  ]

  return (
    <section className="bg-cream-dark py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              className="section-label mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Intermission
            </motion.p>
            <motion.h2
              className="collection-title text-4xl md:text-5xl mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Choose Your<br />
              <span className="font-display italic text-saffron">Lore.</span>
            </motion.h2>
            <p className="text-sm text-smoke mt-4 max-w-lg">
              Five moods. One cultural group chat. Which chapter of your story are you in?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px] gap-4 md:gap-5">
          {categories.map((cat, i) => {
            const accentData = collectionAccents[i]
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cat.className}
              >
                <Link
                  href={cat.href}
                  className="group block relative overflow-hidden bg-ink h-full min-h-[260px] sm:min-h-[300px] lg:min-h-0 border border-ink/20 hover:border-current transition-colors duration-500"
                  style={{ '--accent-color': accentData.accentColor } as React.CSSProperties}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.12]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Gradient overlay with accent color */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${accentData.accentColor}15 0%, ${accentData.accentColor}08 50%, rgba(10,10,10,0.85) 100%)`
                    }}
                  />
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                    background: `linear-gradient(180deg, rgba(10,10,10,0.4) 0%, ${accentData.accentColor}20 100%)`
                  }} />

                  {/* Top accent line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: accentData.accentColor }}
                  />

                  {/* Arrow button */}
                  <div className="absolute top-5 right-5 w-11 h-11 border-2 border-cream/40 flex items-center justify-center text-cream/70 group-hover:bg-white group-hover:border-white group-hover:text-ink transition-all duration-300 transform group-hover:scale-110">
                    <ArrowUpRight size={18} />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                    <p 
                      className="font-display text-2xl md:text-3xl leading-tight text-cream font-bold transition-colors duration-300"
                      style={{ color: accentData.accentColor }}
                    >
                      {cat.title}
                    </p>
                    <p className="text-cream/60 text-[11px] font-mono tracking-[3px] mt-3 uppercase group-hover:text-cream/80 transition-colors">
                      {accentData.label}
                    </p>
                    <p className="text-cream/50 text-xs font-body mt-2 leading-relaxed max-w-xs group-hover:text-cream/70 transition-colors">
                      {cat.description}
                    </p>
                  </div>

                  {/* Border effect */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 group-hover:ring-current/50 transition-all duration-300 pointer-events-none" style={{ '--ring-color': accentData.accentColor } as React.CSSProperties} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

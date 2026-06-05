// components/home/HeroSection.tsx
'use client'
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[680px] h-[92vh] max-h-[900px] overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.5) 100%), 
              url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1800&q=90')`,
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-16"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <p className="text-cream/60 font-mono text-xs tracking-[6px] uppercase mb-6">
            Streetwear For The Chronically Online generation
          </p>

          <h1 className="font-display text-cream text-5xl sm:text-6xl md:text-8xl lg:text-[120px] leading-[0.92] mb-8 max-w-4xl">
            Too Online<br />
            <span className="italic text-accent">To Be Normal.</span>
          </h1>

          <p className="text-cream/72 text-base md:text-lg leading-relaxed max-w-xl mb-8">
            Modern Indian streetwear inspired by culture, chaos and the stories we all know.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/shop"
              className="group flex items-center gap-3 bg-cream text-ink px-8 py-4 text-sm tracking-widest uppercase font-mono hover:bg-accent transition-colors duration-300"
            >
              ENTER THE LORE
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>

            <Link
              href="/collections"
              className="text-cream/80 text-sm tracking-widest uppercase font-mono border-b border-cream/30 pb-0.5 hover:text-cream hover:border-cream transition-colors duration-200"
            >
              Explore Collections
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-px h-16 bg-cream/30 relative overflow-hidden">
            <motion.div
              className="absolute top-0 w-full bg-cream"
              animate={{ height: ['0%', '100%'], top: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <span className="text-cream/50 font-mono text-[9px] tracking-[3px] uppercase rotate-90 origin-center mt-4">
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

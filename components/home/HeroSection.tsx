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
            backgroundImage: `linear-gradient(90deg, rgba(153,27,27,0.22) 0%, rgba(10,10,10,0.04) 38%, rgba(30,64,175,0.16) 100%), linear-gradient(to bottom, rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.62) 100%), 
              url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1800&q=90')`,
          }}
        />
        <div className="absolute inset-0 opacity-[0.13] bg-[linear-gradient(90deg,transparent_0_94%,rgba(245,240,232,0.5)_94%_95%,transparent_95%_100%)] bg-[length:72px_100%]" />
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
          <p className="cinema-label border-cream/25 text-cream/70 mb-8 md:mb-10">
            Premium streetwear for the Indian feed
          </p>

          <h1 className="cinema-title text-cream leading-[0.92] mb-8 max-w-5xl">
            WEAR WHAT YOUR FEED
            <br />
            WISHES IT WAS.
          </h1>

          <p className="text-cream/75 text-base md:text-lg leading-relaxed max-w-2xl mb-10 font-light">
            Premium oversized graphic streetwear inspired by internet culture, pop references and everyday chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-cream text-ink px-8 py-4 text-sm font-mono tracking-widest uppercase hover:bg-saffron hover:text-cream transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Shop Now
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </span>
            </Link>

            <Link
              href="/collections"
              className="text-cream/80 text-sm tracking-widest uppercase font-mono border-b-2 border-saffron/40 pb-1 hover:text-cream hover:border-saffron transition-all duration-300"
            >
              Explore Drops
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

// components/product/ImageZoom.tsx
'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  src: string
  alt: string
}

export function ImageZoom({ src, alt }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative cursor-zoom-in"
        onClick={() => setZoomed(true)}
        onMouseMove={handleMouseMove}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} className="text-ink" />
        </div>
      </div>

      {/* Fullscreen zoom */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <motion.div
              className="relative w-[90vw] max-w-2xl aspect-[4/5]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="90vw"
                quality={100}
              />
            </motion.div>
            <button
              className="absolute top-4 right-4 text-cream/60 hover:text-cream transition-colors text-sm font-mono tracking-widest"
              onClick={() => setZoomed(false)}
            >
              CLOSE ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

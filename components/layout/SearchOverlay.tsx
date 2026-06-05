// components/layout/SearchOverlay.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  name: string
  slug: string
  images: string[]
  basePrice: number
  category: string
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) {
          setResults([])
          return
        }
        const data = await res.json()
        setResults(data.products || [])
      } catch (error) {
        console.error('[Search Error]', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-cream/98 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-2xl mx-auto px-4 pt-24">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-smoke hover:text-ink transition-colors"
            >
              <X size={24} />
            </button>

            {/* Input */}
            <div className="relative border-b-2 border-ink/20 focus-within:border-ink transition-colors pb-4">
              <Search
                size={20}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-smoke"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lore, drops, chaos…"
                className="w-full pl-8 bg-transparent text-2xl md:text-3xl font-display text-ink placeholder:text-mist focus:outline-none"
              />
            </div>

            {/* Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-8 space-y-2"
                >
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 hover:bg-cream-dark transition-colors rounded-sm group"
                    >
                      <div className="w-14 h-14 bg-cream-dark rounded overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink truncate">{product.name}</p>
                        <p className="text-sm text-smoke">{formatPrice(product.basePrice)}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-smoke group-hover:text-ink transition-colors flex-shrink-0"
                      />
                    </Link>
                  ))}

                  <Link
                    href={`/shop?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-4 text-sm text-accent tracking-widest uppercase font-mono hover:text-accent-dark transition-colors"
                  >
                    View all results <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}

              {query.length >= 2 && !loading && results.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-smoke text-center"
                >
                  No results for "{query}"
                </motion.p>
              )}
            </AnimatePresence>

            {/* Quick links */}
            {!query && (
              <div className="mt-12">
                <p className="section-label mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Scene Kya Hai', 'Bollywood Brainrot', 'Aukaat Pending', 'Desi Lore', 'Setting Ho Jayega'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-ink/20 text-sm text-smoke hover:border-ink hover:text-ink transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

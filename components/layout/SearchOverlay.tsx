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

const popularSearches = ['Trending', 'Pop Culture', 'Couple', 'Comic']

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
          className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-3xl mx-auto px-4 pt-24">
            <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-cream/98 shadow-2xl px-5 sm:px-8 py-8 sm:py-10">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(200,169,81,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(10,10,10,0.04),transparent_34%)]" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-ink/10 bg-cream text-ink hover:text-accent hover:border-accent transition-colors shadow-sm"
            >
              <X size={24} />
            </button>

            <div className="relative border-b-2 border-ink/25 focus-within:border-accent transition-colors pb-4 z-10">
              <Search
                size={20}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-accent"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collections, drops, stories..."
                className="w-full pl-8 bg-transparent text-2xl md:text-3xl font-display text-ink placeholder:text-smoke focus:outline-none"
              />
            </div>

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-8 space-y-2 relative z-10"
                >
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 bg-cream-dark/40 hover:bg-cream-dark transition-colors rounded-2xl border border-ink/5 group"
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
                        className="text-smoke group-hover:text-accent transition-colors flex-shrink-0"
                      />
                    </Link>
                  ))}

                  <Link
                    href={`/shop?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-4 text-sm text-accent tracking-widest uppercase font-mono hover:text-accent-light transition-colors"
                  >
                    View all results <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}

              {query.length >= 2 && !loading && results.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-smoke text-center relative z-10"
                >
                  No results for "{query}"
                </motion.p>
              )}
            </AnimatePresence>

            {!query && (
              <div className="mt-12 relative z-10">
                <p className="section-label mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-ink/20 bg-cream px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream focus-visible:border-accent focus-visible:outline-none"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

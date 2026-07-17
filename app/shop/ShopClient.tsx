// app/shop/ShopClient.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types'
import { categoryLabel } from '@/lib/utils'
import { STOREFRONT_CATEGORIES } from '@/lib/storefrontCategories'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function ShopClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = searchParams.get('category') || ''
  const tags = searchParams.get('tags') || ''
  const sort = searchParams.get('sort') || 'newest'
  const q = searchParams.get('q') || ''
  const trending = searchParams.get('trending') === 'true'
  const activeStorefrontCategory = trending
    ? STOREFRONT_CATEGORIES[0]
    : STOREFRONT_CATEGORIES.find((cat) => cat.key === tags)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      setPage(1)
    },
    [searchParams, router, pathname]
  )

  const updateStorefrontCategory = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('tags')
      params.delete('trending')
      params.delete('q')
      params.delete('page')

      if (value === 'trending') params.set('trending', 'true')
      else params.set('tags', value)

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      setPage(1)
    },
    [searchParams, router, pathname]
  )

  const clearStorefrontCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tags')
    params.delete('trending')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setPage(1)
  }, [searchParams, router, pathname])

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('tags')
    params.delete('trending')
    params.delete('q')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setPage(1)
  }, [searchParams, router, pathname])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(category && { category }),
        ...(tags && { tags }),
        ...(sort && { sort }),
        ...(q && { q }),
        ...(trending && { trending: 'true' }),
        page: String(page),
        limit: '12',
      })
      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) {
        setProducts([])
        setTotal(0)
        return
      }

      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.pagination?.total || 0)
    } catch (error) {
      console.error('[Shop Fetch Error]', error)
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, tags, sort, q, trending, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <p className="section-label mb-2">
          {q ? `Search: "${q}"` : activeStorefrontCategory ? activeStorefrontCategory.title : category ? categoryLabel(category) : 'All Products'}
        </p>
        <h1 className="display-heading text-3xl md:text-4xl">
          {q ? 'Search Results' : activeStorefrontCategory ? activeStorefrontCategory.title : category ? categoryLabel(category) : 'Shop All'}
        </h1>
        {!q && !trending && !category && !tags && (
          <p className="text-smoke text-sm mt-3 max-w-xl">
            Streetwear inspired by modern Indian culture.
          </p>
        )}
        <p className="text-smoke text-sm mt-2">{total} products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters - desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0 space-y-8">
          <div>
            <p className="text-xs font-mono tracking-[3px] uppercase text-smoke mb-4">Category</p>
            <ul className="space-y-2">
              {STOREFRONT_CATEGORIES.map((cat) => (
                <li key={cat.key}>
                  <button
                    onClick={() => updateStorefrontCategory(cat.key)}
                    className={`text-sm transition-colors w-full text-left py-1 ${
                      activeStorefrontCategory?.key === cat.key
                        ? 'text-ink font-medium'
                        : 'text-smoke hover:text-ink'
                    }`}
                  >
                    {activeStorefrontCategory?.key === cat.key && (
                      <span className="inline-block w-3 h-px bg-accent mr-2 align-middle" />
                    )}
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono tracking-[3px] uppercase text-smoke mb-4">Sort By</p>
            <ul className="space-y-2">
              {SORT_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    onClick={() => updateParam('sort', opt.value)}
                    className={`text-sm transition-colors w-full text-left py-1 ${
                      sort === opt.value ? 'text-ink font-medium' : 'text-smoke hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile filter bar */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 text-sm font-mono text-smoke border border-ink/20 px-4 py-2"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-sm font-mono text-smoke border border-ink/20 px-3 py-2 bg-cream focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          {(category || q || tags || trending) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeStorefrontCategory && (
                <button
                  onClick={clearStorefrontCategory}
                  className="flex items-center gap-1 text-xs font-mono bg-ink text-cream px-3 py-1.5"
                >
                  {activeStorefrontCategory.title} <X size={11} />
                </button>
              )}
              {category && (
                <button
                  onClick={() => updateParam('category', '')}
                  className="flex items-center gap-1 text-xs font-mono bg-ink text-cream px-3 py-1.5"
                >
                  {categoryLabel(category)} <X size={11} />
                </button>
              )}
              {q && (
                <button
                  onClick={() => updateParam('q', '')}
                  className="flex items-center gap-1 text-xs font-mono bg-ink text-cream px-3 py-1.5"
                >
                  "{q}" <X size={11} />
                </button>
              )}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-product bg-cream-dark animate-pulse" />
                  <div className="h-3 w-3/4 bg-cream-dark animate-pulse" />
                  <div className="h-3 w-1/2 bg-cream-dark animate-pulse" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-smoke font-mono text-sm tracking-widest">NO PRODUCTS FOUND</p>
              <button onClick={clearFilters}
                className="mt-4 text-sm text-accent underline underline-offset-4">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-sm font-mono transition-colors ${
                    page === i + 1
                      ? 'bg-ink text-cream'
                      : 'border border-ink/20 text-smoke hover:border-ink hover:text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div className="fixed inset-0 bg-ink/40 z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)} />
            <motion.div className="fixed bottom-0 left-0 right-0 bg-cream z-50 rounded-t-2xl p-6 md:hidden"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-sm tracking-widest uppercase">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-mono tracking-[3px] uppercase text-smoke mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {STOREFRONT_CATEGORIES.map((cat) => (
                      <button key={cat.key}
                        onClick={() => { updateStorefrontCategory(cat.key); setFiltersOpen(false) }}
                        className={`px-4 py-2 text-xs font-mono border transition-colors ${
                          activeStorefrontCategory?.key === cat.key ? 'bg-ink text-cream border-ink' : 'border-ink/20 text-smoke'
                        }`}>
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

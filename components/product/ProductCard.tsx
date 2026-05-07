'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()

  const hasDiscount = product.comparePrice && product.comparePrice > product.basePrice
  const discount = hasDiscount
    ? Math.round(((product.comparePrice! - product.basePrice) / product.comparePrice!) * 100)
    : 0
  const defaultVariant = product.variants[0]
  const href = `/product/${product.slug}`

  const handleWishlist = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsWishlisted(!isWishlisted)

    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
    } catch {
      setIsWishlisted(isWishlisted)
    }
  }

  const handleQuickAdd = () => {
    if (!defaultVariant) {
      router.push(href)
      return
    }

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      quantity: 1,
      product: { id: product.id, name: product.name, images: product.images, slug: product.slug },
      variant: { id: defaultVariant.id, size: defaultVariant.size, color: defaultVariant.color, price: defaultVariant.price },
    })

    setAddedToCart(true)
    toast.success('Added to cart')
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-product bg-cream-dark overflow-hidden">
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-0">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alt`}
              fill
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isTrending && (
            <span className="bg-ink text-cream text-[10px] tracking-[2px] uppercase font-mono px-2 py-1">
              Trending
            </span>
          )}
          {hasDiscount && (
            <span className="bg-accent text-ink text-[10px] tracking-[2px] uppercase font-mono px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.isFeatured && !product.isTrending && (
            <span className="bg-cream text-ink text-[10px] tracking-[2px] uppercase font-mono px-2 py-1">
              Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
          <motion.button
            onClick={handleWishlist}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            whileTap={{ scale: 0.85 }}
            aria-label="Add to wishlist"
            type="button"
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={15}
                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-ink'}
              />
            </motion.div>
          </motion.button>

          <Link
            href={href}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Quick view"
          >
            <Eye size={15} className="text-ink" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-ink text-cream text-xs tracking-[2px] uppercase font-mono py-3 hover:bg-charcoal transition-colors flex items-center justify-center gap-2"
            type="button"
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Added ✓
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <ShoppingBag size={13} /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        <p className="text-[11px] text-smoke font-mono tracking-[2px] uppercase">
          {product.category.replace(/_/g, ' ')}
        </p>
        <Link href={href} className="block">
          <h3 className="text-sm font-medium text-ink hover:text-charcoal transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{formatPrice(product.basePrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-smoke line-through">
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>

        {product.variants.length > 0 && (
          <div className="flex gap-1 pt-1">
            {[...new Set(product.variants.map((v) => v.color))].slice(0, 5).map((color) => {
              const variant = product.variants.find((v) => v.color === color)
              return (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full border border-ink/10"
                  style={{ backgroundColor: variant?.colorHex || '#ccc' }}
                  title={color}
                />
              )
            })}
          </div>
        )}
      </div>
    </motion.article>
  )
}

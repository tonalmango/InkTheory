// app/product/[slug]/ProductClient.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Ruler, Star, ChevronDown, Share2, Truck, RotateCcw } from 'lucide-react'
import { Product, ProductVariant } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { ProductCard } from '@/components/product/ProductCard'
import { SizeFinder } from '@/components/product/SizeFinder'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getProductBrandDescription } from '@/lib/brand'

interface Props {
  product: Product & { avgRating: number }
  related: Product[]
}

export function ProductClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [sizefinderOpen, setSizefinderOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  const { addItem } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()

  // Unique colors and sizes
  const colors = [...new Set(product.variants.map((v) => v.color))]
  const sizes = selectedColor
    ? [...new Set(product.variants.filter((v) => v.color === selectedColor).map((v) => v.size))]
    : [...new Set(product.variants.map((v) => v.size))]

  const selectedVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )

  const hasDiscount = product.comparePrice && product.comparePrice > product.basePrice
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.basePrice) / product.comparePrice!) * 100)
    : 0
  const brandDescription = getProductBrandDescription(product)

  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    if (!selectedVariant) { toast.error('Please select a valid combination'); return }

    setAdding(true)
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
      product: { id: product.id, name: product.name, images: product.images, slug: product.slug },
      variant: { id: selectedVariant.id, size: selectedVariant.size, color: selectedVariant.color, price: selectedVariant.price },
    })

    toast.success('Added to cart!')
    setTimeout(() => setAdding(false), 1000)
  }

  const handleWishlist = async () => {
    if (!session) { router.push('/auth/signin'); return }
    const next = !isWishlisted
    setIsWishlisted(next)
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    })
    toast.success(next ? 'Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <>
      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative aspect-[4/5] bg-cream-dark overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={selectedImage} className="absolute inset-0"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}>
                    {product.images[selectedImage] && (
                      <Image src={product.images[selectedImage]} alt={product.name}
                        fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-accent text-ink text-xs font-mono tracking-widest px-3 py-1.5">
                    -{discountPct}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-20 flex-shrink-0 border-2 transition-colors overflow-hidden ${
                        selectedImage === i ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}>
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <p className="text-xs font-mono text-smoke tracking-widest uppercase">
                {product.category.replace(/_/g, ' ')}
              </p>

              {/* Title */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                {product._count && product._count.reviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13}
                          className={i < Math.round(product.avgRating) ? 'fill-accent text-accent' : 'text-mist'} />
                      ))}
                    </div>
                    <span className="text-xs text-smoke font-mono">
                      {product.avgRating.toFixed(1)} ({product._count.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-medium text-ink">
                  {formatPrice(selectedVariant?.price || product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-smoke line-through">{formatPrice(product.comparePrice!)}</span>
                )}
              </div>

              {/* Color picker */}
              {colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono tracking-widest uppercase text-smoke">
                      Color{selectedColor && `: ${selectedColor}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const variant = product.variants.find((v) => v.color === color)
                      return (
                        <button key={color} onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                          title={color}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color ? 'border-ink scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: variant?.colorHex || '#ccc' }} />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Size picker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-mono tracking-widest uppercase text-smoke">
                    Size{selectedSize && `: ${selectedSize}`}
                  </p>
                  <button onClick={() => setSizefinderOpen(true)}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark transition-colors">
                    <Ruler size={12} /> Size Finder
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                    const available = sizes.includes(size)
                    return (
                      <button key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`w-12 h-12 text-sm font-mono border transition-colors ${
                          selectedSize === size
                            ? 'bg-ink text-cream border-ink'
                            : available
                            ? 'border-ink/30 text-ink hover:border-ink'
                            : 'border-ink/10 text-mist line-through cursor-not-allowed'
                        }`}>
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <motion.button onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
                  whileTap={{ scale: 0.98 }}
                  animate={adding ? { backgroundColor: '#C8A951' } : {}}>
                  <ShoppingBag size={16} />
                  {adding ? 'ADDED ✓' : 'ADD TO CART'}
                </motion.button>

                <button onClick={handleWishlist}
                  className={`w-14 h-14 border flex items-center justify-center transition-all ${
                    isWishlisted ? 'border-red-400 bg-red-50' : 'border-ink/20 hover:border-ink'
                  }`}>
                  <motion.div animate={isWishlisted ? { scale: [1, 1.4, 1] } : {}}>
                    <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-ink'} />
                  </motion.div>
                </button>

                <button className="w-14 h-14 border border-ink/20 hover:border-ink flex items-center justify-center transition-colors">
                  <Share2 size={18} className="text-ink" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon: Truck, text: 'Free shipping above ₹1500' },
                  { icon: RotateCcw, text: '7-day easy returns' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-smoke">
                    <Icon size={14} className="text-accent flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="border-t border-ink/10 pt-6">
                <button onClick={() => setDescExpanded(!descExpanded)}
                  className="flex items-center justify-between w-full text-sm font-mono tracking-widest uppercase mb-3">
                  Description
                  <ChevronDown size={16} className={`transition-transform ${descExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {descExpanded && (
                    <motion.p className="text-sm text-smoke leading-relaxed"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}>
                      {brandDescription}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!descExpanded && (
                  <p className="text-sm text-smoke leading-relaxed line-clamp-2">{brandDescription}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-ink/10">
            <h2 className="display-heading text-2xl md:text-3xl mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Size Finder Modal */}
      <SizeFinder isOpen={sizefinderOpen} onClose={() => setSizefinderOpen(false)}
        sizeChart={product.sizeChart?.data as any || []}
        onSelect={(size) => { setSelectedSize(size); setSizefinderOpen(false) }} />
    </>
  )
}

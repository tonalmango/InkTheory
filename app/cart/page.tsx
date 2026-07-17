// app/cart/page.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, calculateShipping } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const subtotal = totalPrice()
  const shipping = calculateShipping(subtotal)
  const total = subtotal + shipping

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <p className="section-label mb-2">Your Bag</p>
          <h1 className="display-heading text-3xl md:text-4xl">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={48} className="text-mist mb-4" />
            <p className="text-smoke font-mono text-sm tracking-widest mb-6">Your cart is empty. Start with the first piece.</p>
            <Link href="/shop" className="btn-primary text-xs">CONTINUE SHOPPING</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.variantId} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4 md:gap-6 border-b border-ink/10 pb-6">
                    <div className="w-20 md:w-28 flex-shrink-0 bg-cream-dark overflow-hidden">
                      <div className="relative aspect-[3/4]">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name}
                            fill className="object-cover" sizes="112px" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link href={`/product/${item.product.slug}`}
                            className="text-sm md:text-base font-medium hover:text-smoke transition-colors">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-smoke font-mono mt-1">
                            {item.variant.size} · {item.variant.color}
                          </p>
                        </div>
                        <button onClick={() => removeItem(item.variantId)}
                          className="text-mist hover:text-ink transition-colors flex-shrink-0">
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-ink/20">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-sm font-mono">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(item.variant.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream-dark p-6 sticky top-24 space-y-4">
                <h2 className="font-mono text-sm tracking-[3px] uppercase">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-smoke">
                    <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0
                        ? <span className="text-saffron">Free</span>
                        : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-smoke">
                      Add {formatPrice(1500 - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-ink/10 pt-3 flex justify-between font-medium text-base">
                    <span>Total (excl. GST)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                    PROCEED TO CHECKOUT <ArrowRight size={14} />
                  </button>
                </Link>

                <Link href="/shop"
                  className="block text-center text-sm text-smoke hover:text-ink transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

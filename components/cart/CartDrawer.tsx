// components/cart/CartDrawer.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-ink/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-ink" />
                <h2 className="font-mono text-sm tracking-[3px] uppercase">
                  Cart ({items.length})
                </h2>
              </div>
              <button onClick={closeCart} className="p-1 text-smoke hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-4 py-20"
                  >
                    <ShoppingBag size={40} className="text-mist" />
                    <p className="text-smoke font-mono text-sm tracking-widest">Bhai, cart toh bhar le.</p>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="btn-primary text-xs"
                    >
                      CONTINUE SHOPPING
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 bg-cream-dark flex-shrink-0 overflow-hidden">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-ink line-clamp-2 leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-smoke mt-0.5 font-mono">
                              {item.variant.size} / {item.variant.color}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-mist hover:text-ink transition-colors ml-2 flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center border border-ink/20">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <span className="text-sm font-medium text-ink">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-6 space-y-4">
                {/* Free shipping banner */}
                {totalPrice() < 1500 && (
                  <div className="bg-cream-dark px-4 py-3 text-xs font-mono text-smoke text-center">
                    Add {formatPrice(1500 - totalPrice())} more for{' '}
                    <span className="text-ink font-medium">FREE SHIPPING</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-smoke">Subtotal</span>
                  <span className="text-lg font-medium text-ink">{formatPrice(totalPrice())}</span>
                </div>

                <p className="text-xs text-smoke/70 font-mono">
                  Tax & shipping calculated at checkout
                </p>

                <Link href="/checkout" onClick={closeCart} className="block">
                  <button className="w-full btn-primary flex items-center justify-center gap-2">
                    CHECKOUT <ArrowRight size={15} />
                  </button>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-smoke hover:text-ink transition-colors underline underline-offset-4"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

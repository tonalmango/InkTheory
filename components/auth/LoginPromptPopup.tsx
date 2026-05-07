'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, User } from 'lucide-react'

let dismissedForThisPageLoad = false

export function LoginPromptPopup() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (status !== 'unauthenticated') return
    if (pathname.startsWith('/auth') || pathname.startsWith('/checkout')) return
    if (dismissedForThisPageLoad) return

    const timer = window.setTimeout(() => {
      setVisible(true)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [pathname, status])

  if (session) return null

  const dismiss = () => {
    dismissedForThisPageLoad = true
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] z-[70] bg-ink text-cream border border-cream/10 shadow-2xl"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
        >
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-cream/50 hover:text-cream"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="p-5 pr-10">
            <div className="flex items-center gap-2 text-accent mb-3">
              <User size={16} />
              <span className="text-xs font-mono tracking-[3px] uppercase">Members First</span>
            </div>
            <p className="font-display text-2xl leading-tight">Save your cart and unlock faster checkout.</p>
            <p className="text-cream/55 text-sm mt-2 leading-relaxed">
              Sign in to keep wishlists, order history, and drop access in one place.
            </p>
            <Link
              href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}
              className="btn-accent mt-5 inline-flex text-xs py-3 px-5"
              onClick={dismiss}
            >
              SIGN IN
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

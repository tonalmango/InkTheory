// components/layout/Navbar.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useSession } from 'next-auth/react'
import { SearchOverlay } from './SearchOverlay'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, toggleCart } = useCartStore()
  const { data: session } = useSession()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !menuOpen
  const navTextClass = transparent ? 'text-cream' : 'text-ink'
  const mutedNavTextClass = transparent ? 'text-cream/80 hover:text-cream' : 'text-smoke hover:text-ink'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome || menuOpen
            ? 'bg-cream/95 backdrop-blur-sm border-b border-ink/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <span className={`font-display text-2xl md:text-3xl tracking-[4px] sm:tracking-[6px] font-bold transition-colors ${navTextClass}`}>
                InkTheory
              </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm tracking-widest uppercase font-mono transition-colors duration-200 relative group ${
                      pathname.startsWith(link.href) ? navTextClass : mutedNavTextClass
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                        pathname.startsWith(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 hover:text-accent transition-colors ${navTextClass}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className={`p-2 hover:text-accent transition-colors hidden md:block ${navTextClass}`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                href={session ? '/account' : '/auth/signin'}
                className={`p-2 hover:text-accent transition-colors hidden md:block ${navTextClass}`}
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              <button
                onClick={toggleCart}
                className={`p-2 hover:text-accent transition-colors relative ${navTextClass}`}
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems() > 0 && (
                  <motion.span
                    key={totalItems()}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-ink text-[10px] font-mono font-medium rounded-full flex items-center justify-center"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`md:hidden p-2 ${navTextClass}`}
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-cream md:hidden pt-16"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col h-full px-6 py-12 gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="font-display text-4xl text-ink"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-auto flex gap-6">
                <Link href="/wishlist" className="flex items-center gap-2 text-sm text-smoke">
                  <Heart size={16} /> Wishlist
                </Link>
                <Link href={session ? '/account' : '/auth/signin'} className="flex items-center gap-2 text-sm text-smoke">
                  <User size={16} /> {session ? 'Account' : 'Sign In'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

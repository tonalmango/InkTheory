import Link from 'next/link'
import { Camera, Mail, ArrowRight } from 'lucide-react'
import { BRAND_COLLECTIONS, BRAND_COLLECTIONS_ADDITIONAL } from '@/lib/brand'

const MARQUEE_TEXT = 'TOO ONLINE TO BE NORMAL - MADE FOR THE INDIAN MAIN CHARACTER - JOIN THE CIRCLE - '

export function Footer() {
  return (
    <footer className="bg-ink text-cream mt-32 border-t-2 border-accent/30">
      <div className="border-b border-accent/20 overflow-hidden py-6">
        <div className="marquee-inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-mono text-xs tracking-widest uppercase text-accent/70 mx-12">
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-14 border border-accent/30 bg-gradient-to-r from-accent/12 via-accent/5 to-transparent p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[3px] uppercase font-mono text-cream/85 mb-2">Next Drop</p>
              <h3 className="font-display text-3xl md:text-4xl text-cream">Your Next Favorite Fit Is One Scroll Away.</h3>
              <p className="text-cream/65 text-sm md:text-base mt-3 max-w-2xl">
                "Dress like the plot twist, not the background character." Join the drop before sizes vanish.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-accent text-ink px-6 py-3 text-xs tracking-[2px] uppercase font-mono hover:bg-accent-light transition-colors"
              >
                Shop The Drop <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-cream/40 text-cream px-6 py-3 text-xs tracking-[2px] uppercase font-mono hover:border-accent hover:text-accent transition-colors"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
          <div className="md:col-span-2 border-l-4 border-accent/80 pl-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-widest font-bold mb-4 text-accent">INKTHEORY</h2>
            <p className="text-cream/55 text-sm leading-relaxed max-w-md font-light">
              Premium Indian streetwear inspired by culture, cinema, internet energy, and everyday stories.
            </p>
            <p className="text-cream/70 text-sm italic mt-5 max-w-lg border-l border-accent/40 pl-4">
              "Built for late-night playlists, first-day fits, and main-character exits."
            </p>

            <div className="flex gap-5 mt-8">
              <a
                href="https://instagram.com/inktheory.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 transition-colors duration-300 hover:text-accent"
                aria-label="Instagram"
              >
                <Camera size={20} />
              </a>
              <a
                href="https://x.com/inktheory"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-5 h-5 text-cream/50 transition-colors duration-300 hover:text-accent font-mono text-[13px] font-semibold"
                aria-label="X"
              >
                X
              </a>
              <a
                href="mailto:support@inktheory.in"
                className="text-cream/50 transition-colors duration-300 hover:text-accent"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-accent-light mb-6 font-mono font-semibold">Collections</p>
            <ul className="space-y-4">
              {[
                ...BRAND_COLLECTIONS.map((collection) => ({
                  label: collection.title,
                  href: collection.href,
                })),
                ...BRAND_COLLECTIONS_ADDITIONAL.map((collection) => ({
                  label: collection.title,
                  href: collection.href,
                })),
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-accent transition-colors duration-300 relative group">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-accent-light mb-6 font-mono font-semibold">Support</p>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-accent transition-colors duration-300 relative group">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-cream/30 text-xs font-mono">
            Copyright 2026 InkTheory. Too Online To Be Normal.
          </p>
          <div className="flex items-center gap-3 text-cream/40 text-xs font-mono">
            <span className="text-accent">Premium Indian Streetwear</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

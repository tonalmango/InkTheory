import Link from 'next/link'
import { Camera, MessageCircle, Video } from 'lucide-react'

const MARQUEE_TEXT = 'PREMIUM STREETWEAR · PRINT ON DEMAND · SHIPS PAN INDIA · DROP CULTURE · '

export function Footer() {
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="border-b border-cream/10 overflow-hidden py-4">
        <div className="marquee-inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-mono text-sm tracking-[4px] uppercase text-cream/40 mx-8">
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-4xl tracking-[6px] mb-4">InkTheory</h2>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              Premium print-on-demand streetwear crafted for those who wear their identity.
              Ships across India via Quikink.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-cream/40 hover:text-accent transition-colors" aria-label="Instagram">
                <Camera size={18} />
              </a>
              <a href="#" className="text-cream/40 hover:text-accent transition-colors" aria-label="Community">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="text-cream/40 hover:text-accent transition-colors" aria-label="Video">
                <Video size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[3px] uppercase text-cream/30 mb-4 font-mono">Shop</p>
            <ul className="space-y-3">
              {[
                { label: 'Printed Tees', href: '/shop?category=PRINTED_TSHIRT' },
                { label: 'Oversized', href: '/shop?category=OVERSIZED_TEE' },
                { label: 'Hoodies', href: '/shop?category=HOODIE' },
                { label: 'Caps', href: '/shop?category=CAP' },
                { label: 'All Products', href: '/shop' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[3px] uppercase text-cream/30 mb-4 font-mono">Help</p>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs font-mono">
            © 2024 InkTheory. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-cream/20 text-xs font-mono">
            <span>Powered by</span>
            <span className="text-cream/40">Quikink × PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

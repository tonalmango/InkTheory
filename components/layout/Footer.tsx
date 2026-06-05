import Link from 'next/link'
import { Camera, MessageCircle, Video } from 'lucide-react'
import { BRAND_COLLECTIONS } from '@/lib/brand'

const MARQUEE_TEXT = 'TOO ONLINE TO BE NORMAL · MADE FOR THE INDIAN MAIN CHARACTER · JOIN THE CIRCLE · '

export function Footer() {
  return (
    <footer className="bg-ink text-cream mt-32 border-t-2 border-saffron/30">
      <div className="border-b border-saffron/20 overflow-hidden py-6">
        <div className="marquee-inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-mono text-xs tracking-widest uppercase text-saffron/60 mx-12">
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
          <div className="md:col-span-2 border-l-4 border-saffron pl-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-widest font-bold mb-4 text-saffron">INKTHEORY</h2>
            <p className="text-cream/55 text-sm leading-relaxed max-w-md font-light">
              Premium Indian streetwear. Inspired by culture, chaos, memes, and the stories we all live. Not another Scandinavian luxury brand.
            </p>
            <div className="flex gap-5 mt-8">
              <a href="#" className="text-cream/40 hover:text-saffron transition-colors duration-300 hover:scale-125 transform" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="#" className="text-cream/40 hover:text-saffron transition-colors duration-300 hover:scale-125 transform" aria-label="Community">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-cream/40 hover:text-saffron transition-colors duration-300 hover:scale-125 transform" aria-label="Video">
                <Video size={20} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-saffron/70 mb-6 font-mono font-semibold">Collections</p>
            <ul className="space-y-4">
              {[
                ...BRAND_COLLECTIONS.map((collection) => ({
                  label: collection.title,
                  href: collection.href,
                })),
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-saffron transition-colors duration-300 relative group">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-saffron group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-saffron/70 mb-6 font-mono font-semibold">Support</p>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/50 hover:text-saffron transition-colors duration-300 relative group">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-saffron group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-cream/30 text-xs font-mono">
            © 2024 InkTheory. Too Online To Be Normal.™
          </p>
          <div className="flex items-center gap-3 text-cream/40 text-xs font-mono">
            <span className="text-saffron">Made with Desi Energy</span>
            <span>×</span>
            <span>Printrove</span>
            <span>×</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CustomCursor } from '@/components/animations/CustomCursor'
import { Providers } from './providers'
import { ToasterProvider } from './toaster-provider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'INKTHEORY | Too Online To Be Normal',
    template: '%s | INKTHEORY',
  },
  description:
    'Modern Indian streetwear inspired by culture, chaos, Bollywood energy and everyday stories.',
  keywords: ['streetwear', 'indian streetwear', 'Indian culture', 'cinema', 'internet culture', 'graphic tees', 'india'],
  openGraph: {
    title: 'INKTHEORY | Too Online To Be Normal',
    description: 'Modern Indian streetwear inspired by culture, chaos and everyday stories.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-cream text-ink font-body antialiased selection:bg-accent/30 selection:text-ink">
        <Providers>
          <CustomCursor />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  )
}

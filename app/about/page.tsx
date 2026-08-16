// app/about/page.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image src="/about/inktheorypublicaboutabout-hero.png.png"
          alt="InkTheory" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 h-full flex items-end px-6 md:px-12 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <p className="section-label text-cream/50 mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-7xl text-cream">Built For Modern India.</h1>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl">We turn familiar moments into wearable stories.</h2>
            <p className="text-smoke leading-relaxed">
              We grew up on Bollywood, memes, internet culture, wedding dance floors,
              engineering colleges, startup dreams and endless group chats.
            </p>
            <p className="text-smoke leading-relaxed">
              InkTheory turns those moments into wearable stories.
            </p>
            <p className="text-smoke leading-relaxed">
              Every collection begins with something familiar. A phrase. A joke. A memory.
              A cultural moment. Then we put it on heavyweight cotton.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What inspires the drops?', a: 'Indian internet culture, cinema references, pop culture and everyday experiences.' },
              { q: 'Are these just meme tees?', a: 'No. The references are familiar, but the design language stays premium and wearable.' },
              { q: 'How fast is delivery?', a: 'Most orders ship in 5-7 business days across India after payment confirmation.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-ink/10 pb-4">
                <p className="font-medium text-sm mb-2">{q}</p>
                <p className="text-smoke text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <p className="section-label mb-8">The Lore</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: 'Not Trends', body: 'Every drop captures a different side of modern Indian life.' },
              { title: 'Stories', body: 'A phrase, joke, memory or cultural moment becomes the starting point.' },
              { title: 'Heavyweight Cotton', body: 'The reference can be playful. The product still has to feel serious.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <div className="w-8 h-px bg-accent mb-4" />
                <h3 className="font-display text-xl mb-2">{title}</h3>
                <p className="text-smoke text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="mb-8 border border-ink/10 bg-cream-dark/40 p-5 md:p-6 max-w-xl mx-auto text-left">
            <p className="section-label mb-3">Reach Us</p>
            <p className="text-sm text-smoke mb-2">Phone</p>
            <a href="tel:8984178559" className="font-mono text-base md:text-lg text-ink hover:text-accent transition-colors">
              8984178559
            </a>
          </div>

          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            SHOP THE DROP <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

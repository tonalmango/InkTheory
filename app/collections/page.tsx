// app/collections/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { BRAND_COLLECTIONS, BRAND_COLLECTIONS_ADDITIONAL } from '@/lib/brand'


export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore InkTheory collections inspired by modern Indian culture, Bollywood energy and everyday desi lore.',
}

const collections = [
  { ...BRAND_COLLECTIONS[0], image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80' },
  { ...BRAND_COLLECTIONS[1], image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
  { ...BRAND_COLLECTIONS[2], image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80' },
  { ...BRAND_COLLECTIONS[3], image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80' },
  { ...BRAND_COLLECTIONS[4], image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80' },
  { ...BRAND_COLLECTIONS_ADDITIONAL[0], image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80' },
  { ...BRAND_COLLECTIONS_ADDITIONAL[1], image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
]


export default function CollectionsPage() {
  return (
    <div className="pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <p className="section-label mb-3">Shop</p>
          <h1 className="display-heading text-4xl md:text-5xl">Find your fit.</h1>

          <p className="text-smoke text-sm mt-3 max-w-xl">
            Seven collections. One rule: wear it like you mean it.
          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <Link key={col.href} href={col.href}
              className="group relative block overflow-hidden aspect-[4/5] bg-cream-dark">
              <Image src={col.image} alt={col.title} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-xs font-mono tracking-[3px] uppercase text-accent mb-2 block">
                  {col.tag}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-cream leading-tight mb-1">
                  {col.title}
                </h2>
                <p className="text-cream/60 text-sm">{col.description}</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 border border-cream/40 flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                <span className="text-cream text-xs">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

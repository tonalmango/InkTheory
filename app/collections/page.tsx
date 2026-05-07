// app/collections/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Collections' }

const collections = [
  {
    title: 'Urban Essentials',
    subtitle: 'Core graphic tees for everyday wear',
    href: '/shop?category=PRINTED_TSHIRT',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    tag: 'Printed Tees',
  },
  {
    title: 'Oversized Culture',
    subtitle: 'Drop-shoulder fits with bold graphics',
    href: '/shop?category=OVERSIZED_TEE',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    tag: 'Oversized',
  },
  {
    title: 'Heavy Weights',
    subtitle: 'Premium hoodies & sweatshirts',
    href: '/shop?category=HOODIE',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    tag: 'Hoodies',
  },
  {
    title: 'Top It Off',
    subtitle: 'Caps, beanies & accessories',
    href: '/shop?category=CAP',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    tag: 'Accessories',
  },
  {
    title: 'Trending Now',
    subtitle: 'What everyone is wearing this season',
    href: '/shop?trending=true',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80',
    tag: 'Trending',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh drops, straight from the press',
    href: '/shop?sort=newest',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    tag: 'New',
  },
]

export default function CollectionsPage() {
  return (
    <div className="pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <p className="section-label mb-3">Browse</p>
          <h1 className="display-heading text-4xl md:text-5xl">Collections</h1>
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
                <p className="text-cream/60 text-sm">{col.subtitle}</p>
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

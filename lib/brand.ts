export const BRAND_COLLECTIONS = [
  {
    key: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Fresh drops. Fresh fits.',
    productDescription: 'New prints for the main character energy.',
    href: '/shop?sort=newest',
    tag: 'Just Dropped',
    chapter: 'Chapter 01',
    cue: 'New',
    accent: '#D97706',
    keywords: ['new', 'arrivals', 'fresh'],
  },
  {
    key: 'best-sellers',
    title: 'Best Sellers',
    description: 'The ones people keep re-ordering.',
    productDescription: 'Fan favorites, built for repeat wear.',
    href: '/shop?featured=true',
    tag: 'Top Picks',
    chapter: 'Chapter 02',
    cue: 'Popular',
    accent: '#C9A227',
    keywords: ['best', 'bestseller', 'top', 'featured'],
  },
  {
    key: 'graphic-tees',
    title: 'Graphic Tees',
    description: 'Oversized graphics. Clean execution.',
    productDescription: 'Printed tees made to start conversations.',
    href: '/shop?category=PRINTED_TSHIRT',
    tag: 'Printed',
    chapter: 'Chapter 03',
    cue: 'Graphic',
    accent: '#1E40AF',
    keywords: ['graphic', 'printed', 'tee'],
  },
  {
    key: 'oversized-fits',
    title: 'Oversized Fits',
    description: 'Roomy silhouettes. Zero apology.',
    productDescription: 'Fits that sit right and move harder.',
    href: '/shop?category=OVERSIZED_TEE',
    tag: 'Big Energy',
    chapter: 'Chapter 04',
    cue: 'Oversized',
    accent: '#991B1B',
    keywords: ['oversized', 'large', 'roomy'],
  },
  {
    key: 'hoodies',
    title: 'Hoodies',
    description: 'Warm layers for cooler timelines.',
    productDescription: 'Cozy fits with printed attitude.',
    href: '/shop?category=HOODIE',
    tag: 'Warm',
    chapter: 'Chapter 05',
    cue: 'Hooded',
    accent: '#D97706',
    keywords: ['hoodie', 'sweat', 'warm'],
  },
]

export const BRAND_COLLECTIONS_ADDITIONAL = [
  {
    key: 'accessories',
    title: 'Accessories',
    description: 'Small pieces. Big statement.',
    productDescription: 'Caps and add-ons that finish the fit.',
    href: '/shop?category=ACCESSORY',
    tag: 'Extras',
    chapter: 'Chapter 06',
    cue: 'Accessory',
    accent: '#C9A227',
    keywords: ['accessory', 'cap'],
  },
  {
    key: 'limited-drops',
    title: 'Limited Drops',
    description: 'When it’s gone, it’s gone.',
    productDescription: 'Small batch prints made for fast decisions.',
    href: '/shop?q=limited',
    tag: 'Small Batch',
    chapter: 'Chapter 07',
    cue: 'Limited',
    accent: '#1E40AF',
    keywords: ['limited', 'drop'],
  },
]


type ProductCopySource = {
  name?: string | null
  description?: string | null
  category?: string | null
  tags?: string[] | null
}

export function getProductBrandCollection(product: ProductCopySource) {
  const searchable = [
    product.name,
    product.description,
    product.category,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const matched = BRAND_COLLECTIONS.find((collection) =>
    collection.keywords.some((keyword) => searchable.includes(keyword))
  )
  if (matched) return matched

  const category = product.category || ''
  // Map product categories to the nearest MVP collection.
  if (category === 'HOODIE' || category === 'SWEATSHIRT') return BRAND_COLLECTIONS.find(c => c.key === 'hoodies') || BRAND_COLLECTIONS[0]
  if (category === 'OVERSIZED_TEE') return BRAND_COLLECTIONS.find(c => c.key === 'oversized-fits') || BRAND_COLLECTIONS[0]
  if (category === 'CAP' || category === 'ACCESSORY') return (BRAND_COLLECTIONS_ADDITIONAL[0]) || BRAND_COLLECTIONS[0]
  if (category === 'PRINTED_TSHIRT') return BRAND_COLLECTIONS.find(c => c.key === 'graphic-tees') || BRAND_COLLECTIONS[0]
  return BRAND_COLLECTIONS.find(c => c.key === 'new-arrivals') || BRAND_COLLECTIONS[0]
}


export function getProductBrandDescription(product: ProductCopySource) {
  return getProductBrandCollection(product).productDescription
}

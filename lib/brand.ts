export const BRAND_COLLECTIONS = [
  {
    key: 'scene-kya-hai',
    title: 'SCENE KYA HAI?™',
    description: 'The official uniform of Indian internet behaviour.',
    productDescription: "The official uniform of people who always know what's happening.",
    href: '/shop?q=Scene%20Kya%20Hai',
    tag: 'Indian Internet',
    keywords: ['scene kya hai', 'kalesh', 'dekhte hain', 'bhai dekh', 'ho jayega', 'internet'],
  },
  {
    key: 'bollywood-brainrot',
    title: 'BOLLYWOOD BRAINROT™',
    description: 'For people who treat everyday life like cinema.',
    productDescription: 'For people whose internal monologue has background music.',
    href: '/shop?q=Bollywood%20Brainrot',
    tag: 'Cinema Energy',
    keywords: ['bollywood', 'picture abhi baaki', 'entry maaro', 'interval', 'background music', 'end credits', 'cinema'],
  },
  {
    key: 'aukaat-pending',
    title: 'AUKAAT PENDING™',
    description: "Built for people who aren't there yet, but will be.",
    productDescription: 'Rich in potential. Financially loading.',
    href: '/shop?q=Aukaat%20Pending',
    tag: 'Luxury Loading',
    keywords: ['aukaat', 'rich in potential', 'luxury loading', 'future crorepati', 'emi', 'not there yet'],
  },
  {
    key: 'desi-lore',
    title: 'DESI LORE™',
    description: 'The unofficial handbook of Indian life.',
    productDescription: "Some things don't need explanation.",
    href: '/shop?q=Desi%20Lore',
    tag: 'Cultural Code',
    keywords: ['desi lore', 'trust me bro', 'bhai ka contact', 'internal matter', 'adjust kar lo'],
  },
  {
    key: 'setting-ho-jayega',
    title: 'SETTING HO JAYEGA™',
    description: "India's most powerful operating system.",
    productDescription: "If there's a way, we'll find it.",
    href: '/shop?q=Setting%20Ho%20Jayega',
    tag: 'Jugaad Mode',
    keywords: ['setting ho jayega', 'kaam ho jayega', 'jugaad', 'contact hai', 'dekh lenge'],
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
  if (category === 'HOODIE' || category === 'SWEATSHIRT') return BRAND_COLLECTIONS[1]
  if (category === 'OVERSIZED_TEE') return BRAND_COLLECTIONS[3]
  if (category === 'CAP' || category === 'ACCESSORY') return BRAND_COLLECTIONS[4]
  return BRAND_COLLECTIONS[0]
}

export function getProductBrandDescription(product: ProductCopySource) {
  return getProductBrandCollection(product).productDescription
}

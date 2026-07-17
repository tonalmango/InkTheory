export const STOREFRONT_CATEGORIES = [
  {
    key: 'trending',
    title: 'Trending',
    href: '/shop?trending=true',
    description: 'The pieces getting all the attention right now.',
    cue: 'Now Showing',
    accent: '#C8A951',
    tags: ['trending'],
  },
  {
    key: 'pop-culture',
    title: 'Pop Culture',
    href: '/shop?tags=pop-culture',
    description: 'Cinema, internet moments, and culture-coded graphics.',
    cue: 'Feature Presentation',
    accent: '#D97706',
    tags: ['pop-culture', 'pop culture', 'cinema', 'internet culture'],
  },
  {
    key: 'couple',
    title: 'Couple',
    href: '/shop?tags=couple',
    description: 'Matching energy without making it too obvious.',
    cue: 'Double Feature',
    accent: '#991B1B',
    tags: ['couple', 'matching', 'pair'],
  },
  {
    key: 'comic',
    title: 'Comic',
    href: '/shop?tags=comic',
    description: 'Panel-ready graphics with a premium streetwear finish.',
    cue: 'Chapter 04',
    accent: '#1E40AF',
    tags: ['comic', 'comics', 'cartoon', 'anime'],
  },
]

type StorefrontCategoryProduct = {
  tags?: string[] | null
  isTrending?: boolean | null
}

export function getStorefrontCategory(product: StorefrontCategoryProduct) {
  if (product.isTrending) return STOREFRONT_CATEGORIES[0]

  const tags = (product.tags || []).map((tag) => tag.toLowerCase())
  return (
    STOREFRONT_CATEGORIES.slice(1).find((category) =>
      category.tags.some((tag) => tags.includes(tag))
    ) || STOREFRONT_CATEGORIES[1]
  )
}

// app/page.tsx
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { WhyInkTheory } from '@/components/home/WhyInkTheory'
import { FeaturedDrop } from '@/components/home/FeaturedDrop'
import { InstagramCommunity } from '@/components/home/InstagramCommunity'
import { Newsletter } from '@/components/ui/Newsletter'

import { prisma } from '@/lib/prisma'



export const dynamic = 'force-dynamic'

async function getHomeData() {
  if (!process.env.DATABASE_URL) {
    return { featured: [], trending: [] }
  }

  const [featured, trending] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { variants: { where: { isAvailable: true } } },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isTrending: true },
      include: { variants: { where: { isAvailable: true } } },
      take: 4,
    }),
  ])

  return { featured, trending }
}

export default async function HomePage() {
  const { featured, trending } = await getHomeData()

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={featured} />
      <FeaturedDrop />
      <WhyInkTheory />
      <InstagramCommunity />
      <Newsletter />

    </>

  )
}

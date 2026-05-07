// app/page.tsx
import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeSection } from '@/components/home/MarqueeSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { TrendingSection } from '@/components/home/TrendingSection'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { TrustBar } from '@/components/home/TrustBar'
import { WhyInkTheory } from '@/components/home/WhyInkTheory'
import { FaqSection } from '@/components/home/FaqSection'
import { FeaturedDrop } from '@/components/home/FeaturedDrop'
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
      <TrustBar />
      <MarqueeSection />
      <FeaturedDrop />
      <FeaturedProducts products={featured} />
      <CategoryGrid />
      <WhyInkTheory />
      <TrendingSection products={trending} />
      <AboutTeaser />
      <FaqSection />
    </>
  )
}

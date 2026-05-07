// lib/ai/productRecommender.ts
// PLACEHOLDER: Future AI-powered product recommendations
// Currently uses rule-based collaborative filtering

import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

/**
 * Rule-based product recommendations
 * TODO: Replace with vector similarity search + ML collaborative filtering
 */

export async function getRelatedProducts(productId: string, limit = 4) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { category: true, tags: true },
  })

  if (!product) return []

  return prisma.product.findMany({
    where: {
      id: { not: productId },
      isActive: true,
      category: product.category,
    },
    include: { variants: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTrendingProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isTrending: true },
    include: { variants: true },
    take: limit,
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getCustomersAlsoBought(productId: string, limit = 4) {
  // Find orders containing this product
  const orders = await prisma.orderItem.findMany({
    where: { productId },
    select: { orderId: true },
    take: 100,
  })

  const orderIds = orders.map((o) => o.orderId)
  if (!orderIds.length) return getRelatedProducts(productId, limit)

  // Find other products in those orders
  const coProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      orderId: { in: orderIds },
      productId: { not: productId },
    },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: limit,
  })

  return prisma.product.findMany({
    where: {
      id: { in: coProducts.map((p) => p.productId) },
      isActive: true,
    },
    include: { variants: true },
  })
}

export async function getProductsByCategory(category: Category, excludeId?: string, limit = 8) {
  return prisma.product.findMany({
    where: {
      category,
      isActive: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    include: { variants: true },
    take: limit,
    orderBy: { isFeatured: 'desc' },
  })
}

/**
 * FUTURE AI HOOKS
 * - Semantic similarity via product embeddings
 * - Personalized recommendations based on browsing history
 * - Cross-sell with price optimization
 */

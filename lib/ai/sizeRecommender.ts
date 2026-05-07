// lib/ai/sizeRecommender.ts
// PLACEHOLDER: Future AI-powered size recommendation
// Currently uses rule-based logic from database size charts

import type { SizeChartEntry } from '@/types'
export type { SizeChartEntry } from '@/types'

export interface SizeInput {
  heightCm: number
  weightKg: number
  fitPreference?: 'slim' | 'regular' | 'oversized'
}

export interface SizeResult {
  recommendedSize: string
  confidence: number
  reason: string
  alternateSize?: string
}

/**
 * Rule-based size recommendation using stored size charts.
 * TODO: Replace with AI model (fine-tuned on user purchase + return data)
 */
export function recommendSize(input: SizeInput, sizeChart: SizeChartEntry[]): SizeResult {
  const { heightCm, weightKg, fitPreference = 'regular' } = input

  // Find matching size based on height and weight
  let bestMatch: SizeChartEntry | null = null
  let fallback: SizeChartEntry | null = null

  for (const entry of sizeChart) {
    const heightMatch = heightCm >= entry.minHeight && heightCm <= entry.maxHeight
    const weightMatch = weightKg >= entry.minWeight && weightKg <= entry.maxWeight

    if (heightMatch && weightMatch) {
      bestMatch = entry
      break
    }

    // Partial match
    if (heightMatch || weightMatch) {
      fallback = entry
    }
  }

  const match = bestMatch || fallback

  if (!match) {
    return {
      recommendedSize: 'L',
      confidence: 0.4,
      reason: 'Default recommendation - measurements outside standard range',
    }
  }

  // Adjust for fit preference
  const sortedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const currentIndex = sortedSizes.indexOf(match.size)

  let finalSize = match.size
  let alternateSize: string | undefined

  if (fitPreference === 'oversized' && currentIndex < sortedSizes.length - 1) {
    finalSize = sortedSizes[currentIndex + 1]
    alternateSize = match.size
  } else if (fitPreference === 'slim' && currentIndex > 0) {
    finalSize = sortedSizes[currentIndex - 1]
    alternateSize = match.size
  }

  return {
    recommendedSize: finalSize,
    confidence: bestMatch ? 0.92 : 0.72,
    reason: bestMatch
      ? `Based on your height (${heightCm}cm) and weight (${weightKg}kg)`
      : `Estimated based on your measurements`,
    alternateSize,
  }
}

/**
 * FUTURE AI HOOK
 * async function aiRecommendSize(input: SizeInput, productId: string): Promise<SizeResult>
 * Will use ML model trained on anonymized purchase + return data
 */

// components/product/ReviewForm.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Review } from '@/types'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface Props {
  productId: string
  reviews: Review[]
  avgRating: number
  totalReviews: number
}

export function ReviewSection({ productId, reviews, avgRating, totalReviews }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) { router.push('/auth/signin'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, body }),
      })
      if (!res.ok) throw new Error('Failed to submit review')
      toast.success('Review submitted!')
      setShowForm(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-ink/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="display-heading text-2xl md:text-3xl mb-2">
            Customer Reviews
          </h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(avgRating) ? 'fill-accent text-accent' : 'text-mist'}
                  />
                ))}
              </div>
              <span className="text-smoke text-sm">
                {avgRating.toFixed(1)} out of 5 · {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => session ? setShowForm(!showForm) : router.push('/auth/signin')}
          className="btn-secondary text-xs py-2.5 whitespace-nowrap"
        >
          {showForm ? 'CANCEL' : 'WRITE A REVIEW'}
        </button>
      </div>

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-accent/30 bg-accent/5 p-6 mb-8 overflow-hidden space-y-4"
          >
            <h3 className="font-mono text-sm tracking-[3px] uppercase">Your Review</h3>

            {/* Star picker */}
            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      size={24}
                      className={`transition-colors ${
                        i < (hovered || rating) ? 'fill-accent text-accent' : 'text-mist'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarise your experience"
                maxLength={100}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
                Review (optional)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell others what you think about the fit, quality, and print…"
                rows={4}
                maxLength={1000}
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-3 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              SUBMIT REVIEW
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 border border-ink/10">
          <Star size={32} className="text-mist mx-auto mb-3" />
          <p className="text-smoke text-sm font-mono tracking-widest">NO REVIEWS YET</p>
          <p className="text-smoke text-xs mt-1">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-ink/10 pb-6">
              <div className="flex items-start gap-3 mb-3">
                {review.user?.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || ''}
                    width={36}
                    height={36}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 bg-ink text-cream text-xs flex items-center justify-center rounded-full flex-shrink-0 font-mono">
                    {review.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{review.user?.name || 'Customer'}</p>
                    {review.isVerified && (
                      <span className="text-[10px] font-mono bg-green-50 text-green-600 px-1.5 py-0.5">
                        ✓ Verified Purchase
                      </span>
                    )}
                    <span className="text-xs text-mist">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="flex mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? 'fill-accent text-accent' : 'text-mist'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {review.title && (
                <p className="font-medium text-sm mb-1">{review.title}</p>
              )}
              {review.body && (
                <p className="text-sm text-smoke leading-relaxed">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

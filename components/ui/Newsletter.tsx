// components/ui/Newsletter.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Replace with actual newsletter API (Mailchimp, ConvertKit, etc.)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="bg-cream-dark border-t border-ink/10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="section-label mb-3">Newsletter</p>
        <h2 className="display-heading text-3xl md:text-4xl mb-3">
          Get Drop Alerts.
        </h2>
        <p className="text-smoke text-sm mb-8 max-w-md mx-auto">
          New arrivals + limited drops. Zero spam.
        </p>


        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-green-600"
            >
              <CheckCircle2 size={20} />
              <p className="font-mono text-sm tracking-widest">YOU'RE ON THE LIST!</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field flex-1 bg-cream"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>I'M IN <ArrowRight size={13} /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-mist text-xs mt-4 font-mono">
          Unsubscribe anytime · no spam
        </p>
      </div>
    </section>
  )
}

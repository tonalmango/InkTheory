'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders ship across India in 5-7 business days after payment confirmation. Tracking appears in your account once the order is dispatched.',
  },
  {
    q: 'Can I pay with UPI or cards?',
    a: 'Checkout is powered by PayPal. Cards and UPI can appear when they are enabled for your PayPal account and buyer region.',
  },
  {
    q: 'Are products printed after I order?',
    a: 'Yes. InkTheory uses print-on-demand fulfillment through Quikink, which helps keep drops fresh and avoids unnecessary inventory waste.',
  },
  {
    q: 'Can I return or exchange a size?',
    a: 'Returns are supported within the stated return window for eligible products. Use the size finder on product pages before ordering for a better fit.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="display-heading text-4xl md:text-5xl">Before You Checkout</h2>
        </div>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, index) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-base md:text-lg">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform ${open === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-smoke text-sm md:text-base leading-relaxed pb-5 max-w-2xl">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

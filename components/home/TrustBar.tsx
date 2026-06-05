'use client'
import { motion } from 'framer-motion'
import { CheckCircle, Lock, MessageCircle, ShoppingBag } from 'lucide-react'

const items = [
  { icon: ShoppingBag, label: 'Made to order', text: 'Fresh prints, no dead stock' },
  { icon: CheckCircle, label: 'Quality checked', text: 'Every piece gets a final look' },
  { icon: Lock, label: 'Secure checkout', text: 'PayPal protected payments' },
  { icon: MessageCircle, label: 'Human support', text: 'Real help, no scripted drama' },
]

export function TrustBar() {
  return (
    <section className="bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, label, text }, index) => (
            <motion.div
              key={label}
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Icon size={18} className="text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono uppercase tracking-[2px]">{label}</p>
                <p className="text-xs text-cream/50 mt-1 leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

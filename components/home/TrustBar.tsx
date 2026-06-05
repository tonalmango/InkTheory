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
    <section className="bg-ink text-cream border-y border-saffron/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ icon: Icon, label, text }, index) => (
            <motion.div
              key={label}
              className="flex items-start gap-4 group"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Icon size={22} className="text-saffron mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="flex-1">
                <p className="text-xs font-mono uppercase tracking-widest text-cream font-semibold">{label}</p>
                <p className="text-xs text-cream/55 mt-1.5 leading-relaxed font-light">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

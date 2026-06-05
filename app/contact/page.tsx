'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Camera, MessageCircle, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Unable to send message right now.')
        return
      }

      setSent(true)
      toast.success("Message sent! We'll get back to you within 24 hours.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-12">
          <p className="section-label mb-3">Need Something?</p>
          <h1 className="display-heading text-4xl md:text-5xl">Talk To Us.</h1>
          <p className="text-smoke mt-3 max-w-md">
            Order doubt? Collab idea? Something went full kalesh? Send it here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            {sent ? (
              <motion.div className="flex flex-col items-center text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="font-display text-2xl mb-2">Message Sent.</h3>
                <p className="text-smoke">We'll reply within 24 business hours.</p>
                <button
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', subject: '', message: '', company: '' })
                  }}
                  className="mt-6 text-sm text-accent underline underline-offset-4"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="hidden"
                  aria-hidden="true"
                />
                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                  { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Order #, collab idea, kalesh report' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">{label}</label>
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="input-field"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's happening..."
                    rows={5}
                    className="input-field resize-none"
                    required
                    minLength={10}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <p className="section-label mb-4">Other Ways to Reach Us</p>
              {[
                { icon: Mail, label: 'Email', value: 'support@inktheory.in', href: 'mailto:support@inktheory.in' },
                { icon: Camera, label: 'Instagram', value: '@inktheory.in', href: 'https://instagram.com/inktheory.in' },
                { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 py-4 border-b border-ink/10 hover:text-accent transition-colors group">
                  <Icon size={18} className="text-smoke group-hover:text-accent transition-colors" />
                  <div>
                    <p className="text-xs font-mono text-smoke tracking-widest uppercase">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div>
              <p className="section-label mb-3">Business Hours</p>
              <p className="text-sm text-smoke">Monday - Saturday: 10am - 7pm IST</p>
              <p className="text-sm text-smoke">Sundays: 12pm - 5pm IST</p>
              <p className="text-sm text-smoke mt-2">We typically respond within 24 hours. Group chat speed, almost.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

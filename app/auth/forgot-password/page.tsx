'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.error || 'Failed to process request')
        return
      }

      toast.success('Reset link sent! Check your email.')
      setSubmitted(true)
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
          <Link href="/" className="font-display text-3xl tracking-[6px] text-cream">InkTheory</Link>
          <div>
            <h2 className="font-display text-5xl text-cream leading-tight mb-4">
              Check The<br />
              <span className="italic text-accent">Inbox.</span>
            </h2>
            <p className="text-cream/50 max-w-sm">
              We sent the reset link. It expires in 1 hour.
            </p>
          </div>
          <p className="text-cream/20 text-xs font-mono">© 2024 InkTheory</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <motion.div className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="lg:hidden mb-8">
              <Link href="/" className="font-display text-2xl tracking-[4px] text-ink">InkTheory</Link>
            </div>

            <h1 className="display-heading text-3xl mb-4">Check your email</h1>
            <p className="text-smoke text-sm mb-8">
              We've sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-smoke">
                Didn't receive the email? Check your spam folder or try requesting a new link.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full btn-primary py-3"
            >
              Try Another Email
            </button>

            <Link
              href="/auth/signin"
              className="mt-4 flex items-center justify-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <Link href="/" className="font-display text-3xl tracking-[6px] text-cream">InkTheory</Link>
        <div>
            <h2 className="font-display text-5xl text-cream leading-tight mb-4">
            Reset The<br />
            <span className="italic text-accent">Password.</span>
          </h2>
          <p className="text-cream/50 max-w-sm">
            Forgot it? Happens. Drop your email and we will send a reset link.
          </p>
        </div>
        <p className="text-cream/20 text-xs font-mono">© 2024 InkTheory</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className="lg:hidden mb-8">
            <Link href="/" className="font-display text-2xl tracking-[4px] text-ink">InkTheory</Link>
          </div>

          <h1 className="display-heading text-3xl mb-2">Forgot password?</h1>
          <p className="text-smoke text-sm mb-8">
            No stress. Enter your email and we will send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              SEND RESET LINK
            </button>
          </form>

          <Link
            href="/auth/signin"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

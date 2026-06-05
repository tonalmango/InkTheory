'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error?.fieldErrors?.password?.[0] || data.error?.fieldErrors?.email?.[0] || data.error || 'Registration failed')
          return
        }
        toast.success('Account created! Signing you in...')
      }

      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
      } else {
        router.push(callbackUrl)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <Link href="/" className="font-display text-3xl tracking-[6px] text-cream">InkTheory</Link>
        <div>
          <h2 className="font-display text-5xl text-cream leading-tight mb-4">
            Premium Drops,<br />
            <span className="italic text-accent">Delivered.</span>
          </h2>
          <p className="text-cream/50 max-w-sm">
            Create an account to save your wishlist, track orders, and get early access to new drops.
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

          <h1 className="display-heading text-3xl mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-smoke text-sm mb-8">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-accent hover:text-accent-dark transition-colors">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <form onSubmit={handleCredentials} className="space-y-4">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="hidden"
              aria-hidden="true"
            />
            {mode === 'register' && (
              <div>
                <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className="input-field" required minLength={2} />
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input-field" required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-smoke tracking-widest uppercase block">Password</label>
                {mode === 'signin' && (
                  <Link href="/auth/forgot-password" className="text-xs text-accent hover:text-accent-dark transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••" className="input-field pr-10" required minLength={10} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

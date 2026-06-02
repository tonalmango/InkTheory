'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface PageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: PageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(true)
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const router = useRouter()

  useEffect(() => {
    // Token validation would happen on submission, not on page load
    // to avoid timing attacks. We'll consider it valid until the user submits.
    setValidating(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.password.length < 10) {
      toast.error('Password must be at least 10 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (typeof data.error === 'object') {
          Object.values(data.error).forEach((err: any) => {
            if (Array.isArray(err)) {
              err.forEach((e: string) => toast.error(e))
            }
          })
        } else {
          toast.error(data.error || 'Failed to reset password')
        }
        if (data.error?.includes('expired') || data.error?.includes('Invalid')) {
          setIsValidToken(false)
        }
        return
      }

      toast.success('Password reset successfully!')
      router.push('/auth/signin?message=password-reset')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
          <Link href="/" className="font-display text-3xl tracking-[6px] text-cream">InkTheory</Link>
          <div>
            <h2 className="font-display text-5xl text-cream leading-tight mb-4">
              Link<br />
              <span className="italic text-accent">Expired.</span>
            </h2>
            <p className="text-cream/50 max-w-sm">
              The password reset link has expired. Please request a new one.
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

            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-red-500" size={24} />
              <h1 className="display-heading text-2xl">Link expired</h1>
            </div>

            <p className="text-smoke text-sm mb-6">
              The password reset link has expired or is invalid. Reset links are valid for 1 hour.
            </p>

            <Link
              href="/auth/forgot-password"
              className="w-full btn-primary py-4 block text-center"
            >
              REQUEST NEW LINK
            </Link>

            <Link
              href="/auth/signin"
              className="mt-4 block text-center text-sm text-accent hover:text-accent-dark transition-colors"
            >
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
            Create a New<br />
            <span className="italic text-accent">Password.</span>
          </h2>
          <p className="text-cream/50 max-w-sm">
            Make sure it's strong and unique to keep your account secure.
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

          <h1 className="display-heading text-3xl mb-2">Reset password</h1>
          <p className="text-smoke text-sm mb-8">
            Enter a new password to secure your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••"
                  className="input-field pr-10"
                  required
                  minLength={10}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-smoke mt-1">At least 10 characters</p>
            </div>

            <div>
              <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••••"
                  className="input-field pr-10"
                  required
                  minLength={10}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              RESET PASSWORD
            </button>
          </form>

          <Link
            href="/auth/signin"
            className="mt-6 block text-center text-sm text-accent hover:text-accent-dark transition-colors"
          >
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

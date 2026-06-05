// app/error.tsx
'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="section-label mb-4">Something went wrong</p>
        <h1 className="display-heading text-3xl md:text-4xl mb-4">Small Kalesh Detected.</h1>
        <p className="text-smoke mb-8 text-sm leading-relaxed">
          Something broke for a second. Try again, or contact support if the drama continues.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-mist mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> TRY AGAIN
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> GO BACK
          </Link>
        </div>
      </div>
    </div>
  )
}

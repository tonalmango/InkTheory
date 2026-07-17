// app/not-found.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="relative mb-8">
          <span className="font-display text-[120px] md:text-[180px] leading-none text-ink/5 select-none">
            404
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="font-display text-3xl md:text-4xl text-ink">This Page Took A Wrong Turn.</h1>
          </div>
        </div>

        <p className="text-smoke mb-8 leading-relaxed">
          This page is currently undergoing character development.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> GO BACK
          </Link>
        </div>
      </div>
    </div>
  )
}

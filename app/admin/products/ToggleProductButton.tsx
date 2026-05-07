// app/admin/products/ToggleProductButton.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  field: 'isActive' | 'isFeatured' | 'isTrending'
  value: boolean
}

export function ToggleProductButton({ productId, field, value }: Props) {
  const [current, setCurrent] = useState(value)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    setLoading(true)
    const next = !current
    setCurrent(next)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: next }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      setCurrent(current) // revert
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        current ? 'bg-accent' : 'bg-ink/20'
      } ${loading ? 'opacity-50' : ''}`}
      role="switch"
      aria-checked={current}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          current ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

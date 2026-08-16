// app/admin/orders/AdminOrderActions.tsx
'use client'
import { useState } from 'react'
import { RefreshCw, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  orderId: string
  currentStatus: string
  hasFulfillment: boolean
}

export function AdminOrderActions({ orderId, currentStatus, hasFulfillment }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submitForFulfillment = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/orders/${orderId}/resubmit`, { method: 'POST' })
      toast.success('Submitted for fulfillment')
      router.refresh()
    } catch {
      toast.error('Failed to resubmit')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success('Status updated')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {!hasFulfillment && currentStatus !== 'CANCELLED' && (
        <button
          onClick={submitForFulfillment}
          disabled={loading}
          title="Submit for fulfillment"
          className="p-1.5 text-smoke hover:text-ink transition-colors border border-ink/10 hover:border-ink/30"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      )}

      {['PENDING', 'CONFIRMED'].includes(currentStatus) && (
        <button
          onClick={() => updateStatus('CANCELLED')}
          disabled={loading}
          title="Cancel Order"
          className="p-1.5 text-smoke hover:text-red-500 transition-colors border border-ink/10 hover:border-red-200"
        >
          <XCircle size={12} />
        </button>
      )}
    </div>
  )
}

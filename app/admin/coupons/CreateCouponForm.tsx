// app/admin/coupons/CreateCouponForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export function CreateCouponForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    minOrderValue: '',
    maxUses: '',
    expiresAt: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.value) return
    setLoading(true)

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: Number(form.value),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create')

      toast.success(`Coupon ${data.coupon.code} created!`)
      setForm({ code: '', type: 'PERCENTAGE', value: '', minOrderValue: '', maxUses: '', expiresAt: '' })
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-ink/10 p-5">
      <div>
        <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
          Coupon Code
        </label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          placeholder="SUMMER20"
          className="input-field font-mono tracking-widest"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
            className="input-field"
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
            {form.type === 'PERCENTAGE' ? 'Discount %' : 'Discount ₹'}
          </label>
          <input
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder={form.type === 'PERCENTAGE' ? '10' : '200'}
            className="input-field"
            min="1"
            max={form.type === 'PERCENTAGE' ? '100' : undefined}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
            Min Order (₹)
          </label>
          <input
            type="number"
            value={form.minOrderValue}
            onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            placeholder="1000"
            className="input-field"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
            Max Uses
          </label>
          <input
            type="number"
            value={form.maxUses}
            onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
            placeholder="Unlimited"
            className="input-field"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
          Expiry Date
        </label>
        <input
          type="datetime-local"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        CREATE COUPON
      </button>
    </form>
  )
}

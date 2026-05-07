// app/account/addresses/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Trash2, Star } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Address {
  id: string
  name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (status === 'authenticated') {
      fetch('/api/addresses')
        .then((r) => r.json())
        .then((d) => setAddresses(d.addresses || []))
        .finally(() => setLoading(false))
    }
  }, [status])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setAddresses((prev) => [...prev, data.address])
      setAdding(false)
      setForm({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
      toast.success('Address saved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Address removed')
    }
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-smoke hover:text-ink transition-colors text-sm">Account</Link>
          <span className="text-mist">/</span>
          <span className="text-sm">Addresses</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-2">Saved</p>
            <h1 className="display-heading text-3xl">My Addresses</h1>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-2 text-sm font-mono text-ink border border-ink/20 px-4 py-2 hover:border-ink transition-colors"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {adding && (
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-accent/30 bg-accent/5 p-6 mb-6 space-y-4 overflow-hidden"
            >
              <h3 className="font-mono text-sm tracking-[3px] uppercase">New Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
                  { key: 'phone', label: 'Phone', placeholder: '9876543210', required: true },
                  { key: 'line1', label: 'Address Line 1', placeholder: 'House/Flat, Street', required: true },
                  { key: 'line2', label: 'Address Line 2', placeholder: 'Landmark (optional)', required: false },
                  { key: 'city', label: 'City', placeholder: 'Mumbai', required: true },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra', required: true },
                  { key: 'pincode', label: 'PIN Code', placeholder: '400001', required: true },
                ].map(({ key, label, placeholder, required }) => (
                  <div key={key} className={key === 'line1' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-1.5">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      required={required}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="accent-accent"
                />
                Set as default address
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary text-xs py-3">
                  {saving ? 'SAVING...' : 'SAVE ADDRESS'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="btn-secondary text-xs py-3"
                >
                  CANCEL
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Addresses list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-ink/10">
            <MapPin size={40} className="text-mist mb-4" />
            <p className="text-smoke font-mono text-sm tracking-widest mb-4">NO SAVED ADDRESSES</p>
            <button onClick={() => setAdding(true)} className="text-sm text-accent underline underline-offset-4">
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border p-5 relative ${addr.isDefault ? 'border-accent/40 bg-accent/5' : 'border-ink/10'}`}
              >
                {addr.isDefault && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-mono text-accent">
                    <Star size={11} className="fill-accent" /> Default
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{addr.name}</p>
                    <p className="text-sm text-smoke">{addr.phone}</p>
                    <p className="text-sm text-smoke mt-1">{addr.line1}</p>
                    {addr.line2 && <p className="text-sm text-smoke">{addr.line2}</p>}
                    <p className="text-sm text-smoke">
                      {addr.city}, {addr.state} {addr.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-mist hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

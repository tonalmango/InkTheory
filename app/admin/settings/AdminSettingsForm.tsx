'use client'
import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminSettingsForm({ name, email }: { name: string; email: string }) {
  const [form, setForm] = useState({
    name,
    email,
    currentPassword: '',
    newPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Unable to update admin profile')
        return
      }
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }))
      toast.success('Admin profile updated')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <div>
        <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Admin Name</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          minLength={2}
        />
      </div>
      <div>
        <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Admin Email</label>
        <input
          className="input-field"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">Current Password</label>
          <input
            className="input-field"
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-smoke tracking-widest uppercase block mb-2">New Password</label>
          <input
            className="input-field"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            autoComplete="new-password"
            minLength={10}
          />
        </div>
      </div>
      <button className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        SAVE SETTINGS
      </button>
    </form>
  )
}

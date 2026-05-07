// components/ui/Toast.tsx
'use client'
// We use react-hot-toast globally. This file provides helpers and custom toast styles.
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

export const notify = {
  success: (msg: string) =>
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 bg-ink text-cream px-4 py-3 rounded-sm shadow-lg transition-all ${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
        <span className="text-sm font-body">{msg}</span>
      </div>
    )),

  error: (msg: string) =>
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 bg-ink text-cream px-4 py-3 rounded-sm shadow-lg transition-all ${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <XCircle size={16} className="text-red-400 flex-shrink-0" />
        <span className="text-sm font-body">{msg}</span>
      </div>
    )),

  info: (msg: string) =>
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 bg-ink text-cream px-4 py-3 rounded-sm shadow-lg transition-all ${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <Info size={16} className="text-blue-400 flex-shrink-0" />
        <span className="text-sm font-body">{msg}</span>
      </div>
    )),

  warning: (msg: string) =>
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 bg-ink text-cream px-4 py-3 rounded-sm shadow-lg transition-all ${
          t.visible ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <AlertCircle size={16} className="text-yellow-400 flex-shrink-0" />
        <span className="text-sm font-body">{msg}</span>
      </div>
    )),
}

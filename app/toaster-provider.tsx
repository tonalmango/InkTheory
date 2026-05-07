'use client'
import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0A0A0A',
          color: '#F5F0E8',
          borderRadius: '6px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#C8A951', secondary: '#0A0A0A' } },
      }}
    />
  )
}

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSettingsForm } from './AdminSettingsForm'

export const metadata = { title: 'Admin Settings' }

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin" className="text-smoke hover:text-ink text-sm transition-colors">Admin</Link>
          <span className="text-mist">/</span>
          <span className="text-sm">Settings</span>
        </div>
        <h1 className="display-heading text-3xl md:text-4xl mb-3">Admin Settings</h1>
        <p className="text-smoke text-sm max-w-xl mb-8">
          Change the admin display name, login email, and password after deployment.
        </p>
        <AdminSettingsForm name={session.user.name || ''} email={session.user.email || ''} />
      </div>
    </div>
  )
}

// app/auth/error/page.tsx
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMap: Record<string, string> = {
    OAuthSignin: 'Error starting OAuth sign-in. Please try again.',
    OAuthCallback: 'Error during OAuth callback. Please try again.',
    OAuthCreateAccount: 'Could not create account with this OAuth provider.',
    EmailCreateAccount: 'Could not create account with this email.',
    Callback: 'Error during callback. Please try again.',
    OAuthAccountNotLinked: 'This email is already registered with a different sign-in method.',
    CredentialsSignin: 'Invalid email or password.',
    Default: 'An authentication error occurred. Please try again.',
  }

  const message = errorMap[searchParams.error || ''] || errorMap.Default

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="display-heading text-2xl mb-3">Sign-in Error</h1>
        <p className="text-smoke mb-8">{message}</p>
        <Link href="/auth/signin" className="btn-primary inline-block">
          TRY AGAIN
        </Link>
      </div>
    </div>
  )
}

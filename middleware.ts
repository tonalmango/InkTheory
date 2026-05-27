import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Get token with proper secret
  const token = await getToken({ 
    req, 
    secret: authSecret 
  })

  const isAuthenticated = !!token

  const protectedPaths = ['/account', '/checkout', '/wishlist']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)'],
}

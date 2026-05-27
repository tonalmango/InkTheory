import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { rateLimit } from '@/lib/security/rateLimit'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const providers = [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials)
      if (!parsed.success) return null

      const limited = rateLimit(`signin:${parsed.data.email.toLowerCase()}`, 8, 15 * 60 * 1000)
      if (!limited.success) return null

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
        select: { id: true, email: true, name: true, image: true, password: true, role: true },
      })

      if (!user || !user.password) return null

      const isValid = await bcrypt.compare(parsed.data.password, user.password)
      if (!isValid) return null

      return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role }
    },
  }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
        token.sub = user.id
        token.email = user.email
        token.role = (user as any).role || 'CUSTOMER'
      }

      if (!token.id && token.sub) token.id = token.sub
      if (!token.role) token.role = 'CUSTOMER'

      return token
    },
    async session({ session, token }) {
      const userId = (token?.id as string) || (token?.sub as string)
      if (session.user && userId) {
        session.user.id = userId
        session.user.role = (token.role as string) || 'CUSTOMER'
      }
      return session
    },
  },
})

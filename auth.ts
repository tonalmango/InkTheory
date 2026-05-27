// auth.ts (root level)
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
          allowDangerousEmailAccountLinking: true,
          profile: async (profile) => {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            }
          },
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
      })

      if (!user || !user.password) return null

      const isValid = await bcrypt.compare(parsed.data.password, user.password)
      if (!isValid) return null

      return { id: user.id, email: user.email, name: user.name, image: user.image }
    },
  }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers,
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      // Store user ID in token from initial sign in
      if (user?.id) {
        token.id = user.id
        token.email = user.email
      }

      // OAuth tokens always have sub; use it as id fallback for consistency.
      if (!token.id && token.sub) {
        token.id = token.sub
      }

      // On subsequent requests, ensure token has ID
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.sub = dbUser.id
        }
      }

      // Always update role from database
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        token.role = dbUser?.role || 'CUSTOMER'
      }

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

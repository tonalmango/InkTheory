// app/account/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AccountClient } from './AccountClient'

export default async function AccountPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin?callbackUrl=/account')

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true, fulfillment: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }],
    }),
  ])

  return <AccountClient user={session.user as any} orders={orders as any} addresses={addresses as any} />
}

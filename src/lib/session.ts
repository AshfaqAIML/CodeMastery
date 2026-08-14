import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export type SessionUser = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: string
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return session.user as SessionUser
}

export async function getCurrentUserWithStats() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      totalXP: true,
      points: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      experience: true,
      goal: true,
      interests: true,
      onboarded: true,
      createdAt: true,
    },
  })
  return user
}

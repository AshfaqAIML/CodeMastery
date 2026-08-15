import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Returns subject completion certificate data.
 * A certificate is earned when the user has completed ALL published tutorials
 * in a subject. The certificate includes:
 * - User name, subject name, completion date
 * - Number of tutorials completed
 * - A unique certificate ID (deterministic from user + subject)
 * - Stats: total XP earned from this subject, time spent
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { slug } = await ctx.params

  const subject = await db.subject.findUnique({
    where: { slug, published: true },
    include: {
      tutorials: {
        where: { published: true },
        select: {
          id: true,
          title: true,
          estimatedMinutes: true,
          progress: {
            where: { userId: user.id },
            select: { completed: true, completedAt: true, timeSpentSec: true, xpAwarded: true },
          },
        },
      },
    },
  })
  if (!subject) return notFound("Subject not found.")

  const totalTutorials = subject.tutorials.length
  const completedTutorials = subject.tutorials.filter(
    (t) => t.progress[0]?.completed
  )

  if (completedTutorials.length < totalTutorials || totalTutorials === 0) {
    return ok({
      earned: false,
      completedCount: completedTutorials.length,
      totalCount: totalTutorials,
      percent: totalTutorials > 0 ? Math.round((completedTutorials.length / totalTutorials) * 100) : 0,
    })
  }

  // Certificate earned!
  const totalXP = completedTutorials.reduce(
    (sum, t) => sum + (t.progress[0]?.xpAwarded ?? 0),
    0
  )
  const totalTimeSpent = completedTutorials.reduce(
    (sum, t) => sum + (t.progress[0]?.timeSpentSec ?? 0),
    0
  )
  const estimatedTotalMinutes = subject.tutorials.reduce(
    (sum, t) => sum + t.estimatedMinutes,
    0
  )

  // Find the completion date (last completed tutorial)
  const completionDates = completedTutorials
    .map((t) => t.progress[0]?.completedAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())
  const completedAt = completionDates[0] ?? new Date()

  // Generate a deterministic certificate ID
  const certId = `CM-${subject.slug.slice(0, 4).toUpperCase()}-${user.id.slice(-6).toUpperCase()}`

  return ok({
    earned: true,
    certificateId: certId,
    userName: user.name ?? user.email.split("@")[0],
    subjectName: subject.name,
    subjectSlug: subject.slug,
    subjectColor: subject.color,
    subjectIcon: subject.icon,
    completedAt: completedAt.toISOString(),
    tutorialsCompleted: completedTutorials.length,
    totalTutorials,
    totalXPEarned: totalXP,
    totalTimeSpentMin: Math.round(totalTimeSpent / 60),
    estimatedTotalHours: Math.round((estimatedTotalMinutes / 60) * 10) / 10,
  })
}

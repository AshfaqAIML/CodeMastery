import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUserWithStats } from "@/lib/session"
import { levelFromXP } from "@/lib/gamification"
import { todayStr } from "@/lib/gamification"

export async function GET() {
  const user = await getCurrentUserWithStats()
  if (!user) return unauthorized()

  const [tutorialsCompleted, quizzesPassed, notesCount, bookmarksCount, recentActivity, continueLearning, todayXP] =
    await Promise.all([
      db.tutorialProgress.count({ where: { userId: user.id, completed: true } }),
      db.quizAttempt.count({ where: { userId: user.id, passed: true } }),
      db.note.count({ where: { userId: user.id } }),
      db.bookmark.count({ where: { userId: user.id } }),
      db.activityLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.tutorialProgress.findMany({
        where: { userId: user.id, completed: false, percentRead: { gt: 0 } },
        orderBy: { lastReadAt: "desc" },
        take: 5,
        include: {
          tutorial: {
            select: {
              id: true,
              slug: true,
              title: true,
              estimatedMinutes: true,
              subject: { select: { slug: true, name: true, color: true, icon: true } },
            },
          },
        },
      }),
      user.dailyXPDate === todayStr() ? user.dailyXPEarned : 0,
    ])

  const levelInfo = levelFromXP(user.totalXP)

  return ok({
    user,
    stats: {
      totalXP: user.totalXP,
      points: user.points,
      level: levelInfo.level,
      levelInfo,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      tutorialsCompleted,
      quizzesPassed,
      notesCount,
      bookmarksCount,
      todayXP,
      dailyXPCap: 500,
    },
    continueLearning,
    recentActivity,
  })
}

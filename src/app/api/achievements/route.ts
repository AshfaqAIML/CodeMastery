import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const user = await getCurrentUser()

  const achievements = await db.achievement.findMany({
    orderBy: [{ category: "asc" }, { threshold: "asc" }],
  })

  let unlocked: { achievementId: string; earnedAt: Date }[] = []
  let progressMap: Record<string, number> = {}
  if (user) {
    unlocked = await db.userAchievement.findMany({
      where: { userId: user.id },
      select: { achievementId: true, earnedAt: true },
    })
    // Compute real progress per metric
    const [tutC, quizC, noteC, pathC, u, streak] = await Promise.all([
      db.tutorialProgress.count({ where: { userId: user.id, completed: true } }),
      db.quizAttempt.count({ where: { userId: user.id, passed: true } }),
      db.note.count({ where: { userId: user.id } }),
      db.learningPathProgress.count({ where: { userId: user.id } }),
      db.user.findUnique({ where: { id: user.id }, select: { totalXP: true, currentStreak: true } }),
      db.user.findUnique({ where: { id: user.id }, select: { currentStreak: true } }),
    ])
    const metrics: Record<string, number> = {
      tutorials_completed: tutC,
      quizzes_passed: quizC,
      notes_created: noteC,
      paths_enrolled: pathC,
      xp: u?.totalXP ?? 0,
      streak_days: streak?.currentStreak ?? 0,
    }
    for (const a of achievements) {
      progressMap[a.id] = Math.min(metrics[a.metric] ?? 0, a.threshold)
    }
  }

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId))
  const earnedAtMap = Object.fromEntries(unlocked.map((u) => [u.achievementId, u.earnedAt]))

  return ok({
    achievements: achievements.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
      earnedAt: earnedAtMap[a.id] ?? null,
      progress: progressMap[a.id] ?? 0,
    })),
  })
}

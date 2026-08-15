import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Returns recent notifications for the user:
 * - Achievement unlocks
 * - Streak milestones (3, 7, 14, 30 days)
 * - Quiz passes
 * - Tutorial completions (summarized)
 *
 * Each notification has: id, type, title, description, icon, timestamp, read.
 */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  // Fetch recent activity logs that are "notification-worthy"
  const logs = await db.activityLog.findMany({
    where: {
      userId: user.id,
      type: {
        in: ["achievement_earned", "quiz_passed", "tutorial_completed", "streak_milestone"],
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  // Enrich with details
  const achievementIds = logs
    .filter((l) => l.type === "achievement_earned" && l.refId)
    .map((l) => l.refId!)
  const quizIds = logs
    .filter((l) => l.type === "quiz_passed" && l.refId)
    .map((l) => l.refId!)
  const tutorialIds = logs
    .filter((l) => l.type === "tutorial_completed" && l.refId)
    .map((l) => l.refId!)

  const [achievements, quizzes, tutorials] = await Promise.all([
    achievementIds.length > 0
      ? db.achievement.findMany({ where: { id: { in: achievementIds } }, select: { id: true, title: true, icon: true, color: true } })
      : Promise.resolve([]),
    quizIds.length > 0
      ? db.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, title: true } })
      : Promise.resolve([]),
    tutorialIds.length > 0
      ? db.tutorial.findMany({ where: { id: { in: tutorialIds } }, select: { id: true, title: true, subject: { select: { slug: true, name: true } } } })
      : Promise.resolve([]),
  ])

  const achievementMap = new Map(achievements.map((a) => [a.id, a] as [string, typeof a]))
  const quizMap = new Map(quizzes.map((q) => [q.id, q] as [string, typeof q]))
  const tutorialMap = new Map(tutorials.map((t) => [t.id, t] as [string, typeof t]))

  const notifications = logs.map((log) => {
    let title = ""
    let description = ""
    let icon = "Bell"
    let color = "var(--primary)"

    if (log.type === "achievement_earned") {
      const a = achievementMap.get(log.refId!)
      title = a?.title ?? "Achievement unlocked"
      description = `+${log.xpDelta} XP bonus`
      icon = a?.icon ?? "Trophy"
      color = a?.color ?? "oklch(0.75 0.16 85)"
    } else if (log.type === "quiz_passed") {
      const q = quizMap.get(log.refId!)
      title = "Quiz passed!"
      description = q?.title ?? "A quiz"
      icon = "ClipboardCheck"
      color = "oklch(0.62 0.15 162)"
    } else if (log.type === "tutorial_completed") {
      const t = tutorialMap.get(log.refId!)
      title = "Tutorial completed"
      description = t?.title ?? "A tutorial"
      icon = "BookOpen"
      color = "oklch(0.7 0.13 200)"
    } else if (log.type === "streak_milestone") {
      title = "Streak milestone!"
      description = `+${log.xpDelta} XP earned`
      icon = "Flame"
      color = "oklch(0.68 0.2 30)"
    }

    return {
      id: log.id,
      type: log.type,
      title,
      description,
      icon,
      color,
      xpDelta: log.xpDelta,
      createdAt: log.createdAt,
      read: false, // TODO: track read state
    }
  })

  // Count unread (all for now since we don't track read state)
  const unreadCount = notifications.length

  return ok({ notifications, unreadCount })
}

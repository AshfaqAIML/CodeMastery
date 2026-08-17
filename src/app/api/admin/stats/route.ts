import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"

/** Admin analytics — platform overview + health. Aggregated, privacy-safe. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "analytics.view")
  if (denied) return denied

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    users, activeToday, newLast7d, newLast30d,
    suspended, banned,
    trialActive, premiumActive,
    subjects, tutorials, quizzes, achievements, paths,
    progress, quizAttempts, certificates, certsValid,
    notes, bookmarks, payments, paymentsCompleted,
    aiQueries,
    xpAgg, latestActivity,
  ] = await Promise.all([
    db.user.count(),
    db.activityLog.count({ where: { createdAt: { gte: today } } }),
    db.user.count({ where: { createdAt: { gte: last7d } } }),
    db.user.count({ where: { createdAt: { gte: last30d } } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.user.count({ where: { status: "BANNED" } }),
    db.premiumTrial.count({ where: { status: "ACTIVE", endsAt: { gt: now } } }),
    db.premiumEntitlement.count({ where: { status: "ACTIVE" } }),
    db.subject.count(),
    db.tutorial.count(),
    db.quiz.count(),
    db.achievement.count(),
    db.learningPath.count(),
    db.tutorialProgress.count(),
    db.quizAttempt.count(),
    db.certificate.count(),
    db.certificate.count({ where: { status: "VALID" } }),
    db.note.count(),
    db.bookmark.count(),
    db.payment.count(),
    db.payment.count({ where: { status: "COMPLETED" } }),
    db.activityLog.count({ where: { type: "ai_query" } }),
    db.activityLog.aggregate({ _sum: { xpDelta: true } }),
    db.activityLog.aggregate({ _max: { id: true } }),
  ])

  return ok({
    counts: {
      users, activeToday, newLast7d, newLast30d, suspended, banned,
      trialActive, premiumActive,
      subjects, tutorials, quizzes, achievements, paths,
      progress, quizAttempts, certificates, certsValid,
      notes, bookmarks, payments, paymentsCompleted,
      aiQueries,
      totalXPEarned: xpAgg._sum.xpDelta ?? 0,
    },
    health: {
      db: "ok",
      lastActivityId: latestActivity._max.id ?? null,
      generatedAt: now.toISOString(),
    },
  })
}
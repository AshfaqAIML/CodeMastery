import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Returns a heatmap of the user's learning activity over the last N weeks.
 * Each cell is a day with: date (YYYY-MM-DD), xp earned, and activity count.
 *
 * Used by the dashboard streak calendar widget.
 */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  // Get activity from the last 12 weeks (84 days)
  const days = 84
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)
  startDate.setDate(startDate.getDate() - (days - 1))

  const activities = await db.activityLog.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: startDate },
      xpDelta: { gt: 0 },
    },
    select: { createdAt: true, xpDelta: true },
  })

  // Aggregate by day
  const dayMap = new Map<string, { date: string; xp: number; count: number }>()
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    dayMap.set(dateStr, { date: dateStr, xp: 0, count: 0 })
  }

  for (const a of activities) {
    const dateStr = a.createdAt.toISOString().slice(0, 10)
    const entry = dayMap.get(dateStr)
    if (entry) {
      entry.xp += a.xpDelta
      entry.count += 1
    }
  }

  const cells = Array.from(dayMap.values())
  const maxXP = Math.max(1, ...cells.map((c) => c.xp))

  return ok({
    cells: cells.map((c) => ({
      ...c,
      intensity: c.xp === 0 ? 0 : Math.ceil((c.xp / maxXP) * 4), // 0-4 intensity levels
    })),
    totalDays: days,
    activeDays: cells.filter((c) => c.count > 0).length,
    currentStreak: 0, // filled by client from /api/me
  })
}

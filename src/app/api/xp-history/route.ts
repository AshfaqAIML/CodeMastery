import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Returns XP earned per day for the last N days (default 7).
 * Used by the dashboard XP history chart.
 */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const days = 7
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
  const dayMap = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    dayMap.set(d.toISOString().slice(0, 10), 0)
  }

  for (const a of activities) {
    const dateStr = a.createdAt.toISOString().slice(0, 10)
    const current = dayMap.get(dateStr) ?? 0
    dayMap.set(dateStr, current + a.xpDelta)
  }

  const data = Array.from(dayMap.entries()).map(([date, xp]) => ({
    date,
    xp,
    label: new Date(date + "T00:00:00").toLocaleDateString("en", { weekday: "short" }),
  }))

  const total = data.reduce((sum, d) => sum + d.xp, 0)
  const avg = days > 0 ? Math.round(total / days) : 0

  return ok({ days: data, total, avg })
}

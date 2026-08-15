import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok } from "@/lib/api"
import { levelFromXP } from "@/lib/gamification"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get("period") ?? "all") as "all" | "weekly"
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "50")))

  const where =
    period === "weekly"
      ? {
          activityLogs: {
            some: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } },
          },
        }
      : {}

  const users = await db.user.findMany({
    where,
    orderBy: [{ totalXP: "desc" }, { points: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      totalXP: true,
      points: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
    },
  })

  const ranked = users.map((u, i) => ({
    rank: i + 1,
    ...u,
    levelInfo: levelFromXP(u.totalXP),
  }))

  return ok({ period, entries: ranked })
}

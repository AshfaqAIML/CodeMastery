import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { levelFromXP, todayStr, computeStreak, DAILY_XP_CAP } from "@/lib/gamification"
import { z } from "zod"

const schema = z.object({
  tutorialId: z.string().min(1),
  percentRead: z.number().int().min(0).max(100).optional(),
  scrollY: z.number().int().min(0).optional(),
  timeSpentSec: z.number().int().min(0).max(7200).optional(),
  completed: z.boolean().optional(),
})

// XP awarded per milestone. Reading completion gives the biggest reward.
const XP_READ_MILESTONES = 15 // small XP for hitting a reading milestone (capped daily)
const XP_COMPLETE = 40 // XP for first completion of a tutorial

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())
  const input = parsed.data

  const tutorial = await db.tutorial.findUnique({ where: { id: input.tutorialId } })
  if (!tutorial) return err("Tutorial not found.", 404)

  const existing = await db.tutorialProgress.findUnique({
    where: { userId_tutorialId: { userId: user.id, tutorialId: tutorial.id } },
  })

  const prevPercent = existing?.percentRead ?? 0
  const wasCompleted = existing?.completed ?? false

  const newPercent = Math.max(prevPercent, input.percentRead ?? prevPercent)
  const nowCompleted = wasCompleted || input.completed === true || newPercent >= 100

  // ----- XP & streak (server-side, anti-farming) -----
  let xpAwarded = 0
  let pointsAwarded = 0
  const awardTypes: string[] = []

  const today = todayStr()
  const freshUser = await db.user.findUnique({
    where: { id: user.id },
    select: { totalXP: true, points: true, currentStreak: true, lastActivityDate: true, dailyXPEarned: true, dailyXPDate: true },
  })
  if (!freshUser) return unauthorized()

  // Determine daily cap window
  const capWindow = freshUser.dailyXPDate === today ? freshUser.dailyXPEarned : 0
  const remainingDailyCap = Math.max(0, DAILY_XP_CAP - capWindow)

  // Milestone XP: only when crossing a new 25% threshold upward
  if (input.percentRead !== undefined && !wasCompleted) {
    const prevMilestone = Math.floor(prevPercent / 25)
    const newMilestone = Math.floor(newPercent / 25)
    if (newMilestone > prevMilestone && newMilestone <= 4) {
      const milestoneXP = Math.min(XP_READ_MILESTONES, remainingDailyCap)
      if (milestoneXP > 0) {
        xpAwarded += milestoneXP
        pointsAwarded += Math.floor(milestoneXP / 2)
        awardTypes.push("read_milestone")
      }
    }
  }

  // Completion XP: only the FIRST time
  if (nowCompleted && !wasCompleted) {
    // completions ignore daily cap (achievements-style reward)
    xpAwarded += XP_COMPLETE
    pointsAwarded += 20
    awardTypes.push("tutorial_completed")
  }

  // Streak update
  const streakRes = computeStreak(freshUser.currentStreak, freshUser.lastActivityDate, today)
  let newStreak = freshUser.currentStreak
  let longestStreak = 0
  if (streakRes.incremented) {
    newStreak = streakRes.streak
  }

  // Persist progress + awards transactionally
  const updated = await db.$transaction(async (tx) => {
    const progress = await tx.tutorialProgress.upsert({
      where: { userId_tutorialId: { userId: user.id, tutorialId: tutorial.id } },
      create: {
        userId: user.id,
        tutorialId: tutorial.id,
        percentRead: newPercent,
        scrollY: input.scrollY ?? 0,
        timeSpentSec: (existing?.timeSpentSec ?? 0) + (input.timeSpentSec ?? 0),
        completed: nowCompleted,
        completedAt: nowCompleted && !wasCompleted ? new Date() : existing?.completedAt,
        xpAwarded: (existing?.xpAwarded ?? 0) + xpAwarded,
      },
      update: {
        percentRead: newPercent,
        scrollY: input.scrollY ?? existing?.scrollY ?? 0,
        timeSpentSec: (existing?.timeSpentSec ?? 0) + (input.timeSpentSec ?? 0),
        completed: nowCompleted,
        completedAt: nowCompleted && !wasCompleted ? new Date() : existing?.completedAt,
        xpAwarded: (existing?.xpAwarded ?? 0) + xpAwarded,
        lastReadAt: new Date(),
      },
    })

    if (xpAwarded > 0 || streakRes.incremented) {
      const newTotalXP = freshUser.totalXP + xpAwarded
      const levelInfo = levelFromXP(newTotalXP)
      const longest = Math.max(newStreak, await tx.user.findUnique({ where: { id: user.id }, select: { longestStreak: true } }).then((u) => u?.longestStreak ?? 0))
      longestStreak = longest

      await tx.user.update({
        where: { id: user.id },
        data: {
          totalXP: newTotalXP,
          points: freshUser.points + pointsAwarded,
          level: levelInfo.level,
          currentStreak: newStreak,
          longestStreak: Math.max(longest, newStreak),
          lastActivityDate: today,
          dailyXPEarned: streakRes.isDailyCapReset ? xpAwarded : freshUser.dailyXPEarned + xpAwarded,
          dailyXPDate: streakRes.isDailyCapReset ? today : freshUser.dailyXPDate,
        },
      })

      if (xpAwarded > 0) {
        await tx.activityLog.create({
          data: {
            userId: user.id,
            type: nowCompleted && !wasCompleted ? "tutorial_completed" : "tutorial_read",
            refId: tutorial.id,
            xpDelta: xpAwarded,
            pointsDelta: pointsAwarded,
          },
        })
      }
    }

    return progress
  })

  // Re-evaluate achievements (outside transaction to keep it simple)
  if (awardTypes.length > 0) {
    await evaluateAchievements(user.id)
  }

  const freshStats = await db.user.findUnique({
    where: { id: user.id },
    select: { totalXP: true, points: true, level: true, currentStreak: true, longestStreak: true },
  })

  return ok({
    progress: {
      percentRead: updated.percentRead,
      completed: updated.completed,
      completedAt: updated.completedAt,
      timeSpentSec: updated.timeSpentSec,
    },
    xpAwarded,
    pointsAwarded,
    newStreak,
    streakIncremented: streakRes.incremented,
    stats: freshStats,
  })
}

// Achievement evaluator — queries real metrics and unlocks matching ones
async function evaluateAchievements(userId: string) {
  const [tutorialsCompleted, quizzesPassed, notesCreated, pathsEnrolled, user, streakDays] =
    await Promise.all([
      db.tutorialProgress.count({ where: { userId, completed: true } }),
      db.quizAttempt.count({ where: { userId, passed: true } }),
      db.note.count({ where: { userId } }),
      db.learningPathProgress.count({ where: { userId } }),
      db.user.findUnique({ where: { id: userId }, select: { totalXP: true, currentStreak: true } }),
      db.user.findUnique({ where: { id: userId }, select: { currentStreak: true } }),
    ])

  const metrics: Record<string, number> = {
    tutorials_completed: tutorialsCompleted,
    quizzes_passed: quizzesPassed,
    notes_created: notesCreated,
    paths_enrolled: pathsEnrolled,
    xp: user?.totalXP ?? 0,
    streak_days: streakDays?.currentStreak ?? 0,
  }

  const all = await db.achievement.findMany()
  let totalXPGained = 0
  for (const a of all) {
    const value = metrics[a.metric] ?? 0
    if (value >= a.threshold) {
      const exists = await db.userAchievement.findUnique({
        where: { userId_achievementId: { userId, achievementId: a.id } },
      })
      if (!exists) {
        await db.userAchievement.create({ data: { userId, achievementId: a.id } })
        totalXPGained += a.xpReward
        await db.activityLog.create({
          data: { userId, type: "achievement_earned", refId: a.id, xpDelta: a.xpReward, pointsDelta: 0 },
        })
      }
    }
  }
  // Apply achievement XP in a single update and recompute level
  if (totalXPGained > 0) {
    const updated = await db.user.update({
      where: { id: userId },
      data: { totalXP: { increment: totalXPGained } },
      select: { totalXP: true },
    })
    const newLevel = levelFromXP(updated.totalXP).level
    if (newLevel !== (user?.totalXP ?? 0)) {
      await db.user.update({ where: { id: userId }, data: { level: newLevel } })
    }
  }
}

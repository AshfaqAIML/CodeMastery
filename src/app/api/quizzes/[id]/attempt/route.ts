import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { levelFromXP } from "@/lib/gamification"
import { z } from "zod"

const schema = z.object({
  answers: z.array(z.object({ questionId: z.string(), selectedIndex: z.number().int().min(0) })),
})

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { id } = await ctx.params

  const quiz = await db.quiz.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  })
  if (!quiz) return notFound("Quiz not found.")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  // ----- Server-side scoring -----
  const answers = parsed.data.answers
  let correct = 0
  const answerRecords: { questionId: string; selectedIndex: number; correct: boolean; correctIndex: number; explanation: string | null }[] = []

  for (const q of quiz.questions) {
    const a = answers.find((x) => x.questionId === q.id)
    const isCorrect = !!a && a.selectedIndex === q.answerIndex
    if (isCorrect) correct++
    answerRecords.push({
      questionId: q.id,
      selectedIndex: a?.selectedIndex ?? -1,
      correct: isCorrect,
      correctIndex: q.answerIndex,
      explanation: q.explanation,
    })
  }

  const score = Math.round((correct / quiz.questions.length) * 100)
  const passed = score >= quiz.passingScore

  // XP only on first pass per quiz (prevent farming)
  const priorPass = await db.quizAttempt.findFirst({
    where: { userId: user.id, quizId: quiz.id, passed: true },
  })
  const shouldAward = passed && !priorPass

  const attempt = await db.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score,
      passed,
      xpAwarded: shouldAward ? quiz.xpReward : 0,
      completedAt: new Date(),
      answers: {
        create: answerRecords.map((a) => ({
          questionId: a.questionId,
          selectedIndex: a.selectedIndex,
          correct: a.correct,
        })),
      },
    },
  })

  if (shouldAward) {
    const fresh = await db.user.findUnique({ where: { id: user.id }, select: { totalXP: true, points: true } })
    const newXP = (fresh?.totalXP ?? 0) + quiz.xpReward
    await db.user.update({
      where: { id: user.id },
      data: {
        totalXP: newXP,
        points: (fresh?.points ?? 0) + Math.floor(quiz.xpReward / 2),
        level: levelFromXP(newXP).level,
      },
    })
    await db.activityLog.create({
      data: { userId: user.id, type: "quiz_passed", refId: quiz.id, xpDelta: quiz.xpReward, pointsDelta: Math.floor(quiz.xpReward / 2) },
    })
    // Achievement evaluation
    await evaluateAchievements(user.id)
  }

  const stats = await db.user.findUnique({
    where: { id: user.id },
    select: { totalXP: true, points: true, level: true, currentStreak: true },
  })

  return ok({
    attemptId: attempt.id,
    score,
    passed,
    xpAwarded: attempt.xpAwarded,
    answers: answerRecords,
    stats,
  })
}

async function evaluateAchievements(userId: string) {
  const [tutorialsCompleted, quizzesPassed, notesCreated, pathsEnrolled, userRec] =
    await Promise.all([
      db.tutorialProgress.count({ where: { userId, completed: true } }),
      db.quizAttempt.count({ where: { userId, passed: true } }),
      db.note.count({ where: { userId } }),
      db.learningPathProgress.count({ where: { userId } }),
      db.user.findUnique({ where: { id: userId }, select: { totalXP: true, currentStreak: true } }),
    ])
  const metrics: Record<string, number> = {
    tutorials_completed: tutorialsCompleted,
    quizzes_passed: quizzesPassed,
    notes_created: notesCreated,
    paths_enrolled: pathsEnrolled,
    xp: userRec?.totalXP ?? 0,
    streak_days: userRec?.currentStreak ?? 0,
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
  if (totalXPGained > 0) {
    const updated = await db.user.update({
      where: { id: userId },
      data: { totalXP: { increment: totalXPGained } },
      select: { totalXP: true },
    })
    const newLevel = levelFromXP(updated.totalXP).level
    await db.user.update({ where: { id: userId }, data: { level: newLevel } })
  }
}

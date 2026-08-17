import { db } from "@/lib/db"

export type SubjectEligibility = {
  eligible: boolean
  completedCount: number
  totalCount: number
  percent: number
  xpAwarded: number
  timeSpentMin: number
  estimatedHours: number
  completedAt: Date | null
}

/**
 * Server-side eligibility for a subject certificate:
 * the user must have completed EVERY published tutorial of the subject.
 * Purely DB-derived — client flags are never trusted. Subject completion and
 * re-completion are idempotent (TutorialProgress is upserted with completed),
 * so calling this repeatedly yields the same verdict.
 */
export async function evaluateSubjectEligibility(
  userId: string,
  subjectId: string
): Promise<SubjectEligibility> {
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: {
      tutorials: {
        where: { published: true },
        select: {
          id: true,
          estimatedMinutes: true,
          progress: {
            where: { userId },
            select: { completed: true, completedAt: true, xpAwarded: true, timeSpentSec: true },
          },
        },
      },
    },
  })

  if (!subject) {
    return {
      eligible: false,
      completedCount: 0,
      totalCount: 0,
      percent: 0,
      xpAwarded: 0,
      timeSpentMin: 0,
      estimatedHours: 0,
      completedAt: null,
    }
  }

  const totalCount = subject.tutorials.length
  const completed = subject.tutorials.filter((t) => t.progress[0]?.completed)
  const completedCount = completed.length

  let xpAwarded = 0
  let timeSpentSec = 0
  let latest: Date | null = null
  for (const t of completed) {
    xpAwarded += t.progress[0]?.xpAwarded ?? 0
    timeSpentSec += t.progress[0]?.timeSpentSec ?? 0
    const at = t.progress[0]?.completedAt
    if (at && (!latest || at > latest)) latest = at
  }

  const estimatedTotalMin = subject.tutorials.reduce(
    (sum, t) => sum + t.estimatedMinutes,
    0
  )

  const eligible = totalCount > 0 && completedCount === totalCount

  return {
    eligible,
    completedCount,
    totalCount,
    percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    xpAwarded,
    timeSpentMin: Math.round(timeSpentSec / 60),
    estimatedHours: Math.round((estimatedTotalMin / 60) * 10) / 10,
    completedAt: latest,
  }
}
import { db } from "@/lib/db"
import { ok, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return forbidden()

  const [users, subjects, tutorials, quizzes, achievements, paths, progress, quizAttempts] =
    await Promise.all([
      db.user.count(),
      db.subject.count(),
      db.tutorial.count(),
      db.quiz.count(),
      db.achievement.count(),
      db.learningPath.count(),
      db.tutorialProgress.count(),
      db.quizAttempt.count(),
    ])

  return ok({
    counts: { users, subjects, tutorials, quizzes, achievements, paths, progress, quizAttempts },
  })
}

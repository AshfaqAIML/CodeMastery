import { db } from "@/lib/db"
import { ok, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return forbidden()

  const [subjects, achievements, paths] = await Promise.all([
    db.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            tutorials: {
              orderBy: { order: "asc" },
              include: {
                quizzes: {
                  include: { questions: { orderBy: { order: "asc" } } },
                },
              },
            },
          },
        },
        tutorials: { where: { moduleId: null }, orderBy: { order: "asc" } },
      },
    }),
    db.achievement.findMany(),
    db.learningPath.findMany({
      include: { steps: { orderBy: { order: "asc" } } },
    }),
  ])

  return ok({
    subjects,
    achievements,
    paths,
  })
}

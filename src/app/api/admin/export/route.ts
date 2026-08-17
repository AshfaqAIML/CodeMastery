import { db } from "@/lib/db"
import { ok, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return forbidden()
  const denied = await assertPermission(user, "content.export")
  if (denied) return denied

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

  await recordAuditSafe({
    actorId: user.id,
    action: "CONTENT_EXPORTED",
    targetType: "system",
    detail: `Exported ${subjects.length} subjects, ${achievements.length} achievements, ${paths.length} learning paths.`,
  })

  return ok({
    subjects,
    achievements,
    paths,
  })
}

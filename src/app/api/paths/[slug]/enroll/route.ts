import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Enroll in or unenroll from a learning path.
 * POST to enroll, DELETE to unenroll.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { slug } = await ctx.params

  const path = await db.learningPath.findUnique({ where: { slug, published: true } })
  if (!path) return notFound("Learning path not found.")

  // Enroll (upsert — idempotent)
  await db.learningPathProgress.upsert({
    where: { userId_pathId: { userId: user.id, pathId: path.id } },
    create: { userId: user.id, pathId: path.id },
    update: {}, // already enrolled
  })

  // Award XP for first enrollment
  const existing = await db.learningPathProgress.findUnique({
    where: { userId_pathId: { userId: user.id, pathId: path.id } },
  })
  if (existing && !existing.completedSteps) {
    // Check if this is a new enrollment (no activity log for it)
    const priorLog = await db.activityLog.findFirst({
      where: { userId: user.id, type: "path_enrolled", refId: path.id },
    })
    if (!priorLog) {
      await db.activityLog.create({
        data: { userId: user.id, type: "path_enrolled", refId: path.id, xpDelta: 0, pointsDelta: 0 },
      })
    }
  }

  return ok({ enrolled: true })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { slug } = await ctx.params

  const path = await db.learningPath.findUnique({ where: { slug } })
  if (!path) return notFound("Learning path not found.")

  await db.learningPathProgress.deleteMany({
    where: { userId: user.id, pathId: path.id },
  })

  return ok({ enrolled: false })
}

import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { z } from "zod"

const schema = z.object({
  subjectId: z.string().min(1),
})

/**
 * Admin: users who currently qualify for a subject certificate.
 * Server-side eligibility across ALL users with completed progress on every
 * published tutorial of the subject.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.issue")
  if (denied) return denied

  const parsed = schema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  )
  if (!parsed.success) return zodErr(parsed.error)

  const subject = await db.subject.findUnique({
    where: { id: parsed.data.subjectId },
    include: {
      tutorials: {
        where: { published: true },
        select: { id: true },
      },
    },
  })
  if (!subject) return err("Subject not found.", 404)

  const tutorialIds = subject.tutorials.map((t) => t.id)
  if (tutorialIds.length === 0) return ok({ users: [], total: 0 })

  const rows = await db.tutorialProgress.groupBy({
    by: ["userId"],
    where: { tutorialId: { in: tutorialIds }, completed: true },
    _count: { tutorialId: true },
  })

  const qualifying = rows.filter((r) => r._count.tutorialId === tutorialIds.length)
  const userIds = qualifying.map((r) => r.userId)

  const users = userIds.length
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true, username: true, createdAt: true },
      })
    : []

  const withExisting = await Promise.all(
    users.map(async (u) => {
      const existing = await db.certificate.findFirst({
        where: {
          userId: u.id,
          subjectId: subject.id,
          status: { notIn: ["REVOKED", "SUPERSEDED"] },
        },
        select: { number: true },
      })
      return { ...u, hasCertificate: !!existing, certificateNumber: existing?.number ?? null }
    })
  )

  return ok({ users: withExisting, total: withExisting.length })
}
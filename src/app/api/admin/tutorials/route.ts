import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { z } from "zod"

const listSchema = z.object({
  subjectId: z.string().optional(),
  q: z.string().max(100).optional(),
  published: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
})

/** Admin — tutorial directory, including drafts/unpublished content. */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "content.view")
  if (denied) return denied

  const parsed = listSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()))
  if (!parsed.success) return zodErr(parsed.error)
  const { subjectId, q, published, limit, offset } = parsed.data

  const where: Record<string, unknown> = {}
  if (subjectId) where.subjectId = subjectId
  if (published !== undefined) where.published = published === "true"
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" as const } },
      { slug: { contains: q, mode: "insensitive" as const } },
    ]
  }

  const [tutorials, total] = await Promise.all([
    db.tutorial.findMany({
      where,
      orderBy: [{ subjectId: "asc" }, { order: "asc" }],
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        subjectId: true,
        published: true,
        accessLevel: true,
        difficulty: true,
        estimatedMinutes: true,
        order: true,
        updatedAt: true,
        subject: { select: { name: true } },
      },
    }),
    db.tutorial.count({ where }),
  ])

  return ok({ tutorials, total, limit, offset })
}
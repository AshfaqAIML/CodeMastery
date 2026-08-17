import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"

type Ctx = { params: Promise<{ id: string }> }

const patchSchema = z.object({
  published: z.boolean().optional(),
  accessLevel: z.enum(["PUBLIC", "FREE", "PREMIUM"]).optional(),
  title: z.string().min(3).max(200).optional(),
  summary: z.string().max(600).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimatedMinutes: z.number().int().min(1).max(1000).optional(),
  order: z.number().int().min(0).max(10000).optional(),
})

/** Admin — publish/unpublish, change access level, update metadata. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "content.publish")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const { id } = await ctx.params
  const existing = await db.tutorial.findUnique({
    where: { id },
    select: { id: true, title: true, published: true },
  })
  if (!existing) return err("Tutorial not found.", 404)

  const data: Record<string, unknown> = {}
  if (parsed.data.published !== undefined) data.published = parsed.data.published
  if (parsed.data.accessLevel) data.accessLevel = parsed.data.accessLevel
  if (parsed.data.title) data.title = parsed.data.title
  if (parsed.data.summary !== undefined) data.summary = parsed.data.summary
  if (parsed.data.difficulty) data.difficulty = parsed.data.difficulty
  if (parsed.data.estimatedMinutes !== undefined) data.estimatedMinutes = parsed.data.estimatedMinutes
  if (parsed.data.order !== undefined) data.order = parsed.data.order

  if (Object.keys(data).length === 0) return err("Nothing to update.", 400)

  const updated = await db.tutorial.update({ where: { id }, data })

  if (parsed.data.published !== undefined && parsed.data.published !== existing.published) {
    await recordAuditSafe({
      actorId: user.id,
      action: "TUTORIAL_STATUS_CHANGED",
      targetType: "tutorial",
      targetId: id,
      detail: `"${existing.title}" ${parsed.data.published ? "published" : "unpublished"}.`,
    })
  }

  return ok({
    tutorial: {
      id: updated.id,
      title: updated.title,
      published: updated.published,
      accessLevel: updated.accessLevel,
    },
  })
}
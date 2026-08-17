import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { z } from "zod"

const schema = z.object({
  action: z.string().max(80).optional(),
  targetType: z.string().max(40).optional(),
  q: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
})

/** Admin — generic audit trail (latest first). Never contains secrets. */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "audit_logs.view")
  if (denied) return denied

  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()))
  if (!parsed.success) return zodErr(parsed.error)
  const { action, targetType, q, limit, offset } = parsed.data

  const where: Record<string, unknown> = {}
  if (action) where.action = action
  if (targetType) where.targetType = targetType
  if (q) {
    where.OR = [
      { detail: { contains: q, mode: "insensitive" as const } },
      { actor: { email: { contains: q, mode: "insensitive" as const } } },
    ]
  }

  const [entries, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: { actor: { select: { name: true, email: true, role: true } } },
    }),
    db.auditLog.count({ where }),
  ])

  return ok({ entries, total, limit, offset })
}
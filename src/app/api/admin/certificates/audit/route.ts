import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { z } from "zod"

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(100),
})

/** Admin: certificate audit log (latest first). */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.view")
  if (denied) return denied

  const parsed = schema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  )
  if (!parsed.success) return zodErr(parsed.error)

  const entries = await db.certificateAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: parsed.data.limit,
    include: {
      actor: { select: { name: true, email: true } },
    },
  })

  return ok({ entries })
}
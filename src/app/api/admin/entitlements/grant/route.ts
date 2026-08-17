import { NextRequest } from "next/server"
import { ok, forbidden, unauthorized, err } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { grantPremiumByAdmin } from "@/lib/entitlements/payments"
import { z } from "zod"

const schema = z.object({
  userId: z.string().min(1),
  reason: z.string().max(300).optional(),
})

/** Admin — grant lifetime Premium to a user (idempotent, audited). */
export async function POST(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return unauthorized()
  const denied = await assertPermission(me, "entitlements.manage")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const { userId, reason } = parsed.data
  const result = await grantPremiumByAdmin({ userId, actorId: me.id, reason })

  await recordAuditSafe({
    actorId: me.id,
    action: "PREMIUM_GRANTED",
    targetType: "user",
    targetId: userId,
    detail: reason ?? undefined,
    metadata: { granted: result.granted },
  })

  return ok(result, { status: result.granted ? 201 : 200 })
}

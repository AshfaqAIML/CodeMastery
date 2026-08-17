import { NextRequest } from "next/server"
import { ok, forbidden, unauthorized, err } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
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
  if (me.role !== "ADMIN") return forbidden()

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

  return ok(result, { status: result.granted ? 201 : 200 })
}

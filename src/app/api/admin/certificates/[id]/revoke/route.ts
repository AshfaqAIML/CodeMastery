import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"
import { revokeCertificate } from "@/lib/certificates/admin"

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({ reason: z.string().min(1).max(500) })

/** Admin: revoke a certificate (requires a reason). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.revoke")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const { id } = await ctx.params
  const result = await revokeCertificate({
    certificateId: id,
    actorId: user.id,
    reason: parsed.data.reason,
  })
  if (!result.ok) return err(result.error, result.status)

  await recordAuditSafe({
    actorId: user.id,
    action: "CERT_REVOKED",
    targetType: "certificate",
    targetId: result.cert.id,
    detail: `Certificate ${result.cert.number} revoked: ${parsed.data.reason}`,
  })

  return ok({ certificateId: result.cert.id, status: result.cert.status })
}
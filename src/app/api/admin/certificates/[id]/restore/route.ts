import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { restoreCertificate } from "@/lib/certificates/admin"

type Ctx = { params: Promise<{ id: string }> }

/** Admin: restore a revoked certificate back to VALID. */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.restore")
  if (denied) return denied

  const { id } = await ctx.params
  const result = await restoreCertificate({ certificateId: id, actorId: user.id })
  if (!result.ok) return err(result.error, result.status)

  await recordAuditSafe({
    actorId: user.id,
    action: "CERT_RESTORED",
    targetType: "certificate",
    targetId: result.cert.id,
    detail: `Certificate restored to ${result.cert.status}.`,
  })

  return ok({ certificateId: result.cert.id, status: result.cert.status })
}
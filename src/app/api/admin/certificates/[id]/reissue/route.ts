import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { reissueCertificate } from "@/lib/certificates/admin"
import { toCertificateDto } from "@/lib/certificates/issue"

type Ctx = { params: Promise<{ id: string }> }

/** Admin: reissue a certificate as a new version (supersedes the old one). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.reissue")
  if (denied) return denied

  const { id } = await ctx.params
  const result = await reissueCertificate({ certificateId: id, actorId: user.id })
  if (!result.ok) return err(result.error, result.status)

  await recordAuditSafe({
    actorId: user.id,
    action: "CERT_REISSUED",
    targetType: "certificate",
    targetId: result.cert.id,
    detail: `Certificate ${result.cert.number} reissued (v${result.cert.version}).`,
  })

  return ok({
    certificateId: result.cert.id,
    number: result.cert.number,
    version: result.cert.version,
  })
}
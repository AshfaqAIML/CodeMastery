import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { reissueCertificate } from "@/lib/certificates/admin"
import { toCertificateDto } from "@/lib/certificates/issue"

type Ctx = { params: Promise<{ id: string }> }

/** Admin: reissue a certificate as a new version (supersedes the old one). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  if (user.role !== "ADMIN") return forbidden()

  const { id } = await ctx.params
  const result = await reissueCertificate({ certificateId: id, actorId: user.id })
  if (!result.ok) return err(result.error, result.status)

  return ok({
    certificateId: result.cert.id,
    number: result.cert.number,
    version: result.cert.version,
  })
}
import { db } from "@/lib/db"
import { ok, err, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { hasPermission } from "@/lib/authorization/service"
import { toCertificateDto } from "@/lib/certificates/issue"
import { CERT_NUMBER_RE } from "@/lib/certificates/types"

type Ctx = { params: Promise<{ number: string }> }

/** Certificate detail for the owner (verification is public via /verify). */
export async function GET(req: Request, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { number } = await ctx.params
  const clean = number.trim().toUpperCase()
  if (!CERT_NUMBER_RE.test(clean)) return err("Invalid certificate number.", 422)

  const cert = await db.certificate.findUnique({
    where: { number: clean },
    include: {
      subject: { select: { name: true, slug: true, icon: true, color: true } },
    },
  })
  if (!cert) return notFound("Certificate not found.")
  if (cert.userId !== user.id && !hasPermission(user, "certificates.view")) {
    return err("This certificate belongs to another user.", 403)
  }

  return ok({ certificate: toCertificateDto(cert) })
}
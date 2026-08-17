import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { hasPermission } from "@/lib/authorization/service"
import { CERT_NUMBER_RE } from "@/lib/certificates/types"
import { renderCertificatePdf } from "@/lib/certificates/pdf"

type Ctx = { params: Promise<{ number: string }> }

/** PDF download — owner or admin only. Rendered on demand, deterministic. */
export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { number } = await ctx.params
  const clean = number.trim().toUpperCase()
  if (!CERT_NUMBER_RE.test(clean)) return err("Invalid certificate number.", 422)

  const cert = await db.certificate.findUnique({
    where: { number: clean },
    include: {
      subject: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  })
  if (!cert) return notFound("Certificate not found.")
  if (cert.userId !== user.id && !hasPermission(user, "certificates.view")) {
    return err("This certificate belongs to another user.", 403)
  }

  const userName =
    cert.user.name && cert.user.name.trim()
      ? cert.user.name
      : cert.user.email.split("@")[0]

  const pdf = await renderCertificatePdf({
    cert,
    userName,
    subjectName: cert.subject?.name ?? "(subject)",
  })

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="CodeMastery-Certificate-${clean}.pdf"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, max-age=3600",
    },
  })
}
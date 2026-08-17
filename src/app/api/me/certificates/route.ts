import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { toCertificateDto } from "@/lib/certificates/issue"

/** The signed-in user's certificates (all statuses), newest first. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
    include: {
      subject: { select: { name: true, slug: true, icon: true, color: true } },
    },
  })

  return ok({ certificates: certificates.map((c) => toCertificateDto(c)) })
}
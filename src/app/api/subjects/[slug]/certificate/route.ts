import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { evaluateSubjectEligibility } from "@/lib/certificates/eligibility"
import { toCertificateDto } from "@/lib/certificates/issue"

/**
 * Subject completion status + the user's real persisted certificate.
 * A certificate exists only when ALL published tutorials are completed
 * (server-side check) AND it was issued (auto-issued on completion).
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { slug } = await ctx.params

  const subject = await db.subject.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      icon: true,
    },
  })
  if (!subject) return notFound("Subject not found.")

  const eligibility = await evaluateSubjectEligibility(user.id, subject.id)

  const certificate = await db.certificate.findFirst({
    where: { userId: user.id, subjectId: subject.id },
    orderBy: { issuedAt: "desc" },
    include: {
      subject: { select: { name: true, slug: true, icon: true, color: true } },
    },
  })

  return ok({
    earned: eligibility.eligible,
    percent: eligibility.percent,
    completedCount: eligibility.completedCount,
    totalCount: eligibility.totalCount,
    completedAt: eligibility.completedAt?.toISOString() ?? null,
    userName: user.name ?? user.email.split("@")[0],
    subjectName: subject.name,
    subjectSlug: subject.slug,
    subjectColor: subject.color,
    subjectIcon: subject.icon,
    certificate: certificate ? toCertificateDto(certificate) : null,
  })
}
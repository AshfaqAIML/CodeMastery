import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"
import { issueSubjectCertificate, toCertificateDto } from "@/lib/certificates/issue"
import { CERT_STATUS } from "@/lib/certificates/types"

const listSchema = z.object({
  status: z
    .enum([CERT_STATUS.VALID, CERT_STATUS.REVOKED, CERT_STATUS.SUPERSEDED, CERT_STATUS.INVALID])
    .optional(),
  q: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

const issueSchema = z.object({
  userId: z.string().min(1),
  subjectId: z.string().min(1),
})

/** Admin: list + filter certificates, or manually issue one. */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.view")
  if (denied) return denied

  const parsed = listSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  )
  if (!parsed.success) return zodErr(parsed.error)
  const { status, q, limit, offset } = parsed.data

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" as const } },
      { user: { name: { contains: q, mode: "insensitive" as const } } },
      { user: { email: { contains: q, mode: "insensitive" as const } } },
    ]
  }

  const [certificates, total] = await Promise.all([
    db.certificate.findMany({
      where,
      orderBy: { issuedAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        subject: { select: { name: true, slug: true, icon: true, color: true } },
        user: { select: { name: true, email: true, role: true } },
      },
    }),
    db.certificate.count({ where }),
  ])

  return ok({
    certificates: certificates.map((c) => ({
      ...toCertificateDto(c),
      user: c.user,
    })),
    total,
    limit,
    offset,
  })
}

/** Admin: manually issue a subject certificate (eligibility re-checked). */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.issue")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = issueSchema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const result = await issueSubjectCertificate({
    userId: parsed.data.userId,
    subjectId: parsed.data.subjectId,
    actorId: user.id,
    createdBy: "ADMIN",
  })

  if ("skipped" in result) {
    return err(result.reason, 409)
  }

  await recordAuditSafe({
    actorId: user.id,
    action: "CERT_ISSUED",
    targetType: "certificate",
    targetId: result.cert.id,
    detail: `Manually issued certificate for user ${parsed.data.userId}.`,
  })

  const full = await db.certificate.findUnique({
    where: { id: result.cert.id },
    include: {
      subject: { select: { name: true, slug: true, icon: true, color: true } },
    },
  })

  return ok({ certificate: full ? toCertificateDto(full) : result.cert })
}
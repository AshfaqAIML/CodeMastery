import { db } from "@/lib/db"
import type { Certificate } from "@prisma/client"
import type { AccessContext, CertificateStore, CertificateRecord } from "@codemastery/certificate-generator"
import { evaluateSubjectEligibility } from "./eligibility"
import { issueSubjectCertificate } from "./issue"

// ----------------------------------------------------------------
// Host adapters per the module README integration checklist:
//   getUserId / getAccessContext / getUserEligibility / CertificateStore
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// getUserId — host auth (README: "Implement getUserId() with your
// auth provider"). Session-only: guests get null.
// ----------------------------------------------------------------
export async function getCertificateUserId(): Promise<string | null> {
  const { getCurrentUser } = await import("@/lib/session")
  const user = await getCurrentUser()
  return user?.id ?? null
}

// ----------------------------------------------------------------
// getAccessContext — host DB lookup (README: "Implement
// getAccessContext() with your DB (use resolveEntitlementState)")
//
// This app has no premium/trial/entitlement tables — every account is
// a free account, so the context is always NORMAL with no trial.
// Eligibility is the real gate; there is nothing to resolve here.
// ----------------------------------------------------------------
export async function buildAccessContext(userId: string | null): Promise<AccessContext | null> {
  if (!userId) return null
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) return null
  return {
    authenticated: true,
    plan: "NORMAL",
    entitlementState: "NORMAL_NO_TRIAL",
    trialDaysRemaining: 0,
    hasLifetimePremium: false,
    suspended: false,
  }
}

// ----------------------------------------------------------------
// getUserEligibility — host completion check (README: "Implement
// getUserEligibility()"). Server-side, DB-derived, never client flags.
// ----------------------------------------------------------------
export async function getUserEligibility(
  userId: string,
  spec: { courseName: string; subjectName?: string }
): Promise<{ eligible: boolean; reason?: string }> {
  const subjectId = await resolveSubjectId(spec)
  if (!subjectId) return { eligible: false, reason: "Unknown course." }
  const result = await evaluateSubjectEligibility(userId, subjectId)
  if (result.eligible) return { eligible: true }
  return {
    eligible: false,
    reason: `Complete all ${result.totalCount} tutorials of ${spec.courseName} to earn this certificate.`,
  }
}

/** Resolve a subject id from a slug (subjectName) or name (courseName). */
export async function resolveSubjectId(spec: {
  courseName: string
  subjectName?: string
}): Promise<string | null> {
  if (spec.subjectName) {
    const bySlug = await db.subject.findUnique({ where: { slug: spec.subjectName } })
    if (bySlug) return bySlug.id
  }
  const byName = await db.subject.findFirst({ where: { name: spec.courseName } })
  return byName?.id ?? null
}

// ----------------------------------------------------------------
// CertificateStore — pluggable store over Prisma (README: "Implement
// CertificateStore (save/find/list with your DB)")
//
// Records are keyed by our certificate number (record.id). Generation
// for an already-issued certificate is a deterministic re-render, so
// save() is an idempotent no-op when the record already exists; new
// records go through the real issuance flow (transactional, number
// sequence, duplicate-safe, audit entry).
// ----------------------------------------------------------------
function fromPrismaRecord(
  c: Certificate & { subject?: { name: string } | null; user?: { name: string | null } | null }
): CertificateRecord | null {
  let meta: Record<string, unknown> = {}
  try {
    meta = c.metadata ? JSON.parse(c.metadata) : {}
  } catch {
    meta = {}
  }
  return {
    id: c.number,
    userId: c.userId,
    recipientName: (meta.recipientName as string) ?? c.user?.name ?? c.userId,
    courseName: c.subject?.name ?? (meta.courseName as string) ?? c.title,
    subjectName: c.subject?.name,
    issuerName: (meta.issuerName as string) ?? "CodeMastery",
    issuedAt: c.issuedAt.toISOString(),
    verificationHash: (meta.verificationHash as string) ?? c.verificationToken,
    grade: (meta.grade as string) ?? undefined,
    template: (meta.template as string) ?? "classic",
    createdAt: c.createdAt.toISOString(),
  }
}

export const certificateStore: CertificateStore = {
  async save(record) {
    const existing = await db.certificate.findUnique({ where: { number: record.id } })
    if (existing) return
    const subjectId = record.subjectName
      ? await resolveSubjectId({ courseName: record.courseName, subjectName: record.subjectName })
      : await resolveSubjectId({ courseName: record.courseName })
    if (!subjectId) throw new Error("Unknown course.")
    const result = await issueSubjectCertificate({ userId: record.userId, subjectId })
    if (!("cert" in result)) {
      throw new Error(result.reason ?? "Certificate could not be issued.")
    }
  },

  async findById(id) {
    const row = await db.certificate.findUnique({
      where: { number: id },
      include: { subject: { select: { name: true } }, user: { select: { name: true } } },
    })
    return row ? fromPrismaRecord(row) : null
  },

  async listByUser(userId) {
    const rows = await db.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      include: { subject: { select: { name: true } }, user: { select: { name: true } } },
    })
    return rows.map((r) => fromPrismaRecord(r)!).filter(Boolean)
  },

  async exists(id) {
    return (await db.certificate.findUnique({ where: { number: id } })) !== null
  },
}
import { db } from "@/lib/db"
import type { Certificate, Prisma } from "@prisma/client"
import { CERT_STATUS, makeVerifyUrl, type CertMetadata } from "./types"
import { makeVerificationToken } from "./crypto"
import { nextCertificateNumber } from "./numbering"
import { evaluateSubjectEligibility } from "./eligibility"
import { getCertificateSettings } from "./settings"

export type IssueResult = { cert: Certificate } | { skipped: true; reason: string }

/**
 * Issue a subject completion certificate.
 * Server-side eligibility only; transactional; duplicate-safe.
 *
 * Duplicate prevention: an existing certificate for the same user+subject
 * that is NOT revoked blocks a new issuance (returns skipped). Revoked
 * certificates MAY be reissued (admin flow creates a new version, not a
 * silent overwrite).
 */
export async function issueSubjectCertificate(opts: {
  userId: string
  subjectId: string
  actorId?: string | null
  createdBy?: "AUTO" | "ADMIN"
}): Promise<IssueResult> {
  const { userId, subjectId, actorId = null, createdBy = "AUTO" } = opts

  return await db.$transaction(
    async (tx) => {
      const existing = await tx.certificate.findFirst({
      where: {
        userId,
        subjectId,
        status: { notIn: [CERT_STATUS.REVOKED, CERT_STATUS.SUPERSEDED] },
      },
    })
    if (existing) {
      return {
        skipped: true,
        reason: `A certificate already exists for this subject (${existing.number}).`,
      } as IssueResult
    }

    const eligibility = await evaluateSubjectEligibility(userId, subjectId)
    if (!eligibility.eligible || !eligibility.completedAt) {
      return {
        skipped: true,
        reason: "Certificate eligibility not met (not all tutorials completed).",
      } as IssueResult
    }

    const [subject, user, settings] = await Promise.all([
      tx.subject.findUnique({ where: { id: subjectId }, select: { name: true } }),
      tx.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
      getCertificateSettings(),
    ])
    if (!subject || !user) {
      return {
        skipped: true,
        reason: "Subject or user no longer exists.",
      } as IssueResult
    }

    const number = await nextCertificateNumber(tx)
    const metadata: CertMetadata = {
      completedCount: eligibility.completedCount,
      totalCount: eligibility.totalCount,
      xpAwarded: eligibility.xpAwarded,
      timeSpentMin: eligibility.timeSpentMin,
      estimatedHours: eligibility.estimatedHours,
      signatoryName: settings.signatoryName,
      signatoryTitle: settings.signatoryTitle,
      issuerName: settings.issuerName,
      issuerWebsite: settings.issuerWebsite,
    }

    const cert = await tx.certificate.create({
      data: {
        number,
        type: "SUBJECT",
        status: CERT_STATUS.VALID,
        title: `Certificate of Completion — ${subject.name}`,
        userId,
        subjectId,
        issuedById: actorId,
        createdBy,
        verificationToken: makeVerificationToken(),
        issuedAt: eligibility.completedAt,
        issueReason: `Completed all ${eligibility.totalCount} tutorials of ${subject.name}`,
        metadata: JSON.stringify(metadata),
      },
    })

    await tx.certificateAuditLog.create({
      data: {
        actorId,
        action: "ISSUED",
        certificateId: cert.id,
        certificateNumber: cert.number,
        detail: `${createdBy === "ADMIN" ? "Manual issuance" : "Auto-issued on completion"} · ${subject.name}`,
      },
    })

    return { cert } as IssueResult
    },
    { timeout: 30_000, maxWait: 10_000 }
  )
}

export type CertificateWithSubject = Certificate & {
  subject: { name: string; slug: string; icon: string; color: string } | null
}

/** Public-facing fields for a certificate owned by the requesting user. */
export function toCertificateDto(
  c: CertificateWithSubject,
  opts?: { verifyUrl: string }
) {
  return {
    id: c.id,
    number: c.number,
    type: c.type,
    status: c.status,
    title: c.title,
    issuedAt: c.issuedAt,
    issuedReason: c.issueReason,
    createdAt: c.createdBy,
    version: c.version,
    revokedAt: c.revokedAt,
    revokeReason: c.revokeReason,
    supersededById: c.supersededById,
    subjectName: c.subject?.name ?? null,
    subjectSlug: c.subject?.slug ?? null,
    subjectIcon: c.subject?.icon ?? null,
    subjectColor: c.subject?.color ?? null,
    metadata: c.metadata ? JSON.parse(c.metadata) : null,
    verifyUrl: opts?.verifyUrl ?? makeVerifyUrl(c.number),
  }
}

/** Prisma tx helper used by reissue flows. */
export type CertTx = Prisma.TransactionClient
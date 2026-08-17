import { db } from "@/lib/db"
import { CERT_STATUS, makeVerifyUrl, parseCertMetadata, type CertMetadata } from "./types"
import { makeVerificationToken } from "./crypto"
import { nextCertificateNumber } from "./numbering"
import { evaluateSubjectEligibility } from "./eligibility"
import { getCertificateSettings } from "./settings"
import type { Certificate } from "@prisma/client"

export type ActionResult =
  | { ok: true; cert: Certificate }
  | { ok: false; status: number; error: string }

/**
 * Revoke a certificate. Only VALID certificates can be revoked; the public
 * verification page keeps resolving but displays the revoked state.
 */
export async function revokeCertificate(opts: {
  certificateId: string
  actorId: string
  reason: string
}): Promise<ActionResult> {
  const { certificateId, actorId, reason } = opts
  const cert = await db.certificate.findUnique({ where: { id: certificateId } })
  if (!cert) return okFalse(404, "Certificate not found.")
  if (cert.status !== CERT_STATUS.VALID) {
    return okFalse(409, `Only VALID certificates can be revoked (status: ${cert.status}).`)
  }

  const updated = await db.$transaction(async (tx) => {
    const row = await tx.certificate.update({
      where: { id: certificateId },
      data: {
        status: CERT_STATUS.REVOKED,
        revokedAt: new Date(),
        revokedById: actorId,
        revokeReason: reason,
      },
    })
    await tx.certificateAuditLog.create({
      data: {
        actorId,
        action: "REVOKED",
        certificateId: row.id,
        certificateNumber: row.number,
        detail: reason,
      },
    })
    return row
  })

  return { ok: true, cert: updated }
}

/** Restore a revoked certificate back to VALID. */
export async function restoreCertificate(opts: {
  certificateId: string
  actorId: string
}): Promise<ActionResult> {
  const { certificateId, actorId } = opts
  const cert = await db.certificate.findUnique({ where: { id: certificateId } })
  if (!cert) return okFalse(404, "Certificate not found.")
  if (cert.status !== CERT_STATUS.REVOKED) {
    return okFalse(409, `Only REVOKED certificates can be restored (status: ${cert.status}).`)
  }

  const updated = await db.$transaction(async (tx) => {
    const row = await tx.certificate.update({
      where: { id: certificateId },
      data: {
        status: CERT_STATUS.VALID,
        revokedAt: null,
        revokedById: null,
        revokeReason: null,
      },
    })
    await tx.certificateAuditLog.create({
      data: {
        actorId,
        action: "RESTORED",
        certificateId: row.id,
        certificateNumber: row.number,
      },
    })
    return row
  })

  return { ok: true, cert: updated }
}

/**
 * Reissue a certificate: the old one becomes SUPERSEDED (still resolving
 * publicly, showing the superseded state) and a new version is issued —
 * a controlled version bump, never a silent overwrite.
 */
export async function reissueCertificate(opts: {
  certificateId: string
  actorId: string
}): Promise<ActionResult> {
  const { certificateId, actorId } = opts
  return await db.$transaction(async (tx) => {
    const old = await tx.certificate.findUnique({ where: { id: certificateId } })
    if (!old) return okFalse(404, "Certificate not found.")
    if (old.status === CERT_STATUS.REVOKED) {
      return okFalse(409, "Revoked certificates must be restored before reissue.")
    }
    if (old.type !== "SUBJECT" || !old.subjectId) {
      return okFalse(409, "Only subject certificates can be reissued in this version.")
    }

    const eligibility = await evaluateSubjectEligibility(old.userId, old.subjectId)
    if (!eligibility.eligible) {
      return okFalse(
        409,
        "Reissue blocked: eligibility is no longer met (content may have changed)."
      )
    }

    const [subject, user, settings] = await Promise.all([
      tx.subject.findUnique({ where: { id: old.subjectId }, select: { name: true } }),
      tx.user.findUnique({ where: { id: old.userId }, select: { name: true, email: true } }),
      getCertificateSettings(),
    ])
    if (!subject || !user) return okFalse(404, "Subject or user no longer exists.")

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

    const created = await tx.certificate.create({
      data: {
        number,
        type: old.type,
        status: CERT_STATUS.VALID,
        title: `Certificate of Completion — ${subject.name}`,
        userId: old.userId,
        subjectId: old.subjectId,
        issuedById: actorId,
        createdBy: "ADMIN",
        verificationToken: makeVerificationToken(),
        issuedAt: new Date(),
        issueReason: `${old.issueReason ?? `Completed all ${eligibility.totalCount} tutorials of ${subject.name}`} · Reissued (v${old.version + 1})`,
        version: old.version + 1,
        metadata: JSON.stringify(metadata),
      },
    })

    await tx.certificate.update({
      where: { id: old.id },
      data: { status: CERT_STATUS.SUPERSEDED, supersededById: created.id },
    })

    await tx.certificateAuditLog.create({
      data: {
        actorId,
        action: "REISSUED",
        certificateId: created.id,
        certificateNumber: created.number,
        detail: `Supersedes ${old.number} (v${old.version} → v${created.version})`,
      },
    })

    return { ok: true, cert: created }
    },
    { timeout: 30_000, maxWait: 10_000 }
  )
}

export type SettingsInput = {
  signatoryName: string
  signatoryTitle: string
  issuerName: string
  issuerWebsite: string
}

/**
 * Persist admin-managed certificate settings (signatory, issuer) and,
 * optionally, replaced asset keys. All inside one transaction.
 */
export async function updateCertificateSettings(
  input: SettingsInput & { sealKey?: string | null; signatureKey?: string | null }
): Promise<void> {
  const { sealKey, signatureKey, ...fields } = input
  await db.$transaction(async (tx) => {
    await tx.certificateSettings.upsert({
      where: { id: "global" },
      update: {
        ...fields,
        ...(sealKey !== undefined ? { sealKey } : {}),
        ...(signatureKey !== undefined ? { signatureKey } : {}),
      },
      create: { id: "global", ...fields, sealKey: sealKey ?? null, signatureKey: signatureKey ?? null },
    })
    await tx.certificateAuditLog.create({
      data: {
        action: "SETTINGS_UPDATED",
        detail: `Signatory: ${input.signatoryName} · ${input.signatoryTitle}`,
      },
    })
  })
}

function okFalse(status: number, error: string): ActionResult {
  return { ok: false, status, error }
}

export { parseCertMetadata, makeVerifyUrl }
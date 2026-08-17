import { db } from "@/lib/db"
import {
  CERT_NUMBER_RE,
  parseCertMetadata,
  formatCertDate,
  makeVerifyUrl,
} from "./types"

export type PublicCertificate = {
  status: string
  number: string
  title: string
  type: string
  userName: string
  subjectName: string | null
  issuedAt: string
  issuedReason: string | null
  revokedAt: string | null
  revokeReason: string | null
  version: number
  completedCount: number | null
  totalCount: number | null
  xpAwarded: number | null
  estimatedHours: number | null
  signatoryName: string | null
  signatoryTitle: string | null
  issuerName: string
  verifyUrl: string
}

/**
 * Public verification lookup by certificate number.
 * Returns ONLY public credential data: no email, no internal IDs, no
 * private history. Unknown/malformed numbers yield null → the caller
 * renders the "invalid" state.
 */
export async function lookupPublicCertificate(
  rawNumber: string
): Promise<PublicCertificate | null> {
  const number = rawNumber.trim().toUpperCase()
  if (!CERT_NUMBER_RE.test(number)) return null

  const cert = await db.certificate.findUnique({
    where: { number },
    include: {
      subject: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  })
  if (!cert) return null

  const meta = parseCertMetadata(cert.metadata)

  return {
    status: cert.status,
    number: cert.number,
    title: cert.title,
    type: cert.type,
    userName:
      cert.user.name && cert.user.name.trim()
        ? cert.user.name
        : cert.user.email.split("@")[0],
    subjectName: cert.subject?.name ?? null,
    issuedAt: formatCertDate(cert.issuedAt),
    issuedReason: cert.issueReason ?? null,
    revokedAt: cert.revokedAt ? formatCertDate(cert.revokedAt) : null,
    revokeReason: cert.revokeReason ?? null,
    version: cert.version,
    completedCount: meta?.completedCount ?? null,
    totalCount: meta?.totalCount ?? null,
    xpAwarded: meta?.xpAwarded ?? null,
    estimatedHours: meta?.estimatedHours ?? null,
    signatoryName: meta?.signatoryName ?? null,
    signatoryTitle: meta?.signatoryTitle ?? null,
    issuerName: meta?.issuerName ?? "CodeMastery",
    verifyUrl: makeVerifyUrl(cert.number),
  }
}
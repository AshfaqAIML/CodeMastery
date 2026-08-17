/**
 * Certificate core types, constants and helpers.
 * Statuses: VALID | REVOKED | SUPERSEDED | INVALID.
 * Number format: CM-YYYY-NNNNNN (year + 6-digit sequential).
 */
import { config } from "@/lib/config"

export const CERT_STATUS = {
  VALID: "VALID",
  REVOKED: "REVOKED",
  SUPERSEDED: "SUPERSEDED",
  INVALID: "INVALID",
} as const

export type CertStatus = (typeof CERT_STATUS)[keyof typeof CERT_STATUS]

export type CertType = "SUBJECT"

export const CERT_NUMBER_RE = /^CM-\d{4}-\d{6}$/

/** Snapshot of everything that makes a certificate's PDF/web render stable. */
export type CertMetadata = {
  completedCount: number
  totalCount: number
  xpAwarded: number
  timeSpentMin: number
  estimatedHours: number
  signatoryName: string
  signatoryTitle: string
  issuerName: string
  issuerWebsite: string
}

export function makeVerifyUrl(number: string): string {
  return `${config.appUrl}/verify/${encodeURIComponent(number)}`
}

export function parseCertMetadata(metadata: string | null): CertMetadata | null {
  if (!metadata) return null
  try {
    return JSON.parse(metadata) as CertMetadata
  } catch {
    return null
  }
}

export function formatCertDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
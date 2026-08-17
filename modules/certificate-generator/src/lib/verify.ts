/**
 * Certificate verification — generates unique IDs and tamper-evident
 * verification hashes so certificates can be validated by anyone with
 * the verification URL.
 *
 * The hash is a SHA-256 of the certificate's identity fields + a
 * server-side secret salt. This means:
 *   - Changing the recipient name, course, or issue date invalidates the hash.
 *   - An attacker cannot forge a valid hash without the secret.
 *
 * The host project should set CERTIFICATE_VERIFY_SECRET in env to a
 * random 32+ char string. If unset, a warning is logged and a
 * development-grade salt is used (NOT safe for production).
 */

import { createHash, randomBytes } from "crypto"

const DEV_SALT = "codemastery-dev-salt-DO-NOT-USE-IN-PRODUCTION"

/**
 * Generate a unique, URL-safe certificate ID.
 * Format: CM-YYYYMMDD-XXXXXXXX (e.g. CM-20260815-a3f9b2e1)
 */
export function generateCertificateId(now: Date = new Date()): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const rand = randomBytes(4).toString("hex")
  return `CM-${date}-${rand}`
}

/**
 * Compute a verification hash for a certificate.
 *
 * Includes the identity fields + a secret salt so the hash cannot be
 * forged without the secret. Changing any field invalidates the hash.
 *
 * @param fields - the identity fields to hash
 * @param secret - server secret (from env). Falls back to dev salt.
 */
export function computeVerificationHash(
  fields: {
    certificateId: string
    recipientName: string
    courseName: string
    issuerName: string
    issuedAt: string
  },
  secret: string = process.env.CERTIFICATE_VERIFY_SECRET ?? DEV_SALT
): string {
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.CERTIFICATE_VERIFY_SECRET ||
      process.env.CERTIFICATE_VERIFY_SECRET === DEV_SALT)
  ) {
    console.warn(
      "[certificate-generator] WARNING: CERTIFICATE_VERIFY_SECRET is not set. " +
        "Using an insecure dev salt. Set a 32+ char random secret in production."
    )
  }
  const payload = [
    fields.certificateId,
    fields.recipientName,
    fields.courseName,
    fields.issuerName,
    fields.issuedAt,
    secret,
  ].join("|")
  return createHash("sha256").update(payload).digest("hex").slice(0, 32)
}

/**
 * Verify that a certificate's hash matches its fields.
 * Used by the public verification endpoint to confirm a certificate is genuine.
 */
export function verifyCertificateHash(
  fields: {
    certificateId: string
    recipientName: string
    courseName: string
    issuerName: string
    issuedAt: string
  },
  hash: string,
  secret: string = process.env.CERTIFICATE_VERIFY_SECRET ?? DEV_SALT
): boolean {
  const expected = computeVerificationHash(fields, secret)
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== hash.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ hash.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Build the public verification URL for the QR code on the certificate.
 * Points to the host's /verify/[certificateId] page.
 */
export function buildVerificationUrl(
  baseUrl: string,
  certificateId: string,
  hash: string
): string {
  const base = baseUrl.replace(/\/$/, "")
  return `${base}/verify/${certificateId}?h=${hash}`
}

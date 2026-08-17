/**
 * @codemastery/certificate-generator
 *
 * A portable, self-contained certificate generator module for Next.js.
 *
 * Generates beautiful PDF certificates with:
 *   - Access control (guest / normal / premium / 12-day trial gating)
 *   - Verification QR codes + cryptographic hashes
 *   - 3 templates (classic, modern, minimal)
 *   - Pluggable store interface (works with any database)
 *   - React components for preview + download
 *
 * DROPPABLE INTO ANY NEXT.JS PROJECT.
 *
 * Quick start:
 * ```ts
 * import { generateCertificate, checkCertificateAccess } from "@codemastery/certificate-generator"
 *
 * // Server-side:
 * const pdf = await generateCertificate({
 *   recipientName: "Jane Doe",
 *   courseName: "Python Fundamentals",
 *   issuerName: "CodeMastery",
 * }, { template: "classic", verificationUrl: "https://yoursite.com" })
 *
 * // Access check:
 * const result = checkCertificateAccess(userCtx, "FREE", hasCompleted)
 * if (!result.allowed) return showError(result.reason)
 * ```
 *
 * See README.md for full integration guide.
 */

// Public API exports
export { generateCertificate } from "./lib/generate"
export {
  checkCertificateAccess,
  getEffectiveAccess,
  getAccessLabel,
  resolveEntitlementState,
  getTrialDaysRemaining,
} from "./lib/access-control"
export {
  generateCertificateId,
  computeVerificationHash,
  verifyCertificateHash,
  buildVerificationUrl,
} from "./lib/verify"

// React components
export { CertificatePreview } from "./components/CertificatePreview"
export { CertificateDownloadButton } from "./components/CertificateDownloadButton"
export { CertificateModal } from "./components/CertificateModal"

// Types
export type {
  AccountPlan,
  EntitlementState,
  EffectiveAccess,
  AccessContext,
  CertificateAccessLevel,
  CertificateData,
  AccessResult,
  GenerateOptions,
  GenerateOutput,
  CertificateStore,
  CertificateRecord,
  AccessAdapter,
} from "./types"

export const VERSION = "1.0.0"

/**
 * Core type definitions for the certificate generator module.
 *
 * These types are designed to be portable — the host project adapts its
 * own user/auth/entitlement models into these shapes via a thin adapter.
 */

// ----------------------------------------------------------------
// USER ACCESS MODEL
// ----------------------------------------------------------------

/**
 * The three user-facing account states, per the platform's access model.
 *
 * - GUEST:    Unauthenticated visitor. No persistent progress, no certs.
 * - NORMAL:   Registered free account. Receives gamification + progress.
 * - PREMIUM:  Lifetime Premium purchaser. Full access to all features.
 *
 * Internally, the entitlement layer distinguishes:
 * - NORMAL_TRIAL_ACTIVE: Normal user within their 12-day Premium trial.
 * - NORMAL_TRIAL_EXPIRED: Normal user whose trial has ended.
 * - PREMIUM_LIFETIME: User who purchased the one-time lifetime plan.
 *
 * The user-facing label is always one of GUEST / NORMAL / PREMIUM.
 */
export type AccountPlan = "GUEST" | "NORMAL" | "PREMIUM"

/**
 * The internal entitlement state — the source of truth for access control.
 * Derived server-side from user + trial + entitlement records.
 */
export type EntitlementState =
  | "GUEST"
  | "NORMAL_TRIAL_ACTIVE"
  | "NORMAL_TRIAL_EXPIRED"
  | "NORMAL_NO_TRIAL" // existing users migrated without a trial
  | "PREMIUM_LIFETIME"
  | "SUSPENDED"

/**
 * The user-facing access tier. This is what the UI shows.
 * - "Premium Trial" during the 12-day trial (NOT "Premium Member")
 * - "Premium" after lifetime purchase
 */
export type EffectiveAccess = "GUEST" | "NORMAL" | "PREMIUM_TRIAL" | "PREMIUM"

/**
 * Context passed into the access-control functions. The host project
 * constructs this from its session + database lookups.
 */
export interface AccessContext {
  /** Whether the user is authenticated at all. */
  authenticated: boolean
  /** The user's account plan. */
  plan: AccountPlan
  /** The resolved entitlement state (computed server-side). */
  entitlementState: EntitlementState
  /** ISO timestamp of when the trial ends, if active. */
  trialEndsAt?: string
  /** Days remaining in the trial (0 if expired). Computed server-side. */
  trialDaysRemaining?: number
  /** Whether the user has purchased lifetime Premium. */
  hasLifetimePremium: boolean
  /** Whether the user's account is suspended/banned. */
  suspended?: boolean
}

// ----------------------------------------------------------------
// CERTIFICATE DATA
// ----------------------------------------------------------------

/**
 * Access level for a certificate. Controls who can generate it.
 * - PUBLIC:  Anyone (including guests) can generate/view.
 * - FREE:    Any authenticated user (Normal or Premium).
 * - PREMIUM: Only Premium users (lifetime OR active trial).
 */
export type CertificateAccessLevel = "PUBLIC" | "FREE" | "PREMIUM"

/**
 * The input data needed to render a certificate.
 */
export interface CertificateData {
  /** Full name of the recipient. */
  recipientName: string
  /** The course/tutorial/subject the certificate is for. */
  courseName: string
  /** Optional subject/category (e.g. "Python", "Machine Learning"). */
  subjectName?: string
  /** The issuer/platform name (e.g. "CodeMastery"). */
  issuerName: string
  /** Optional issuer tagline. */
  issuerTagline?: string
  /** ISO date string the certificate is issued (defaults to now). */
  issuedAt?: string
  /** Optional expiry date (null = lifetime). */
  expiresAt?: string | null
  /** Unique certificate ID (generated if absent). */
  certificateId?: string
  /** Verification hash (generated from the other fields if absent). */
  verificationHash?: string
  /** Optional grade or score (e.g. "95%", "A+", "Passed"). */
  grade?: string
  /** Optional duration/score text (e.g. "Completed in 45 hours"). */
  completionNote?: string
  /** Optional instructor/signatory name. */
  instructorName?: string
  /** Optional instructor title (e.g. "Senior Instructor"). */
  instructorTitle?: string
}

/**
 * The result of an access-control check for certificate generation.
 */
export interface AccessResult {
  /** Whether the user is allowed to generate this certificate. */
  allowed: boolean
  /** The user-facing access tier. */
  effectiveAccess: EffectiveAccess
  /** Human-readable reason if not allowed. */
  reason?: string
  /** The access level required for this certificate. */
  requiredAccess: CertificateAccessLevel
  /** Days remaining in trial (if applicable). */
  trialDaysRemaining?: number
}

/**
 * Options for PDF generation.
 */
export interface GenerateOptions {
  /** Template to use. Defaults to "classic". */
  template?: "classic" | "modern" | "minimal"
  /** Page size. Defaults to "A4 landscape". */
  pageSize?: "A4" | "Letter"
  orientation?: "landscape" | "portrait"
  /** Primary accent color (hex). Defaults to emerald #10b981. */
  accentColor?: string
  /** Optional logo image (PNG/JPEG bytes or base64 data URL). */
  logoImage?: Uint8Array | string
  /** Optional signature image (handwritten signature PNG/JPEG). Placed above the signature line. */
  signatureImage?: Uint8Array | string
  /** Optional digital seal image (the official circular seal). */
  sealImage?: Uint8Array | string
  /** Optional inkpad/wax seal image (the raw stamped seal texture). Placed behind the digital seal for a realistic "pressed" effect. */
  inkpadSealImage?: Uint8Array | string
  /** Verification URL base (for the QR code). e.g. "https://yoursite.com/verify" */
  verificationUrl?: string
  /** Optional custom font (bytes) for recipient name. Falls back to Helvetica-Bold. */
  customFont?: Uint8Array
}

/**
 * The output of PDF generation.
 */
export interface GenerateOutput {
  /** The PDF file as bytes. */
  bytes: Uint8Array
  /** The certificate data used. */
  data: CertificateData
  /** The generated certificate ID. */
  certificateId: string
  /** The verification hash. */
  verificationHash: string
  /** MIME type. */
  contentType: "application/pdf"
  /** Suggested filename. */
  filename: string
}

/**
 * A pluggable store interface so the host project can persist certificates
 * in any database (Prisma, Drizzle, raw SQL, Supabase, etc.).
 */
export interface CertificateStore {
  /** Save an issued certificate record. */
  save(record: CertificateRecord): Promise<void>
  /** Look up a certificate by its ID (for verification). */
  findById(id: string): Promise<CertificateRecord | null>
  /** List certificates for a user. */
  listByUser(userId: string): Promise<CertificateRecord[]>
  /** Check whether a certificate ID already exists (for uniqueness). */
  exists(id: string): Promise<boolean>
}

/**
 * A persisted certificate record (stored in the host's database).
 */
export interface CertificateRecord {
  id: string
  userId: string
  recipientName: string
  courseName: string
  subjectName?: string
  issuerName: string
  issuedAt: string
  expiresAt?: string | null
  verificationHash: string
  grade?: string
  template: string
  createdAt: string
}

/**
 * The adapter the host project implements to bridge its auth/entitlement
 * system into the certificate module's access-control logic.
 *
 * Example:
 * ```ts
 * const adapter: AccessAdapter = {
 *   async getAccessContext(userId): Promise<AccessContext> {
 *     const user = await db.user.findUnique({ where: { id: userId } })
 *     const trial = await db.premiumTrial.findUnique({ where: { userId } })
 *     return {
 *       authenticated: true,
 *       plan: user.hasLifetimePremium ? "PREMIUM" : "NORMAL",
 *       entitlementState: resolveEntitlementState(user, trial),
 *       trialEndsAt: trial?.endsAt,
 *       trialDaysRemaining: daysUntil(trial?.endsAt),
 *       hasLifetimePremium: user.hasLifetimePremium,
 *     }
 *   },
 *   async getUserEligibility(userId, certificateId) {
 *     // Check: has the user actually completed the course?
 *     const progress = await db.tutorialProgress.findMany(...)
 *     return progress.every(p => p.completed)
 *   }
 * }
 * ```
 */
export interface AccessAdapter {
  /** Resolve the access context for a user (or null if guest). */
  getAccessContext(userId: string | null): Promise<AccessContext | null>
  /**
   * Check whether the user has met the completion requirements for the
   * certificate (e.g. completed all tutorials in a subject).
   * The host project implements this — the module never grants a
   * certificate without this returning true.
   */
  getUserEligibility(
    userId: string,
    certificateSpec: { courseName: string; subjectName?: string; certificateId?: string }
  ): Promise<{ eligible: boolean; reason?: string }>
}

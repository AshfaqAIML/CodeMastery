/**
 * Central entitlement service for the CodeMastery access model.
 *
 * GUEST / NORMAL / PREMIUM + a real 12-day Premium trial for new Normal
 * users. Per the platform spec:
 *
 *   - The Account Plan (User.plan) stays NORMAL forever — we never flip
 *     roles to demote users. Access tiers are DERIVED from:
 *       • PremiumTrial        (startedAt/endsAt/status — server time authoritative)
 *       • PremiumEntitlement  (one-time lifetime purchase or admin grant)
 *   - Access control is timestamp-based, not status-based. An ACTIVE
 *     trial whose endsAt has passed behaves as EXPIRED immediately,
 *     without waiting for any cron job (spec #30).
 *   - All feature gates funnel through this service — no scattered
 *     `if (isPremium)` checks (spec #4).
 *
 * The certificate module's access-control lib is reused as the single
 * source of truth for effective-access derivation.
 */

import { db } from "@/lib/db"
import {
  resolveEntitlementState,
  getEffectiveAccess,
  getTrialDaysRemaining,
  getAccessLabel,
  type AccessContext,
  type EffectiveAccess,
  type EntitlementState,
} from "@codemastery/certificate-generator"

export type Plan = "GUEST" | "NORMAL" | "PREMIUM"

export type AccessSummary = {
  plan: Plan
  entitlementState: EntitlementState | "GUEST"
  effectiveAccess: EffectiveAccess
  label: string
  trialEndsAt: string | null
  trialDaysRemaining: number
  hasLifetimePremium: boolean
  suspended: boolean
}

export const GUEST_SUMMARY: AccessSummary = {
  plan: "GUEST",
  entitlementState: "GUEST",
  effectiveAccess: "GUEST",
  label: "Guest",
  trialEndsAt: null,
  trialDaysRemaining: 0,
  hasLifetimePremium: false,
  suspended: false,
}

// ----------------------------------------------------------------
// CONTEXT LOADING (server-side, DB-derived — never client flags)
// ----------------------------------------------------------------

/**
 * Build the module AccessContext for a user from real DB records.
 *
 * Lazily expires trials whose server-side timestamp has passed: the
 * record is flipped to EXPIRED (with an audit entry) so stored state
 * stays accurate, but access decisions never depend on that write —
 * the timestamp check in getEffectiveAccess is what actually gates.
 */
export async function getAccessContext(userId: string | null): Promise<AccessContext | null> {
  if (!userId) return null

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  })
  if (!user) return null

  const [trial, entitlement] = await Promise.all([
    db.premiumTrial.findUnique({ where: { userId } }),
    db.premiumEntitlement.findFirst({ where: { userId, status: "ACTIVE" } }),
  ])

  let effectiveTrial = trial
  if (
    trial &&
    trial.status === "ACTIVE" &&
    new Date(trial.endsAt).getTime() <= Date.now()
  ) {
    effectiveTrial = await db.$transaction(
      async (tx) => {
        const updated = await tx.premiumTrial.updateMany({
          where: { id: trial.id, status: "ACTIVE" },
          data: { status: "EXPIRED" },
        })
        if (updated.count > 0) {
          await tx.entitlementAuditLog.create({
            data: {
              userId,
              action: "TRIAL_EXPIRED",
              detail: `Trial ended ${trial.endsAt.toISOString()}`,
            },
          })
        }
        return tx.premiumTrial.findUnique({ where: { id: trial.id } })
      },
      { timeout: 30_000, maxWait: 10_000 }
    )
  }

  const hasLifetimePremium = !!entitlement

  return {
    authenticated: true,
    plan: hasLifetimePremium ? "PREMIUM" : "NORMAL",
    entitlementState: resolveEntitlementState(
      hasLifetimePremium,
      effectiveTrial
        ? {
            status: effectiveTrial.status as "ACTIVE" | "EXPIRED" | "CONVERTED",
            endsAt: effectiveTrial.endsAt.toISOString(),
          }
        : null
    ),
    trialEndsAt: effectiveTrial?.endsAt.toISOString(),
    trialDaysRemaining: getTrialDaysRemaining(effectiveTrial?.endsAt.toISOString()),
    hasLifetimePremium,
    suspended: false,
  }
}

/** Convenience: full summary for the requesting user (null = guest). */
export async function getAccessSummary(userId: string | null): Promise<AccessSummary> {
  const ctx = await getAccessContext(userId)
  if (!ctx) return GUEST_SUMMARY
  const effectiveAccess = getEffectiveAccess(ctx)
  return {
    plan: ctx.plan,
    entitlementState: ctx.entitlementState,
    effectiveAccess,
    label: getAccessLabel(effectiveAccess),
    trialEndsAt: ctx.trialEndsAt ?? null,
    trialDaysRemaining: ctx.trialDaysRemaining ?? 0,
    hasLifetimePremium: ctx.hasLifetimePremium,
    suspended: !!ctx.suspended,
  }
}

// ----------------------------------------------------------------
// FEATURE GATES — the only place these decisions are made
// ----------------------------------------------------------------

/** Whether the user currently enjoys Premium features (trial or lifetime). */
export function hasPremiumAccess(summary: AccessSummary): boolean {
  return (
    summary.effectiveAccess === "PREMIUM" ||
    summary.effectiveAccess === "PREMIUM_TRIAL"
  )
}

export function isTrialActive(summary: AccessSummary): boolean {
  return summary.effectiveAccess === "PREMIUM_TRIAL"
}

export function isLifetimePremium(summary: AccessSummary): boolean {
  return summary.effectiveAccess === "PREMIUM"
}

/** AI Tutor: guest no · trial full (limits) · expired no · premium yes. */
export function canUseAITutor(summary: AccessSummary): boolean {
  return hasPremiumAccess(summary)
}

/** Generic premium-feature gate. */
export function canUsePremiumFeature(summary: AccessSummary): boolean {
  return hasPremiumAccess(summary)
}

/** Certificates: any authenticated user (level checks happen per certificate). */
export function canGenerateCertificate(summary: AccessSummary): boolean {
  return summary.effectiveAccess !== "GUEST"
}

// ----------------------------------------------------------------
// CONTENT ACCESS (PUBLIC / FREE / PREMIUM)
// ----------------------------------------------------------------

export type ContentAccessLevel = "PUBLIC" | "FREE" | "PREMIUM"

/**
 * Combine multiple access levels (e.g. subject + tutorial) into the
 * most restrictive one: PREMIUM > FREE > PUBLIC.
 */
export function combineLevels(
  ...levels: (string | null | undefined)[]
): ContentAccessLevel {
  let level: ContentAccessLevel = "PUBLIC"
  for (const raw of levels) {
    const l = ((raw ?? "PUBLIC").toUpperCase() ?? "PUBLIC") as ContentAccessLevel
    if (l === "PREMIUM") return "PREMIUM"
    if (l === "FREE") level = "FREE"
  }
  return level
}

export type ContentAccessResult = {
  canRead: boolean
  /** True when the user may see the preview (title/summary) but not the body. */
  previewOnly: boolean
  reason?: string
  summary: AccessSummary
}

/**
 * Decide whether a user may read content tagged with the given access level.
 *   PUBLIC  → everyone (guests read fully, no progress recorded)
 *   FREE    → any authenticated user; guests see a preview
 *   PREMIUM → trial-active / lifetime; guests and expired trials see a preview
 */
export function evaluateContentAccess(
  summary: AccessSummary,
  accessLevel: string | null | undefined
): Omit<ContentAccessResult, "summary"> {
  const level = ((accessLevel ?? "PUBLIC").toUpperCase() ?? "PUBLIC") as ContentAccessLevel

  if (level === "PUBLIC") {
    return { canRead: true, previewOnly: false }
  }

  if (level === "FREE") {
    if (summary.effectiveAccess === "GUEST") {
      return {
        canRead: false,
        previewOnly: true,
        reason:
          "Create a free account to unlock the full tutorial and track your progress.",
      }
    }
    return { canRead: true, previewOnly: false }
  }

  // PREMIUM
  if (hasPremiumAccess(summary)) {
    return { canRead: true, previewOnly: false }
  }
  if (summary.effectiveAccess === "GUEST") {
    return {
      canRead: false,
      previewOnly: true,
      reason:
        "This is a Premium tutorial. Create a free account to start your 12-day Premium trial.",
    }
  }
  return {
    canRead: false,
    previewOnly: true,
    reason:
      "This is a Premium tutorial. Your 12-day Premium trial has ended — unlock lifetime Premium to keep learning here.",
  }
}

/** Server-side content gate for a single request (session-derived). */
export async function getContentAccess(
  userId: string | null,
  accessLevel: string | null | undefined
): Promise<ContentAccessResult> {
  const summary = await getAccessSummary(userId)
  return { ...evaluateContentAccess(summary, accessLevel), summary }
}

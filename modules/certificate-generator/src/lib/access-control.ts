/**
 * Centralized access-control logic for certificate generation.
 *
 * Implements the user access model from the platform spec:
 *
 *   GUEST → no certificate generation
 *   NORMAL + trial active → certificate only if the user is genuinely
 *                            eligible (completed the course requirements)
 *   NORMAL + trial expired → follows configured entitlement rules
 *   PREMIUM → full access to eligible certificate generation
 *
 * IMPORTANT: This module NEVER grants a certificate merely because a
 * user is on a Premium plan or in a trial. The host's AccessAdapter
 * must confirm the user has actually met the completion requirements.
 *
 * All checks are designed to be called SERVER-SIDE. The AccessContext
 * must be constructed server-side from the session + database —
 * never trust client-supplied plan/trial flags.
 */

import type {
  AccessContext,
  AccessResult,
  CertificateAccessLevel,
  EffectiveAccess,
  EntitlementState,
} from "../types"

// ----------------------------------------------------------------
// EFFECTIVE ACCESS CALCULATION
// ----------------------------------------------------------------

/**
 * Compute the user-facing effective access tier from the entitlement state.
 *
 * This is the SINGLE source of truth for access decisions. Every
 * protected feature calls this — no scattered `if (isPremium)` checks.
 *
 * The trial is considered ACTIVE only if:
 *   1. The entitlement state is NORMAL_TRIAL_ACTIVE, AND
 *   2. trialEndsAt is in the future (server time is authoritative).
 *
 * Per spec #30: "Do not rely on cron alone." Access control is
 * timestamp-based, so it's correct even if a cleanup job hasn't run.
 */
export function getEffectiveAccess(
  ctx: AccessContext | null
): EffectiveAccess {
  // No context = guest (unauthenticated)
  if (!ctx || !ctx.authenticated) return "GUEST"

  // Suspended users get no access
  if (ctx.suspended) return "GUEST"

  // Lifetime Premium overrides everything
  if (ctx.hasLifetimePremium || ctx.entitlementState === "PREMIUM_LIFETIME") {
    return "PREMIUM"
  }

  // Check trial status — server-side timestamp comparison
  if (ctx.entitlementState === "NORMAL_TRIAL_ACTIVE") {
    // Verify the trial hasn't expired by server clock
    if (ctx.trialEndsAt && new Date(ctx.trialEndsAt).getTime() > Date.now()) {
      return "PREMIUM_TRIAL"
    }
    // Trial record says active but timestamp says expired → treat as expired
    return "NORMAL"
  }

  // All other Normal states
  return "NORMAL"
}

// ----------------------------------------------------------------
// CERTIFICATE ACCESS CHECK
// ----------------------------------------------------------------

/**
 * Determine whether a user can generate a specific certificate.
 *
 * Rules (per spec #11):
 *
 *   GUEST → NEVER allowed. "No certificate generation."
 *
 *   NORMAL + TRIAL ACTIVE → allowed only if:
 *     - certificate access level is FREE or PREMIUM, AND
 *     - the user has actually met completion requirements (host checks).
 *     "Certificate generation may be available only when the user is
 *      actually eligible under the certificate's requirements. Do not
 *      grant a certificate merely because the user is in the trial."
 *
 *   NORMAL + TRIAL EXPIRED → allowed only if:
 *     - certificate access level is FREE, AND
 *     - the user meets completion requirements.
 *     "Certificate access should follow the configured course/certificate
 *      entitlement rules."
 *
 *   PREMIUM → allowed if:
 *     - the user meets completion requirements.
 *     "Full access to eligible certificate generation."
 *
 * Returns an AccessResult with `allowed` + a human-readable reason.
 */
export function checkCertificateAccess(
  ctx: AccessContext | null,
  requiredAccess: CertificateAccessLevel,
  isEligible: boolean
): AccessResult {
  const effectiveAccess = getEffectiveAccess(ctx)

  // GUEST — never allowed
  if (effectiveAccess === "GUEST") {
    return {
      allowed: false,
      effectiveAccess,
      requiredAccess,
      reason:
        "Certificates are only available to registered users. Create a free account to earn certificates.",
    }
  }

  // Check access level by plan
  let hasAccessLevel = false
  if (requiredAccess === "PUBLIC") {
    hasAccessLevel = true
  } else if (requiredAccess === "FREE") {
    // Any authenticated user (GUEST already filtered out above)
    hasAccessLevel = true
  } else if (requiredAccess === "PREMIUM") {
    // Only Premium (lifetime OR trial)
    hasAccessLevel =
      effectiveAccess === "PREMIUM" || effectiveAccess === "PREMIUM_TRIAL"
  }

  if (!hasAccessLevel) {
    if (effectiveAccess === "NORMAL" && requiredAccess === "PREMIUM") {
      return {
        allowed: false,
        effectiveAccess,
        requiredAccess,
        reason:
          "This is a Premium certificate. Your 12-day Premium trial has ended — unlock lifetime Premium to generate this certificate.",
        trialDaysRemaining: ctx?.trialDaysRemaining,
      }
    }
    return {
      allowed: false,
      effectiveAccess,
      requiredAccess,
      reason: "You do not have access to this certificate.",
    }
  }

  // CRITICAL: Even with the right plan, the user must have actually
  // completed the course requirements. The host adapter verifies this.
  if (!isEligible) {
    return {
      allowed: false,
      effectiveAccess,
      requiredAccess,
      reason:
        "You have not completed the requirements for this certificate yet. Finish all the tutorials in this subject to earn it.",
      trialDaysRemaining: ctx?.trialDaysRemaining,
    }
  }

  return {
    allowed: true,
    effectiveAccess,
    requiredAccess,
    trialDaysRemaining: ctx?.trialDaysRemaining,
  }
}

// ----------------------------------------------------------------
// ENTITLEMENT STATE RESOLVER
// ----------------------------------------------------------------

/**
 * Helper for the host project: compute the EntitlementState from raw
 * user + trial records.
 *
 * The host calls this when building an AccessContext. It centralizes
 * the "Normal + Active Trial" / "Normal + Expired Trial" / "Premium"
 * logic so it's not duplicated across the host's codebase.
 *
 * @param hasLifetimePremium - whether the user purchased lifetime Premium
 * @param trial - the trial record (if any), with startedAt/endsAt/status
 * @param now   - the current server time (injectable for testing)
 */
export function resolveEntitlementState(
  hasLifetimePremium: boolean,
  trial:
    | { status: "ACTIVE" | "EXPIRED" | "CONVERTED"; endsAt: string }
    | null,
  now: Date = new Date()
): EntitlementState {
  if (hasLifetimePremium) return "PREMIUM_LIFETIME"

  if (!trial) return "NORMAL_NO_TRIAL"

  if (trial.status === "CONVERTED") return "PREMIUM_LIFETIME"

  if (trial.status === "EXPIRED") return "NORMAL_TRIAL_EXPIRED"

  // trial.status === "ACTIVE" — but verify the timestamp hasn't passed.
  // Per spec #30: access control is timestamp-based, not status-based.
  if (new Date(trial.endsAt).getTime() > now.getTime()) {
    return "NORMAL_TRIAL_ACTIVE"
  }

  // Record says ACTIVE but timestamp says expired → treat as expired.
  return "NORMAL_TRIAL_EXPIRED"
}

/**
 * Compute the number of days remaining in a trial (0 if expired).
 * Server-time authoritative — never trusts the client clock.
 */
export function getTrialDaysRemaining(
  trialEndsAt: string | undefined,
  now: Date = new Date()
): number {
  if (!trialEndsAt) return 0
  const ms = new Date(trialEndsAt).getTime() - now.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

// ----------------------------------------------------------------
// UI HELPERS
// ----------------------------------------------------------------

/**
 * A user-facing label for the effective access tier.
 * Per spec #45: do NOT label trial users as "Premium Member".
 */
export function getAccessLabel(access: EffectiveAccess): string {
  switch (access) {
    case "GUEST":
      return "Guest"
    case "NORMAL":
      return "Free"
    case "PREMIUM_TRIAL":
      return "Premium Trial"
    case "PREMIUM":
      return "Premium Member"
    default:
      return "Unknown"
  }
}

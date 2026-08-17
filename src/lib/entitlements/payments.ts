/**
 * Premium purchase + administration service.
 *
 * Implements the spec's payment security requirements:
 *   - server-side verification (webhook with HMAC signature)
 *   - idempotency (transactionId / idempotencyKey uniqueness)
 *   - duplicate-transaction prevention
 *   - transaction records (Payment rows)
 *   - entitlement creation (PremiumEntitlement)
 *   - audit logging (EntitlementAuditLog)
 *
 * Lifetime Premium is a one-time purchase. Purchasing during an active
 * trial converts the trial (CONVERTED) — the user is never downgraded
 * when the trial period would have ended.
 */

import { db } from "@/lib/db"
import { config } from "@/lib/config"
import { createHmac, timingSafeEqual } from "crypto"

export type GrantOutcome = {
  granted: boolean
  duplicate: boolean
  reason?: string
}

type PurchaseInput = {
  userId: string
  actorId?: string | null
  provider: string
  transactionId?: string
  idempotencyKey?: string
  amount?: number
  currency?: string
}

/**
 * Complete a lifetime-Premium purchase. Idempotent: repeated calls with
 * the same transactionId / idempotencyKey, or for an already-active
 * entitlement, are rejected as duplicates and audited.
 */
export async function completePremiumPurchase(
  input: PurchaseInput
): Promise<GrantOutcome> {
  const { userId, actorId, provider, transactionId, idempotencyKey, amount, currency } =
    input

  return db.$transaction(
    async (tx) => {
      const existing = await tx.premiumEntitlement.findUnique({ where: { userId } })
      if (existing?.status === "ACTIVE") {
        await tx.entitlementAuditLog.create({
          data: {
            actorId: actorId ?? null,
            userId,
            action: "PAYMENT_DUPLICATE_REJECTED",
            detail: `Duplicate ${provider} payment (${transactionId ?? idempotencyKey ?? "unknown"}) for an already-active Premium entitlement.`,
          },
        })
        return { granted: false, duplicate: true, reason: "Already Premium." }
      }

      if (transactionId) {
        const dup = await tx.payment.findUnique({ where: { transactionId } })
        if (dup) {
          return { granted: false, duplicate: true, reason: "Payment already processed." }
        }
      }
      if (idempotencyKey) {
        const dup = await tx.payment.findUnique({ where: { idempotencyKey } })
        if (dup) {
          return { granted: false, duplicate: true, reason: "Payment already processed." }
        }
      }

      const payment = await tx.payment.create({
        data: {
          userId,
          provider,
          transactionId,
          idempotencyKey,
          amount: amount ?? Math.round(config.premium.priceUsd * 100),
          currency: currency ?? config.premium.currency,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      })

      await tx.premiumEntitlement.create({
        data: {
          userId,
          source: "PURCHASE",
          paymentId: payment.id,
          status: "ACTIVE",
        },
      })

      const trial = await tx.premiumTrial.findUnique({ where: { userId } })
      if (trial && trial.status === "ACTIVE") {
        await tx.premiumTrial.update({
          where: { id: trial.id },
          data: { status: "CONVERTED" },
        })
        await tx.entitlementAuditLog.create({
          data: {
            actorId: actorId ?? null,
            userId,
            action: "TRIAL_CONVERTED",
            detail: "Trial converted by lifetime purchase.",
          },
        })
      }

      await tx.entitlementAuditLog.create({
        data: {
          actorId: actorId ?? null,
          userId,
          action: "PREMIUM_GRANTED",
          detail: `${provider} payment ${payment.id} → lifetime Premium entitlement.`,
        },
      })

      return { granted: true, duplicate: false }
    },
    { timeout: 30_000, maxWait: 10_000 }
  )
}

/** Admin-granted lifetime Premium (idempotent, audited). */
export async function grantPremiumByAdmin(input: {
  userId: string
  actorId: string
  reason?: string
}): Promise<GrantOutcome> {
  const { userId, actorId, reason } = input
  return db.$transaction(
    async (tx) => {
      const existing = await tx.premiumEntitlement.findUnique({ where: { userId } })
      if (existing?.status === "ACTIVE") {
        return { granted: false, duplicate: true, reason: "Already Premium." }
      }
      if (existing?.status === "REVOKED") {
        await tx.premiumEntitlement.update({
          where: { id: existing.id },
          data: { status: "ACTIVE", revokedAt: null, revokedById: null, revokedReason: null },
        })
      } else {
        await tx.premiumEntitlement.create({
          data: { userId, source: "ADMIN_GRANT", status: "ACTIVE" },
        })
      }
      await tx.entitlementAuditLog.create({
        data: {
          actorId,
          userId,
          action: "PREMIUM_GRANTED",
          detail: `Admin grant${reason ? ` — ${reason}` : ""}.`,
        },
      })
      return { granted: true, duplicate: false }
    },
    { timeout: 30_000, maxWait: 10_000 }
  )
}

/** Admin-revoked lifetime Premium (idempotent, audited). */
export async function revokePremiumByAdmin(input: {
  userId: string
  actorId: string
  reason?: string
}): Promise<GrantOutcome> {
  const { userId, actorId, reason } = input
  return db.$transaction(
    async (tx) => {
      const existing = await tx.premiumEntitlement.findUnique({ where: { userId } })
      if (!existing || existing.status === "REVOKED") {
        return { granted: false, duplicate: true, reason: "No active entitlement." }
      }
      await tx.premiumEntitlement.update({
        where: { id: existing.id },
        data: { status: "REVOKED", revokedAt: new Date(), revokedById: actorId, revokedReason: reason ?? null },
      })
      await tx.entitlementAuditLog.create({
        data: {
          actorId,
          userId,
          action: "PREMIUM_REVOKED",
          detail: `Admin revoke${reason ? ` — ${reason}` : ""}.`,
        },
      })
      return { granted: true, duplicate: false }
    },
    { timeout: 30_000, maxWait: 10_000 }
  )
}

/** Verify an HMAC-SHA256 webhook signature (constant-time comparison). */
export function verifyWebhookSignature(
  secret: string,
  rawBody: string | Buffer,
  signatureHeader: string | null
): boolean {
  if (!secret || !signatureHeader) return false
  const expected = signatureHeader.replace(/^sha256=/i, "")
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex")
  const a = Buffer.from(digest, "hex")
  const b = Buffer.from(expected, "hex")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

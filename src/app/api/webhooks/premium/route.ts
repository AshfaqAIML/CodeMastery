import { NextRequest } from "next/server"
import { ok, err, notFound } from "@/lib/api"
import { config } from "@/lib/config"
import { completePremiumPurchase, verifyWebhookSignature } from "@/lib/entitlements/payments"
import { z } from "zod"

/**
 * Payment webhook — server-side purchase completion.
 *
 * A verified webhook (HMAC-SHA256 over the raw body, header
 * `x-premium-signature: sha256=<hex>`) completes a one-time lifetime
 * Premium purchase. Completion is idempotent: repeated deliveries of
 * the same transactionId / idempotencyKey, or for an already-active
 * entitlement, are audited and rejected as duplicates.
 *
 * Disabled (404) unless PREMIUM_WEBHOOK_SECRET is configured — a real
 * gateway (or a trusted operator tool) delivers here.
 *
 * Body: { userId, transactionId, idempotencyKey, amount, currency, provider }
 */

const schema = z.object({
  userId: z.string().min(1),
  transactionId: z.string().min(1),
  idempotencyKey: z.string().min(1).optional(),
  amount: z.number().int().positive().optional(),
  currency: z.string().max(8).optional(),
  provider: z.string().max(40).optional(),
})

export async function POST(req: NextRequest) {
  if (!config.premium.webhookSecret) {
    return notFound("Webhook not configured on this deployment.")
  }

  const raw = Buffer.from(await req.arrayBuffer())
  const signature = req.headers.get("x-premium-signature")

  if (!verifyWebhookSignature(config.premium.webhookSecret, raw, signature)) {
    return err("Invalid webhook signature.", 401)
  }

  let body: unknown
  try {
    body = JSON.parse(raw.toString("utf8"))
  } catch {
    return err("Invalid JSON body.", 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return err("Invalid payload.", 422, parsed.error.flatten())
  }

  const { userId, transactionId, idempotencyKey, amount, currency, provider } = parsed.data

  const result = await completePremiumPurchase({
    userId,
    provider: provider ?? "webhook",
    transactionId,
    idempotencyKey,
    amount,
    currency,
  })

  return ok(
    { granted: result.granted, duplicate: result.duplicate, reason: result.reason },
    { status: result.granted ? 201 : 200 }
  )
}

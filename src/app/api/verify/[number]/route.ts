import { NextRequest } from "next/server"
import { ok, err, rateLimit } from "@/lib/api"
import { config } from "@/lib/config"
import { lookupPublicCertificate } from "@/lib/certificates/verify"

type Ctx = { params: Promise<{ number: string }> }

/**
 * Public verification lookup (JSON, rate-limited). The QR code on
 * certificates points at the /verify/[number] page, which renders
 * server-side; this endpoint serves programmatic callers.
 */
export async function GET(req: NextRequest, ctx: Ctx) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rl = rateLimit(
    `verify:${ip}`,
    config.rateLimit.verifyMax,
    config.rateLimit.verifyWindowMs
  )
  if (config.rateLimit.enabled && !rl.ok) {
    return err(`Too many verification requests. Retry in ${Math.ceil((rl.resetAt - Date.now()) / 1000)}s.`, 429)
  }

  const { number } = await ctx.params
  const cert = await lookupPublicCertificate(number)
  if (!cert) return ok({ status: "INVALID" as const })

  return ok({ certificate: cert })
}
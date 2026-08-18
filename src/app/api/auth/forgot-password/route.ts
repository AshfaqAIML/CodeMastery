import { NextRequest } from "next/server"
import { createHash, randomBytes } from "crypto"
import { db } from "@/lib/db"
import { ok, err, rateLimit } from "@/lib/api"
import { config } from "@/lib/config"
import { getEmail } from "@/lib/email"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"

const schema = z.object({ email: z.string().email().max(120) })
const RESET_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Forgot password — step 1 of 2.
 *
 * Prints/templates a reset link containing a random token. The database
 * stores ONLY the sha256 hash of the token, so a DB leak cannot be used
 * to reset accounts. The response never reveals whether the email exists
 * (anti-enumeration): success and failure return the same message.
 */
export async function POST(req: NextRequest) {
  if (config.rateLimit.enabled) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon"
    const rl = rateLimit(`forgot:${ip}`, 5, 60_000)
    const rlEmail = rateLimit(`forgot-email:${ip}`, 10, 60_000)
    if (!rl.ok || !rlEmail.ok) return err("Too many attempts. Please try again later.", 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const email = parsed.data.email.trim().toLowerCase()
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, name: true } })

  const userExists = !!user
  if (userExists && user) {
    // Invalidate any previous reset tokens (single active link per user).
    await db.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    const rawToken = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(rawToken).digest("hex")
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    })

    // The raw token appears ONLY inside the emailed link.
    const resetUrl = `${config.appUrl}/?auth=reset&token=${rawToken}`
    await (await getEmail()).send({
      to: user.email,
      subject: "Reset your CodeMastery password",
      text: `Hi ${user.name ?? "there"},\n\nWe received a request to reset your CodeMastery password.\nOpen this link to choose a new one (valid for 1 hour):\n\n${resetUrl}\n\nIf you didn't ask for this, you can safely ignore this email.\n\n— CodeMastery team`,
    })

    await recordAuditSafe({
      actorId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      targetType: "user",
      targetId: user.id,
      detail: `Password reset requested for ${user.email}.`,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon",
    })

    // Dev/e2e affordance: outside production the workspace can't receive
    // email, so mirror the link in the response. NEVER returned in prod.
    if (process.env.NODE_ENV !== "production") {
      return ok({ sent: true, devLink: resetUrl })
    }
  }

  return ok({ sent: true })
}
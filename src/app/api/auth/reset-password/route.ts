import { NextRequest } from "next/server"
import { createHash } from "crypto"
import { db } from "@/lib/db"
import { ok, err, rateLimit } from "@/lib/api"
import { config } from "@/lib/config"
import { hashPassword } from "@/lib/password"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"

const schema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(8).max(128),
})

/**
 * Reset password — step 2 of 2.
 *
 * Redeems a single-use token: hash it, look up, verify it is unused and
 * unexpired, then replace the password hash. All other tokens for the
 * user are invalidated too. Successful resets are audited.
 */
export async function POST(req: NextRequest) {
  if (config.rateLimit.enabled) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon"
    const rl = rateLimit(`reset:${ip}`, 10, 60_000)
    if (!rl.ok) return err("Too many attempts. Please try again later.", 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex")
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, email: true } } },
  })

  const invalid =
    !record ||
    !record.user ||
    record.usedAt !== null ||
    record.expiresAt.getTime() < Date.now()

  if (invalid) return err("This reset link is invalid or has expired.", 400)

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: record.user.id },
      data: { passwordHash: hashPassword(parsed.data.password) },
    })
    await tx.passwordResetToken.updateMany({
      where: { userId: record.user.id, usedAt: null },
      data: { usedAt: new Date() },
    })
  })

  await recordAuditSafe({
    actorId: record.user.id,
    action: "PASSWORD_RESET",
    targetType: "user",
    targetId: record.user.id,
    detail: `Password reset completed via link for ${record.user.email}.`,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon",
  })

  return ok({ reset: true })
}
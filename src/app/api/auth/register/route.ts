import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ok, err, rateLimit } from "@/lib/api"
import { config } from "@/lib/config"
import { getAccessSummary } from "@/lib/entitlements/service"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().max(120),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  if (config.rateLimit.enabled) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon"
    const rl = rateLimit(`register:${ip}`, config.rateLimit.authMax, config.rateLimit.authWindowMs)
    if (!rl.ok) return err("Too many attempts. Please try again later.", 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return err("Invalid input.", 422, parsed.error.flatten())
  }

  const { name, email, password } = parsed.data
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    return err("An account with this email already exists.", 409)
  }

  const baseUsername = name.trim().replace(/\s+/g, "_").toLowerCase()
  let username = baseUsername
  for (let attempt = 2; attempt <= 100; attempt++) {
    const taken = await db.user.findUnique({ where: { username } })
    if (!taken) break
    username = `${baseUsername}_${attempt}`
  }

  const user = await db.$transaction(
    async (tx) => {
      const created = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: name.trim(),
          username,
          passwordHash: hashPassword(password),
          role: "USER",
        },
        select: { id: true, email: true, name: true, username: true, role: true },
      })

      // Every new Normal account receives the 12-day Premium trial,
      // created server-side at signup (never client-provided).
      // Trial: startedAt = account creation, endsAt = +12 calendar days,
      // ACTIVE status. Timestamp-based access control kicks in later.
      const now = new Date()
      const endsAt = new Date(now.getTime() + config.premium.trialDays * 24 * 60 * 60 * 1000)
      await tx.premiumTrial.create({
        data: {
          userId: created.id,
          startedAt: now,
          endsAt,
          status: "ACTIVE",
          source: "SIGNUP",
        },
      })

      await tx.entitlementAuditLog.create({
        data: {
          userId: created.id,
          action: "TRIAL_GRANTED",
          detail: `12-day Premium trial granted at signup (ends ${endsAt.toISOString()}).`,
        },
      })

      await tx.activityLog.create({
        data: { userId: created.id, type: "account_created", xpDelta: 0, pointsDelta: 0 },
      })

      return created
    },
    { timeout: 30_000, maxWait: 10_000 }
  )

  const access = await getAccessSummary(user.id)

  return ok({ user, access }, { status: 201 })
}

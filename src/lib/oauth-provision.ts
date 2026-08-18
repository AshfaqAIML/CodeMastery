import { db } from "@/lib/db"
import { config } from "@/lib/config"

/**
 * Provision a local account for an OAuth (Google) first-time sign-in.
 *
 * Mirrors /api/auth/register so every account path gets the same shape:
 * unique username, 12-day Premium trial (server-side, never client
 * provided), TRIAL_GRANTED audit and an account_created activity entry.
 * Returns null when provisioning fails (rare, e.g. email collided).
 */
export async function provisionOAuthUser(
  email: string,
  name: string | null,
  image: string | null
): Promise<{ id: string; name: string | null; image: string | null } | null> {
  const baseUsername = (name ?? email.split("@")[0])
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase()
    .slice(0, 30)
  let username = baseUsername
  for (let attempt = 2; attempt <= 100; attempt++) {
    const taken = await db.user.findUnique({ where: { username } })
    if (!taken) break
    username = `${baseUsername}_${attempt}`
  }

  const now = new Date()
  const endsAt = new Date(now.getTime() + config.premium.trialDays * 24 * 60 * 60 * 1000)

  try {
    const created = await db.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            name: name?.trim() || null,
            username,
            image,
            role: "USER",
            // Google pre-verifies the email on our behalf.
            emailVerified: new Date(),
          },
          select: { id: true, name: true, image: true },
        })

        await tx.premiumTrial.create({
          data: {
            userId: user.id,
            startedAt: now,
            endsAt,
            status: "ACTIVE",
            source: "SIGNUP",
          },
        })

        await tx.entitlementAuditLog.create({
          data: {
            userId: user.id,
            action: "TRIAL_GRANTED",
            detail: `12-day Premium trial granted at Google signup (ends ${endsAt.toISOString()}).`,
          },
        })

        await tx.activityLog.create({
          data: { userId: user.id, type: "account_created", xpDelta: 0, pointsDelta: 0 },
        })

        return user
      },
      { timeout: 30_000, maxWait: 10_000 }
    )
    return created
  } catch {
    // Email/username collision race — the caller will treat it as a
    // failed sign-in; the user signs in again on the retry.
    return null
  }
}
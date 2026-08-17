import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { getAccessContext } from "@/lib/entitlements/service"
import { getEffectiveAccess } from "@codemastery/certificate-generator"
import { z } from "zod"

const schema = z.object({
  q: z.string().max(100).optional(),
  tier: z.enum(["all", "trial", "premium", "normal"]).optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

/**
 * Admin — user directory with search + filters.
 * Tier filtering happens server-side against real entitlement records.
 */
export async function GET(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return unauthorized()
  const denied = await assertPermission(me, "users.view")
  if (denied) return denied

  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()))
  if (!parsed.success) return zodErr(parsed.error)
  const { q, tier, role, status, limit, offset } = parsed.data

  const now = new Date()
  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
      { username: { contains: q, mode: "insensitive" as const } },
    ]
  }
  if (role) where.role = role
  if (status) where.status = status

  // Tier filters are applied against entitlement records, not the User.plan
  // string, so they reflect the true access model.
  const trialFilter = {
    premiumTrials: { some: { status: "ACTIVE", endsAt: { gt: now } } },
  }
  const premiumFilter = {
    premiumEntitlements: { some: { status: "ACTIVE" } },
  }
  if (tier === "trial") Object.assign(where, trialFilter)
  if (tier === "premium") Object.assign(where, premiumFilter)
  if (tier === "normal") {
    where.AND = [{ NOT: trialFilter }, { NOT: premiumFilter }]
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        plan: true,
        status: true,
        emailVerified: true,
        onboarded: true,
        totalXP: true,
        level: true,
        currentStreak: true,
        createdAt: true,
        premiumTrials: { select: { status: true, endsAt: true, source: true } },
        premiumEntitlements: { select: { status: true, source: true, grantedAt: true } },
      },
    }),
    db.user.count({ where }),
  ])

  const rows = await Promise.all(
    users.map(async (u) => {
      const ctx = await getAccessContext(u.id)
      return {
        ...u,
        effectiveAccess: getEffectiveAccess(ctx),
      }
    })
  )

  return ok({ users: rows, total, limit, offset })
}
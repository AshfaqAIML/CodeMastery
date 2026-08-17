import { db } from "@/lib/db"
import { ok, forbidden, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { getAccessContext } from "@/lib/entitlements/service"
import { getEffectiveAccess } from "@codemastery/certificate-generator"

/**
 * Admin — list account access states (plan, trial, lifetime entitlement)
 * for every user, newest first.
 */
export async function GET() {
  const me = await getCurrentUser()
  if (!me) return unauthorized()
  const denied = await assertPermission(me, "payments.view")
  if (denied) return denied

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
      premiumTrials: { select: { startedAt: true, endsAt: true, status: true, source: true } },
      premiumEntitlements: { select: { source: true, status: true, grantedAt: true, revokedAt: true } },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, provider: true, transactionId: true, amount: true, currency: true, status: true, createdAt: true },
      },
    },
  })

  const rows: any[] = []
  for (const u of users) {
    const ctx = await getAccessContext(u.id)
    rows.push({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      plan: u.plan,
      effectiveAccess: getEffectiveAccess(ctx),
      trial: u.premiumTrials[0]
        ? {
            status: u.premiumTrials[0].status,
            startedAt: u.premiumTrials[0].startedAt,
            endsAt: u.premiumTrials[0].endsAt,
            source: u.premiumTrials[0].source,
          }
        : null,
      entitlement: u.premiumEntitlements[0] ?? null,
      payments: u.payments,
      createdAt: u.createdAt,
    })
  }

  return ok({ users: rows })
}

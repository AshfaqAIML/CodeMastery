import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission, ROLES } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { z } from "zod"

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
  plan: z.enum(["NORMAL", "PREMIUM"]).optional(),
  emailVerified: z.boolean().optional(),
  name: z.string().min(1).max(60).optional(),
})

/**
 * Admin — update a user's role, account status, plan or profile.
 * Guards:
 * - Nobody may change their own role/status (prevents self-downgrade lockouts).
 * - ADMIN may not touch SUPER_ADMIN accounts; only SUPER_ADMIN may manage them.
 * - The last SUPER_ADMIN cannot be demoted or suspended (no zero-admin state).
 * - ADMIN may not grant roles equal or above their own.
 * - Role/status changes are audited.
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const me = await getCurrentUser()
  if (!me) return unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const { id } = await ctx.params
  const target = await db.user.findUnique({ where: { id }, select: { id: true, email: true, role: true, status: true } })
  if (!target) return err("User not found.", 404)

  const isSelf = id === me.id
  const isSuperTarget = target.role === ROLES.SUPER_ADMIN
  const isSuperActor = me.role === ROLES.SUPER_ADMIN

  if (parsed.data.role || parsed.data.status) {
    if (isSelf) return forbidden("You cannot change your own role or account status.")
    if (!isSuperActor && (isSuperTarget || target.role === ROLES.ADMIN)) {
      return forbidden("Only a Super Admin can manage ADMIN accounts.")
    }
    // Role changes and status changes are distinct permissions.
    if (parsed.data.role && !isSuperActor) {
      const denied = await assertPermission(me, "users.roles.manage")
      if (denied) return denied
    }
    if (parsed.data.status) {
      const denied = await assertPermission(me, "users.suspend")
      if (denied) return denied
    }
  }
  if (parsed.data.role && !isSuperActor && !(me.role === ROLES.ADMIN && parsed.data.role === ROLES.USER)) {
    return forbidden("ADMIN can only demote users to USER.")
  }

  // Protect the last SUPER_ADMIN from demotion/suspension.
  if (isSuperTarget && (parsed.data.role || parsed.data.status)) {
    const superCount = await db.user.count({ where: { role: ROLES.SUPER_ADMIN, status: "ACTIVE" } })
    const staysSuperAdmin =
      parsed.data.role === ROLES.SUPER_ADMIN && parsed.data.status === "ACTIVE"
    if (superCount - (staysSuperAdmin ? 0 : 1) < 1) {
      return forbidden("This is the last active Super Admin — it cannot be demoted or suspended.")
    }
  }

  const data: Record<string, unknown> = {}
  if (parsed.data.role) data.role = parsed.data.role
  if (parsed.data.status) data.status = parsed.data.status
  if (parsed.data.plan) data.plan = parsed.data.plan
  if (parsed.data.emailVerified !== undefined) data.emailVerified = parsed.data.emailVerified ? new Date() : null
  if (parsed.data.name) data.name = parsed.data.name

  if (Object.keys(data).length === 0) return err("Nothing to update.", 400)

  if (parsed.data.role || parsed.data.status) {
    const p = parsed.data.role ? "users.roles.manage" : "users.suspend"
    const denied = await assertPermission(me, p)
    if (denied) return denied
  } else {
    const denied = await assertPermission(me, "users.edit")
    if (denied) return denied
  }

  const updated = await db.user.update({ where: { id }, data, select: { id: true, role: true, status: true, plan: true, emailVerified: true, name: true } })

  if (parsed.data.role && parsed.data.role !== target.role) {
    await recordAuditSafe({
      actorId: me.id,
      action: "ROLE_CHANGED",
      targetType: "user",
      targetId: id,
      detail: `Role changed ${target.role} → ${parsed.data.role}.`,
    })
  }
  if (parsed.data.status && parsed.data.status !== target.status) {
    await recordAuditSafe({
      actorId: me.id,
      action: "USER_STATUS_CHANGED",
      targetType: "user",
      targetId: id,
      detail: `Status changed ${target.status} → ${parsed.data.status}.`,
    })
  }

  return ok({ user: updated })
}

/** Admin — full profile view: entitlements, payments, activity, progress. */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const me = await getCurrentUser()
  if (!me) return unauthorized()
  const denied = await assertPermission(me, "users.view")
  if (denied) return denied

  const { id } = await ctx.params
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      role: true,
      status: true,
      plan: true,
      emailVerified: true,
      onboarded: true,
      experience: true,
      goal: true,
      interests: true,
      totalXP: true,
      points: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      createdAt: true,
      premiumTrials: true,
      premiumEntitlements: true,
      payments: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  })
  if (!user) return err("User not found.", 404)

  const [progressCount, achievements, recentActivity] = await Promise.all([
    db.tutorialProgress.count({ where: { userId: id } }),
    db.userAchievement.findMany({ where: { userId: id }, include: { achievement: true }, take: 50 }),
    db.activityLog.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 25 }),
  ])

  return ok({
    user,
    progressCount,
    achievements: achievements.map((a) => ({
      id: a.achievement.id,
      title: a.achievement.title,
      description: a.achievement.description,
      earnedAt: a.earnedAt,
    })),
    recentActivity,
  })
}
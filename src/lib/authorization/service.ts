import { forbidden } from "@/lib/api"
import { db } from "@/lib/db"
import type { NextResponse } from "next/server"

/**
 * AuthorizationService — centralized, permission-based authorization.
 *
 * Every privileged action in the application is checked against this
 * service. Components never hardcode `role === "ADMIN"` checks; they ask
 * `hasPermission(user, "users.suspend")` instead.
 *
 * Hierarchy: USER < ADMIN < SUPER_ADMIN.
 * SUPER_ADMIN receives every permission in the system.
 */

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const

export type AppRole = (typeof ROLES)[keyof typeof ROLES]

// ----------------------------------------------------------------
// Permission catalog (flat strings, grouped for documentation).
// New admin capabilities must be declared here before use.
// ----------------------------------------------------------------

const PERMISSION_GROUPS = {
  users: ["users.view", "users.edit", "users.suspend", "users.delete", "users.roles.manage"],
  content: ["content.view", "content.create", "content.edit", "content.publish", "content.archive", "content.import", "content.export"],
  courses: ["courses.manage", "learning_paths.manage", "modules.manage", "tutorials.manage"],
  certificates: ["certificates.view", "certificates.issue", "certificates.reissue", "certificates.revoke", "certificates.restore", "certificates.templates.manage"],
  payments: ["payments.view", "payments.manage", "entitlements.manage"],
  ai: ["ai.manage", "ai.settings.manage", "ai.analytics.view"],
  analytics: ["analytics.view", "analytics.export"],
  platform: ["settings.manage", "branding.manage", "notifications.manage", "feature_flags.manage"],
  administration: ["admins.manage", "roles.manage", "audit_logs.view"],
} as const

export const ALL_PERMISSIONS: readonly string[] = Object.values(PERMISSION_GROUPS).flat()

export type Permission = (typeof ALL_PERMISSIONS)[number]

// ----------------------------------------------------------------
// Role → permission mapping.
// USER has none. ADMIN keeps the classic admin capabilities. SUPER_ADMIN
// has everything, so future delegated admin roles can be layered on top.
// ----------------------------------------------------------------

const ROLE_PERMISSIONS: Record<string, ReadonlySet<string>> = {
  [ROLES.USER]: new Set(),
  [ROLES.ADMIN]: new Set([
    "users.view",
    "users.edit",
    "users.suspend",
    "content.view",
    "content.import",
    "content.export",
    "courses.manage",
    "modules.manage",
    "tutorials.manage",
    "certificates.view",
    "certificates.issue",
    "certificates.reissue",
    "certificates.revoke",
    "certificates.restore",
    "certificates.templates.manage",
    "payments.view",
    "entitlements.manage",
    "analytics.view",
  ]),
  [ROLES.SUPER_ADMIN]: new Set(ALL_PERMISSIONS),
}

export type Principal = { id?: string; role?: string | null } | null | undefined

/** True when the principal holds the given permission. */
export function hasPermission(user: Principal, permission: Permission | string): boolean {
  if (!user) return false
  const perms = ROLE_PERMISSIONS[user.role ?? ""]
  if (!perms) return false
  return perms.has(permission)
}

/** True when the principal holds ANY of the given permissions. */
export function hasAnyPermission(user: Principal, permissions: readonly string[]): boolean {
  if (!user) return false
  return permissions.some((p) => hasPermission(user, p))
}

/** Role check (exact role). */
export function hasRole(user: Principal, role: AppRole | string): boolean {
  return !!user && user.role === role
}

/** ADMIN or SUPER_ADMIN — any administrative role. */
export function isAdminRole(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
}

export function isSuperAdmin(user: Principal): boolean {
  return hasRole(user, ROLES.SUPER_ADMIN)
}

/**
 * Server-side gate: returns a 403 response when the principal lacks the
 * permission, otherwise null (caller proceeds). Also blocks non-ACTIVE
 * accounts (suspended/banned) from performing privileged actions —
 * status is checked live so suspensions take effect immediately.
 */
export async function assertPermission(
  user: Principal,
  permission: Permission | string
): Promise<NextResponse | null> {
  if (!user) return forbidden("You must be signed in.")
  if (!hasPermission(user, permission)) return forbidden("You do not have permission to do that.")
  if (user.id) {
    const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { status: true } })
    if (!dbUser || dbUser.status !== "ACTIVE") {
      return forbidden("Your account is not active.")
    }
  }
  return null
}

/** All permissions granted to a role (useful for admin UI metadata). */
export function getPermissionsForRole(role?: string | null): string[] {
  if (!role) return []
  return Array.from(ROLE_PERMISSIONS[role] ?? [])
}

export function getAllPermissionGroups(): Record<string, string[]> {
  return Object.fromEntries(Object.entries(PERMISSION_GROUPS).map(([k, v]) => [k, [...v]]))
}

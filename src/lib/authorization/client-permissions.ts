/**
 * Client-side permission mirror for UI visibility only.
 *
 * SECURITY NOTE: This file never authorizes anything. Every privileged
 * action is re-checked server-side via AuthorizationService
 * (src/lib/authorization/service.ts). This map exists so components can
 * decide whether to render admin UI affordances without importing the
 * server module (which would pull Prisma into the client bundle).
 */

const ROLE_PERMISSIONS_CLIENT: Record<string, ReadonlySet<string>> = {
  USER: new Set<string>(),
  ADMIN: new Set([
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
  SUPER_ADMIN: new Set([
    "users.view", "users.edit", "users.suspend", "users.delete", "users.roles.manage",
    "content.view", "content.create", "content.edit", "content.publish", "content.archive", "content.import", "content.export",
    "courses.manage", "learning_paths.manage", "modules.manage", "tutorials.manage",
    "certificates.view", "certificates.issue", "certificates.reissue", "certificates.revoke", "certificates.restore", "certificates.templates.manage",
    "payments.view", "payments.manage", "entitlements.manage",
    "ai.manage", "ai.settings.manage", "ai.analytics.view",
    "analytics.view", "analytics.export",
    "settings.manage", "branding.manage", "notifications.manage", "feature_flags.manage",
    "admins.manage", "roles.manage", "audit_logs.view",
  ]),
}

export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

export function can(role: string | null | undefined, permission: string): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS_CLIENT[role]?.has(permission) ?? false
}

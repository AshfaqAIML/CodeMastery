import { db } from "@/lib/db"

/**
 * Centralized admin audit trail.
 * Every significant administrative action should call `recordAudit`.
 * NEVER pass passwords, tokens or secrets in `detail` or `metadata`.
 */

export type AuditInput = {
  actorId?: string | null
  action: string
  targetType?: string | null
  targetId?: string | null
  result?: "SUCCESS" | "FAILED"
  detail?: string | null
  metadata?: Record<string, unknown> | null
  ip?: string | null
  userAgent?: string | null
}

export function recordAudit(input: AuditInput) {
  const { actorId, action, targetType, targetId, result, detail, metadata, ip, userAgent } = input
  return db.auditLog.create({
    data: {
      actorId: actorId ?? null,
      action,
      targetType: targetType ?? null,
      targetId: targetId ?? null,
      result: result ?? "SUCCESS",
      detail: detail ?? null,
      metadata: (metadata as any) ?? undefined,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    },
  })
}

/** Best-effort audit — never let audit failure break the main operation. */
export async function recordAuditSafe(input: AuditInput) {
  try {
    await recordAudit(input)
  } catch {
    // audit is best-effort by design
  }
}

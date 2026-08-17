import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { listSettings, upsertSetting, deleteSetting } from "@/lib/settings"
import { z } from "zod"

const schema = z.object({
  key: z.string().min(2).max(120).regex(/^[a-z0-9._-]+$/),
  value: z.string().max(5000),
  valueType: z.enum(["string", "number", "boolean", "json"]).default("string"),
  group: z.string().max(40).default("general"),
})

/**
 * Admin — platform settings (branding, premium, gamification, certificates,
 * AI toggles, notifications, feature flags).
 *
 * Security:
 * - Secrets (API keys, tokens) must live in environment variables and are
 *   never accepted through this endpoint: `isSecret` rows are read-only here.
 * - GET returns secret values masked (never full).
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "settings.manage")
  if (denied) return denied

  const group = req.nextUrl.searchParams.get("group") ?? undefined
  const settings = group ? await listSettings(group) : await listSettings()
  return ok({ settings })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "settings.manage")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const existing = await db.platformSetting.findUnique({ where: { key: parsed.data.key } })
  if (existing?.isSecret) {
    return err("Secret settings are managed through environment variables and cannot be overwritten here.", 403)
  }

  await upsertSetting({
    key: parsed.data.key,
    value: parsed.data.value,
    valueType: parsed.data.valueType,
    group: parsed.data.group,
    updatedBy: user.id,
  })

  await recordAuditSafe({
    actorId: user.id,
    action: "SETTINGS_UPDATED",
    targetType: "settings",
    targetId: parsed.data.key,
    detail: `Setting ${parsed.data.key} updated.`,
  })

  return ok({ key: parsed.data.key })
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "settings.manage")
  if (denied) return denied

  const keyParam = req.nextUrl.searchParams.get("key")
  if (!keyParam) return err("Missing key.", 400)

  const existing = await db.platformSetting.findUnique({ where: { key: keyParam } })
  if (existing?.isSecret) {
    return err("Secret settings cannot be deleted through the admin UI.", 403)
  }
  await deleteSetting(keyParam)

  await recordAuditSafe({
    actorId: user.id,
    action: "SETTINGS_UPDATED",
    targetType: "settings",
    targetId: keyParam,
    detail: `Setting ${keyParam} deleted.`,
  })

  return ok({ key: keyParam })
}
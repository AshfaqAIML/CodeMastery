import { NextRequest } from "next/server"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { getAI } from "@/lib/ai"
import { maskSecret } from "@/lib/settings"
import { config } from "@/lib/config"

/**
 * Admin — AI configuration overview + operational settings.
 *
 * Security: API keys are NEVER returned. The GET response only reports
 * whether a key is configured and shows a masked suffix. Provider/model
 * configuration lives in environment variables (authoritative); DB settings
 * here handle feature availability, tier gating and usage limits.
 */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "ai.analytics.view")
  if (denied) return denied

  const ai = getAI()
  const provider = config.ai.provider
  const keys: Record<string, { configured: boolean; masked: string }> = {
    openai: {
      configured: !!config.ai.openai.apiKey,
      masked: maskSecret(config.ai.openai.apiKey),
    },
    gemini: {
      configured: !!config.ai.gemini.apiKey,
      masked: maskSecret(config.ai.gemini.apiKey),
    },
    zai: {
      configured: !!config.ai.zai.apiKey,
      masked: maskSecret(config.ai.zai.apiKey),
    },
  }

  const { getSettingValue } = await import("@/lib/settings")
  const [featureEnabled, dailyLimit, tierGated] = await Promise.all([
    getSettingValue("ai.features.enabled", ai.enabled),
    getSettingValue("ai.dailyLimit", config.premium.aiDailyLimit),
    getSettingValue<"all" | "premium">("ai.tierAccess", "all"),
  ])

  const [aiQueries, aiErrors] = await Promise.all([
    import("@/lib/db").then(({ db }) =>
      db.activityLog.count({ where: { type: "ai_query" } })
    ),
    import("@/lib/db").then(({ db }) =>
      db.activityLog.count({ where: { type: "ai_error" } })
    ),
  ])

  return ok({
    ai: {
      enabled: ai.enabled,
      activeProvider: ai.provider?.name ?? null,
      configuredProvider: provider,
      keys,
      models: {
        openai: config.ai.openai.model,
        gemini: config.ai.gemini.model,
      },
      settings: {
        featureEnabled,
        dailyLimit,
        tierAccess: tierGated,
      },
      usage: {
        aiQueries,
        aiErrors,
      },
    },
  })
}

/** Admin — update operational AI settings (feature availability, limits). */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "ai.settings.manage")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return ok({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { featureEnabled, dailyLimit, tierAccess } = body as {
    featureEnabled?: boolean
    dailyLimit?: number
    tierAccess?: "all" | "premium"
  }

  const { upsertSetting } = await import("@/lib/settings")
  if (typeof featureEnabled === "boolean") {
    await upsertSetting({ key: "ai.features.enabled", value: String(featureEnabled), valueType: "boolean", group: "ai", updatedBy: user.id })
  }
  if (typeof dailyLimit === "number" && dailyLimit >= 1 && dailyLimit <= 10000) {
    await upsertSetting({ key: "ai.dailyLimit", value: String(dailyLimit), valueType: "number", group: "ai", updatedBy: user.id })
  }
  if (tierAccess === "all" || tierAccess === "premium") {
    await upsertSetting({ key: "ai.tierAccess", value: tierAccess, valueType: "string", group: "ai", updatedBy: user.id })
  }

  await recordAuditSafe({
    actorId: user.id,
    action: "SETTINGS_UPDATED",
    targetType: "settings",
    targetId: "ai",
    detail: "AI operational settings updated.",
  })

  return ok({ applied: true })
}
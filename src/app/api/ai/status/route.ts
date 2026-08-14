import { ok } from "@/lib/api"
import { getAI } from "@/lib/ai"

/**
 * Lightweight AI availability check.
 * Returns whether AI features are enabled and which provider is active.
 * Does NOT make any AI calls — just checks configuration.
 */
export async function GET() {
  const ai = getAI()
  return ok({
    enabled: ai.enabled && !!ai.provider,
    provider: ai.provider?.name ?? null,
  })
}

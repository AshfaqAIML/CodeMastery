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
    features: ai.enabled ? [
      "tutorial-context",     // AI knows the current tutorial
      "user-progress",        // AI knows user's learning state
      "conversation",         // Multi-turn conversation
      "quick-actions",        // Explain, simplify, quiz, etc.
      "content-retrieval",    // RAG from tutorial database
      "personalized",         // Adapts to user level
    ] : [],
  })
}

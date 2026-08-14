import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { getAI } from "@/lib/ai"
import { config } from "@/lib/config"
import { z } from "zod"

/**
 * AI Study Buddy endpoint.
 *
 * This feature is OPTIONAL — it only works when AI_ENABLED=true and a provider
 * is configured. The core learning platform works fully without it.
 *
 * Uses the AIService abstraction (src/lib/ai/) which supports:
 *   - "zai"    (z-ai-web-dev-sdk, lazy-imported)
 *   - "openai" (OpenAI-compatible, fetch-based)
 *   - "none"   (disabled)
 *
 * The provider is selected via AI_PROVIDER env var. No hard dependency on any
 * specific AI vendor — the platform remains portable.
 */

const schema = z.object({
  tutorialId: z.string().min(1),
  question: z.string().min(3).max(500),
})

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  // Check if AI is enabled
  if (!config.ai.enabled) {
    return err(
      "AI features are not enabled on this deployment. Set AI_ENABLED=true and configure a provider.",
      503
    )
  }

  const ai = getAI()
  if (!ai.provider) {
    return err("AI provider is not configured.", 503)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const { tutorialId, question } = parsed.data

  // Fetch tutorial context
  const tutorial = await db.tutorial.findUnique({
    where: { id: tutorialId },
    select: {
      title: true,
      summary: true,
      content: true,
      subject: { select: { name: true } },
    },
  })
  if (!tutorial) return err("Tutorial not found.", 404)

  // Truncate content to keep prompt reasonable
  const truncatedContent = tutorial.content.slice(0, 4000)

  const systemPrompt = `You are a helpful Computer Science tutor integrated into CodeMastery, a learning platform.
A student is reading the tutorial "${tutorial.title}" in the subject "${tutorial.subject.name}".

Tutorial summary: ${tutorial.summary}

Tutorial content (excerpt):
${truncatedContent}

Your job:
- Answer the student's question clearly and concisely.
- Use code examples when helpful.
- Relate your answer to the tutorial content.
- If the question is off-topic, gently steer back to the subject.
- Keep answers under 300 words unless complexity demands more.
- Be encouraging and educational.`

  try {
    const answer = await ai.chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      { temperature: 0.5, maxTokens: 600 }
    )
    return ok({ answer, provider: ai.provider.name })
  } catch (e: any) {
    return err(`AI request failed: ${e.message ?? "unknown error"}`, 502)
  }
}

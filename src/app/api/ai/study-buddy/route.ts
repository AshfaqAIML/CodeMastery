import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { getAI } from "@/lib/ai"
import { config } from "@/lib/config"
import { buildTutorialContext, buildSystemPrompt, QUICK_ACTIONS, type QuickAction } from "@/lib/ai/context"
import { z } from "zod"

const schema = z.object({
  tutorialId: z.string().min(1),
  question: z.string().min(3).max(1000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).max(10).optional(),
  action: z.enum(["explain", "simplify", "example", "analogy", "quiz", "summarize", "next", "prerequisites", "code"]).optional(),
})

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

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

  const { tutorialId, question, history, action } = parsed.data

  // Verify tutorial exists and is published
  const tutorial = await db.tutorial.findUnique({
    where: { id: tutorialId },
    select: { id: true, title: true },
  })
  if (!tutorial) return err("Tutorial not found.", 404)

  // Build website-aware context
  const context = await buildTutorialContext(user.id, tutorialId)
  const systemPrompt = buildSystemPrompt(context)

  // Build the user message — either a quick action or the user's question
  const userMessage = action
    ? `${QUICK_ACTIONS[action as QuickAction]}\n\nUser context: ${question}`
    : question

  // Build conversation messages
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ]

  // Add conversation history if provided
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content })
    }
  }

  // Add the current question
  messages.push({ role: "user", content: userMessage })

  try {
    const answer = await ai.chat(messages, {
      temperature: 0.6,
      maxTokens: 800,
    })

    // Log AI usage for observability (no PII stored)
    await db.activityLog.create({
      data: {
        userId: user.id,
        type: "ai_query",
        refId: tutorialId,
        xpDelta: 0,
        pointsDelta: 0,
      },
    })

    return ok({
      answer,
      provider: ai.provider.name,
      contextUsed: {
        tutorial: !!context.tutorial,
        userProgress: !!context.userProgress,
        relatedTutorials: (context.relatedTutorials?.length ?? 0),
        nextTutorials: (context.nextTutorials?.length ?? 0),
        userNotes: (context.userNotes?.length ?? 0),
      },
    })
  } catch (e: any) {
    console.error("[AI Study Buddy] Error:", e.message)
    return err(
      "The AI tutor encountered an error. Please try again.",
      502
    )
  }
}

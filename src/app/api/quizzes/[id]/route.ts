import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const quiz = await db.quiz.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      tutorial: { select: { id: true, slug: true, title: true, subject: { select: { slug: true, name: true } } } },
    },
  })
  if (!quiz) return notFound("Quiz not found.")
  // Hide answer index in the response sent to the client
  return ok({
    ...quiz,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: JSON.parse(q.options),
      order: q.order,
    })),
  })
}

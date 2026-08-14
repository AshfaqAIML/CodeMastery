import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ subjectSlug: string; tutorialSlug: string }> }
) {
  const { subjectSlug, tutorialSlug } = await ctx.params
  const user = await getCurrentUser()

  const tutorial = await db.tutorial.findFirst({
    where: {
      slug: tutorialSlug,
      published: true,
      subject: { slug: subjectSlug, published: true },
    },
    include: {
      subject: {
        select: { id: true, slug: true, name: true, color: true, icon: true },
      },
      module: { select: { id: true, title: true, slug: true, order: true } },
      quizzes: {
        select: { id: true, title: true, description: true, passingScore: true, xpReward: true },
      },
    },
  })
  if (!tutorial) return notFound("Tutorial not found.")

  // Sibling tutorials (prev/next) within subject, ordered
  const siblings = await db.tutorial.findMany({
    where: { published: true, subjectId: tutorial.subjectId },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true },
  })
  const idx = siblings.findIndex((t) => t.id === tutorial.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null

  // User-specific state
  let progress = null
  let bookmarked = false
  let notes: { id: string; content: string; anchor: string | null; updatedAt: Date }[] = []
  if (user) {
    progress = await db.tutorialProgress.findUnique({
      where: { userId_tutorialId: { userId: user.id, tutorialId: tutorial.id } },
      select: {
        percentRead: true,
        scrollY: true,
        completed: true,
        completedAt: true,
        timeSpentSec: true,
        lastReadAt: true,
      },
    })
    const bm = await db.bookmark.findUnique({
      where: { userId_tutorialId: { userId: user.id, tutorialId: tutorial.id } },
    })
    bookmarked = !!bm
    notes = await db.note.findMany({
      where: { userId: user.id, tutorialId: tutorial.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, content: true, anchor: true, updatedAt: true },
    })
  }

  return ok({
    tutorial: {
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      summary: tutorial.summary,
      content: tutorial.content,
      difficulty: tutorial.difficulty,
      estimatedMinutes: tutorial.estimatedMinutes,
      tags: tutorial.tags,
      order: tutorial.order,
      coverImage: tutorial.coverImage,
      subject: tutorial.subject,
      module: tutorial.module,
      quizzes: tutorial.quizzes,
    },
    prev,
    next,
    progress,
    bookmarked,
    notes,
  })
}

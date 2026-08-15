import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

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
        include: {
          domain: { select: { id: true, slug: true, name: true, icon: true, color: true } },
        },
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
  let progress: {
    percentRead: number
    scrollY: number
    completed: boolean
    completedAt: Date | null
    timeSpentSec: number
    lastReadAt: Date
  } | null = null
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

  // Reshape subject to a clean nested structure with domain
  const { domain, ...subjectCore } = tutorial.subject as any

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
      subject: { ...subjectCore, domain: domain ?? null },
      module: tutorial.module,
      quizzes: tutorial.quizzes,
      // Pedagogical metadata (curriculum-aware)
      learningObjectives: parseJSON<string[]>(
        (tutorial as any).learningObjectives || null, []
      ),
      prerequisites: parseJSON<
        { label: string; subjectSlug?: string; tutorialSlug?: string }[]
      >((tutorial as any).prerequisites || null, []),
      whereItFits: (tutorial as any).whereItFits ?? "",
      keyTakeaways: parseJSON<string[]>((tutorial as any).keyTakeaways || null, []),
      selfAssessment: parseJSON<string[]>((tutorial as any).selfAssessment || null, []),
    },
    prev,
    next,
    progress,
    bookmarked,
    notes,
  })
}

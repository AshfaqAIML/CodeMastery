import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { combineLevels, getContentAccess } from "@/lib/entitlements/service"

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

  // Access model gate: PUBLIC / FREE / PREMIUM (subject + tutorial levels
  // combine to the most restrictive). Content is NEVER sent when the user
  // may only preview it — enforcement is server-side, not CSS hiding.
  const effectiveLevel = combineLevels(
    (tutorial as any).subject?.accessLevel,
    (tutorial as any).accessLevel
  )
  const contentAccess = await getContentAccess(user?.id ?? null, effectiveLevel)

  const accessInfo = {
    level: effectiveLevel,
    canRead: contentAccess.canRead,
    previewOnly: contentAccess.previewOnly,
    reason: contentAccess.reason ?? null,
    guest: !user,
    effectiveAccess: contentAccess.summary.effectiveAccess,
    trialDaysRemaining: contentAccess.summary.trialDaysRemaining,
  }

  // Preview-only: metadata without the body, so the UI can show a lock
  // screen with the right upsell. (200 keeps the client flow simple;
  // the body is simply never transmitted.)
  if (!contentAccess.canRead) {
    return ok({
      tutorial: null,
      locked: accessInfo,
      preview: {
        title: tutorial.title,
        summary: tutorial.summary,
        difficulty: tutorial.difficulty,
        estimatedMinutes: tutorial.estimatedMinutes,
        tags: tutorial.tags,
        subject: {
          slug: (tutorial as any).subject.slug,
          name: (tutorial as any).subject.name,
          icon: (tutorial as any).subject.icon,
          color: (tutorial as any).subject.color,
        },
      },
      prev: null,
      next: null,
      progress: null,
      bookmarked: false,
      notes: [],
    })
  }

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
  let progress: { percentRead: number; scrollY: number; completed: boolean; completedAt: Date | null; timeSpentSec: number; lastReadAt: Date } | null = null
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
    access: accessInfo,
  })
}

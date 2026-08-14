import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"

/**
 * Returns related tutorials for a given tutorial.
 * Strategy:
 *  1. Other tutorials in the same subject (same difficulty first, then others).
 *  2. If not enough, tutorials with matching tags in other subjects.
 *  3. Excludes the current tutorial.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ subjectSlug: string; tutorialSlug: string }> }
) {
  const { subjectSlug, tutorialSlug } = await ctx.params

  const tutorial = await db.tutorial.findFirst({
    where: {
      slug: tutorialSlug,
      published: true,
      subject: { slug: subjectSlug, published: true },
    },
    select: { id: true, subjectId: true, difficulty: true, tags: true },
  })
  if (!tutorial) return notFound("Tutorial not found.")

  // Same-subject tutorials (excluding current), difficulty-matched first
  const sameSubject = await db.tutorial.findMany({
    where: {
      published: true,
      subjectId: tutorial.subjectId,
      id: { not: tutorial.id },
    },
    orderBy: [{ difficulty: "asc" }, { order: "asc" }],
    take: 4,
    select: {
      id: true, slug: true, title: true, summary: true,
      difficulty: true, estimatedMinutes: true,
      subject: { select: { slug: true, name: true, color: true, icon: true } },
    },
  })

  let related = sameSubject

  // If not enough, find by tags
  if (related.length < 4 && tutorial.tags) {
    const tags = tutorial.tags.split(",").filter(Boolean).map((t) => t.trim())
    if (tags.length > 0) {
      const existingIds = new Set([tutorial.id, ...related.map((r) => r.id)])
      const byTag = await db.tutorial.findMany({
        where: {
          published: true,
          id: { notIn: [...existingIds] },
          OR: tags.map((t) => ({ tags: { contains: t } })),
        },
        take: 4 - related.length,
        select: {
          id: true, slug: true, title: true, summary: true,
          difficulty: true, estimatedMinutes: true,
          subject: { select: { slug: true, name: true, color: true, icon: true } },
        },
      })
      related = [...related, ...byTag]
    }
  }

  return ok(related.slice(0, 4))
}

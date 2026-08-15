import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const withCounts = searchParams.get("withCounts") === "true"
  const withProgress = searchParams.get("withProgress") === "true"

  const user = await getCurrentUser()

  const subjects = await db.subject.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      domain: true,
      ...(withCounts ? { _count: { select: { tutorials: { where: { published: true } } } } } : {}),
      ...(withProgress && user
        ? {
            tutorials: {
              where: { published: true },
              select: {
                id: true,
                _count: { select: { progress: { where: { userId: user.id, completed: true } } } },
              },
            },
          }
        : {}),
    },
  })

  return ok(
    subjects.map((s) => {
      const totalTutorials = withCounts
        ? (s as any)._count?.tutorials ?? 0
        : withProgress && user
        ? (s as any).tutorials?.length ?? 0
        : 0
      const completedTutorials =
        withProgress && user
          ? (s as any).tutorials?.reduce(
              (acc: number, t: any) => acc + (t._count?.progress ?? 0),
              0
            ) ?? 0
          : 0
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        color: s.color,
        category: s.category,
        order: s.order,
        domain: s.domain
          ? {
              slug: s.domain.slug,
              name: s.domain.name,
              icon: s.domain.icon,
              color: s.domain.color,
            }
          : null,
        ...(withCounts || (withProgress && user) ? { tutorialCount: totalTutorials } : {}),
        ...(withProgress && user
          ? {
              completedCount: completedTutorials,
              progressPct: totalTutorials > 0 ? Math.round((completedTutorials / totalTutorials) * 100) : 0,
            }
          : {}),
      }
    })
  )
}

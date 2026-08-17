import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const user = await getCurrentUser()

  const subject = await db.subject.findUnique({
    where: { slug, published: true },
    include: {
      domain: { select: { id: true, slug: true, name: true, icon: true, color: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          tutorials: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              difficulty: true,
              estimatedMinutes: true,
              tags: true,
              order: true,
              accessLevel: true,
              ...(user
                ? {
                    progress: {
                      where: { userId: user.id },
                      select: { percentRead: true, completed: true, lastReadAt: true },
                    },
                  }
                : {}),
            },
          },
        },
      },
      tutorials: {
        where: { published: true, moduleId: null },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          difficulty: true,
          estimatedMinutes: true,
          tags: true,
          order: true,
          accessLevel: true,
          ...(user
            ? {
                progress: {
                  where: { userId: user.id },
                  select: { percentRead: true, completed: true, lastReadAt: true },
                },
              }
            : {}),
        },
      },
      ...(user
        ? {
            _count: {
              select: {
                tutorials: { where: { published: true } },
              },
            },
          }
        : false),
    },
  })
  if (!subject) return notFound("Subject not found.")

  // Compute overall progress if user is signed in
  let overallProgress: { total: number; completed: number; percent: number } | null = null
  if (user) {
    const allTutorials = [
      ...(subject as any).modules?.flatMap((m: any) => m.tutorials) ?? [],
      ...(subject as any).tutorials ?? [],
    ]
    const total = allTutorials.length
    const completed = allTutorials.filter((t: any) => t.progress?.[0]?.completed).length
    overallProgress = {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  return ok({ ...subject, overallProgress })
}

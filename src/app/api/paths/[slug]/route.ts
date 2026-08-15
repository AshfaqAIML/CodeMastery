import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const user = await getCurrentUser()

  const path = await db.learningPath.findUnique({
    where: { slug, published: true },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: {
          tutorial: {
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              difficulty: true,
              estimatedMinutes: true,
              subject: { select: { slug: true, name: true, color: true, icon: true } },
              ...(user
                ? {
                    progress: {
                      where: { userId: user.id },
                      select: { completed: true, percentRead: true },
                    },
                  }
                : {}),
            },
          },
          subject: { select: { id: true, slug: true, name: true, color: true, icon: true } },
        },
      },
      ...(user
        ? {
            progress: {
              where: { userId: user.id },
              select: { enrolledAt: true, completedSteps: true },
            },
          }
        : false),
    },
  })
  if (!path) return notFound("Learning path not found.")

  // Compute progress
  let enrollment: { enrolledAt: any; completedSteps: number; totalSteps: number; percent: number } | null = null
  if (user && (path as any).progress?.[0]) {
    const p = (path as any).progress[0]
    const totalSteps = path.steps.length
    const completedSteps = path.steps.filter(
      (s) => s.tutorial?.progress?.[0]?.completed
    ).length
    enrollment = {
      enrolledAt: p.enrolledAt,
      completedSteps,
      totalSteps,
      percent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    }
  }

  return ok({ ...path, enrollment })
}

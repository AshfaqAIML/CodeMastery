import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
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
            },
          },
          subject: { select: { id: true, slug: true, name: true, color: true, icon: true } },
        },
      },
    },
  })
  if (!path) return notFound("Learning path not found.")
  return ok(path)
}

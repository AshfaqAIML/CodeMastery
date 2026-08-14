import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, notFound } from "@/lib/api"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const subject = await db.subject.findUnique({
    where: { slug, published: true },
    include: {
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
        },
      },
    },
  })
  if (!subject) return notFound("Subject not found.")
  return ok(subject)
}

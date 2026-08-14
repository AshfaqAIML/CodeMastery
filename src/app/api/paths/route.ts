import { db } from "@/lib/db"
import { ok } from "@/lib/api"

export async function GET() {
  const paths = await db.learningPath.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { steps: true } },
      steps: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          subtitle: true,
          order: true,
          tutorial: { select: { id: true, slug: true, subject: { select: { slug: true, name: true } } } },
          subject: { select: { id: true, slug: true, name: true, color: true, icon: true } },
        },
      },
    },
  })
  return ok(paths)
}

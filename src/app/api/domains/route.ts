import { db } from "@/lib/db"
import { ok } from "@/lib/api"

export async function GET() {
  const domains = await db.domain.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { subjects: { where: { published: true } } },
      },
    },
  })

  return ok(
    domains.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      description: d.description,
      icon: d.icon,
      color: d.color,
      order: d.order,
      subjectCount: d._count.subjects,
    }))
  )
}

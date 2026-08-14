import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok } from "@/lib/api"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const withCounts = searchParams.get("withCounts") === "true"

  const subjects = await db.subject.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: withCounts
      ? {
          _count: { select: { tutorials: { where: { published: true } } } },
        }
      : false,
  })

  return ok(
    subjects.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      icon: s.icon,
      color: s.color,
      category: s.category,
      order: s.order,
      ...(withCounts ? { tutorialCount: (s as any)._count?.tutorials ?? 0 } : {}),
    }))
  )
}

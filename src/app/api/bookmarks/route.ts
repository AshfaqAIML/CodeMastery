import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
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
    },
  })
  return ok(bookmarks)
}

const schema = z.object({ tutorialId: z.string().min(1) })

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const existing = await db.bookmark.findUnique({
    where: { userId_tutorialId: { userId: user.id, tutorialId: parsed.data.tutorialId } },
  })
  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } })
    return ok({ bookmarked: false })
  }
  await db.bookmark.create({
    data: { userId: user.id, tutorialId: parsed.data.tutorialId },
  })
  await db.activityLog.create({
    data: { userId: user.id, type: "bookmark_added", refId: parsed.data.tutorialId },
  })
  return ok({ bookmarked: true })
}

import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const schema = z.object({
  tutorialId: z.string().min(1),
  value: z.union([z.literal(1), z.literal(-1), z.literal(0)]), // 1=up, -1=down, 0=remove
})

/**
 * Rate a tutorial (thumbs up/down) or remove rating.
 * One rating per user per tutorial (upsert on unique constraint).
 */
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
  const { tutorialId, value } = parsed.data

  const tutorial = await db.tutorial.findUnique({ where: { id: tutorialId }, select: { id: true } })
  if (!tutorial) return err("Tutorial not found.", 404)

  if (value === 0) {
    await db.tutorialRating.deleteMany({ where: { tutorialId, userId: user.id } })
    return ok({ value: 0 })
  }

  await db.tutorialRating.upsert({
    where: { tutorialId_userId: { tutorialId, userId: user.id } },
    create: { tutorialId, userId: user.id, value },
    update: { value },
  })

  return ok({ value })
}

/**
 * Get aggregate ratings for a tutorial (and the current user's rating).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tutorialId = searchParams.get("tutorialId")
  if (!tutorialId) return err("Missing tutorialId.", 400)

  const user = await getCurrentUser()

  const [upvotes, downvotes, userRating] = await Promise.all([
    db.tutorialRating.count({ where: { tutorialId, value: 1 } }),
    db.tutorialRating.count({ where: { tutorialId, value: -1 } }),
    user
      ? db.tutorialRating.findUnique({
          where: { tutorialId_userId: { tutorialId, userId: user.id } },
          select: { value: true },
        })
      : Promise.resolve(null),
  ])

  return ok({
    upvotes,
    downvotes,
    userRating: userRating?.value ?? 0,
  })
}

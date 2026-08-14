import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

const schema = z.object({
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  goal: z.enum(["career", "interview", "academics", "curiosity"]).optional(),
  bio: z.string().max(280).optional(),
  name: z.string().min(2).max(60).optional(),
})

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

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      ...(parsed.data.experience ? { experience: parsed.data.experience } : {}),
      ...(parsed.data.goal ? { goal: parsed.data.goal } : {}),
      ...(parsed.data.bio !== undefined ? { bio: parsed.data.bio } : {}),
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      onboarded: true,
    },
    select: { id: true, name: true, experience: true, goal: true, bio: true, onboarded: true },
  })
  return ok(updated)
}

export async function PATCH(req: NextRequest) {
  return POST(req)
}

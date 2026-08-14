import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { searchParams } = new URL(req.url)
  const tutorialId = searchParams.get("tutorialId")
  const notes = await db.note.findMany({
    where: { userId: user.id, ...(tutorialId ? { tutorialId } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      tutorial: {
        select: {
          id: true,
          slug: true,
          title: true,
          subject: { select: { slug: true, name: true, color: true } },
        },
      },
    },
  })
  return ok(notes)
}

const createSchema = z.object({
  tutorialId: z.string().min(1),
  content: z.string().min(1).max(5000),
  anchor: z.string().max(200).nullable().optional(),
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
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const note = await db.note.create({
    data: {
      userId: user.id,
      tutorialId: parsed.data.tutorialId,
      content: parsed.data.content,
      anchor: parsed.data.anchor ?? null,
    },
  })
  await db.activityLog.create({
    data: { userId: user.id, type: "note_created", refId: note.id },
  })
  // small XP for note-taking (anti-farm: capped by daily logic if needed)
  return ok(note)
}

const updateSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1).max(5000),
})

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return err("Invalid input.", 422, parsed.error.flatten())

  const note = await db.note.update({
    where: { id: parsed.data.id, userId: user.id },
    data: { content: parsed.data.content },
  })
  return ok(note)
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return err("Missing id.", 400)
  await db.note.delete({ where: { id, userId: user.id } })
  return ok({ deleted: true })
}

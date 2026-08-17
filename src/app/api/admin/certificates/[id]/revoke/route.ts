import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { z } from "zod"
import { revokeCertificate } from "@/lib/certificates/admin"

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({ reason: z.string().min(1).max(500) })

/** Admin: revoke a certificate (requires a reason). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  if (user.role !== "ADMIN") return forbidden()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)

  const { id } = await ctx.params
  const result = await revokeCertificate({
    certificateId: id,
    actorId: user.id,
    reason: parsed.data.reason,
  })
  if (!result.ok) return err(result.error, result.status)

  return ok({ certificateId: result.cert.id, status: result.cert.status })
}
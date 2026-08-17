import { NextRequest } from "next/server"
import { ok, err, unauthorized, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { restoreCertificate } from "@/lib/certificates/admin"

type Ctx = { params: Promise<{ id: string }> }

/** Admin: restore a revoked certificate back to VALID. */
export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  if (user.role !== "ADMIN") return forbidden()

  const { id } = await ctx.params
  const result = await restoreCertificate({ certificateId: id, actorId: user.id })
  if (!result.ok) return err(result.error, result.status)

  return ok({ certificateId: result.cert.id, status: result.cert.status })
}
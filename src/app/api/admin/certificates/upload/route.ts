import { NextRequest } from "next/server"
import { ok, err, unauthorized } from "@/lib/api"
import { getStorage } from "@/lib/storage"
import { db } from "@/lib/db"
import { recordAuditSafe } from "@/lib/audit"
import { updateCertificateSettings } from "@/lib/certificates/admin"
import { getToken } from "next-auth/jwt"
import { assertPermission } from "@/lib/authorization/service"

const MAX_ASSET_BYTES = 8 * 1024 * 1024

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.id) return unauthorized()

  const user = { id: token.id as string, role: (token.role as string) ?? "USER" }
  const denied = await assertPermission(user, "certificates.templates.manage")
  if (denied) return denied

  try {
    const formData = await req.formData()
    const kind = formData.get("kind") as string
    const file = formData.get("file") as File | null

    if (!kind || !["seal", "signature", "digitalSeal"].includes(kind)) {
      return err("Invalid kind. Must be seal, signature, or digitalSeal.", 400)
    }
    if (!file) return err("No file provided.", 400)

    const buf = Buffer.from(await file.arrayBuffer())
    if (buf.length === 0 || buf.length > MAX_ASSET_BYTES) {
      return err("File is empty or larger than 8MB.", 400)
    }

    const storage = getStorage()
    const stored = await storage.upload("certificates", file.name, buf, file.type || "image/png")

    const fieldMap: Record<string, string> = {
      seal: "sealKey",
      signature: "signatureKey",
      digitalSeal: "digitalSealKey",
    }
    const updateField = fieldMap[kind]
    await updateCertificateSettings({ [updateField]: stored.key })

    await db.certificateAuditLog.create({
      data: {
        actorId: user.id,
        action: "ASSET_UPDATED",
        detail: `${kind} replaced via file upload.`,
      },
    })
    await recordAuditSafe({
      actorId: user.id,
      action: "SETTINGS_UPDATED",
      targetType: "certificate",
      detail: `Certificate ${kind} replaced.`,
    })

    return ok({ key: stored.key, url: stored.url })
  } catch (e) {
    return err(e instanceof Error ? e.message : "Upload failed.", 400)
  }
}

import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"
import { getCertificateSettings } from "@/lib/certificates/settings"
import { updateCertificateSettings } from "@/lib/certificates/admin"
import { getStorage } from "@/lib/storage"
import { z } from "zod"

const MAX_ASSET_BYTES = 8 * 1024 * 1024 // 8MB (screenshots/PNGs commonly exceed 2MB)

const assetSchema = z.object({
  name: z.string().min(1).max(120),
  mime: z.string().min(3).max(100),
  base64: z.string().min(16),
})

// Text fields are optional so an asset-only upload (seal/signature/digital
// seal) works without sending the issuer block — and empty values are
// tolerated (the settings getter falls back to env/defaults).
const settingsSchema = z.object({
  signatoryName: z.string().max(200).optional(),
  signatoryTitle: z.string().max(200).optional(),
  issuerName: z.string().max(200).optional(),
  issuerWebsite: z.string().max(300).optional(),
  seal: assetSchema.optional(),
  signature: assetSchema.optional(),
  digitalSeal: assetSchema.optional(),
  clearSeal: z.boolean().optional(),
  clearSignature: z.boolean().optional(),
  clearDigitalSeal: z.boolean().optional(),
})

/** Admin: read or update certificate settings + official assets. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.templates.manage")
  if (denied) return denied
  return ok({ settings: await getCertificateSettings() })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  const denied = await assertPermission(user, "certificates.templates.manage")
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)
  const { seal, signature, digitalSeal, clearSeal, clearSignature, clearDigitalSeal, ...fields } = parsed.data

  const storage = getStorage()
  const current = await db.certificateSettings.findUnique({
    where: { id: "global" },
  })

  let sealKey: string | null = current?.sealKey ?? null
  let signatureKey: string | null = current?.signatureKey ?? null
  let digitalSealKey: string | null = current?.digitalSealKey ?? null

  const storeAsset = async (asset: { name: string; mime: string; base64: string }) => {
    const buf = Buffer.from(asset.base64, "base64")
    if (buf.length === 0 || buf.length > MAX_ASSET_BYTES) {
      throw new Error("Asset is empty or larger than 8MB.")
    }
    const stored = await storage.upload("certificates", asset.name, buf, asset.mime)
    return stored.key
  }

  try {
    if (seal) sealKey = await storeAsset(seal)
    if (signature) signatureKey = await storeAsset(signature)
    if (digitalSeal) digitalSealKey = await storeAsset(digitalSeal)
    if (clearSeal) sealKey = null
    if (clearSignature) signatureKey = null
    if (clearDigitalSeal) digitalSealKey = null
  } catch (e) {
    return err(e instanceof Error ? e.message : "Asset upload failed.", 400)
  }

  const assetsChanged =
    seal !== undefined || signature !== undefined || digitalSeal !== undefined || clearSeal || clearSignature || clearDigitalSeal

  await updateCertificateSettings({ ...fields, sealKey, signatureKey, digitalSealKey })

  if (assetsChanged) {
    await db.certificateAuditLog.create({
      data: {
        actorId: user.id,
        action: "ASSET_UPDATED",
        detail: `Seal: ${seal ? "replaced" : clearSeal ? "cleared" : "unchanged"} · Signature: ${signature ? "replaced" : clearSignature ? "cleared" : "unchanged"} · Digital seal: ${digitalSeal ? "replaced" : clearDigitalSeal ? "cleared" : "unchanged"}`,
      },
    })
    await recordAuditSafe({
      actorId: user.id,
      action: "SETTINGS_UPDATED",
      targetType: "certificate",
      detail: "Certificate official assets changed.",
    })
  }

  await recordAuditSafe({
    actorId: user.id,
    action: "SETTINGS_UPDATED",
    targetType: "settings",
    detail: "Certificate settings updated.",
  })

  return ok({ settings: await getCertificateSettings() })
}
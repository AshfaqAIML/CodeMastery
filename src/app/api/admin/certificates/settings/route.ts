import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, unauthorized, forbidden, zodErr } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { getCertificateSettings } from "@/lib/certificates/settings"
import { updateCertificateSettings } from "@/lib/certificates/admin"
import { getStorage } from "@/lib/storage"
import { z } from "zod"

const MAX_ASSET_BYTES = 2 * 1024 * 1024 // 2MB

const assetSchema = z.object({
  name: z.string().min(1).max(120),
  mime: z.string().min(3).max(100),
  base64: z.string().min(16),
})

const settingsSchema = z.object({
  signatoryName: z.string().min(1).max(200),
  signatoryTitle: z.string().min(1).max(200),
  issuerName: z.string().min(1).max(200),
  issuerWebsite: z.string().url().max(300),
  seal: assetSchema.optional(),
  signature: assetSchema.optional(),
  clearSeal: z.boolean().optional(),
  clearSignature: z.boolean().optional(),
})

/** Admin: read or update certificate settings + official assets. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  if (user.role !== "ADMIN") return forbidden()
  return ok({ settings: await getCertificateSettings() })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()
  if (user.role !== "ADMIN") return forbidden()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) return zodErr(parsed.error)
  const { seal, signature, clearSeal, clearSignature, ...fields } = parsed.data

  const storage = getStorage()
  const current = await db.certificateSettings.findUnique({
    where: { id: "global" },
  })

  let sealKey: string | null = current?.sealKey ?? null
  let signatureKey: string | null = current?.signatureKey ?? null

  const storeAsset = async (asset: { name: string; mime: string; base64: string }) => {
    const buf = Buffer.from(asset.base64, "base64")
    if (buf.length === 0 || buf.length > MAX_ASSET_BYTES) {
      throw new Error("Asset is empty or larger than 2MB.")
    }
    const stored = await storage.upload("certificates", asset.name, buf, asset.mime)
    return stored.key
  }

  try {
    if (seal) sealKey = await storeAsset(seal)
    if (signature) signatureKey = await storeAsset(signature)
    if (clearSeal) sealKey = null
    if (clearSignature) signatureKey = null
  } catch (e) {
    return err(e instanceof Error ? e.message : "Asset upload failed.", 400)
  }

  const assetsChanged = seal !== undefined || signature !== undefined || clearSeal || clearSignature

  await updateCertificateSettings({ ...fields, sealKey, signatureKey })

  if (assetsChanged) {
    await db.certificateAuditLog.create({
      data: {
        actorId: user.id,
        action: "ASSET_UPDATED",
        detail: `Seal: ${seal ? "replaced" : clearSeal ? "cleared" : "unchanged"} · Signature: ${signature ? "replaced" : clearSignature ? "cleared" : "unchanged"}`,
      },
    })
  }

  return ok({ settings: await getCertificateSettings() })
}
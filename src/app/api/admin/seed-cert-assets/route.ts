import { NextRequest } from "next/server"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export const dynamic = "force-dynamic"

const BUCKET = process.env.STORAGE_BUCKET!
const ENDPOINT = process.env.STORAGE_ENDPOINT!
const REGION = process.env.STORAGE_REGION || "auto"
const ACCESS_KEY = process.env.STORAGE_ACCESS_KEY!
const SECRET_KEY = process.env.STORAGE_SECRET_KEY!
const PUBLIC_URL = process.env.STORAGE_PUBLIC_URL || ""

function getS3() {
  return new S3Client({
    endpoint: ENDPOINT || undefined,
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
    forcePathStyle: process.env.STORAGE_S3_FORCE_PATH_STYLE === "true",
  })
}

function getDb() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seal, signature, digitalSeal } = body as {
      seal?: { data: string; name: string }
      signature?: { data: string; name: string }
      digitalSeal?: { data: string; name: string }
    }

    const s3 = getS3()
    const db = getDb()
    const results: Record<string, string> = {}
    const ts = Date.now()

    const uploads = [
      { kind: "seal", file: seal, field: "sealKey" },
      { kind: "signature", file: signature, field: "signatureKey" },
      { kind: "digitalSeal", file: digitalSeal, field: "digitalSealKey" },
    ] as const

    for (const u of uploads) {
      if (!u.file) continue
      const buf = Buffer.from(u.file.data, "base64")
      const key = `certificates/${ts}-${u.file.name}`
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buf,
        ContentType: "image/png",
      }))
      results[u.kind] = key
    }

    const updateData: Record<string, string> = {}
    if (results.seal) updateData.sealKey = results.seal
    if (results.signature) updateData.signatureKey = results.signature
    if (results.digitalSeal) updateData.digitalSealKey = results.digitalSeal

    if (Object.keys(updateData).length > 0) {
      await db.certificateSettings.upsert({
        where: { id: "default" },
        create: { id: "default", ...updateData },
        update: updateData,
      })
    }

    await db.$disconnect()

    return Response.json({
      ok: true,
      data: {
        seal: results.seal ? `${PUBLIC_URL}/${results.seal}` : null,
        signature: results.signature ? `${PUBLIC_URL}/${results.signature}` : null,
        digitalSeal: results.digitalSeal ? `${PUBLIC_URL}/${results.digitalSeal}` : null,
      },
    })
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

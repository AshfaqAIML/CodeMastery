import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { err } from "@/lib/api"
import { CERT_NUMBER_RE, makeVerifyUrl } from "@/lib/certificates/types"
import { generateQrPng } from "@/lib/certificates/qr"

type Ctx = { params: Promise<{ number: string }> }

/**
 * Public QR image for a certificate. The QR encodes the stable
 * /verify/[number] URL — verification always resolves through the
 * public page, never through a storage URL.
 */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { number } = await ctx.params
  const clean = number.trim().toUpperCase()
  if (!CERT_NUMBER_RE.test(clean)) return err("Invalid certificate number.", 422)

  const cert = await db.certificate.findUnique({
    where: { number: clean },
    select: { id: true, status: true },
  })
  if (!cert) return err("Certificate not found.", 404)

  const png = await generateQrPng(makeVerifyUrl(clean))
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(png.length),
      "Cache-Control": "public, max-age=86400",
    },
  })
}
import { NextResponse } from "next/server"
import { loadAsset } from "@/lib/certificates/pdf"
import { getCertificateSettings } from "@/lib/certificates/settings"
import {
  generateCertificate,
  type CertificateData,
  type GenerateOptions,
} from "@codemastery/certificate-generator"

export const dynamic = "force-dynamic"

export async function GET() {
  const settings = await getCertificateSettings()
  const seal = await loadAsset("seal", settings.sealKey)
  const signature = await loadAsset("signature", settings.signatureKey)
  const digitalSeal = await loadAsset("digital-seal", settings.digitalSealKey)

  const info: Record<string, unknown> = {
    seal: seal ? { length: seal.length, first8: Array.from(seal.slice(0, 8)) } : null,
    signature: signature ? { length: signature.length, first8: Array.from(signature.slice(0, 8)) } : null,
    digitalSeal: digitalSeal ? { length: digitalSeal.length, first8: Array.from(digitalSeal.slice(0, 8)) } : null,
  }

  try {
    const data: CertificateData = {
      recipientName: "Test User",
      courseName: "Test Course",
      issuerName: "CodeMastery",
      issuedAt: new Date().toISOString(),
      certificateId: "TEST-001",
    }
    const options: GenerateOptions = {
      template: "classic",
      accentColor: "#b45309",
      sealImage: seal,
      signatureImage: signature,
      digitalSealImage: digitalSeal,
    }
    const output = await generateCertificate(data, options)
    info.pdfSize = output.bytes.length
    info.success = true
  } catch (e: any) {
    info.pdfError = e.message
    info.pdfStack = e.stack?.split("\n").slice(0, 5)
  }

  return NextResponse.json(info)
}

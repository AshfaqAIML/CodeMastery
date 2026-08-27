import { promises as fs } from "fs"
import path from "path"
import type { Certificate } from "@prisma/client"
import {
  generateCertificate,
  type CertificateData,
  type GenerateOptions,
  type GenerateOutput,
} from "@codemastery/certificate-generator"
import { config } from "@/lib/config"
import { getStorage } from "@/lib/storage"
import { getCertificateSettings } from "./settings"

/** Accent used on rendered certificates (gold, matching the official seal). */
export const CERT_ACCENT = "#b45309"

type PdfInput = {
  cert: Certificate
  userName: string
  subjectName: string
}

/**
 * Render a certificate as a real A4-landscape PDF document using the
 * @codemastery/certificate-generator module (pdf-lib based): classic
 * template with double border, official seal + signature, certificate
 * number, and a scannable QR pointing at the public verification URL.
 */
export async function renderCertificatePdf(input: PdfInput): Promise<Buffer> {
  const { cert, userName, subjectName } = input
  let metadata: Record<string, unknown> = {}
  try {
    metadata = cert.metadata ? JSON.parse(cert.metadata) : {}
  } catch {
    metadata = {}
  }
  const settings = await getCertificateSettings()
  const seal = await loadAsset("seal", settings.sealKey)
  const signature = await loadAsset("signature", settings.signatureKey)
  // Digital seal — try admin storage key first, then bundled fallback
  const digitalSeal = await loadAsset("digital-seal", settings.digitalSealKey)

  const data: CertificateData = {
    recipientName: userName,
    courseName: subjectName,
    issuerName: settings.issuerName,
    issuerTagline: settings.issuerWebsite,
    issuedAt: cert.issuedAt.toISOString(),
    certificateId: cert.number,
    instructorName: settings.signatoryName,
    instructorTitle: settings.signatoryTitle,
    grade:
      typeof metadata.completedCount === "number" && typeof metadata.totalCount === "number"
        ? `Completed ${metadata.completedCount} of ${metadata.totalCount} tutorials`
        : undefined,
    completionNote:
      typeof metadata.timeSpentMin === "number"
        ? `Total learning time: ${metadata.timeSpentMin} minutes`
        : undefined,
  }

  const options: GenerateOptions = {
    template: "classic",
    accentColor: CERT_ACCENT,
    sealImage: seal,
    signatureImage: signature,
    digitalSealImage: digitalSeal,
    verificationUrl: config.appUrl,
  }

  const output: GenerateOutput = await generateCertificate(data, options)
  return Buffer.from(output.bytes)
}

/**
 * Load a certificate asset: first try the admin-managed storage key, then
 * fall back to the bundled public asset. Returns bytes or undefined.
 */
export async function loadAsset(
  kind: "seal" | "signature" | "logo" | "digital-seal",
  storageKey: string | null
): Promise<Uint8Array | undefined> {
  const fallbackName =
    kind === "seal" ? "seal.png" :
    kind === "signature" ? "signature.png" :
    kind === "digital-seal" ? "digital-seal.png" :
    "logo.svg"

  // 1. Try admin-managed storage key
  if (storageKey) {
    try {
      const fromStorage = await getStorage().provider.read(storageKey)
      if (fromStorage) return new Uint8Array(fromStorage)
    } catch {
      // fall through
    }
  }

  // 2. Try reading from the filesystem
  try {
    const fallback = path.join(process.cwd(), "public", "certificates", fallbackName)
    const data = await fs.readFile(fallback)
    if (data.length > 0) return data
  } catch {
    // fall through
  }

  // 3. Try relative path (different cwd on some serverless runtimes)
  try {
    const data = await fs.readFile(path.join("public", "certificates", fallbackName))
    if (data.length > 0) return data
  } catch {
    // fall through
  }

  return undefined
}
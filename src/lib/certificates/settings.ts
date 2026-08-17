import { db } from "@/lib/db"
import { config } from "@/lib/config"

export type CertSettings = {
  signatoryName: string
  signatoryTitle: string
  issuerName: string
  issuerWebsite: string
  /** Storage keys of admin-uploaded assets (null = bundled public assets). */
  sealKey: string | null
  signatureKey: string | null
}

/**
 * Effective certificate settings.
 * Precedence: DB row (admin-managed) > env vars > defaults.
 * The values are snapshotted into each certificate's metadata at issuance,
 * so later settings changes never mutate already-issued certificates.
 */
export async function getCertificateSettings(): Promise<CertSettings> {
  const row = await db.certificateSettings.findUnique({
    where: { id: "global" },
  })
  return {
    signatoryName:
      row?.signatoryName && row.signatoryName.trim()
        ? row.signatoryName
        : config.certificates.signatoryName,
    signatoryTitle:
      row?.signatoryTitle && row.signatoryTitle.trim()
        ? row.signatoryTitle
        : config.certificates.signatoryTitle,
    issuerName:
      row?.issuerName && row.issuerName.trim()
        ? row.issuerName
        : config.appName,
    issuerWebsite:
      row?.issuerWebsite && row.issuerWebsite.trim()
        ? row.issuerWebsite
        : config.appUrl,
    sealKey: row?.sealKey ?? null,
    signatureKey: row?.signatureKey ?? null,
  }
}
import QRCode from "qrcode"

/**
 * QR code generation for certificates.
 *
 * Error-correction level "M" (~15%) is a deliberate choice: certificates are
 * typically printed at a few inches and scanned from a phone or paper, where
 * M's balance between density (smaller, cleaner code) and resilience to
 * smudges/glare performs best. Level "H" adds size without meaningful benefit
 * for this use case, and "L" is too fragile for printed media.
 *
 * Deterministic: same URL always produces the same QR, so it is generated on
 * demand — no files to store or expire.
 */
export async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    width: 512,
    margin: 4, // quiet zone
    errorCorrectionLevel: "M",
    color: {
      dark: "#111827", // near-black, strong contrast on paper
      light: "#FFFFFF",
    },
  })
}

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 4,
    errorCorrectionLevel: "M",
    color: {
      dark: "#111827",
      light: "#FFFFFF",
    },
  })
}
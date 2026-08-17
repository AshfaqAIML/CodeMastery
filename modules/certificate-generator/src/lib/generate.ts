/**
 * PDF certificate generation using pdf-lib.
 *
 * Generates a beautiful, print-ready PDF certificate with:
 *   - A decorative border (double-line, accent-colored)
 *   - The issuer name + tagline (header)
 *   - A large "Certificate of Completion" title
 *   - The recipient's name (large, centered)
 *   - The course name + optional subject
 *   - Issue date + optional expiry
 *   - A unique certificate ID
 *   - A verification QR code (links to the host's /verify page)
 *   - An instructor signature line
 *   - Optional logo image
 *
 * Uses pdf-lib's standard fonts (Helvetica + Times Roman) — no font
 * files required, keeping the module zero-dependency for assets.
 *
 * Works in both Node.js (server-side API route) and the browser
 * (client-side download).
 */

import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib"
import QRCode from "qrcode"

import type { CertificateData, GenerateOptions, GenerateOutput } from "../types"
import {
  generateCertificateId,
  computeVerificationHash,
  buildVerificationUrl,
} from "./verify"

// ----------------------------------------------------------------
// COLOR HELPERS
// ----------------------------------------------------------------

/** Convert a hex color (#10b981) to an pdf-lib RGB (0-1 range). */
function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace(/^#/, "")
  const r = parseInt(cleaned.slice(0, 2), 16) / 255
  const g = parseInt(cleaned.slice(2, 4), 16) / 255
  const b = parseInt(cleaned.slice(4, 6), 16) / 255
  return rgb(r, g, b)
}

const COLORS = {
  emerald: hexToRgb("#10b981"),
  gold: hexToRgb("#d4a017"),
  darkText: hexToRgb("#1f2937"),
  mutedText: hexToRgb("#6b7280"),
  lightGray: hexToRgb("#e5e7eb"),
  white: rgb(1, 1, 1),
}

// ----------------------------------------------------------------
// PAGE DIMENSIONS
// ----------------------------------------------------------------

function getPageSize(
  pageSize: "A4" | "Letter",
  orientation: "landscape" | "portrait"
): { width: number; height: number } {
  const sizes = {
    A4: { width: 841.89, height: 595.28 }, // landscape A4 in points
    Letter: { width: 792, height: 612 },
  }
  const s = sizes[pageSize]
  return orientation === "portrait"
    ? { width: s.height, height: s.width }
    : s
}

// ----------------------------------------------------------------
// MAIN GENERATION FUNCTION
// ----------------------------------------------------------------

/**
 * Generate a certificate PDF.
 *
 * @param input  - the certificate data (recipient, course, issuer, etc.)
 * @param opts   - rendering options (template, colors, logo, verification URL)
 * @returns      - the PDF bytes + metadata, ready to stream to the client
 */
export async function generateCertificate(
  input: CertificateData,
  opts: GenerateOptions = {}
): Promise<GenerateOutput> {
  const {
    template = "classic",
    pageSize = "A4",
    orientation = "landscape",
    accentColor = "#10b981",
    logoImage,
    signatureImage,
    sealImage,
    inkpadSealImage,
    verificationUrl,
  } = opts

  // --- Resolve / generate identity fields ---
  const issuedAt = input.issuedAt ?? new Date().toISOString()
  const certificateId = input.certificateId ?? generateCertificateId()
  const verificationHash =
    input.verificationHash ??
    computeVerificationHash({
      certificateId,
      recipientName: input.recipientName,
      courseName: input.courseName,
      issuerName: input.issuerName,
      issuedAt,
    })

  // --- Create the PDF document ---
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Certificate — ${input.recipientName} — ${input.courseName}`)
  pdfDoc.setAuthor(input.issuerName)
  pdfDoc.setSubject("Certificate of Completion")
  pdfDoc.setKeywords(["certificate", "completion", input.courseName])
  pdfDoc.setCreator("CodeMastery Certificate Generator")
  pdfDoc.setProducer("pdf-lib + CodeMastery")
  pdfDoc.setCreationDate(new Date())

  // --- Load fonts (standard — no external files) ---
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)

  // --- Add the page ---
  const { width, height } = getPageSize(pageSize, orientation)
  const page = pdfDoc.addPage([width, height])

  // --- Embed optional logo ---
  let logoEmbed: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null = null
  if (logoImage) {
    try {
      const bytes = typeof logoImage === "string"
        ? base64ToBytes(logoImage)
        : logoImage
      const isPng = typeof logoImage === "string"
        ? logoImage.includes("image/png") || logoImage.startsWith("iVBOR")
        : true // assume PNG for raw bytes
      const img = isPng
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes)
      logoEmbed = {
        width: img.width,
        height: img.height,
        draw: (x, y, scale) => page.drawImage(img, { x, y, width: img.width * scale, height: img.height * scale }),
      }
    } catch (e) {
      console.warn("[certificate-generator] Failed to embed logo:", e)
    }
  }

  // --- Embed optional seal image ---
  // If no sealImage is provided, a generated embossed gold seal is drawn
  // at render time (see drawSeal helper) so every certificate looks official.
  let sealEmbed: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null = null
  if (sealImage) {
    try {
      const bytes = typeof sealImage === "string"
        ? base64ToBytes(sealImage)
        : sealImage
      const isPng = typeof sealImage === "string"
        ? sealImage.includes("image/png") || sealImage.startsWith("iVBOR")
        : true
      const img = isPng
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes)
      sealEmbed = {
        width: img.width,
        height: img.height,
        draw: (x, y, scale) => page.drawImage(img, { x, y, width: img.width * scale, height: img.height * scale }),
      }
    } catch (e) {
      console.warn("[certificate-generator] Failed to embed seal image:", e)
    }
  }

  // --- Embed optional signature image (handwritten signature) ---
  // Placed above the signature line. Should be a PNG with transparent background.
  let signatureEmbed: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null = null
  if (signatureImage) {
    try {
      const bytes = typeof signatureImage === "string"
        ? base64ToBytes(signatureImage)
        : signatureImage
      const isPng = typeof signatureImage === "string"
        ? signatureImage.includes("image/png") || signatureImage.startsWith("iVBOR")
        : true
      const img = isPng
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes)
      signatureEmbed = {
        width: img.width,
        height: img.height,
        draw: (x, y, scale) => page.drawImage(img, { x, y, width: img.width * scale, height: img.height * scale }),
      }
    } catch (e) {
      console.warn("[certificate-generator] Failed to embed signature image:", e)
    }
  }

  // --- Embed optional inkpad seal image (the raw wax/stamp texture) ---
  // Placed BEHIND the digital seal for a realistic "pressed into wax" effect.
  // Drawn with slight opacity so the digital seal overlays it.
  let inkpadSealEmbed: { width: number; height: number; draw: (x: number, y: number, scale: number, opacity?: number) => void } | null = null
  if (inkpadSealImage) {
    try {
      const bytes = typeof inkpadSealImage === "string"
        ? base64ToBytes(inkpadSealImage)
        : inkpadSealImage
      const isPng = typeof inkpadSealImage === "string"
        ? inkpadSealImage.includes("image/png") || inkpadSealImage.startsWith("iVBOR")
        : true
      const img = isPng
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes)
      inkpadSealEmbed = {
        width: img.width,
        height: img.height,
        draw: (x, y, scale, opacity = 0.85) => page.drawImage(img, { x, y, width: img.width * scale, height: img.height * scale, opacity }),
      }
    } catch (e) {
      console.warn("[certificate-generator] Failed to embed inkpad seal image:", e)
    }
  }

  // --- Generate QR code (verification link) ---
  let qrEmbed: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null = null
  if (verificationUrl) {
    try {
      const url = buildVerificationUrl(verificationUrl, certificateId, verificationHash)
      const qrPngBytes = await QRCode.toBuffer(url, {
        type: "png",
        margin: 1,
        width: 200,
        color: { dark: "#1f2937", light: "#ffffff" },
      })
      const qrImg = await pdfDoc.embedPng(qrPngBytes)
      qrEmbed = {
        width: qrImg.width,
        height: qrImg.height,
        draw: (x, y, scale) => page.drawImage(qrImg, { x, y, width: qrImg.width * scale, height: qrImg.height * scale }),
      }
    } catch (e) {
      console.warn("[certificate-generator] Failed to generate QR code:", e)
    }
  }

  // --- Render the chosen template ---
  const accent = hexToRgb(accentColor)
  const renderCtx: RenderContext = {
    page,
    width,
    height,
    fonts: { regular: fontRegular, bold: fontBold, italic: fontSerif },
    accent,
    data: {
      ...input,
      issuedAt,
      certificateId,
      verificationHash,
    },
    logo: logoEmbed,
    signature: signatureEmbed,
    seal: sealEmbed,
    inkpadSeal: inkpadSealEmbed,
    qr: qrEmbed,
  }

  if (template === "modern") {
    renderModern(renderCtx)
  } else if (template === "minimal") {
    renderMinimal(renderCtx)
  } else {
    renderClassic(renderCtx)
  }

  // --- Serialize to bytes ---
  const bytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })

  const safeRecipient = input.recipientName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const safeCourse = input.courseName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const filename = `certificate-${safeRecipient}-${safeCourse}.pdf`.toLowerCase()

  return {
    bytes,
    data: { ...input, issuedAt, certificateId, verificationHash },
    certificateId,
    verificationHash,
    contentType: "application/pdf",
    filename,
  }
}

// ----------------------------------------------------------------
// RENDER CONTEXT
// ----------------------------------------------------------------

interface RenderContext {
  page: PDFPage
  width: number
  height: number
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont }
  accent: RGB
  data: Required<Pick<CertificateData,
    "recipientName" | "courseName" | "issuerName" | "issuedAt" | "certificateId" | "verificationHash"
  >> & CertificateData
  logo: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null
  signature: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null
  seal: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null
  inkpadSeal: { width: number; height: number; draw: (x: number, y: number, scale: number, opacity?: number) => void } | null
  qr: { width: number; height: number; draw: (x: number, y: number, scale: number) => void } | null
}

// ----------------------------------------------------------------
// SEAL RENDERING
// ----------------------------------------------------------------

/**
 * Draw a seal at the given position. If both a digital seal image AND an
 * inkpad seal image are provided, the inkpad is drawn behind (slightly
 * larger, at reduced opacity) for a realistic "pressed into wax" effect,
 * and the digital seal is drawn on top (crisp, full opacity).
 *
 * If only the digital seal is provided, it's drawn alone.
 * If only the inkpad seal is provided, it's drawn alone at full opacity.
 * If neither is provided, a generated embossed gold seal is drawn.
 *
 * @param ctx     - the render context
 * @param centerX - x center of the seal
 * @param centerY - y center of the seal
 * @param size    - diameter of the seal (in PDF points)
 */
function drawSeal(
  ctx: RenderContext,
  centerX: number,
  centerY: number,
  size: number
): void {
  const { page, fonts, data, seal, inkpadSeal } = ctx
  const { bold, regular } = fonts
  const radius = size / 2

  // --- Layer 1: inkpad seal (BEHIND, slightly larger, semi-transparent) ---
  // Creates the "pressed into wax" textured background.
  if (inkpadSeal) {
    const inkpadSize = size * 1.15  // 15% larger than the digital seal
    const inkpadScale = Math.min(inkpadSize / inkpadSeal.width, inkpadSize / inkpadSeal.height)
    const drawW = inkpadSeal.width * inkpadScale
    const drawH = inkpadSeal.height * inkpadScale
    inkpadSeal.draw(
      centerX - drawW / 2,
      centerY - drawH / 2,
      inkpadScale,
      0.78  // slightly transparent so the certificate background shows through
    )
  }

  // --- Layer 2: digital seal (FRONT, crisp, full opacity) ---
  if (seal) {
    const scale = Math.min(size / seal.width, size / seal.height)
    const drawW = seal.width * scale
    const drawH = seal.height * scale
    seal.draw(centerX - drawW / 2, centerY - drawH / 2, scale)
    return  // digital seal drawn — don't also draw the generated fallback
  }

  // If we drew an inkpad seal but no digital seal, return here (the inkpad
  // alone is enough — don't draw the generated gold seal on top of it).
  if (inkpadSeal) return

  // --- Fallback: generate an embossed gold seal (no images provided) ---
  // Outer ring (thick gold)
  page.drawCircle({
    x: centerX, y: centerY,
    color: undefined,
    borderColor: COLORS.gold,
    borderWidth: 2.5,
    size: radius,
  })
  // Inner ring (thin gold)
  page.drawCircle({
    x: centerX, y: centerY,
    color: undefined,
    borderColor: COLORS.gold,
    borderWidth: 0.8,
    size: radius - 5,
  })
  // Subtle inner fill (very light gold tint)
  page.drawCircle({
    x: centerX, y: centerY,
    color: rgb(0.96, 0.92, 0.82),
    borderColor: undefined,
    size: radius - 5,
    opacity: 0.35,
  })

  // Issuer initials (center, large)
  const initials = getInitials(data.issuerName)
  const initialsSize = radius * 0.7
  page.drawText(initials, {
    x: centerX - bold.widthOfTextAtSize(initials, initialsSize) / 2,
    y: centerY - initialsSize * 0.35,
    size: initialsSize,
    font: bold,
    color: COLORS.gold,
  })

  // "CERTIFIED" text (top arc, small caps)
  const certText = "CERTIFIED"
  const certSize = Math.max(6, radius * 0.16)
  page.drawText(certText, {
    x: centerX - regular.widthOfTextAtSize(certText, certSize) / 2,
    y: centerY + radius * 0.5,
    size: certSize,
    font: regular,
    color: COLORS.gold,
  })

  // Star at the bottom (decorative)
  drawStar(page, centerX, centerY - radius * 0.55, radius * 0.1, COLORS.gold)

  // Year (below the star, small)
  const yearText = String(new Date(data.issuedAt).getFullYear())
  const yearSize = Math.max(5, radius * 0.13)
  page.drawText(yearText, {
    x: centerX - bold.widthOfTextAtSize(yearText, yearSize) / 2,
    y: centerY - radius * 0.75,
    size: yearSize,
    font: bold,
    color: COLORS.gold,
  })
}

/** Extract initials from an issuer name (e.g. "CodeMastery" → "CM"). */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "•"
  if (words.length === 1) {
    // Single word → take first 2 chars
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/** Draw a 5-pointed star at the given center. */
function drawStar(
  page: PDFPage,
  cx: number, cy: number, radius: number, color: RGB
): void {
  // A 5-pointed star = 10 points alternating outer/inner radius
  const points: { x: number; y: number }[] = []
  const innerRadius = radius * 0.4
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const r = i % 2 === 0 ? radius : innerRadius
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r })
  }
  // Draw the star as a filled polygon using line segments + close
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length]
    page.drawLine({
      start: points[i], end: next,
      color, thickness: 1,
    })
  }
}

// ----------------------------------------------------------------
// TEMPLATE: CLASSIC
// ----------------------------------------------------------------

function renderClassic(ctx: RenderContext): void {
  const { page, width, height, fonts, accent, data, logo, signature, qr } = ctx
  const { bold, regular, italic } = fonts
  const cx = width / 2

  // Background: white (default)
  // Outer border (accent)
  page.drawRectangle({
    x: 28, y: 28, width: width - 56, height: height - 56,
    borderColor: accent, borderWidth: 3,
  })
  // Inner border (thin, muted)
  page.drawRectangle({
    x: 38, y: 38, width: width - 76, height: height - 76,
    borderColor: COLORS.lightGray, borderWidth: 1,
  })

  // Logo (top-left)
  let headerY = height - 70
  if (logo) {
    const scale = Math.min(1, 40 / logo.height)
    logo.draw(60, headerY - 5, scale)
  }

  // Issuer name + tagline (top center, or right if logo present)
  const issuerX = logo ? width / 2 + 60 : cx
  page.drawText(data.issuerName, {
    x: issuerX - bold.widthOfTextAtSize(data.issuerName, 16) / 2,
    y: headerY + 5,
    size: 16, font: bold, color: COLORS.darkText,
  })
  if (data.issuerTagline) {
    page.drawText(data.issuerTagline, {
      x: issuerX - regular.widthOfTextAtSize(data.issuerTagline, 9) / 2,
      y: headerY - 14,
      size: 9, font: regular, color: COLORS.mutedText,
    })
  }

  // Title
  const titleY = height - 170
  page.drawText("Certificate of Completion", {
    x: cx - bold.widthOfTextAtSize("Certificate of Completion", 36) / 2,
    y: titleY,
    size: 36, font: bold, color: COLORS.darkText,
  })
  // Accent underline
  page.drawRectangle({
    x: cx - 80, y: titleY - 12, width: 160, height: 3,
    color: accent,
  })

  // "This is to certify that"
  page.drawText("This is to certify that", {
    x: cx - italic.widthOfTextAtSize("This is to certify that", 14) / 2,
    y: titleY - 50,
    size: 14, font: italic, color: COLORS.mutedText,
  })

  // Recipient name (large)
  const recipientY = titleY - 95
  page.drawText(data.recipientName, {
    x: cx - bold.widthOfTextAtSize(data.recipientName, 32) / 2,
    y: recipientY,
    size: 32, font: bold, color: accent,
  })
  // Underline under name
  const nameWidth = bold.widthOfTextAtSize(data.recipientName, 32)
  page.drawRectangle({
    x: cx - nameWidth / 2 - 10, y: recipientY - 8,
    width: nameWidth + 20, height: 1,
    color: COLORS.lightGray,
  })

  // "has successfully completed"
  page.drawText("has successfully completed", {
    x: cx - italic.widthOfTextAtSize("has successfully completed", 14) / 2,
    y: recipientY - 30,
    size: 14, font: italic, color: COLORS.mutedText,
  })

  // Course name
  const courseY = recipientY - 60
  page.drawText(data.courseName, {
    x: cx - bold.widthOfTextAtSize(data.courseName, 22) / 2,
    y: courseY,
    size: 22, font: bold, color: COLORS.darkText,
  })

  // Subject + grade + completion note
  let metaY = courseY - 28
  if (data.subjectName) {
    page.drawText(data.subjectName, {
      x: cx - regular.widthOfTextAtSize(data.subjectName, 12) / 2,
      y: metaY, size: 12, font: regular, color: COLORS.mutedText,
    })
    metaY -= 18
  }
  if (data.grade) {
    const gradeText = `Grade: ${data.grade}`
    page.drawText(gradeText, {
      x: cx - bold.widthOfTextAtSize(gradeText, 12) / 2,
      y: metaY, size: 12, font: bold, color: accent,
    })
    metaY -= 18
  }
  if (data.completionNote) {
    page.drawText(data.completionNote, {
      x: cx - regular.widthOfTextAtSize(data.completionNote, 11) / 2,
      y: metaY, size: 11, font: regular, color: COLORS.mutedText,
    })
  }

  // Issue date (bottom left)
  const dateStr = formatDate(data.issuedAt)
  page.drawText("Issue Date", {
    x: 70, y: 90, size: 9, font: regular, color: COLORS.mutedText,
  })
  page.drawText(dateStr, {
    x: 70, y: 76, size: 12, font: bold, color: COLORS.darkText,
  })

  // Signature (bottom center-left)
  const sigX = width / 2 - 100
  const sigLineY = 80
  // If a signature image is provided, draw it ABOVE the signature line.
  // Otherwise just draw the line + printed name.
  if (signature) {
    const sigMaxWidth = 160
    const sigMaxHeight = 45
    const sigScale = Math.min(sigMaxWidth / signature.width, sigMaxHeight / signature.height)
    const sigDrawW = signature.width * sigScale
    const sigDrawH = signature.height * sigScale
    // Centered above the line
    signature.draw(sigX + 80 - sigDrawW / 2, sigLineY + 4, sigScale)
  }
  page.drawLine({
    start: { x: sigX, y: sigLineY }, end: { x: sigX + 160, y: sigLineY },
    color: COLORS.darkText, thickness: 1,
  })
  page.drawText(data.instructorName ?? data.issuerName, {
    x: sigX + 80 - bold.widthOfTextAtSize(data.instructorName ?? data.issuerName, 11) / 2,
    y: sigLineY + 5, size: 11, font: bold, color: COLORS.darkText,
  })
  page.drawText(data.instructorTitle ?? "Authorized Signatory", {
    x: sigX + 80 - regular.widthOfTextAtSize(data.instructorTitle ?? "Authorized Signatory", 9) / 2,
    y: sigLineY - 12, size: 9, font: regular, color: COLORS.mutedText,
  })

  // Official seal (embossed gold or custom image) — between signature and QR.
  // Positioned to slightly overlap the signature line for a professional
  // "raised seal" effect. Drawn BEFORE the QR/ID so it sits behind them
  // if they overlap. Size scales with the certificate width.
  const sealSize = Math.min(85, width * 0.1)
  const sealCenterX = width - 70 - 70 - sealSize / 2 - 20  // left of the QR
  const sealCenterY = 95
  drawSeal(ctx, sealCenterX, sealCenterY, sealSize)

  // Certificate ID (bottom right, above QR)
  const qrSize = 70
  const qrX = width - 70 - qrSize
  const qrY = 75
  if (qr) {
    qr.draw(qrX, qrY, qrSize / qr.width)
    page.drawText("Scan to verify", {
      x: qrX + qrSize / 2 - regular.widthOfTextAtSize("Scan to verify", 8) / 2,
      y: qrY - 12, size: 8, font: regular, color: COLORS.mutedText,
    })
  }
  page.drawText(`Certificate ID`, {
    x: qrX - 5, y: qrY + qrSize + 10, size: 8, font: regular, color: COLORS.mutedText,
  })
  page.drawText(data.certificateId, {
    x: qrX - 5, y: qrY + qrSize - 2, size: 9, font: bold, color: COLORS.darkText,
  })

  // Expiry (if applicable)
  if (data.expiresAt) {
    page.drawText(`Valid until: ${formatDate(data.expiresAt)}`, {
      x: qrX, y: qrY - 26, size: 8, font: regular, color: COLORS.mutedText,
    })
  } else {
    page.drawText("Lifetime validity", {
      x: qrX, y: qrY - 26, size: 8, font: regular, color: accent,
    })
  }
}

// ----------------------------------------------------------------
// TEMPLATE: MODERN
// ----------------------------------------------------------------

function renderModern(ctx: RenderContext): void {
  const { page, width, height, fonts, accent, data, logo, signature, qr } = ctx
  const { bold, regular, italic } = fonts
  const cx = width / 2

  // Left accent bar (full height)
  page.drawRectangle({
    x: 0, y: 0, width: 12, height: height, color: accent,
  })
  // Top accent bar
  page.drawRectangle({
    x: 12, y: height - 6, width: width - 12, height: 6, color: accent,
  })

  // Logo (top center)
  let y = height - 70
  if (logo) {
    const scale = Math.min(1, 45 / logo.height)
    logo.draw(cx - (logo.width * scale) / 2, y - 20, scale)
    y -= 55
  }

  // Issuer
  page.drawText(data.issuerName.toUpperCase(), {
    x: cx - bold.widthOfTextAtSize(data.issuerName.toUpperCase(), 11) / 2,
    y, size: 11, font: bold, color: COLORS.mutedText,
  })
  y -= 50

  // Title
  page.drawText("CERTIFICATE", {
    x: cx - bold.widthOfTextAtSize("CERTIFICATE", 34) / 2,
    y, size: 34, font: bold, color: COLORS.darkText,
  })
  y -= 26
  page.drawText("of Completion", {
    x: cx - italic.widthOfTextAtSize("of Completion", 16) / 2,
    y, size: 16, font: italic, color: COLORS.mutedText,
  })
  y -= 55

  // "Presented to"
  page.drawText("PRESENTED TO", {
    x: cx - bold.widthOfTextAtSize("PRESENTED TO", 9) / 2,
    y, size: 9, font: bold, color: accent,
  })
  y -= 28

  // Recipient
  page.drawText(data.recipientName, {
    x: cx - bold.widthOfTextAtSize(data.recipientName, 28) / 2,
    y, size: 28, font: bold, color: COLORS.darkText,
  })
  y -= 40

  // "for successfully completing"
  page.drawText("for successfully completing", {
    x: cx - italic.widthOfTextAtSize("for successfully completing", 13) / 2,
    y, size: 13, font: italic, color: COLORS.mutedText,
  })
  y -= 30

  // Course
  page.drawText(data.courseName, {
    x: cx - bold.widthOfTextAtSize(data.courseName, 20) / 2,
    y, size: 20, font: bold, color: accent,
  })

  // Footer row: date | signature | ID + QR
  const footerY = 75
  page.drawText(formatDate(data.issuedAt), {
    x: 40, y: footerY, size: 11, font: bold, color: COLORS.darkText,
  })
  page.drawText("DATE", {
    x: 40, y: footerY + 14, size: 8, font: regular, color: COLORS.mutedText,
  })

  const sigX = cx - 80
  const sigLineY = footerY + 4
  // If a signature image is provided, draw it ABOVE the signature line.
  if (signature) {
    const sigMaxWidth = 160
    const sigMaxHeight = 38
    const sigScale = Math.min(sigMaxWidth / signature.width, sigMaxHeight / signature.height)
    const sigDrawW = signature.width * sigScale
    const sigDrawH = signature.height * sigScale
    signature.draw(sigX + 80 - sigDrawW / 2, sigLineY + 2, sigScale)
  }
  page.drawLine({
    start: { x: sigX, y: sigLineY }, end: { x: sigX + 160, y: sigLineY },
    color: COLORS.darkText, thickness: 1,
  })
  page.drawText(data.instructorName ?? data.issuerName, {
    x: sigX + 80 - bold.widthOfTextAtSize(data.instructorName ?? data.issuerName, 10) / 2,
    y: sigLineY + 5, size: 10, font: bold, color: COLORS.darkText,
  })
  page.drawText(data.instructorTitle ?? "Authorized Signatory", {
    x: sigX + 80 - regular.widthOfTextAtSize(data.instructorTitle ?? "Authorized Signatory", 8) / 2,
    y: sigLineY - 11, size: 8, font: regular, color: COLORS.mutedText,
  })

  const qrSize = 60
  const qrX = width - 40 - qrSize
  if (qr) {
    qr.draw(qrX, footerY - 5, qrSize / qr.width)
  }
  page.drawText(data.certificateId, {
    x: qrX, y: footerY + qrSize + 5, size: 8, font: bold, color: COLORS.darkText,
  })

  // Official seal — between the signature and the QR code.
  const sealSize = 65
  const sealCenterX = qrX - sealSize / 2 - 15
  const sealCenterY = footerY + qrSize / 2 - 5
  drawSeal(ctx, sealCenterX, sealCenterY, sealSize)
}

// ----------------------------------------------------------------
// TEMPLATE: MINIMAL
// ----------------------------------------------------------------

function renderMinimal(ctx: RenderContext): void {
  const { page, width, height, fonts, accent, data, logo, signature, qr } = ctx
  const { bold, regular, italic } = fonts
  const cx = width / 2

  // Thin border
  page.drawRectangle({
    x: 40, y: 40, width: width - 80, height: height - 80,
    borderColor: COLORS.lightGray, borderWidth: 1,
  })

  // Logo top center
  let y = height - 90
  if (logo) {
    const scale = Math.min(1, 35 / logo.height)
    logo.draw(cx - (logo.width * scale) / 2, y, scale)
    y -= 50
  }

  // Issuer
  page.drawText(data.issuerName, {
    x: cx - regular.widthOfTextAtSize(data.issuerName, 13) / 2,
    y, size: 13, font: regular, color: COLORS.mutedText,
  })
  y -= 60

  // Title (smaller, refined)
  page.drawText("Certificate of Completion", {
    x: cx - bold.widthOfTextAtSize("Certificate of Completion", 24) / 2,
    y, size: 24, font: bold, color: COLORS.darkText,
  })
  y -= 45

  // Recipient
  page.drawText(data.recipientName, {
    x: cx - bold.widthOfTextAtSize(data.recipientName, 30) / 2,
    y, size: 30, font: bold, color: accent,
  })
  y -= 40

  // Course
  page.drawText(data.courseName, {
    x: cx - regular.widthOfTextAtSize(data.courseName, 16) / 2,
    y, size: 16, font: regular, color: COLORS.darkText,
  })
  y -= 20
  if (data.subjectName) {
    page.drawText(data.subjectName, {
      x: cx - italic.widthOfTextAtSize(data.subjectName, 12) / 2,
      y, size: 12, font: italic, color: COLORS.mutedText,
    })
  }

  // Footer: date | seal | ID + QR
  page.drawText(`Issued ${formatDate(data.issuedAt)}`, {
    x: 60, y: 70, size: 10, font: regular, color: COLORS.mutedText,
  })

  // Official seal (centered between date and ID)
  const sealSize = 55
  drawSeal(ctx, cx, 95, sealSize)

  page.drawText(data.certificateId, {
    x: width - 60 - bold.widthOfTextAtSize(data.certificateId, 9),
    y: 70, size: 9, font: bold, color: COLORS.mutedText,
  })
  // Small QR (optional)
  if (qr) {
    const qs = 40
    qr.draw(width - 60 - qs, 85, qs / qr.width)
  }
}

// ----------------------------------------------------------------
// UTILITIES
// ----------------------------------------------------------------

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
  } catch {
    return iso
  }
}

function base64ToBytes(dataUrl: string): Uint8Array {
  // Handle data URLs: "data:image/png;base64,...."
  const b64 = dataUrl.includes(",")
    ? dataUrl.split(",")[1]
    : dataUrl
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

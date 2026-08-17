"use client"

/**
 * CertificatePreview — renders a visual HTML/SVG preview of the certificate
 * that matches the PDF output. Shown in-browser before/after download.
 *
 * This is a presentational component — it does NOT generate the PDF.
 * Use `generateCertificate()` (server-side) or `CertificateDownloadButton`
 * for actual PDF generation.
 */

import * as React from "react"
import type { CertificateData } from "../types"
import { formatDate } from "./format"

export function CertificatePreview({
  data,
  template = "classic",
  accentColor = "#10b981",
  signatureImageUrl,
  sealImageUrl,
  inkpadSealImageUrl,
  className = "",
}: {
  data: CertificateData
  template?: "classic" | "modern" | "minimal"
  accentColor?: string
  /** URL (or data URL) of the handwritten signature image. */
  signatureImageUrl?: string
  /** URL (or data URL) of the digital seal image. */
  sealImageUrl?: string
  /** URL (or data URL) of the inkpad/wax seal image (drawn behind the digital seal). */
  inkpadSealImageUrl?: string
  className?: string
}) {
  const issuedAt = data.issuedAt ? new Date(data.issuedAt) : new Date()
  const initials = getInitials(data.issuerName)
  const year = String(issuedAt.getFullYear())

  if (template === "minimal") {
    return (
      <div
        className={`relative bg-white border border-gray-200 text-gray-900 p-10 aspect-[1.414] flex flex-col items-center justify-between ${className}`}
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500">{data.issuerName}</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Certificate of Completion</h2>
          <p className="text-3xl font-bold" style={{ color: accentColor }}>{data.recipientName}</p>
          <p className="text-base text-gray-700">{data.courseName}</p>
          {data.subjectName && <p className="text-sm italic text-gray-500">{data.subjectName}</p>}
        </div>
        <div className="flex w-full items-center justify-between text-xs text-gray-500">
          <span>Issued {formatDate(issuedAt)}</span>
          <SealImage
            sealImageUrl={sealImageUrl}
            inkpadSealImageUrl={inkpadSealImageUrl}
            fallbackInitials={initials}
            year={year}
            size={48}
          />
          <span className="font-mono">{data.certificateId ?? "CM-XXXX-XXXX"}</span>
        </div>
      </div>
    )
  }

  if (template === "modern") {
    return (
      <div
        className={`relative bg-white text-gray-900 aspect-[1.414] overflow-hidden ${className}`}
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: accentColor }} />
        <div className="absolute left-2 right-0 top-0 h-1.5" style={{ background: accentColor }} />
        <div className="relative h-full flex flex-col items-center justify-between py-12 px-10">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[11px] tracking-widest text-gray-500 uppercase font-semibold">{data.issuerName}</p>
            {data.issuerTagline && <p className="text-[10px] text-gray-400">{data.issuerTagline}</p>}
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">CERTIFICATE</h2>
            <p className="text-base italic text-gray-500">of Completion</p>
            <p className="mt-6 text-[10px] tracking-widest font-bold" style={{ color: accentColor }}>PRESENTED TO</p>
            <p className="text-2xl font-bold">{data.recipientName}</p>
            <p className="text-xs italic text-gray-500">for successfully completing</p>
            <p className="text-xl font-bold" style={{ color: accentColor }}>{data.courseName}</p>
            {data.subjectName && <p className="text-xs text-gray-500">{data.subjectName}</p>}
            {data.grade && (
              <p className="mt-1 text-sm font-bold" style={{ color: accentColor }}>Grade: {data.grade}</p>
            )}
          </div>
          <div className="w-full flex items-end justify-between text-[10px] text-gray-600">
            <div>
              <p className="text-[8px] text-gray-400 uppercase">Date</p>
              <p className="font-bold text-gray-800">{formatDate(issuedAt)}</p>
            </div>
            <div className="text-center">
              {signatureImageUrl ? (
                <img
                  src={signatureImageUrl}
                  alt="Signature"
                  className="h-8 mx-auto object-contain"
                  style={{ maxWidth: "160px" }}
                />
              ) : null}
              <div className="w-32 border-t border-gray-800 mb-1" />
              <p className="font-bold text-gray-800">{data.instructorName ?? data.issuerName}</p>
              <p className="text-gray-500">{data.instructorTitle ?? "Authorized Signatory"}</p>
            </div>
            <div className="flex items-center gap-2">
              <SealImage
                sealImageUrl={sealImageUrl}
                inkpadSealImageUrl={inkpadSealImageUrl}
                fallbackInitials={initials}
                year={year}
                size={56}
              />
              <div className="text-right">
                <p className="font-mono font-bold text-gray-800">{data.certificateId ?? "CM-XXXX-XXXX"}</p>
                <p className="text-gray-400 text-[8px]">Certificate ID</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // CLASSIC (default)
  return (
    <div
      className={`relative bg-white text-gray-900 aspect-[1.414] ${className}`}
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {/* Outer border */}
      <div
        className="absolute inset-2 border-[3px]"
        style={{ borderColor: accentColor }}
      />
      {/* Inner thin border */}
      <div className="absolute inset-3 border border-gray-200" />
      <div className="relative h-full flex flex-col items-center justify-between py-12 px-14">
        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-bold text-gray-800">{data.issuerName}</p>
          {data.issuerTagline && <p className="text-[10px] text-gray-500">{data.issuerTagline}</p>}
        </div>
        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Certificate of Completion</h2>
          <div className="w-20 h-0.5" style={{ background: accentColor }} />
          <p className="mt-3 text-sm italic text-gray-500">This is to certify that</p>
          <p className="text-2xl font-bold mt-1" style={{ color: accentColor }}>{data.recipientName}</p>
          <div className="w-48 h-px bg-gray-200 mt-1" />
          <p className="mt-3 text-sm italic text-gray-500">has successfully completed</p>
          <p className="text-xl font-bold text-gray-800">{data.courseName}</p>
          {data.subjectName && <p className="text-xs text-gray-500">{data.subjectName}</p>}
          {data.grade && (
            <p className="mt-2 text-sm font-bold" style={{ color: accentColor }}>Grade: {data.grade}</p>
          )}
          {data.completionNote && <p className="text-xs text-gray-500">{data.completionNote}</p>}
        </div>
        {/* Footer */}
        <div className="w-full flex items-end justify-between text-[10px] text-gray-600">
          <div>
            <p className="text-[8px] text-gray-400 uppercase">Issue Date</p>
            <p className="font-bold text-gray-800">{formatDate(issuedAt)}</p>
          </div>
          <div className="text-center">
            {signatureImageUrl ? (
              <img
                src={signatureImageUrl}
                alt="Signature"
                className="h-10 mx-auto object-contain"
                style={{ maxWidth: "160px" }}
              />
            ) : null}
            <div className="w-40 border-t border-gray-800 mb-1" />
            <p className="font-bold text-gray-800">{data.instructorName ?? data.issuerName}</p>
            <p className="text-gray-500">{data.instructorTitle ?? "Authorized Signatory"}</p>
          </div>
          <div className="flex items-center gap-2">
            <SealImage
              sealImageUrl={sealImageUrl}
              inkpadSealImageUrl={inkpadSealImageUrl}
              fallbackInitials={initials}
              year={year}
              size={64}
            />
            <div className="text-right">
              <p className="font-mono font-bold text-gray-800">{data.certificateId ?? "CM-XXXX-XXXX"}</p>
              <p className="text-gray-400 text-[8px]">Certificate ID · Scan QR to verify</p>
              {data.expiresAt
                ? <p className="text-gray-500 text-[8px]">Valid until {formatDate(new Date(data.expiresAt))}</p>
                : <p className="text-[8px]" style={{ color: accentColor }}>Lifetime validity</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// SEAL IMAGE COMPONENT (renders digital seal + inkpad seal layered)
// ----------------------------------------------------------------

/**
 * Renders the seal area. If `sealImageUrl` is provided, shows the digital
 * seal image. If `inkpadSealImageUrl` is also provided, layers it behind
 * (slightly larger, semi-transparent) for a "pressed into wax" effect.
 * Falls back to the generated SVG `Seal` component if no images.
 */
function SealImage({
  sealImageUrl,
  inkpadSealImageUrl,
  fallbackInitials,
  year,
  size = 64,
}: {
  sealImageUrl?: string
  inkpadSealImageUrl?: string
  fallbackInitials: string
  year: string
  size?: number
}) {
  // No images at all → use the generated SVG seal
  if (!sealImageUrl && !inkpadSealImageUrl) {
    return <Seal initials={fallbackInitials} year={year} size={size} />
  }

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label="Official seal"
    >
      {/* Layer 1: inkpad seal (behind, larger, semi-transparent) */}
      {inkpadSealImageUrl && (
        <img
          src={inkpadSealImageUrl}
          alt=""
          className="absolute inset-0 object-contain"
          style={{
            width: size * 1.15,
            height: size * 1.15,
            top: -size * 0.075,
            left: -size * 0.075,
            opacity: 0.78,
          }}
          aria-hidden
        />
      )}
      {/* Layer 2: digital seal (front, full opacity) */}
      {sealImageUrl && (
        <img
          src={sealImageUrl}
          alt="Official seal"
          className="absolute inset-0 object-contain"
          style={{ width: size, height: size }}
        />
      )}
      {/* If only inkpad (no digital seal), show it at full opacity */}
      {!sealImageUrl && inkpadSealImageUrl && (
        <img
          src={inkpadSealImageUrl}
          alt="Official seal"
          className="absolute inset-0 object-contain"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  )
}

// ----------------------------------------------------------------
// SEAL COMPONENT (SVG fallback — used when no seal images provided)
// ----------------------------------------------------------------

/**
 * A gold embossed seal rendered as inline SVG. Matches the generated
 * seal in the PDF output — two concentric circles, issuer initials,
 * "CERTIFIED" text, a star, and the year.
 */
function Seal({
  initials,
  year,
  size = 64,
}: {
  initials: string
  year: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0"
      aria-label="Official seal"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#d4a017" strokeWidth="2.5" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="43" fill="none" stroke="#d4a017" strokeWidth="0.8" />
      {/* Pale gold fill */}
      <circle cx="50" cy="50" r="43" fill="#d4a017" fillOpacity="0.1" />
      {/* "CERTIFIED" text (top) */}
      <text
        x="50" y="26"
        textAnchor="middle"
        fontSize="7"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="normal"
        fill="#d4a017"
        letterSpacing="1"
      >
        CERTIFIED
      </text>
      {/* Issuer initials (center, large) */}
      <text
        x="50" y="58"
        textAnchor="middle"
        fontSize="26"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="bold"
        fill="#d4a017"
      >
        {initials}
      </text>
      {/* Star (bottom) */}
      <path
        d="M50,68 L52,73 L57,73 L53,76 L55,81 L50,78 L45,81 L47,76 L43,73 L48,73 Z"
        fill="none"
        stroke="#d4a017"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Year (very bottom) */}
      <text
        x="50" y="86"
        textAnchor="middle"
        fontSize="6"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="bold"
        fill="#d4a017"
      >
        {year}
      </text>
    </svg>
  )
}

/** Extract initials from an issuer name (e.g. "CodeMastery" → "CM"). */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "•"
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

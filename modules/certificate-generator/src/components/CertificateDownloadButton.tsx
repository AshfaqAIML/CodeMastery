"use client"

/**
 * CertificateDownloadButton — a button that triggers server-side PDF
 * generation via an API route and downloads the result.
 *
 * Usage:
 * ```tsx
 * <CertificateDownloadButton
 *   certificateData={{ recipientName: "Jane Doe", courseName: "Python", issuerName: "CodeMastery" }}
 *   apiEndpoint="/api/certificates/generate"
 *   options={{ template: "classic", accentColor: "#10b981" }}
 *   onError={(msg) => toast.error(msg)}
 * />
 * ```
 *
 * The host's API route calls `generateCertificate()` server-side and
 * streams the PDF back. This keeps the secret + access-control logic
 * on the server — the client never sees the PDF generation internals.
 */

import * as React from "react"
import type { CertificateData, GenerateOptions } from "../types"

export interface CertificateDownloadButtonProps {
  /** The certificate data. The host should populate this server-side. */
  certificateData: CertificateData
  /** The host's API route that generates the PDF. Defaults to "/api/certificates/generate". */
  apiEndpoint?: string
  /** Rendering options. Passed to the API route as JSON. */
  options?: GenerateOptions
  /** Button label. */
  label?: string
  /** Button className. */
  className?: string
  /** Disabled state (e.g. when access check failed). */
  disabled?: boolean
  /** Called when the PDF download starts. */
  onDownloadStart?: () => void
  /** Called when the download completes successfully. */
  onDownloadComplete?: (filename: string) => void
  /** Called on error. */
  onError?: (message: string) => void
  /** Children to render inside the button (overrides label). */
  children?: React.ReactNode
}

export function CertificateDownloadButton({
  certificateData,
  apiEndpoint = "/api/certificates/generate",
  options,
  label = "Download Certificate (PDF)",
  className = "",
  disabled = false,
  onDownloadStart,
  onDownloadComplete,
  onError,
  children,
}: CertificateDownloadButtonProps) {
  const [loading, setLoading] = React.useState(false)

  async function handleDownload() {
    if (loading || disabled) return
    setLoading(true)
    onDownloadStart?.()
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: certificateData, options: options ?? {} }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Request failed (${res.status})` }))
        throw new Error(err.error ?? `Request failed (${res.status})`)
      }
      // The response is the PDF binary
      const blob = await res.blob()
      const filename = getFilenameFromResponse(res) || "certificate.pdf"
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onDownloadComplete?.(filename)
    } catch (e: any) {
      onError?.(e.message ?? "Failed to generate certificate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || loading}
      className={className}
      aria-busy={loading}
    >
      {children ?? (loading ? "Generating…" : label)}
    </button>
  )
}

function getFilenameFromResponse(res: Response): string | null {
  const cd = res.headers.get("content-disposition")
  if (!cd) return null
  const match = cd.match(/filename="?([^"]+)"?/i)
  return match ? match[1] : null
}

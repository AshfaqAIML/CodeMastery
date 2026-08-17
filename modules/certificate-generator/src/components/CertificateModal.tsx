"use client"

/**
 * CertificateModal — a modal dialog that shows a visual preview of the
 * certificate + a download button.
 *
 * Combines `CertificatePreview` + `CertificateDownloadButton` into a
 * polished UX. Use this when you want to reveal the certificate after
 * the user completes a course, with a "Generate Certificate" CTA.
 *
 * Usage:
 * ```tsx
 * <CertificateModal
 *   open={showCertificate}
 *   onOpenChange={setShowCertificate}
 *   certificateData={data}
 *   apiEndpoint="/api/certificates/generate"
 *   accessResult={accessResult}  // from checkCertificateAccess()
 * />
 * ```
 */

import * as React from "react"
import { X, Download, Lock, ShieldCheck } from "lucide-react"
import type { CertificateData, GenerateOptions, AccessResult } from "../types"
import { CertificatePreview } from "./CertificatePreview"
import { CertificateDownloadButton } from "./CertificateDownloadButton"
import { getAccessLabel } from "../lib/access-control"

export interface CertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificateData: CertificateData
  apiEndpoint?: string
  options?: GenerateOptions
  /** If provided, shows the access tier + gates the download button. */
  accessResult?: AccessResult
  /** Called when the user clicks "Unlock Premium" (if access denied). */
  onUpgrade?: () => void
  /** Close on backdrop click. Defaults to true. */
  closeOnBackdrop?: boolean
}

export function CertificateModal({
  open,
  onOpenChange,
  certificateData,
  apiEndpoint,
  options,
  accessResult,
  onUpgrade,
  closeOnBackdrop = true,
}: CertificateModalProps) {
  if (!open) return null

  const allowed = accessResult?.allowed ?? true
  const effectiveAccess = accessResult?.effectiveAccess

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={closeOnBackdrop ? () => onOpenChange(false) : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Certificate"
    >
      <div
        className="relative bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold">Your Certificate</h2>
            {effectiveAccess && (
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: effectiveAccess === "PREMIUM" || effectiveAccess === "PREMIUM_TRIAL"
                    ? "color-mix(in oklch, oklch(0.75 0.16 85) 15%, transparent)"
                    : "color-mix(in oklch, gray 15%, transparent)",
                  color: effectiveAccess === "PREMIUM" || effectiveAccess === "PREMIUM_TRIAL"
                    ? "oklch(0.75 0.16 85)"
                    : "gray",
                }}
              >
                {getAccessLabel(effectiveAccess)}
              </span>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Access denied banner */}
          {accessResult && !allowed && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <Lock className="size-5 text-amber-600 shrink-0 mt-0.5" aria-hidden />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-200">
                    Certificate locked
                  </p>
                  <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-100/80">
                    {accessResult.reason}
                  </p>
                  {onUpgrade && accessResult.requiredAccess === "PREMIUM" && (
                    <button
                      onClick={onUpgrade}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Download className="size-4" />
                      Unlock Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Certificate preview */}
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <CertificatePreview
              data={certificateData}
              template={options?.template ?? "classic"}
              accentColor={options?.accentColor ?? "#10b981"}
            />
          </div>

          {/* Verification info */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 mt-0.5" aria-hidden />
            <p>
              This certificate is verifiable. Each certificate has a unique ID and a
              cryptographic verification hash — scan the QR code or visit the verification
              URL to confirm its authenticity.
            </p>
          </div>

          {/* Download button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Close
            </button>
            <CertificateDownloadButton
              certificateData={certificateData}
              apiEndpoint={apiEndpoint}
              options={options}
              disabled={!allowed}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="size-4" />
              Download PDF
            </CertificateDownloadButton>
          </div>
        </div>
      </div>
    </div>
  )
}

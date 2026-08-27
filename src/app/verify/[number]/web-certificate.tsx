import { ShieldCheck, ShieldX, AlertTriangle, FileText } from "lucide-react"
import type { PublicCertificate } from "@/lib/certificates/verify"

export function StatusBanner({ cert }: { cert: PublicCertificate }) {
  const { status } = cert
  if (status === "VALID") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <ShieldCheck className="size-6 text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">Certificate Verified</p>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
            This certificate is valid and was issued by {cert.issuerName}.
          </p>
        </div>
      </div>
    )
  }
  if (status === "REVOKED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
        <ShieldX className="size-6 text-red-600 shrink-0" />
        <div>
          <p className="font-semibold text-red-700 dark:text-red-400">Certificate Revoked</p>
          <p className="text-xs text-red-700/80 dark:text-red-400/80">
            This certificate was revoked on {cert.revokedAt}
            {cert.revokeReason ? ` — ${cert.revokeReason}` : ""}.
          </p>
        </div>
      </div>
    )
  }
  if (status === "SUPERSEDED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <AlertTriangle className="size-6 text-amber-600 shrink-0" />
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400">Superseded by a newer version</p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
            A newer version of this certificate has been issued. Please verify the latest certificate number.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-muted bg-muted/50 px-4 py-3">
      <FileText className="size-6 text-muted-foreground shrink-0" />
      <div>
        <p className="font-semibold">Status: {status}</p>
        <p className="text-xs text-muted-foreground">This certificate is not currently valid.</p>
      </div>
    </div>
  )
}

/**
 * The responsive web certificate — real HTML rendered for screen and print
 * (never a screenshot of the PDF). The QR encodes the same page URL, so a
 * scan from the printed PDF or from this page always resolves here.
 */
export function WebCertificate({ cert }: { cert: PublicCertificate }) {
  const revoked = cert.status !== "VALID"

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="print:hidden">
        <StatusBanner cert={cert} />
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl bg-[#fdfaf1] text-[#1f2937] border-8 border-double border-[#b08d2f]/70 shadow-xl print:rounded-none print:border-4 print:shadow-none ${
          revoked ? "opacity-95" : ""
        }`}
      >
        {/* inner hairline */}
        <div className="absolute inset-3 border border-[#b08d2f]/50 rounded-xl pointer-events-none" />

        <div className="relative px-6 sm:px-14 py-10 sm:py-14">
          {revoked && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[-14deg] text-center pointer-events-none print:block">
              <span
                className={`inline-block text-4xl sm:text-6xl font-black tracking-widest uppercase opacity-25 ${
                  cert.status === "REVOKED" ? "text-red-600" : "text-amber-600"
                }`}
              >
                {cert.status === "REVOKED" ? "Revoked" : "Superseded"}
              </span>
            </div>
          )}

          {/* Centered text */}
          <div className="text-center">
            <p className="text-lg sm:text-3xl tracking-[0.35em] uppercase text-[#8a6d1f] font-bold">
              {cert.issuerName} presents this certificate to
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-3 font-serif">
              {cert.userName}
            </h1>
            <p className="text-base sm:text-xl font-semibold text-[#4b5563] mt-3">
              for successfully completing
            </p>
            <p className="text-2xl sm:text-4xl font-black font-serif text-[#b08d2f] mt-1">
              {cert.subjectName ?? cert.title}
            </p>
            {cert.completedCount && cert.totalCount ? (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="rounded-full bg-[#1f2937] text-white text-[11px] px-3 py-1">
                  {cert.completedCount}/{cert.totalCount} tutorials completed
                </span>
                {cert.xpAwarded !== null && cert.xpAwarded > 0 && (
                  <span className="rounded-full bg-[#e9e2c8] text-[#6b5427] text-[11px] px-3 py-1">
                    {cert.xpAwarded} XP earned
                  </span>
                )}
                {cert.estimatedHours !== null && cert.estimatedHours > 0 && (
                  <span className="rounded-full bg-[#e9e2c8] text-[#6b5427] text-[11px] px-3 py-1">
                    {cert.estimatedHours}h of material
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#6b7280]">
                {cert.issuedReason ?? "Awarded for outstanding academic achievement."}
              </p>
            )}
            <p className="text-xs text-[#6b7280] mt-4">
              Issued on {cert.issuedAt}
              {cert.version > 1 ? ` · Version ${cert.version}` : ""}
            </p>
          </div>

          {/* Signature + Inkpad Seal + Digital Seal + QR row */}
          <div className="mt-10 flex flex-col sm:flex-row items-end justify-between gap-6">
            {/* Left: Signature + Inkpad Seal + Digital Seal */}
            <div className="flex items-end gap-4">
              <div>
                <img
                  src="/certificates/signature.png"
                  alt=""
                  className="h-14 object-contain mb-1 grayscale"
                />
                <div className="border-t border-[#6b7280]/60 w-56 max-w-full" />
                <p className="font-semibold text-sm mt-2">{cert.signatoryName ?? "CodeMastery Certification Office"}</p>
                <p className="text-xs text-[#6b7280]">{cert.signatoryTitle ?? "Authorized Signatory"}</p>
              </div>
              <img
                src="/certificates/seal.png"
                alt="CodeMastery inkpad seal"
                className="size-20 sm:size-24 object-contain hidden sm:block"
              />
              <img
                src="/certificates/digital-seal.png"
                alt="CodeMastery digital seal"
                className="size-20 sm:size-24 object-contain hidden sm:block"
              />
            </div>

            {/* Right: QR */}
            <div className="flex flex-col items-center gap-1.5 mb-4">
              <img
                src={`/api/certificates/${cert.number}/qr`}
                alt={`QR code verifying certificate ${cert.number}`}
                width={104}
                height={104}
                className="bg-white p-1 border border-[#c9a94e] rounded"
              />
              <p className="text-[10px] text-[#6b7280]">Scan to verify</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6b7280]">
            <span>
              Certificate No. <span className="font-mono font-semibold text-[#1f2937]">{cert.number}</span>
            </span>
            <span className="font-mono">{cert.verifyUrl}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground print:hidden">
        Public verification record — learn more at{" "}
        <a href="/" className="underline">
          codemastery
        </a>
        . Use your browser&apos;s print option to save a copy.
      </p>
    </div>
  )
}
"use client"

import * as React from "react"
import { ExternalLink, Share2, CheckCircle2, FileDown } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { toast } from "sonner"
import { CertificateDownloadButton } from "@codemastery/certificate-generator"

export function SubjectCertificate({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: any
}) {
  const cert = data?.certificate

  if (!data?.earned) return null

  const completionDate = data.completedAt
    ? new Date(data.completedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })
    : ""

  const onShare = async () => {
    const text = `I earned a verified certificate for completing ${data.subjectName} on CodeMastery! Verify it: ${cert.verifyUrl}`
    try {
      if (navigator.share) {
        await navigator.share({ title: "CodeMastery Certificate", text, url: cert.verifyUrl })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success("Verification link copied!")
      }
    } catch (e: any) {
      if (e.name !== "AbortError") toast.error("Failed to share")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg no-print">
        <DialogHeader>
          <DialogTitle className="sr-only">Subject completion certificate</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="relative rounded-2xl border-2 border-[#b08d2f]/40 overflow-hidden bg-[#fdfaf1] text-[#1f2937]"
        >
          <div className="absolute top-0 right-0 size-24 opacity-5 pointer-events-none">
            <SubjectIcon name={data.subjectIcon} color={data.subjectColor} className="size-24 rounded-2xl" />
          </div>

          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <img src="/certificates/seal.svg" alt="CodeMastery seal" className="size-20" />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8a6d1f] mb-1">
              Certificate of Completion
            </p>
            <h2 className="text-2xl font-bold mb-1">{data.userName}</h2>
            <p className="text-sm text-[#4b5563] mb-3">
              has successfully completed all tutorials in
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <SubjectIcon name={data.subjectIcon} color={data.subjectColor} className="size-8 rounded-lg" />
              <h3 className="text-xl font-semibold">{data.subjectName}</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 my-6 py-4 border-y border-[#b08d2f]/25">
              <Stat label="Tutorials" value={data.completedCount} />
              <Stat label="Issued" value={completionDate.split(" ")[2] ?? ""} />
              <Stat label="Status" value="Valid" />
            </div>

            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <div className="text-left">
                <div className="font-mono text-[#1f2937]">{cert?.number}</div>
                <div className="mt-0.5">{completionDate}</div>
              </div>
              {cert ? (
                <div className="flex items-center gap-2">
                  <img
                    src={`/api/certificates/${cert.number}/qr`}
                    alt="Verification QR code"
                    width={72}
                    height={72}
                    className="rounded bg-white p-1 border border-[#c9a94e]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-primary">
                  <CheckCircle2 className="size-3" />
                  <span className="font-medium">Earned</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2 mt-4 no-print">
          <Button variant="outline" size="sm" onClick={onShare} className="gap-1.5">
            <Share2 className="size-3.5" />
            Share
          </Button>
          {cert && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(cert.verifyUrl, "_blank", "noopener")}>
                <ExternalLink className="size-3.5" />
                Verify online
              </Button>
              <CertificateDownloadButton
                certificateData={{
                  recipientName: data.userName,
                  courseName: data.subjectName,
                  subjectName: data.subjectSlug,
                  issuerName: "CodeMastery",
                }}
                apiEndpoint="/api/certificates/generate"
                options={{ template: "classic", accentColor: "#b45309" }}
                onError={(msg) => toast.error(msg)}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium h-8 px-3 hover:opacity-90 transition-opacity"
              >
                <FileDown className="size-3.5" />
                Download PDF
              </CertificateDownloadButton>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[#8a6d1f] mt-0.5">{label}</div>
    </div>
  )
}
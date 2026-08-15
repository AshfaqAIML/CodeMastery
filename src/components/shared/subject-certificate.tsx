"use client"

import * as React from "react"
import { Award, Download, Share2, X, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { toast } from "sonner"

export function SubjectCertificate({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: any
}) {
  if (!data?.earned) return null

  const completionDate = new Date(data.completedAt).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const onPrint = () => {
    toast.info("Opening print dialog for certificate...")
    setTimeout(() => window.print(), 300)
  }

  const onShare = async () => {
    const text = `I completed the ${data.subjectName} course on CodeMastery! 🎓 ${data.tutorialsCompleted} tutorials, ${data.totalXPEarned} XP earned.`
    try {
      if (navigator.share) {
        await navigator.share({ title: "CodeMastery Certificate", text })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success("Certificate text copied!")
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
          className="relative rounded-2xl border-2 border-primary/30 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklch, ${data.subjectColor} 8%, var(--background)), var(--background))`,
          }}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 size-24 opacity-5 pointer-events-none">
            <SubjectIcon name={data.subjectIcon} color={data.subjectColor} className="size-24 rounded-2xl" />
          </div>

          {/* Certificate content */}
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
                className="size-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center"
              >
                <Award className="size-9" />
              </motion.div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Certificate of Completion
            </p>
            <h2 className="text-2xl font-bold mb-1">{data.userName}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              has successfully completed all tutorials in
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <SubjectIcon name={data.subjectIcon} color={data.subjectColor} className="size-8 rounded-lg" />
              <h3 className="text-xl font-semibold" style={{ color: data.subjectColor }}>
                {data.subjectName}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 my-6 py-4 border-y border-border/60">
              <Stat label="Tutorials" value={data.tutorialsCompleted} />
              <Stat label="XP Earned" value={data.totalXPEarned} />
              <Stat label="Est. Hours" value={data.estimatedTotalHours} />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="text-left">
                <div className="font-mono">{data.certificateId}</div>
                <div className="mt-0.5">Issued {completionDate}</div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="size-3" />
                <span className="font-medium">Verified</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2 mt-4 no-print">
          <Button variant="outline" size="sm" onClick={onShare} className="gap-1.5">
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={onPrint} className="gap-1.5">
            <Download className="size-3.5" />
            Save as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}

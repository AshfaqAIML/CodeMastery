"use client"

import * as React from "react"
import { Award, ExternalLink, FileDown, Copy, CheckCircle2, XCircle, AlertTriangle, ScrollText } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useMyCertificates } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "sonner"

function StatusChip({ status }: { status: string }) {
  if (status === "VALID") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold">
        <CheckCircle2 className="size-3" /> Valid
      </span>
    )
  }
  if (status === "REVOKED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 text-[11px] font-semibold">
        <XCircle className="size-3" /> Revoked
      </span>
    )
  }
  if (status === "SUPERSEDED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-semibold">
        <AlertTriangle className="size-3" /> Superseded
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2.5 py-0.5 text-[11px] font-semibold">
      {status}
    </span>
  )
}

export function CertificatesView() {
  const { navigate } = useAppStore()
  const { status } = useSession()
  const { data, isLoading } = useMyCertificates()

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Verification link copied")
    } catch {
      toast.error("Could not copy link")
    }
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Award className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground text-sm">
            Earn a certificate by completing every tutorial in a subject.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      ) : (data?.certificates?.length ?? 0) === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No certificates yet"
          description="Complete every tutorial in any subject and a certificate will be issued to you automatically — with a scannable QR code anyone can verify."
          action={<Button size="sm" onClick={() => navigate("browse")}>Browse subjects</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {(data?.certificates ?? []).map((c: any, i: number) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card className="h-full overflow-hidden hover:border-primary/40 hover:shadow-md transition-all">
                <div className="h-1.5 w-full" style={{ background: c.subjectColor ?? "var(--primary)" }} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <SubjectIcon
                      name={c.subjectIcon ?? "BookOpen"}
                      color={c.subjectColor ?? "var(--primary)"}
                      className="size-11 rounded-xl"
                    />
                    <StatusChip status={c.status} />
                  </div>
                  <CardTitle className="text-lg mt-3">{c.title}</CardTitle>
                  <CardDescription className="text-xs font-mono">{c.number}</CardDescription>
                </CardHeader>
                <CardContent className="pt-1">
                  <p className="text-xs text-muted-foreground mb-3">
                    Issued {new Date(c.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    {c.revokedAt ? ` · Revoked ${new Date(c.revokedAt).toLocaleDateString()}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(c.verifyUrl, "_blank", "noopener")}
                    >
                      <ExternalLink className="mr-1.5 size-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`/api/certificates/${c.number}/download`, "_blank", "noopener")}
                    >
                      <FileDown className="mr-1.5 size-3.5" /> PDF
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copyLink(c.verifyUrl)} aria-label="Copy verification link">
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
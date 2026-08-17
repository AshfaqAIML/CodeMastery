"use client"

import * as React from "react"
import {
  ShieldCheck, Database, BookOpen, FileQuestion, Award, Route, Users,
  Download, Upload, Loader2, BarChart3,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { apiFetch } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { CertificatesAdmin } from "@/components/admin/certificates-admin"

export function AdminView() {
  const { data: session } = useSession()
  const { navigate } = useAppStore()
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [exporting, setExporting] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    apiFetch("/api/admin/stats")
      .then((s) => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShieldCheck className="size-12 mx-auto text-muted-foreground/40 mb-3" />
        <h1 className="text-xl font-bold mb-2">Admin access required</h1>
        <p className="text-muted-foreground mb-4">
          You need an admin account to view this page.
        </p>
        <p className="text-xs text-muted-foreground">
          Demo admin: admin@codemastery.dev / admin12345
        </p>
      </div>
    )
  }

  const onExport = async () => {
    setExporting(true)
    try {
      const data = await apiFetch<any>("/api/admin/export")
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `codemastery-content-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Content exported")
    } catch (e: any) {
      toast.error(e.message ?? "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const onImport = async (file: File) => {
    setImporting(true)
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      const res = await apiFetch<any>("/api/admin/import", {
        method: "POST",
        body: JSON.stringify(json),
      })
      toast.success(`Imported: ${res.imported.subjects} subjects, ${res.imported.tutorials} tutorials`)
    } catch (e: any) {
      toast.error(e.message ?? "Import failed")
    } finally {
      setImporting(false)
    }
  }

  const counts = stats?.counts

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage content and platform state.</p>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="size-5 text-primary" /> Platform stats
      </h2>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <AdminStat icon={Users} label="Users" value={counts?.users ?? 0} color="oklch(0.7 0.13 200)" />
          <AdminStat icon={BookOpen} label="Subjects" value={counts?.subjects ?? 0} color="oklch(0.62 0.15 162)" />
          <AdminStat icon={BookOpen} label="Tutorials" value={counts?.tutorials ?? 0} color="oklch(0.72 0.16 162)" />
          <AdminStat icon={FileQuestion} label="Quizzes" value={counts?.quizzes ?? 0} color="oklch(0.75 0.16 85)" />
          <AdminStat icon={Award} label="Achievements" value={counts?.achievements ?? 0} color="oklch(0.68 0.2 305)" />
          <AdminStat icon={Route} label="Learning paths" value={counts?.paths ?? 0} color="oklch(0.68 0.2 30)" />
          <AdminStat icon={Database} label="Progress records" value={counts?.progress ?? 0} color="oklch(0.7 0.13 200)" />
          <AdminStat icon={FileQuestion} label="Quiz attempts" value={counts?.quizAttempts ?? 0} color="oklch(0.68 0.2 305)" />
          <AdminStat icon={Award} label="Certificates" value={counts?.certificates ?? 0} color="oklch(0.62 0.15 162)" />
        </div>
      )}

      {/* Content portability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="size-5 text-primary" /> Content portability
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Export the entire content library as portable JSON, or import from another instance.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onExport} disabled={exporting}>
            {exporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}
            Export content
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={importing}>
            {importing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
            Import content
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ""
            }}
          />
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Portability note:</strong> The export contains subjects, modules, tutorials, quizzes, achievements, and learning paths as portable JSON. This is engine-agnostic and can be imported into any CodeMastery instance regardless of the underlying database (SQLite or PostgreSQL).
      </div>

      {/* Certificates */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Award className="size-5 text-primary" /> Certificates
        </h2>
        <CertificatesAdmin />
      </div>
    </div>
  )
}

function AdminStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <span
          className="size-8 rounded-lg flex items-center justify-center mb-2"
          style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
        >
          <Icon className="size-4" />
        </span>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import {
  ShieldCheck, Database, BookOpen, FileQuestion, Award, Route, Users,
  Download, Upload, Loader2, BarChart3, Crown, Settings2, BrainCircuit,
  ScrollText, ListChecks, GraduationCap,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { apiFetch } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { CertificatesAdmin } from "@/components/admin/certificates-admin"
import { PremiumAdmin } from "@/components/admin/premium-admin"
import { UsersAdmin } from "@/components/admin/users-admin"
import { AuditAdmin } from "@/components/admin/audit-admin"
import { AIAdmin } from "@/components/admin/ai-admin"
import { SettingsAdmin } from "@/components/admin/settings-admin"
import { TutorialsAdmin } from "@/components/admin/tutorials-admin"
import { can, isAdminRole } from "@/lib/authorization/client-permissions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminView() {
  const { data: session } = useSession()
  const { navigate } = useAppStore()
  const role = session?.user?.role
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

  if (!isAdminRole(role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShieldCheck className="size-12 mx-auto text-muted-foreground/40 mb-3" />
        <h1 className="text-xl font-bold mb-2">Admin access required</h1>
        <p className="text-muted-foreground mb-4">
          You need an administrator account to view this area.
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
  const isSuper = role === "SUPER_ADMIN"

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isSuper ? "Super Admin dashboard" : "Admin dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm">Manage users, content, certificates, entitlements and platform state.</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant="outline" size="sm" onClick={() => navigate("browse")}>
          <GraduationCap className="mr-1.5 size-4" /> View site as learner
        </Button>
        {can(role, "content.export") && (
          <Button variant="outline" size="sm" onClick={onExport} disabled={exporting}>
            {exporting ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Download className="mr-1.5 size-4" />} Export content
          </Button>
        )}
        {can(role, "content.import") && (
          <>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={importing}>
              {importing ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Upload className="mr-1.5 size-4" />} Import content
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
          </>
        )}
      </div>

      {/* Platform overview */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="size-5 text-primary" /> Platform overview
      </h2>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          <AdminStat icon={Users} label="Users" value={counts?.users ?? 0} color="oklch(0.7 0.13 200)" />
          <AdminStat icon={Users} label="Active today" value={counts?.activeToday ?? 0} color="oklch(0.6 0.14 150)" />
          <AdminStat icon={Users} label="New (7d)" value={counts?.newLast7d ?? 0} color="oklch(0.68 0.2 30)" />
          <AdminStat icon={Crown} label="Premium" value={counts?.premiumActive ?? 0} color="oklch(0.7 0.17 85)" />
          <AdminStat icon={Crown} label="Active trials" value={counts?.trialActive ?? 0} color="oklch(0.7 0.13 200)" />
          <AdminStat icon={BookOpen} label="Subjects" value={counts?.subjects ?? 0} color="oklch(0.62 0.15 162)" />
          <AdminStat icon={BookOpen} label="Tutorials" value={counts?.tutorials ?? 0} color="oklch(0.72 0.16 162)" />
          <AdminStat icon={FileQuestion} label="Quizzes" value={counts?.quizzes ?? 0} color="oklch(0.75 0.16 85)" />
          <AdminStat icon={Award} label="Achievements" value={counts?.achievements ?? 0} color="oklch(0.68 0.2 305)" />
          <AdminStat icon={Route} label="Learning paths" value={counts?.paths ?? 0} color="oklch(0.68 0.2 30)" />
          <AdminStat icon={Award} label="Certificates" value={counts?.certificates ?? 0} color="oklch(0.62 0.15 162)" />
          <AdminStat icon={Database} label="Progress records" value={counts?.progress ?? 0} color="oklch(0.7 0.13 200)" />
          <AdminStat icon={FileQuestion} label="Quiz attempts" value={counts?.quizAttempts ?? 0} color="oklch(0.68 0.2 305)" />
          <AdminStat icon={BrainCircuit} label="AI queries" value={counts?.aiQueries ?? 0} color="oklch(0.62 0.2 280)" />
          <AdminStat icon={Database} label="Total XP earned" value={counts?.totalXPEarned ?? 0} color="oklch(0.7 0.15 40)" />
          <AdminStat icon={Database} label="Successful payments" value={counts?.paymentsCompleted ?? 0} color="oklch(0.56 0.14 162)" />
        </div>
      )}

      {/* Management tabs */}
      <Tabs defaultValue="users" className="mb-10">
        <TabsList className="flex flex-wrap h-auto">
          {can(role, "users.view") && <TabsTrigger value="users" className="gap-1.5"><Users className="size-4" /> Users</TabsTrigger>}
          {can(role, "tutorials.manage") && <TabsTrigger value="content" className="gap-1.5"><ListChecks className="size-4" /> Tutorials</TabsTrigger>}
          {can(role, "certificates.view") && <TabsTrigger value="certificates" className="gap-1.5"><Award className="size-4" /> Certificates</TabsTrigger>}
          {can(role, "payments.view") && <TabsTrigger value="premium" className="gap-1.5"><Crown className="size-4" /> Premium & access</TabsTrigger>}
          {can(role, "ai.analytics.view") && <TabsTrigger value="ai" className="gap-1.5"><BrainCircuit className="size-4" /> AI</TabsTrigger>}
          {can(role, "settings.manage") && <TabsTrigger value="settings" className="gap-1.5"><Settings2 className="size-4" /> Settings</TabsTrigger>}
          {can(role, "audit_logs.view") && <TabsTrigger value="audit" className="gap-1.5"><ScrollText className="size-4" /> Audit log</TabsTrigger>}
        </TabsList>

        {can(role, "users.view") && (
          <TabsContent value="users" className="mt-4">
            <UsersAdmin />
          </TabsContent>
        )}
        {can(role, "tutorials.manage") && (
          <TabsContent value="content" className="mt-4">
            <TutorialsAdmin role={role} />
          </TabsContent>
        )}
        {can(role, "certificates.view") && (
          <TabsContent value="certificates" className="mt-4">
            <CertificatesAdmin />
          </TabsContent>
        )}
        {can(role, "payments.view") && (
          <TabsContent value="premium" className="mt-4">
            <PremiumAdmin />
          </TabsContent>
        )}
        {can(role, "ai.analytics.view") && (
          <TabsContent value="ai" className="mt-4">
            <AIAdmin />
          </TabsContent>
        )}
        {can(role, "settings.manage") && (
          <TabsContent value="settings" className="mt-4">
            <SettingsAdmin />
          </TabsContent>
        )}
        {can(role, "audit_logs.view") && (
          <TabsContent value="audit" className="mt-4">
            <AuditAdmin />
          </TabsContent>
        )}
      </Tabs>
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
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}
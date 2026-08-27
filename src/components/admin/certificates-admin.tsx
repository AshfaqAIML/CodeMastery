"use client"

import * as React from "react"
import {
  Award, Search, Loader2, RotateCcw, RefreshCw, ShieldX, Upload, Save,
  ClipboardList, BookOpen, X,
} from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { useSubjects } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

const STATUSES = ["VALID", "REVOKED", "SUPERSEDED", "INVALID"]

function StatusChip({ status }: { status: string }) {
  const cls =
    status === "VALID"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "REVOKED"
        ? "bg-red-500/10 text-red-600 dark:text-red-400"
        : status === "SUPERSEDED"
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-muted text-muted-foreground"
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>
}

export function CertificatesAdmin() {
  return (
    <div className="space-y-6">
      <IssuerGenerator />
      <ManageCertificates />
      <SettingsCard />
      <AuditLog />
    </div>
  )
}

function IssuerGenerator() {
  const { data: subjects } = useSubjects()
  const [subjectId, setSubjectId] = React.useState("")
  const [users, setUsers] = React.useState<any[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [issuing, setIssuing] = React.useState<string | null>(null)

  const findEligible = async () => {
    if (!subjectId) return toast.error("Choose a subject first")
    setLoading(true)
    try {
      const res = await apiFetch<any>(`/api/admin/certificates/eligible?subjectId=${encodeURIComponent(subjectId)}`)
      setUsers(res.users)
    } catch (e: any) {
      toast.error(e.message ?? "Search failed")
    } finally {
      setLoading(false)
    }
  }

  const issue = async (userId: string) => {
    setIssuing(userId)
    try {
      const res = await apiFetch<any>(`/api/admin/certificates`, {
        method: "POST",
        body: JSON.stringify({ userId, subjectId }),
      })
      toast.success(`Issued ${res.certificate.number}`)
      setUsers((prev) => prev ? prev.map((u) => (u.id === userId ? { ...u, hasCertificate: true, certificateNumber: res.certificate.number } : u)) : prev)
    } catch (e: any) {
      toast.error(e.message ?? "Issuance failed")
    } finally {
      setIssuing(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="size-5 text-primary" /> Issue certificates
        </CardTitle>
        <CardDescription>
          Pick a subject to see learners who completed every tutorial — eligibility is verified server-side.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            value={subjectId}
            onChange={(e) => { setSubjectId(e.target.value); setUsers(null) }}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a subject…</option>
            {(subjects ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Button onClick={findEligible} disabled={loading}>
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Search className="mr-2 size-4" />}
            Find eligible learners
          </Button>
        </div>
        {users && (
          <div className="rounded-lg border divide-y">
            {users.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No learners have completed every tutorial of this subject yet.</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.name || u.username || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  {u.hasCertificate ? (
                    <span className="text-xs text-muted-foreground shrink-0">Already issued · {u.certificateNumber}</span>
                  ) : (
                    <Button size="sm" onClick={() => issue(u.id)} disabled={issuing === u.id}>
                      {issuing === u.id ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Award className="mr-1.5 size-3.5" />}
                      Issue
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ManageCertificates() {
  const qc = useQueryClient()
  const [status, setStatus] = React.useState("")
  const [q, setQ] = React.useState("")
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set("status", status)
      if (q.trim()) params.set("q", q.trim())
      params.set("limit", "50")
      const res = await apiFetch<any>(`/api/admin/certificates?${params.toString()}`)
      setData(res)
    } catch (e: any) {
      toast.error(e.message ?? "Load failed")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (id: string, path: string, success: string) => {
    setBusyId(id)
    try {
      await apiFetch<any>(`/api/admin/certificates/${id}/${path}`, { method: "POST", body: "{}" })
      toast.success(success)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Action failed")
    } finally {
      setBusyId(null)
    }
  }

  const revoke = async (id: string) => {
    const reason = window.prompt("Revocation reason (shown on the public verification page):")
    if (reason === null) return
    if (!reason.trim()) return toast.error("A reason is required to revoke.")
    setBusyId(id)
    try {
      await apiFetch<any>(`/api/admin/certificates/${id}/revoke`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      })
      toast.success("Certificate revoked")
      load()
      qc.invalidateQueries({ queryKey: ["my-certificates"] })
    } catch (e: any) {
      toast.error(e.message ?? "Revoke failed")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" /> Manage certificates
        </CardTitle>
        <CardDescription>
          {data ? `${data.total} certificate${data.total !== 1 ? "s" : ""} found` : "Search and manage issued certificates."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select value={status} onChange={(e) => { setStatus(e.target.value); load() }} className="rounded-lg border bg-background px-3 py-2 text-sm w-full sm:w-44">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Input
            placeholder="Search number or learner…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className="flex-1"
          />
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </div>

        <div className="rounded-lg border divide-y">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : (data?.certificates?.length ?? 0) === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No certificates match.</p>
          ) : (
            data.certificates.map((c: any) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold">{c.number}</span>
                    <StatusChip status={c.status} />
                    {c.version > 1 && <span className="text-[10px] text-muted-foreground">v{c.version}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {c.user?.name || c.user?.email} · {c.subjectName ?? "—"} · issued {new Date(c.issuedAt).toLocaleDateString()}
                  </p>
                  {c.revokeReason && <p className="text-[11px] text-red-500/80 truncate mt-0.5">Revoked: {c.revokeReason}</p>}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {c.status === "VALID" && (
                    <Button size="sm" variant="outline" className="text-red-500" onClick={() => revoke(c.id)} disabled={busyId === c.id}>
                      <ShieldX className="mr-1.5 size-3.5" /> Revoke
                    </Button>
                  )}
                  {c.status === "REVOKED" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => act(c.id, "restore", "Certificate restored")} disabled={busyId === c.id}>
                        <RotateCcw className="mr-1.5 size-3.5" /> Restore
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => act(c.id, "reissue", "Certificate reissued")} disabled={busyId === c.id}>
                        <RefreshCw className="mr-1.5 size-3.5" /> Reissue
                      </Button>
                    </>
                  )}
                  {c.status === "SUPERSEDED" && (
                    <span className="text-[11px] text-muted-foreground self-center">Replaced by v{c.version + 1}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsCard() {
  const [form, setForm] = React.useState({ signatoryName: "", signatoryTitle: "", issuerName: "", issuerWebsite: "" })
  const [saving, setSaving] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const [uploading, setUploading] = React.useState<"seal" | "signature" | "digitalSeal" | null>(null)
  const sealRef = React.useRef<HTMLInputElement>(null)
  const signatureRef = React.useRef<HTMLInputElement>(null)
  const digitalSealRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    apiFetch<any>("/api/admin/certificates/settings")
      .then((res) => {
        const s = res.settings
        setForm({
          signatoryName: s.signatoryName ?? "",
          signatoryTitle: s.signatoryTitle ?? "",
          issuerName: s.issuerName ?? "",
          issuerWebsite: s.issuerWebsite ?? "",
        })
        setLoaded(true)
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await apiFetch<any>("/api/admin/certificates/settings", { method: "POST", body: JSON.stringify(form) })
      toast.success("Certificate settings saved")
    } catch (e: any) {
      toast.error(e.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const uploadAsset = async (kind: "seal" | "signature" | "digitalSeal", file: File) => {
    setUploading(kind)
    try {
      const fd = new FormData()
      fd.append("kind", kind)
      fd.append("file", file)
      const res = await fetch("/api/admin/certificates/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json().catch(() => ({ ok: false, error: "Invalid response" }))
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error ?? `Upload failed (${res.status})`)
      }
      toast.success(`${kind === "digitalSeal" ? "Digital seal" : kind === "seal" ? "Seal" : "Signature"} updated`)
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed")
    } finally {
      setUploading(null)
    }
  }

  const clearAsset = async (kind: "seal" | "signature" | "digitalSeal") => {
    try {
      await apiFetch<any>("/api/admin/certificates/settings", {
        method: "POST",
        body: JSON.stringify({ ...form, [`clear${kind[0].toUpperCase()}${kind.slice(1)}`]: true }),
      })
      toast.success(`Reverted to bundled ${kind === "digitalSeal" ? "digital seal (hidden)" : kind}`)
    } catch (e: any) {
      toast.error(e.message ?? "Action failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Save className="size-5 text-primary" /> Issuer & signatory settings
        </CardTitle>
        <CardDescription>
          Shown on newly issued certificates (already-issued ones keep their snapshot). Signatory assets are stored on the server.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!loaded ? (
          <div className="h-20 rounded-lg bg-muted/40 animate-pulse" />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-xs font-medium">Signatory name
                <Input value={form.signatoryName} onChange={(e) => setForm({ ...form, signatoryName: e.target.value })} className="mt-1" />
              </label>
              <label className="text-xs font-medium">Signatory title
                <Input value={form.signatoryTitle} onChange={(e) => setForm({ ...form, signatoryTitle: e.target.value })} className="mt-1" />
              </label>
              <label className="text-xs font-medium">Issuer name
                <Input value={form.issuerName} onChange={(e) => setForm({ ...form, issuerName: e.target.value })} className="mt-1" />
              </label>
              <label className="text-xs font-medium">Issuer website
                <Input value={form.issuerWebsite} onChange={(e) => setForm({ ...form, issuerWebsite: e.target.value })} className="mt-1" />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                Save settings
              </Button>
              <Button variant="outline" onClick={() => sealRef.current?.click()} disabled={uploading !== null}>
                {uploading === "seal" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
                Upload seal
              </Button>
              <input ref={sealRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("seal", f); e.target.value = "" }} />
              <Button variant="outline" onClick={() => signatureRef.current?.click()} disabled={uploading !== null}>
                {uploading === "signature" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
                Upload signature
              </Button>
              <input ref={signatureRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("signature", f); e.target.value = "" }} />
              <Button variant="outline" onClick={() => digitalSealRef.current?.click()} disabled={uploading !== null}>
                {uploading === "digitalSeal" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
                Upload digital seal
              </Button>
              <input ref={digitalSealRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("digitalSeal", f); e.target.value = "" }} />
              <Button variant="ghost" size="sm" onClick={() => clearAsset("seal")}>Reset seal</Button>
              <Button variant="ghost" size="sm" onClick={() => clearAsset("signature")}>Reset signature</Button>
              <Button variant="ghost" size="sm" onClick={() => clearAsset("digitalSeal")}>Reset digital seal</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function AuditLog() {
  const [entries, setEntries] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiFetch<any>("/api/admin/certificates/audit?limit=50")
      .then((res) => setEntries(res.entries))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="size-5 text-primary" /> Audit log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border divide-y max-h-80 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex items-start gap-3 p-3">
                <span className={`mt-1 rounded px-1.5 py-0.5 text-[9px] font-bold ${e.action.includes("REVOKE") ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
                  {e.action}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate">
                    {e.certificateNumber ? <span className="font-mono font-semibold">{e.certificateNumber}</span> : <span className="font-semibold">Settings</span>}
                    {e.detail ? <span className="text-muted-foreground"> — {e.detail}</span> : null}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {e.actor?.name || e.actor?.email || "System"} · {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import * as React from "react"
import {
  Crown, Loader2, Sparkles, ShieldCheck, XCircle, Search,
} from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type EntitlementRow = {
  id: string
  name: string | null
  email: string
  role: string
  plan: string
  effectiveAccess: string
  trial: {
    status: string
    startedAt: string
    endsAt: string
    source: string
  } | null
  entitlement: {
    source: string
    status: string
    grantedAt: string
    revokedAt: string | null
  } | null
  payments: {
    id: string
    provider: string
    transactionId: string | null
    amount: number
    currency: string
    status: string
    createdAt: string
  }[]
  createdAt: string
}

function accessBadge(access: string) {
  switch (access) {
    case "PREMIUM": return <Badge className="gap-1"><Crown className="size-3" /> Premium</Badge>
    case "PREMIUM_TRIAL": return <Badge variant="secondary" className="gap-1"><Sparkles className="size-3 text-primary" /> Trial</Badge>
    case "NORMAL": return <Badge variant="outline">Normal</Badge>
    case "GUEST": return <Badge variant="outline">Guest</Badge>
    default: return <Badge variant="outline">{access}</Badge>
  }
}

export function PremiumAdmin() {
  const [rows, setRows] = React.useState<EntitlementRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const load = React.useCallback(() => {
    apiFetch<{ users: EntitlementRow[] }>("/api/admin/entitlements")
      .then((d) => setRows(d.users))
      .catch(() => toast.error("Failed to load entitlement data."))
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => { load() }, [load])

  const grant = async (row: EntitlementRow) => {
    setBusyId(row.id)
    try {
      const res = await apiFetch<{ granted: boolean; duplicate: boolean; reason?: string }>(
        "/api/admin/entitlements/grant",
        { method: "POST", body: JSON.stringify({ userId: row.id, reason: "Admin grant" }) }
      )
      if (res.granted) toast.success(`Lifetime Premium granted to ${row.name ?? row.email}`)
      else toast.info("Already Premium — nothing changed.")
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Grant failed.")
    } finally {
      setBusyId(null)
    }
  }

  const revoke = async (row: EntitlementRow) => {
    setBusyId(row.id)
    try {
      await apiFetch("/api/admin/entitlements/revoke", {
        method: "POST",
        body: JSON.stringify({ userId: row.id, reason: "Admin revoke" }),
      })
      toast.success(`Revoked Premium from ${row.name ?? row.email}`)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Revoke failed.")
    } finally {
      setBusyId(null)
    }
  }

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      r.email.toLowerCase().includes(q) ||
      (r.name ?? "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Grant or revoke lifetime Premium (one-time purchase or compensation). Trial and payment records are audited.
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 w-full sm:w-64 h-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/40 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Access</th>
                  <th className="px-3 py-2 font-medium">Trial</th>
                  <th className="px-3 py-2 font-medium">Lifetime</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => {
                  const isPremium = r.effectiveAccess === "PREMIUM"
                  return (
                    <tr key={r.id} className="border-b border-border/40 last:border-0">
                      <td className="px-3 py-2.5">
                        <div className="font-medium truncate max-w-[16rem]">{r.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.email} {r.role === "ADMIN" && <span className="text-primary">(admin)</span>}{r.role === "SUPER_ADMIN" && <span className="text-purple-500">(super admin)</span>}</div>
                      </td>
                      <td className="px-3 py-2.5">{accessBadge(r.effectiveAccess)}</td>
                      <td className="px-3 py-2.5">
                        {r.trial ? (
                          <div className="text-xs">
                            <Badge
                              variant="outline"
                              className={
                                r.trial.status === "ACTIVE"
                                  ? "border-primary/40 text-primary"
                                  : "text-muted-foreground"
                              }
                            >
                              {r.trial.status}
                            </Badge>
                            <div className="text-muted-foreground mt-1">
                              ends {new Date(r.trial.endsAt).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {r.entitlement ? (
                          <div className="text-xs">
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">{r.entitlement.status}</span>
                            <div className="text-muted-foreground">
                              {r.entitlement.source === "ADMIN_GRANT" ? "admin" : "purchase"} · {new Date(r.entitlement.grantedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {isPremium ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => revoke(r)}
                            disabled={busyId === r.id}
                          >
                            {busyId === r.id ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <XCircle className="size-3.5 mr-1" />}
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => grant(r)}
                            disabled={busyId === r.id}
                          >
                            {busyId === r.id ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <ShieldCheck className="size-3.5 mr-1" />}
                            Grant Premium
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

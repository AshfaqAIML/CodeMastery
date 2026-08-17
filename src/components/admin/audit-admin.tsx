"use client"

import * as React from "react"
import { Loader2, History } from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type AuditEntry = {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  result: string
  detail: string | null
  ip: string | null
  createdAt: string
  actor: { name: string | null; email: string | null; role: string } | null
}

const ACTION_COLOR: Record<string, string> = {
  ADMIN_LOGIN: "bg-emerald-600",
  ROLE_CHANGED: "bg-purple-600",
  USER_STATUS_CHANGED: "bg-amber-600",
  PREMIUM_GRANTED: "bg-yellow-600",
  PREMIUM_REVOKED: "bg-orange-600",
  CERT_ISSUED: "bg-blue-600",
  CERT_REVOKED: "bg-red-600",
  CERT_REISSUED: "bg-cyan-600",
  CERT_RESTORED: "bg-teal-600",
  TUTORIAL_STATUS_CHANGED: "bg-indigo-600",
  SETTINGS_UPDATED: "bg-slate-600",
  CONTENT_IMPORTED: "bg-lime-600",
  CONTENT_EXPORTED: "bg-lime-600",
  LOGIN_FAILED_LOCKOUT: "bg-red-700",
}

export function AuditAdmin() {
  const [entries, setEntries] = React.useState<AuditEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    apiFetch<any>("/api/admin/audit-logs?limit=100")
      .then((res) => setEntries(res.entries ?? []))
      .catch((e) => toast.error(e.message ?? "Failed to load audit log"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {entries.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No audit entries yet.</p>}
            {entries.map((e) => (
              <div key={e.id} className="rounded-lg border border-border/60 p-3 flex items-start gap-3">
                <History className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={ACTION_COLOR[e.action] ?? "bg-slate-700"}>{e.action}</Badge>
                    {e.targetType && <span className="text-xs text-muted-foreground">{e.targetType}</span>}
                    <span className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs mt-1 break-words">{e.detail ?? e.id}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    by {e.actor ? `${e.actor.name ?? e.actor.email} (${e.actor.role})` : "system"}
                    {e.ip ? ` · ip ${e.ip}` : ""} · {e.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
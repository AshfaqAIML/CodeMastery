"use client"

import * as React from "react"
import { Loader2, BookOpen } from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { can } from "@/lib/authorization/client-permissions"

type TutorialRow = {
  id: string
  title: string
  slug: string
  subjectId: string
  published: boolean
  accessLevel: string
  difficulty: string
  estimatedMinutes: number
  order: number
  updatedAt: string
  subject: { name: string } | null
}

const ACCESS_LABEL: Record<string, { label: string; className: string }> = {
  PUBLIC: { label: "Public", className: "bg-emerald-600" },
  FREE: { label: "Free", className: "bg-blue-600" },
  PREMIUM: { label: "Premium", className: "bg-yellow-600" },
}

export function TutorialsAdmin({ role }: { role?: string | null }) {
  const [rows, setRows] = React.useState<TutorialRow[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [showAll, setShowAll] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (!showAll) params.set("published", "true")
      params.set("limit", "200")
      const res = await apiFetch<any>(`/api/admin/tutorials?${params}`)
      setRows(res.tutorials ?? [])
      setTotal(res.total ?? 0)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load tutorials")
    } finally {
      setLoading(false)
    }
  }, [showAll])

  React.useEffect(() => {
    load()
  }, [load])

  const patch = async (id: string, payload: Record<string, unknown>, msg: string) => {
    setBusyId(id)
    try {
      await apiFetch(`/api/admin/tutorials/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
      toast.success(msg)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Update failed")
    } finally {
      setBusyId(null)
    }
  }

  const canPublish = can(role, "content.publish")
  const canAccess = can(role, "tutorials.manage")

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-muted-foreground">{total} tutorials</p>
          <Button size="sm" variant="outline" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Showing drafts + published" : "Published only"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="max-h-[30rem] overflow-y-auto space-y-2 pr-1">
            {rows.map((t) => (
              <div key={t.id} className="rounded-lg border border-border/60 p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <BookOpen className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{t.title}</span>
                    {!t.published && <Badge variant="outline">Draft</Badge>}
                    <Badge className={ACCESS_LABEL[t.accessLevel]?.className ?? "bg-slate-600"}>
                      {ACCESS_LABEL[t.accessLevel]?.label ?? t.accessLevel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{t.subject?.name ?? "—"} · {t.difficulty} · {t.estimatedMinutes}m</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {canPublish && (
                    <Button size="sm" variant="outline" disabled={busyId === t.id} onClick={() => patch(t.id, { published: !t.published }, t.published ? "Unpublished (now a draft)" : "Published")}>
                      {t.published ? "Unpublish" : "Publish"}
                    </Button>
                  )}
                  {canAccess && (
                    <Button size="sm" variant="outline" disabled={busyId === t.id} onClick={() => patch(t.id, { accessLevel: t.accessLevel === "PREMIUM" ? "FREE" : "PREMIUM" }, "Access level toggled")}>
                      {t.accessLevel === "PREMIUM" ? "Make Free" : "Make Premium"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
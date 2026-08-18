"use client"

import * as React from "react"
import { Search, Loader2, ShieldCheck, ShieldAlert, Ban, RotateCcw, Crown, UserCog, Trash2 } from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { can } from "@/lib/authorization/client-permissions"

type AdminUser = {
  id: string
  name: string | null
  email: string
  username: string | null
  role: string
  plan: string
  status: string
  emailVerified: string | null
  onboarded: boolean
  totalXP: number
  level: number
  currentStreak: number
  createdAt: string
  effectiveAccess: string
}

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  ACTIVE: { label: "Active", variant: "default" },
  SUSPENDED: { label: "Suspended", variant: "outline" },
  BANNED: { label: "Banned", variant: "destructive" },
}

export function UsersAdmin() {
  const { data: session } = useSession()
  const meRole = session?.user?.role
  const meId = session?.user?.id
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState("")
  const [tier, setTier] = React.useState<string>("all")
  const [role, setRole] = React.useState<string>("all")
  const [status, setStatus] = React.useState<string>("all")
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (tier !== "all") params.set("tier", tier)
      if (role !== "all") params.set("role", role)
      if (status !== "all") params.set("status", status)
      params.set("limit", "100")
      const res = await apiFetch<any>(`/api/admin/users?${params}`)
      setUsers(res.users ?? [])
      setTotal(res.total ?? 0)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [q, tier, role, status])

  React.useEffect(() => {
    const t = setTimeout(load, q ? 350 : 0)
    return () => clearTimeout(t)
  }, [load, q])

  const act = async (id: string, payload: Record<string, unknown>, successMsg: string) => {
    setBusyId(id)
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
      toast.success(successMsg)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Action failed")
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (u: AdminUser) => {
    if (!window.confirm(`Permanently delete ${u.email}?\n\nThis removes their account, progress, achievements, notes and payment records. This cannot be undone.`)) return
    setBusyId(u.id)
    try {
      await apiFetch(`/api/admin/users/${u.id}`, { method: "DELETE" })
      toast.success(`${u.email} deleted`)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or username…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{total} user{total === 1 ? "" : "s"}</p>
            {users.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No users match.</p>}
            {users.map((u) => {
              const st = STATUS_LABEL[u.status] ?? STATUS_LABEL.ACTIVE
              return (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border/60 p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{u.name ?? u.email}</span>
                      {u.role === "SUPER_ADMIN" && <Badge className="bg-purple-600">SUPER_ADMIN</Badge>}
                      {u.role === "ADMIN" && <Badge variant="secondary">ADMIN</Badge>}
                      <Badge variant={st.variant}>{st.label}</Badge>
                      {u.effectiveAccess === "PREMIUM" && <Badge className="bg-yellow-600">Premium</Badge>}
                      {u.effectiveAccess === "PREMIUM_TRIAL" && <Badge variant="outline">Trial</Badge>}
                      {u.effectiveAccess === "PREMIUM_EXPIRED" && <Badge variant="secondary">Trial expired</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {u.email} · Lv {u.level} · {u.totalXP} XP · streak {u.currentStreak} · joined {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {can(meRole, "users.suspend") && u.status === "ACTIVE" && (
                      <>
                        <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { status: "SUSPENDED" }, `${u.email} suspended`)}>
                          <ShieldAlert className="size-3.5 mr-1" /> Suspend
                        </Button>
                        <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { status: "BANNED" }, `${u.email} banned`)}>
                          <Ban className="size-3.5 mr-1" /> Ban
                        </Button>
                      </>
                    )}
                    {(u.status === "SUSPENDED" || u.status === "BANNED") && can(meRole, "users.suspend") && (
                      <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { status: "ACTIVE" }, `${u.email} restored`)}>
                        <RotateCcw className="size-3.5 mr-1" /> Restore
                      </Button>
                    )}
                    {can(meRole, "entitlements.manage") && (
                      <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { plan: "PREMIUM" }, `${u.email} set to Premium plan`)}>
                        <Crown className="size-3.5 mr-1" /> Premium
                      </Button>
                    )}
                    {meRole === "SUPER_ADMIN" && u.role !== "SUPER_ADMIN" && (
                      <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { role: "ADMIN" }, `${u.email} promoted to ADMIN`)}>
                        <UserCog className="size-3.5 mr-1" /> Make admin
                      </Button>
                    )}
                    {can(meRole, "users.roles.manage") && u.role === "ADMIN" && (
                      <Button size="sm" variant="outline" disabled={busyId === u.id} onClick={() => act(u.id, { role: "USER" }, `${u.email} demoted to USER`)}>
                        <ShieldCheck className="size-3.5 mr-1" /> Demote
                      </Button>
                    )}
                    {can(meRole, "users.delete") && u.role === "USER" && u.id !== meId && (
                      <Button size="sm" variant="destructive" disabled={busyId === u.id} onClick={() => remove(u)}>
                        <Trash2 className="size-3.5 mr-1" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
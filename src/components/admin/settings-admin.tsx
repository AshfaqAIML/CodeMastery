"use client"

import * as React from "react"
import { Loader2, Save, Trash2, Plus } from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Setting = {
  key: string
  value: string
  valueType: string
  isSecret: boolean
  group: string
  updatedAt: string
  updatedBy: string | null
}

const GROUPS = ["general", "branding", "premium", "gamification", "certificates", "ai", "notifications", "feature-flags"]

export function SettingsAdmin() {
  const [settings, setSettings] = React.useState<Setting[]>([])
  const [loading, setLoading] = React.useState(true)
  const [group, setGroup] = React.useState<string>("general")
  const [newKey, setNewKey] = React.useState("")
  const [newValue, setNewValue] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const load = React.useCallback(async (g: string) => {
    setLoading(true)
    try {
      const res = await apiFetch<any>(`/api/admin/settings?group=${encodeURIComponent(g)}`)
      setSettings(res.settings ?? [])
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load(group)
  }, [group, load])

  const addSetting = async () => {
    if (!newKey.trim()) return toast.error("Key is required")
    setSaving(true)
    try {
      await apiFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ key: newKey.trim(), value: newValue, group }),
      })
      toast.success("Setting saved")
      setNewKey("")
      setNewValue("")
      load(group)
    } catch (e: any) {
      toast.error(e.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function EditableSettingValue({ setting, onSaved }: { setting: Setting; onSaved: () => void }) {
  const [value, setValue] = React.useState(setting.value)
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await apiFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ key: setting.key, value, valueType: setting.valueType, group: setting.group }),
      })
      toast.success(`${setting.key} updated`)
      onSaved()
    } catch (e: any) {
      toast.error(e.message ?? "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="font-mono text-sm" />
      <Button size="sm" variant="outline" onClick={save} disabled={saving || value === setting.value}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      </Button>
    </div>
  )
}

  const remove = async (s: Setting) => {
    try {
      await apiFetch(`/api/admin/settings?key=${encodeURIComponent(s.key)}`, { method: "DELETE" })
      toast.success(`${s.key} deleted`)
      load(group)
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {GROUPS.map((g) => (
            <Button key={g} size="sm" variant={group === g ? "default" : "outline"} onClick={() => setGroup(g)}>
              {g}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-2">
            {settings.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No settings in this group yet.</p>}
            {settings.map((s) => (
              <div key={s.key} className="rounded-lg border border-border/60 p-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.key}</code>
                  <Badge variant="outline">{s.valueType}</Badge>
                  {s.isSecret && <Badge variant="destructive">secret</Badge>}
                </div>
                {s.isSecret ? (
                  <p className="text-sm font-mono text-muted-foreground">
                    {s.value} <span className="text-[11px]">(managed in environment — not editable here)</span>
                  </p>
                ) : (
                  <EditableSettingValue setting={s} onSaved={() => load(group)} />
                )}
                {!s.isSecret && (
                  <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => remove(s)}>
                    <Trash2 className="size-3.5 mr-1" /> Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 border-t pt-4">
          <Input placeholder="new.setting.key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="font-mono text-sm flex-1" />
          <Input placeholder="value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="font-mono text-sm flex-1" />
          <Button onClick={addSetting} disabled={saving}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />} Add setting
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Settings are operational configuration (branding, limits, feature flags). Secrets such as API keys are managed
          exclusively through environment variables and are never stored or displayed here.
        </p>
      </CardContent>
    </Card>
  )
}
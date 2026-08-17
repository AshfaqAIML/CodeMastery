"use client"

import * as React from "react"
import { BrainCircuit, Loader2, KeyRound } from "lucide-react"
import { apiFetch } from "@/hooks/use-api"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

type AIOverview = {
  enabled: boolean
  activeProvider: string | null
  configuredProvider: string
  keys: Record<string, { configured: boolean; masked: string }>
  models: { openai: string; gemini: string }
  settings: { featureEnabled: boolean; dailyLimit: number; tierAccess: "all" | "premium" }
  usage: { aiQueries: number; aiErrors: number }
}

export function AIAdmin() {
  const [data, setData] = React.useState<AIOverview | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [featureEnabled, setFeatureEnabled] = React.useState(true)
  const [dailyLimit, setDailyLimit] = React.useState(60)
  const [tierAccess, setTierAccess] = React.useState<"all" | "premium">("all")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    apiFetch<any>("/api/admin/ai")
      .then((res) => {
        setData(res.ai)
        setFeatureEnabled(res.ai.settings.featureEnabled)
        setDailyLimit(res.ai.settings.dailyLimit)
        setTierAccess(res.ai.settings.tierAccess)
      })
      .catch((e) => toast.error(e.message ?? "Failed to load AI config"))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await apiFetch("/api/admin/ai", {
        method: "PATCH",
        body: JSON.stringify({ featureEnabled, dailyLimit, tierAccess }),
      })
      toast.success("AI settings saved")
    } catch (e: any) {
      toast.error(e.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : !data ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Unable to load AI configuration.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={data.enabled ? "bg-emerald-600" : "bg-slate-600"}>
                <BrainCircuit className="size-3.5 mr-1" /> {data.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <span className="text-sm">Provider: <strong>{data.configuredProvider}</strong>{data.activeProvider ? ` (active: ${data.activeProvider})` : ""}</span>
              <span className="text-sm">Queries: <strong>{data.usage.aiQueries}</strong> · Errors: <strong>{data.usage.aiErrors}</strong></span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {(Object.entries(data.keys) as [string, { configured: boolean; masked: string }][]).map(([name, k]) => (
                <div key={name} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <KeyRound className="size-3.5" /> {name} key
                  </div>
                  <p className="text-sm font-mono">
                    {k.configured ? k.masked : "not configured"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{k.configured ? "set in environment" : "set via env var"}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-xs">Feature availability</Label>
                <div className="mt-1 flex gap-2">
                  <Button size="sm" variant={featureEnabled ? "default" : "outline"} onClick={() => setFeatureEnabled(true)}>Enabled</Button>
                  <Button size="sm" variant={!featureEnabled ? "destructive" : "outline"} onClick={() => setFeatureEnabled(false)}>Disabled</Button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Daily per-user limit</Label>
                <Input type="number" min={1} max={10000} value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Tier access</Label>
                <div className="mt-1 flex gap-2">
                  <Button size="sm" variant={tierAccess === "all" ? "default" : "outline"} onClick={() => setTierAccess("all")}>All tiers</Button>
                  <Button size="sm" variant={tierAccess === "premium" ? "default" : "outline"} onClick={() => setTierAccess("premium")}>Premium only</Button>
                </div>
              </div>
            </div>

            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />} Save AI settings
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
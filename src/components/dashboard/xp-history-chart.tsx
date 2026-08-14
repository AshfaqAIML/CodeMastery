"use client"

import * as React from "react"
import { TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useXpHistory } from "@/hooks/use-api"

export function XpHistoryChart() {
  const { data, isLoading } = useXpHistory()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-40 skeleton-shimmer rounded" />
        </CardContent>
      </Card>
    )
  }

  const days = data?.days ?? []
  if (days.length === 0) return null

  const maxXP = Math.max(1, ...days.map((d: any) => d.xp))
  const total = data?.total ?? 0
  const avg = data?.avg ?? 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            XP this week
          </span>
          <div className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
            <span>Total: <span className="text-foreground font-medium">{total}</span></span>
            <span>Avg: <span className="text-foreground font-medium">{avg}/day</span></span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-32">
          {days.map((d: any, i: number) => {
            const heightPct = (d.xp / maxXP) * 100
            const isToday = i === days.length - 1
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full flex-1 flex items-end">
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] font-medium bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap">
                      {d.xp} XP
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday ? "bg-primary" : "bg-primary/40 group-hover:bg-primary/60"
                    }`}
                    style={{ height: `${Math.max(heightPct, d.xp > 0 ? 8 : 2)}%`, minHeight: d.xp > 0 ? "6px" : "2px" }}
                  />
                </div>
                <span className={`text-[10px] ${isToday ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
        {total === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            <Zap className="size-3 inline mr-1" />
            Complete tutorials to start earning XP!
          </p>
        )}
      </CardContent>
    </Card>
  )
}

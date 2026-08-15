"use client"

import { Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DailyGoal({ todayXP, dailyXPCap }: { todayXP: number; dailyXPCap: number }) {
  const dailyPct = Math.min(100, Math.round((todayXP / dailyXPCap) * 100))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="size-4 text-primary" /> Daily goal
          </span>
          <span className="text-xs text-muted-foreground">{todayXP}/{dailyXPCap}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${dailyPct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {dailyPct >= 100
            ? "Daily goal reached! Great work. 🎉"
            : `Earn ${dailyXPCap - todayXP} more XP to hit today's cap.`}
        </p>
      </CardContent>
    </Card>
  )
}

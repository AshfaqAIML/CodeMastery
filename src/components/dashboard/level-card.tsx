"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LevelBadge, XPBar } from "@/components/shared/level-badge"

export function LevelCard({ level, totalXP }: { level: number; totalXP: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <LevelBadge level={level} className="size-12 text-base" />
          <div>
            <div className="text-2xl font-bold">Level {level}</div>
            <div className="text-xs text-muted-foreground">{totalXP.toLocaleString()} total XP</div>
          </div>
        </div>
        <XPBar totalXP={totalXP} showMilestones />
      </CardContent>
    </Card>
  )
}

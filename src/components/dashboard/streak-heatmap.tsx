"use client"

import * as React from "react"
import { Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStreakHeatmap } from "@/hooks/use-api"
import { cn } from "@/lib/utils"

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function StreakHeatmap({ currentStreak }: { currentStreak: number }) {
  const { data, isLoading } = useStreakHeatmap()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-32 bg-muted/40 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const cells = data?.cells ?? []
  if (cells.length === 0) return null

  // Arrange cells into weeks (columns), 7 rows each
  const firstDate = new Date(cells[0].date + "T00:00:00")
  const firstWeekday = firstDate.getDay()
  const padded: (typeof cells[0] | null)[] = []
  for (let i = 0; i < firstWeekday; i++) padded.push(null)
  padded.push(...cells)

  const weeks: (typeof cells[0] | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  const monthLabels: { weekIndex: number; label: string }[] = []
  let lastMonth = -1
  weeks.forEach((week, weekIdx) => {
    const firstNonNull = week.find((c) => c !== null)
    if (firstNonNull) {
      const date = new Date(firstNonNull.date + "T00:00:00")
      const month = date.getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex: weekIdx, label: MONTH_LABELS[month] })
        lastMonth = month
      }
    }
  })

  const activeDays = data?.activeDays ?? 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="size-5 text-orange-500" />
            Activity heatmap
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            {activeDays} active {activeDays === 1 ? "day" : "days"} · {currentStreak}d streak
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin">
          <div className="inline-flex flex-col gap-1 min-w-full">
            <div className="flex gap-[3px] pl-6 mb-1">
              {weeks.map((_, weekIdx) => {
                const monthLabel = monthLabels.find((m) => m.weekIndex === weekIdx)
                return (
                  <div key={weekIdx} className="w-[14px] text-[9px] text-muted-foreground">
                    {monthLabel?.label ?? ""}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-[3px]">
              <div className="flex flex-col gap-[3px] pr-1 w-5">
                {DAY_LABELS.map((d, i) => (
                  <div key={i} className="h-[14px] text-[9px] text-muted-foreground flex items-center">
                    {i % 2 === 1 ? d : ""}
                  </div>
                ))}
              </div>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((cell, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={cn(
                        "size-[14px] rounded-[2px] transition-all hover:ring-1 hover:ring-primary/40",
                        !cell && "opacity-0",
                        cell && cell.intensity === 0 && "bg-muted/50",
                        cell && cell.intensity === 1 && "bg-primary/25",
                        cell && cell.intensity === 2 && "bg-primary/45",
                        cell && cell.intensity === 3 && "bg-primary/70",
                        cell && cell.intensity === 4 && "bg-primary"
                      )}
                      title={cell ? `${cell.date}: ${cell.xp} XP` : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-muted-foreground">
              <span>Less</span>
              <div className="w-[14px] h-[14px] rounded-[2px] bg-muted/50" />
              <div className="w-[14px] h-[14px] rounded-[2px] bg-primary/25" />
              <div className="w-[14px] h-[14px] rounded-[2px] bg-primary/45" />
              <div className="w-[14px] h-[14px] rounded-[2px] bg-primary/70" />
              <div className="w-[14px] h-[14px] rounded-[2px] bg-primary" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Flame, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Streak status card showing current streak and when it might break.
 * Calculates based on lastActivityDate — if the user hasn't been active today,
 * shows a warning that the streak is at risk.
 */
export function StreakStatus({
  currentStreak,
  longestStreak,
  lastActivityDate,
}: {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
}) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const isActiveToday = lastActivityDate === today
  const lastWasYesterday = lastActivityDate === yesterday

  let status: "active" | "at-risk" | "broken" = "broken"
  let statusText = "No active streak"
  let statusDesc = "Complete a tutorial to start a streak!"

  if (currentStreak > 0) {
    if (isActiveToday) {
      status = "active"
      statusText = "Streak is safe!"
      statusDesc = "Great job — come back tomorrow to keep it going."
    } else if (lastWasYesterday) {
      status = "at-risk"
      statusText = "Streak at risk!"
      statusDesc = "Complete a tutorial today to maintain your streak."
    } else {
      status = "broken"
      statusText = "Streak broken"
      statusDesc = "Your streak was reset. Start a new one today!"
    }
  }

  const statusColor =
    status === "active"
      ? "oklch(0.62 0.15 162)"
      : status === "at-risk"
      ? "oklch(0.75 0.16 85)"
      : "oklch(0.68 0.2 30)"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame
              className="size-5"
              style={{ color: status === "broken" ? "var(--muted-foreground)" : statusColor }}
            />
            Streak status
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground" aria-label="Streak info">
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-48 text-xs">
                  Streaks reset if you miss a day. Earn XP by reading tutorials or passing quizzes to keep your streak alive.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div
            className="size-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `color-mix(in oklch, ${statusColor} 14%, transparent)`,
              color: statusColor,
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold leading-none">{currentStreak}</div>
              <div className="text-[10px] uppercase tracking-wide opacity-80">days</div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-semibold flex items-center gap-1.5"
              style={{ color: status !== "broken" ? statusColor : undefined }}
            >
              {status === "at-risk" && <AlertCircle className="size-3.5" />}
              {statusText}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{statusDesc}</p>
            {longestStreak > currentStreak && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Personal best: <span className="font-medium text-foreground">{longestStreak} days</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

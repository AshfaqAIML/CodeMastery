"use client"

import { cn } from "@/lib/utils"
import { levelFromXP, xpForLevel } from "@/lib/gamification"

export function LevelBadge({ level, className }: { level: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center size-7 rounded-full text-xs font-bold border-2",
        className
      )}
      style={{
        background: "color-mix(in oklch, var(--primary) 14%, transparent)",
        color: "var(--primary)",
        borderColor: "color-mix(in oklch, var(--primary) 45%, transparent)",
      }}
      title={`Level ${level}`}
    >
      {level}
    </span>
  )
}

export function XPBar({
  totalXP,
  className,
  showLabel = true,
  showMilestones = false,
}: {
  totalXP: number
  className?: string
  showLabel?: boolean
  showMilestones?: boolean
}) {
  const info = levelFromXP(totalXP)
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Level {info.level}</span>
          <span>
            {info.into} / {info.needed} XP
          </span>
        </div>
      )}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(2, info.progress * 100)}%` }}
        />
        {/* Milestone indicators at 25%, 50%, 75% */}
        {showMilestones && (
          <>
            <div className="absolute top-0 bottom-0 left-1/4 w-px bg-background/50" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-background/50" />
            <div className="absolute top-0 bottom-0 left-3/4 w-px bg-background/50" />
          </>
        )}
      </div>
      {showMilestones && (
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>L{info.level}</span>
          <span>L{info.level + 1}</span>
        </div>
      )}
    </div>
  )
}

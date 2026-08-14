"use client"

import { cn } from "@/lib/utils"
import { levelFromXP } from "@/lib/gamification"

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
}: {
  totalXP: number
  className?: string
  showLabel?: boolean
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
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(2, info.progress * 100)}%` }}
        />
      </div>
    </div>
  )
}

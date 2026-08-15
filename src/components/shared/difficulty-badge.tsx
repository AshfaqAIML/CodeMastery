"use client"

import { cn } from "@/lib/utils"
import { DIFFICULTY_META } from "@/lib/gamification"

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: string
  className?: string
}) {
  const meta = DIFFICULTY_META[difficulty] ?? DIFFICULTY_META.beginner
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        className
      )}
      style={{
        color: meta.color,
        background: `color-mix(in oklch, ${meta.color} 12%, transparent)`,
        borderColor: `color-mix(in oklch, ${meta.color} 30%, transparent)`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function SubjectIcon({
  name,
  className,
  color,
}: {
  name?: string
  className?: string
  color?: string
}) {
  const Icon = (lazyIcon(name) as any) ?? defaultIcon
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg size-9",
        className
      )}
      style={{
        background: color ? `color-mix(in oklch, ${color} 18%, transparent)` : undefined,
        color: color ?? "var(--primary)",
      }}
    >
      <Icon className="size-5" />
    </span>
  )
}

import {
  Binary, Code2, Coffee, Cpu, Database, GitBranch, Globe, Layers, Network,
  Brain, Braces, FunctionSquare, Sparkles, Trophy, Route, Footprints, Zap,
  BookOpen, GraduationCap, ClipboardCheck, Award, Flame, Calendar, CalendarDays,
  Rocket, Star, Target, Crown, StickyNote, Server, Cloud, type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Binary, Code2, Coffee, Cpu, Database, GitBranch, Globe, Layers, Network,
  Brain, Braces, FunctionSquare, Sparkles, Trophy, Route, Footprints, Zap,
  BookOpen, GraduationCap, ClipboardCheck, Award, Flame, Calendar, CalendarDays,
  Rocket, Star, Target, Crown, StickyNote, Server, Cloud,
}
const defaultIcon = Code2
function lazyIcon(name?: string) {
  if (!name) return defaultIcon
  return ICON_MAP[name] ?? defaultIcon
}

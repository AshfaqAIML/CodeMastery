"use client"

import { Sparkles, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { useAppStore } from "@/lib/store"

export function Recommendations({ items }: { items: any[] }) {
  const { navigate } = useAppStore()

  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="size-5 text-primary" /> Recommended for you
        </CardTitle>
        <CardDescription className="text-xs">
          Based on what you've been learning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.slice(0, 4).map((r: any) => (
            <button
              key={r.id}
              onClick={() =>
                navigate("tutorial", {
                  subjectSlug: r.subject.slug,
                  tutorialSlug: r.slug,
                })
              }
              className="group flex flex-col gap-2 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all p-3 text-left"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <SubjectIcon
                  name={r.subject.icon}
                  color={r.subject.color}
                  className="size-6 rounded"
                />
                <span className="truncate">{r.subject.name}</span>
              </div>
              <div className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {r.title}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <DifficultyBadge difficulty={r.difficulty} />
                <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="size-3" />{r.estimatedMinutes}m
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

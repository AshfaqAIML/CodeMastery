"use client"

import { ArrowRight, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRelatedTutorials } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"

export function RelatedTutorials({
  subjectSlug,
  tutorialSlug,
}: {
  subjectSlug: string
  tutorialSlug: string
}) {
  const { navigate } = useAppStore()
  const { data, isLoading } = useRelatedTutorials(subjectSlug, tutorialSlug)

  if (isLoading || !data || data.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ArrowRight className="size-5 text-primary rotate-45" />
        Related tutorials
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {data.map((t: any) => (
          <button
            key={t.id}
            onClick={() =>
              navigate("tutorial", {
                subjectSlug: t.subject.slug,
                tutorialSlug: t.slug,
              })
            }
            className="group flex items-start gap-3 rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all p-4 text-left card-lift"
          >
            <SubjectIcon
              name={t.subject.icon}
              color={t.subject.color}
              className="size-10 rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {t.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {t.subject.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <DifficultyBadge difficulty={t.difficulty} />
                <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="size-3" />{t.estimatedMinutes}m
                </span>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

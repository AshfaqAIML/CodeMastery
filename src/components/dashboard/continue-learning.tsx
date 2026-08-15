"use client"

import { Clock, ArrowRight, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { EmptyState } from "@/components/shared/empty-state"
import { useAppStore } from "@/lib/store"

export function ContinueLearning({ items }: { items: any[] }) {
  const { navigate } = useAppStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Continue learning
          </span>
          <Button variant="ghost" size="sm" onClick={() => navigate("browse")}>
            Browse all <ArrowRight className="ml-1 size-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No tutorials in progress"
            description="Start reading a tutorial and pick up right where you left off."
            action={<Button size="sm" onClick={() => navigate("browse")}>Browse tutorials</Button>}
          />
        ) : (
          <div className="space-y-2">
            {items.map((p: any) => (
              <button
                key={p.id}
                onClick={() =>
                  navigate("tutorial", {
                    subjectSlug: p.tutorial.subject.slug,
                    tutorialSlug: p.tutorial.slug,
                  })
                }
                className="w-full flex items-center gap-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all p-3 text-left group"
              >
                <SubjectIcon
                  name={p.tutorial.subject.icon}
                  color={p.tutorial.subject.color}
                  className="size-10 rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {p.tutorial.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-32">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${p.percentRead}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{p.percentRead}%</span>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

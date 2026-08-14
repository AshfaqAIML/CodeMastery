"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Target, Sparkles, Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { useOnboard, useSubjects } from "@/hooks/use-api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const EXPERIENCES = [
  { value: "beginner", label: "Beginner", desc: "New to programming", icon: "🌱" },
  { value: "intermediate", label: "Intermediate", desc: "Some coding experience", icon: "⚡" },
  { value: "advanced", label: "Advanced", desc: "Experienced developer", icon: "🚀" },
] as const

const GOALS = [
  { value: "career", label: "Career growth", desc: "Land a better job", icon: "💼" },
  { value: "interview", label: "Interview prep", desc: "Crack coding interviews", icon: "🎯" },
  { value: "academics", label: "Academics", desc: "Excel in my studies", icon: "📚" },
  { value: "curiosity", label: "Curiosity", desc: "Learn for the joy of it", icon: "✨" },
] as const

export function OnboardingModal({ open, onComplete }: { open: boolean; onComplete: () => void }) {
  const onboard = useOnboard()
  const { data: subjects } = useSubjects({ withCounts: true })
  const [step, setStep] = React.useState(0)
  const [experience, setExperience] = React.useState<string>("beginner")
  const [goal, setGoal] = React.useState<string>("career")
  const [interests, setInterests] = React.useState<string[]>([])

  const toggleInterest = (slug: string) => {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 5 ? [...prev, slug] : prev
    )
  }

  const finish = async () => {
    try {
      await onboard.mutateAsync({ experience, goal })
      toast.success("You're all set! Happy learning 🎉")
      onComplete()
      setStep(0)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save")
    }
  }

  const steps = [
    {
      title: "Welcome to CodeMastery!",
      desc: "Let's personalize your learning journey. This takes less than a minute.",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {EXPERIENCES.map((e) => (
              <button
                key={e.value}
                onClick={() => setExperience(e.value)}
                className={cn(
                  "rounded-xl border p-4 text-center transition-all hover:shadow-sm",
                  experience === e.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="text-2xl mb-1">{e.icon}</div>
                <div className="font-medium text-sm">{e.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{e.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "What's your main goal?",
      desc: "We'll tailor recommendations to help you get there.",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all hover:shadow-sm flex items-start gap-3",
                goal === g.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="text-xl">{g.icon}</span>
              <div>
                <div className="font-medium text-sm">{g.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{g.desc}</div>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Pick your interests",
      desc: "Choose up to 5 subjects to focus on. You can change these later.",
      content: (
        <div className="flex flex-wrap gap-2">
          {(subjects ?? []).slice(0, 16).map((s: any) => {
            const selected = interests.includes(s.slug)
            return (
              <button
                key={s.slug}
                onClick={() => toggleInterest(s.slug)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-all flex items-center gap-1.5",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                {selected && <Check className="size-3" />}
                {s.name}
              </button>
            )
          })}
        </div>
      ),
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onComplete()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="size-5" />
            </div>
            <DialogTitle className="text-lg">{current.title}</DialogTitle>
          </div>
          <DialogDescription>{current.desc}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/50" : "w-4 bg-muted"
              )}
            />
          ))}
        </div>

        <div className="min-h-[180px]">{current.content}</div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step === 0 ? onComplete() : setStep((s) => s - 1))}
          >
            <ArrowLeft className="mr-1.5 size-4" />
            {step === 0 ? "Skip" : "Back"}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</span>
            {isLast ? (
              <Button onClick={finish} disabled={onboard.isPending}>
                {onboard.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                <Sparkles className="mr-1.5 size-4" />
                Start learning
              </Button>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue <ArrowRight className="ml-1.5 size-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

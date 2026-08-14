"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRating, useRateTutorial } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function TutorialRating({ tutorialId }: { tutorialId: string }) {
  const { data: session } = useSession()
  const { data, isLoading } = useRating(tutorialId)
  const rate = useRateTutorial()

  if (!session) return null

  const upvotes = data?.upvotes ?? 0
  const downvotes = data?.downvotes ?? 0
  const userRating = data?.userRating ?? 0

  const onRate = (value: 1 | -1) => {
    // If clicking the same rating, remove it (toggle off)
    const newValue = userRating === value ? 0 : value
    rate.mutate(
      { tutorialId, value: newValue },
      {
        onSuccess: () => {
          if (newValue === 1) toast.success("Thanks for your feedback!")
          else if (newValue === -1) toast.info("Thanks — we'll work on improving this.")
        },
      }
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Was this helpful?</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRate(1)}
        disabled={rate.isPending}
        className={cn(
          "h-8 gap-1.5 px-2.5",
          userRating === 1 && "border-primary bg-primary/10 text-primary hover:bg-primary/15"
        )}
      >
        {rate.isPending && rate.variables?.value === 1 ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ThumbsUp className={cn("size-3.5", userRating === 1 && "fill-current")} />
        )}
        <span className="text-xs font-medium">{upvotes}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRate(-1)}
        disabled={rate.isPending}
        className={cn(
          "h-8 gap-1.5 px-2.5",
          userRating === -1 && "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15"
        )}
      >
        {rate.isPending && rate.variables?.value === -1 ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ThumbsDown className={cn("size-3.5", userRating === -1 && "fill-current")} />
        )}
        <span className="text-xs font-medium">{downvotes}</span>
      </Button>
    </div>
  )
}

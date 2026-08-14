"use client"

import * as React from "react"
import { Share2, Check, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = React.useState(false)

  const onShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/?t=${slug}` : ""
    try {
      if (navigator.share) {
        await navigator.share({ title: `CodeMastery: ${title}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (e: any) {
      if (e.name !== "AbortError") {
        toast.error("Failed to share")
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onShare}
      className="gap-1.5"
      aria-label="Share tutorial"
    >
      {copied ? (
        <Check className="size-4 text-primary" />
      ) : (
        <Share2 className="size-4" />
      )}
      <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
    </Button>
  )
}

"use client"

import * as React from "react"
import { Type, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type FontSize = "sm" | "base" | "lg"

const FONT_CLASSES: Record<FontSize, string> = {
  sm: "text-[15px]",
  base: "text-base",
  lg: "text-[18px]",
}

const STORAGE_KEY = "codemastery-tutorial-font-size"

export function FontSizeControl() {
  const [size, setSize] = React.useState<FontSize>("base")

  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) as FontSize : null
    if (saved && saved in FONT_CLASSES) setSize(saved)
  }, [])

  const cycle = (newSize: FontSize) => {
    setSize(newSize)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newSize)
    }
    // Apply to the tutorial content
    const content = document.querySelector("[data-tutorial-content]")
    if (content) {
      Object.values(FONT_CLASSES).forEach((c) => content.classList.remove(c))
      content.classList.add(FONT_CLASSES[newSize])
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => cycle("sm")}
              aria-label="Small font"
            >
              <Minus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Small font</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => cycle("base")}
              aria-label="Default font"
            >
              <Type className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Default font</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => cycle("lg")}
              aria-label="Large font"
            >
              <Plus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Large font</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

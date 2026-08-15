"use client"

import { ArrowRight } from "lucide-react"

interface QuickLinkProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: number
  onClick: () => void
}

export function QuickLink({ icon: Icon, label, value, onClick }: QuickLinkProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted/60 transition-colors text-sm group"
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1 text-left">{label}</span>
      {value !== undefined && <span className="text-xs text-muted-foreground">{value}</span>}
      <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

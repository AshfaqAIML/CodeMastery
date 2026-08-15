"use client"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  color: string
  extra?: React.ReactNode
}

export function StatCard({ icon: Icon, label, value, color, extra }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className="size-9 rounded-lg flex items-center justify-center"
            style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
          >
            <Icon className="size-5" />
          </span>
          {extra}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  )
}

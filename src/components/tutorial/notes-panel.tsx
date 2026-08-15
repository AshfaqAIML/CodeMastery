"use client"

import * as React from "react"
import { StickyNote, X, Plus, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function NotesPanel({
  notes,
  onCreate,
  onDelete,
  onClose,
}: {
  notes: any[]
  onCreate: (content: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}) {
  const [content, setContent] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const submit = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      await onCreate(content)
      setContent("")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <StickyNote className="size-4 text-primary" /> My notes
            </CardTitle>
            <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Close notes panel">
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a note about this tutorial..."
              className="min-h-20 text-sm"
            />
            <Button size="sm" onClick={submit} disabled={saving || !content.trim()} className="w-full">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              <Plus className="mr-1 size-4" /> Add note
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-2">
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No notes yet. Start writing!
              </p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="group rounded-lg border border-border/60 p-2.5">
                  <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

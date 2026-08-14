"use client"

import * as React from "react"
import { Sparkles, Send, Loader2, X, Bot, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useStudyBuddy, useAICheck } from "@/hooks/use-api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function StudyBuddy({ tutorialId, tutorialTitle }: { tutorialId: string; tutorialTitle: string }) {
  const [open, setOpen] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const { data: aiStatus } = useAICheck()
  const studyBuddy = useStudyBuddy()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const ask = async () => {
    if (!question.trim() || studyBuddy.isPending) return
    const q = question.trim()
    setMessages((m) => [...m, { role: "user", content: q }])
    setQuestion("")
    try {
      const res = await studyBuddy.mutateAsync({ tutorialId, question: q })
      setMessages((m) => [...m, { role: "assistant", content: res.answer }])
    } catch (e: any) {
      toast.error(e.message ?? "Failed to get a response")
      setMessages((m) => m.slice(0, -1))
      setQuestion(q)
    }
  }

  if (!aiStatus?.enabled) return null

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
        aria-label="Ask AI study buddy"
      >
        <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium">Ask AI</span>
      </button>

      {open && (
        <div className="fixed bottom-20 left-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "70vh" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Study Buddy</div>
                <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                  AI tutor for &ldquo;{tutorialTitle.slice(0, 30)}{tutorialTitle.length > 30 ? "..." : ""}&rdquo;
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Ask me anything about this tutorial!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Explain this simply", "Give me an example", "Common mistakes?"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuestion(s)}
                      className="text-xs rounded-full border border-border px-3 py-1 hover:bg-muted/60 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                  <div className={cn(
                    "size-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "user" ? "bg-secondary" : "bg-primary/15 text-primary"
                  )}>
                    {m.role === "user" ? <UserIcon className="size-4" /> : <Bot className="size-4" />}
                  </div>
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm max-w-[80%]",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))
            )}
            {studyBuddy.isPending && (
              <div className="flex gap-2.5">
                <div className="size-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex gap-2 items-end">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    ask()
                  }
                }}
                placeholder="Ask a question..."
                className="min-h-[44px] max-h-32 resize-none text-sm"
                rows={1}
              />
              <Button size="icon" onClick={ask} disabled={!question.trim() || studyBuddy.isPending} className="shrink-0">
                {studyBuddy.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

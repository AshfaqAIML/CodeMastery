"use client"

import * as React from "react"
import {
  Sparkles, Send, Loader2, X, Bot, User as UserIcon,
  BookOpen, Lightbulb, FileText, ListChecks, ArrowRight, GraduationCap,
  Code2, Repeat, Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAICheck, apiFetch, useMe } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_ACTIONS = [
  { id: "explain", label: "Explain", icon: BookOpen, desc: "Explain in simple terms" },
  { id: "simplify", label: "Simplify", icon: Lightbulb, desc: "Break down complex parts" },
  { id: "example", label: "Example", icon: Code2, desc: "Give a practical example" },
  { id: "analogy", label: "Analogy", icon: Compass, desc: "Real-world analogy" },
  { id: "quiz", label: "Quiz Me", icon: ListChecks, desc: "Generate quiz questions" },
  { id: "summarize", label: "Summarize", icon: FileText, desc: "Key takeaways" },
  { id: "next", label: "What's Next", icon: ArrowRight, desc: "Recommend next steps" },
  { id: "code", label: "Explain Code", icon: Code2, desc: "Line-by-line code explanation" },
] as const

export function StudyBuddy({ tutorialId, tutorialTitle }: { tutorialId?: string; tutorialTitle?: string }) {
  const [open, setOpen] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const [loading, setLoading] = React.useState(false)
  const { data: aiStatus } = useAICheck()
  const { status } = useSession()
  const { data: meData } = useMe()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Reset conversation when tutorial changes
  React.useEffect(() => {
    setMessages([])
    setQuestion("")
  }, [tutorialId])

  // Access model: the AI Tutor is a Premium feature (trial users get it,
  // expired/free users see a locked affordance, guests see nothing here —
  // they get sign-up prompts elsewhere). The server enforces regardless.
  const access = meData?.access
  const isPremiumish =
    access?.effectiveAccess === "PREMIUM" ||
    access?.effectiveAccess === "PREMIUM_TRIAL"

  if (!aiStatus?.enabled) return null
  if (status !== "authenticated") return null

  if (!isPremiumish) {
    return (
      <button
        onClick={() => useAppStore.getState().navigate("premium")}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group no-print"
        aria-label="AI Tutor is a Premium feature"
      >
        <Sparkles className="size-5 text-primary group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">AI Tutor — Premium</span>
        <span className="text-[10px] font-semibold rounded-full bg-primary/10 text-primary px-1.5 py-0.5">
          Unlock
        </span>
      </button>
    )
  }

  const ask = async (questionText?: string, action?: string) => {
    const q = (questionText ?? question).trim()
    if (!q || loading) return
    if (!tutorialId) {
      toast.info("The tutorial is still loading. Try again in a moment.")
      return
    }

    const userMsg: Message = { role: "user", content: q }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setQuestion("")
    setLoading(true)

    try {
      const res = await apiFetch<any>("/api/ai/study-buddy", {
        method: "POST",
        body: JSON.stringify({
          tutorialId,
          question: q,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          action,
        }),
      })

      const assistantMsg: Message = { role: "assistant", content: res.answer }
      setMessages([...newMessages, assistantMsg])
    } catch (e: any) {
      toast.error(e.message ?? "AI request failed")
      setMessages(newMessages.slice(0, -1)) // remove the user message on failure
      setQuestion(q) // restore the question
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      ask()
    }
  }

  const clearConversation = () => {
    setMessages([])
    setQuestion("")
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group no-print"
        aria-label="Open AI tutor"
      >
        <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">AI Tutor</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 left-6 z-40 w-[400px] max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col no-print" style={{ maxHeight: "75vh" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">AI Tutor</div>
                <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {tutorialTitle
                    ? `Knows: ${tutorialTitle.slice(0, 30)}${tutorialTitle.length > 30 ? "..." : ""}`
                    : "Loading tutorial..."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
                  title="Clear conversation"
                >
                  Clear
                </button>
              )}
              <Button variant="ghost" size="icon" className="size-7" onClick={() => setOpen(false)} aria-label="Close AI tutor">
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                  <GraduationCap className="size-6" />
                </div>
                <p className="text-sm font-medium mb-1">AI Tutor</p>
                <p className="text-xs text-muted-foreground mb-4">
                  I know this tutorial and your learning progress. Ask me anything!
                </p>
                {/* Quick action chips */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_ACTIONS.slice(0, 6).map((action) => (
                    <button
                      key={action.id}
                      onClick={() => ask(action.desc, action.id)}
                      className="text-xs rounded-full border border-border bg-background hover:bg-muted/60 hover:border-primary/40 transition-all px-2.5 py-1 flex items-center gap-1"
                    >
                      <action.icon className="size-3" />
                      {action.label}
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
                    "rounded-2xl px-3.5 py-2.5 text-sm max-w-[80%] prose-tutorial",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}>
                    {m.role === "assistant" ? (
                      <MarkdownLite content={m.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
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

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this tutorial..."
                className="min-h-[44px] max-h-32 resize-none text-sm"
                rows={1}
                disabled={loading || !tutorialId}
              />
              <Button
                size="icon"
                onClick={() => ask()}
                disabled={!question.trim() || loading || !tutorialId}
                className="shrink-0"
                aria-label="Send question"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex gap-1 overflow-x-auto scrollbar-thin">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => ask(action.desc, action.id)}
                    disabled={loading || !tutorialId}
                    className="text-[10px] rounded-full border border-border px-2 py-0.5 hover:bg-muted/60 hover:border-primary/40 transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
                    title={action.desc}
                  >
                    <action.icon className="size-2.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
              AI uses your tutorial content & learning progress. Verify important info.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Lightweight markdown renderer for AI responses.
 * Supports: code blocks, bold, lists, headings, inline code.
 */
function MarkdownLite({ content }: { content: string }) {
  const parts = React.useMemo(() => parseMarkdown(content), [content])

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.type === "code") {
          return (
            <div key={i} className="my-2 rounded-lg border border-border bg-background/50 overflow-hidden">
              {part.language && (
                <div className="px-3 py-1 border-b border-border bg-muted/30">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{part.language}</span>
                </div>
              )}
              <pre className="p-3 overflow-x-auto scrollbar-thin">
                <code className="text-xs font-mono leading-relaxed">{part.content}</code>
              </pre>
            </div>
          )
        }
        if (part.type === "heading") {
          return <p key={i} className="font-semibold text-sm mt-2">{part.content}</p>
        }
        if (part.type === "list") {
          return (
            <ul key={i} className="space-y-0.5 pl-4">
              {part.items?.map((item, j) => (
                <li key={j} className="text-xs leading-relaxed">• {renderInline(item)}</li>
              ))}
            </ul>
          )
        }
        return <p key={i} className="text-xs leading-relaxed">{renderInline(part.content)}</p>
      })}
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  // Render **bold** and `inline code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="rounded bg-background/50 px-1 py-0.5 text-[0.85em] font-mono text-primary">{part.slice(1, -1)}</code>
    }
    return part
  })
}

type MarkdownPart =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language?: string }
  | { type: "heading"; content: string }
  | { type: "list"; items: string[] }

function parseMarkdown(content: string): MarkdownPart[] {
  const parts: MarkdownPart[] = []
  const lines = content.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith("```")) {
      const language = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      parts.push({ type: "code", content: codeLines.join("\n"), language })
      continue
    }

    // Heading
    if (line.startsWith("### ")) {
      parts.push({ type: "heading", content: line.slice(4) })
      i++
      continue
    }

    // List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2))
        i++
      }
      parts.push({ type: "list", items })
      continue
    }

    // Empty line
    if (line.trim() === "") {
      i++
      continue
    }

    // Regular text
    parts.push({ type: "text", content: line })
    i++
  }

  return parts
}

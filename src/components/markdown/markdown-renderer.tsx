"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useTheme } from "next-themes"
import {
  Check, Copy, Lightbulb, AlertTriangle, Info, BookOpen,
  Target, Flame, Brain, Image as ImageIcon, Terminal, ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Lazy-load the syntax highlighter to reduce initial bundle
const CodeBlock = dynamic(() => import("./code-block"), {
  loading: () => (
    <div className="my-6 rounded-lg border border-border bg-muted/30 h-24 animate-pulse" />
  ),
  ssr: false,
})

// ----------------------------------------------------------------
// CALLOUTS — blockquotes whose first line begins with a known label.
// Supports: tip, warning, note, info, important, best-practice,
// analogy, memory.  Renders with an icon + colored accent that
// adapts to light/dark automatically via color-mix.
// ----------------------------------------------------------------
type CalloutDef = {
  re: RegExp
  icon: any
  label: string
  color: string // oklch hue
}

const CALLOUTS: CalloutDef[] = [
  {
    re: /^(tip|tip:|💡)/i,
    icon: Lightbulb,
    label: "Tip",
    color: "oklch(0.75 0.16 85)",
  },
  {
    re: /^(warning|warning:|⚠️|caution)/i,
    icon: AlertTriangle,
    label: "Warning",
    color: "oklch(0.68 0.2 30)",
  },
  {
    re: /^(note|note:|📝)/i,
    icon: BookOpen,
    label: "Note",
    color: "oklch(0.7 0.13 200)",
  },
  {
    re: /^(info|info:|ℹ️)/i,
    icon: Info,
    label: "Info",
    color: "oklch(0.62 0.15 162)",
  },
  {
    re: /^(important|important:|❗)/i,
    icon: Flame,
    label: "Important",
    color: "oklch(0.65 0.22 25)",
  },
  {
    re: /^(best practice|best-practice|best-practice:|✅)/i,
    icon: Check,
    label: "Best Practice",
    color: "oklch(0.65 0.17 150)",
  },
  {
    re: /^(analogy|analogy:|🔗)/i,
    icon: Target,
    label: "Real-World Analogy",
    color: "oklch(0.68 0.16 280)",
  },
  {
    re: /^(memory|memory:|remember|remember:|🧠)/i,
    icon: Brain,
    label: "Memory Aid",
    color: "oklch(0.62 0.2 320)",
  },
]

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (React.isValidElement(children)) {
    return extractText((children.props as any).children)
  }
  return ""
}

function CalloutBlock({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  for (const c of CALLOUTS) {
    if (c.re.test(text.trim())) {
      const Icon = c.icon
      const cleaned = text.replace(c.re, "").replace(/^\s*[-—:]\s*/, "")
      const bg = `color-mix(in oklch, ${c.color} 12%, transparent)`
      const border = `color-mix(in oklch, ${c.color} 35%, transparent)`
      return (
        <aside
          className="my-6 rounded-xl p-4 flex gap-3 items-start not-prose callout"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          <Icon className="size-5 shrink-0 mt-0.5" style={{ color: c.color }} aria-hidden />
          <div className="flex-1 min-w-0">
            <div
              className="text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: c.color }}
            >
              {c.label}
            </div>
            <div className="text-sm leading-7 text-foreground/90 [&>p]:m-0 [&>p]:mb-2 [&>p:last-child]:mb-0">
              {cleaned || children}
            </div>
          </div>
        </aside>
      )
    }
  }
  // Default blockquote
  return (
    <blockquote className="my-6 border-l-4 border-primary/40 pl-4 py-1 text-muted-foreground italic">
      {children}
    </blockquote>
  )
}

// ----------------------------------------------------------------
// OUTPUT BLOCK — a fenced code block whose language is `output`
// renders as a terminal-style "expected output" panel.
// ----------------------------------------------------------------
function OutputBlock({ code }: { code: string }) {
  return (
    <div className="my-5 rounded-lg overflow-hidden border border-border not-prose output-block">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/70 border-b border-border">
        <Terminal className="size-3.5 text-muted-foreground" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Output
        </span>
      </div>
      <pre className="p-4 overflow-x-auto scrollbar-thin bg-muted/20">
        <code className="text-sm font-mono text-foreground/80 whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  )
}

// ----------------------------------------------------------------
// DIAGRAM / FIGURE PLACEHOLDER — a blockquote that begins with
// "diagram:" or "figure:" renders as a media placeholder card so
// authors can mark where a visual is needed before it's produced.
// ----------------------------------------------------------------
function DiagramPlaceholder({ caption }: { caption: string }) {
  return (
    <figure
      className="my-6 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center not-prose media-placeholder"
      data-media-needed="true"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ImageIcon className="size-6 text-primary" aria-hidden />
        </div>
        <figcaption className="text-sm text-muted-foreground max-w-md">
          <span className="font-semibold text-primary">Diagram:</span> {caption}
        </figcaption>
      </div>
    </figure>
  )
}

// ----------------------------------------------------------------
// INTERVIEW QUESTION — a <details>/<summary> pair.  We render it
// as a styled disclosure so the answer is collapsed by default.
// ----------------------------------------------------------------
function InterviewQuestion({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="my-3 group rounded-lg border border-border bg-muted/20 not-prose interview-question">
      <summary className="cursor-pointer list-none flex items-start gap-2 px-4 py-3 text-sm font-medium select-none">
        <ChevronDown
          className="size-4 mt-0.5 text-muted-foreground transition-transform group-open:rotate-180 shrink-0"
          aria-hidden
        />
        <span>{summary}</span>
      </summary>
      <div className="px-4 pb-4 pt-1 text-sm leading-7 text-foreground/85 border-t border-border/60 mt-1 [&>p]:m-0 [&>p]:mb-2 answer">
        {children}
      </div>
    </details>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="prose-tutorial mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold tracking-tight mb-6 mt-2 scroll-mt-24">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b border-border/60 scroll-mt-24">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 scroll-mt-24">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-4 mb-2 text-foreground/90">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="leading-7 mb-4 text-foreground/90">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 space-y-1.5 pl-1 list-disc pl-6 marker:text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-1.5 list-decimal pl-6 marker:text-muted-foreground">{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-7 text-foreground/90 [&>p]:m-0 [&>p]:mb-1">{children}</li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("#") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => {
            // Special-case: diagram / figure placeholders
            const text = extractText(children).trim()
            const diag = text.match(/^(diagram|figure)\s*:\s*(.+)$/i)
            if (diag) {
              return <DiagramPlaceholder caption={diag[2].trim()} />
            }
            return <CalloutBlock>{children}</CalloutBlock>
          },
          // Style <details>/<summary> authored directly in markdown as
          // interview-question disclosures. We preserve the native <details>
          // toggle behavior (open/close on click) and just add styling.
          // The summary text is rendered natively — no extraction needed.
          details: ({ children, ...props }: any) => (
            <details
              {...props}
              className="my-3 group rounded-lg border border-border bg-muted/20 not-prose interview-question"
            >
              {children}
            </details>
          ),
          summary: ({ children, ...props }: any) => (
            <summary
              {...props}
              className="cursor-pointer list-none flex items-start gap-2 px-4 py-3 text-sm font-medium select-none hover:bg-muted/40 transition-colors"
            >
              <ChevronDown
                className="size-4 mt-0.5 text-muted-foreground transition-transform group-open:rotate-180 shrink-0"
                aria-hidden
              />
              <span className="flex-1">{children}</span>
            </summary>
          ),
          hr: () => <hr className="my-8 border-border" />,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto scrollbar-thin rounded-lg border border-border">
              <table className="w-full text-sm comparison-table">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th scope="col" className="px-4 py-2.5 text-left font-semibold border-b border-border">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-border/60 align-top">{children}</td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/80">{children}</em>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            const codeStr = String(children).replace(/\n$/, "")
            // Output block: ```output ... ```
            if (match && match[1] === "output") {
              return <OutputBlock code={codeStr} />
            }
            if (inline || !match) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono text-primary border border-border/60">
                  {children}
                </code>
              )
            }
            return (
              <CodeBlock language={match[1]} code={codeStr} isDark={isDark} />
            )
          },
          pre: ({ children }: any) => {
            // react-markdown wraps fenced code in <pre><code>; the code
            // renderer above handles the visual styling, so just pass
            // children through without an extra <pre> wrapper.
            return <>{children}</>
          },
          figure: ({ children }: any) => (
            <figure className="my-6">{children}</figure>
          ),
          figcaption: ({ children }: any) => (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">{children}</figcaption>
          ),
          // Give plain <section> a subtle visual rhythm hint.
          section: ({ children, ...props }: any) => (
            <section {...props} className={cn("tutorial-section", props.className)}>{children}</section>
          ),
          aside: ({ children, ...props }: any) => {
            // Allow authored <aside class="callout ..."> to pass through
            return <aside {...props}>{children}</aside>
          },
          nav: ({ children, ...props }: any) => (
            <nav {...props} className={cn("tutorial-nav", props.className)}>{children}</nav>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

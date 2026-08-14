"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { Check, Copy, Lightbulb, AlertTriangle, Info, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const CALLOUT_PATTERNS: { re: RegExp; icon: any; label: string; color: string; bg: string; border: string }[] = [
  {
    re: /^(tip|tip:|💡)/i,
    icon: Lightbulb,
    label: "Tip",
    color: "oklch(0.75 0.16 85)",
    bg: "color-mix(in oklch, oklch(0.75 0.16 85) 12%, transparent)",
    border: "color-mix(in oklch, oklch(0.75 0.16 85) 35%, transparent)",
  },
  {
    re: /^(warning|warning:|⚠️|caution)/i,
    icon: AlertTriangle,
    label: "Warning",
    color: "oklch(0.68 0.2 30)",
    bg: "color-mix(in oklch, oklch(0.68 0.2 30) 12%, transparent)",
    border: "color-mix(in oklch, oklch(0.68 0.2 30) 35%, transparent)",
  },
  {
    re: /^(note|note:|📝)/i,
    icon: BookOpen,
    label: "Note",
    color: "oklch(0.7 0.13 200)",
    bg: "color-mix(in oklch, oklch(0.7 0.13 200) 12%, transparent)",
    border: "color-mix(in oklch, oklch(0.7 0.13 200) 35%, transparent)",
  },
  {
    re: /^(info|info:|ℹ️)/i,
    icon: Info,
    label: "Info",
    color: "oklch(0.62 0.15 162)",
    bg: "color-mix(in oklch, oklch(0.62 0.15 162) 12%, transparent)",
    border: "color-mix(in oklch, oklch(0.62 0.15 162) 35%, transparent)",
  },
]

function extractCalloutText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(extractCalloutText).join("")
  if (React.isValidElement(children)) {
    return extractCalloutText((children.props as any).children)
  }
  return ""
}

function CalloutBlock({ children }: { children: React.ReactNode }) {
  const text = extractCalloutText(children)
  for (const c of CALLOUT_PATTERNS) {
    if (c.re.test(text.trim())) {
      const Icon = c.icon
      // Strip the leading label/prefix from the children
      const cleaned = text.replace(c.re, "").replace(/^\s*[-—:]\s*/, "")
      return (
        <div
          className="my-6 rounded-xl p-4 flex gap-3 items-start not-prose"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon className="size-5 shrink-0 mt-0.5" style={{ color: c.color }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: c.color }}>
              {c.label}
            </div>
            <div className="text-sm leading-7 text-foreground/90 [&>p]:m-0 [&>p]:mb-2">
              {cleaned || children}
            </div>
          </div>
        </div>
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

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="prose-tutorial mx-auto">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold tracking-tight mb-6 mt-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b border-border/60 scroll-mt-24">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 scroll-mt-24">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="leading-7 mb-4 text-foreground/90">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 space-y-1.5 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-1.5 list-decimal pl-6">{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className={cn("leading-7 text-foreground/90 marker:text-muted-foreground")}>
              {children}
            </li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => <CalloutBlock>{children}</CalloutBlock>,
          hr: () => <hr className="my-8 border-border" />,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto scrollbar-thin rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold border-b border-border">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-border/60">{children}</td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            const codeStr = String(children).replace(/\n$/, "")
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ language, code, isDark }: { language: string; code: string; isDark: boolean }) {
  const [copied, setCopied] = React.useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  return (
    <div className="my-6 group relative rounded-lg overflow-hidden border border-border bg-muted/30">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/60 bg-muted/40">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1rem 1.25rem",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

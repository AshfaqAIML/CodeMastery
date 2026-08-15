"use client"

import * as React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Check, Copy } from "lucide-react"

export default function CodeBlock({ language, code, isDark }: { language: string; code: string; isDark: boolean }) {
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

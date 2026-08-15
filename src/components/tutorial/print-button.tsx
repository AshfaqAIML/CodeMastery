"use client"

import * as React from "react"
import { Printer, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PrintButton({ title, subject }: { title: string; subject: string }) {
  const onPrint = () => {
    // Set print title via a temporary element
    const existing = document.querySelector(".print-header")
    if (!existing) {
      const header = document.createElement("div")
      header.className = "print-header"
      header.innerHTML = `
        <h1 style="font-size: 20pt; font-weight: bold; margin: 0;">${title}</h1>
        <p style="font-size: 11pt; color: #666; margin: 0.25rem 0 0 0;">${subject} · CodeMastery</p>
        <p style="font-size: 9pt; color: #999; margin: 0.5rem 0 0 0;">Printed on ${new Date().toLocaleDateString()}</p>
      `
      const main = document.querySelector("main")
      if (main) main.prepend(header)
    }

    toast.info("Opening print dialog...")
    setTimeout(() => {
      window.print()
      // Clean up after print
      setTimeout(() => {
        const h = document.querySelector(".print-header")
        if (h) h.remove()
      }, 500)
    }, 300)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onPrint}
      className="gap-1.5 no-print"
      aria-label="Print or save as PDF"
    >
      <Printer className="size-4" />
      <span className="hidden sm:inline">Print</span>
    </Button>
  )
}

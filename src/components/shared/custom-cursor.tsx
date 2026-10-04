"use client"

import * as React from "react"
import { Hand } from "lucide-react"

/**
 * Animated pointing-hand cursor.
 *
 * On fine-pointer devices (mouse/trackpad), hovering ANY clickable element
 * shows a small hand badge that smoothly trails the cursor, gently bobs,
 * emits an expanding pulse ring, and "presses" on mousedown.
 *
 * - Native cursor is hidden only over clickables (see globals.css), so text
 *   selection, I-beams and touch devices are completely unaffected.
 * - Disabled controls are ignored (native `not-allowed` cursor wins).
 * - `prefers-reduced-motion` disables the bob/ring animations via CSS.
 */
const CLICKABLE_SELECTOR =
  'a, button, summary, label, select, [role="button"], ' +
  'input[type="checkbox"], input[type="radio"], input[type="range"], ' +
  'input[type="submit"], input[type="button"], input[type="reset"], ' +
  'input[type="file"], [data-cursor-pointer]'

export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null)
  const pos = React.useRef({ x: -100, y: -100 })
  const target = React.useRef({ x: -100, y: -100 })
  const [supported, setSupported] = React.useState(false)
  const [on, setOn] = React.useState(false) // hovering a clickable
  const [pressed, setPressed] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    setSupported(true)

    let raf = 0
    const tick = () => {
      // Smooth trailing follow (transform-only, no re-renders)
      pos.current.x += (target.current.x - pos.current.x) * 0.22
      pos.current.y += (target.current.y - pos.current.y) * 0.22
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      const t = e.target as HTMLElement | null
      const hit = t?.closest?.(CLICKABLE_SELECTOR) as HTMLElement | null
      const disabled =
        !!hit && ((hit as HTMLButtonElement).disabled || hit.getAttribute("aria-disabled") === "true")
      setOn((prev) => {
        const next = !!hit && !disabled
        return prev === next ? prev : next
      })
      setVisible(true)
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mousedown", onDown)
    document.addEventListener("mouseup", onUp)
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("mouseup", onUp)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  if (!supported) return null

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="custom-cursor"
      data-on={on && visible}
      data-pressed={pressed && on}
    >
      <span className="custom-cursor-inner">
        <span className="custom-cursor-ring" />
        <span className="custom-cursor-badge">
          <Hand className="size-4" strokeWidth={2.25} />
        </span>
      </span>
    </div>
  )
}

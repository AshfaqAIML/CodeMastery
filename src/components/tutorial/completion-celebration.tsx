"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, X, Zap, Trophy } from "lucide-react"

/**
 * Tutorial completion celebration.
 * Shows a confetti burst + XP earned popup when a tutorial is completed.
 * Respects prefers-reduced-motion.
 */
export function CompletionCelebration({
  show,
  xpAwarded,
  onClose,
  achievementUnlocked,
}: {
  show: boolean
  xpAwarded: number
  achievementUnlocked?: string | null
  onClose: () => void
}) {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  React.useEffect(() => {
    if (show && !reducedMotion) {
      const t = setTimeout(onClose, 5000)
      return () => clearTimeout(t)
    }
  }, [show, reducedMotion, onClose])

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          {!reducedMotion && <ConfettiBurst />}

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 200 }}
              className="relative rounded-2xl border border-border bg-card p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>

              <motion.div
                initial={reducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", damping: 12 }}
                className="size-20 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="size-12 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-1">Tutorial Complete!</h2>
              <p className="text-muted-foreground text-sm mb-5">
                Great work. Keep the momentum going.
              </p>

              {xpAwarded > 0 && (
                <motion.div
                  initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 font-semibold mb-3"
                >
                  <Zap className="size-4 fill-current" />
                  +{xpAwarded} XP
                </motion.div>
              )}

              {achievementUnlocked && (
                <motion.div
                  initial={reducedMotion ? {} : { scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3"
                >
                  <div className="flex items-center gap-2 justify-center text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    <Trophy className="size-4" />
                    Achievement Unlocked!
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {achievementUnlocked}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ConfettiBurst() {
  const pieces = React.useMemo(() => {
    const colors = [
      "oklch(0.62 0.15 162)",
      "oklch(0.75 0.16 85)",
      "oklch(0.7 0.13 200)",
      "oklch(0.68 0.2 305)",
      "oklch(0.68 0.2 30)",
    ]
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1.5,
      color: colors[i % colors.length],
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: "-10vh",
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}

import { create } from "zustand"

export type ViewName =
  | "home"
  | "browse"
  | "subject"
  | "tutorial"
  | "dashboard"
  | "profile"
  | "leaderboard"
  | "achievements"
  | "paths"
  | "search"
  | "admin"
  | "certificates"

export type NavParams = {
  subjectSlug?: string
  tutorialSlug?: string
  pathSlug?: string
  query?: string
  tab?: string
}

export type HistoryEntry = {
  view: ViewName
  params: NavParams
  /**
   * Human-readable label describing the page being left, so a "Return to…"
   * button can show specific context (e.g. the tutorial title).
   * Populated automatically from `setCurrentPageLabel`.
   */
  label?: string
}

/**
 * Non-reactive holder for the currently-visible page label.
 *
 * Views call `setCurrentPageLabel` when they finish loading their data
 * (e.g. the tutorial title). When the user navigates away, `navigate`
 * reads this value and stores it on the history entry it pushes.
 *
 * This is intentionally kept OUTSIDE the reactive Zustand state so that
 * updating it does not trigger re-renders across the app — it is only
 * consumed at the moment a navigation occurs.
 */
let _currentPageLabel: string | undefined = undefined

export function setCurrentPageLabel(label: string | undefined) {
  _currentPageLabel = label || undefined
}

export function getCurrentPageLabel(): string | undefined {
  return _currentPageLabel
}

/**
 * Best-effort human label for a view, used as a fallback when no explicit
 * label was recorded on the history entry (e.g. the user landed directly
 * on a page without the view having set a label yet).
 */
export function viewLabel(view: ViewName): string {
  switch (view) {
    case "home":
      return "home"
    case "browse":
      return "Browse"
    case "subject":
      return "subject"
    case "tutorial":
      return "previous tutorial"
    case "dashboard":
      return "Dashboard"
    case "profile":
      return "Profile"
    case "leaderboard":
      return "Leaderboard"
    case "achievements":
      return "Achievements"
    case "paths":
      return "Learning Paths"
    case "search":
      return "Search"
    case "admin":
      return "Admin"
    case "certificates":
      return "My Certificates"
    default:
      return "previous page"
  }
}

interface AppState {
  view: ViewName
  params: NavParams
  history: HistoryEntry[]
  authModalOpen: boolean
  authMode: "login" | "register"
  searchOpen: boolean
  setView: (view: ViewName, params?: NavParams) => void
  navigate: (view: ViewName, params?: NavParams) => void
  back: () => void
  /** Clear all history (e.g. after sign-out). */
  clearHistory: () => void
  openAuth: (mode?: "login" | "register") => void
  closeAuth: () => void
  setAuthMode: (mode: "login" | "register") => void
  setSearchOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  view: "home",
  params: {},
  history: [],
  authModalOpen: false,
  authMode: "login",
  searchOpen: false,
  setView: (view, params = {}) => set({ view, params }),
  navigate: (view, params = {}) => {
    const { view: curView, params: curParams } = get()
    // Capture the label of the page being left so a "Return to…" button
    // can later show specific context (e.g. the tutorial title).
    const leavingLabel = _currentPageLabel
    set((s) => ({
      view,
      params,
      history: [
        ...s.history,
        { view: curView, params: curParams, label: leavingLabel },
      ].slice(-25),
    }))
    // Reset the label — the destination view will set its own on mount.
    _currentPageLabel = undefined
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  },
  back: () => {
    const hist = get().history
    if (hist.length === 0) {
      set({ view: "home", params: {} })
      return
    }
    const prev = hist[hist.length - 1]
    set({ view: prev.view, params: prev.params, history: hist.slice(0, -1) })
    // Restore the label of the page we are returning to, so a further
    // "Return" from there still has meaningful context.
    _currentPageLabel = prev.label
    if (typeof window !== "undefined") window.scrollTo({ top: 0 })
  },
  clearHistory: () => set({ history: [] }),
  openAuth: (mode = "login") => set({ authModalOpen: true, authMode: mode }),
  closeAuth: () => set({ authModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))

// Helper for non-React contexts
export function navigate(view: ViewName, params?: NavParams) {
  useAppStore.getState().navigate(view, params)
}

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

export type NavParams = {
  subjectSlug?: string
  tutorialSlug?: string
  pathSlug?: string
  query?: string
  tab?: string
}

interface AppState {
  view: ViewName
  params: NavParams
  history: { view: ViewName; params: NavParams }[]
  authModalOpen: boolean
  authMode: "login" | "register"
  searchOpen: boolean
  setView: (view: ViewName, params?: NavParams) => void
  navigate: (view: ViewName, params?: NavParams) => void
  back: () => void
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
    set((s) => ({
      view,
      params,
      history: [...s.history, { view: curView, params: curParams }].slice(-25),
    }))
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  },
  back: () => {
    const hist = get().history
    if (hist.length === 0) {
      set({ view: "home", params: {} })
      return
    }
    const prev = hist[hist.length - 1]
    set({ view: prev.view, params: prev.params, history: hist.slice(0, -1) })
    if (typeof window !== "undefined") window.scrollTo({ top: 0 })
  },
  openAuth: (mode = "login") => set({ authModalOpen: true, authMode: mode }),
  closeAuth: () => set({ authModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))

// Helper for non-React contexts
export function navigate(view: ViewName, params?: NavParams) {
  useAppStore.getState().navigate(view, params)
}

"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, GraduationCap, Sparkles, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { apiFetch } from "@/hooks/use-api"

const GOOGLE_ENABLED = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

function GoogleGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z" />
    </svg>
  )
}

export function AuthModal() {
  const { authModalOpen, authMode, closeAuth, setAuthMode } = useAppStore()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [resetToken, setResetToken] = React.useState<string | null>(null)
  const [sent, setSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)

  const isRegister = authMode === "register"
  const isForgot = authMode === "forgot"
  const isReset = authMode === "reset"

  // Deep link from a reset email: ?auth=reset&token=…
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (params.get("auth") === "reset" && token) {
      setResetToken(token)
      // Scrub the token from the URL so it never lingers in history.
      window.history.replaceState({}, "", window.location.pathname)
      useAppStore.getState().openAuth("reset")
    }
  }, [])

  const register = useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
  })

  const forgotPassword = useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
  })

  const resetPassword = useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: resetToken, password }),
      }),
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await register.mutateAsync()
        toast.success("Account created! Signing you in...")
      }
      if (isForgot) {
        await forgotPassword.mutateAsync()
        setSent(true)
        return
      }
      if (isReset) {
        await resetPassword.mutateAsync()
        toast.success("Password updated! Sign in with your new password.")
        setPassword("")
        setConfirm("")
        setResetToken(null)
        setAuthMode("login")
        return
      }
      const res = await signIn("credentials", { email, password, redirect: false })
      if (!res || res.error) {
        toast.error("Invalid credentials.")
        return
      }
      toast.success("Welcome to CodeMastery!")
      closeAuth()
      setName("")
      setEmail("")
      setPassword("")
      // No page reload: NextAuth broadcasts the session client-side, and
      // React Query refetches /api/me once `status` flips to authenticated —
      // the homepage and header update in place (see HomeView CTA).
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    setGoogleLoading(true)
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/" })
      if (res?.error) {
        if (res.error.includes("OAuthSignin") || res.error.includes("Configuration")) {
          toast.error("Google sign-in is not configured yet. Ask the developer to add GOOGLE_CLIENT_ID.")
        } else if (res.error.includes("AccessDenied")) {
          toast.error("This email is already registered. Use your password, or reset it first.")
        } else {
          toast.error(res.error)
        }
        return
      }
      closeAuth()
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const switchTo = (mode: "login" | "register" | "forgot" | "reset") => {
    setSent(false)
    setAuthMode(mode)
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              {isForgot || isReset ? <KeyRound className="size-5" /> : <GraduationCap className="size-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isRegister ? "Create your account" : isForgot ? "Reset your password" : isReset ? "Choose a new password" : "Welcome back"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isRegister
                  ? "Start learning computer science, free."
                  : isForgot
                    ? "We'll email you a secure reset link."
                    : isReset
                      ? "Your link is valid for one hour."
                      : "Sign in to continue your learning journey."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isForgot && sent ? (
          <div className="space-y-4 pt-2 text-center">
            <CheckCircle2 className="size-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>, a reset link is on its
              way. It expires in one hour.
            </p>
            <p className="text-xs text-muted-foreground">
              (In development the link is printed to the server console.)
            </p>
            <Button variant="outline" className="w-full" onClick={() => switchTo("login")}>
              <ArrowLeft className="size-4 mr-2" /> Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            {!isForgot && !isReset && GOOGLE_ENABLED && (
              <>
                <Button type="button" variant="outline" className="w-full" disabled={googleLoading} onClick={onGoogle}>
                  {googleLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <GoogleGlyph />}
                  <span className="ml-2">Continue with Google</span>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </>
            )}
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </div>
            )}
            {!isReset && (
              <div className="space-y-1.5">
                <Label htmlFor="email">{isForgot ? "Account email" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            )}
            {!isForgot && !isReset && (
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => switchTo("forgot")}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder={isRegister ? "At least 8 characters" : "••••••••"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
              </div>
            )}
            {isReset && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="reset-pw">New password</Label>
                  <Input
                    id="reset-pw"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reset-confirm">Confirm password</Label>
                  <Input
                    id="reset-confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    pattern={password ? password.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : undefined}
                    title="Passwords must match"
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading || (isRegister && (!name || !email || !password))}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isForgot ? "Send reset link" : isReset ? "Update password" : isRegister ? "Create account" : "Sign in"}
            </Button>
            {isForgot && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => switchTo("login")}>
                <ArrowLeft className="size-4 mr-2" /> Back to sign in
              </Button>
            )}
            {!isForgot && !isReset && (
              <div className="text-center text-sm text-muted-foreground">
                {isRegister ? "Already have an account?" : "New to CodeMastery?"}{" "}
                <button
                  type="button"
                  onClick={() => switchTo(isRegister ? "login" : "register")}
                  className="text-primary hover:underline font-medium"
                >
                  {isRegister ? "Sign in" : "Create one"}
                </button>
              </div>
            )}
            {isRegister && (
              <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 mt-0.5 shrink-0 text-primary" />
                <span>
                  By signing up you agree to our terms. Your progress, streaks, and achievements will be saved to your account.
                </span>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
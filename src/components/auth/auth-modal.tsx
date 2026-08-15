"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, GraduationCap, Sparkles } from "lucide-react"
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

export function AuthModal() {
  const { authModalOpen, authMode, closeAuth, setAuthMode } = useAppStore()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isRegister = authMode === "register"

  const register = useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
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
      setTimeout(() => window.location.reload(), 400)
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isRegister ? "Create your account" : "Welcome back"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isRegister
                  ? "Start learning computer science, free."
                  : "Sign in to continue your learning journey."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
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
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
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
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isRegister ? "Create account" : "Sign in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to CodeMastery?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(isRegister ? "login" : "register")}
              className="text-primary hover:underline font-medium"
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </div>
          {isRegister && (
            <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <span>
                By signing up you agree to our terms. Your progress, streaks, and achievements will be saved to your account.
              </span>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

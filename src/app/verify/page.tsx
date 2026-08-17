import { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description: "Look up a CodeMastery certificate by its unique number.",
}

export default async function VerifyHomePage({
  searchParams,
}: {
  searchParams: Promise<{ number?: string }>
}) {
  const { number } = await searchParams
  const clean = number?.trim().toUpperCase()

  if (clean) {
    redirect(`/verify/${encodeURIComponent(clean)}`)
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <ShieldCheck className="size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Verify a certificate</h1>
        <p className="text-muted-foreground mb-8">
          Enter the certificate number printed on your certificate (e.g.{" "}
          <span className="font-mono">CM-2026-000001</span>) to check its status.
        </p>
        <form action="/verify" method="get" className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="text"
            name="number"
            required
            pattern="[Cc][Mm][-_ ]?\d{4}[-_ ]?\d{6}"
            placeholder="CM-2026-000001"
            aria-label="Certificate number"
            className="flex-1 rounded-lg border bg-background px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Verify
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          Verification is public and free — anyone can check a certificate using its number.
        </p>
      </div>
    </main>
  )
}
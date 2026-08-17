import { Metadata } from "next"
import Link from "next/link"
import { lookupPublicCertificate } from "@/lib/certificates/verify"
import { ArrowLeft, Search, ShieldX } from "lucide-react"
import { WebCertificate } from "./web-certificate"

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify a CodeMastery certificate by its unique number.",
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params
  const cert = await lookupPublicCertificate(number)

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to CodeMastery
          </Link>
          <Link href="/verify" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Search className="size-4" /> Verify another
          </Link>
        </div>

        {!cert ? (
          <NotFoundState number={number} />
        ) : (
          <WebCertificate cert={cert} />
        )}
      </div>
    </main>
  )
}

function NotFoundState({ number }: { number: string }) {
  return (
    <div className="rounded-2xl border bg-background p-8 sm:p-12 text-center">
      <div className="mx-auto size-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
        <ShieldX className="size-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Certificate not found</h1>
      <p className="text-muted-foreground mb-1">
        No certificate exists for{" "}
        <span className="font-mono font-semibold text-foreground">{number.toUpperCase()}</span>.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        The number may be mistyped, or this certificate number was never issued.
      </p>
      <form action="/verify" method="get" className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="text"
          name="number"
          placeholder="CM-2026-000001"
          className="flex-1 rounded-lg border bg-background px-3 py-2 font-mono text-sm"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Search again
        </button>
      </form>
    </div>
  )
}
import Link from "next/link"
import { Compass, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        <Compass className="size-8" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        Back to home <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}

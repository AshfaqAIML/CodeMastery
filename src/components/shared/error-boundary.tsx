"use client"

import * as React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="size-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <h3 className="font-semibold text-base mb-1">Something went wrong</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-5">
            An unexpected error occurred. Try reloading the page.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <RefreshCw className="mr-2 size-4" />
            Reload page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

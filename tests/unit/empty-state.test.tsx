import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/shared/empty-state"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="No tutorials yet"
        description="Start learning to see your tutorials here."
      />
    )
    expect(screen.getByText("No tutorials yet")).toBeInTheDocument()
    expect(screen.getByText("Start learning to see your tutorials here.")).toBeInTheDocument()
  })

  it("renders action button when provided", () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="No bookmarks"
        description="Save tutorials to revisit later."
        action={<Button>Browse tutorials</Button>}
      />
    )
    expect(screen.getByText("Browse tutorials")).toBeInTheDocument()
  })

  it("renders without action", () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="Empty"
        description="Nothing here."
      />
    )
    expect(screen.getByText("Empty")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

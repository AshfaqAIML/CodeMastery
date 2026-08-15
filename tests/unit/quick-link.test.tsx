/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { QuickLink } from "@/components/dashboard/quick-link"
import { Bookmark } from "lucide-react"

describe("QuickLink", () => {
  it("renders the label", () => {
    render(<QuickLink icon={Bookmark} label="My bookmarks" onClick={() => {}} />)
    expect(screen.getByText("My bookmarks")).toBeInTheDocument()
  })

  it("renders value when provided", () => {
    render(<QuickLink icon={Bookmark} label="My bookmarks" value={5} onClick={() => {}} />)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(<QuickLink icon={Bookmark} label="My bookmarks" onClick={onClick} />)
    fireEvent.click(screen.getByText("My bookmarks"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

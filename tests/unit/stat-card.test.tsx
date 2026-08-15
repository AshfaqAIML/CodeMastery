import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatCard } from "@/components/dashboard/stat-card"
import { Zap } from "lucide-react"

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard icon={Zap} label="Total XP" value="1,250" color="oklch(0.75 0.16 85)" />)
    expect(screen.getByText("Total XP")).toBeInTheDocument()
    expect(screen.getByText("1,250")).toBeInTheDocument()
  })

  it("renders extra content when provided", () => {
    render(
      <StatCard
        icon={Zap}
        label="Total XP"
        value="1,250"
        color="oklch(0.75 0.16 85)"
        extra={<span data-testid="extra">Level 5</span>}
      />
    )
    expect(screen.getByTestId("extra")).toBeInTheDocument()
  })

  it("renders without extra content", () => {
    render(<StatCard icon={Zap} label="Quizzes" value={5} color="oklch(0.7 0.13 200)" />)
    expect(screen.getByText("Quizzes")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
  })
})

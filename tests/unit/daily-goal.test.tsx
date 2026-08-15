import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DailyGoal } from "@/components/dashboard/daily-goal"

describe("DailyGoal", () => {
  it("shows progress percentage correctly", () => {
    render(<DailyGoal todayXP={250} dailyXPCap={500} />)
    expect(screen.getByText("250/500")).toBeInTheDocument()
  })

  it("shows completion message when goal reached", () => {
    render(<DailyGoal todayXP={500} dailyXPCap={500} />)
    expect(screen.getByText(/Daily goal reached/)).toBeInTheDocument()
  })

  it("shows remaining XP message when not reached", () => {
    render(<DailyGoal todayXP={100} dailyXPCap={500} />)
    expect(screen.getByText(/Earn 400 more XP/)).toBeInTheDocument()
  })
})

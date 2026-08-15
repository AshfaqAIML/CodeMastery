import { describe, it, expect } from "vitest"
import { levelFromXP, xpForLevel, computeStreak, DAILY_XP_CAP } from "@/lib/gamification"

describe("Gamification - Level System", () => {
  describe("xpForLevel", () => {
    it("returns 0 for level 1", () => {
      expect(xpForLevel(1)).toBe(0)
    })

    it("returns 100 for level 2", () => {
      expect(xpForLevel(2)).toBe(100)
    })

    it("returns 300 for level 3", () => {
      expect(xpForLevel(3)).toBe(300)
    })

    it("returns increasing values for higher levels", () => {
      expect(xpForLevel(10)).toBeGreaterThan(xpForLevel(5))
    })
  })

  describe("levelFromXP", () => {
    it("returns level 1 for 0 XP", () => {
      const result = levelFromXP(0)
      expect(result.level).toBe(1)
    })

    it("returns level 1 for 99 XP", () => {
      const result = levelFromXP(99)
      expect(result.level).toBe(1)
    })

    it("returns level 2 for 100 XP", () => {
      const result = levelFromXP(100)
      expect(result.level).toBe(2)
    })

    it("returns level 3 for 300 XP", () => {
      const result = levelFromXP(300)
      expect(result.level).toBe(3)
    })

    it("calculates progress correctly", () => {
      const result = levelFromXP(150)
      expect(result.level).toBe(2)
      expect(result.into).toBe(50)
      expect(result.needed).toBe(200)
      expect(result.progress).toBe(0.25)
    })

    it("handles large XP values", () => {
      const result = levelFromXP(10000)
      expect(result.level).toBeGreaterThan(5)
    })
  })
})

describe("Gamification - Streak System", () => {
  describe("computeStreak", () => {
    it("starts a new streak with no prior activity", () => {
      const result = computeStreak(0, null, "2024-01-01")
      expect(result.streak).toBe(1)
      expect(result.incremented).toBe(true)
      expect(result.isDailyCapReset).toBe(true)
    })

    it("increments streak for consecutive day", () => {
      const result = computeStreak(3, "2024-01-01", "2024-01-02")
      expect(result.streak).toBe(4)
      expect(result.incremented).toBe(true)
    })

    it("resets streak for non-consecutive day", () => {
      const result = computeStreak(5, "2024-01-01", "2024-01-05")
      expect(result.streak).toBe(1)
      expect(result.incremented).toBe(true)
    })

    it("does not increment for same day", () => {
      const result = computeStreak(3, "2024-01-01", "2024-01-01")
      expect(result.streak).toBe(3)
      expect(result.incremented).toBe(false)
      expect(result.isDailyCapReset).toBe(false)
    })
  })

  it("DAILY_XP_CAP is 500", () => {
    expect(DAILY_XP_CAP).toBe(500)
  })
})

import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", true && "conditional", false && "hidden")).toBe("base conditional")
  })

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end")
  })

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})

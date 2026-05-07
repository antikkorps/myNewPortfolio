import { describe, expect, it } from "vitest"
import { formatDate } from "./format"

describe("formatDate", () => {
  it("formats an ISO date in French by default", () => {
    expect(formatDate("2026-05-22")).toBe("22 mai 2026")
  })

  it("respects an explicit locale", () => {
    expect(formatDate("2026-05-22", "en-US")).toBe("May 22, 2026")
  })

  it("handles full ISO timestamps", () => {
    expect(formatDate("2026-05-22T10:30:00Z")).toMatch(/22 mai 2026/)
  })
})

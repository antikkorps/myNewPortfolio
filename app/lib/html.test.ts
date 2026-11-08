import { describe, expect, it } from "vitest"
import { escapeHtml } from "./html"

describe("escapeHtml", () => {
  it("escapes the five markup-significant characters", () => {
    expect(escapeHtml(`<a href="x">Tom & Jerry's</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;"
    )
  })

  it("escapes & first so entities are not double-escaped", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;")
  })

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Bonjour à tous")).toBe("Bonjour à tous")
  })
})

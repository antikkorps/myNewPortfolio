import { describe, expect, it } from "vitest"
import { isValidYoutubeId, toEmbedUrl } from "./youtube"

describe("isValidYoutubeId", () => {
  it("accepts an 11-char [A-Za-z0-9_-] string", () => {
    expect(isValidYoutubeId("dQw4w9WgXcQ")).toBe(true)
    expect(isValidYoutubeId("aB1_aB1-aB1")).toBe(true)
  })

  it("rejects wrong length", () => {
    expect(isValidYoutubeId("dQw4w9WgXc")).toBe(false)
    expect(isValidYoutubeId("dQw4w9WgXcQQ")).toBe(false)
    expect(isValidYoutubeId("")).toBe(false)
  })

  it("rejects forbidden chars", () => {
    expect(isValidYoutubeId("dQw4w9WgXc?")).toBe(false)
    expect(isValidYoutubeId("dQw4w9WgX/Q")).toBe(false)
    expect(isValidYoutubeId("../../etc/p")).toBe(false)
  })

  it("rejects null/undefined", () => {
    expect(isValidYoutubeId(null)).toBe(false)
    expect(isValidYoutubeId(undefined)).toBe(false)
  })
})

describe("toEmbedUrl", () => {
  describe("legitimate inputs", () => {
    it("converts youtu.be short URLs", () => {
      expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })

    it("converts youtu.be with query params (si=...)", () => {
      expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ?si=abc")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })

    it("converts youtube.com/watch?v=...", () => {
      expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })

    it("converts youtube.com/watch with extra params", () => {
      expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=foo&index=2")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })

    it("accepts m.youtube.com", () => {
      expect(toEmbedUrl("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })

    it("normalises an existing /embed/ URL", () => {
      expect(toEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    })
  })

  describe("rejected inputs (security)", () => {
    it("rejects look-alike host evilyoutube.com", () => {
      expect(toEmbedUrl("https://evilyoutube.com/watch?v=dQw4w9WgXcQ")).toBeNull()
    })

    it("rejects suffix-bearing host xyoutube.com", () => {
      expect(toEmbedUrl("https://xyoutube.com/watch?v=dQw4w9WgXcQ")).toBeNull()
    })

    it("rejects subdomain on the wrong base youtu.be.evil.com", () => {
      expect(toEmbedUrl("https://youtu.be.evil.com/dQw4w9WgXcQ")).toBeNull()
    })

    it("rejects unrelated hosts entirely", () => {
      expect(toEmbedUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull()
      expect(toEmbedUrl("https://vimeo.com/watch?v=dQw4w9WgXcQ")).toBeNull()
    })

    it("rejects javascript: and data: schemes", () => {
      expect(toEmbedUrl("javascript:alert(1)")).toBeNull()
      expect(toEmbedUrl("data:text/html,<script>alert(1)</script>")).toBeNull()
    })

    it("rejects malformed URLs", () => {
      expect(toEmbedUrl("not a url")).toBeNull()
      expect(toEmbedUrl("")).toBeNull()
    })

    it("rejects watch URLs without a v parameter", () => {
      expect(toEmbedUrl("https://www.youtube.com/watch")).toBeNull()
    })

    it("rejects watch URLs with an invalid v parameter", () => {
      expect(toEmbedUrl("https://www.youtube.com/watch?v=tooshort")).toBeNull()
      expect(toEmbedUrl("https://www.youtube.com/watch?v=../../etc/pa")).toBeNull()
    })

    it("rejects embed paths with an invalid id", () => {
      expect(toEmbedUrl("https://www.youtube.com/embed/foo")).toBeNull()
      expect(toEmbedUrl("https://www.youtube.com/embed/../etc/pa")).toBeNull()
    })

    it("rejects youtu.be paths with extra segments", () => {
      expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ/extra")).toBeNull()
    })
  })
})

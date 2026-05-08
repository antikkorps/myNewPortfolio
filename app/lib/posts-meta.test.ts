import { describe, expect, it } from "vitest"
import { getNeighborsMeta, getPostMeta, postsMeta, type PostMeta } from "./posts-meta.server"

describe("postsMeta", () => {
  it("loads at least one post", () => {
    expect(postsMeta.length).toBeGreaterThan(0)
  })

  it("filters out drafts", () => {
    expect(postsMeta.every((p) => p.draft !== true)).toBe(true)
  })

  it("sorts by date descending (newest first)", () => {
    for (let i = 1; i < postsMeta.length; i++) {
      expect(postsMeta[i - 1].date.localeCompare(postsMeta[i].date)).toBeGreaterThanOrEqual(0)
    }
  })

  it("each post has the required fields", () => {
    for (const p of postsMeta) {
      expect(p.slug.length).toBeGreaterThan(0)
      expect(p.title.length).toBeGreaterThan(0)
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}/)
      expect(p.description.length).toBeGreaterThan(0)
      expect(Array.isArray(p.tags)).toBe(true)
      expect(p.readingTime).toBeGreaterThanOrEqual(1)
    }
  })

  it("dates are valid", () => {
    for (const p of postsMeta) {
      expect(Number.isNaN(new Date(p.date).getTime())).toBe(false)
    }
  })

  it("slugs are unique", () => {
    const slugs = postsMeta.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe("getPostMeta", () => {
  it("returns a post by slug", () => {
    const first = postsMeta[0]
    expect(getPostMeta(first.slug)).toEqual(first)
  })

  it("returns undefined for unknown slug", () => {
    expect(getPostMeta("does-not-exist")).toBeUndefined()
  })
})

describe("getNeighborsMeta", () => {
  it("returns null/null when slug unknown", () => {
    expect(getNeighborsMeta("nope")).toEqual({ prev: null, next: null })
  })

  it("returns null next for the most recent post", () => {
    const newest = postsMeta[0]
    const { next } = getNeighborsMeta(newest.slug)
    expect(next).toBeNull()
  })

  it("returns null prev for the oldest post", () => {
    const oldest = postsMeta[postsMeta.length - 1]
    const { prev } = getNeighborsMeta(oldest.slug)
    expect(prev).toBeNull()
  })

  it("the prev of an article is older than itself", () => {
    if (postsMeta.length < 2) return
    const middle = postsMeta[Math.floor(postsMeta.length / 2)]
    const { prev } = getNeighborsMeta(middle.slug)
    expect(prev).not.toBeNull()
    expect((prev as PostMeta).date.localeCompare(middle.date)).toBeLessThanOrEqual(0)
  })

  it("the next of an article is newer than itself", () => {
    if (postsMeta.length < 2) return
    const middle = postsMeta[Math.floor(postsMeta.length / 2)]
    const { next } = getNeighborsMeta(middle.slug)
    if (next) {
      expect(next.date.localeCompare(middle.date)).toBeGreaterThanOrEqual(0)
    }
  })
})

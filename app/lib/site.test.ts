import { describe, expect, it } from "vitest"
import { AUTHOR, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, ogImageForSlug } from "./site"

describe("site constants", () => {
  it("SITE_URL is an https URL with no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https:\/\//)
    expect(SITE_URL.endsWith("/")).toBe(false)
  })

  it("SITE_NAME is a non-empty string", () => {
    expect(SITE_NAME.length).toBeGreaterThan(0)
  })

  it("SITE_DESCRIPTION is a non-empty string", () => {
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0)
  })

  it("OG_IMAGE is a root-relative path", () => {
    expect(OG_IMAGE.startsWith("/")).toBe(true)
  })

  it("AUTHOR has the expected fields", () => {
    expect(AUTHOR.name.length).toBeGreaterThan(0)
    expect(AUTHOR.email).toMatch(/@/)
    expect(AUTHOR.github.length).toBeGreaterThan(0)
    expect(AUTHOR.url).toBe(SITE_URL)
  })
})

describe("ogImageForSlug", () => {
  it("returns the OG path with an encoded slug query", () => {
    expect(ogImageForSlug("hello")).toBe("/og.png?slug=hello")
  })

  it("encodes special characters in the slug", () => {
    expect(ogImageForSlug("hello world")).toBe("/og.png?slug=hello%20world")
    expect(ogImageForSlug("été")).toBe("/og.png?slug=%C3%A9t%C3%A9")
  })
})

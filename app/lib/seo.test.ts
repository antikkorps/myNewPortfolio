import { describe, expect, it } from "vitest"
import { pageMeta } from "./seo"
import { OG_IMAGE, SITE_NAME, SITE_URL } from "./site"

describe("pageMeta", () => {
  const result = pageMeta({
    title: "Test",
    description: "Une description de test.",
    path: "/test",
  })

  function findMeta(predicate: (m: Record<string, unknown>) => boolean) {
    return result.find((entry) => predicate(entry as Record<string, unknown>))
  }

  it("emits a suffixed title", () => {
    const titleEntry = findMeta((m) => "title" in m) as { title: string } | undefined
    expect(titleEntry?.title).toBe(`Test — ${SITE_NAME}`)
  })

  it("emits a description", () => {
    const desc = findMeta(
      (m) => m.name === "description"
    ) as { content: string } | undefined
    expect(desc?.content).toBe("Une description de test.")
  })

  it("emits a canonical link with absolute URL", () => {
    const canonical = findMeta(
      (m) => m.tagName === "link" && m.rel === "canonical"
    ) as { href: string } | undefined
    expect(canonical?.href).toBe(`${SITE_URL}/test`)
  })

  it("emits og:title, og:description, og:url, og:image", () => {
    const ogTitle = findMeta((m) => m.property === "og:title") as
      | { content: string }
      | undefined
    const ogDesc = findMeta((m) => m.property === "og:description") as
      | { content: string }
      | undefined
    const ogUrl = findMeta((m) => m.property === "og:url") as
      | { content: string }
      | undefined
    const ogImage = findMeta((m) => m.property === "og:image") as
      | { content: string }
      | undefined
    expect(ogTitle?.content).toBe(`Test — ${SITE_NAME}`)
    expect(ogDesc?.content).toBe("Une description de test.")
    expect(ogUrl?.content).toBe(`${SITE_URL}/test`)
    expect(ogImage?.content).toBe(`${SITE_URL}${OG_IMAGE}`)
  })

  it("emits Twitter card meta", () => {
    const card = findMeta((m) => m.name === "twitter:card") as
      | { content: string }
      | undefined
    expect(card?.content).toBe("summary_large_image")
  })

  it("uses a custom image override when provided", () => {
    const r = pageMeta({
      title: "X",
      description: "Y",
      path: "/x",
      image: "/og-custom.png",
    })
    const ogImage = r.find(
      (m) => (m as Record<string, unknown>).property === "og:image"
    ) as { content: string } | undefined
    expect(ogImage?.content).toBe(`${SITE_URL}/og-custom.png`)
  })
})

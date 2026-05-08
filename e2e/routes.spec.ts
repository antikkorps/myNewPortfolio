import { expect, test } from "@playwright/test"

const ROUTES_200 = [
  "/",
  "/projets",
  "/tech-stacks",
  "/a-propos",
  "/contact",
  "/blog",
  "/blog?q=cli",
  "/blog?page=2",
  "/blog/gotk-proxy-cli-llm",
  "/blog/archi-forgejo-distribuee",
  "/blog/tags/forgejo",
  "/sitemap.xml",
  "/blog/rss.xml",
  "/robots.txt",
  "/og/default.png",
  "/og/archi-forgejo-distribuee.png",
  "/favicon.png",
]

const ROUTES_404 = ["/blog/inexistant", "/blog/tags/inexistant", "/route-cassee"]

test.describe("HTTP status", () => {
  for (const path of ROUTES_200) {
    test(`GET ${path} → 200`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
    })
  }

  for (const path of ROUTES_404) {
    test(`GET ${path} → 404`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status(), path).toBe(404)
    })
  }
})

test.describe("SEO basics", () => {
  test("home has title, description, canonical", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Dev2Go/)
    const desc = await page.locator('meta[name="description"]').getAttribute("content")
    expect(desc).toBeTruthy()
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href")
    expect(canonical).toMatch(/^https:\/\//)
  })

  test("home has Person + WebSite JSON-LD", async ({ page }) => {
    await page.goto("/")
    const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = ldScripts
      .map((s) => {
        try {
          return JSON.parse(s)["@type"]
        } catch {
          return null
        }
      })
      .filter(Boolean)
    expect(types).toContain("Person")
    expect(types).toContain("WebSite")
  })

  test("article has BlogPosting + BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/blog/gotk-proxy-cli-llm")
    const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = ldScripts
      .map((s) => {
        try {
          return JSON.parse(s)["@type"]
        } catch {
          return null
        }
      })
      .filter(Boolean)
    expect(types).toContain("BlogPosting")
    expect(types).toContain("BreadcrumbList")
  })

  test("og:image meta is present and absolute", async ({ page }) => {
    await page.goto("/blog/gotk-proxy-cli-llm")
    const og = await page.locator('meta[property="og:image"]').getAttribute("content")
    expect(og).toMatch(/^https:\/\/.+\/og\/.+\.png$/)
  })

  test("robots meta allows indexing site-wide", async ({ page }) => {
    await page.goto("/")
    const robots = await page.locator('meta[name="robots"]').getAttribute("content")
    expect(robots).toContain("index")
    expect(robots).toContain("max-image-preview:large")
  })
})

test.describe("Sitemap content", () => {
  test("sitemap is valid XML and lists every published article", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    expect(res.status()).toBe(200)
    const xml = await res.text()
    expect(xml).toMatch(/^<\?xml/)
    expect(xml).toContain("<urlset")

    // Check the article slugs we know about
    const expected = [
      "/blog/bienvenue",
      "/blog/construire-un-blog-mdx-remix",
      "/blog/github-2026-alternatives",
      "/blog/archi-forgejo-distribuee",
      "/blog/gotk-proxy-cli-llm",
    ]
    for (const url of expected) {
      expect(xml).toContain(url)
    }
  })
})

test.describe("Search and pagination", () => {
  test("?q=GoTK highlights the match in titles", async ({ page }) => {
    await page.goto("/blog?q=GoTK")
    const marks = await page.locator("mark").count()
    expect(marks).toBeGreaterThan(0)
    const firstMark = await page.locator("mark").first().textContent()
    expect(firstMark?.toLowerCase()).toContain("gotk")
  })

  test("pagination shows the right page indicator", async ({ page }) => {
    await page.goto("/blog?page=2")
    await expect(page.getByText(/Page 2/)).toBeVisible()
  })

  test("404 from /blog/inexistant", async ({ page }) => {
    const res = await page.goto("/blog/inexistant")
    expect(res?.status()).toBe(404)
    await expect(page.getByText(/Page introuvable/i)).toBeVisible()
  })
})

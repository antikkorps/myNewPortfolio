import { postsMeta } from "~/lib/posts-meta.server"
import { SITE_URL } from "~/lib/site"

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly"
  priority: string
}

function toIso(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString()
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { loc: "/", changefreq: "monthly", priority: "1.0" },
  { loc: "/projets", changefreq: "monthly", priority: "0.8" },
  { loc: "/tech-stacks", changefreq: "monthly", priority: "0.6" },
  { loc: "/a-propos", changefreq: "yearly", priority: "0.7" },
  { loc: "/contact", changefreq: "yearly", priority: "0.6" },
  { loc: "/blog", changefreq: "weekly", priority: "0.9" },
]

export async function loader() {
  const now = new Date().toISOString()

  const staticUrls = STATIC_ENTRIES.map((e) => {
    const lastmod = e.loc === "/blog" && postsMeta[0] ? toIso(postsMeta[0].date) : now
    return `<url>
  <loc>${SITE_URL}${e.loc}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${e.changefreq}</changefreq>
  <priority>${e.priority}</priority>
</url>`
  }).join("\n")

  const postUrls = postsMeta
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const ogImage = `${SITE_URL}/og.png?slug=${p.slug}`
      return `<url>
  <loc>${url}</loc>
  <lastmod>${toIso(p.date)}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <image:image>
    <image:loc>${ogImage}</image:loc>
    <image:title>${p.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>
  </image:image>
</url>`
    })
    .join("\n")

  // Tag pages — distinct tags, lowercased
  const tags = Array.from(
    new Set(
      postsMeta.flatMap((p) => (p.tags ?? []).map((t) => t.toLowerCase()))
    )
  )
  const tagUrls = tags
    .map(
      (tag) => `<url>
  <loc>${SITE_URL}/blog/tags/${encodeURIComponent(tag)}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
</url>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${postUrls}
${tagUrls}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

import { postsMeta as posts } from "~/lib/posts-meta.server"
import { SITE_URL } from "~/lib/site"

const STATIC_PATHS = [
  "/",
  "/projets",
  "/tech-stacks",
  "/a-propos",
  "/contact",
  "/blog",
]

export async function loader() {
  const staticUrls = STATIC_PATHS.map(
    (path) =>
      `<url><loc>${SITE_URL}${path}</loc><changefreq>monthly</changefreq></url>`
  ).join("")

  const postUrls = posts
    .map(
      (p) =>
        `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq></url>`
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${postUrls}</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

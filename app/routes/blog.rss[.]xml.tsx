import { escapeHtml } from "~/lib/html"
import { postsMeta as posts } from "~/lib/posts-meta.server"
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "~/lib/site"

export async function loader() {
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const pubDate = new Date(p.date).toUTCString()
      const categories = (p.tags ?? []).map((t) => `<category>${escapeHtml(t)}</category>`).join("")
      return `<item>
  <title>${escapeHtml(p.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${escapeHtml(p.description)}</description>
  ${categories}
</item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeHtml(SITE_NAME)}</title>
<link>${SITE_URL}/blog</link>
<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
<description>${escapeHtml(SITE_DESCRIPTION)}</description>
<language>fr-FR</language>
<copyright>${escapeHtml(AUTHOR.name)}</copyright>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

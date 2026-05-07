import { OG_IMAGE, SITE_NAME, SITE_URL } from "./site"

interface PageMetaInput {
  title: string
  description: string
  path: string
  image?: string
}

export function pageMeta({ title, description, path, image }: PageMetaInput) {
  const fullTitle = `${title} — ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const ogImage = `${SITE_URL}${image ?? OG_IMAGE}`
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ]
}

// Component-only access to MDX articles. Used by /blog/$slug (client + server).
// Does NOT include frontmatter or raw text — that lives in posts-meta.server.ts
// and only flows to the client via loader data.

import type { ComponentType } from "react"

const componentModules = import.meta.glob<{ default: ComponentType }>(
  "../content/blog/*.mdx",
  { eager: true }
)

export function componentForSlug(slug: string): ComponentType | null {
  const path = `../content/blog/${slug}.mdx`
  return componentModules[path]?.default ?? null
}

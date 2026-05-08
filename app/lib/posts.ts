// Component-only access to MDX articles. Used by /blog/$slug (client + server).
// Does NOT include frontmatter or raw text — that lives in posts-meta.server.ts
// and only flows to the client via loader data.
//
// Glob is non-eager: each MDX becomes its own dynamic import, Vite emits a
// chunk per article, and the /blog/$slug entry only ships the article being
// read. We wrap the loader in React.lazy and the route renders the component
// inside <Suspense> so SSR streams the article into the response.

import { lazy, type ComponentType, type LazyExoticComponent } from "react"

const componentModules = import.meta.glob<{ default: ComponentType }>(
  "../content/blog/*.mdx"
)

export function componentForSlug(
  slug: string
): LazyExoticComponent<ComponentType> | null {
  const path = `../content/blog/${slug}.mdx`
  const loader = componentModules[path]
  if (!loader) return null
  return lazy(loader as () => Promise<{ default: ComponentType }>)
}

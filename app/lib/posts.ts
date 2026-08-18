// Component-only access to MDX articles. Used by /blog/$slug (client + server).
// Does NOT include frontmatter or raw text — that lives in posts-meta.server.ts
// and only flows to the client via loader data.
//
// Glob is non-eager: each MDX becomes its own dynamic import, Vite emits a
// chunk per article, and the /blog/$slug entry only ships the article being
// read. We wrap the loader in React.lazy, and the route falls back to
// <Suspense> only for the articles that are not resolved yet — see
// isComponentReady below.

import { lazy, type ComponentType, type LazyExoticComponent } from "react"

const componentModules = import.meta.glob<{ default: ComponentType }>("../content/blog/*.mdx")

// Modules already loaded, rendered synchronously so <Suspense> never triggers.
const loaded = new Map<string, ComponentType>()
// One lazy wrapper per article: creating a fresh one on every render would
// restart it in its pending state and suspend again.
const wrappers = new Map<string, LazyExoticComponent<ComponentType>>()

const pathForSlug = (slug: string) => `../content/blog/${slug}.mdx`

export function componentForSlug(slug: string): ComponentType | null {
  const path = pathForSlug(slug)
  const loader = componentModules[path]
  if (!loader) return null

  const ready = loaded.get(path)
  if (ready) return ready

  let wrapper = wrappers.get(path)
  if (!wrapper) {
    wrapper = lazy(loader as () => Promise<{ default: ComponentType }>)
    wrappers.set(path, wrapper)
  }
  return wrapper
}

// True once the article module is resolved, i.e. componentForSlug returns it
// synchronously and the route can render it without a <Suspense> boundary.
export function isComponentReady(slug: string): boolean {
  return loaded.has(pathForSlug(slug))
}

// Resolves an article module up front. Awaited by the route loader before SSR
// and by entry.client before hydration, so the article is part of the HTML
// shell instead of arriving after it (a ~0.45 layout shift on a long post).
export async function preloadComponentForSlug(slug: string): Promise<void> {
  const path = pathForSlug(slug)
  const loader = componentModules[path]
  if (!loader || loaded.has(path)) return
  const mod = await loader()
  loaded.set(path, mod.default)
}

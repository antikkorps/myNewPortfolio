import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { preloadComponentForSlug } from "~/lib/posts"

// Matches /blog/<slug> only — /blog, /blog/tags/<tag> and deeper paths fall through.
const ARTICLE_PATH = /^\/blog\/([^/]+)\/?$/

// The article chunk is loaded before hydrating so the route can render it
// synchronously. Hydrating first would make React fall back to "Chargement de
// l'article…" over text the server already sent, blanking the post until the
// chunk arrives. The page stays readable meanwhile — it is server-rendered.
async function hydrate() {
  const slug = window.location.pathname.match(ARTICLE_PATH)?.[1]
  if (slug) {
    try {
      await preloadComponentForSlug(decodeURIComponent(slug))
    } catch {
      // Not fatal: <Suspense> still covers it, we just lose the head start.
    }
  }

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    )
  })
}

hydrate()

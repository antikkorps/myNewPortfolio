// App.tsx
import type { LinksFunction, MetaFunction } from "react-router"
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router"
import CursorHalo from "./components/CursorHalo"
import Navbar from "./components/Navbar"
import { ThemeProvider, themeScript } from "./contexts/ThemeContext"
import { AUTHOR, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site"

import "./tailwind.css"

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Preload Lora 400 (latin) — used as body font on /blog articles, avoids FOUT
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: "https://fonts.gstatic.com/s/lora/v36/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqg.woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  },
  { rel: "icon", type: "image/png", href: "/favicon.png" },
  { rel: "apple-touch-icon", href: "/favicon.png" },
  {
    rel: "alternate",
    type: "application/rss+xml",
    title: "Blog — Dev2Go",
    href: "/blog/rss.xml",
  },
]

export const meta: MetaFunction = () => {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    url: SITE_URL,
    email: `mailto:${AUTHOR.email}`,
    sameAs: [`https://github.com/${AUTHOR.github}`],
    jobTitle: "Développeur web full-stack",
  }
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-FR",
  }
  return [
    { title: SITE_NAME },
    { name: "description", content: SITE_DESCRIPTION },
    { name: "author", content: AUTHOR.name },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "fr_FR" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${SITE_URL}${OG_IMAGE}` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: `${SITE_URL}${OG_IMAGE}` },
    { name: "theme-color", content: "#0d0d0d" },
    { "script:ld+json": personJsonLd },
    { "script:ld+json": siteJsonLd },
  ]
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isBlog = location.pathname.startsWith("/blog")

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body
        suppressHydrationWarning={true}
        className="transition-colors duration-300 bg-gray-50 dark:bg-neutral-900"
      >
        <ThemeProvider>
          <Navbar />
          {!isBlog && <CursorHalo />}
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default App

export function ErrorBoundary() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404
  const status = isRouteErrorResponse(error) ? error.status : 500

  return (
    <Layout>
      <main className="min-h-screen pt-32 pb-24 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-xl px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Erreur {status}
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {is404 ? "Page introuvable" : "Une erreur est survenue"}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            {is404
              ? "Cette page n'existe pas ou plus. Peut-être un lien obsolète, ou une faute de frappe dans l'URL."
              : "Quelque chose s'est mal passé côté serveur. Réessayez dans un moment ou revenez à l'accueil."}
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Accueil
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              Voir le blog
            </Link>
          </div>
          {!isRouteErrorResponse(error) && error instanceof Error ? (
            <details className="mt-10 text-left text-xs text-neutral-500">
              <summary className="cursor-pointer">Détails techniques</summary>
              <pre className="mt-3 overflow-x-auto rounded-md bg-neutral-100 p-3 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {error.message}
              </pre>
            </details>
          ) : null}
        </div>
      </main>
    </Layout>
  )
}

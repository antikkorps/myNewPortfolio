// App.tsx
import type { LinksFunction, MetaFunction } from "react-router"
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router"
import { Analytics } from "@vercel/analytics/react"
import CursorHalo from "./components/CursorHalo"
import Navbar from "./components/Navbar"
import { ThemeProvider, themeScript } from "./contexts/ThemeContext"
import { AUTHOR, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site"

// Preload only the latin subset of each variable font so LCP doesn't wait
// for the 60KB CSS to parse before discovering the woff2. Other subsets
// (cyrillic, greek, vietnamese…) stay declared in CSS but are fetched on
// demand thanks to unicode-range.
import interLatinUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url"
import loraLatinUrl from "@fontsource-variable/lora/files/lora-latin-wght-normal.woff2?url"

import "./tailwind.css"

export const links: LinksFunction = () => [
  // Fonts are self-hosted via @fontsource-variable/{inter,lora} imported in
  // tailwind.css — no Google Fonts preconnect, no third-party round-trip.
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: interLatinUrl,
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: loraLatinUrl,
    crossOrigin: "anonymous",
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

// Per-route meta (title / description / canonical / OG / Twitter / JSON-LD
// for the page itself). Anything that should appear on EVERY page, regardless
// of route, lives in Layout below as static tags — RR7 child meta exports
// override the parent's by default, so we cannot rely on this function for
// site-wide tags.
export const meta: MetaFunction = () => {
  const ogImageUrl = `${SITE_URL}${OG_IMAGE}`
  return [
    { title: SITE_NAME },
    { name: "description", content: SITE_DESCRIPTION },
    { tagName: "link", rel: "canonical", href: SITE_URL },
    { property: "og:title", content: SITE_NAME },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:url", content: SITE_URL },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:secure_url", content: ogImageUrl },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${SITE_NAME} — illustration` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: SITE_NAME },
    { name: "twitter:description", content: SITE_DESCRIPTION },
    { name: "twitter:image", content: ogImageUrl },
    { name: "twitter:image:alt", content: `${SITE_NAME} — illustration` },
  ]
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR.name,
  url: SITE_URL,
  email: `mailto:${AUTHOR.email}`,
  image: `${SITE_URL}/favicon.png`,
  jobTitle: "Architecte cloud, développeur web full-stack",
  sameAs: [`https://github.com/${AUTHOR.github}`, ...(AUTHOR.linkedin ? [AUTHOR.linkedin] : [])],
  knowsAbout: [
    "Architecture cloud",
    "Logiciel santé",
    "TypeScript",
    "React Router",
    "Vue.js",
    "Go",
    "Rust",
    "Self-hosting",
    "Security by design",
  ],
}

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Dev2Go",
  url: SITE_URL,
  inLanguage: "fr-FR",
  author: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
}

// Layout is the document-level wrapper. React Router v7 automatically uses
// it to wrap the default export AND the ErrorBoundary, which keeps styles +
// fonts attached when navigating away from an error state.
export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isBlog = location.pathname.startsWith("/blog")

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Site-wide meta — these appear on EVERY page regardless of route,
            because RR7 child meta exports replace the parent's by default. */}
        <meta name="author" content={AUTHOR.name} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
        <meta name="theme-color" content="#0d0d0d" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="fr_FR" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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
        <Analytics />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404
  const status = isRouteErrorResponse(error) ? error.status : 500

  // The thrown Response carries its own HTTP status (404 / 500), which is the
  // canonical signal Google uses to skip indexing. We do NOT emit a noindex
  // meta because RR7 doesn't allow children to inject head tags here, and
  // the status code is already authoritative for SEO purposes.

  return (
    <main className="min-h-screen pt-32 pb-24 bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Erreur {status}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {is404 ? "Page introuvable" : "Une erreur est survenue"}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {is404
            ? "Cette page n'existe pas ou plus. Peut-être un lien obsolète, ou une faute de frappe dans l'URL."
            : "Quelque chose s'est mal passé côté serveur. Réessayez dans un moment ou revenez à l'accueil."}
        </p>
        <div className="mt-10 flex justify-center gap-3">
          {/* Plain <a> instead of <Link> on the error page: forces a full reload,
              which guarantees a clean route + style state. Client-side nav
              from React Router v7 ErrorBoundary can leave the document in an
              inconsistent CSS state on some transitions. */}
          <a
            href="/"
            className="inline-flex items-center rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Accueil
          </a>
          <a
            href="/blog"
            className="inline-flex items-center rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700"
          >
            Voir le blog
          </a>
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
  )
}

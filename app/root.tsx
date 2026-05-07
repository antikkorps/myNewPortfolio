// App.tsx
import type { LinksFunction, MetaFunction } from "react-router"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
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
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  },
  { rel: "icon", href: "/favicon.ico" },
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

function App() {
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
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default App

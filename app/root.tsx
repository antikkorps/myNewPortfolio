// App.tsx
import type { LinksFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import CursorHalo from "./components/CursorHalo"
import Navbar from "./components/Navbar"
import { ThemeProvider, themeScript } from "./contexts/ThemeContext"

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
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
]

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body className="transition-colors duration-300 bg-gray-50 dark:bg-neutral-900">
        <ThemeProvider>
          <Navbar />
          <CursorHalo />
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default App

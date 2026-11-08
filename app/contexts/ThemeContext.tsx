// ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // themeScript already resolved cookie → system preference and applied the
  // class before hydration; reading it back keeps that logic in one place.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark"
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  })

  useEffect(() => {
    // Persist the choice and keep <html> in sync with it.
    document.cookie = `theme=${theme};path=/;max-age=31536000`
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Runs inline in <head> before first paint to avoid a theme flash; the
// single source of truth for the initial theme.
export const themeScript = `
  let theme;
  const cookie = document.cookie.match(/theme=(light|dark)/);
  if (cookie) {
    theme = cookie[1];
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (theme === 'dark') document.documentElement.classList.add('dark');
`

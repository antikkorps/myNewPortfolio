// ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Ne vérifie le localStorage que côté client
    if (typeof window !== "undefined") {
      const storedTheme = document.cookie.match(/theme=(light|dark)/)?.[1] as Theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      return storedTheme || systemTheme
    }
    return "dark" // Valeur par défaut
  })

  useEffect(() => {
    // Mettre à jour le cookie et la classe HTML
    document.cookie = `theme=${theme};path=/;max-age=31536000`
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Script pour éviter le flash
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

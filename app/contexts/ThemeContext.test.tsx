import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ThemeProvider, themeScript, useTheme } from "./ThemeContext"

function ShowTheme() {
  return <p>{useTheme().theme}</p>
}

function stubSystemDark(dark: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: dark, media: query }))
}

afterEach(() => {
  document.documentElement.className = ""
  document.cookie = "theme=; max-age=0; path=/"
  vi.unstubAllGlobals()
})

describe("themeScript", () => {
  it("prefers the theme cookie over the system preference", () => {
    stubSystemDark(false)
    document.cookie = "theme=dark; path=/"
    new Function(themeScript)()
    expect(document.documentElement).toHaveClass("dark")
  })

  it("falls back to the system preference without a cookie", () => {
    stubSystemDark(true)
    new Function(themeScript)()
    expect(document.documentElement).toHaveClass("dark")
  })
})

describe("ThemeProvider", () => {
  // themeScript is the single place that decides the initial theme; the
  // provider only mirrors what it applied to <html>.
  it("starts from the class themeScript put on <html>", () => {
    stubSystemDark(false)
    document.documentElement.classList.add("dark")
    render(
      <ThemeProvider>
        <ShowTheme />
      </ThemeProvider>
    )
    expect(screen.getByText("dark")).toBeInTheDocument()
  })
})

import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { describe, expect, it } from "vitest"
import { ArticleCard } from "./ArticleCard"

const post = {
  slug: "mon-article",
  title: "Migrer vers Vite",
  description: "Pourquoi Vite change tout.",
  date: "2026-05-22",
  readingTime: 4,
}

function renderCard(props: Partial<Parameters<typeof ArticleCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ArticleCard post={post} {...props} />
    </MemoryRouter>
  )
}

describe("ArticleCard", () => {
  it("links the whole card to the article", () => {
    renderCard()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/mon-article")
    expect(screen.getByRole("heading", { name: "Migrer vers Vite" })).toBeInTheDocument()
  })

  it("shows the date and reading time", () => {
    renderCard()
    expect(screen.getByText("22 mai 2026")).toBeInTheDocument()
    expect(screen.getByText("4 min de lecture")).toBeInTheDocument()
  })

  it("flags drafts", () => {
    renderCard({ post: { ...post, draft: true } })
    expect(screen.getByText("Brouillon")).toBeInTheDocument()
  })

  it("highlights the search query in title and description, case-insensitively", () => {
    const { container } = renderCard({ highlightQuery: "vite" })
    const marks = Array.from(container.querySelectorAll("mark"), (m) => m.textContent)
    expect(marks).toEqual(["Vite", "Vite"])
  })
})

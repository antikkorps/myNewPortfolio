import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import GotkArticle from "../app/content/blog/gotk-proxy-cli-llm.mdx"

// Articles are written with GitHub-flavoured Markdown; without remark-gfm the
// tables come out as raw `| a | b |` paragraphs.
describe("MDX articles", () => {
  it("render GFM tables as real tables", () => {
    render(<GotkArticle />)
    const table = screen.getByRole("table")
    expect(table).toHaveTextContent("Commande")
    expect(table).toHaveTextContent("Réduction typique")
  })
})

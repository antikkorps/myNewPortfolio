import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import GfmFixture from "./fixtures/gfm.mdx"

// Articles are written with GitHub-flavoured Markdown; without remark-gfm the
// tables come out as raw `| a | b |` paragraphs.
describe("MDX pipeline", () => {
  it("renders GFM tables as real tables", () => {
    render(<GfmFixture />)
    const table = screen.getByRole("table")
    expect(table).toHaveTextContent("Outil")
    expect(table).toHaveTextContent("grep")
  })

  it("never turns a lone ~ into strikethrough", () => {
    const { container } = render(<GfmFixture />)
    expect(container.querySelector("del")).toBeNull()
    expect(container).toHaveTextContent("Restaurer ~/.bashrc~ depuis")
  })
})

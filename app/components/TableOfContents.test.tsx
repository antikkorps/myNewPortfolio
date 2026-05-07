import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TableOfContents } from "./TableOfContents"

describe("<TableOfContents>", () => {
  it("renders nothing when there are no headings (initial mount)", () => {
    const { container } = render(<TableOfContents />)
    // Component renders null on first paint because IntersectionObserver runs
    // in useEffect; with no headings detected (and our jsdom stub), nothing
    // appears.
    expect(container.querySelector("nav")).toBeNull()
  })

  it("renders nothing when there are fewer than minHeadings entries", () => {
    document.body.innerHTML = `
      <article class="prose">
        <h2 id="a">A</h2>
      </article>
    `
    const { container } = render(<TableOfContents minHeadings={4} />)
    expect(container.querySelector("nav")).toBeNull()
  })
})

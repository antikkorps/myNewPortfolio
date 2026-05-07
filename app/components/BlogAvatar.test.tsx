import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BlogAvatar } from "./BlogAvatar"

describe("<BlogAvatar>", () => {
  it("renders an SVG", () => {
    const { container } = render(<BlogAvatar seed="test" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("respects the size prop", () => {
    const { container } = render(<BlogAvatar seed="test" size={80} />)
    const span = container.querySelector("span")
    expect(span).toHaveStyle({ width: "80px", height: "80px" })
  })

  it("is hidden from assistive tech (aria-hidden)", () => {
    const { container } = render(<BlogAvatar seed="test" />)
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument()
  })

  it("produces a different SVG for a different seed", () => {
    const { container: a } = render(<BlogAvatar seed="alpha" />)
    const { container: b } = render(<BlogAvatar seed="beta" />)
    expect(a.innerHTML).not.toBe(b.innerHTML)
  })
})

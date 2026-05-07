import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Aside } from "./Aside"
import { Note } from "./Note"
import { Warning } from "./Warning"

describe("<Note>", () => {
  it("renders children with role=note", () => {
    render(<Note>Texte d&apos;information</Note>)
    expect(screen.getByRole("note")).toBeInTheDocument()
    expect(screen.getByText(/Texte d'information/)).toBeInTheDocument()
  })
})

describe("<Warning>", () => {
  it("renders children with role=alert", () => {
    render(<Warning>Attention !</Warning>)
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Attention !")).toBeInTheDocument()
  })
})

describe("<Aside>", () => {
  it("renders children inside an aside element", () => {
    const { container } = render(<Aside>Un commentaire latéral</Aside>)
    const aside = container.querySelector("aside")
    expect(aside).toBeInTheDocument()
    expect(aside).toHaveTextContent("Un commentaire latéral")
  })
})

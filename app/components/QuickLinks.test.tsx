import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { describe, expect, it } from "vitest"
import { QuickLinks } from "./QuickLinks"

describe("QuickLinks", () => {
  it("renders one labelled link per entry inside a named nav", () => {
    render(
      <MemoryRouter>
        <QuickLinks
          links={[
            { to: "/projets", label: "Voir", title: "Mes projets" },
            { to: "/contact", label: "Discuter", title: "Me contacter" },
          ]}
        />
      </MemoryRouter>
    )
    const nav = screen.getByRole("navigation", { name: "Liens rapides" })
    const links = within(nav).getAllByRole("link")
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/projets", "/contact"])
    expect(links[0]).toHaveTextContent("VoirMes projets")
  })
})

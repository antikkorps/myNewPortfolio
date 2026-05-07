import type { MetaFunction } from "react-router"
import About from "~/components/About"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "À propos",
    description:
      "Parcours, valeurs et façon de travailler de Franck Vienot, développeur web full-stack basé en France.",
    path: "/a-propos",
  })

export default function AboutPage() {
  return (
    <div className="relative top-8 sm:top-24">
      <About />
    </div>
  )
}

import type { MetaFunction } from "react-router"
import AnimatedHero from "~/components/AnimatedHero"
import Terminal from "~/components/Terminal"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Accueil",
    description:
      "Portfolio de Franck Vienot, développeur web full-stack. Découvrez mes projets, mes technologies et mes articles.",
    path: "/",
  })

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen pt-24 sm:pt-16 items-center justify-center">
      <AnimatedHero />
      <Terminal />
    </div>
  )
}

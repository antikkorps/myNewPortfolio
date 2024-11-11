import type { MetaFunction } from "@remix-run/node"
import About from "~/components/About"
export const meta: MetaFunction = () => {
  return [
    { title: "My Tech Stack" },
    { name: "description", content: "Vous trouverez ici ma Tech Stack" },
  ]
}

export default function AboutPage() {
  return (
    <div className="relative sm:top-24">
      <About />
    </div>
  )
}

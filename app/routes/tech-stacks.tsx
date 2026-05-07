import type { MetaFunction } from "react-router"
import TechStack from "~/components/TechStack"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Technologies",
    description:
      "Stack technique de Franck Vienot : Remix, React, Vue, Node, NestJS, TypeScript, Tailwind et l'écosystème JS moderne.",
    path: "/tech-stacks",
  })

export default function TechStackPage() {
  return (
    <div>
      <TechStack />
    </div>
  )
}

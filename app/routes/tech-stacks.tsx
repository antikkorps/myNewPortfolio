import type { MetaFunction } from "react-router"
import TechStack from "~/components/TechStack"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Technologies",
    description:
      "Stack technique de Franck Vienot : React Router, Vue/Nuxt, Astro, Fastify, Go, Rust, Python, PostgreSQL, Docker et l'écosystème dev moderne.",
    path: "/tech-stacks",
  })

export default function TechStackPage() {
  return <TechStack />
}

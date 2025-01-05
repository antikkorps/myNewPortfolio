import type { MetaFunction } from "@remix-run/node"
import AnimatedHero from "~/components/AnimatedHero"
import Terminal from "~/components/Terminal"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen pt-24 sm:pt-16 items-center justify-center">
      <AnimatedHero />
      <Terminal />
    </div>
  )
}

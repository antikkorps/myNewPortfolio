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
    <div className="flex flex-col relative top-24 sm:top-10 h-screen items-center justify-center">
      <AnimatedHero />
      <Terminal />
    </div>
  )
}

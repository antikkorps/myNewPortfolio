import type { MetaFunction } from "@remix-run/node"
import TechStack from "~/components/TechStack"
export const meta: MetaFunction = () => {
  return [
    { title: "My Tech Stack" },
    { name: "description", content: "Vous trouverez ici ma Tech Stack" },
  ]
}

export default function TechStackPage() {
  return (
    <div>
      <TechStack />
    </div>
  )
}

import type { ReactNode } from "react"

export function Aside({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-6 border-l-2 border-neutral-300 pl-4 text-[0.95em] italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
      {children}
    </aside>
  )
}

import { Info } from "lucide-react"
import type { ReactNode } from "react"

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside
      role="note"
      className="not-prose my-6 flex gap-3 rounded-md border border-blue-200 bg-blue-50/60 px-4 py-3 text-[0.95em] text-neutral-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-neutral-200"
    >
      <Info
        size={18}
        strokeWidth={2}
        className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
        aria-hidden
      />
      <div className="leading-relaxed">{children}</div>
    </aside>
  )
}

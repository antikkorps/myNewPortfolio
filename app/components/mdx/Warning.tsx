import { AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

export function Warning({ children }: { children: ReactNode }) {
  return (
    <aside
      role="alert"
      className="not-prose my-6 flex gap-3 rounded-md border border-amber-200 bg-amber-50/70 px-4 py-3 text-[0.95em] text-neutral-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-neutral-200"
    >
      <AlertTriangle
        size={18}
        strokeWidth={2}
        className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
      <div className="leading-relaxed">{children}</div>
    </aside>
  )
}

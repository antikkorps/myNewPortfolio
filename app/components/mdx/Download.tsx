import { Download as DownloadIcon } from "lucide-react"

export function Download({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <div className="not-prose my-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-neutral-200 bg-neutral-50/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/40">
      <a
        href={href}
        download
        className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] dark:bg-[#3b82f6] dark:hover:bg-[#60a5fa] dark:hover:text-[#0a0a0a]"
      >
        <DownloadIcon size={16} strokeWidth={2} aria-hidden />
        {label}
      </a>
      {hint ? <span className="text-sm text-neutral-600 dark:text-neutral-400">{hint}</span> : null}
    </div>
  )
}

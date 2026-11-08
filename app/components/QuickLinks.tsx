import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

export interface QuickLink {
  to: string
  label: string
  title: string
}

export function QuickLinks({ links, className = "" }: { links: QuickLink[]; className?: string }) {
  return (
    <nav
      className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}
      aria-label="Liens rapides"
    >
      {links.map((link) => (
        <QuickLinkCard key={link.to} {...link} />
      ))}
    </nav>
  )
}

function QuickLinkCard({ to, label, title }: QuickLink) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className="group flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
    >
      <div>
        <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{title}</p>
      </div>
      <ArrowRight
        size={16}
        className="text-neutral-400 transition-colors group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa]"
        aria-hidden
      />
    </Link>
  )
}

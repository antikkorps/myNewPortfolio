import { formatDate } from "~/lib/format"

interface PostMetaProps {
  date: string
  readingTime: number
  draft?: boolean
}

// Date · reading time · draft badge, shared by the article cards and the
// article header.
export function PostMeta({ date, readingTime, draft }: PostMetaProps) {
  return (
    <div className="blog-ui flex items-baseline gap-3 text-xs uppercase tracking-wider text-neutral-500">
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden>·</span>
      <span>{readingTime} min de lecture</span>
      {draft ? (
        <span className="rounded-xs bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
          Brouillon
        </span>
      ) : null}
    </div>
  )
}

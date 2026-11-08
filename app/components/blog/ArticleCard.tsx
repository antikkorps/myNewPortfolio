import { Fragment } from "react"
import { Link } from "react-router"
import { PostMeta } from "./PostMeta"

interface ArticleCardProps {
  post: {
    slug: string
    title: string
    description: string
    date: string
    readingTime: number
    draft?: boolean
  }
  highlightQuery?: string
}

export function ArticleCard({ post, highlightQuery }: ArticleCardProps) {
  return (
    <article>
      <Link to={`/blog/${post.slug}`} className="group block" prefetch="intent">
        <PostMeta date={post.date} readingTime={post.readingTime} draft={post.draft} />
        <h2 className="blog-ui mt-2 text-xl font-semibold text-[#0a0a0a] transition-colors group-hover:text-[#2563eb] dark:text-[#fafafa] dark:group-hover:text-[#60a5fa]">
          <Highlight text={post.title} query={highlightQuery} />
        </h2>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
          <Highlight text={post.description} query={highlightQuery} />
        </p>
      </Link>
    </article>
  )
}

// Wraps each case-insensitive occurrence of `query` in a <mark>.
function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const lower = query.toLowerCase()
  return (
    <>
      {text.split(new RegExp(`(${escaped})`, "gi")).map((part, i) =>
        part.toLowerCase() === lower ? (
          <mark
            key={i}
            className="rounded-xs bg-[#2563eb]/10 px-0.5 text-[#2563eb] dark:bg-[#60a5fa]/15 dark:text-[#60a5fa]"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

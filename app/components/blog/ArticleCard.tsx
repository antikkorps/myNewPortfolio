import { Link } from "react-router"
import { Highlight } from "./Highlight"
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

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { ArrowLeft } from "lucide-react"
import { BlogAvatar } from "~/components/BlogAvatar"
import { formatDate, getPost, posts } from "~/lib/posts"
import { AUTHOR, SITE_NAME, SITE_URL } from "~/lib/site"

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPost(params.slug ?? "")
  if (!post) {
    throw new Response("Article introuvable", { status: 404 })
  }
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags ?? [],
    readingTime: post.readingTime,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: `Article introuvable — ${SITE_NAME}` }]
  }
  const url = `${SITE_URL}/blog/${data.slug}`
  const title = `${data.title} — ${SITE_NAME}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    datePublished: data.date,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: data.tags.join(", "),
  }
  return [
    { title },
    { name: "description", content: data.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "article" },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.description },
    { property: "og:url", content: url },
    { property: "article:published_time", content: data.date },
    { property: "article:author", content: AUTHOR.name },
    ...data.tags.map((tag) => ({ property: "article:tag", content: tag })),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.title },
    { name: "twitter:description", content: data.description },
    {
      "script:ld+json": jsonLd,
    },
  ]
}

export default function BlogPost() {
  const data = useLoaderData<typeof loader>()
  const post = posts.find((p) => p.slug === data.slug)
  if (!post) return null
  const Component = post.Component

  return (
    <main className="blog-surface min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          to="/blog"
          prefetch="intent"
          className="blog-ui inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-[#2563eb] dark:text-neutral-400 dark:hover:text-[#60a5fa]"
        >
          <ArrowLeft size={14} aria-hidden /> Retour au blog
        </Link>

        <header className="mt-10 mb-12">
          <div className="blog-ui flex items-baseline gap-3 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
            <time dateTime={data.date}>{formatDate(data.date)}</time>
            <span aria-hidden>·</span>
            <span>{data.readingTime} min de lecture</span>
          </div>
          <h1 className="blog-ui mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-[#0a0a0a] dark:text-[#fafafa]">
            {data.title}
          </h1>
          {data.description ? (
            <p className="mt-4 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              {data.description}
            </p>
          ) : null}
        </header>

        <article className="prose prose-blog dark:prose-invert">
          <Component />
        </article>

        <footer className="blog-ui mt-20 flex items-center gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <BlogAvatar seed={AUTHOR.name} size={44} />
          <div>
            <p className="text-sm font-medium text-[#0a0a0a] dark:text-[#fafafa]">
              {AUTHOR.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Publié le {formatDate(data.date)}
            </p>
          </div>
        </footer>

        {data.tags.length > 0 ? (
          <div className="blog-ui mt-8 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}

import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { Link, useLoaderData } from "react-router"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BlogAvatar } from "~/components/BlogAvatar"
import { TableOfContents } from "~/components/TableOfContents"
import { formatDate } from "~/lib/format"
import { componentForSlug } from "~/lib/posts"
import { getNeighborsMeta, getPostMeta } from "~/lib/posts-meta.server"
import { AUTHOR, ogImageForSlug, SITE_NAME, SITE_URL } from "~/lib/site"

export async function loader({ params }: LoaderFunctionArgs) {
  const meta = getPostMeta(params.slug ?? "")
  if (!meta) {
    throw new Response("Article introuvable", { status: 404 })
  }
  const { prev, next } = getNeighborsMeta(meta.slug)
  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    tags: meta.tags ?? [],
    readingTime: meta.readingTime,
    draft: meta.draft === true,
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: `Article introuvable — ${SITE_NAME}` }]
  }
  const url = `${SITE_URL}/blog/${data.slug}`
  const title = `${data.title} — ${SITE_NAME}`
  const ogImage = `${SITE_URL}${ogImageForSlug(data.slug)}`
  const isoDate = new Date(data.date).toISOString()

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    datePublished: isoDate,
    dateModified: isoDate,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "fr-FR",
    articleSection: data.tags[0] ?? "Blog",
    keywords: data.tags.join(", "),
    wordCount: Math.round(data.readingTime * 200),
    timeRequired: `PT${data.readingTime}M`,
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.title,
        item: url,
      },
    ],
  }

  return [
    { title },
    { name: "description", content: data.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "article" },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:secure_url", content: ogImage },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${data.title} — illustration` },
    { property: "article:published_time", content: isoDate },
    { property: "article:modified_time", content: isoDate },
    { property: "article:author", content: AUTHOR.name },
    ...data.tags.map((tag) => ({ property: "article:tag", content: tag })),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.title },
    { name: "twitter:description", content: data.description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: `${data.title} — illustration` },
    { "script:ld+json": blogPosting },
    { "script:ld+json": breadcrumbs },
  ]
}

export default function BlogPost() {
  const data = useLoaderData<typeof loader>()
  const Component = componentForSlug(data.slug)
  if (!Component) return null

  return (
    <main className="blog-surface min-h-screen pt-24 sm:pt-28 pb-24">
      <TableOfContents />
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
            {data.draft ? (
              <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                Brouillon
              </span>
            ) : null}
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

        {(data.prev || data.next) && (
          <nav
            className="blog-ui mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
            aria-label="Articles adjacents"
          >
            {data.prev ? (
              <Link
                to={`/blog/${data.prev.slug}`}
                prefetch="intent"
                className="group block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
              >
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
                  <ArrowLeft size={12} aria-hidden /> Article précédent
                </div>
                <p className="mt-1 text-sm font-medium text-[#0a0a0a] group-hover:text-[#2563eb] dark:text-[#fafafa] dark:group-hover:text-[#60a5fa]">
                  {data.prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {data.next ? (
              <Link
                to={`/blog/${data.next.slug}`}
                prefetch="intent"
                className="group block rounded-lg border border-neutral-200 p-4 text-right transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
                  Article suivant <ArrowRight size={12} aria-hidden />
                </div>
                <p className="mt-1 text-sm font-medium text-[#0a0a0a] group-hover:text-[#2563eb] dark:text-[#fafafa] dark:group-hover:text-[#60a5fa]">
                  {data.next.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {data.tags.length > 0 ? (
          <div className="blog-ui mt-8 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog/tags/${encodeURIComponent(tag.toLowerCase())}`}
                prefetch="intent"
                className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-600 transition-colors hover:border-[#2563eb] hover:text-[#2563eb] dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-[#60a5fa] dark:hover:text-[#60a5fa]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}

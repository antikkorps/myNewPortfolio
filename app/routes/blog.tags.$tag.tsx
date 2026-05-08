import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { Link, useLoaderData } from "react-router"
import { ArrowLeft } from "lucide-react"
import { formatDate } from "~/lib/format"
import { postsMeta } from "~/lib/posts-meta.server"
import { SITE_NAME, SITE_URL } from "~/lib/site"

export async function loader({ params }: LoaderFunctionArgs) {
  const tag = decodeURIComponent(params.tag ?? "").toLowerCase()
  if (!tag) {
    throw new Response("Tag manquant", { status: 404 })
  }
  const items = postsMeta
    .filter((p) => (p.tags ?? []).map((t) => t.toLowerCase()).includes(tag))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      readingTime: p.readingTime,
    }))

  if (items.length === 0) {
    throw new Response("Tag inconnu", { status: 404 })
  }

  return { tag, items }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: `Tag introuvable — ${SITE_NAME}` }]
  const title = `#${data.tag} — Blog`
  const description = `Articles tagués ${data.tag} sur le blog de Franck Vienot.`
  const url = `${SITE_URL}/blog/tags/${encodeURIComponent(data.tag)}`

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: `#${data.tag}`, item: url },
    ],
  }

  return [
    { title: `${title} — ${SITE_NAME}` },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { "script:ld+json": breadcrumbs },
  ]
}

export default function TagPage() {
  const { tag, items } = useLoaderData<typeof loader>()

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
          <p className="blog-ui text-xs uppercase tracking-wider text-neutral-500">Tag</p>
          <h1 className="blog-ui mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-[#0a0a0a] dark:text-[#fafafa]">
            #{tag}
          </h1>
          <p className="blog-ui mt-3 text-[15px] text-neutral-600 dark:text-neutral-400">
            {items.length} article{items.length > 1 ? "s" : ""}.
          </p>
        </header>

        <ul className="space-y-10">
          {items.map((post) => (
            <li key={post.slug}>
              <article>
                <Link to={`/blog/${post.slug}`} className="group block" prefetch="intent">
                  <div className="blog-ui flex items-baseline gap-3 text-xs uppercase tracking-wider text-neutral-500">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime} min de lecture</span>
                  </div>
                  <h2 className="blog-ui mt-2 text-xl font-semibold text-[#0a0a0a] transition-colors group-hover:text-[#2563eb] dark:text-[#fafafa] dark:group-hover:text-[#60a5fa]">
                    {post.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {post.description}
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

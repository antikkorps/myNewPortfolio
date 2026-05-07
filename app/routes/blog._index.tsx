import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router"
import { Search } from "lucide-react"
import { Fragment, useEffect, useRef } from "react"
import { formatDate } from "~/lib/format"
import { postsMeta } from "~/lib/posts-meta.server"
import { SITE_NAME, SITE_URL } from "~/lib/site"

const PER_PAGE = 3

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = (url.searchParams.get("q") ?? "").toLowerCase().trim()
  const pageParam = parseInt(url.searchParams.get("page") ?? "1", 10)
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const filtered = q
    ? postsMeta.filter((p) => {
        const haystack = [
          p.title,
          p.description,
          ...(p.tags ?? []),
        ]
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      })
    : postsMeta

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const items = filtered.slice(start, start + PER_PAGE).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    readingTime: p.readingTime,
    tags: p.tags ?? [],
  }))

  return { items, page: safePage, totalPages, total, q }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `Blog — ${SITE_NAME}`
  const description =
    "Notes techniques, réflexions métier et carnet de bord d'un développeur web full-stack."
  const url = `${SITE_URL}/blog`

  const itemList = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description,
    url,
    inLanguage: "fr-FR",
    blogPost: (data?.items ?? []).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date ? new Date(p.date).toISOString() : undefined,
    })),
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: url },
    ],
  }

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { "script:ld+json": itemList },
    { "script:ld+json": breadcrumbs },
  ]
}

function highlight(text: string, q: string) {
  if (!q) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)
  const lower = q.toLowerCase()
  return parts.map((part, i) =>
    part.toLowerCase() === lower ? (
      <mark
        key={i}
        className="rounded-sm bg-[#2563eb]/10 px-0.5 text-[#2563eb] dark:bg-[#60a5fa]/15 dark:text-[#60a5fa]"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

function buildPageHref(searchParams: URLSearchParams, page: number): string {
  const next = new URLSearchParams(searchParams)
  if (page <= 1) next.delete("page")
  else next.set("page", String(page))
  const qs = next.toString()
  return qs ? `?${qs}` : ""
}

export default function BlogIndex() {
  const { items, page, totalPages, total, q } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSearching = navigation.state !== "idle"

  // Restore caret on revalidation
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      // no-op, just pin reference
    }
  }, [q])

  return (
    <main className="blog-surface min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-10">
          <h1 className="blog-ui text-3xl sm:text-4xl font-semibold tracking-tight text-[#0a0a0a] dark:text-[#fafafa]">
            Blog
          </h1>
          <p className="blog-ui mt-3 text-[15px] text-neutral-600 dark:text-neutral-400">
            Notes, retours d&apos;expérience et réflexions sur le développement
            web.
          </p>
        </header>

        <Form
          ref={formRef}
          method="get"
          action="/blog"
          role="search"
          className="blog-ui mb-10"
          onChange={(event) => {
            const formData = new FormData(event.currentTarget)
            formData.delete("page")
            submit(formData, { replace: true })
          }}
        >
          <label className="relative block">
            <span className="sr-only">Rechercher dans le blog</span>
            <Search
              size={16}
              strokeWidth={2}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              ref={inputRef}
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher (titre, description, tag)…"
              autoComplete="off"
              className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-[#1a1a1a] placeholder:text-neutral-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-[#e8e8e8]"
            />
          </label>
          <noscript>
            <button
              type="submit"
              className="mt-2 rounded-md border border-neutral-200 px-3 py-1 text-sm dark:border-neutral-800"
            >
              Rechercher
            </button>
          </noscript>
        </Form>

        {q ? (
          <p className="blog-ui mb-6 text-sm text-neutral-500 dark:text-neutral-400">
            {total === 0
              ? `Aucun article ne correspond à « ${q} ».`
              : `${total} article${total > 1 ? "s" : ""} pour « ${q} ».`}{" "}
            <Link to="/blog" className="underline hover:text-[#2563eb]">
              Effacer
            </Link>
          </p>
        ) : null}

        <ul
          className={`space-y-10 transition-opacity ${
            isSearching ? "opacity-50" : "opacity-100"
          }`}
        >
          {items.map((post) => (
            <li key={post.slug}>
              <article>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block"
                  prefetch="intent"
                >
                  <div className="blog-ui flex items-baseline gap-3 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime} min de lecture</span>
                  </div>
                  <h2 className="blog-ui mt-2 text-xl font-semibold text-[#0a0a0a] transition-colors group-hover:text-[#2563eb] dark:text-[#fafafa] dark:group-hover:text-[#60a5fa]">
                    {highlight(post.title, q)}
                  </h2>
                  <p className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {highlight(post.description, q)}
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <nav
            className="blog-ui mt-16 flex items-center justify-between border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800"
            aria-label="Pagination"
          >
            {page > 1 ? (
              <Link
                to={buildPageHref(searchParams, page - 1)}
                prefetch="intent"
                className="text-neutral-600 hover:text-[#2563eb] dark:text-neutral-400 dark:hover:text-[#60a5fa]"
              >
                ← Précédent
              </Link>
            ) : (
              <span className="text-neutral-300 dark:text-neutral-700">
                ← Précédent
              </span>
            )}

            <span className="text-neutral-500 dark:text-neutral-400">
              Page {page} / {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                to={buildPageHref(searchParams, page + 1)}
                prefetch="intent"
                className="text-neutral-600 hover:text-[#2563eb] dark:text-neutral-400 dark:hover:text-[#60a5fa]"
              >
                Suivant →
              </Link>
            ) : (
              <span className="text-neutral-300 dark:text-neutral-700">
                Suivant →
              </span>
            )}
          </nav>
        ) : null}
      </div>
    </main>
  )
}

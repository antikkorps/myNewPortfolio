import type { MetaFunction } from "react-router"
import { Link, useLoaderData } from "react-router"
import { ArrowRight } from "lucide-react"
import { formatDate } from "~/lib/format"
import { postsMeta } from "~/lib/posts-meta.server"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Accueil",
    description:
      "Portfolio de Franck Vienot, architecte cloud et développeur basé en France. LogiBOP (logiciel santé), GoTK (CLI Go pour LLMs), DAW en Rust, articles et projets.",
    path: "/",
  })

export async function loader() {
  return {
    latestArticles: postsMeta.slice(0, 3).map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      readingTime: p.readingTime,
    })),
  }
}

const technologies = [
  "TypeScript",
  "React Router",
  "Vue / Nuxt",
  "Astro",
  "Fastify",
  "Go",
  "Rust",
  "Python",
  "Tailwind",
  "PostgreSQL",
]

export default function Index() {
  const { latestArticles } = useLoaderData<typeof loader>()

  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-32 pb-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Franck Vienot
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Architecte cloud, solutions web et{" "}
            <span className="text-[#2563eb] dark:text-[#60a5fa]">
              outillage dev
            </span>
            .
          </h1>
        </header>

        <p className="text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          En pro :{" "}
          <Link
            to="/a-propos"
            prefetch="intent"
            className="border-b border-current text-[#2563eb] transition-colors hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
          >
            LogiBOP
          </Link>
          , logiciel santé en milieu hospitalier. En perso :{" "}
          <Link
            to="/blog/gotk-proxy-cli-llm"
            prefetch="intent"
            className="border-b border-current text-[#2563eb] transition-colors hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
          >
            GoTK
          </Link>{" "}
          (CLI Go pour agents LLM), un DAW en Rust, et l&apos;auto-hébergement.
        </p>

        <ul className="mt-10 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
            >
              {tech}
            </li>
          ))}
        </ul>

        <section className="mt-20">
          <div className="mb-6 flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Derniers articles
            </h2>
            <Link
              to="/blog"
              prefetch="intent"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-[#2563eb] dark:hover:text-[#60a5fa]"
            >
              Tout le blog <ArrowRight size={12} aria-hidden />
            </Link>
          </div>
          <ul className="space-y-7">
            {latestArticles.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  prefetch="intent"
                  className="group block"
                >
                  <div className="flex items-baseline gap-3 text-xs uppercase tracking-wider text-neutral-500">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime} min</span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-neutral-900 transition-colors group-hover:text-[#2563eb] dark:text-neutral-100 dark:group-hover:text-[#60a5fa]">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <nav
          className="mt-20 grid grid-cols-1 gap-3 sm:grid-cols-3"
          aria-label="Liens rapides"
        >
          <Link
            to="/projets"
            prefetch="intent"
            className="group flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Voir
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Mes projets
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-neutral-400 transition-colors group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa]"
              aria-hidden
            />
          </Link>
          <Link
            to="/tech-stacks"
            prefetch="intent"
            className="group flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Stack
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Mes outils
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-neutral-400 transition-colors group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa]"
              aria-hidden
            />
          </Link>
          <Link
            to="/contact"
            prefetch="intent"
            className="group flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-[#2563eb] dark:border-neutral-800 dark:hover:border-[#60a5fa]"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Discuter
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Me contacter
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-neutral-400 transition-colors group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa]"
              aria-hidden
            />
          </Link>
        </nav>
      </div>
    </main>
  )
}

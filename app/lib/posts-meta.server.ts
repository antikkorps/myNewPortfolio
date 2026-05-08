// Frontmatter-only data for /blog (index, listing, sitemap, RSS, tags, og).
// Imports only the `frontmatter` named export from each .mdx via Vite glob —
// remark-mdx-frontmatter generates that export. Server-only file: the raw
// MDX text + components stay out of the client bundle.

interface RawFrontmatter {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  readingTime?: number
  draft?: boolean
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: number
  draft?: boolean
}

const frontmatterModules = import.meta.glob<RawFrontmatter>("../content/blog/*.mdx", {
  eager: true,
  import: "frontmatter",
})

function slugFromPath(path: string): string {
  const m = path.match(/\/([^/]+)\.mdx$/)
  if (!m) throw new Error(`Cannot extract slug from ${path}`)
  return m[1]
}

// In dev we keep drafts so we can preview them while writing without
// publishing. In prod (and in tests, where NODE_ENV is "test") drafts are
// filtered out.
const showDrafts = process.env.NODE_ENV === "development"

export const postsMeta: PostMeta[] = Object.entries(frontmatterModules)
  .map(([path, fm]) => ({
    slug: slugFromPath(path),
    title: fm?.title ?? "",
    date: fm?.date ?? "",
    description: fm?.description ?? "",
    tags: Array.isArray(fm?.tags) ? fm.tags : [],
    readingTime: typeof fm?.readingTime === "number" ? fm.readingTime : 1,
    draft: fm?.draft === true,
  }))
  .filter((p) => showDrafts || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPostMeta(slug: string): PostMeta | undefined {
  return postsMeta.find((p) => p.slug === slug)
}

export function getNeighborsMeta(slug: string): {
  prev: PostMeta | null
  next: PostMeta | null
} {
  const idx = postsMeta.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    next: idx > 0 ? postsMeta[idx - 1] : null,
    prev: idx < postsMeta.length - 1 ? postsMeta[idx + 1] : null,
  }
}

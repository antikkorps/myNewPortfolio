import type { ComponentType } from "react"

export interface Frontmatter {
  title: string
  date: string
  description: string
  readingTime: number
  tags?: string[]
  author?: string
  draft?: boolean
}

export interface Post extends Frontmatter {
  slug: string
  Component: ComponentType
}

interface MdxModule {
  default: ComponentType
  frontmatter: Frontmatter
}

const modules = import.meta.glob<MdxModule>("../content/blog/*.mdx", {
  eager: true,
})

function slugFromPath(path: string): string {
  const match = path.match(/\/([^/]+)\.mdx$/)
  if (!match) throw new Error(`Cannot extract slug from ${path}`)
  return match[1]
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path)
    return {
      slug,
      ...mod.frontmatter,
      Component: mod.default,
    }
  })
  .filter((p) => !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso: string, locale = "fr-FR"): string {
  const d = new Date(iso)
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

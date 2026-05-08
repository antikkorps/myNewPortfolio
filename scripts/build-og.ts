import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { renderOgPng } from "../app/lib/og.server"
import { SITE_DESCRIPTION, SITE_NAME } from "../app/lib/site"

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = join(__dirname, "../app/content/blog")
const OUT_DIR = join(__dirname, "../public/og")

interface Frontmatter {
  title?: string
  description?: string
  draft?: boolean
}

async function readPosts() {
  const files = await readdir(BLOG_DIR)
  const posts: { slug: string; title: string; description: string }[] = []
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue
    const slug = file.replace(/\.mdx$/, "")
    const raw = await readFile(join(BLOG_DIR, file), "utf-8")
    const { data } = matter(raw)
    const fm = data as Frontmatter
    if (fm.draft) continue
    posts.push({
      slug,
      title: fm.title ?? "",
      description: fm.description ?? "",
    })
  }
  return posts
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const start = Date.now()

  const defaultPng = await renderOgPng({
    title: SITE_NAME,
    subtitle: SITE_DESCRIPTION,
  })
  await writeFile(join(OUT_DIR, "default.png"), defaultPng)
  console.log("  /og/default.png")

  const posts = await readPosts()
  for (const post of posts) {
    const png = await renderOgPng({
      title: post.title,
      subtitle: post.description,
      kicker: "Article",
    })
    await writeFile(join(OUT_DIR, `${post.slug}.png`), png)
    console.log(`  /og/${post.slug}.png`)
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2)
  console.log(`✓ ${posts.length + 1} OG images in ${elapsed}s`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

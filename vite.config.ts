import { reactRouter } from "@react-router/dev/vite"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { rehypePrettyCode } from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig } from "vite"

export default defineConfig({
  // Vite 8 resolves tsconfig `paths` natively, no plugin needed.
  resolve: { tsconfigPaths: true },
  plugins: [
    // Vite plugin instead of @tailwindcss/postcss: Vite 8's internal
    // postcss-import resolves `@import "tailwindcss"` as a relative file.
    tailwindcss(),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
        // Tables, autolinks, footnotes. singleTilde off: Linux articles are
        // full of `~/` paths, and a lone `~` must never strike text through.
        [remarkGfm, { singleTilde: false }],
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor"],
              "aria-label": "Lien permanent vers cette section",
            },
            content: { type: "text", value: "#" },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: { light: "github-light", dark: "github-dark" },
            keepBackground: false,
          },
        ],
      ],
    }),
    reactRouter(),
  ],
})

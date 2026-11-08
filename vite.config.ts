import { reactRouter } from "@react-router/dev/vite"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { rehypePrettyCode } from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkFrontmatter from "remark-frontmatter"
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
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
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

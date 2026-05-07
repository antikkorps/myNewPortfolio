import { reactRouter } from "@react-router/dev/vite"
import mdx from "@mdx-js/rollup"
import rehypePrettyCode from "rehype-pretty-code"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
      ],
      rehypePlugins: [
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
    tsconfigPaths(),
  ],
})

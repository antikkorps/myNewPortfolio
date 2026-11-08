import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig } from "vitest/config"

// Vitest's own Vite config — we don't pull in @react-router/dev/vite (that
// plugin is only meaningful when the framework runtime is actually serving
// requests). MDX + tsconfig paths are enough to import .mdx and resolve `~/`.
export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
        // Tables, autolinks, footnotes. singleTilde off: Linux articles are
        // full of `~/` paths, and a lone `~` must never strike text through.
        [remarkGfm, { singleTilde: false }],
      ],
    }),
  ],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["app/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/build/**", "**/e2e/**"],
    globals: true,
    css: false,
  },
})

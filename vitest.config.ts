import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import tsconfigPaths from "vite-tsconfig-paths"
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
      ],
    }),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["app/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/build/**", "**/e2e/**"],
    globals: true,
    css: false,
  },
})

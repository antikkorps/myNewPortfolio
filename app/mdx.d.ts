// Direct `.mdx` imports (tests) need a module shape; the app itself loads
// articles through import.meta.glob, which is typed at the call site.
// Follows the @types/mdx pattern: redeclaring the module replaces its
// declaration, so the default export is restated with its MDXContent type.
declare module "*.mdx" {
  import type { MDXContent } from "mdx/types"

  export const frontmatter: Record<string, unknown>
  const Content: MDXContent
  export default Content
}

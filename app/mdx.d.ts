// Direct `.mdx` imports (tests) need a module shape; the app itself loads
// articles through import.meta.glob, which is typed at the call site.
declare module "*.mdx" {
  import type { ComponentType } from "react"

  export const frontmatter: Record<string, unknown>
  const MDXContent: ComponentType
  export default MDXContent
}

import type { LoaderFunctionArgs } from "react-router"
import { renderOgPng } from "~/lib/og.server"
import { postsMeta as posts } from "~/lib/posts-meta.server"
import { SITE_DESCRIPTION, SITE_NAME } from "~/lib/site"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const slug = url.searchParams.get("slug")

  let title = SITE_NAME
  let subtitle: string | undefined = SITE_DESCRIPTION
  let kicker: string | undefined

  if (slug) {
    const post = posts.find((p) => p.slug === slug)
    if (post) {
      title = post.title
      subtitle = post.description
      kicker = "Article"
    }
  }

  const png = await renderOgPng({ title, subtitle, kicker })

  return new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  })
}

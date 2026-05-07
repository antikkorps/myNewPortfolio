import { thumbs } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { Resvg } from "@resvg/resvg-js"
import { AUTHOR } from "~/lib/site"

let cached: Uint8Array | null = null

export async function loader() {
  if (!cached) {
    const svg = createAvatar(thumbs, {
      seed: AUTHOR.name,
      radius: 50,
      backgroundColor: ["2563eb"],
      size: 64,
    }).toString()
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 64 },
    })
    cached = resvg.render().asPng()
  }

  return new Response(cached as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  })
}

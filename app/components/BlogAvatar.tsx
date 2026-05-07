import { thumbs } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { useMemo } from "react"

interface Props {
  seed?: string
  size?: number
}

export function BlogAvatar({ seed = "Franck Vienot", size = 40 }: Props) {
  const svg = useMemo(
    () =>
      createAvatar(thumbs, {
        seed,
        radius: 50,
        backgroundColor: ["2563eb"],
      }).toString(),
    [seed]
  )

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, display: "inline-block" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

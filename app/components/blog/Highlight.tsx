import { Fragment } from "react"

// Wraps each case-insensitive occurrence of `query` in a <mark>.
export function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const lower = query.toLowerCase()
  return (
    <>
      {text.split(new RegExp(`(${escaped})`, "gi")).map((part, i) =>
        part.toLowerCase() === lower ? (
          <mark
            key={i}
            className="rounded-xs bg-[#2563eb]/10 px-0.5 text-[#2563eb] dark:bg-[#60a5fa]/15 dark:text-[#60a5fa]"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

import { useEffect, useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

interface Props {
  containerSelector?: string
  minHeadings?: number
}

export function TableOfContents({
  containerSelector = "article.prose",
  minHeadings = 4,
}: Props) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return
    const nodes = Array.from(
      container.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]")
    )
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent?.replace(/#$/, "").trim() ?? "",
        level: parseInt(n.tagName.substring(1), 10),
      }))
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [containerSelector])

  if (headings.length < minHeadings) return null

  return (
    <nav
      aria-label="Table des matières"
      className="blog-ui sticky top-24 hidden xl:block"
    >
      <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
        Sommaire
      </p>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? "pl-3" : ""}
          >
            <a
              href={`#${h.id}`}
              className={`block leading-snug transition-colors ${
                activeId === h.id
                  ? "text-[#2563eb] dark:text-[#60a5fa]"
                  : "text-neutral-500 hover:text-[#0a0a0a] dark:text-neutral-500 dark:hover:text-[#fafafa]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

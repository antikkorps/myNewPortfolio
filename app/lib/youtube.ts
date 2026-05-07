// Convert a YouTube share URL into a safe youtube-nocookie embed URL.
// Hostnames are matched against a strict allowlist on a dot boundary —
// `endsWith("youtube.com")` would otherwise accept `evilyoutube.com` and
// allow an attacker-controlled origin into the iframe pipeline (CodeQL
// "incomplete URL substring sanitization").

const YOUTU_BE_HOSTS = new Set(["youtu.be"])
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
])

// YouTube video IDs are exactly 11 chars [A-Za-z0-9_-].
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/

export function isValidYoutubeId(id: string | null | undefined): id is string {
  return typeof id === "string" && YOUTUBE_ID_RE.test(id)
}

export function toEmbedUrl(url: string): string | null {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null

  if (YOUTU_BE_HOSTS.has(u.hostname)) {
    const id = u.pathname.replace(/^\//, "")
    return isValidYoutubeId(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null
  }

  if (YOUTUBE_HOSTS.has(u.hostname)) {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v")
      return isValidYoutubeId(id)
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null
    }
    const embedMatch = u.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})$/)
    if (embedMatch) {
      return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`
    }
  }

  return null
}

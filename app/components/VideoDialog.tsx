import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface Props {
  url: string | null
  title: string
  onClose: () => void
}

// Convert "https://youtu.be/<id>" or "https://www.youtube.com/watch?v=<id>"
// (or already-embedded URLs) into a safe embed URL.
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v")
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
      }
      if (u.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${u.pathname}`
      }
    }
    return null
  } catch {
    return null
  }
}

export function VideoDialog({ url, title, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = url !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const embed = url ? toEmbedUrl(url) : null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Any click that bubbles up to <dialog> closes it. The inner content
      // calls stopPropagation, so only clicks outside the video card reach
      // this handler — including clicks on the surrounding flex wrapper.
      onClick={onClose}
      aria-labelledby="video-dialog-title"
      className="m-0 max-h-none max-w-none w-full h-full bg-transparent p-4 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
        <div
          className="relative w-full overflow-hidden rounded-xl bg-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-white">
            <h2 id="video-dialog-title" className="truncate font-medium">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la vidéo"
              className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {embed ? (
              <iframe
                key={embed}
                src={`${embed}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
                Vidéo indisponible.
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}

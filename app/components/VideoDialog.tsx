import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { toEmbedUrl } from "~/lib/youtube"

interface Props {
  url: string | null
  title: string
  onClose: () => void
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

  // Backdrop click closes the dialog. We register the handler imperatively
  // (not as an onClick prop) because eslint-jsx-a11y rejects click handlers
  // on <dialog> — it doesn't account for the implicit role="dialog" — and
  // the modal's keyboard interactions (Escape) are already handled natively
  // by the browser via the cancel/close events.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose()
    }
    dialog.addEventListener("click", handleClick)
    return () => dialog.removeEventListener("click", handleClick)
  }, [onClose])

  const embed = url ? toEmbedUrl(url) : null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="video-dialog-title"
      aria-modal="true"
      className="m-0 max-h-none max-w-none w-full h-full bg-transparent p-4 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="pointer-events-none mx-auto flex h-full max-w-5xl items-center justify-center">
        <div className="pointer-events-auto relative w-full overflow-hidden rounded-xl bg-black shadow-2xl">
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

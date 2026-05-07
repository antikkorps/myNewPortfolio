// Plain helpers safe to import client-side.

export function formatDate(iso: string, locale = "fr-FR"): string {
  const d = new Date(iso)
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Shared by the contact e-mail (HTML), the RSS feed and the sitemap (XML).
// `&#39;` rather than `&apos;`: the numeric form is valid in both HTML and XML,
// `&apos;` is not recognised by older HTML mail clients.
const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ENTITIES[char])
}

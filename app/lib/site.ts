export const SITE_URL = "https://dev2go.vercel.app"
export const SITE_NAME = "Dev2Go — Franck Vienot"
export const SITE_DESCRIPTION =
  "Portfolio de Franck Vienot, développeur web full-stack. Projets, technologies, articles et contact."
export const AUTHOR = {
  name: "Franck Vienot",
  url: SITE_URL,
  email: "franckvienot7@gmail.com",
  twitter: "",
  github: "antikkorps",
  linkedin: "https://www.linkedin.com/in/franck-vienot/",
  phone: "",
}
export const OG_IMAGE = "/og.png"
export const ogImageForSlug = (slug: string) =>
  `/og.png?slug=${encodeURIComponent(slug)}`

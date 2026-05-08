import { redirect } from "react-router"

// /sendmail used to host the contact form on its own. The form is now part
// of /contact directly, but external links may still point here, so we 301
// preserve them.
export function loader() {
  return redirect("/contact", 301)
}

export default function SendmailRedirect() {
  return null
}

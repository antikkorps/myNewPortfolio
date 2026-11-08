import { describe, expect, it } from "vitest"
import { buildContactMails } from "./contact-mail"

const input = {
  name: "Jean O'Brien",
  email: "jean@example.com",
  subject: "L'offre <urgent>",
  message: "Bonjour, j'ai une question.",
}

describe("buildContactMails", () => {
  const { admin, user } = buildContactMails(input)

  it("keeps the subject header as plain text", () => {
    expect(admin.subject).toBe("L'offre <urgent> - Message de Jean O'Brien")
  })

  it("escapes every user field in the HTML bodies", () => {
    expect(admin.html).toContain("L&#39;offre &lt;urgent&gt;")
    expect(admin.html).toContain("Jean O&#39;Brien")
    expect(admin.html).toContain("j&#39;ai une question")
    expect(admin.html).not.toContain("<urgent>")
    expect(user.html).toContain("« L&#39;offre &lt;urgent&gt; »")
  })

  it("drops line breaks from the subject header", () => {
    const { admin } = buildContactMails({ ...input, subject: "a\r\nBcc: x@y.z" })
    expect(admin.subject).toBe("a Bcc: x@y.z - Message de Jean O'Brien")
  })
})

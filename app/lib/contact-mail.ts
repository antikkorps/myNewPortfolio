import { escapeHtml } from "./html"

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

interface MailContent {
  subject: string
  html: string
}

// Fields stay raw until they reach HTML: a mail header is plain text, so
// escaping it there would show `l&#39;offre` in the inbox.
export function buildContactMails(input: ContactInput): { admin: MailContent; user: MailContent } {
  const html = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    subject: escapeHtml(input.subject),
    message: escapeHtml(input.message),
  }
  return {
    admin: {
      subject: headerSafe(`${input.subject} - Message de ${input.name}`),
      html: adminHtml(html),
    },
    user: { subject: "Merci pour votre message", html: userHtml(html) },
  }
}

// Line breaks have no place in a header; collapse them so a crafted subject
// cannot smuggle extra headers whatever the mail provider does.
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ")
}

function adminHtml({ name, email, subject, message }: ContactInput): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="color: #0a0a0a; margin: 0 0 16px 0; font-size: 18px;">Nouveau message de contact</h2>
      <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">De</p>
      <p style="margin: 0 0 16px 0; color: #0a0a0a;">${name} &lt;${email}&gt;</p>
      <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">Sujet</p>
      <p style="margin: 0 0 16px 0; color: #0a0a0a;">${subject}</p>
      <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">Message</p>
      <p style="margin: 0; color: #0a0a0a; white-space: pre-line; line-height: 1.6;">${message}</p>
    </div>
  `
}

function userHtml({ name, subject }: Pick<ContactInput, "name" | "subject">): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px; line-height: 1.6;">
      <p>Bonjour ${name},</p>
      <p>J'ai bien reçu votre message concernant « ${subject} » et reviendrai vers vous rapidement.</p>
      <p>Cordialement,<br />Franck</p>
      <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #737373;">
        Ceci est un message automatique, merci de ne pas y répondre.
      </p>
    </div>
  `
}

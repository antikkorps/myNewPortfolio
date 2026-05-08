// Provider-agnostic mail send. The /contact action calls sendMail() with a
// plain MailMessage object — it doesn't know whether the bytes go out through
// Resend, Gmail SMTP, Postmark, or anything else. To swap providers later,
// replace the body of sendMail() (and adjust the env vars it reads). Nothing
// upstream needs to change.

import { Resend } from "resend"

export interface MailMessage {
  from: string
  to: string
  bcc?: string
  replyTo?: string
  subject: string
  html: string
}

export class MailError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = "MailError"
  }
}

// Lazy-init the Resend client so module import on a server without the env
// var doesn't crash; the action surfaces a clean UI error in that case.
let client: Resend | null = null
function resend() {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new MailError("RESEND_API_KEY is not configured")
  client = new Resend(apiKey)
  return client
}

export async function sendMail(message: MailMessage): Promise<void> {
  const { error } = await resend().emails.send({
    from: message.from,
    to: message.to,
    bcc: message.bcc,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
  })
  if (error) {
    throw new MailError(`Resend rejected the message: ${error.message}`, error)
  }
}

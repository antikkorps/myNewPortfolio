// Provider-agnostic mail send. The /contact action calls sendMail() with a
// plain MailMessage object — it doesn't know whether the bytes go out through
// Gmail SMTP, Resend, Postmark, or anything else. To swap providers later,
// replace the body of sendMail() (and adjust the env vars it reads). Nothing
// upstream needs to change.

import nodemailer from "nodemailer"

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

export async function sendMail(message: MailMessage): Promise<void> {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) {
    throw new MailError("EMAIL_USER / EMAIL_PASS are not configured")
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })

  try {
    await transporter.sendMail({
      from: message.from,
      to: message.to,
      bcc: message.bcc,
      replyTo: message.replyTo,
      subject: message.subject,
      html: message.html,
    })
  } catch (cause) {
    throw new MailError("Failed to send mail via the configured provider", cause)
  }
}

import type { ActionFunction, MetaFunction } from "react-router"
import { Form, useActionData, useNavigation } from "react-router"
import { Github, Linkedin, Mail, Phone, Send } from "lucide-react"
import nodemailer from "nodemailer"
import { useEffect, useRef } from "react"
import {
  checkRateLimit,
  getClientIp,
  isValidEmail,
  sanitizeInput,
  validateMessage,
} from "~/lib/contact.server"
import { pageMeta } from "~/lib/seo"
import { AUTHOR } from "~/lib/site"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Contact",
    description:
      "Contactez Franck Vienot pour discuter d'un projet, d'une mission freelance ou d'une opportunité.",
    path: "/contact",
  })

interface ActionData {
  success?: boolean
  error?: string
}

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
  const ip = getClientIp(request)
  if (!checkRateLimit(ip)) {
    return { error: "Trop de messages envoyés depuis votre adresse. Réessayez plus tard." }
  }

  const formData = await request.formData()
  const honeypot = formData.get("honeypot")?.toString()
  const website = formData.get("website")?.toString()
  const timestamp = formData.get("timestamp")?.toString()
  const name = sanitizeInput(formData.get("name")?.toString() || "")
  const email = formData.get("email")?.toString()
  const subject = sanitizeInput(formData.get("subject")?.toString() || "")
  const message = sanitizeInput(formData.get("message")?.toString() || "")

  if (honeypot || website || !timestamp || Date.now() - Number(timestamp) < 5000) {
    return { error: "Une erreur est survenue" }
  }
  if (!email || !isValidEmail(email)) {
    return { error: "Adresse email invalide" }
  }
  if (!validateMessage(message)) {
    return { error: "Message invalide" }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    bcc: process.env.EMAIL_BCC,
    subject: `${subject} - Message de ${name}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #0a0a0a; margin: 0 0 16px 0; font-size: 18px;">Nouveau message de contact</h2>
        <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">De</p>
        <p style="margin: 0 0 16px 0; color: #0a0a0a;">${name} &lt;${email}&gt;</p>
        <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">Sujet</p>
        <p style="margin: 0 0 16px 0; color: #0a0a0a;">${subject}</p>
        <p style="margin: 0 0 8px 0; color: #525252; font-size: 13px;">Message</p>
        <p style="margin: 0; color: #0a0a0a; white-space: pre-line; line-height: 1.6;">${message}</p>
      </div>
    `,
  }

  const userMailOptions = {
    from: `"Ne pas répondre" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email,
    subject: `Merci pour votre message`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px; line-height: 1.6;">
        <p>Bonjour ${name},</p>
        <p>J'ai bien reçu votre message concernant « ${subject} » et reviendrai vers vous rapidement.</p>
        <p>Cordialement,<br />Franck</p>
        <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #737373;">
          Ceci est un message automatique, merci de ne pas y répondre.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(userMailOptions)
    return { success: true }
  } catch (error) {
    console.error("[contact] send failed:", error instanceof Error ? error.message : error)
    return { error: "Erreur lors de l'envoi du message" }
  }
}

const directLinks = [
  {
    label: "Email",
    value: AUTHOR.email,
    href: `mailto:${AUTHOR.email}`,
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/franck-vienot",
    href: AUTHOR.linkedin,
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: `@${AUTHOR.github}`,
    href: `https://github.com/${AUTHOR.github}`,
    icon: Github,
    external: true,
  },
  ...(AUTHOR.phone
    ? [
        {
          label: "Téléphone",
          value: AUTHOR.phone,
          href: `tel:${AUTHOR.phone}`,
          icon: Phone,
        },
      ]
    : []),
]

export default function Contact() {
  const actionData = useActionData<ActionData>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state !== "idle"
  const formRef = useRef<HTMLFormElement>(null)

  // Set the timestamp client-side after mount so the 5s honeypot check
  // can't be bypassed by a bot scraping the SSR-rendered HTML for a stale
  // value. Each page view gets its own start timestamp.
  useEffect(() => {
    const input = formRef.current?.querySelector<HTMLInputElement>('input[name="timestamp"]')
    if (input) input.value = Date.now().toString()
  }, [])

  useEffect(() => {
    if (actionData?.success) formRef.current?.reset()
  }, [actionData?.success])

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-24 sm:pt-32 dark:bg-neutral-900">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-wider text-neutral-500">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
            Discutons.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            Mission freelance, projet santé, archi cloud, outillage dev, ou simple échange — le plus
            rapide est l&apos;email. Pour tout ce qui dépasse trois lignes, le formulaire en bas de
            page passe par la même boîte.
          </p>
        </header>

        <ul className="mb-16 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {directLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between py-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    size={18}
                    className="text-neutral-400 group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa]"
                    aria-hidden
                  />
                  <span className="text-xs uppercase tracking-wider text-neutral-500">
                    {link.label}
                  </span>
                </div>
                <span className="text-sm text-neutral-700 group-hover:text-[#2563eb] dark:text-neutral-300 dark:group-hover:text-[#60a5fa]">
                  {link.value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <section aria-labelledby="form-heading">
          <h2
            id="form-heading"
            className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            Formulaire
          </h2>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            Réponse sous 48 h en semaine. Anti-spam : honeypot + délai minimal + cap par IP.
          </p>

          <Form ref={formRef} method="post" className="space-y-5">
            <Field id="name" label="Nom" type="text" required />
            <Field id="email" label="Email" type="email" required />
            <Field id="subject" label="Sujet" type="text" required />

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                minLength={10}
                maxLength={1000}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <p className="mt-1 text-xs text-neutral-500">10 à 1000 caractères. Pas d&apos;URL.</p>
            </div>

            {/* Honeypots — hidden from users, attractive to bots. */}
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            <input type="hidden" name="timestamp" defaultValue="" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={14} aria-hidden />
              {isSubmitting ? "Envoi…" : "Envoyer"}
            </button>

            {actionData?.success ? (
              <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
                Message envoyé. À très bientôt.
              </p>
            ) : null}
            {actionData?.error ? (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {actionData.error}
              </p>
            ) : null}
          </Form>
        </section>
      </div>
    </main>
  )
}

function Field({
  id,
  label,
  type,
  required,
}: {
  id: string
  label: string
  type: "text" | "email"
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
      />
    </div>
  )
}

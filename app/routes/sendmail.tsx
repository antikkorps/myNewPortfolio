import { type ActionFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { motion } from "framer-motion"
import { Linkedin, Mail, MapPin, Phone, Send } from "lucide-react"
import nodemailer from "nodemailer"
import { useEffect, useRef, useState } from "react"

export async function loader() {
  return {
    phoneNumber: process.env.PHONE_NUMBER,
    linkedinUrl: process.env.LINKEDIN_URL,
  }
}

interface ActionData {
  success?: boolean
  error?: string
}

export function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return regex.test(email)
}

export function sanitizeInput(input: string) {
  const sanitized = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
  return sanitized
}

const EmailInput = () => {
  const [isValid, setIsValid] = useState(true)

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2"
      >
        Email
      </label>
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type="email"
        id="email"
        name="email"
        required
        onChange={(e) => setIsValid(isValidEmail(e.target.value))}
        className={`w-full px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 
                     border ${
                       isValid
                         ? "border-neutral-200 dark:border-neutral-600"
                         : "border-red-500"
                     } 
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     text-neutral-900 dark:text-white
                     transition-all duration-200`}
      />
      {!isValid && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          Veuillez entrer une adresse email valide
        </motion.p>
      )}
    </div>
  )
}

const spamWords = [
  "crypto",
  "bitcoin",
  "casino",
  "viagra",
  "forex",
  "investment",
  "lottery",
  "prize",
  "winner",
].join("|")

function validateMessage(message: string) {
  // Vérifiez la longueur et le contenu
  if (message.length < 10 || message.length > 1000) return false
  if (message.includes("http") || message.includes("www.")) return false
  const containsSpamWords = new RegExp(`\\b(${spamWords})\\b`, "i").test(message)
  const tooManyUrls = (message.match(/\b(?:https?|ftp):\/\/|www\./g) || []).length > 0
  const tooManyEmails =
    (message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).length > 1

  return !(containsSpamWords || tooManyUrls || tooManyEmails)
}

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
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

  // Validation email
  if (!email || !isValidEmail(email)) {
    return { error: "Adresse email invalide" }
  }

  if (!validateMessage(message!)) {
    return { error: "Message invalide" }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    bcc: process.env.EMAIL_BCC,
    subject: `${subject} - Message de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Nouveau message de contact</h2>
        
        <div style="margin: 20px 0;">
          <p style="font-weight: bold; color: #007bff;">De :</p>
          <p style="margin: 5px 0 15px 0;">${name}</p>
          
          <p style="font-weight: bold; color: #007bff;">Email :</p>
          <p style="margin: 5px 0 15px 0;"><a href="mailto:${email}" style="color: #666; text-decoration: none;">${email}</a></p>
          
          <p style="font-weight: bold; color: #007bff;">Sujet :</p>
          <p style="margin: 5px 0 15px 0;">${subject}</p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="font-weight: bold; color: #007bff;">Message :</p>
          <p style="white-space: pre-line; color: #333;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>Message envoyé depuis ton portfolio</p>
        </div>
      </div>
    `,
  }

  // Email de confirmation pour le contact
  const userMailOptions = {
    from: `"Ne pas répondre" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email,
    subject: `Merci pour votre message`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Merci pour votre message</h2>
        
        <div style="margin: 20px 0; color: #333;">
          <p>Bonjour ${name},</p>
          <p>Je vous remercie pour votre message concernant "${subject}".</p>
          <p>Je reviendrai vers vous dans les meilleurs délais.</p>
          <p>Cordialement,</p>
          <p>Franck</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(userMailOptions)
    console.log({ name, email, subject, message })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erreur lors de l'envoi du message" }
  }
}

const ContactPage = () => {
  const { phoneNumber, linkedinUrl } = useLoaderData<typeof loader>()
  const formRef = useRef<HTMLFormElement>(null)
  const actionData = useActionData<ActionData>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  useEffect(() => {
    const timestampInput = document.querySelector(
      'input[name="timestamp"]'
    ) as HTMLInputElement
    if (timestampInput) {
      timestampInput.value = Date.now().toString()
    }
  }, [])

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "franckvienot7@gmail.com",
      href: "mailto:franckvienot7@gmail.com",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: phoneNumber,
      href: `tel:${phoneNumber}`,
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Le Mans, France",
      href: "https://www.google.fr/maps/@47.98199,0.1133002,12z?entry=ttu&g_ep=EgoyMDI0MTIwNC4wIKXMDSoASAFQAw%3D%3D",
    },
  ] as const

  const socials = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: linkedinUrl,
    },
  ] as const

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset()
    }
  }, [actionData?.success])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 pt-12 px-4 md:px-8"
    >
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mt-12 mb-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-3">
            Contactez-moi
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto text-center">
            Envie de créer ensemble ? Je suis disponible pour vos projets photo et vidéo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="relative"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-5">
              <Form method="post" className="space-y-4" ref={formRef}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2"
                  >
                    Nom complet
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 
                             border border-neutral-200 dark:border-neutral-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             text-neutral-900 dark:text-white
                             transition-all duration-200"
                  />
                </div>

                <EmailInput />

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2"
                  >
                    Sujet
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 
                             border border-neutral-200 dark:border-neutral-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             text-neutral-900 dark:text-white
                             transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2"
                  >
                    Message
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 
                             border border-neutral-200 dark:border-neutral-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             text-neutral-900 dark:text-white
                             transition-all duration-200 resize-none"
                  />
                </div>

                <input
                  type="text"
                  name="honeypot"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Nouveau champ honeypot */}
                <input
                  type="text"
                  name="website"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Champ timestamp */}
                <input type="hidden" name="timestamp" value="" />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-lg bg-orange-500 hover:bg-orange-700 
                           dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium
                           flex items-center justify-center gap-2 transition-colors duration-200
                           disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </motion.button>

                {actionData?.success && (
                  <>
                    {/* Déplacer le reset dans un useEffect */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 dark:text-green-400 text-center mt-4"
                    >
                      Votre message a été envoyé avec succès !
                    </motion.div>
                  </>
                )}

                {actionData?.error && (
                  <div className="text-red-600 dark:text-red-400 text-center mt-4">
                    {actionData.error}
                  </div>
                )}
              </Form>
            </div>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-5">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Coordonnées
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <info.icon className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {info.label}
                      </p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-5">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Réseaux sociaux
              </h3>
              <div className="flex flex-wrap gap-4">
                {socials.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-neutral-50 dark:bg-neutral-700 
                             text-neutral-600 dark:text-neutral-300
                             hover:bg-blue-50 dark:hover:bg-blue-900/30
                             hover:text-blue-600 dark:hover:text-blue-400
                             transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContactPage

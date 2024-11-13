import { useLoaderData } from "@remix-run/react"
import { Github, Linkedin, Mail, Phone } from "lucide-react"
import { useState } from "react"
import AnimatedProfile from "../components/AnimatedProfil"

export async function loader() {
  return {
    githubUsername: process.env.GITHUB_USERNAME,
    linkedinUrl: process.env.LINKEDIN_URL,
    email: process.env.EMAIL,
    phone: process.env.PHONE,
    name: process.env.NAME,
  }
}

const ContactPage = () => {
  const { githubUsername, linkedinUrl, email, phone, name } =
    useLoaderData<typeof loader>()
  const [activeSection, setActiveSection] = useState<number | null>(null)

  const contactLinks = [
    {
      title: "Github",
      icon: Github,
      href: `https://github.com/${githubUsername}`,
      description: "Explorer mes projets open source et contributions",
      details: `@${githubUsername}`,
    },
    {
      title: "LinkedIn",
      icon: Linkedin,
      href: linkedinUrl,
      description: "Mon parcours professionnel et mes compétences",
      details: name,
    },
    {
      title: "Email",
      icon: Mail,
      href: `mailto:${email}`,
      description: "Me contacter directement par email",
      details: `mailto:${email}`,
    },
    {
      title: "Téléphone",
      icon: Phone,
      href: `tel:${phone}`,
      description: "Pour un échange direct et rapide",
      details: phone,
    },
  ]

  return (
    <div className="min-h-screen relative top-10 sm:top-20  bg-neutral-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        {/* Image de fond avec effet parallaxe */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-neutral-900/70" />
        </div>

        {/* Contenu Hero */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <AnimatedProfile
            name="Franck Vienot"
            imageUrl="../../public/images/profil/profil.webp"
          />

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{name}</h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-md">
            Développeur Full Stack passionné par la création d&apos;expériences web
            innovantes
          </p>
        </div>

        {/* Dégradé de transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>

      {/* Section Contact */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactLinks.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              target={
                link.title !== "Téléphone" && link.title !== "Email"
                  ? "_blank"
                  : undefined
              }
              rel={
                link.title !== "Téléphone" && link.title !== "Email"
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group"
              onMouseEnter={() => setActiveSection(index)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div
                className={`relative overflow-hidden rounded-xl transition-all duration-500
                bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50
                hover:border-purple-500/50 hover:bg-neutral-800/80
                ${activeSection === index ? "shadow-lg shadow-purple-500/10" : ""}`}
              >
                {/* Contenu principal */}
                <div className="p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg bg-purple-500/10 
                      transition-all duration-500 group-hover:scale-110 
                      ${activeSection === index ? "bg-purple-500/20" : ""}`}
                    >
                      <link.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-1">{link.title}</h2>
                      <p className="text-sm text-neutral-400 mb-2">{link.description}</p>
                      <span className="text-sm font-mono text-purple-400">
                        {link.details}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Effet de bordure animée */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r 
                  from-purple-500 to-blue-500 transition-all duration-500
                  ${activeSection === index ? "w-full" : "w-0"}`}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-neutral-500">
          <p>© 2024 • Conçu et développé avec passion</p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

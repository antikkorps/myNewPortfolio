import type { MetaFunction } from "@remix-run/node"
import { motion } from "motion/react"
import { ProjectCard, ProjectCardProps } from "~/components/ProjectCard"

export const meta: MetaFunction = () => {
  return [
    { title: "Mes projets" },
    { name: "description", content: "Vous trouverez ici mes différents projets" },
  ]
}

export default function ProjetsPage() {
  const projects: ProjectCardProps[] = [
    {
      title: "Sascha Fait des vidéos",
      description: "Portfolio pour un vidéaste en Remix et React et déployé sur Vercel",
      imageUrl: "/images/projets/sascha.webp",
      technologies: [
        { name: "Remix", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "Taiwind", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/antikkorps/saschaFaitDesVideos_remix",
      liveUrl: "https://saschafaitdesvideos.com/",
      type: "featured",
    },
    {
      title: "Garage Parrot",
      description: "site pour un garage développé en VueJS et en NestJS",
      imageUrl: "/images/projets/garage_parrot.webp",
      technologies: [
        { name: "Nest", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "VueJS", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/antikkorps/garage_front",
      liveUrl: "https://garagefront.netlify.app/",
      type: "featured",
    },
    {
      title: "MyMemory-Nuxt",
      description: "Un mini Site de memory développé en NuxtJS",
      imageUrl: "/images/projets/myMemory.webp",
      technologies: [
        { name: "Nuxt", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "VueJS", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/antikkorps/my-memory-nuxt",
      liveUrl: "https://my-memory-nuxt.vercel.app/",
      type: "featured",
    },
    {
      title: "Mon ancien portfolio",
      description: "l'ancienne version de mon portfolio développé avec Astro",
      imageUrl: "/images/projets/monPortfolio.webp",
      technologies: [
        { name: "Astro", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "TypeScript", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/antikkorps/monPortefolio",
      liveUrl: "https://dev2go.netlify.app",
      type: "featured",
    },
    {
      title: "Le Site de l'asso",
      description: "Un site pour une association fictive",
      imageUrl: "/images/projets/lesitedelasso.webp",
      technologies: [
        { name: "Html", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "Bootstrap", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/antikkorps/leSiteDeLasso",
      liveUrl: "https://lesitedelasso.netlify.app/",
      type: "featured",
    },
    {
      title: "MaFormationImmo",
      description: "Un site autour de l'offre de formation en immobilier",
      imageUrl: "/images/projets/maformationimmo.webp",
      technologies: [
        { name: "Wordpress", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "php", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      liveUrl: "https://maformationimmo.info/",
      type: "featured",
    },
    {
      title: "SaveUsLife",
      description: "Un site pour un magazine sur la thématique de l'environnement",
      imageUrl: "/images/projets/saveusLife.webp",
      technologies: [
        { name: "Wordpress", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "Bootstrap", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      liveUrl: "http://save-us.life",
      type: "featured",
    },
    {
      title: "Safety Case Solutions",
      description: "Un site proposant des malettes de sécurité",
      imageUrl: "/images/projets/safetyCaseSolutions.webp",
      technologies: [
        { name: "woocommerce", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "php", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      liveUrl: "https://safety-case-solutions.com/",
      type: "featured",
    },
    {
      title: "Nouvelles Donnes Formation",
      description: "Site pour une entreprise de formation",
      imageUrl: "/images/projets/nouvellesdonnesformation.webp",
      technologies: [
        { name: "Wordpress", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "Bootstrap", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      liveUrl: "https://nouvellesdonnesformation.ndcampus.fr/",
      type: "featured",
    },
    {
      title: "Nouvelles Donnes site corpo",
      description: "Site corporate pour une entreprise de formation",
      imageUrl: "/images/projets/nouvellesdonnes.webp",
      technologies: [
        { name: "wix", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "velo", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      liveUrl: "https://www.nouvellesdonnes.com/",
      type: "featured",
    },
  ]

  const leftColumnProjects = projects.filter((_, index) => index % 2 === 0)
  const rightColumnProjects = projects.filter((_, index) => index % 2 === 1)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="relative top-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <motion.div
        className="relative top-6 sm:top-12 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Mes Projets !
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Colonne gauche */}
          <div className="space-y-6 lg:space-y-8">
            {leftColumnProjects.map((project) => (
              <motion.div key={project.title} variants={cardVariants}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>

          {/* Colonne droite avec décalage */}
          <div className="space-y-6 lg:space-y-8 lg:mt-12">
            {rightColumnProjects.map((project) => (
              <motion.div key={project.title} variants={cardVariants}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

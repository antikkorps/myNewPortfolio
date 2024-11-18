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
      title: "Mon Super Projet",
      description: "Une description captivante de mon projet...",
      imageUrl: "/api/placeholder/800/600",
      technologies: [
        { name: "React", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "TypeScript", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/monprojet",
      liveUrl: "https://monprojet.com",
      type: "featured",
    },
    {
      title: "Mon Super Projet",
      description: "Une description captivante de mon projet...",
      imageUrl: "/api/placeholder/800/600",
      technologies: [
        { name: "React", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "TypeScript", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/monprojet",
      liveUrl: "https://monprojet.com",
      type: "featured",
    },
    {
      title: "Mon Super Projet",
      description: "Une description captivante de mon projet...",
      imageUrl: "/api/placeholder/800/600",
      technologies: [
        { name: "React", color: "bg-blue-400 dark:bg-blue-900/30" },
        { name: "TypeScript", color: "bg-blue-400 dark:bg-blue-900/30" },
      ],
      githubUrl: "https://github.com/monprojet",
      liveUrl: "https://monprojet.com",
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

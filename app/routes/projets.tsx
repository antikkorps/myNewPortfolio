import type { MetaFunction } from "react-router"
import { ExternalLink, Github, Play } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { VideoDialog } from "~/components/VideoDialog"
import { pageMeta } from "~/lib/seo"

export const meta: MetaFunction = () =>
  pageMeta({
    title: "Projets",
    description:
      "Sélection de projets web réalisés par Franck Vienot : LogiBOP, sites Remix, Vue/Nuxt, NestJS, WordPress et autres expérimentations.",
    path: "/projets",
  })

type Status = "live" | "archived" | "tool" | "wip"

interface Project {
  title: string
  description: string
  technologies: string[]
  status: Status
  liveUrl?: string
  videoUrl?: string
  githubUrl?: string
  year?: string
}

const projects: Project[] = [
  {
    title: "LogiBOP",
    description:
      "Application de préparation des interventions chirurgicales pour environnement hospitalier. Quasar / Express, déployée sur Azure.",
    technologies: ["Quasar", "Express", "Azure", "Santé"],
    status: "live",
    videoUrl: "https://youtu.be/lM4MR00hEQo",
  },
  {
    title: "GoTK",
    description:
      "Proxy CLI en Go pour optimiser les sorties de commandes envoyées aux agents LLM. Réduit le bruit (ANSI, dedup, stack traces) avant qu'il n'atteigne le contexte du modèle.",
    technologies: ["Go", "CLI", "MCP"],
    status: "live",
    liveUrl: "https://antikkorps.github.io/GoTK/",
    githubUrl: "https://github.com/antikkorps/GoTK",
  },
  {
    title: "LMS Monorepo",
    description:
      "Plateforme LMS dockerisée en monorepo Nx (TypeScript, Vue, Astro). En ligne en pré-prod, pas encore basculée en production.",
    technologies: ["Nx", "TypeScript", "Vue.js", "Astro", "Docker"],
    status: "live",
    liveUrl: "https://iqon-ia.com/",
    githubUrl: "https://github.com/antikkorps/lms_monorepo",
  },
  {
    title: "simpleClone",
    description:
      "Outil de synchronisation unidirectionnelle de dossiers pour Windows. Surveille un dossier source et réplique automatiquement les changements vers une destination (clé USB, etc.).",
    technologies: ["Python", "Windows"],
    status: "tool",
    githubUrl: "https://github.com/antikkorps/simpleClone",
  },
  {
    title: "auto-ftp",
    description:
      "Serveur FTP local zero-config packagé en exécutable Windows unique, conçu pour recevoir des fichiers depuis EasyVIEW tournant dans une VM VirtualBox.",
    technologies: ["Go", "Wails", "Windows"],
    status: "tool",
    githubUrl: "https://github.com/antikkorps/auto-ftp",
  },
  {
    title: "Eli CMS",
    description:
      "Headless CMS avec Custom Post Types dynamiques stockés en JSON — zéro migration par nouveau type de contenu. Koa.js + Drizzle (Postgres), front Nuxt 3.",
    technologies: ["Koa.js", "TypeScript", "PostgreSQL", "Drizzle", "Nuxt 3"],
    status: "wip",
    githubUrl: "https://github.com/antikkorps/eli-cms",
  },
  {
    title: "OPEx CRM",
    description:
      "CRM pensé pour la gestion des relations avec des établissements médicaux (hôpitaux, cliniques). Monorepo Vue 3 / Vuetify + Koa.js + PostgreSQL.",
    technologies: ["Vue.js", "Vuetify", "Koa.js", "PostgreSQL", "Socket.io"],
    status: "wip",
    githubUrl: "https://github.com/antikkorps/crm_monorepo",
  },
  {
    title: "La Kokosphere",
    description:
      "Site pour une hypnothérapeute, Astro + Tailwind + Sanity CMS, déployé sur Netlify.",
    technologies: ["Astro", "Tailwind", "Sanity CMS"],
    status: "live",
    liveUrl: "https://la-kokosphere.fr/",
    githubUrl: "https://github.com/antikkorps/la_kokosphere",
  },
  {
    title: "Sascha Fait des vidéos",
    description: "Portfolio pour un vidéaste, Remix + Tailwind, déployé sur Vercel.",
    technologies: ["Remix", "Tailwind"],
    status: "live",
    liveUrl: "https://saschafaitdesvideos.com/",
    githubUrl: "https://github.com/antikkorps/saschaFaitDesVideos_remix",
  },
  {
    title: "Garage Parrot",
    description: "Site pour un garage avec front Vue.js et back NestJS.",
    technologies: ["NestJS", "Vue.js"],
    status: "live",
    liveUrl: "https://garagefront.netlify.app/",
    videoUrl: "https://youtu.be/bd1PGLu8U9s",
    githubUrl: "https://github.com/antikkorps/garage_front",
  },
  {
    title: "MyMemory-Nuxt",
    description: "Mini jeu de memory développé en Nuxt.",
    technologies: ["Nuxt", "Vue.js"],
    status: "live",
    liveUrl: "https://my-memory-nuxt.vercel.app/",
    githubUrl: "https://github.com/antikkorps/my-memory-nuxt",
  },
  {
    title: "Ancien portfolio",
    description: "Version précédente du portfolio, faite en Astro.",
    technologies: ["Astro", "TypeScript"],
    status: "live",
    liveUrl: "https://dev2go.netlify.app/",
    githubUrl: "https://github.com/antikkorps/monPortefolio",
  },
  {
    title: "Le Site de l'asso",
    description: "Site pour une association fictive — exercice HTML/Bootstrap.",
    technologies: ["HTML", "Bootstrap"],
    status: "live",
    liveUrl: "https://lesitedelasso.netlify.app/",
    githubUrl: "https://github.com/antikkorps/leSiteDeLasso",
  },
  {
    title: "MaFormationImmo",
    description: "Site éditorial autour de l'offre de formation en immobilier.",
    technologies: ["WordPress", "PHP"],
    status: "archived",
    videoUrl: "",
  },
  {
    title: "SaveUsLife",
    description: "Magazine en ligne sur la thématique environnement.",
    technologies: ["WordPress", "Bootstrap"],
    status: "live",
    liveUrl: "https://save-us.life/",
  },
  {
    title: "Nouvelles Donnes Formation",
    description: "Site vitrine pour une entreprise de formation.",
    technologies: ["WordPress", "Bootstrap"],
    status: "archived",
    videoUrl: "https://youtu.be/Iaf64QI1xPU",
  },
  {
    title: "Nouvelles Donnes corporate",
    description: "Site corporate Wix/Velo pour une entreprise de formation.",
    technologies: ["Wix", "Velo"],
    status: "archived",
    videoUrl: "https://youtu.be/_UzeCw7OJBA",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
}

const statusConfig: Record<Status, { label: string; dot: string; aria: string }> = {
  live: {
    label: "En ligne",
    dot: "bg-emerald-500",
    aria: "Site en ligne",
  },
  archived: {
    label: "Archivé",
    dot: "bg-neutral-400 dark:bg-neutral-600",
    aria: "Site archivé",
  },
  tool: {
    label: "Outil",
    dot: "bg-sky-500",
    aria: "Outil / utilitaire",
  },
  wip: {
    label: "En développement",
    dot: "bg-amber-500",
    aria: "Projet en cours de développement",
  },
}

function StatusBadge({ status }: { status: Status }) {
  const { label, dot, aria } = statusConfig[status]
  return (
    <span
      className="blog-ui flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500"
      aria-label={aria}
    >
      <span aria-hidden className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function ProjectRow({
  project,
  onPlayVideo,
}: {
  project: Project
  onPlayVideo: (project: Project) => void
}) {
  return (
    <motion.article
      variants={itemVariants}
      className="group flex flex-col gap-3 border-b border-neutral-200 py-6 transition-colors last:border-b-0 hover:bg-white dark:border-neutral-800 dark:hover:bg-neutral-800/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3">
            <StatusBadge status={project.status} />
            {project.year ? (
              <span className="text-xs text-neutral-500">· {project.year}</span>
            ) : null}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {project.title}
          </h3>
          <p className="mt-1 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            {project.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-700 transition-colors hover:text-[#2563eb] dark:text-neutral-300 dark:hover:text-[#60a5fa]"
            >
              <ExternalLink size={14} aria-hidden /> Live
            </a>
          ) : null}
          {project.videoUrl ? (
            <button
              type="button"
              onClick={() => onPlayVideo(project)}
              className="inline-flex items-center gap-1.5 text-neutral-700 transition-colors hover:text-[#2563eb] dark:text-neutral-300 dark:hover:text-[#60a5fa]"
            >
              <Play size={14} aria-hidden /> Démo vidéo
            </button>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-700 transition-colors hover:text-[#2563eb] dark:text-neutral-300 dark:hover:text-[#60a5fa]"
            >
              <Github size={14} aria-hidden /> Code source
            </a>
          ) : null}
          {project.status === "archived" && !project.videoUrl ? (
            <span className="text-xs italic text-neutral-500 dark:text-neutral-500">
              Démo vidéo à venir
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export default function ProjetsPage() {
  const [activeVideo, setActiveVideo] = useState<Project | null>(null)
  const live = projects.filter((p) => p.status === "live")
  const toolsAndWip = projects.filter((p) => p.status === "tool" || p.status === "wip")
  const archived = projects.filter((p) => p.status === "archived")

  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-24 dark:bg-neutral-900">
      <VideoDialog
        url={activeVideo?.videoUrl ?? null}
        title={activeVideo?.title ?? ""}
        onClose={() => setActiveVideo(null)}
      />
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-wider text-neutral-500">Projets</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Ce que j&apos;ai construit
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Sélection de projets web, classés par état. Pour les sites archivés, je publie
            progressivement des démos vidéo en remplacement.
          </p>
        </header>

        <section className="mb-16">
          <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              En ligne
            </h2>
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {live.length} projet{live.length > 1 ? "s" : ""}
            </span>
          </div>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {live.map((p) => (
              <ProjectRow key={p.title} project={p} onPlayVideo={setActiveVideo} />
            ))}
          </motion.div>
        </section>

        <section className="mb-16">
          <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Outils & projets en cours
            </h2>
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {toolsAndWip.length} projet{toolsAndWip.length > 1 ? "s" : ""}
            </span>
          </div>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {toolsAndWip.map((p) => (
              <ProjectRow key={p.title} project={p} onPlayVideo={setActiveVideo} />
            ))}
          </motion.div>
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Archives
            </h2>
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {archived.length} projet{archived.length > 1 ? "s" : ""}
            </span>
          </div>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {archived.map((p) => (
              <ProjectRow key={p.title} project={p} onPlayVideo={setActiveVideo} />
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  )
}

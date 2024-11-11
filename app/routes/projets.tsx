import type { MetaFunction } from "@remix-run/node"
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
    // Ajoutez autant de projets que vous voulez
  ]

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="relative top-6 sm:top-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold my-4 text-gray-900 dark:text-white">
          Mes Projets !
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </div>
  )
}

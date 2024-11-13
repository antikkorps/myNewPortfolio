import { ExternalLink, Folder, Github } from "lucide-react"
import { useState } from "react"

interface Technology {
  name: string
  color: string
}

export interface ProjectCardProps {
  title: string
  description: string
  imageUrl?: string
  technologies: Technology[]
  githubUrl?: string
  liveUrl?: string
  type: "featured" | "personal"
}

export const ProjectCard = ({
  title,
  description,
  imageUrl,
  technologies,
  githubUrl,
  liveUrl,
  type,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-500 
        ${type === "featured" ? "md:col-span-2" : ""}
        bg-white dark:bg-neutral-800/50 hover:shadow-xl
        border border-neutral-200 dark:border-neutral-700`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image de fond avec overlay */}
      {imageUrl ? (
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500
            group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent 
              opacity-60 transition-opacity duration-500"
          />
        </div>
      ) : (
        <div
          className="h-64 bg-gradient-to-br from-neutral-100 to-neutral-200 
          dark:from-neutral-800 dark:to-neutral-700 relative overflow-hidden"
        >
          <Folder
            className="absolute bottom-4 right-4 w-32 h-32 text-neutral-300 
              dark:text-neutral-600 transform -rotate-12"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="p-6 relative">
        {/* Type de projet */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full 
              ${
                type === "featured"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-600"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-600"
              }`}
          >
            {type === "featured" ? "Projet Principal" : "Projet Personnel"}
          </span>
        </div>

        {/* Titre et Description */}
        <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-200 ">
          {title}
        </h3>
        <p className="mb-4 text-neutral-700 dark:text-neutral-200">{description}</p>

        {/* Technologies utilisées */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span key={tech.name} className={`px-2 py-1 text-sm rounded ${tech.color}`}>
              {tech.name}
            </span>
          ))}
        </div>

        {/* Liens */}
        <div
          className={`flex gap-4 transition-all duration-300 
            ${isHovered ? "opacity-100" : "opacity-70"}`}
        >
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 
                dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">Code source</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 
                dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm">Voir le projet</span>
            </a>
          )}
        </div>
      </div>

      {/* Bordure d'accent animée */}
      <div
        className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ease-out
          ${type === "featured" ? "bg-purple-500" : "bg-blue-500"}
          ${isHovered ? "w-full" : "w-0"}`}
      />
    </div>
  )
}

import { Brain, Code, Coffee, Heart, Lightbulb, Music } from "lucide-react"
import { useEffect, useState } from "react"

const IconContainer = ({
  icon,
  isActive,
  color,
}: {
  icon: React.ReactNode
  isActive: boolean
  color: string
}) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Cercle de fond avec glow effect */}
      <div
        className={`absolute inset-0 rounded-full opacity-0 transition-all duration-500 ease-out
          group-hover:opacity-20 ${color}`}
        style={{
          transform: "scale(1.5)",
          filter: "blur(4px)",
        }}
      />

      {/* L'icône elle-même */}
      <div
        className={`relative transition-all duration-300 ease-out transform
          group-hover:scale-105
          ${isActive ? "scale-110" : ""}
        `}
      >
        {icon}
      </div>

      {/* Effet de pulsation subtil */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000
          ${color} opacity-0 scale-0
          group-hover:opacity-10 group-hover:scale-150
          ${isActive ? "animate-slow-pulse" : ""}
        `}
      />
    </div>
  )
}

const About = () => {
  const [activeStory, setActiveStory] = useState<number | null>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting && !visibleCards.includes(index)) {
            setVisibleCards((prev) => [...prev, index])
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    )

    document.querySelectorAll("[data-index]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [visibleCards])

  const stories = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Ce qui me fascine",
      content:
        "Le travail entre l'objectif et la réalisation. Je suis captivé par la façon dont le code peut créer des expériences uniques qui touchent les gens.",
      color:
        "bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-800/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Mon approche",
      content:
        "Je ne me contente pas de coder, je construis également des solutions. Chaque projet est une nouvelle aventure qui me permet d'explorer des technologies émergentes et de repousser mes limites.",
      color:
        "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Ce qui me motive",
      content:
        "Créer des expériences qui font sourire les utilisateurs. La satisfaction de résoudre des problèmes complexes et de voir mes projets prendre vie.",
      color:
        "bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-800/40",
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "En dehors du code",
      content:
        "Amateur de thé, j'aime allier les deux. Je suis également un gros lecteur et j'aime la musique.",
      color:
        "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Mes projets fous",
      content:
        "Je rêve de créer une application qui transforme la façon dont les gens interagissent avec la technologie. J'ai toujours un projet personnel en cours d'expérimentation.",
      color:
        "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Mon flow",
      content:
        "Je code mieux avec de la musique plutôt du rock. Mon setup idéal : un bon casque, Visual Studio Code en mode zen, et une tasse de thé bien chaude.",
      color:
        "bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-800/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      iconBg: "bg-teal-500",
    },
  ]

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* En-tête créatif */}
        <div className="mb-16 relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-900 text-white">
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Salut! 👋</h1>
            <p className="text-xl leading-relaxed animate-fade-in-up opacity-90">
              Je m&apos;appelle Franck et je transforme vos idées en expériences
              numériques.
              <br />
              Pas de blablah ici - juste une passion pour le développement web
              <br />
              et une curiosité sans fin de ce que les technologies peuvent apporter à
              votre business.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-gray-200 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-gray-200 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2 animate-pulse delay-150" />
        </div>

        {/* Grille interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div
              key={index}
              data-index={index}
              className={`${story.color} rounded-xl p-6 
              transform transition-all duration-500 cursor-pointer
              opacity-0 translate-y-8 group relative
              ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : ""}
              ${activeStory === index ? "scale-102 shadow-lg" : "hover:shadow-md"}
              `}
              onClick={() => setActiveStory(activeStory === index ? null : index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveStory(activeStory === index ? null : index)
                }
              }}
            >
              <div className={`${story.iconColor} mb-4 flex items-start`}>
                <IconContainer
                  icon={story.icon}
                  isActive={activeStory === index}
                  color={story.iconBg}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-700 flex items-center gap-2">
                {story.title}
                {/* Indicateur d'expansion */}
                <span
                  className={`inline-flex items-center transition-transform duration-300 text-gray-400 dark:text-gray-500
                  ${activeStory === index ? "rotate-180" : ""}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </h3>

              {/* Contenu avec un dégradé au bas quand non-actif */}
              <div className="relative">
                <p
                  className={`text-gray-700 dark:text-gray-300 transition-all duration-300
                  ${
                    activeStory === index
                      ? "h-auto opacity-100 translate-y-0"
                      : "h-12 overflow-hidden opacity-70 translate-y-2"
                  }`}
                >
                  {story.content}
                </p>
              </div>

              {/* Indicateur textuel */}
              <div
                className={`mt-2 text-sm font-medium
    bg-gradient-to-r from-purple-500 to-blue-500 
    dark:from-purple-400 dark:to-blue-400
    bg-clip-text text-transparent
    transition-all duration-300 transform
    hover:scale-105
    ${activeStory === index ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
              >
                Cliquez pour en lire plus
              </div>
            </div>
          ))}
        </div>

        {/* Citation personnelle */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl font-light italic text-gray-600 dark:text-gray-400">
            &quot;Je ne compte pas mes compétences en pourcentages, je les mesure en
            problèmes résolus et en sourires créés.&quot;
          </blockquote>
        </div>
      </div>
    </div>
  )
}

export default About

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

const VintageTechCards = () => {
  const [selectedTech, setSelectedTech] = useState<{
    id: number
    name: string
    bgColor: string
    borderColor: string
    accentColor: string
    shadowColor: string
    stripes: string
    description: string
    powers: string[]
    talents: string[]
  } | null>(null)

  const techs = [
    {
      id: 1,
      name: "Vue.js",
      bgColor: "bg-emerald-200 dark:bg-emerald-900",
      borderColor: "border-emerald-950 dark:border-emerald-400",
      accentColor:
        "from-emerald-950 to-emerald-900 dark:from-emerald-400 dark:to-emerald-500",
      shadowColor: "shadow-emerald-950 dark:shadow-emerald-400",
      stripes:
        "from-emerald-300 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900",
      description: "Framework JavaScript progressif",
      powers: [
        "Réactivité instantanée",
        "Composants réutilisables",
        "Architecture flexible",
      ],
      talents: [
        "Courbe d'apprentissage douce",
        "Performances optimales",
        "Écosystème riche",
      ],
    },
    {
      id: 2,
      name: "Nuxt",
      bgColor: "bg-green-200 dark:bg-green-900",
      borderColor: "border-green-950 dark:border-green-400",
      accentColor: "from-green-950 to-green-900 dark:from-green-400 dark:to-green-500",
      shadowColor: "shadow-green-950 dark:shadow-green-400",
      stripes: "from-green-300 to-green-200 dark:from-green-800 dark:to-green-900",
      description: "Framework Vue.js pour applications universelles",
      powers: ["Rendu hybride", "Auto-imports magiques", "SEO optimisé"],
      talents: [
        "Directory-based routing",
        "Modes de rendu multiples",
        "Developer experience +++",
      ],
    },
    {
      id: 3,
      name: "Astro",
      bgColor: "bg-orange-200 dark:bg-orange-900",
      borderColor: "border-orange-950 dark:border-orange-400",
      accentColor:
        "from-orange-950 to-orange-900 dark:from-orange-400 dark:to-orange-500",
      shadowColor: "shadow-orange-950 dark:shadow-orange-400",
      stripes: "from-orange-300 to-orange-200 dark:from-orange-800 dark:to-orange-900",
      description: "Framework web pour contenu statique",
      powers: [
        "Islands Architecture",
        "Zéro JavaScript par défaut",
        "Multi-framework support",
      ],
      talents: ["Performance maximale", "SEO parfait", "Content collections"],
    },
    {
      id: 4,
      name: "Remix",
      bgColor: "bg-indigo-200 dark:bg-indigo-900",
      borderColor: "border-indigo-950 dark:border-indigo-400",
      accentColor:
        "from-indigo-950 to-indigo-900 dark:from-indigo-400 dark:to-indigo-500",
      shadowColor: "shadow-indigo-950 dark:shadow-indigo-400",
      stripes: "from-indigo-300 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900",
      description: "Framework full-stack React",
      powers: [
        "Nested routing avancé",
        "Gestion d'erreurs native",
        "Chargement optimisé",
      ],
      talents: ["Server-side rendering", "Progressive enhancement", "Web standards"],
    },
    {
      id: 5,
      name: "Nest.js",
      bgColor: "bg-red-200 dark:bg-red-900",
      borderColor: "border-red-950 dark:border-red-400",
      accentColor: "from-red-950 to-red-900 dark:from-red-400 dark:to-red-500",
      shadowColor: "shadow-red-950 dark:shadow-red-400",
      stripes: "from-red-300 to-red-200 dark:from-red-800 dark:to-red-900",
      description: "Framework Node.js scalable et moderne",
      powers: [
        "Architecture modulaire",
        "Injection de dépendances",
        "Support TypeScript natif",
      ],
      talents: ["Scalabilité enterprise", "Patterns éprouvés", "Testing intégré"],
    },
    {
      id: 6,
      name: "Express",
      bgColor: "bg-gray-200 dark:bg-gray-800",
      borderColor: "border-gray-950 dark:border-gray-400",
      accentColor: "from-gray-950 to-gray-900 dark:from-gray-400 dark:to-gray-500",
      shadowColor: "shadow-gray-950 dark:shadow-gray-400",
      stripes: "from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800",
      description: "Framework web Node.js rapide et minimaliste",
      powers: ["Routing flexible", "Middleware system", "Minimalisme efficace"],
      talents: ["Performance brute", "Extensibilité totale", "Compatibilité universelle"],
    },
    {
      id: 7,
      name: "Tailwind",
      bgColor: "bg-cyan-200 dark:bg-cyan-900",
      borderColor: "border-cyan-950 dark:border-cyan-400",
      accentColor: "from-cyan-950 to-cyan-900 dark:from-cyan-400 dark:to-cyan-500",
      shadowColor: "shadow-cyan-950 dark:shadow-cyan-400",
      stripes: "from-cyan-300 to-cyan-200 dark:from-cyan-800 dark:to-cyan-900",
      description: "Framework CSS utility-first",
      powers: ["Utility-first CSS", "JIT compilation", "Design system intégré"],
      talents: [
        "Productivité maximale",
        "Bundle size optimisé",
        "Personnalisation infinie",
      ],
    },
    {
      id: 8,
      name: "PostgreSQL",
      bgColor: "bg-blue-200 dark:bg-blue-900",
      borderColor: "border-blue-950 dark:border-blue-400",
      accentColor: "from-blue-950 to-blue-900 dark:from-blue-400 dark:to-blue-500",
      shadowColor: "shadow-blue-950 dark:shadow-blue-400",
      stripes: "from-blue-300 to-blue-200 dark:from-blue-800 dark:to-blue-900",
      description: "Système de gestion de base de données",
      powers: ["ACID compliance", "Requêtes complexes", "Extensions puissantes"],
      talents: ["Scalabilité verticale", "JSON natif", "Intégrité des données"],
    },
    {
      id: 9,
      name: "MySQL",
      bgColor: "bg-amber-200 dark:bg-amber-900",
      borderColor: "border-amber-950 dark:border-amber-400",
      accentColor: "from-amber-950 to-amber-900 dark:from-amber-400 dark:to-amber-500",
      shadowColor: "shadow-amber-950 dark:shadow-amber-400",
      stripes: "from-amber-300 to-amber-200 dark:from-amber-800 dark:to-amber-900",
      description: "Base de données relationnelle open-source",
      powers: [
        "Performances rapides",
        "Réplication maître-esclave",
        "Clustering intégré",
      ],
      talents: ["Fiabilité éprouvée", "Support communautaire", "Compatibilité étendue"],
    },
    {
      id: 10,
      name: "Laravel",
      bgColor: "bg-rose-200 dark:bg-rose-900",
      borderColor: "border-rose-950 dark:border-rose-400",
      accentColor: "from-rose-950 to-rose-900 dark:from-rose-400 dark:to-rose-500",
      shadowColor: "shadow-rose-950 dark:shadow-rose-400",
      stripes: "from-rose-300 to-rose-200 dark:from-rose-800 dark:to-rose-900",
      description: "Framework PHP élégant et puissant",
      powers: ["Eloquent ORM", "Artisan CLI", "Blade templating"],
      talents: ["Sécurité robuste", "Queues & jobs", "Écosystème complet"],
    },
    {
      id: 11,
      name: "Docker",
      bgColor: "bg-sky-200 dark:bg-sky-900",
      borderColor: "border-sky-950 dark:border-sky-400",
      accentColor: "from-sky-950 to-sky-900 dark:from-sky-400 dark:to-sky-500",
      shadowColor: "shadow-sky-950 dark:shadow-sky-400",
      stripes: "from-sky-300 to-sky-200 dark:from-sky-800 dark:to-sky-900",
      description: "Plateforme de conteneurisation d'applications",
      powers: ["Conteneurisation légère", "Isolation parfaite", "Déploiement cohérent"],
      talents: ["Scalabilité horizontale", "DevOps friendly", "Configuration portable"],
    },
    {
      id: 12,
      name: "Git",
      bgColor: "bg-purple-200 dark:bg-purple-900",
      borderColor: "border-purple-950 dark:border-purple-400",
      accentColor:
        "from-purple-950 to-purple-900 dark:from-purple-400 dark:to-purple-500",
      shadowColor: "shadow-purple-950 dark:shadow-purple-400",
      stripes: "from-purple-300 to-purple-200 dark:from-purple-800 dark:to-purple-900",
      description: "Système de contrôle de version distribué",
      powers: ["Versioning distribué", "Branches & merging", "Histoire complète"],
      talents: ["Collaboration efficace", "Gestion des conflits", "Workflow flexible"],
    },
  ]

  return (
    <div
      className="min-h-screen w-full flex justify-center items-start bg-orange-100 dark:bg-neutral-900 transition-colors duration-200"
      style={{
        backgroundImage: `
             radial-gradient(#00000010 1px, transparent 1px),
             repeating-linear-gradient(-45deg, #00000005 0px, #00000005 1px, transparent 1px, transparent 6px)
           `,
        backgroundSize: "20px 20px, 10px 10px",
      }}
    >
      <div className="w-full max-w-6xl px-2 sm:px-4 relative top-32 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {techs.map((tech) => (
            <motion.div
              key={tech.id}
              className="relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTech(selectedTech?.id === tech.id ? null : tech)}
            >
              {/* Ombre portée */}
              <div
                className={`
                absolute inset-0 rounded-xl
                ${tech.shadowColor}
                transform translate-x-1 translate-y-1 sm:translate-x-2 sm:translate-y-2
              `}
              ></div>

              {/* Carte principale */}
              <motion.div
                className={`
                  relative z-10
                  h-28 sm:h-36 rounded-xl 
                  ${tech.bgColor}
                  border-4 sm:border-[6px] ${tech.borderColor}
                  flex items-center
                  overflow-hidden
                  p-3 sm:p-4
                  hover:shadow-xl transition-all
                  dark:shadow-lg dark:shadow-black/20
                `}
              >
                {/* Rayures de fond */}
                <div
                  className={`
                  absolute inset-0 
                  bg-gradient-to-br ${tech.stripes}
                  opacity-50
                `}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
                  }}
                />

                {/* Contenu */}
                <div className="relative flex flex-col justify-between h-full w-full">
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
                    style={{
                      fontFamily: '"Lilita One", cursive',
                      textShadow: "1px 1px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    {tech.name}
                  </h3>

                  <div className="flex justify-between items-end w-full">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-white dark:text-opacity-90 line-clamp-2 flex-1 mr-2 font-medium">
                      {tech.description}
                    </p>
                    <div
                      className={`
                      w-8 h-8 sm:w-10 sm:h-10
                      rounded-full flex-shrink-0
                      bg-gradient-to-br ${tech.accentColor}
                      border-2 sm:border-4 ${tech.borderColor}
                      flex items-center justify-center
                      text-white font-bold
                      dark:border-opacity-90
                    `}
                    >
                      ★
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50 dark:bg-black/80"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedTech(null)
              }}
            >
              <motion.div
                className={`
                  w-full max-w-2xl
                  rounded-xl
                  ${selectedTech.bgColor}
                  border-4 sm:border-[6px] ${selectedTech.borderColor}
                  relative
                  max-h-[90vh] overflow-y-auto
                  dark:shadow-2xl dark:shadow-black/50
                `}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Rayures de fond avec opacité réduite en mode sombre */}
                <div
                  className={`
                  absolute inset-0 
                  bg-gradient-to-br ${selectedTech.stripes}
                  opacity-30 dark:opacity-20
                `}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
                  }}
                />

                <div className="relative p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2
                      className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
                      style={{
                        fontFamily: '"Lilita One", cursive',
                        textShadow: "2px 2px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      {selectedTech.name}
                    </h2>
                    <button
                      onClick={() => setSelectedTech(null)}
                      className={`
                        p-2 sm:p-3 rounded-xl
                        bg-gradient-to-br ${selectedTech.accentColor}
                        text-white font-bold
                        border-2 sm:border-4 ${selectedTech.borderColor}
                        hover:scale-105 active:scale-95
                        transition-transform
                        dark:border-opacity-90
                      `}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Super-pouvoirs", items: selectedTech.powers },
                      { title: "Talents spéciaux", items: selectedTech.talents },
                    ].map((section) => (
                      <div
                        key={section.title}
                        className={`
                          p-4 rounded-xl
                          bg-white/70 dark:bg-slate-900/90 backdrop-blur-sm
                          border-2 sm:border-4 ${selectedTech.borderColor}
                          relative
                        `}
                      >
                        <h3
                          className="font-bold text-xl sm:text-2xl mb-3 text-slate-900 dark:text-white"
                          style={{ fontFamily: '"Lilita One", cursive' }}
                        >
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm sm:text-base text-slate-800 dark:text-white dark:text-opacity-90"
                            >
                              <span
                                className={`
                                w-6 h-6 sm:w-8 sm:h-8
                                flex items-center justify-center
                                rounded-full flex-shrink-0
                                bg-gradient-to-br ${selectedTech.accentColor}
                                text-white border-2 ${selectedTech.borderColor}
                                dark:border-opacity-90
                              `}
                              >
                                ★
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VintageTechCards

import { motion } from "framer-motion"
import { useState } from "react"

interface Tech {
  name: string
  description: string
  notes?: string[]
  url?: string
}

interface Category {
  title: string
  subtitle: string
  items: Tech[]
}

const categories: Category[] = [
  {
    title: "Frontend",
    subtitle: "Frameworks et outils côté client",
    items: [
      {
        name: "Vue.js",
        description: "Framework progressif, mon premier amour côté front.",
        notes: ["Composition API", "Reactivité fine", "Pinia pour le state"],
        url: "https://vuejs.org/",
      },
      {
        name: "Nuxt",
        description:
          "Vue full-stack avec auto-imports, SSR/SSG/ISR, routing par fichiers.",
        notes: ["Server routes", "Nitro", "Modules officiels"],
        url: "https://nuxt.com/",
      },
      {
        name: "React Router",
        description:
          "Le successeur de Remix v2 — loaders, actions, file-based routing, SSR.",
        notes: ["v7 framework mode", "Type-safe routes", "Streaming SSR"],
        url: "https://reactrouter.com/",
      },
      {
        name: "Astro",
        description:
          "Statique par défaut avec islands hydratables. Idéal pour les sites de contenu.",
        notes: ["Zero JS par défaut", "Multi-framework", "Content collections"],
        url: "https://astro.build/",
      },
      {
        name: "Tailwind CSS",
        description:
          "Utility-first, build avec JIT. Productivité élevée sans CSS-in-JS.",
        notes: ["Plugin typography", "Design tokens", "Dark mode class"],
        url: "https://tailwindcss.com/",
      },
    ],
  },
  {
    title: "Backend",
    subtitle: "Frameworks serveur et APIs",
    items: [
      {
        name: "Fastify",
        description:
          "Node ultra-rapide avec validation JSON Schema native. Mon défaut sur les nouveaux projets.",
        notes: ["Plugins, hooks, decorators", "TypeBox pour les schémas", "Logger Pino"],
        url: "https://fastify.dev/",
      },
      {
        name: "Express",
        description:
          "Toujours présent — middleware-based, simple, écosystème massif.",
        notes: ["Compatibilité étendue", "Routes flexibles", "Maintenance long-terme"],
        url: "https://expressjs.com/",
      },
      {
        name: "Laravel",
        description:
          "PHP moderne — Eloquent, Blade, Artisan. Quand le contexte impose PHP.",
        notes: ["Eloquent ORM", "Queues et jobs", "Auth intégré"],
        url: "https://laravel.com/",
      },
    ],
  },
  {
    title: "Langages",
    subtitle: "Au-delà de TypeScript",
    items: [
      {
        name: "TypeScript",
        description: "Le pivot de tout le frontend et du Node moderne.",
        notes: ["Types stricts", "Inférence avancée", "Type-only imports"],
        url: "https://www.typescriptlang.org/",
      },
      {
        name: "Go",
        description:
          "Compilation rapide, binaires statiques, concurrency simple. Mon choix pour les outils CLI comme GoTK.",
        notes: ["Cross-compile facile", "GC court", "Standard library riche"],
        url: "https://go.dev/",
      },
      {
        name: "Rust",
        description:
          "Performance et safety mémoire. Je l'utilise pour mes projets exigeants côté audio.",
        notes: ["Ownership system", "Cargo", "WASM-friendly"],
        url: "https://www.rust-lang.org/",
      },
      {
        name: "Python",
        description:
          "Scripts d'analyse, data, automatisation. Le couteau suisse hors web.",
        notes: ["Type hints + mypy", "uv pour la vélocité", "FastAPI quand HTTP"],
        url: "https://www.python.org/",
      },
    ],
  },
  {
    title: "Données",
    subtitle: "Persistance et requêtes",
    items: [
      {
        name: "PostgreSQL",
        description: "Mon SGBD de référence : ACID, JSONB, full-text, extensions.",
        notes: ["pg_trgm", "Logical replication", "Partitioning natif"],
        url: "https://www.postgresql.org/",
      },
      {
        name: "MySQL",
        description:
          "Quand l'écosystème ou le client l'impose — performant, fiable, bien outillé.",
        notes: ["InnoDB", "Réplication", "JSON columns"],
        url: "https://www.mysql.com/",
      },
    ],
  },
  {
    title: "Infra & DevOps",
    subtitle: "Ce qui fait tourner le code",
    items: [
      {
        name: "Docker",
        description:
          "Conteneurisation standard pour le dev et la prod. Compose pour l'orchestration locale.",
        notes: ["Multi-stage builds", "Compose v2", "BuildKit"],
        url: "https://www.docker.com/",
      },
      {
        name: "Git",
        description:
          "Versioning, base de toute collaboration. Avec Forgejo en perso et GitHub en pro.",
        notes: ["Rebase interactif", "Worktrees", "Hooks"],
        url: "https://git-scm.com/",
      },
    ],
  },
]

interface DetailProps {
  tech: Tech
  onClose: () => void
}

function TechDetail({ tech, onClose }: DetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {tech.name}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {tech.description}
        </p>
        {tech.notes && tech.notes.length > 0 ? (
          <ul className="mt-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            {tech.notes.map((note) => (
              <li key={note} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[#2563eb]"
                />
                {note}
              </li>
            ))}
          </ul>
        ) : null}
        {tech.url ? (
          <a
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8] dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
          >
            Site officiel
            <span aria-hidden>↗</span>
          </a>
        ) : null}
      </motion.div>
    </motion.div>
  )
}

export default function TechStack() {
  const [selected, setSelected] = useState<Tech | null>(null)

  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-16">
          <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
            Stack
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Avec quoi je travaille
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Outils que j&apos;utilise au quotidien — par familiarité, par confort, ou
            parce qu&apos;ils résolvent vraiment bien un problème. Cliquez sur un
            élément pour les détails.
          </p>
        </header>

        <div className="space-y-16">
          {categories.map((cat) => (
            <section key={cat.title}>
              <div className="mb-6 flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {cat.title}
                </h2>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  {cat.subtitle}
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3 dark:bg-neutral-800">
                {cat.items.map((tech) => (
                  <li key={tech.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(tech)}
                      className="group flex h-full w-full flex-col items-start gap-1.5 bg-gray-50 px-5 py-4 text-left transition-colors hover:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      <span className="font-medium text-neutral-900 transition-colors group-hover:text-[#2563eb] dark:text-neutral-100 dark:group-hover:text-[#60a5fa]">
                        {tech.name}
                      </span>
                      <span className="line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {tech.description}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {selected ? (
        <TechDetail tech={selected} onClose={() => setSelected(null)} />
      ) : null}
    </main>
  )
}

import { Link } from "react-router"
import { QuickLinks, type QuickLink } from "./QuickLinks"

const ABOUT_LINKS: QuickLink[] = [
  { to: "/contact", label: "Discuter", title: "Me contacter" },
  { to: "/blog", label: "Lire", title: "Articles & notes" },
  { to: "/projets", label: "Voir", title: "Mes projets" },
]

export default function About() {
  return (
    <main className="page-shell pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-wider text-neutral-500">À propos</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Salut, je suis Franck
          </h1>
          <p className="mt-3 text-[15px] text-neutral-600 dark:text-neutral-400">
            Développeur fullstack basé en France.
          </p>
        </header>

        <div className="space-y-6 text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            Je développe{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">LogiBOP</span>, une
            application de préparation des interventions chirurgicales utilisée en environnement
            hospitalier (
            <a
              href="https://quasar.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Quasar
            </a>{" "}
            / Express, déployée sur{" "}
            <a
              href="https://azure.microsoft.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Azure
            </a>
            ). Mon quotidien tourne autour des problématiques techniques propres au logiciel santé :
            auth robuste, traçabilité, déploiements maîtrisés, et plus largement la souveraineté du
            code et des données.
          </p>

          <p>
            À côté du pro, je code des choses qui m&apos;intéressent. Un{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">DAW en Rust</span>{" "}
            avec une architecture lock-free et support des plugins{" "}
            <a
              href="https://cleveraudio.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              CLAP
            </a>
            , parce que la programmation audio temps réel est un terrain d&apos;apprentissage
            exigeant.{" "}
            <Link to="/blog/gotk-proxy-cli-llm" prefetch="intent" className="link-accent">
              GoTK
            </Link>
            , un proxy CLI en Go qui optimise les sorties de commandes envoyées aux agents LLM
            (j&apos;utilise{" "}
            <a
              href="https://www.anthropic.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Claude Code
            </a>{" "}
            au quotidien et la sobriété token me paraît un sujet sous-exploité). Quelques outils
            utilitaires variés selon ce qui me manque.
          </p>

          <p>
            Côté infra, j&apos;auto-héberge la majorité de mes services : forge Git, photos,
            documents, médias, sync de fichiers. Je m&apos;astreins à des pratiques de{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              security by design
            </span>{" "}
            même sur mes side projects (
            <a
              href="https://www.sonarsource.com/products/sonarqube/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              SonarQube
            </a>
            ,{" "}
            <a
              href="https://www.zaproxy.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              ZAP
            </a>
            ,{" "}
            <a
              href="https://github.com/renovatebot/renovate"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Renovate
            </a>
            , scans de secrets dans les CI). Pas par paranoïa, mais parce que c&apos;est plus simple
            d&apos;avoir des bonnes habitudes en perso que de les improviser quand un client santé
            en aura besoin.
          </p>

          <p>
            Si vous bossez sur des sujets de{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              souveraineté logicielle
            </span>
            , de{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              logiciel santé
            </span>
            , ou simplement de{" "}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              bon outillage pour devs
            </span>
            , n&apos;hésitez pas à me contacter.
          </p>
        </div>

        <QuickLinks className="mt-16" links={ABOUT_LINKS} />
      </div>
    </main>
  )
}

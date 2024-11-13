export default function ClassicHeader() {
  return (
    <div className="mb-16 relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-900 text-white">
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Salut! 👋</h1>
        <p className="text-xl leading-relaxed animate-fade-in-up opacity-90">
          Je m&apos;appelle Franck et je transforme vos idées en expériences numériques.
          <br />
          Pas de blablah ici - juste une passion pour le développement web
          <br />
          et une curiosité sans fin de ce que les technologies peuvent apporter à votre
          business.
        </p>
      </div>
    </div>
  )
}

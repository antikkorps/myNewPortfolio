import { AppWindowMac, Blocks, Home, Mail, User } from "lucide-react"
import { useState } from "react"

import ThemeToggle from "./ThemeToggle"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Projets", href: "/projets", icon: AppWindowMac },
    { name: "Technologies", href: "/tech-stacks", icon: Blocks },
    { name: "À propos", href: "/a-propos", icon: User },
    { name: "Contact", href: "/contact", icon: Mail },
  ]

  return (
    <>
      <svg className="fixed w-0 h-0">
        <defs>
          <filter id="magnetic-distort">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              seed="0"
            />
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
        </defs>
      </svg>

      {/* Barre de navigation */}
      <nav className="fixed w-full z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex-shrink-0">
              <span className="text-neutral-900 dark:text-neutral-100 text-lg sm:text-xl font-bold tracking-wider">
                Dev2Go
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative p-2 rounded-lg text-neutral-600 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {/* Burger menu animé */}
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`absolute h-0.5 rounded-full bg-current transition-all duration-300 ease-out ${
                      isOpen ? "w-0" : "w-6"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out transform ${
                      isOpen ? "rotate-45" : "translate-y-2"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out transform ${
                      isOpen ? "-rotate-45" : "-translate-y-2"
                    }`}
                  />
                </div>

                {/* Effet de ripple */}
                <span className="absolute inset-0 w-full h-full bg-neutral-200 dark:bg-neutral-700 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-20 transition-all duration-300 rounded-lg" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-white dark:bg-neutral-900 transition-colors duration-300">
          {/* Motif de fond animé */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-32 sm:w-64 h-32 sm:h-64 bg-neutral-200 dark:bg-neutral-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse transition-colors duration-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `scale(${Math.random() * 2 + 1})`,
                }}
              />
            ))}
          </div>
          {/* Contenu du menu */}
          <div className="h-full flex flex-col items-center justify-center relative z-10 p-4">
            {menuItems.map((item, index) => (
              <div key={item.name} className="relative my-4 sm:my-6 w-full text-center">
                <a
                  href={item.href}
                  className="group relative inline-flex items-center text-4xl sm:text-6xl md:text-7xl font-bold"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(40px)",
                  }}
                >
                  <span className="flex items-center text-neutral-900 dark:text-neutral-100">
                    {/* Icône */}
                    <span className="inline-block -ml-16 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:-ml-24 group-hover:scale-110">
                      <item.icon size={40} strokeWidth={1.5} />
                    </span>

                    {/* Texte */}
                    <span className="inline-block transition-all duration-500 ease-out group-hover:translate-x-4">
                      {item.name}
                    </span>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar

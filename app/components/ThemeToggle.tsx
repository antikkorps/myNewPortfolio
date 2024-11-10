import { Moon, Sun } from "lucide-react"

import { FC } from "react"

interface ThemeToggleProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

const ThemeToggle: FC<ThemeToggleProps> = ({ isDark, setIsDark }) => {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 overflow-hidden group"
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <div className="relative transform transition-all duration-500 ease-in-out">
        <Sun
          className={`h-5 w-5 transform transition-transform duration-500 ${
            isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`h-5 w-5 absolute top-0 left-0 transform transition-transform duration-500 ${
            isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </div>

      {/* Effet de ripple */}
      <span className="absolute inset-0 w-full h-full bg-neutral-200 dark:bg-neutral-700 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-20 transition-all duration-300 rounded-lg" />
    </button>
  )
}

export default ThemeToggle

import { Link } from "@remix-run/react"
import { AppWindowMac, Blocks, Home, Mail, User } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
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

  const menuVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    initial: {
      y: 50,
      opacity: 0,
      filter: "blur(10px)",
    },
    animate: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3 },
    },
    exit: {
      y: -50,
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.2 },
    },
  }

  const bgVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, delay: 0.1 },
    },
  }

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

      <nav className="fixed w-full z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/" onClick={() => setIsOpen(false)}>
                <span className="text-neutral-900 dark:text-neutral-100 text-lg sm:text-xl font-bold tracking-wider">
                  Dev2Go
                </span>
              </a>
            </motion.div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative p-2 rounded-lg text-neutral-600 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
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
                <span className="absolute inset-0 w-full h-full bg-neutral-200 dark:bg-neutral-700 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-20 transition-all duration-300 rounded-lg" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 z-40"
          >
            <motion.div
              variants={bgVariants}
              className="absolute inset-0 bg-white dark:bg-neutral-900 transition-colors duration-300"
            >
              <div className="absolute inset-0 opacity-10 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 sm:w-64 h-32 sm:h-64 bg-neutral-200 dark:bg-neutral-800 rounded-full mix-blend-multiply filter blur-xl"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [1, 2, 1],
                      x: [0, Math.random() * 100, 0],
                      y: [0, Math.random() * 100, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>

              <div className="h-full flex flex-col items-center justify-center relative z-10 p-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.name}
                    className="relative my-4 sm:my-6 w-full text-center"
                    variants={itemVariants}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="group relative inline-flex items-center text-4xl sm:text-6xl md:text-7xl font-bold"
                    >
                      <span className="flex items-center text-neutral-900 dark:text-neutral-100">
                        <motion.span
                          className="inline-block -ml-16 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:-ml-24"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                        >
                          <item.icon size={40} strokeWidth={1.5} />
                        </motion.span>
                        <motion.span
                          className="inline-block"
                          whileHover={{ x: 20, scale: 1.05 }}
                        >
                          {item.name}
                        </motion.span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

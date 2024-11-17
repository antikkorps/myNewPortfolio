import { motion } from "motion/react"

export default function Header() {
  return (
    <div className="px-4 pt-6 pb-8">
      {/* Container principal - Commence simple sur mobile */}
      <div className="max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.15, originX: 0 }}
            className="text-sm text-indigo-400 font-medium mb-2"
          >
            Développeur Full Stack
          </motion.p>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white md:text-4xl lg:text-5xl"
          >
            Bienvenue sur mon portfolio !
          </motion.h1>
        </motion.div>

        {/* Description courte et impactante */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 space-y-4"
        >
          <p className="text-base text-gray-300 leading-relaxed md:text-lg">
            Je crée des expériences web modernes et intuitives
          </p>

          {/* Stats en ligne sur mobile, puis en grid sur desktop */}
          <div className="flex gap-4 flex-wrap text-sm text-gray-400 md:text-base">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Disponible
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              3+ années d&apos;expérience
            </div>
          </div>
        </motion.div>

        {/* Technologies - Scrollable sur mobile, wrap sur desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="-mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0">
            <div className="flex gap-2 overflow-x-auto md:flex-wrap scrollbar-hide">
              {["React", "Next.js", "Node.js", "TypeScript"].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="shrink-0 px-3 py-1.5 bg-gray-800 text-gray-300 text-sm 
                           rounded-lg border border-gray-700/50"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Actions - Stack sur mobile, inline sur desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 md:space-y-0 md:space-x-4 md:flex"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium 
                     rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Voir mes projets
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-6 py-2.5 bg-gray-800 text-gray-300 
                     font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Contact
          </motion.button>
        </motion.div>

        {/* Background subtil qui s'enrichit sur desktop */}
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 opacity-0 md:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"
          />
        </div>
      </div>
    </div>
  )
}

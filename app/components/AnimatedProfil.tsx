import { useEffect, useState } from "react"

interface AnimatedProfileProps {
  name: string
  imageUrl: string
}

const AnimatedProfile = ({ name, imageUrl }: AnimatedProfileProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="relative flex items-center justify-center group mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Anneaux dynamiques */}
      <div
        className={`absolute w-32 h-32 sm:w-56 sm:h-56
        transition-all duration-1000
        ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        <div
          className="absolute inset-0 rounded-full border border-purple-500/30
          animate-pulse-slow"
        />
        <div
          className={`absolute inset-0 rounded-full
          transition-all duration-500
          ${isHovered ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderLeftColor: "rgb(168, 85, 247)",
                transform: `rotate(${i * 90}deg)`,
                animation: "clipRotate 3s linear infinite",
                animationDelay: `${i * 0.75}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Conteneur de l'image avec vrai effet glitch */}
      <div
        className={`relative w-24 h-24 sm:w-48 sm:h-48 rounded-full 
        overflow-hidden transition-all duration-1000
        ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        {/* Image principale */}
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transform transition-transform duration-500
            ${isHovered ? "scale-110" : "scale-100"}`}
        />

        {/* Couches de glitch */}
        <div
          className={`absolute inset-0 transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          {/* Couche rouge */}
          <div className="absolute inset-0 mix-blend-screen animate-glitch-r">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover filter brightness-150 contrast-150 saturate-150"
              style={{ mixBlendMode: "screen", filter: "url(#glitch-r)" }}
            />
          </div>
          {/* Couche bleue */}
          <div className="absolute inset-0 mix-blend-screen animate-glitch-b">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover filter brightness-150 contrast-150 saturate-150"
              style={{ mixBlendMode: "screen", filter: "url(#glitch-b)" }}
            />
          </div>
        </div>

        {/* Bordure brillante */}
        <div
          className={`absolute inset-0 rounded-full border-2
          transition-all duration-500
          ${
            isHovered ? "border-purple-400 scale-105" : "border-purple-500/50 scale-100"
          }`}
        >
          <div className="absolute inset-0 rounded-full animate-border-flow" />
        </div>
      </div>

      {/* SVG Filters pour l'effet glitch */}
      <svg className="hidden">
        <defs>
          <filter id="glitch-r">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="glitch-b">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 1 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Effet de lueur */}
      <div
        className={`absolute inset-0 rounded-full blur-xl
        transition-all duration-700 ease-out
        ${isHovered ? "opacity-70 scale-125" : "opacity-0 scale-100"}`}
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

export default AnimatedProfile

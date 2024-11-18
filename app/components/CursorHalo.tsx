import { useEffect, useState } from "react"

const CursorHalo = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`
            absolute w-[40rem] h-[40rem] rounded-full 
            bg-gradient-radial from-purple-500/5 via-blue-500/3 to-transparent
            transition-opacity duration-500 ease-in-out
            blur-3xl
            pointer-events-none
            mix-blend-screen
          `}
          style={{
            opacity: isVisible ? 0.7 : 0,
            transform: `translate(${position.x - 320}px, ${position.y - 320}px)`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>
    </>
  )
}

export default CursorHalo

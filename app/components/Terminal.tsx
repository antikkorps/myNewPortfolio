import { useEffect, useRef, useState } from "react"

const Terminal = () => {
  const [isMounted, setIsMounted] = useState(false)

  // Messages d'initialisation
  const initMessages = [
    { text: "> Initializing system...", delay: 0 },
    { text: "> Loading dependencies...", delay: 800 },
    { text: "> Setting up environment...", delay: 1600 },
    { text: "> Starting portfolio services...", delay: 2400 },
    { text: "> Checking assets...", delay: 3000 },
    { text: "> Establishing connection...", delay: 3600 },
    {
      text: "> Loading complete. Welcome visitor !",
      delay: 4200,
      className: "text-green-400",
    },
    {
      text: "> Pleased to have you on board with me !",
      delay: 4800,
      className: "text-green-400",
    },
  ]

  const [messages, setMessages] = useState<Array<{ text: string; className?: string }>>(
    []
  )
  const [cursor, setCursor] = useState(true)
  const [terminalReady, setTerminalReady] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Effet de clignotement du curseur
    const cursorInterval = setInterval(() => {
      setCursor((prev) => !prev)
    }, 500)

    // Cleanup
    return () => clearInterval(cursorInterval)
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) return

    // Ajouter progressivement les messages
    const timeouts: NodeJS.Timeout[] = []

    initMessages.forEach(({ text, delay, className }) => {
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, { text, className }])
        // Défilement automatique
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, delay)
      timeouts.push(timeout)
    })

    // Animation complète
    const finalTimeout = setTimeout(() => {
      setTerminalReady(true)
    }, 4800)
    timeouts.push(finalTimeout)

    // Cleanup
    return () => timeouts.forEach(clearTimeout)
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className="terminal-window relative mx-auto w-full max-w-2xl rounded-lg bg-gray-900 p-1 shadow-2xl">
        <div className="terminal-header flex items-center gap-2 rounded-t bg-gray-800 px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-sm text-gray-400">portfolio@user: ~</span>
        </div>
        <div className="terminal-content h-64 px-4 py-2 font-mono text-sm">
          <p className="text-gray-300">
            <span className="text-green-400">➜</span>{" "}
            <span className="text-blue-400">~</span>█
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="terminal-window relative mx-auto w-full max-w-2xl rounded-lg bg-gray-900 p-1 shadow-2xl">
      <div className="terminal-header flex items-center gap-2 rounded-t bg-gray-800 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-sm text-gray-400">portfolio@user: ~</span>
      </div>

      <div
        ref={terminalRef}
        className="terminal-content h-64 overflow-y-auto px-4 py-2 font-mono text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
        }}
      >
        <div className="space-y-1">
          {messages.map((message, index) => (
            <p
              key={index}
              className={`typewriter ${message.className || "text-gray-300"}`}
            >
              {message.text}
            </p>
          ))}
          <p className="text-gray-300">
            <span className="text-green-400">➜</span>{" "}
            <span className="text-blue-400">~</span>
            {cursor ? "█" : " "}
          </p>
        </div>
      </div>

      {terminalReady && (
        <div className="terminal-scan pointer-events-none absolute inset-0"></div>
      )}

      <style>{`
        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 0.5s steps(40, end);
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        .terminal-scan {
          background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%);
          background-size: 100% 4px;
          animation: scan 0.5s linear infinite;
          z-index: 1;
          opacity: 0.15;
        }

        @keyframes scan {
          0% { background-position: 0 -100vh }
          100% { background-position: 0 100vh }
        }

        .terminal-content {
          position: relative;
        }

        .terminal-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(32, 36, 45, 0.1);
          animation: glitch 2s infinite;
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        @keyframes glitch {
          0% { opacity: 0 }
          1% { opacity: 0.3 }
          2% { opacity: 0 }
          95% { opacity: 0 }
          96% { opacity: 0.3 }
          97% { opacity: 0 }
        }
      `}</style>
    </div>
  )
}

export default Terminal

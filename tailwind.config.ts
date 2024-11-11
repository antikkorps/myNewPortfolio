import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "slow-pulse": "slowPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        slowPulse: {
          "0%, 100%": { opacity: "0.1", transform: "scale(1.5)" },
          "50%": { opacity: "0.15", transform: "scale(1.7)" },
        },
      },
      scale: {
        "102": "1.02",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config

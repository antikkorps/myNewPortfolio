import type { Config } from "@react-router/dev/config"
import { vercelPreset } from "@vercel/react-router/vite"

// Apply the Vercel preset only when building on Vercel — it relocates the
// SSR bundle into build/server/<encoded-runtime>/, which breaks local
// `react-router-serve` and our e2e tests. Vercel sets VERCEL=1 in the build
// environment, so locally we get the standard build/server/index.js layout.
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true"

export default {
  ssr: true,
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config

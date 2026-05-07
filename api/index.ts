// Vercel serverless function that handles every non-static request via the
// React Router v7 SSR build. The build artefacts live at
// ../build/server/index.js after `npm run build`. vercel.json rewrites all
// non-/assets paths to /api so this single function serves SSR for every
// route.
//
// Vercel's modern Node runtime accepts a default export with a Web-standard
// `(request: Request) => Response | Promise<Response>` signature, which is
// exactly what `createRequestHandler` from `react-router` returns.

import { createRequestHandler, type ServerBuild } from "react-router"
// Generated at build time, no static types — vite outputs a CJS-shaped
// module that TS can't introspect cleanly, so we round-trip through unknown.
// eslint-disable-next-line import/no-unresolved
import * as serverBuild from "../build/server/index.js"

const handler = createRequestHandler(
  serverBuild as unknown as ServerBuild,
  process.env.NODE_ENV
)

export default async function (request: Request): Promise<Response> {
  return handler(request)
}

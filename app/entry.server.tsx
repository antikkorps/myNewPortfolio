import "dotenv/config"

import { PassThrough } from "node:stream"

import { createReadableStreamFromReadable } from "@react-router/node"
import { isbot } from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import type { AppLoadContext, EntryContext } from "react-router"
import { ServerRouter } from "react-router"

const ABORT_DELAY = 5_000

// Bots get the fully resolved document (onAllReady) so crawlers see every
// Suspense boundary filled in; browsers get the shell as soon as it is ready
// (onShellReady) and the rest streams in.
type RenderMode = "shell" | "all"

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  const mode: RenderMode = isbot(request.headers.get("user-agent") || "") ? "all" : "shell"
  return renderDocument(mode, request, responseStatusCode, responseHeaders, routerContext)
}

function renderDocument(
  mode: RenderMode,
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const onReady = () => {
      shellRendered = true
      resolve(streamResponse(pipe, responseHeaders, responseStatusCode))
    }
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        ...(mode === "all" ? { onAllReady: onReady } : { onShellReady: onReady }),
        onShellError: reject,
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) console.error(error)
        },
      }
    )
    setTimeout(abort, ABORT_DELAY)
  })
}

function streamResponse(pipe: (body: PassThrough) => void, headers: Headers, status: number) {
  const body = new PassThrough()
  headers.set("Content-Type", "text/html")
  const response = new Response(createReadableStreamFromReadable(body), { headers, status })
  pipe(body)
  return response
}

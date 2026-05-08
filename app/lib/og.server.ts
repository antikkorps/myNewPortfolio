import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { Resvg } from "@resvg/resvg-js"
import type React from "react"
import satori from "satori"

const require = createRequire(import.meta.url)

let cached: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null

async function loadFonts() {
  if (cached) return cached
  const regularPath = require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff")
  const boldPath = require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff")
  const [regular, bold] = await Promise.all([readFile(regularPath), readFile(boldPath)])
  cached = {
    regular: regular.buffer.slice(
      regular.byteOffset,
      regular.byteOffset + regular.byteLength
    ) as ArrayBuffer,
    bold: bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength) as ArrayBuffer,
  }
  return cached
}

interface OgInput {
  title: string
  subtitle?: string
  kicker?: string
}

export async function renderOgPng({ title, subtitle, kicker }: OgInput): Promise<Uint8Array> {
  const fonts = await loadFonts()

  const tree = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#0d0d0d",
        color: "#fafafa",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 24,
              color: "#2563eb",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            },
            children: kicker ?? "Dev2Go",
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 24,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 64,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    maxWidth: 1040,
                  },
                  children: title,
                },
              },
              subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 28,
                        color: "#a3a3a3",
                        lineHeight: 1.4,
                        maxWidth: 1040,
                      },
                      children: subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 22,
              color: "#a3a3a3",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "#2563eb",
                    display: "flex",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", color: "#fafafa", fontWeight: 700 },
                  children: "Franck Vienot",
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: "·",
                },
              },
              {
                type: "div",
                props: { style: { display: "flex" }, children: "dev2go" },
              },
            ],
          },
        },
      ],
    },
  }

  const svg = await satori(tree as unknown as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
      { name: "Inter", data: fonts.bold, weight: 700, style: "normal" },
    ],
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
  return resvg.render().asPng()
}

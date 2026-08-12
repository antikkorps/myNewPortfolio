// Builds the printable cheat sheet PDF from the MDX article itself, so the
// article stays the single source of truth: edit the .mdx, the PDF follows.
// Runs before `react-router build` (see package.json) and writes into public/,
// which Vite copies to build/client — same pattern as scripts/build-og.ts.
//
// Layout: A4, two columns, sections from `##`, one entry per `- ` bullet.
// Standard PDF fonts only — no embedding, no network, ~100 KB output.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { AUTHOR, SITE_URL } from "../app/lib/site"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SLUG = "cheatsheet-debian-ubuntu"
const SRC = join(__dirname, "../app/content/blog", `${SLUG}.mdx`)
const OUT_DIR = join(__dirname, "../public/downloads")
const OUT = join(OUT_DIR, `${SLUG}.pdf`)

// ---------------------------------------------------------------- page setup

const PAGE_W = 595.28 // A4 portrait, in points
const PAGE_H = 841.89
const MARGIN_X = 30
const MARGIN_TOP = 32
const MARGIN_BOTTOM = 30
const GUTTER = 18
const COL_W = (PAGE_W - 2 * MARGIN_X - GUTTER) / 2
const FOOTER_H = 14

const SIZE = { title: 15, subtitle: 8, heading: 8.6, sub: 7.4, body: 7.2, code: 6.8, meta: 6.2 }
const LEADING = 8.5
const BULLET_INDENT = 7.5

const ACCENT = rgb(0.145, 0.388, 0.922) // #2563eb — the site's link blue
const INK = rgb(0.09, 0.09, 0.09)
const MUTED = rgb(0.42, 0.42, 0.42)
const RULE = rgb(0.82, 0.82, 0.82)

// ------------------------------------------------------------- text encoding

// The standard 14 fonts are WinAnsi-encoded: anything outside that repertoire
// makes pdf-lib throw at draw time. Map the typographic characters the article
// uses to printable equivalents, then drop whatever is left over.
const REPLACEMENTS: Array<[RegExp, string]> = [
  [/→/g, "->"],
  [/←/g, "<-"],
  [/↔/g, "<->"],
  [/≥/g, ">="],
  [/≤/g, "<="],
  [/≠/g, "!="],
  [/ᵉ/g, "e"],
  [/[\u00A0\u202F\u2009]/g, " "], // non-breaking / narrow / thin spaces
  [/\u200B/g, ""], // zero-width space
  [/✓/g, "-"],
]

const EXTRA_WINANSI = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ".split(""))

function encodable(char: string): boolean {
  const code = char.codePointAt(0) ?? 0
  if (code >= 0x20 && code <= 0x7e) return true
  if (code >= 0xa0 && code <= 0xff) return true
  return EXTRA_WINANSI.has(char)
}

function sanitize(text: string): string {
  let out = text
  for (const [pattern, value] of REPLACEMENTS) out = out.replace(pattern, value)
  return out
    .split("")
    .filter((c) => encodable(c))
    .join("")
}

// ------------------------------------------------------------------- parsing

type Style = "body" | "code" | "strong" | "link"
interface Run {
  text: string
  style: Style
}
type BlockKind = "heading" | "sub" | "para" | "bullet"
interface Block {
  kind: BlockKind
  runs: Run[]
}

// Inline markdown: `code`, **strong**, [label](url). On paper a link label is
// useless on its own, so the target is spelled out next to it unless the label
// already carries it.
function parseInline(text: string): Run[] {
  const runs: Run[] = []
  const push = (value: string, style: Style) => {
    if (value) runs.push({ text: value, style })
  }

  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    push(text.slice(last, match.index), "body")
    if (match[1] !== undefined) {
      push(match[1], "code")
    } else if (match[2] !== undefined) {
      push(match[2], "strong")
    } else {
      const label = match[3]
      const href = match[4].startsWith("/") ? `${SITE_URL}${match[4]}` : match[4]
      push(label, "body")
      if (!href.includes(label)) push(` (${href})`, "link")
    }
    last = match.index + match[0].length
  }
  push(text.slice(last), "body")
  return runs
}

interface Source {
  title: string
  subtitle: string
  description: string
  blocks: Block[]
}

function parseMdx(raw: string): Source {
  const { content, data } = matter(raw)
  const blocks: Block[] = []
  let inJsx = false

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim()

    // Skip the MDX layer: imports and JSX blocks (the download button) have no
    // meaning on paper.
    if (inJsx) {
      if (line.endsWith("/>") || line.startsWith("</")) inJsx = false
      continue
    }
    if (line.startsWith("import ")) continue
    if (line.startsWith("<")) {
      if (!line.endsWith("/>") && !line.endsWith(">")) inJsx = true
      continue
    }
    if (!line || line === "---" || line.startsWith(">")) continue

    // The article's opening paragraphs introduce the sheet; on the sheet
    // itself they are redundant with the masthead. Start at the first section.
    if (!blocks.length && !line.startsWith("## ")) continue

    if (line.startsWith("## ")) {
      blocks.push({ kind: "heading", runs: parseInline(line.slice(3)) })
    } else if (line.startsWith("### ")) {
      blocks.push({ kind: "sub", runs: parseInline(line.slice(4)) })
    } else if (line.startsWith("- ")) {
      blocks.push({ kind: "bullet", runs: parseInline(line.slice(2)) })
    } else if (/^\*\*[^*]+\*\*$/.test(line)) {
      // A bold-only line ("**Telescope (recherche)**") acts as a subhead.
      blocks.push({ kind: "sub", runs: parseInline(line) })
    } else {
      blocks.push({ kind: "para", runs: parseInline(line) })
    }
  }

  // "Cheat sheet Debian / Ubuntu : la référence…" -> masthead title + subtitle.
  const fullTitle = String(data.title ?? SLUG)
  const split = fullTitle.indexOf(" : ")
  return {
    title: split === -1 ? fullTitle : fullTitle.slice(0, split),
    subtitle: split === -1 ? "" : fullTitle.slice(split + 3),
    description: String(data.description ?? ""),
    blocks,
  }
}

// -------------------------------------------------------------------- layout

interface Fonts {
  regular: PDFFont
  bold: PDFFont
  mono: PDFFont
}
interface Word {
  text: string
  font: PDFFont
  size: number
  color: ReturnType<typeof rgb>
  width: number // includes the trailing space when one follows
}
interface Line {
  words: Word[]
}
interface LaidOutBlock {
  kind: BlockKind
  lines: Line[]
  indent: number
  spaceBefore: number
  spaceAfter: number
}

const SPACING: Record<BlockKind, [number, number]> = {
  heading: [8, 4.5],
  sub: [5, 1.5],
  para: [3, 2],
  bullet: [0, 0.8],
}

function styleOf(style: Style, kind: BlockKind, fonts: Fonts) {
  if (style === "code") return { font: fonts.mono, size: SIZE.code, color: INK }
  if (style === "link") return { font: fonts.regular, size: SIZE.meta, color: ACCENT }
  if (kind === "heading") return { font: fonts.bold, size: SIZE.heading, color: ACCENT }
  if (kind === "sub") return { font: fonts.bold, size: SIZE.sub, color: INK }
  if (style === "strong") return { font: fonts.bold, size: SIZE.body, color: INK }
  return { font: fonts.regular, size: SIZE.body, color: MUTED }
}

interface Token {
  text: string
  font: PDFFont
  size: number
  color: ReturnType<typeof rgb>
  spaceBefore: boolean
}

// Flatten the runs into words, remembering which ones were separated by
// whitespace — a run boundary alone is not a word boundary ("(`-r`)").
function tokenize(block: Block, fonts: Fonts): Token[] {
  const tokens: Token[] = []
  let pendingSpace = false

  for (const run of block.runs) {
    const { font, size, color } = styleOf(run.style, block.kind, fonts)
    const text = sanitize(run.text)
    if (!text) continue

    for (const piece of text.match(/\s+|\S+/g) ?? []) {
      if (/^\s+$/.test(piece)) {
        pendingSpace = tokens.length > 0
        continue
      }
      tokens.push({ text: piece, font, size, color, spaceBefore: pendingSpace })
      pendingSpace = false
    }
  }
  return tokens
}

// Greedy wrap over tokens of mixed fonts; a token wider than the column on its
// own (a long path, a long one-liner) is broken by characters.
function layoutBlock(block: Block, fonts: Fonts, width: number): LaidOutBlock {
  const indent = block.kind === "bullet" ? BULLET_INDENT : 0
  const available = width - indent
  const lines: Line[] = []
  let current: Word[] = []
  let used = 0

  const flush = () => {
    if (current.length) {
      lines.push({ words: current })
      current = []
      used = 0
    }
  }
  const place = (word: Word) => {
    current.push(word)
    used += word.width
  }

  for (const token of tokenize(block, fonts)) {
    const { font, size, color } = token
    const spaceWidth = font.widthOfTextAtSize(" ", size)
    let text = token.text
    let textWidth = font.widthOfTextAtSize(text, size)

    while (textWidth > available) {
      let cut = text.length - 1
      while (cut > 1 && font.widthOfTextAtSize(text.slice(0, cut), size) > available) cut--
      const head = text.slice(0, cut)
      flush()
      place({ text: head, font, size, color, width: font.widthOfTextAtSize(head, size) })
      flush()
      text = text.slice(cut)
      textWidth = font.widthOfTextAtSize(text, size)
    }

    const lead = token.spaceBefore && current.length ? spaceWidth : 0
    if (used + lead + textWidth > available) {
      flush()
    } else if (lead) {
      current[current.length - 1].width += lead
      used += lead
    }
    place({ text, font, size, color, width: textWidth })
  }
  flush()

  const [spaceBefore, spaceAfter] = SPACING[block.kind]
  return { kind: block.kind, lines, indent, spaceBefore, spaceAfter }
}

function blockHeight(block: LaidOutBlock): number {
  return block.spaceBefore + block.lines.length * LEADING + block.spaceAfter
}

// -------------------------------------------------------------------- render

async function main() {
  const source = await readFile(SRC, "utf-8").then(parseMdx)

  const pdf = await PDFDocument.create()
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  }

  const laidOut = source.blocks.map((b) => layoutBlock(b, fonts, COL_W))
  const pages: PDFPage[] = []

  let page = pdf.addPage([PAGE_W, PAGE_H])
  pages.push(page)
  let contentTop = drawMasthead(page, fonts, source)
  let cursor = contentTop
  let column = 0

  const columnBottom = MARGIN_BOTTOM + FOOTER_H
  const columnX = () => MARGIN_X + column * (COL_W + GUTTER)

  const nextColumn = () => {
    if (column === 0) {
      column = 1
    } else {
      page = pdf.addPage([PAGE_W, PAGE_H])
      pages.push(page)
      contentTop = drawRunningHead(page, fonts, source.title)
      column = 0
    }
    cursor = contentTop
  }

  for (const [index, block] of laidOut.entries()) {
    // Don't strand a section title at the bottom of a column: it needs room for
    // itself plus the first entries under it.
    const isTitle = block.kind === "heading" || block.kind === "sub"
    const needed = isTitle
      ? blockHeight(block) + 2 * LEADING + (laidOut[index + 1]?.spaceBefore ?? 0)
      : blockHeight(block)
    if (cursor - needed < columnBottom) nextColumn()

    cursor -= block.spaceBefore

    for (const [lineIndex, line] of block.lines.entries()) {
      const baseline = cursor - LEADING + 2
      let x = columnX() + block.indent

      if (block.kind === "bullet" && lineIndex === 0) {
        page.drawText("•", {
          x: columnX(),
          y: baseline,
          size: SIZE.body,
          font: fonts.regular,
          color: RULE,
        })
      }

      for (const word of line.words) {
        page.drawText(word.text, {
          x,
          y: baseline,
          size: word.size,
          font: word.font,
          color: word.color,
        })
        x += word.width
      }
      cursor -= LEADING
    }

    if (block.kind === "heading") {
      // The baseline sits at `cursor + 2`; clear the descenders (y, j, ç, the
      // parentheses) before drawing the rule, or it strikes through them.
      const ruleY = cursor + 2 - SIZE.heading * 0.36
      page.drawLine({
        start: { x: columnX(), y: ruleY },
        end: { x: columnX() + COL_W, y: ruleY },
        thickness: 0.4,
        color: RULE,
      })
    }
    cursor -= block.spaceAfter
  }

  drawFooters(pages, fonts)

  pdf.setTitle(`${source.title} — ${source.subtitle}`)
  pdf.setAuthor(AUTHOR.name)
  pdf.setSubject(source.description)
  pdf.setKeywords(["linux", "debian", "ubuntu", "cli", "shell", "cheatsheet"])
  pdf.setCreator(SITE_URL)
  pdf.setProducer(`${SITE_URL}/blog/${SLUG}`)

  await mkdir(OUT_DIR, { recursive: true })
  const bytes = await pdf.save()
  await writeFile(OUT, bytes)

  const kb = (bytes.length / 1024).toFixed(0)
  console.log(`  /downloads/${SLUG}.pdf — ${pages.length} pages, ${kb} KB`)
}

function drawMasthead(page: PDFPage, fonts: Fonts, source: Source): number {
  const top = PAGE_H - MARGIN_TOP

  page.drawText(sanitize(source.title), {
    x: MARGIN_X,
    y: top - SIZE.title,
    size: SIZE.title,
    font: fonts.bold,
    color: INK,
  })
  page.drawText(sanitize(source.subtitle), {
    x: MARGIN_X,
    y: top - SIZE.title - 12,
    size: SIZE.subtitle,
    font: fonts.regular,
    color: MUTED,
  })

  const link = sanitize(`${SITE_URL}/blog/${SLUG}`)
  const linkWidth = fonts.regular.widthOfTextAtSize(link, SIZE.meta)
  page.drawText(link, {
    x: PAGE_W - MARGIN_X - linkWidth,
    y: top - SIZE.title,
    size: SIZE.meta,
    font: fonts.regular,
    color: ACCENT,
  })
  const byline = sanitize(AUTHOR.name)
  const bylineWidth = fonts.regular.widthOfTextAtSize(byline, SIZE.meta)
  page.drawText(byline, {
    x: PAGE_W - MARGIN_X - bylineWidth,
    y: top - SIZE.title - 10,
    size: SIZE.meta,
    font: fonts.regular,
    color: MUTED,
  })

  const ruleY = top - SIZE.title - 22
  page.drawLine({
    start: { x: MARGIN_X, y: ruleY },
    end: { x: PAGE_W - MARGIN_X, y: ruleY },
    thickness: 0.8,
    color: ACCENT,
  })

  page.drawText(
    sanitize(
      "Les commandes préfixées par sudo modifient le système. Lire avant d'exécuter, " +
        "tester avec -n / --dry-run quand l'option existe."
    ),
    { x: MARGIN_X, y: ruleY - 9, size: SIZE.meta, font: fonts.regular, color: MUTED }
  )

  return ruleY - 20
}

function drawRunningHead(page: PDFPage, fonts: Fonts, title: string): number {
  const top = PAGE_H - MARGIN_TOP

  page.drawText(sanitize(title), {
    x: MARGIN_X,
    y: top - 6,
    size: SIZE.meta,
    font: fonts.bold,
    color: MUTED,
  })
  const link = sanitize(`${SITE_URL}/blog/${SLUG}`)
  const linkWidth = fonts.regular.widthOfTextAtSize(link, SIZE.meta)
  page.drawText(link, {
    x: PAGE_W - MARGIN_X - linkWidth,
    y: top - 6,
    size: SIZE.meta,
    font: fonts.regular,
    color: MUTED,
  })
  page.drawLine({
    start: { x: MARGIN_X, y: top - 12 },
    end: { x: PAGE_W - MARGIN_X, y: top - 12 },
    thickness: 0.4,
    color: RULE,
  })

  return top - 22
}

function drawFooters(pages: PDFPage[], fonts: Fonts) {
  for (const [index, page] of pages.entries()) {
    const label = sanitize(`${index + 1} / ${pages.length}`)
    const labelWidth = fonts.regular.widthOfTextAtSize(label, SIZE.meta)
    page.drawText(label, {
      x: (PAGE_W - labelWidth) / 2,
      y: MARGIN_BOTTOM - 8,
      size: SIZE.meta,
      font: fonts.regular,
      color: MUTED,
    })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

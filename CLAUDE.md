# CLAUDE.md

## Project

Dev2Go: Franck Vienot's portfolio and blog, in production at
<https://dev2go.vercel.app>. Every push to `main` deploys to Vercel.

React Router 7 (framework mode, streaming SSR) on Vite 8, React 19, TypeScript
strict, Tailwind CSS v4 (`@tailwindcss/vite`), MDX blog, Vitest + Testing
Library, Playwright. npm, Node >= 22.

Overview, article frontmatter and env vars: @README.md
Done / pending / planned work: @BACKLOG.md

## Commands

- Install: `npm ci`
- Dev server (drafts visible): `npm run dev`
- Build: `npm run build` (runs `build:og` and `build:pdf`, then `react-router build`)
- Serve the build: `npm run start`
- Unit and component tests: `npm test`
- One test file: `npx vitest run app/lib/seo.test.ts`
- E2E: `npm run test:e2e` (serves `build/`: run `npm run build` first)
- Typecheck: `npm run typecheck` (`react-router typegen && tsc`)
- Lint: `npm run lint`
- Format: `npm run format` / `npm run format:check`

## Before pushing

```sh
npm run format:check && npm run lint && npm run typecheck && npm run build && npm test && npm run test:e2e
```

CI (`.github/workflows/ci.yml`) runs the same chain minus e2e. Lighthouse CI
(`lighthouse.yml`) fails the PR below 0.9 performance, 0.95 accessibility or
0.95 SEO on `/`, `/blog`, `/blog/mon-parcours` and `/projets`.

## Workflow

- Plan first, then TDD: write the failing test and show the RED output before
  implementing; re-run and show the GREEN output after.
- One function, one responsibility. Functions under 30 lines, files under ~200
  lines; split by responsibility, never arbitrarily.
- DRY with judgement: factor out on the third repetition; no abstraction with a
  single caller. Flag DRY violations.
- Use current best practices for the versions already installed. No deprecated
  APIs. Never add a dependency without saying so and why.
- Comments in English, explaining why, not what.
- At the end of each feature, delegate a code review to a subagent that
  receives only the diff and the spec.
- Before every push: run the "Before pushing" command from the repo's
  CLAUDE.md; do not push if it fails; never use `--no-verify`; paste the test
  output in the summary.

## Code structure

- `app/routes/`: flat file routes (`@react-router/fs-routes`); `[.]` escapes
  a dot, e.g. `sitemap[.]xml.tsx`.
- `app/content/blog/*.mdx`: articles. Frontmatter is read server-side by
  `app/lib/posts-meta.server.ts`; components are lazy-loaded by
  `app/lib/posts.ts`.
- `app/components/`: UI; `blog/` for blog pieces (`ArticleCard`, `PostMeta`),
  `mdx/` for components usable inside articles.
- `app/lib/`: pure helpers with colocated `*.test.ts`. `*.server.ts` files
  must never be imported from client code.
- `app/contexts/ThemeContext.tsx`: dark mode. `themeScript` (inlined in
  `<head>`) alone decides the initial theme; the provider only reads it back.
- `app/tailwind.css`: Tailwind entry, `@utility` rules (`link-accent`,
  `page-shell`, `blog-shell`) and the blog palette (`.blog-surface`).
- `scripts/`: build-time generators (`build-og.ts`, `build-pdf.ts`).
- `e2e/`: Playwright specs; `test/`: Vitest setup and the security scan.
- Generated, git-ignored, never edit: `public/og/`, `public/downloads/`,
  `build/`, `.react-router/`.

## Project-specific rules

- UI copy and blog content are in French; code, comments and commit messages
  are in English. Commits follow Conventional Commits (`feat(scope): …`).
- Article pages render the MDX module outside `<Suspense>` on SSR and
  hydration: the route loader and `entry.client.tsx` preload it first. Keep it
  that way; rendering inside a boundary pushed the footer down (CLS 0.45).
  `componentForSlug` returns module-cached references, hence the two
  `react-hooks/static-components` disables in `blog.$slug.tsx`.
- Drafts (`draft: true`) are shown only in dev; they never reach production,
  the sitemap, the RSS feed or the OG generator.
- The Vercel preset in `react-router.config.ts` applies only when `VERCEL=1`:
  it relocates the server bundle and would break `npm run start` and e2e.
- Use `escapeHtml()` (`app/lib/html.ts`) for anything inserted into HTML or
  XML. Mail headers are plain text: never escape them
  (`app/lib/contact-mail.ts`).
- Mail goes through `sendMail()` in `app/lib/mailer.server.ts` (Resend
  today); callers must stay provider-agnostic.
- `.github/dependabot.yml` groups packages that peer on each other and
  ignores majors that cannot install yet; each entry explains why. Read it
  before touching a Dependabot PR, and update its comments when a blocker
  goes away.
- After switching branches, a stale ESLint cache can report bogus errors:
  `rm -rf node_modules/.cache/eslint` and re-run `npm run lint`.

# BACKLOG

Sujets identifiés à traiter dans des sessions ultérieures, par ordre de
priorité.

---

## ✅ Faits (mergés sur `main`)

### Stack & sécurité
- Migration **Remix v2 → React Router v7** (`@react-router/{dev,node,serve,fs-routes}`)
- `npm audit` ramené de 15 vulns (6 moderate / 9 high) à **0** côté projet
- Headers de sécurité Netlify-style (`public/_headers`) : HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, cache long pour assets/og/favicon
- **Déploiement Vercel SSR** via `@vercel/react-router` preset (conditionné à `VERCEL=1` pour ne pas casser `react-router-serve` local). `vercel.json` force `framework: "react-router"`.
- **Fix CodeQL** : sanitization stricte des URLs YouTube via allowlist exact (plus d'`endsWith("youtube.com")`), helper extrait dans `app/lib/youtube.ts` avec 20 tests dédiés couvrant les look-alikes (`evilyoutube.com`, `youtu.be.evil.com`), schemes `javascript:`/`data:`, IDs invalides, traversal.

### Blog
- Articles MDX avec **Shiki dual-theme** (`github-light` / `github-dark`)
- Pagination, recherche server-side avec **highlight** des matches via `<mark>`
- RSS feed `/blog/rss.xml` + autodiscovery `<link rel=alternate>`
- Heading anchors (rehype-slug + rehype-autolink-headings)
- Table of contents fixed (xl+) avec IntersectionObserver, ancres en simple-clic (handler manuel + `preventScrollReset` pour ne pas concurrencer `<ScrollRestoration>` de RR7)
- Tags clickables → `/blog/tags/$tag`
- Prev/next article au pied de chaque article
- Frontmatter `draft: true` : filtré en prod, **visible en dev** (`NODE_ENV=development`) avec badge "Brouillon" sur l'index et l'article
- **Lazy frontmatter** : split `posts-meta.server.ts` (server-only, frontmatter via `import.meta.glob({ import: 'frontmatter' })`) vs `posts.ts` (component glob). `/blog` index passe de 73 KB à ~5 KB côté client.
- **Lazy MDX** : `posts.ts` utilise désormais un glob non-eager + `React.lazy` + `<Suspense>`. Chaque article devient son propre chunk Vite, `/blog/$slug` chute de **~110 KB → 35 KB**. La TOC utilise un MutationObserver pour récupérer les headings après que le chunk lazy soit hydraté côté client (le SSR streame déjà l'article complet, donc OK pour les bots et le first paint plein écran).

### SEO
- `<html lang="fr">`, méta site-wide (`author`, `robots:max-image-preview`, `theme-color`, `og:site_name`, `og:locale`, JSON-LD Person + WebSite) statiques dans `<Layout>` (RR7 override les méta parent par défaut)
- **Open Graph pré-générés au build** : `scripts/build-og.ts` (tsx) génère `public/og/<slug>.png` + `default.png` (1200×630 PNG via satori + resvg). `npm run build` chaîne `build:og && react-router build`. Plus de Vercel Function pour les OG → 0 cold start, servi depuis le CDN edge. La route runtime `app/routes/og[.]png.tsx` est supprimée.
- **JSON-LD complet** : Person + WebSite site-wide ; Blog + BreadcrumbList sur `/blog` ; **BlogPosting** enrichi (ImageObject avec dimensions, publisher, articleSection, wordCount, timeRequired, dateModified) + BreadcrumbList sur articles ; BreadcrumbList sur tag pages
- Sitemap.xml : ISO-8601 lastmod, priority/changefreq différenciés, namespace image avec `<image:image>` par article, tag pages incluses
- Favicon Dicebear PNG dynamique (`/favicon.png`, cache 30j)
- Preload font Lora dans `links()` (anti-FOUT)
- og:image:width/height/alt + twitter:image:alt sur articles
- 404 status canonique (`throw new Response(..., { status: 404 })`), ErrorBoundary custom avec navigation `<a href>` (force reload propre)
- `SITE_URL` → `https://dev2go.vercel.app` (production)

### Pages
- **`/` (home)** éditoriale : hero "Architecte cloud, solutions web et outillage dev", derniers articles loadés server-side, quick-links
- **`/a-propos`** : texte LogiBOP / DAW Rust / GoTK / security, liens externes
- **`/projets`** : sections "En ligne" (incl. LogiBOP & GoTK en tête) / "Archives", embed YouTube en `<dialog>` natif (toEmbedUrl validé)
- **`/tech-stacks`** : refonte sobre, catégorisée (Frontend/Backend/Langages/Données/Infra), Remix→RR, Nest→Fastify, ajout Go/Rust/Python/TypeScript
- **`/contact`** : fallback `AUTHOR` quand `process.env.*` absent (plus de "undefined")

### Tests & CI
- **Vitest** unit : `lib/{format,seo,site,posts-meta.server,youtube}` (~49 tests)
- **Vitest** components : `mdx/{Note,Warning,Aside}`, `BlogAvatar`, `TableOfContents` (9 tests)
- **Vitest** security scan : grep des secrets dans `build/client/assets/*.js` — `process.env.EMAIL_*`, dotenv, AWS/Google/GitHub key signatures (11 tests)
- **Playwright** e2e : routes 200/404, JSON-LD Person/WebSite/BlogPosting/BreadcrumbList, sitemap valide, recherche/pagination, 404 page (29 tests)
- **Lighthouse CI** sur chaque PR (`.github/workflows/lighthouse.yml` + `lighthouserc.json`) : 4 URLs, desktop preset, 3 runs avec median. Budgets : perf ≥ 0.9, a11y ≥ 0.95, SEO ≥ 0.95 (error), best-practices ≥ 0.9 (warn). Rapport HTML uploadé sur temporary-public-storage.

---

## 🚧 À faire — par priorité

### 1. Préfetch agressif

Passer de `prefetch="intent"` à `prefetch="render"` sur les liens vers la prochaine page de pagination — déjà visible donc bon candidat à charger en avance.

---

## 🐞 Connu / à surveiller

- **3 vulns moderate** dans `@vercel/static-config` → `ajv` (transitives de `@vercel/react-router`). **Pas fixable** sans upstream. Acceptable car Vercel-side et build-time only.
- **`vercel.json`** force `framework: "react-router"`. Si Vercel renomme/retire ce slug, redeploy en échec — fallback : passer le Framework Preset à "Other" depuis le dashboard.
- Le hack `<a href>` dans `ErrorBoundary` (au lieu de `<Link>`) est un workaround pour un comportement RR7 buggué. À retester quand RR7 sort une release qui patche.

---

## 💡 À envisager plus tard

- **Articles connexes** sous chaque article (par tags partagés)
- **Analytics sobres** (Plausible self-hosted ou Umami)
- **PWA manifest** + service worker pour offline-first
- **Tests visuels** (Percy / Chromatic) sur les composants MDX et la home
- **i18n** si une version EN devient pertinente
- **Pre-render les pages statiques** (`/`, `/a-propos`, `/tech-stacks`, `/projets`) via `prerender` dans `react-router.config.ts` pour servir du HTML statique sans toucher à la function

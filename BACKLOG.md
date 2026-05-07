# BACKLOG

Sujets identifiés à traiter dans des sessions ultérieures, par ordre de
priorité.

---

## ✅ Faits dans la branche `feat/react-router-v7`

### Migration & sécurité
- Migration **React Router v7** (Remix v2 → RR7 + `@react-router/{dev,node,serve,fs-routes}`)
- `npm audit` : **0 vulnérabilité** (de 15 high/moderate à 0 grâce à RR7 + bump
  `@typescript-eslint/*` à v8)
- Headers de sécurité Netlify (`public/_headers`) : HSTS, X-Content-Type-Options,
  X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, cache long pour
  assets/og/favicon

### Blog
- Articles MDX avec **Shiki dual-theme** (`github-light` / `github-dark`) via
  `rehype-pretty-code`
- **Pagination** server-side (`?page=N`, 3 par page)
- **Recherche** server-side (`?q=...`) avec **highlight** des matches
- **RSS feed** `/blog/rss.xml` + autodiscovery dans le `<head>`
- **Heading anchors** (`rehype-slug` + `rehype-autolink-headings`) avec liens
  permanents au hover
- **Table of contents** sticky côté droit (xl+) avec IntersectionObserver pour
  highlight de la section active
- **Tags clickables** → `/blog/tags/$tag` (route dédiée filtrée)
- **Prev/next article** en bas de chaque article
- **Frontmatter `draft: true`** filtré dans `posts-meta.server.ts` (preview en
  ajoutant un build flag plus tard)
- **Lazy frontmatter** : split `posts-meta.server.ts` (server-only,
  `import.meta.glob({ import: 'frontmatter' })`) vs `posts.ts` (component
  glob). `/blog` index passe de 73 KB à ~5 KB côté client.

### SEO
- `<html lang="fr">`, méta site-wide (`author`, `robots:max-image-preview`,
  `theme-color`, `og:site_name`, `og:locale`) statiques dans `<Layout>` car RR7
  override les méta parent par défaut
- **Open Graph dynamique** : route `/og.png` + `/og.png?slug=...` (1200×630
  PNG via satori + resvg, font Inter via @fontsource)
- **JSON-LD** : Person + WebSite site-wide, Blog + BreadcrumbList sur
  `/blog`, **BlogPosting** enrichi (ImageObject avec dimensions, publisher,
  articleSection, wordCount, timeRequired, dateModified) + BreadcrumbList sur
  articles, BreadcrumbList sur tag pages
- **Sitemap.xml** : ISO-8601 lastmod, priority/changefreq différenciés,
  `xmlns:image` avec `<image:image>` par article, tag pages incluses
- **Favicon Dicebear** : route `/favicon.png` qui rend le thumbs en PNG 64×64
  (cache 30j)
- **Preload font Lora** dans `links()` (avoid FOUT sur articles)
- **og:image:width/height/alt** + twitter:image:alt sur articles
- **404 status** (canonical signal pour Google) via `throw new Response(...)`,
  ErrorBoundary custom avec navigation par `<a href>` (force reload propre)

### Pages
- **`/` (home)** : layout éditorial, hero "Architecte cloud, solutions web et
  outillage dev", derniers articles loadés server-side, quick-links
- **`/a-propos`** : texte LogiBOP/DAW Rust/GoTK/security, liens externes propres
- **`/projets`** : refonte avec sections "En ligne" / "Archives", placeholders
  YouTube `videoUrl` pour les sites archivés
- **`/tech-stacks`** : refonte sobre, catégorisée (Frontend/Backend/Langages/
  Données/Infra), Remix→RR, Nest→Fastify, ajout Go/Rust/Python/TypeScript
- **`/contact`** : fallback `AUTHOR` quand `process.env.*` absent (plus de
  "undefined"), filtre des cards sans data

### Bugfixes
- `dotenv/config` chargé au boot du server
- TOC fixed → toujours visible au scroll
- `scroll-padding-top: 5.5rem` sur `<html>` pour les anchors
- Tables markdown stylées (overflow-x, borders sobres)

---

## 🚧 À faire — par priorité

### 1. Tests (Vitest + Playwright + sécurité) — *en cours*

**Pourquoi.** TDD pour les futures features + filet contre les régressions
silencieuses à mesure que le site grandit.

**Setup.**
- **Vitest** sur le code "pur" : `lib/format.ts`, `lib/seo.ts`, `lib/site.ts`,
  `lib/posts-meta.server.ts` (parsing frontmatter, tri, getPostMeta,
  getNeighborsMeta, draft filter).
- **`@testing-library/react`** sur les composants MDX (`<Note>`, `<Warning>`,
  `<Aside>`), `<BlogAvatar>`, `<TableOfContents>`.
- **Playwright** pour e2e :
  - Toutes les routes 200 / 404 attendu
  - `/sitemap.xml` valide + contient tous les slugs non-draft
  - `/blog?q=cli` filtre, `/blog?page=2` pagine
  - Chaque page : `<title>`, description, canonical, og:image qui résout
  - JSON-LD parsable et conforme schema.org
- **Tests sécurité** :
  - Bundle client (`build/client/assets/*.js`) ne contient pas
    `process.env.EMAIL_PASS`, `EMAIL_USER`, `EMAIL_BCC`, etc.
  - Pas de mention de `dotenv` côté client
  - Headers HTTP attendus présents
- **Lighthouse CI** en GitHub Action : budget perf ≥ 90, SEO ≥ 95, a11y ≥ 95.

---

### 2. Améliorations blog (restant)

- **Vue draft en dev** : afficher les articles `draft: true` quand
  `process.env.NODE_ENV === "development"`. Actuellement filtré partout.
- **Préfetch agressif** : `prefetch="render"` (au lieu de `"intent"`) sur la
  prochaine page de pagination, déjà cliquable.

---

### 3. Lazy MDX (full split — quand nb d'articles > 10)

Le `/blog/$slug` reste à 109 KB car eager glob de tous les MDX. À convertir en
lazy + React.lazy + Suspense quand le nombre d'articles dépasse ~10.
Aujourd'hui non urgent.

---

### 4. Pré-générer les OG au build (au lieu du runtime)

Actuel : `/og.png?slug=...` = generation runtime (satori + resvg). Cache HTTP
mitige, mais sur Netlify chaque génération = 1 invocation function. Alternative
: pré-générer au build (`scripts/build-og.ts`) et stocker dans
`public/og/<slug>.png`. Robuste contre les pics de partage social.

---

### 5. Réviser visuellement (browser test)

Pas testé en navigateur dans la session actuelle :
- Rendu Shiki dual-theme (light → dark sans rechargement)
- Avatar Dicebear thumbs (visage visible)
- Animations sur scroll absentes sur `/blog` (CursorHalo masqué)
- TOC fixed sur articles longs (xl+)
- Page 404 → click "Accueil" / "Voir le blog" (style préservé)

---

### 6. Confirmer SITE_URL prod

`app/lib/site.ts` : `SITE_URL = "https://dev2go.netlify.app"`. À confirmer ou
remplacer par le domaine custom final.

---

### 7. À envisager plus tard

- **Articles connexes** sous chaque article (par tags partagés)
- **Stats / analytics** sobres (Plausible self-hosted ou Umami)
- **PWA manifest** + service worker pour offline-first
- **Tests visuels** (Percy / Chromatic) sur les composants MDX et la home
- **i18n** si jamais une version EN devient pertinente

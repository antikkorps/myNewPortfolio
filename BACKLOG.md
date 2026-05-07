# BACKLOG

Sujets identifiés à traiter dans des sessions ultérieures, par ordre de priorité.

---

## 1. Migration React Router v7

**Pourquoi.** Remix v2 ne reçoit plus que des fixes de sécurité — la roadmap est mergée dans React Router v7. Migrer débloque : versions récentes de Vite/esbuild (résout 12 des 15 vulnérabilités `npm audit`), fonctionnalités à venir (typed routes, prerender), maintenance long-terme.

**Recette (~1h).**

```bash
# 1. Install RR7
npm install react-router@^7 @react-router/node@^7 @react-router/dev@^7 @react-router/serve@^7
npm install @react-router/fs-routes@^7   # pour conserver le file-based routing

# 2. Uninstall Remix
npm uninstall @remix-run/dev @remix-run/node @remix-run/react @remix-run/serve

# 3. package.json scripts
#   "dev":   "react-router dev"
#   "build": "react-router build"
#   "start": "react-router-serve ./build/server/index.js"
#   "typecheck": "react-router typegen && tsc"
```

**Imports à remplacer** (sed-friendly) :

| Avant | Après |
|---|---|
| `from "@remix-run/node"` (types) | `from "react-router"` |
| `createReadableStreamFromReadable` from `@remix-run/node` | from `@react-router/node` |
| `from "@remix-run/react"` | `from "react-router"` |
| `RemixBrowser` from `@remix-run/react` | `HydratedRouter` from `react-router/dom` |
| `RemixServer` from `@remix-run/react` | `ServerRouter` from `react-router` |
| `from "@remix-run/dev"` (vite) | `reactRouter` from `@react-router/dev/vite` |
| `tsconfig.json` `"types": ["@remix-run/node", ...]` | `["@react-router/node", ...]` |

**Fichiers neufs à créer.**

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config"
export default {
  ssr: true,
  future: { unstable_optimizeDeps: true },
} satisfies Config
```

```ts
// app/routes.ts (préserve la convention flat-routes Remix v2)
import { flatRoutes } from "@react-router/fs-routes"
export default flatRoutes()
```

**Points de vigilance.**

- L'ordre des plugins dans `vite.config.ts` : `mdx()` doit toujours être avant `reactRouter()`.
- Vérifier que `import.meta.glob("../content/blog/*.mdx", { eager: true })` se comporte pareil avec `@react-router/dev` (en théorie identique, c'est Vite qui gère).
- `useLoaderData<typeof loader>()` continue de marcher avec un type-gen step (`react-router typegen`).
- `MetaFunction` accepte les mêmes shape (titre/description/og/twitter), mais `tagName: "link"` reste valide.
- `LoaderFunctionArgs` vs `Route.LoaderArgs` (RR7 génère des types par route via `+types/...`). Migration progressive possible.

**Test post-migration.**

```bash
npm run typecheck
npm run build
PORT=3458 npm run start &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3458/blog
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3458/blog/gotk-proxy-cli-llm
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3458/sitemap.xml
```

---

## 2. Tests : Vitest + Playwright + sécurité

**Pourquoi.** TDD pour les futures features (notamment le blog quand il grossira) + preuve que le filet sécurité tient.

**Setup proposé.**

- **Vitest** pour le code "pur" : `lib/posts.ts` (tri, getPost, draft filter), `lib/seo.ts` (forme du tableau meta), `lib/site.ts`.
- **`@testing-library/react`** pour les composants MDX (`<Note>`, `<Warning>`, `<Aside>`) + `BlogAvatar`.
- **Playwright** pour les e2e :
  - `/`, `/projets`, `/tech-stacks`, `/a-propos`, `/contact`, `/blog`, `/blog/<slug>` retournent `200`
  - `/sitemap.xml` est un XML valide qui contient toutes les routes statiques + tous les articles non-draft
  - `/blog?q=forgejo` filtre, `/blog?page=2` pagine
  - Chaque page a un `<title>`, une `<meta name="description">`, un `<link rel="canonical">`, un `og:image` qui résout
  - JSON-LD `BlogPosting` valide sur chaque article (parser via `schema-dts` ou JSON.parse + validation manuelle)
- **Tests sécurité spécifiques** :
  - Bundle client ne contient pas `process.env.EMAIL`, `process.env.PHONE` ou autres secrets côté serveur
  - Les images de la page Projets ont toutes un `alt` non-vide
  - `/contact` ne renvoie que des données publiques (pas de tokens, pas de cookie session non-httpOnly)
  - Headers HTTP : `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`
- **Lighthouse CI** en GitHub Actions : budget perf ≥ 90, SEO ≥ 95, a11y ≥ 95.

---

## 3. Image Open Graph

**Constat.** `app/lib/site.ts` référence `/images/og-default.png` qui n'existe pas dans `public/images/`. Toutes les pages renvoient un OG image cassée.

**À faire.**

- Créer une OG image 1200×630 avec : nom + tagline + accent bleu `#2563eb`. Outils : Figma, ou un générateur Remix-side qui rend HTML → PNG via `satori` + `@vercel/og`.
- Optionnellement : OG image dynamique par article (génère au build avec le titre de l'article).
- Ajouter `og-default.png` dans `public/images/`.

---

## 4. `npm audit` — `overrides` ciblés

**Constat.** 15 vulnérabilités, toutes en transitive de `@remix-run/dev`. La migration RR7 (point 1) en supprime ~12. Les 3 restantes peuvent être fixées via `overrides` dans `package.json` :

```jsonc
{
  "overrides": {
    "minimatch": "^9.0.7",
    "tar": "^7.6.0",
    "estree-util-value-to-estree": "^3.3.3"
  }
}
```

À tester après RR7. Si RR7 résout déjà tout, sauter ce point.

---

## 5. Améliorations blog

- **RSS feed** : `/blog/rss.xml` route, dérive du même `posts` array. ~30 min.
- **Lien permalink (#) sur chaque heading** dans les articles : auto via `rehype-autolink-headings` + `rehype-slug` dans la pipeline MDX.
- **Table of contents** auto-générée pour les articles longs (>1500 mots). `rehype-toc` ou implémentation maison.
- **Highlight de la recherche** : surligner les matches dans titre/description sur `/blog?q=...`.
- **Tags clickables** : route `/blog/tags/<tag>` qui filtre.
- **Article suivant / précédent** en bas de chaque article.
- **Vue draft** en dev uniquement (env-gated) pour prévisualiser les articles `draft: true`.

---

## 6. Optimisations diverses

- **Lazy loading des articles** quand `posts.length > ~10` : passer le glob en `eager: false` + `React.lazy` côté `blog.$slug.tsx`. Réduit le bundle initial.
- **Préfetch agressif** : déjà `prefetch="intent"` sur les liens. Envisager `prefetch="render"` pour la prochaine page de pagination.
- **Préload de la font Lora** : ajouter `<link rel="preload" as="font" href="..." crossOrigin>` dans `links()` pour éviter le FOUT sur les articles.
- **`color-scheme` CSS** : déjà dans `tailwind.css` mais pourrait être clarifié pour matcher le toggle JS.
- **404 personnalisée** pour `/blog/<slug-inexistant>` (actuellement un `Response("Article introuvable", { status: 404 })` brut).

---

## 7. À ne pas oublier

- Vérifier visuellement le rendu Shiki dual-theme dans un vrai navigateur (pas testé en headless dans cette session).
- Vérifier l'avatar Dicebear thumbs (était cassé à cause d'options invalides, maintenant corrigé mais pas validé visuellement).
- Le SITE_URL dans `app/lib/site.ts` est `https://dev2go.netlify.app` — confirmer que c'est bien l'URL de prod.

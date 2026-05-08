# Dev2Go — portfolio + blog de Franck Vienot

Production : <https://dev2go.vercel.app>

## Stack

- **React Router v7** (framework mode, SSR streaming) sur **Vite 6**
- **TypeScript** strict, **Tailwind CSS** + `@tailwindcss/typography`
- **MDX** pour le blog (`@mdx-js/rollup` + `remark-frontmatter` + `rehype-pretty-code` avec Shiki dual-theme)
- **Vercel** comme hôte SSR (preset `@vercel/react-router`)
- **satori** + **resvg-js** pour pré-générer les images Open Graph au build
- **nodemailer** pour le formulaire de contact
- **Vitest** + **Testing Library** + **Playwright** côté tests
- **Prettier** + **ESLint** côté style/lint
- **Lighthouse CI** + workflow `ci` GitHub Actions sur chaque PR

## Scripts

| Commande                          | Effet                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                     | Dev server Vite (HMR, drafts MDX visibles)                              |
| `npm run build`                   | `build:og` puis `react-router build`. Sortie dans `build/`              |
| `npm run build:og`                | Régénère les PNG OG dans `public/og/` (lancé par `scripts/build-og.ts`) |
| `npm run start`                   | Sert le build de prod via `react-router-serve`                          |
| `npm run test`                    | Tests unitaires + composants (Vitest)                                   |
| `npm run test:e2e`                | Tests end-to-end (Playwright, suppose un build récent)                  |
| `npm run typecheck`               | `react-router typegen && tsc`                                           |
| `npm run lint`                    | ESLint sur l'ensemble du repo                                           |
| `npm run format` / `format:check` | Prettier write / check                                                  |

Node 22+ requis (cf. `engines` dans `package.json`).

## Structure

```
app/
├─ components/        # composants UI (Navbar, BlogAvatar, TableOfContents…)
├─ content/blog/      # articles MDX
├─ contexts/          # ThemeContext (dark mode)
├─ lib/               # helpers : seo, posts, posts-meta.server, og.server, format, youtube
├─ routes/            # routes flat (RR7 fs-routes)
├─ entry.client.tsx   # entrée client React 18
├─ entry.server.tsx   # entrée SSR avec stream + handleBotRequest
├─ root.tsx           # Layout, Meta, Links site-wide
└─ tailwind.css       # base + custom

scripts/
└─ build-og.ts        # génère les PNG Open Graph au build (satori + resvg)

e2e/                  # Playwright specs
test/                 # tests d'intégration (security scan)
.github/workflows/    # ci.yml (tests/lint/typecheck/format) + lighthouse.yml
```

## Ajouter un article

1. Créer `app/content/blog/<slug>.mdx`
2. Frontmatter requis :

   ```yaml
   ---
   title: "…"
   description: "…"
   date: "YYYY-MM-DD"
   tags: ["tag1", "tag2"]
   readingTime: 4
   draft: false # mettre true pour brouillon (visible en dev seulement)
   ---
   ```

3. Les drafts apparaissent uniquement en `npm run dev` avec un badge "Brouillon", jamais en prod, jamais dans le sitemap/RSS, et `build:og` ne génère pas de PNG OG pour eux.

## Variables d'environnement

Pour le formulaire de contact (`/sendmail`), définir dans `.env` ou via Vercel :

```
EMAIL_USER=…           # compte SMTP (gmail actuel)
EMAIL_PASS=…           # mot de passe d'app gmail
EMAIL_RECIPIENT=…      # destinataire admin
EMAIL_BCC=…            # CCI optionnel
PHONE_NUMBER=…
LINKEDIN_URL=…
```

## Déploiement

`git push` sur `main` déclenche le déploiement Vercel. Le build chaîne `build:og` (PNG OG dans `public/og/`) avant `react-router build`. Les images OG terminent dans `build/client/og/`, servies par le CDN edge.

`vercel.json` force `framework: "react-router"` pour court-circuiter l'auto-détection Remix qui casserait le build.

## Backlog

Voir [`BACKLOG.md`](./BACKLOG.md) pour ce qui est fait, en attente, et envisagé.

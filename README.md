# Dev2Go — portfolio + blog de Franck Vienot

Production : <https://dev2go.vercel.app>

## Stack

- **React Router v7** (framework mode, SSR streaming) sur **Vite 8**, **React 19**
- **TypeScript** strict, **Tailwind CSS v4** (plugin `@tailwindcss/vite`) + `@tailwindcss/typography`
- **MDX** pour le blog (`@mdx-js/rollup` + `remark-frontmatter` + `rehype-pretty-code` avec Shiki dual-theme)
- **Vercel** comme hôte SSR (preset `@vercel/react-router`)
- **satori** + **resvg-js** pour pré-générer les images Open Graph au build
- **pdf-lib** pour générer au build le PDF de l'antisèche à partir de son article MDX
- **Resend** pour le formulaire de contact
- **Vitest** + **Testing Library** + **Playwright** côté tests
- **Prettier** + **ESLint** côté style/lint
- **Lighthouse CI** + workflow `ci` GitHub Actions sur chaque PR

## Scripts

| Commande                          | Effet                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                     | Dev server Vite (HMR, drafts MDX visibles)                              |
| `npm run build`                   | `build:og`, `build:pdf` puis `react-router build`. Sortie dans `build/` |
| `npm run build:og`                | Régénère les PNG OG dans `public/og/` (`scripts/build-og.ts`)           |
| `npm run build:pdf`               | Régénère les PDF dans `public/downloads/` (`scripts/build-pdf.ts`)      |
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
├─ components/        # composants UI (Navbar, QuickLinks, TableOfContents…)
│  ├─ blog/           # ArticleCard, PostMeta
│  └─ mdx/            # composants utilisables dans les articles (Note, Warning…)
├─ content/blog/      # articles MDX
├─ contexts/          # ThemeContext (dark mode)
├─ lib/               # helpers : seo, html, posts, posts-meta.server, contact-mail, mailer.server…
├─ routes/            # routes flat (RR7 fs-routes)
├─ entry.client.tsx   # entrée client (précharge l'article avant hydratation)
├─ entry.server.tsx   # entrée SSR en streaming (document complet pour les bots)
├─ root.tsx           # Layout, Meta, Links site-wide
└─ tailwind.css       # entrée Tailwind, @utility, palette du blog

scripts/
├─ build-og.ts        # génère les PNG Open Graph au build (satori + resvg)
└─ build-pdf.ts       # génère le PDF de l'antisèche depuis son MDX (pdf-lib)

e2e/                  # Playwright specs
test/                 # setup Vitest + scan de sécurité
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

Pour le formulaire de contact (`/contact`), définir dans `.env` ou via Vercel :

```
RESEND_API_KEY=…       # API key Resend (scope "Send only")
EMAIL_FROM=…           # adresse "From:" complète, ex. "Franck <contact@mail.fvienot.link>"
EMAIL_RECIPIENT=…      # adresse où arrivent les messages reçus
EMAIL_BCC=…            # CCI optionnel
```

L'envoi passe par `app/lib/mailer.server.ts` → `sendMail()`, derrière une interface `MailMessage` agnostique du provider. L'implémentation actuelle utilise le SDK Resend. Pour swapper vers un autre provider (Postmark, Mailgun, retour à SMTP…), réécrire le corps de `sendMail()` et ajuster les env vars qu'il lit. L'action dans `app/routes/contact.tsx` ne change pas.

## Déploiement

`git push` sur `main` déclenche le déploiement Vercel. Le build chaîne `build:og` (PNG OG dans `public/og/`) et `build:pdf` (PDF dans `public/downloads/`) avant `react-router build`. Ces fichiers terminent dans `build/client/`, servis par le CDN edge.

`vercel.json` force `framework: "react-router"` pour court-circuiter l'auto-détection Remix qui casserait le build.

## Backlog

Voir [`BACKLOG.md`](./BACKLOG.md) pour ce qui est fait, en attente, et envisagé.

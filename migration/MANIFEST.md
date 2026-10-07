# MANIFEST - Kocaeli Social Hub

Ground truth for the migration pack. Read from the repo on 2026-10-07, repo
head `839bb98`.

## Identity

| Field | Value |
|---|---|
| Project name | Kocaeli Social Hub |
| Package name | `react-example` (private, not published) |
| Repo | https://github.com/softwaremonkey635/kocaeli-social-hub.git (branch `main`) |
| Live URL | https://softwaremonkey635.github.io/kocaeli-social-hub/ |
| Owner | Murat Malkoç, founder. Instagram @kocaelisosyal.41 |
| Stack | React 19, Vite 8, TypeScript, Tailwind CSS 4. Static SPA with prerendered routes and a PWA layer. |
| Site language | Turkish (`lang="tr"`) |

## Entry points

| Path | Role |
|---|---|
| `index.html` | HTML shell: fonts, base meta tags, Organization JSON-LD |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | History-API router and page switch for the 9 routes |
| `vite.config.ts` | Vite, React, Tailwind, and PWA config. Reads `APP_BASE`. |
| `scripts/prerender.mjs` | Build-time prerender of the 9 routes with Playwright |
| `scripts/static-routes.mjs` | Shared route list and base/origin resolution |

Routes: `/`, `/events`, `/vision`, `/clubs`, `/gallery`, `/contact`, `/blog`,
`/sponsors`, `/guide`.

## Environment variables

| Name | Default | Used by | Notes |
|---|---|---|---|
| `APP_BASE` | `/` | `vite.config.ts`, `scripts/static-routes.mjs` | Vite base path. Production builds use `/`. The GitHub Pages test build uses `/kocaeli-social-hub/`. |
| `SITE_ORIGIN` | `https://softwaremonkey635.github.io` | `scripts/static-routes.mjs` | Public origin stamped into canonical URLs, sitemap, robots.txt, and feeds. Set it to the real domain when the Turkish host goes live. |
| `DISABLE_HMR` | unset | `vite.config.ts` | Dev only. `true` disables HMR and file watching. |
| `GEMINI_API_KEY` | none | nothing at runtime | AI Studio leftover in `.env.example`. The static site does not call Gemini. |
| `APP_URL` | none | nothing at runtime | AI Studio leftover in `.env.example`. |

The site is static. Serving it needs no runtime environment variable.

## Commands

| Goal | Command |
|---|---|
| Install deps | `npm ci`, or `npm install` when there is no lockfile |
| Dev server | `npm run dev` (Vite on port 3000) |
| Typecheck | `npx tsc --noEmit` (also `npm run lint`) |
| Plain build | `npm run build` (Vite build to `dist/`) |
| Full static build | `npm run build:static` (Vite build, then prerender, sitemap, feeds) |
| Unit test | `npm run test:calendar` |
| E2E matrix | `node tests/e2e-matrix.mjs [BASE_URL]` (default `http://127.0.0.1:4173/`) |
| Preview | `npm run preview` |
| Deploy | Upload `dist/` plus `deploy/.htaccess` to `public_html`. See `deploy/README.md`. |

## External services at runtime

The browser calls these. The server calls nothing.

| Service | Caller | Purpose |
|---|---|---|
| `finans.truncgil.com` | `src/components/FinanceTicker.tsx` | FX rates (`/today.json`) |
| `scanner.tradingview.com` | `src/components/FinanceTicker.tsx` | BIST XU100 quote |
| `open.er-api.com` | `src/components/FinanceTicker.tsx` | USD rate fallback |
| `api.open-meteo.com` | `src/components/WeatherWidget.tsx` | Kocaeli district weather |
| `fonts.googleapis.com` | `index.html` | Plus Jakarta Sans and Outfit stylesheets |
| `fonts.gstatic.com` | `index.html` | Font files |

The Content Security Policy in `deploy/.htaccess` and
`deploy/nginx.conf.snippet` also allows `googletagmanager.com` and
`google-analytics.com`, held open for a future analytics tag.

## Secrets

None today. The build and the served site need no secret.

A future analytics key would be a Google Analytics measurement ID. That ID is
not a secret and would live in the gtag snippet in `index.html`, or in a small
runtime config file. The CSP already permits both Google analytics hosts, so
adding the tag needs no server change.

## Repo layout

| Path | One line |
|---|---|
| `deploy/` | Hosting runbook: Apache `.htaccess`, nginx snippet, LiteSpeed notes, checklists, owner form |
| `dist/` | Build output (gitignored): prerendered HTML, assets, feeds, PWA files |
| `docs/` | Turkish operator docs, 01 to 09, plus `icerik/` |
| `public/` | Static passthrough: images, OG cards, structured data, robots.txt, sitemap.xml, PWA icons |
| `scripts/` | Build scripts: prerender, sitemap, feeds, route resolution, image dims, PWA icons |
| `src/` | App source: `App.tsx`, `main.tsx`, `components/`, `pages/`, `data/`, `utils/`, `constants/`, `types.ts`, `index.css` |
| `tests/` | `calendar.test.mjs` (unit), `e2e-matrix.mjs` (Playwright), `fixtures/routes.json` |
| `node_modules/` | Installed dependencies (gitignored) |
| `migration/` | This pack |

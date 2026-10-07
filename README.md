# Kocaeli Social Hub

Kocaeli'nin gençlik ve canlı etkinlik platformu. Speaking Club, workshoplar,
doğa yürüyüşleri, kamplar ve sosyal buluşmalar için tek adres.

A static single-page site. There is no backend, no server-side code and no API
key. Everything ships as plain files in `dist/`.

## Stack

- React 19 + TypeScript
- Vite 8 (dev server and build)
- Tailwind CSS 4
- PWA: service worker, offline app shell, installable
- Static hosting: GitHub Pages, or any static host (Apache, LiteSpeed, Nginx)

## Requirements

- Node.js 20.19+ or 22.12+ (see `.nvmrc` and the `engines` field in `package.json`)
- npm

## Local development

```sh
npm ci
npm run dev
```

Then open http://localhost:3000/.

## Build

```sh
npm run build:static
```

`build:static` runs the Vite build, prerenders the clean-URL routes, and
generates `404.html`, `sitemap.xml`, `robots.txt`, `feed.xml` and `events.ics`.
The plain `npm run build` only runs the Vite build and skips all of those, so
use `build:static` for anything you intend to deploy.

Output goes to `dist/`.

### Build-time environment variables

Both are optional and fall back to a default when unset.

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_BASE` | `/` | Base path when the site is served from a subpath, for example `/kocaeli-social-hub/`. |
| `SITE_ORIGIN` | inferred | Absolute origin used for canonical URLs, `og:url`, the sitemap and the RSS feed. |

Example for a GitHub Pages project page:

```sh
APP_BASE=/kocaeli-social-hub/ npm run build:static
```

## Deploy

The site is fully static. Upload the contents of `dist/` to any static host.

- GitHub Pages: push to the `main` branch and enable Pages for the repository,
  or publish `dist/` from a `gh-pages` branch. See `docs/03-yayina-alma.md`.
- Turkish host (cPanel / Apache / LiteSpeed): upload `dist/` to `public_html/`
  and copy `deploy/.htaccess` next to it. See `deploy/README.md` and
  `deploy/CHECKLIST.md`.

Routing is history-API based (`/events`, `/guide` and so on), so the server
must answer unknown paths with `index.html`. `deploy/.htaccess` and
`deploy/nginx.conf.snippet` provide that fallback.

## Documentation

- `docs/02-yerel-calistirma.md`: local setup
- `docs/03-yayina-alma.md`: publishing
- `docs/icerik/YAYINLAMA-REHBERI.md`: content publishing guide
- `deploy/`: deploy runbook, go-live checklist and server configs
- `tests/README.md`: end-to-end test matrix

## Tests

```sh
npm run test:calendar
node tests/e2e-matrix.mjs
```

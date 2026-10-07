# Handover checklist - Kocaeli Social Hub

Run these after the move to the new Distrobox system. Check each box only
after you have watched it pass.

## Build is reproducible

- [ ] `sh migration/bootstrap.sh` prints `SUMMARY: PASS`.
- [ ] `sh migration/verify.sh` exits 0.
- [ ] The Chromium headless shell is installed: `npx playwright install --with-deps --only-shell chromium` completes, and the browser sits under `$PLAYWRIGHT_BROWSERS_PATH` (default `$HOME/pw-browsers`, a host path that survives container rebuilds).
- [ ] `dist/` contains `index.html`, `assets/`, `images/`, `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`, `feed.xml`, `events.ics`, and one folder per route.

## Routes respond

- [ ] All nine clean URLs return 200: `/`, `/events`, `/vision`, `/clubs`, `/gallery`, `/contact`, `/blog`, `/sponsors`, `/guide`.
- [ ] An unknown path such as `/bilinmeyen-sayfa` serves the home page.
- [ ] A legacy `/#events` link lands on the events page.
- [ ] Browser Back and Forward move between routes.

## Feeds and structured data are present

- [ ] `dist/feed.xml` is valid RSS 2.0 with one item per blog post.
- [ ] `dist/events.ics` is a valid iCalendar file with VEVENTs for the next four weeks.
- [ ] `dist/sitemap.xml` lists the nine clean URLs.
- [ ] `dist/robots.txt` points at the sitemap.
- [ ] `dist/events/index.html` carries exactly one `events-jsonld` block.
- [ ] `dist/contact/index.html` carries exactly one `faq-jsonld` block.
- [ ] Every prerendered route carries exactly one `route-jsonld` block.

## PWA installs

- [ ] `manifest.webmanifest` is served as `application/manifest+json`.
- [ ] `sw.js` is served with `Cache-Control: no-cache, no-store, must-revalidate`.
- [ ] The 192, 512, and maskable icons are present.
- [ ] On a phone, the browser offers Add to Home Screen and the site opens standalone.

## Live data loads

- [ ] The finance ticker on `/guide` shows a number, or its documented fallback.
- [ ] The weather widget loads for the Kocaeli districts.
- [ ] No mixed-content warnings in the browser console.

## Sandbox-specific details to retire

These were true in the old opencode flatpak sandbox. They should not be
needed on the new system, and a few are hardcoded in the repo.

- [ ] Playwright is not a `package.json` dependency. It resolved from the sandbox `node_modules` or from the npx cache path `/home/bazzite/.npm/_npx`, which is hardcoded in `scripts/prerender.mjs` and `tests/e2e-matrix.mjs`. On the new host, install it with `npm install --no-save playwright` and `npx playwright install --with-deps --only-shell chromium`, and expect the hardcoded npx path to miss.
- [ ] Chromium binaries lived at `~/.cache/ms-playwright`, also hardcoded as a fallback in both scripts. The migration scripts instead set `PLAYWRIGHT_BROWSERS_PATH` to `$HOME/pw-browsers`.
- [ ] Node came from the sandbox at `~/.local/bin/node` (v24.19.0), not from a system package. The new system gets Node from the Fedora distro package `nodejs24` inside the container.
- [ ] The repo used to live at `/tmp/opencode/kocaeli-social-hub`, which is volatile. `tests/README.md` and `deploy/.deploy-summary.md` still name that path.
- [ ] `.env.example` carries `GEMINI_API_KEY` and `APP_URL` from AI Studio. Neither is used at runtime.
- [ ] The repo standardized on `package-lock.json` (the old `bun.lock` was dropped), so both scripts use `npm ci`.
- [ ] The E2E matrix writes its JSON to `/tmp/opencode/e2e-matrix.json`, so `/tmp/opencode` must exist. Under distrobox this is the container's own `/tmp`.

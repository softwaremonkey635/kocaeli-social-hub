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

## Sandbox-specific details (retired)

These were true in the old opencode flatpak sandbox. The repo has since been
de-sandboxed, so the hardcoded paths are gone. The checklist records the
current state.

- [ ] Playwright is still not a `package.json` dependency. `scripts/prerender.mjs` resolves it from `<repo>/node_modules/playwright` or, as a fallback, from the npx cache under `os.homedir()/.npm/_npx` (the path is built with `os.homedir()`, no hardcoded username). `tests/e2e-matrix.mjs` has no `_npx` reference. On a fresh host, install it with `npm install --no-save playwright` and `npx playwright install --with-deps --only-shell chromium`.
- [ ] Chromium binaries: `scripts/prerender.mjs` looks under `$PLAYWRIGHT_BROWSERS_PATH` or `os.homedir()/.cache/ms-playwright`. The migration scripts set `PLAYWRIGHT_BROWSERS_PATH` to `$HOME/pw-browsers`.
- [ ] Node comes from the Fedora distro package `nodejs24` inside the container (matches `.nvmrc` = 24 and `engines.node` >= 22).
- [ ] The repo no longer lives at `/tmp/opencode/kocaeli-social-hub`. Neither `tests/README.md` nor `deploy/.deploy-summary.md` names that path (`tests/README.md` writes its JSON to the OS temp dir; the deploy summary has been removed).
- [ ] `.env.example` is comment-only. It documents the two optional build-time variables (`APP_BASE`, `SITE_ORIGIN`) and carries no keys.
- [ ] The repo standardizes on `package-lock.json`; use `npm ci` for a clean install.
- [ ] The E2E matrix writes its JSON to `os.tmpdir()/e2e-matrix.json`, so no `/tmp/opencode` directory is required.

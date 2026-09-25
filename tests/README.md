# E2E Test Matrix

Comprehensive Playwright-based end-to-end checks for the Kocaeli Social Hub site after the hash-to-history-API routing migration.

## Prerequisites

- Node.js 18+
- Playwright with Chromium installed

### Installing Playwright

```bash
npm i -D playwright
npx playwright install chromium
```

If running inside the opencode flatpak sandbox, Playwright browsers resolve from the npx cache. The script will also fall back to:
```
/home/bazzite/.cache/ms-playwright/
```

## Running the Tests

### 1. Build and serve the site

```bash
cd /tmp/opencode/kocaeli-social-hub
npm run build          # produces dist/
npx serve dist -l 4173 # or any static server on a port
```

### 2. Run the test matrix

```bash
# Against the local preview server (default):
node tests/e2e-matrix.mjs

# Against a custom URL (live site, staging, etc.):
node tests/e2e-matrix.mjs https://your-domain.com/kocaeli-social-hub/
```

### 3. Read the output

- **stdout**: a PASS/FAIL line per check, followed by a summary table.
- **JSON**: `/tmp/opencode/e2e-matrix.json` contains every result with timestamps.
- **Exit code**: 0 = all pass, 1 = any failure.

## Route Fixture

`tests/fixtures/routes.json` is the canonical route manifest. It lists every route with:
- `path`: the clean URL path (e.g. `/events`)
- `pageId`: internal page identifier
- `title`: the expected `document.title` string
- `h1`: the expected rendered `<h1>` text (HTML entities decoded)
- `navLabel`: the text shown in the navbar (null if not in nav)
- `inNav`: whether this route has a clickable nav link

Edit this file if routes, titles, or h1 text change.

## Check Categories

| Check | What It Verifies |
|---|---|
| `http-status` | The page loads without a 4xx/5xx error |
| `console-errors` | Zero `console.error()` messages on the page |
| `page-errors` | Zero uncaught JS exceptions |
| `h1-count` | Exactly one `<h1>` element per page |
| `meta-description` | Exactly one `<meta name="description">` tag |
| `canonical-count` | Exactly one `<link rel="canonical">` tag |
| `jsonld-count` | Exactly one `<script id="route-jsonld">` with JSON-LD |
| `canonical-og-origin` | Canonical and `og:url` share the same origin and contain no `#` fragment |
| `title-nonempty` | `document.title` is non-empty |
| `title-variety` | Titles are not identical across all routes (at least 2 distinct values) |
| `no-horizontal-overflow` | On mobile (390px), `scrollWidth <= innerWidth + 1` (no horizontal scroll) |
| `nav-click` | Clicking each nav link changes `location.pathname` to the expected clean path and renders the matching h1 |
| `browser-back` | After navigation, the Back button returns to the previous path and page |
| `deep-link` | Direct URL access to each clean path loads correctly (fresh page, no prior navigation) |
| `unknown-path` | An unknown path (e.g. `/bilinmeyen-sayfa`) resolves to the home page |
| `legacy-hash` | `/#events` (legacy hash) lands on the events page content |
| `fx-ticker` | On `/guide`, the Finance ticker shows at least one numeric value or the documented fallback |
| `event-modal-open` | On `/events`, clicking an event card opens the modal dialog |
| `modal-controls` | The event modal contains Google Calendar, ICS download, and WhatsApp share controls (at least 2 of 3) |
| `service-worker` | `navigator.serviceWorker.ready` resolves (PWA registration works) |

## Viewports

Two viewports are tested for the per-route checks:
- **desktop**: 1400 x 900
- **mobile**: 390 x 844 (iPhone-like)

Navigation and feature smokes run at desktop viewport only.

## Exit Behavior

The script exits non-zero if any check fails. This makes it suitable for CI pipelines:

```bash
node tests/e2e-matrix.mjs https://staging.example.com/ || echo "E2E FAILED"
```

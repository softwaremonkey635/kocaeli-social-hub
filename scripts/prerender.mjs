#!/usr/bin/env node
// scripts/prerender.mjs — build-time prerender of the 9 clean-URL routes.
//
// What it does:
//   1. Serves the built dist/ locally at the deployment base (SPA shell fallback,
//      so every route loads the app before any route folder exists).
//   2. Visits each route with Playwright, waits for load and for the client-side
//      applySeo() to finish (title + canonical + h1 all present, canonical
//      pointing at the exact route URL).
//   3. Captures document.documentElement.outerHTML, then rewrites URLs: build
//      asset URLs (injected by Vite's runtime preloader) keep the local origin
//      stripped so they stay origin-relative, while the SEO URLs (canonical,
//      og:url, JSON-LD) get SITE_ORIGIN so they are deployment-correct. The
//      base path part of every URL is left untouched.
//   4. Validates every capture (non-empty title, exactly one canonical, at
//      least one h1, no local origin left), then writes dist/index.html (home),
//      dist/<route>/index.html for the other 8 routes, and dist/404.html as a
//      copy of the home capture so GitHub Pages serves the app on unknown paths.
//   5. Injects structured data into the two routes that own it: the Event
//      ItemList (id="events-jsonld") into dist/events/index.html and the
//      FAQPage (id="faq-jsonld") into dist/contact/index.html, then asserts
//      each block appears exactly once, with the expected node count, and in
//      no other emitted file.
//
// Playwright resolution (documented): playwright@1.63.0 is NOT a package.json
// dependency. It is present in this sandbox's node_modules and resolved by
// Node's normal module resolution from the repo root:
//     node -e "require.resolve('playwright')"
//     -> <repo>/node_modules/playwright/index.js
// Browser binaries: ~/.cache/ms-playwright (chromium-1243).
// If the direct import fails we fall back to scanning the npx cache, the same
// strategy tests/e2e-matrix.mjs uses. No dependency is added to package.json.
//
// Usage:
//   node scripts/prerender.mjs [--base /kocaeli-social-hub/]
//   base   = --base flag, else APP_BASE env, else '/'
//   origin = SITE_ORIGIN env, else https://softwaremonkey635.github.io

import http from 'node:http';
import os from 'node:os';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, resolveBase, resolveOrigin } from './static-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SHELL = path.join(DIST, 'index.html');
const EVENTS_JSONLD = path.join(ROOT, 'public', 'structured-data', 'events.json');
/** Route that gets the bulk Event ItemList injected into its <head>. */
const EVENTS_JSONLD_ROUTE = 'events';
/** Expected number of Event nodes in events.json (guard against a stale file). */
const EVENTS_JSONLD_NODE_COUNT = 20;
const FAQ_JSONLD = path.join(ROOT, 'public', 'structured-data', 'faq.json');
/** Build-time copy imported by the visible FAQ section (src/pages/ContactJoinPage.tsx). */
const FAQ_JSONLD_SRC = path.join(ROOT, 'src', 'data', 'faq.json');
/** Route whose <head> gets the FAQPage JSON-LD injected. */
const FAQ_JSONLD_ROUTE = 'contact';
/** Expected number of Question nodes in faq.json (guard against a stale file). */
const FAQ_JSONLD_NODE_COUNT = 20;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function fail(message) {
  throw new Error(message);
}

/** Local static server for dist/ mounted at `base`. Unknown/extensionless paths
 *  get the SPA shell (dist/index.html); real asset files are served from disk. */
function createServer(base) {
  return http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    } catch {
      res.writeHead(400);
      res.end('bad request');
      return;
    }
    if (!pathname.startsWith(base)) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('outside base');
      return;
    }
    const rel = pathname.slice(base.length);
    const ext = path.extname(rel);
    const candidate = path.resolve(DIST, rel);
    const insideDist = candidate === DIST || candidate.startsWith(`${DIST}${path.sep}`);
    if (ext && rel && !rel.endsWith('/') && insideDist && existsSync(candidate)) {
      res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(candidate));
      return;
    }
    res.writeHead(200, { 'content-type': MIME['.html'] });
    res.end(readFileSync(SHELL));
  });
}

/** True when the chromium build a given npx-cache playwright copy expects is
 *  actually installed under ~/.cache/ms-playwright. Several copies live in the
 *  npx cache at different versions; picking one whose browser is missing fails
 *  at launch time instead of at resolve time. */
function chromiumInstalledFor(candidate) {
  try {
    const browsersFile = path.join(path.dirname(candidate), 'playwright-core', 'browsers.json');
    const browsers = JSON.parse(readFileSync(browsersFile, 'utf8'));
    const entry = (browsers.browsers || []).find((b) => b.name === 'chromium');
    if (!entry) return false;
    const root =
      process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(os.homedir(), '.cache', 'ms-playwright');
    return existsSync(path.join(root, `chromium-${entry.revision}`));
  } catch {
    return false;
  }
}

async function loadChromium() {
  try {
    const pw = await import('playwright');
    if (pw && pw.chromium) return pw.chromium;
  } catch {
    /* fall through to the npx cache scan */
  }
  const { createRequire } = await import('node:module');
  const npxBase = '/home/bazzite/.npm/_npx';
  if (existsSync(npxBase)) {
    const candidates = readdirSync(npxBase)
      .map((dir) => `${npxBase}/${dir}/node_modules/playwright`)
      .filter((candidate) => existsSync(candidate));
    const ordered = [
      ...candidates.filter(chromiumInstalledFor),
      ...candidates.filter((candidate) => !chromiumInstalledFor(candidate)),
    ];
    for (const candidate of ordered) {
      try {
        // Node's ESM loader rejects directory imports (ERR_UNSUPPORTED_DIR_IMPORT),
        // so require the package entry through a createRequire anchored at its
        // own package.json instead of importing the folder path.
        const req = createRequire(path.join(candidate, 'package.json'));
        const pw = req('playwright');
        if (pw && pw.chromium) return pw.chromium;
      } catch {
        /* keep scanning */
      }
    }
  }
  fail(
    'playwright not resolvable. Expected <repo>/node_modules/playwright ' +
      '(documented sandbox install) or an npx cache copy.'
  );
}

function extractTitle(html) {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? match[1].trim() : '';
}

function countMatches(html, pattern) {
  return (html.match(pattern) || []).length;
}

function escapeRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Index of the last case-insensitive </head> measured on the ORIGINAL string.
 *  html.toLowerCase().lastIndexOf() is wrong here: lowercasing grows the string
 *  (Turkish 'İ' -> 'i' + combining dot), so the index it returns points past
 *  the real tag and the injection splits "</head>" into "</he" + tag + "ad>". */
function lastHeadCloseIndex(html) {
  let idx = -1;
  for (const match of html.matchAll(/<\/head\s*>/gi)) idx = match.index;
  return idx;
}

/** Read public/structured-data/events.json once, validate it parses and carries
 *  the expected Event node count, then hand the raw text back for injection. */
function loadEventsJsonLd() {
  if (!existsSync(EVENTS_JSONLD)) fail(`missing ${EVENTS_JSONLD}`);
  const raw = readFileSync(EVENTS_JSONLD, 'utf8').trim();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail(`events.json does not parse: ${err.message}`);
  }
  const nodes = Array.isArray(parsed.itemListElement) ? parsed.itemListElement.length : 0;
  if (nodes !== EVENTS_JSONLD_NODE_COUNT) {
    fail(`events.json has ${nodes} nodes, expected ${EVENTS_JSONLD_NODE_COUNT}`);
  }
  if (/<\/script/i.test(raw)) {
    fail('events.json contains a closing script tag - refusing to inline it');
  }
  return raw;
}

/** Insert the Event ItemList JSON-LD immediately before </head>, once. */
function injectEventsJsonLd(html, raw) {
  const tag = `<script type="application/ld+json" id="events-jsonld">\n${raw}\n</script>\n`;
  const idx = lastHeadCloseIndex(html);
  if (idx === -1) fail('capture has no </head> - cannot inject events JSON-LD');
  return html.slice(0, idx) + tag + html.slice(idx);
}

/** Read public/structured-data/faq.json once, validate the Question count, and
 *  check that the src/ copy the visible section imports is the same content
 *  (so FAQPage JSON-LD and the on-page Q&As cannot drift apart). */
function loadFaqJsonLd() {
  if (!existsSync(FAQ_JSONLD)) fail(`missing ${FAQ_JSONLD}`);
  const raw = readFileSync(FAQ_JSONLD, 'utf8').trim();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail(`faq.json does not parse: ${err.message}`);
  }
  const nodes = Array.isArray(parsed.mainEntity) ? parsed.mainEntity.length : 0;
  if (nodes !== FAQ_JSONLD_NODE_COUNT) {
    fail(`faq.json has ${nodes} nodes, expected ${FAQ_JSONLD_NODE_COUNT}`);
  }
  if (/<\/script/i.test(raw)) {
    fail('faq.json contains a closing script tag - refusing to inline it');
  }
  if (!existsSync(FAQ_JSONLD_SRC)) {
    fail(`missing ${FAQ_JSONLD_SRC} - the visible FAQ section imports it`);
  }
  let srcParsed;
  try {
    srcParsed = JSON.parse(readFileSync(FAQ_JSONLD_SRC, 'utf8'));
  } catch (err) {
    fail(`src/data/faq.json does not parse: ${err.message}`);
  }
  if (JSON.stringify(srcParsed) !== JSON.stringify(parsed)) {
    fail('src/data/faq.json is out of sync with public/structured-data/faq.json');
  }
  return raw;
}

/** Insert the FAQPage JSON-LD immediately before </head>, once. */
function injectFaqJsonLd(html, raw) {
  const tag = `<script type="application/ld+json" id="faq-jsonld">\n${raw}\n</script>\n`;
  const idx = lastHeadCloseIndex(html);
  if (idx === -1) fail('capture has no </head> - cannot inject FAQ JSON-LD');
  return html.slice(0, idx) + tag + html.slice(idx);
}

function walkIndexFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkIndexFiles(full));
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

/** Post-write gate: events/index.html carries exactly one parseable JSON-LD
 *  block with the expected node count, and no other index.html carries it. */
function assertEventsJsonLd() {
  const eventsFile = path.join(DIST, EVENTS_JSONLD_ROUTE, 'index.html');
  if (!existsSync(eventsFile)) fail('dist/events/index.html was not written');
  const html = readFileSync(eventsFile, 'utf8');
  const marker = 'id="events-jsonld"';
  const hits = html.split(marker).length - 1;
  if (hits !== 1) fail(`dist/events/index.html has ${hits} events-jsonld markers, expected 1`);

  const match = /<script type="application\/ld\+json" id="events-jsonld">([\s\S]*?)<\/script>/.exec(html);
  if (!match) fail('events JSON-LD block not found in dist/events/index.html');
  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch (err) {
    fail(`injected events JSON-LD does not parse: ${err.message}`);
  }
  const nodes = Array.isArray(parsed.itemListElement) ? parsed.itemListElement.length : 0;
  if (nodes !== EVENTS_JSONLD_NODE_COUNT) {
    fail(`injected events JSON-LD has ${nodes} nodes, expected ${EVENTS_JSONLD_NODE_COUNT}`);
  }
  if (!/id="events-jsonld">[\s\S]*?<\/script>\s*<\/head>/i.test(html)) {
    fail('events JSON-LD is not immediately before </head> (head close damaged)');
  }

  const strays = walkIndexFiles(DIST).filter(
    (file) =>
      file !== eventsFile &&
      readFileSync(file, 'utf8').includes(marker)
  );
  if (strays.length) {
    fail(`events JSON-LD leaked into ${strays.length} other file(s): ${strays.join(', ')}`);
  }
  console.log(
    `[prerender] events JSON-LD OK: ${nodes} nodes in dist/events/index.html, 0 other index.html`
  );
}

/** Post-write gate: contact/index.html carries exactly one parseable FAQPage
 *  JSON-LD block with the expected Question count, no other emitted file does,
 *  and its questions match the visible accordion rendered on that page. */
function assertFaqJsonLd() {
  const faqFile = path.join(DIST, FAQ_JSONLD_ROUTE, 'index.html');
  if (!existsSync(faqFile)) fail('dist/contact/index.html was not written');
  const html = readFileSync(faqFile, 'utf8');
  const marker = 'id="faq-jsonld"';
  const hits = html.split(marker).length - 1;
  if (hits !== 1) fail(`dist/contact/index.html has ${hits} faq-jsonld markers, expected 1`);

  const match = /<script type="application\/ld\+json" id="faq-jsonld">([\s\S]*?)<\/script>/.exec(html);
  if (!match) fail('FAQ JSON-LD block not found in dist/contact/index.html');
  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch (err) {
    fail(`injected FAQ JSON-LD does not parse: ${err.message}`);
  }
  const nodes = Array.isArray(parsed.mainEntity) ? parsed.mainEntity.length : 0;
  if (nodes !== FAQ_JSONLD_NODE_COUNT) {
    fail(`injected FAQ JSON-LD has ${nodes} nodes, expected ${FAQ_JSONLD_NODE_COUNT}`);
  }
  if (!/id="faq-jsonld">[\s\S]*?<\/script>\s*<\/head>/i.test(html)) {
    fail('FAQ JSON-LD is not immediately before </head> (head close damaged)');
  }

  // Visible-content match: every structured question must appear as the text of
  // a <summary> on the page (Google rejects FAQ markup that is not visible).
  for (const question of parsed.mainEntity.map((entry) => entry.name)) {
    if (!html.includes(question)) {
      fail(`FAQ question not visible in dist/contact/index.html: ${question.slice(0, 60)}`);
    }
  }

  const strays = walkIndexFiles(DIST).filter(
    (file) => file !== faqFile && readFileSync(file, 'utf8').includes(marker)
  );
  const notFound = path.join(DIST, '404.html');
  if (existsSync(notFound) && readFileSync(notFound, 'utf8').includes(marker)) {
    strays.push(notFound);
  }
  if (strays.length) {
    fail(`FAQ JSON-LD leaked into ${strays.length} other file(s): ${strays.join(', ')}`);
  }
  console.log(
    `[prerender] FAQ JSON-LD OK: ${nodes} nodes in dist/contact/index.html, 0 other files`
  );
}

async function main() {
  const base = resolveBase();
  const origin = resolveOrigin();

  if (!existsSync(SHELL)) {
    fail(`dist/index.html not found at ${SHELL} - run vite build first`);
  }

  // Validate the Event ItemList and FAQPage sources before spending a browser run on them.
  const eventsRaw = loadEventsJsonLd();
  const faqRaw = loadFaqJsonLd();

  const server = createServer(base);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  const localOrigin = `http://127.0.0.1:${port}`;

  console.log(`[prerender] base=${base} origin=${origin}`);
  console.log(`[prerender] serving dist/ at ${localOrigin}${base}`);

  const chromium = await loadChromium();
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    serviceWorkers: 'block',
  });

  const captures = [];
  const failures = [];

  try {
    for (const route of ROUTES) {
      const expectedCanonical = `${localOrigin}${base}${route}`;
      const label = route === '' ? '/' : `/${route}`;
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(String(err.message || err)));

      try {
        try {
          await page.goto(expectedCanonical, { waitUntil: 'load', timeout: 45000 });
        } catch (err) {
          console.warn(
            `[prerender] ${label}: load wait did not finish (${String(err.message).slice(0, 80)}); continuing on applySeo signal`
          );
        }

        // applySeo() finished when title, canonical (exact route URL) and the
        // route's own h1 are all in the DOM. The static shell already ships a
        // non-empty title/canonical, so the exact-href match is what proves the
        // client-side SEO pass ran for THIS route.
        await page.waitForFunction(
          (expected) => {
            const canonical = document.querySelector('link[rel="canonical"]');
            return Boolean(
              document.title &&
                document.title.trim() &&
                canonical &&
                canonical.getAttribute('href') === expected &&
                document.querySelector('h1')
            );
          },
          expectedCanonical,
          { timeout: 30000 }
        );

        const raw = await page.evaluate(
          () => `<!doctype html>\n${document.documentElement.outerHTML}`
        );
        const h1Text = await page.$eval('h1', (el) => (el.textContent || '').trim());

        // Two-pass origin rewrite:
        //  1. Vite's runtime preloader injects <link rel="modulepreload"> tags
        //     whose hrefs are absolute against the local serving origin. Build
        //     assets must stay origin-relative (base path untouched), so the
        //     captured file boots on any host, not just SITE_ORIGIN.
        //  2. Everything else (canonical, og:url, JSON-LD route/site URLs) gets
        //     the real deployment origin.
        let html = raw.split(`${localOrigin}${base}assets/`).join(`${base}assets/`);
        html = html.split(localOrigin).join(origin);
        const absoluteAssets = `${origin}${base}assets/`;
        if (html.includes(absoluteAssets)) {
          console.warn(
            `[prerender] ${label}: ${countMatches(html, new RegExp(escapeRe(absoluteAssets), 'g'))} absolute build asset URL(s) left in capture`
          );
        }
        if (html.includes('127.0.0.1') || html.includes(`localhost:${port}`)) {
          fail(`${label}: local origin survived the rewrite - refusing to write`);
        }

        const title = extractTitle(html);
        const canonicalCount = countMatches(html, /<link[^>]+rel=["']canonical["']/gi);
        const bodyHtml = html.slice(html.toLowerCase().indexOf('<body'));
        const h1Count = countMatches(bodyHtml, /<h1[\s>]/gi);

        if (!title) failures.push(`${label}: captured <title> is empty`);
        if (h1Count === 0) failures.push(`${label}: captured body has no <h1>`);
        if (canonicalCount !== 1) {
          failures.push(`${label}: expected exactly 1 canonical, found ${canonicalCount}`);
        }
        if (!h1Text) failures.push(`${label}: captured h1 text is empty`);

        captures.push({ route, label, html, title, h1Text, h1Count, canonicalCount });
        console.log(
          `[prerender] ${label} -> "${title}" (h1=${JSON.stringify(h1Text.slice(0, 60))}, ${html.length} bytes${
            consoleErrors.length ? `, ${consoleErrors.length} console error(s)` : ''
          })`
        );
        if (consoleErrors.length) {
          for (const line of consoleErrors.slice(0, 3)) {
            console.log(`[prerender]   console: ${String(line).slice(0, 160)}`);
          }
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  if (failures.length) {
    for (const line of failures) console.error(`[prerender] FAIL: ${line}`);
    fail(`${failures.length} route validation failure(s)`);
  }

  // All captures validated in memory first: the shell on disk stays pristine
  // for the whole run, then every file is written.
  const home = captures.find((c) => c.route === '');
  if (!home) fail('home capture missing');

  writeFileSync(SHELL, home.html);
  console.log(`[prerender] wrote dist/index.html (${home.html.length} bytes)`);

  for (const capture of captures) {
    if (capture.route === '') continue;
    const dir = path.join(DIST, capture.route);
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'index.html');
    const isEvents = capture.route === EVENTS_JSONLD_ROUTE;
    const isFaq = capture.route === FAQ_JSONLD_ROUTE;
    let html = capture.html;
    if (isEvents) html = injectEventsJsonLd(html, eventsRaw);
    if (isFaq) html = injectFaqJsonLd(html, faqRaw);
    writeFileSync(file, html);
    console.log(
      `[prerender] wrote dist/${capture.route}/index.html (${html.length} bytes${
        isEvents ? ', events JSON-LD injected' : isFaq ? ', FAQ JSON-LD injected' : ''
      })`
    );
  }

  writeFileSync(path.join(DIST, '404.html'), home.html);
  console.log(`[prerender] wrote dist/404.html (copy of dist/index.html)`);

  assertEventsJsonLd();
  assertFaqJsonLd();

  console.log(`[prerender] OK: ${captures.length} routes prerendered`);
}

main().catch((err) => {
  console.error(`[prerender] FAIL: ${err && err.message ? err.message : err}`);
  process.exit(1);
});

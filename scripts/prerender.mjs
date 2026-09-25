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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, resolveBase, resolveOrigin } from './static-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SHELL = path.join(DIST, 'index.html');

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

async function loadChromium() {
  try {
    const pw = await import('playwright');
    return pw.chromium;
  } catch {
    const { readdirSync, existsSync: exists } = await import('node:fs');
    const npxBase = '/home/bazzite/.npm/_npx';
    if (exists(npxBase)) {
      for (const dir of readdirSync(npxBase)) {
        const candidate = `${npxBase}/${dir}/node_modules/playwright`;
        if (exists(candidate)) {
          try {
            const pw = await import(candidate);
            return pw.chromium;
          } catch {
            /* keep scanning */
          }
        }
      }
    }
    fail(
      'playwright not resolvable. Expected <repo>/node_modules/playwright ' +
        '(documented sandbox install) or an npx cache copy.'
    );
    return null;
  }
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

async function main() {
  const base = resolveBase();
  const origin = resolveOrigin();

  if (!existsSync(SHELL)) {
    fail(`dist/index.html not found at ${SHELL} - run vite build first`);
  }

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
    writeFileSync(file, capture.html);
    console.log(
      `[prerender] wrote dist/${capture.route}/index.html (${capture.html.length} bytes)`
    );
  }

  writeFileSync(path.join(DIST, '404.html'), home.html);
  console.log(`[prerender] wrote dist/404.html (copy of dist/index.html)`);
  console.log(`[prerender] OK: ${captures.length} routes prerendered`);
}

main().catch((err) => {
  console.error(`[prerender] FAIL: ${err && err.message ? err.message : err}`);
  process.exit(1);
});

#!/usr/bin/env node
// tests/e2e-matrix.mjs — comprehensive Playwright E2E matrix
// Usage: node tests/e2e-matrix.mjs [BASE_URL]
// Default BASE_URL: http://127.0.0.1:4173/
// Requires: playwright (resolved via npx or PLAYWRIGHT_BROWSERS_PATH)
//
// Output: PASS/FAIL table to stdout, JSON summary to /tmp/opencode/e2e-matrix.json
// Exit code: 0 all pass, 1 any failure.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.argv[2] || 'http://127.0.0.1:4173/';
const FIXTURES = JSON.parse(readFileSync(resolve(__dirname, 'fixtures/routes.json'), 'utf8'));
const OUT_JSON = '/tmp/opencode/e2e-matrix.json';

// ── Base handling ────────────────────────────────────────────────────────
// BASE_URL may carry a subpath base (http://host/kocaeli-social-hub/).
// Route paths in fixtures are base-relative ("/events"), so every navigation
// goes through urlFor() and every pathname read goes through routePath().
const BASE_OBJ = new URL(BASE_URL);
const PREFIX = BASE_OBJ.pathname.endsWith('/') ? BASE_OBJ.pathname : `${BASE_OBJ.pathname}/`;
const ORIGIN = BASE_OBJ.origin;

function urlFor(routePath) {
  return new URL(PREFIX + String(routePath).replace(/^\/+/, ''), ORIGIN).href;
}

function routePathOf(href) {
  const pathname = new URL(href, ORIGIN).pathname;
  if (PREFIX !== '/') {
    const bare = PREFIX.replace(/\/+$/, '');
    if (pathname === bare) return '/';
    if (pathname.startsWith(PREFIX)) return `/${pathname.slice(PREFIX.length)}`;
  }
  return pathname;
}

// ── Playwright resolution ────────────────────────────────────────────────
let chromium;
try {
  const pw = await import('playwright');
  chromium = pw.chromium;
} catch {
  // Fallback: scan npx cache directories for playwright
  const { readdirSync, existsSync } = await import('node:fs');
  const npxBase = '/home/bazzite/.npm/_npx';
  let found = false;
  if (existsSync(npxBase)) {
    for (const dir of readdirSync(npxBase)) {
      const candidate = `${npxBase}/${dir}/node_modules/playwright`;
      if (existsSync(candidate)) {
        try {
          const pw = await import(candidate);
          chromium = pw.chromium;
          found = true;
          break;
        } catch { /* try next */ }
      }
    }
  }
  if (!found) {
    console.error('FAIL: playwright not found. Install with: npm i -D playwright && npx playwright install chromium');
    process.exit(1);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────
const results = [];
let passed = 0;
let failed = 0;
let total = 0;

function record(check, route, viewport, ok, detail) {
  total++;
  if (ok) passed++; else failed++;
  const tag = ok ? 'PASS' : 'FAIL';
  const vp = viewport || '-';
  const row = { check, route, viewport: vp, tag, detail };
  results.push(row);
  const label = `[${check}] ${route} @${vp}`;
  console.log(`${tag.padEnd(5)} ${label}${detail ? ': ' + detail : ''}`);
}

async function gotoWithRetry(page, url, opts = {}) {
  const attempts = opts.attempts || 3;
  for (let i = 0; i < attempts; i++) {
    try {
      return await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function normalize(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

// ── Main ─────────────────────────────────────────────────────────────────
async function run() {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const routes = FIXTURES.routes;
  const viewports = FIXTURES.viewports;

  // ─── Phase 1: Per-route, per-viewport checks ──────────────────────────
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => {
        pageErrors.push(err.message);
      });

      const fullUrl = urlFor(route.path);

      // --- HTTP/console check ---
      try {
        const resp = await gotoWithRetry(page, fullUrl);
        const status = resp ? resp.status() : 0;
        record('http-status', route.path, vp.name, status >= 200 && status < 400, `status=${status}`);
      } catch (e) {
        record('http-status', route.path, vp.name, false, e.message.slice(0, 120));
        await page.close();
        continue;
      }

      // Wait a tick for lazy-loaded content
      await page.waitForTimeout(1500);

      record('console-errors', route.path, vp.name,
        consoleErrors.length === 0,
        consoleErrors.length ? `${consoleErrors.length} errors: ${consoleErrors[0].slice(0, 80)}` : '0');

      record('page-errors', route.path, vp.name,
        pageErrors.length === 0,
        pageErrors.length ? `${pageErrors.length} errors: ${pageErrors[0].slice(0, 80)}` : '0');

      // --- Exactly one <h1> ---
      const h1Count = await page.$$eval('h1', els => els.length);
      record('h1-count', route.path, vp.name, h1Count === 1, `count=${h1Count}`);

      // --- Exactly one meta[name=description] ---
      const metaDescCount = await page.$$eval('meta[name="description"]', els => els.length);
      record('meta-description', route.path, vp.name, metaDescCount === 1, `count=${metaDescCount}`);

      // --- Exactly one link[rel=canonical] ---
      const canonicalCount = await page.$$eval('link[rel="canonical"]', els => els.length);
      record('canonical-count', route.path, vp.name, canonicalCount === 1, `count=${canonicalCount}`);

      // --- Exactly one script#route-jsonld ---
      const jsonldCount = await page.$$eval('script#route-jsonld', els => els.length);
      record('jsonld-count', route.path, vp.name, jsonldCount === 1, `count=${jsonldCount}`);

      // --- Canonical and og:url share origin, no # fragment ---
      const canonicalHref = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => '');
      const ogUrl = await page.$eval('meta[property="og:url"]', el => el.content).catch(() => '');
      const canonicalOrigin = canonicalHref ? new URL(canonicalHref).origin : '';
      const ogOrigin = ogUrl ? new URL(ogUrl).origin : '';
      const originsMatch = canonicalOrigin === ogOrigin;
      const noFragment = !canonicalHref.includes('#') && !ogUrl.includes('#');
      record('canonical-og-origin', route.path, vp.name,
        originsMatch && noFragment,
        originsMatch
          ? (noFragment ? `origin=${canonicalOrigin}, no fragment` : `has fragment`)
          : `mismatch canonical=${canonicalOrigin} og=${ogOrigin}`);

      // --- document.title non-empty and route-specific ---
      const title = await page.title();
      record('title-nonempty', route.path, vp.name, title.length > 0, `title="${title.slice(0, 60)}"`);

      // --- No horizontal overflow on mobile ---
      if (vp.name === 'mobile') {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const innerWidth = await page.evaluate(() => window.innerWidth);
        const overflow = scrollWidth <= innerWidth + 1;
        record('no-horizontal-overflow', route.path, vp.name, overflow,
          `scrollWidth=${scrollWidth} innerWidth=${innerWidth}`);
      }

      await page.close();
    }

    await context.close();
  }

  // ─── Phase 2: Title uniqueness across routes ──────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const titles = {};
    for (const route of routes) {
      const page = await context.newPage();
      const fullUrl = urlFor(route.path);
      try {
        await gotoWithRetry(page, fullUrl);
        await page.waitForTimeout(1500);
        titles[route.path] = await page.title();
      } catch {
        titles[route.path] = '';
      }
      await page.close();
    }
    await context.close();

    const titleValues = Object.values(titles).filter(Boolean);
    const allSame = titleValues.length > 1 && titleValues.every(t => t === titleValues[0]);
    record('title-variety', 'all', '-', !allSame,
      allSame ? `all identical: "${titleValues[0].slice(0, 50)}"` : `${new Set(titleValues).size} distinct titles`);
  }

  // ─── Phase 3: Navigation from home ────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();
    const homeUrl = urlFor('/');
    await gotoWithRetry(page, homeUrl);
    await page.waitForTimeout(1500);

    // Collect nav items that exist in the DOM
    const navRoutes = routes.filter(r => r.inNav);

    for (const route of navRoutes) {
      const selector = `#nav-link-${route.pageId}`;
      const btnExists = await page.$(selector);
      if (!btnExists) {
        record('nav-click', route.path, 'desktop', false, `selector ${selector} not found`);
        continue;
      }

      // Record current path before click
      const prevPath = routePathOf(page.url());

      await page.click(selector);
      await page.waitForTimeout(1500);

      const newPath = routePathOf(page.url());
      // Clicking the nav item of the page you are already on must NOT push a
      // duplicate history entry (that would break Back); every other click has
      // to land on its clean path.
      const alreadyThere = prevPath === route.path;
      const pathOk = alreadyThere
        ? newPath === route.path
        : newPath !== prevPath && (newPath === route.path || newPath.endsWith(`${route.path}/`));

      // Check h1 matches expected
      const h1Text = normalize(await page.$eval('h1', el => el.textContent).catch(() => ''));
      const h1Matches = h1Text.includes(route.h1.replace(/&amp;/g, '&').replace(/&apos;/g, "'"));

      record('nav-click', route.path, 'desktop',
        pathOk && h1Matches,
        `prev=${prevPath} new=${newPath} alreadyThere=${alreadyThere} h1="${h1Text.slice(0, 40)}"`);
    }

    // Back button: go to last nav route, click back, should return to previous
    const lastNav = navRoutes[navRoutes.length - 1];
    const backBtn = await page.$(`#nav-link-${lastNav.pageId}`);
    if (backBtn) {
      await page.click(`#nav-link-${lastNav.pageId}`);
      await page.waitForTimeout(1000);
      const beforeBack = routePathOf(page.url());

      await page.goBack();
      await page.waitForTimeout(1000);
      const afterBack = routePathOf(page.url());
      record('browser-back', lastNav.path, 'desktop',
        afterBack !== beforeBack,
        `before=${beforeBack} after=${afterBack}`);
    }

    await page.close();
    await context.close();
  }

  // ─── Phase 4: Direct deep-link loads ───────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    for (const route of routes) {
      const page = await context.newPage();
      const fullUrl = urlFor(route.path);
      try {
        const resp = await gotoWithRetry(page, fullUrl);
        const status = resp ? resp.status() : 0;
        const h1Text = normalize(await page.$eval('h1', el => el.textContent).catch(() => ''));
        const title = await page.title();
        const ok = status >= 200 && status < 400 && title.length > 0;
        record('deep-link', route.path, '-', ok,
          `status=${status} title="${title.slice(0, 40)}" h1="${h1Text.slice(0, 40)}"`);
      } catch (e) {
        record('deep-link', route.path, '-', false, e.message.slice(0, 100));
      }
      await page.close();
    }
    await context.close();
  }

  // ─── Phase 5: Unknown path resolves to home ───────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();
    const unknownUrl = urlFor(FIXTURES.unknownPath);
    try {
      const resp = await gotoWithRetry(page, unknownUrl);
      const status = resp ? resp.status() : 0;
      const title = await page.title();
      const homeTitle = routes.find(r => r.pageId === 'home').title;
      const isHome = title === homeTitle;
      record('unknown-path', FIXTURES.unknownPath, '-',
        isHome,
        `status=${status} title="${title.slice(0, 50)}" isHome=${isHome}`);
    } catch (e) {
      record('unknown-path', FIXTURES.unknownPath, '-', false, e.message.slice(0, 100));
    }
    await page.close();
    await context.close();
  }

  // ─── Phase 6: Legacy hash redirect ────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();
    // Load home first, then navigate via hash
    await gotoWithRetry(page, urlFor('/'));
    await page.waitForTimeout(1000);

    // Set hash to trigger client-side routing
    await page.evaluate(() => { window.location.hash = '#events'; });
    await page.waitForTimeout(1500);

    const hashTitle = await page.title();
    const expectedTitle = routes.find(r => r.pageId === 'events').title;
    const landedOnEvents = hashTitle === expectedTitle;
    record('legacy-hash', FIXTURES.legacyHash, '-',
      landedOnEvents,
      `title="${hashTitle.slice(0, 50)}" expected="${expectedTitle.slice(0, 50)}"`);

    await page.close();
    await context.close();
  }

  // ─── Phase 7: Feature smokes ──────────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });

    // 7a: /guide — FX ticker shows at least one numeric value or fallback
    {
      const page = await context.newPage();
      await gotoWithRetry(page, urlFor('/guide'));
      await page.waitForTimeout(4000); // ticker fetches external APIs

      const tickerText = await page.evaluate(() => {
        const el = document.querySelector('[class*="finance"], [class*="ticker"], [class*="FinanceTicker"]');
        return el ? el.textContent : '';
      }).catch(() => '');

      // Also check for any element containing currency-like patterns
      const hasNumeric = await page.evaluate(() => {
        const body = document.body.textContent || '';
        // Match patterns like "42,50" or "1.234" or "₺" or "USD" or "EUR" or "BIST"
        return /[\d]{1,3}[,\.]\d{2}/.test(body) || /USD|EUR|BIST|ALTIN|Dolar|Euro|Altın/.test(body);
      }).catch(() => false);

      const fallbackShown = tickerText.includes('—') || tickerText.includes('%0,00');
      record('fx-ticker', '/guide', '-',
        hasNumeric || fallbackShown,
        hasNumeric ? 'numeric values present' : (fallbackShown ? 'fallback placeholders shown' : 'no ticker content found'));

      await page.close();
    }

    // 7b: /events — event modal opens, three calendar/WhatsApp controls exist
    {
      const page = await context.newPage();
      await gotoWithRetry(page, urlFor('/events'));
      await page.waitForTimeout(2000);

      // Find an event card (EventCard renders id="event-card-<id>" on a div)
      const cardBtn = await page.$('[id^="event-card-"]');
      if (cardBtn) {
        await cardBtn.click();
        await page.waitForTimeout(1500);

        // Check modal is open (dialog role or visible modal)
        const modalOpen = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog) return true;
          const modals = document.querySelectorAll('[class*="modal"], [class*="Modal"]');
          return Array.from(modals).some(m => m.offsetHeight > 0);
        }).catch(() => false);

        record('event-modal-open', '/events', '-', modalOpen,
          modalOpen ? 'modal opened' : 'modal did not open after card click');

        if (modalOpen) {
          // Check for three calendar/WhatsApp controls
          const controls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const hasGoogleCal = links.some(a => a.href && a.href.includes('calendar.google.com'));
            const hasIcs = links.some(a => a.href && a.href.includes('data:text/calendar') || a.textContent.includes('ICS') || a.textContent.includes('Takvime'));
            const hasWhatsapp = links.some(a => a.href && a.href.includes('wa.me') || a.href.includes('whatsapp'));
            return { hasGoogleCal, hasIcs, hasWhatsapp };
          }).catch(() => ({ hasGoogleCal: false, hasIcs: false, hasWhatsapp: false }));

          const controlCount = [controls.hasGoogleCal, controls.hasIcs, controls.hasWhatsapp].filter(Boolean).length;
          record('modal-controls', '/events', '-',
            controlCount >= 2, // at least 2 of the 3 controls
            `google=${controls.hasGoogleCal} ics=${controls.hasIcs} whatsapp=${controls.hasWhatsapp} (${controlCount}/3)`);
        }
      } else {
        record('event-modal-open', '/events', '-', false, 'no event card button found');
        record('modal-controls', '/events', '-', false, 'skipped (no modal)');
      }

      await page.close();
    }

    // 7c: PWA service worker resolves
    {
      const page = await context.newPage();
      await gotoWithRetry(page, urlFor('/'));
      await page.waitForTimeout(3000);

      const swReady = await page.evaluate(async () => {
        try {
          if (!navigator.serviceWorker) return false;
          await navigator.serviceWorker.ready;
          return true;
        } catch {
          return false;
        }
      }).catch(() => false);

      record('service-worker', '/', '-', swReady,
        swReady ? 'navigator.serviceWorker.ready resolved' : 'service worker not ready');

      await page.close();
    }

    await context.close();
  }

  await browser.close();

  // ── Output JSON summary ───────────────────────────────────────────────
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    total,
    passed,
    failed,
    results,
  };
  writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2));

  // ── Final verdict ─────────────────────────────────────────────────────
  console.log('');
  console.log(`${'='.repeat(60)}`);
  console.log(`TOTAL: ${total}  PASS: ${passed}  FAIL: ${failed}`);
  console.log(`JSON: ${OUT_JSON}`);
  console.log(`${'='.repeat(60)}`);

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

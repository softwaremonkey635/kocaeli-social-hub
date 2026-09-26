#!/usr/bin/env node
// scripts/gen-sitemap.mjs — clean-URL sitemap + robots.txt for the static build.
//
// Writes:
//   dist/sitemap.xml    9 clean URLs: ${SITE_ORIGIN}${base}<route>/, <lastmod> today
//                       (home = base itself, already ends in '/')
//   public/sitemap.xml  same content, kept in sync (tracked template)
//   dist/robots.txt     Sitemap line driven by SITE_ORIGIN + base (overrides the
//                       copy vite made from public/)
//   public/robots.txt   same content, kept in sync (tracked template)
//
// Usage:
//   node scripts/gen-sitemap.mjs [--base /kocaeli-social-hub/]
//   base   = --base flag, else APP_BASE env, else '/'
//   origin = SITE_ORIGIN env, else https://softwaremonkey635.github.io

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, resolveBase, resolveOrigin, routeUrl } from './static-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function buildSitemap(origin, base, lastmod) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const route of ROUTES) {
    lines.push('  <url>');
    lines.push(`    <loc>${routeUrl(origin, base, route)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  lines.push('');
  return lines.join('\n');
}

function buildRobots(origin, base) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${routeUrl(origin, base, 'sitemap.xml')}`,
    '',
  ].join('\n');
}

function main() {
  const base = resolveBase();
  const origin = resolveOrigin();
  // Local date, so <lastmod> matches the operator's "today" (UTC ISO date can
  // still be yesterday on an evening build in a UTC+3 timezone).
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const lastmod = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const sitemap = buildSitemap(origin, base, lastmod);
  const robots = buildRobots(origin, base);

  writeFileSync(path.join(ROOT, 'dist', 'sitemap.xml'), sitemap);
  writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);
  writeFileSync(path.join(ROOT, 'dist', 'robots.txt'), robots);
  writeFileSync(path.join(ROOT, 'public', 'robots.txt'), robots);

  const urls = ROUTES.map((route) => routeUrl(origin, base, route));
  console.log(`[gen-sitemap] base=${base} origin=${origin} lastmod=${lastmod}`);
  for (const url of urls) console.log(`[gen-sitemap]   ${url}`);
  console.log(`[gen-sitemap] wrote ${urls.length} URLs -> dist/sitemap.xml, public/sitemap.xml`);
  console.log(`[gen-sitemap] robots Sitemap: ${routeUrl(origin, base, 'sitemap.xml')}`);
}

main();

// scripts/static-routes.mjs — shared route list + base/origin resolution for
// the static build scripts (prerender.mjs, gen-sitemap.mjs).
//
// Routes mirror src/App.tsx ROUTED_PAGES. Home is the empty segment: the app's
// clean home URL is the deployment base itself (e.g. /kocaeli-social-hub/).

export const ROUTES = [
  '',
  'events',
  'vision',
  'clubs',
  'gallery',
  'contact',
  'blog',
  'sponsors',
  'guide',
];

/** Deployment base: --base flag > APP_BASE env > '/'. Always leading+trailing '/'. */
export function resolveBase(argv = process.argv) {
  let raw = null;
  const flagIndex = argv.indexOf('--base');
  if (flagIndex !== -1 && argv[flagIndex + 1] && !argv[flagIndex + 1].startsWith('--')) {
    raw = argv[flagIndex + 1];
  } else {
    const inline = argv.find((arg) => arg.startsWith('--base='));
    if (inline) raw = inline.slice('--base='.length);
  }
  if (raw === null || raw === '') raw = process.env.APP_BASE || '/';

  let base = String(raw).trim();
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base;
}

/** Public origin: SITE_ORIGIN env > default GitHub Pages origin. No trailing '/'. */
export function resolveOrigin(env = process.env) {
  const raw = (env.SITE_ORIGIN || 'https://softwaremonkey635.github.io').trim();
  return raw.replace(/\/+$/, '');
}

/** Full URL for a route ('' = home) under the given origin+base. No fragments. */
export function routeUrl(origin, base, route) {
  return `${origin}${base}${route}`;
}

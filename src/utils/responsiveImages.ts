const BASE = import.meta.env.BASE_URL;

type Variant = { path: string; w: number };

/**
 * Mirrors public/images/optimized/manifest.json (source of truth for the WebP
 * paths and widths). Keys are BASE-relative original paths, e.g.
 * "images/events/hiking.jpeg"; variant paths are kept BASE-relative so one
 * map serves both the domain-root and the GitHub Pages subpath builds.
 */
const WEBP_VARIANTS: Record<string, Variant[]> = {
  'images/events/biblo-boyama.jpeg': [
    { path: 'images/optimized/events/biblo-boyama/biblo-boyama-400.webp', w: 400 },
    { path: 'images/optimized/events/biblo-boyama/biblo-boyama-800.webp', w: 800 },
  ],
  'images/events/camping.jpeg': [
    { path: 'images/optimized/events/camping/camping-400.webp', w: 400 },
    { path: 'images/optimized/events/camping/camping-800.webp', w: 800 },
  ],
  'images/events/canta-boyama.jpeg': [
    { path: 'images/optimized/events/canta-boyama/canta-boyama-400.webp', w: 400 },
    { path: 'images/optimized/events/canta-boyama/canta-boyama-800.webp', w: 800 },
  ],
  'images/events/hiking.jpeg': [
    { path: 'images/optimized/events/hiking/hiking-400.webp', w: 400 },
    { path: 'images/optimized/events/hiking/hiking-800.webp', w: 800 },
  ],
  'images/events/kil-boyama.jpeg': [
    { path: 'images/optimized/events/kil-boyama/kil-boyama-400.webp', w: 400 },
    { path: 'images/optimized/events/kil-boyama/kil-boyama-800.webp', w: 800 },
  ],
  'images/events/kitap-soylesisi.jpeg': [
    { path: 'images/optimized/events/kitap-soylesisi/kitap-soylesisi-400.webp', w: 400 },
    { path: 'images/optimized/events/kitap-soylesisi/kitap-soylesisi-800.webp', w: 800 },
  ],
  'images/events/speaking-club.jpeg': [
    { path: 'images/optimized/events/speaking-club/speaking-club-400.webp', w: 400 },
    { path: 'images/optimized/events/speaking-club/speaking-club-800.webp', w: 800 },
  ],
  'images/logo/kocaeli-logo.jpeg': [
    { path: 'images/optimized/logo/kocaeli-logo/kocaeli-logo-400.webp', w: 400 },
  ],
};

function relativeKey(src: string): string {
  let rel = src;
  if (rel.startsWith(BASE)) rel = rel.slice(BASE.length);
  return rel.replace(/^\/+/, '');
}

/**
 * srcSet + sizes for a local image, or {} when the image has no WebP variants
 * (remote URLs, images outside the optimization manifest). Spread the result
 * into the <img>: `{...srcSetFor(src, '...')}` keeps the plain `src` as the
 * fallback for browsers without WebP.
 */
export function srcSetFor(
  src: string,
  sizes: string
): { srcSet?: string; sizes?: string } {
  if (!src) return {};
  const variants = WEBP_VARIANTS[relativeKey(src)];
  if (!variants) return {};
  return {
    srcSet: variants.map((v) => `${BASE}${v.path} ${v.w}w`).join(', '),
    sizes,
  };
}

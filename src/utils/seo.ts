import { PageId } from '../types';

export const SITE_ORIGIN = 'https://softwaremonkey635.github.io';
export const BASE_URL = 'https://softwaremonkey635.github.io/kocaeli-social-hub/';
export const APP_BASE = import.meta.env?.BASE_URL ?? '/';
export const DEFAULT_IMAGE = 'https://softwaremonkey635.github.io/kocaeli-social-hub/images/logo/kocaeli-logo.jpeg';
export const SITE_NAME = 'Kocaeli Social Hub';
export const SITE_LANGUAGE = 'tr';

function currentOrigin(): string {
  return typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : SITE_ORIGIN;
}

/** Real per-route URL for the current host: origin + base + route, no fragment. */
export function currentRouteUrl(): string {
  if (typeof window === 'undefined') return BASE_URL;
  return currentOrigin() + window.location.pathname;
}

/** Origin + deployment base, without a route segment. */
export function currentSiteUrl(): string {
  return currentOrigin() + APP_BASE;
}

export interface SeoEventInput {
  title?: string;
  subtitle?: string;
  image?: string;
  dayOfWeek?: number;
  time?: string;
  nextDate?: string;
  location?: string;
  district?: string;
}

export interface PageSeo {
  title: string;
  description: string;
}

export const PAGE_SEO: Record<PageId, PageSeo> = {
  home: {
    title: 'Kocaeli Social Hub | Gençlik ve Canlı Etkinlik Topluluğu',
    description:
      "Kocaeli'de speaking club, atölye, kamp ve doğa yürüyüşleriyle yeni arkadaşlar edin. Ücretsiz etkinlikler ve haftalık takvim tek topluluk sayfasında bir arada.",
  },
  events: {
    title: 'Etkinlikler ve Haftalık Takvim | Kocaeli Social Hub',
    description:
      "Bu hafta Kocaeli'de ne var? Speaking club, kitap söyleşisi, hiking ve dans etkinliklerinin gün, saat ve konumlarını tek takvimde gör, yerini şimdiden ayır.",
  },
  guide: {
    title: 'Kocaeli Öğrenci Bütçe ve Yaşam Rehberi | Kocaeli Social Hub',
    description:
      "Kocaeli'de öğrenci bütçesi nasıl planlanır? Ulaşım, yemek, kira ve sosyal harcama ipuçlarıyla şehir yaşamını ucuz tutan pratik ve örnekli rehber.",
  },
  vision: {
    title: 'Vizyon ve Misyon | Kocaeli Social Hub',
    description:
      'Topluluk olarak neyi hedefliyoruz: herkesin kendini rahat ifade ettiği, öğrenmeye ve üretmeye açık bir Kocaeli gençlik ağı. Vizyon ve misyonumuz burada.',
  },
  clubs: {
    title: 'Kulüpler ve Topluluk Alanları | Kocaeli Social Hub',
    description:
      "Speaking Club'tan doğa ekibine, kitap kulübünden dans atölyesine kadar kulüplerimizin yürütücülerini, buluşma günlerini ve katılım koşullarını keşfet.",
  },
  gallery: {
    title: 'Galeri ve Etkinlik Fotoğrafları | Kocaeli Social Hub',
    description:
      'Kamplar, doğa yürüyüşleri, atölyeler ve söyleşilerden kareler: geçmiş etkinliklerimizin fotoğraflarıyla topluluğun enerjisini galeride doya doya gör.',
  },
  contact: {
    title: 'İletişim ve Topluluğa Katıl | Kocaeli Social Hub',
    description:
      "Kocaeli Social Hub'a katıl: WhatsApp grubuna gir, gönüllü ol, etkinlik öner ya da sponsorluk ve iş birliği teklifleri için bizimle iletişime geç.",
  },
  blog: {
    title: 'Duyurular ve Blog | Kocaeli Social Hub',
    description:
      'Topluluk duyuruları, etkinlik notları, Kocaeli öğrenci rehberleri ve yeni üye haberleri blog sayfasında düzenli olarak yayınlanıyor, arşiv hep açık.',
  },
  sponsors: {
    title: 'Sponsorlar ve Yerel Ortaklar | Kocaeli Social Hub',
    description:
      "Projelerimize destek veren Kocaeli'deki kafeler, kültür sanat mekanları ve yerel işletmelerle tanış, iş birliği ve sponsorluk fırsatlarını gör.",
  },
};

const MONTH_ALIASES: Record<string, number> = {
  ocak: 1,
  subat: 2,
  şubat: 2,
  mart: 3,
  nisan: 4,
  mayis: 5,
  mayıs: 5,
  haziran: 6,
  temmuz: 7,
  agustos: 8,
  ağustos: 8,
  eylul: 9,
  eylül: 9,
  ekim: 10,
  kasim: 11,
  kasım: 11,
  aralik: 12,
  aralık: 12,
};

const DAY_MS = 86400000;

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function toAbsoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return SITE_ORIGIN + src;
  return BASE_URL + src;
}

export function deriveEventStartDate(event: SeoEventInput): string | null {
  const raw = (event.nextDate || '').trim();
  const match = /^(\d{1,2})\s+([^\s,]+)\s+[^\s,]+,\s*(\d{1,2}):(\d{2})/.exec(raw);
  if (!match) return null;

  const day = Number(match[1]);
  const monthKey = (match[2] || '').toLowerCase();
  const month = MONTH_ALIASES[monthKey];
  const hour = Number(match[3]);
  const minute = Number(match[4]);
  if (!month || day < 1 || day > 31 || hour > 23 || minute > 59) return null;

  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let year = now.getFullYear();
  if (Date.UTC(year, month - 1, day) < todayUtc - DAY_MS) year += 1;

  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;

  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00+03:00`;
}

function upsertMeta(selector: string, key: 'name' | 'property', value: string, content: string): void {
  const found = Array.from(document.head.querySelectorAll(selector));
  let tag = found[0] as HTMLMetaElement | undefined;
  for (let i = 1; i < found.length; i += 1) found[i].remove();
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(key, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  const found = Array.from(document.head.querySelectorAll('link[rel="canonical"]'));
  let tag = found[0] as HTMLLinkElement | undefined;
  for (let i = 1; i < found.length; i += 1) found[i].remove();
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function setRouteJsonLd(graph: unknown): void {
  const stale = Array.from(document.querySelectorAll('script[id="route-jsonld"]'));
  for (let i = 0; i < stale.length; i += 1) stale[i].remove();
  const tag = document.createElement('script');
  tag.id = 'route-jsonld';
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  document.head.appendChild(tag);
}

function buildEventNode(event: SeoEventInput, startDate: string, fallback: PageSeo): Record<string, unknown> {
  const image = toAbsoluteUrl(event.image) || DEFAULT_IMAGE;
  const node: Record<string, unknown> = {
    '@type': 'Event',
    name: event.title || SITE_NAME,
    description: event.subtitle || fallback.description,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    image,
    url: currentRouteUrl(),
  };
  if (event.location) {
    node.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
    node.location = {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.district || 'Kocaeli',
        addressCountry: 'TR',
      },
    };
  }
  return node;
}

export function applySeo(page: PageId, event?: SeoEventInput | null): void {
  const seo = PAGE_SEO[page] || PAGE_SEO.home;
  const routeUrl = currentRouteUrl();

  document.title = seo.title;
  upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
  upsertCanonical(routeUrl);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', routeUrl);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', DEFAULT_IMAGE);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_IMAGE);

  const graph: unknown[] = [
    {
      '@type': 'WebSite',
      '@id': `${currentSiteUrl()}#website`,
      name: SITE_NAME,
      url: currentSiteUrl(),
      description: PAGE_SEO.home.description,
      inLanguage: SITE_LANGUAGE,
    },
    {
      '@type': 'WebPage',
      '@id': `${currentSiteUrl()}#${page}`,
      name: seo.title,
      description: seo.description,
      url: currentRouteUrl(),
      inLanguage: SITE_LANGUAGE,
      isPartOf: { '@id': `${currentSiteUrl()}#website` },
    },
  ];

  const startDate = event ? deriveEventStartDate(event) : null;
  if (event && startDate) graph.push(buildEventNode(event, startDate, seo));

  setRouteJsonLd(graph);
}

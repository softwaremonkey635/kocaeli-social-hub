#!/usr/bin/env node
// scripts/gen-feeds.mjs — build-time RSS 2.0 feed + iCalendar events feed.
//
// Writes:
//   dist/feed.xml    RSS 2.0, one <item> per post in src/data/blogData.ts
//   dist/events.ics  RFC 5545 calendar, one VEVENT per occurrence of the next
//                    4 weeks from src/data/mockData.ts (ACTIVITIES_DATA)
//
// Why this does not import the .ts data modules: they read
// `import.meta.env.BASE_URL`, a Vite global that does not exist under plain
// Node, so a direct import throws. Instead the array literal is sliced out of
// the module text and evaluated with BASE stubbed, which keeps this script
// dependency-free and keeps the app data as the single source of truth.
//
// Occurrence rules mirror src/utils/calendar.ts: Türkiye is UTC+03:00 the whole
// year, an event time that does not parse ("Hafta Sonu (Detaylar WhatsApp'ta)")
// yields no occurrence, and a weekly event fires on its dayOfWeek.
//
// Usage:
//   node scripts/gen-feeds.mjs [--base /kocaeli-social-hub/]
//   base   = --base flag, else APP_BASE env, else '/'
//   origin = SITE_ORIGIN env, else https://softwaremonkey635.github.io

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveBase, resolveOrigin, routeUrl } from './static-routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const IST_UTC_OFFSET_MS = 3 * HOUR_MS;
const DEFAULT_DURATION_MS = 2 * HOUR_MS;
const WINDOW_MS = 28 * DAY_MS;

const PRODID = '-//Kocaeli Social Hub//Etkinlik Takvimi//TR';
const CHANNEL_TITLE = 'Kocaeli Social Hub Blog';
const CHANNEL_DESCRIPTION =
  'Kocaeli Social Hub duyuruları, etkinlik rehberleri ve topluluk yazıları.';
const ENCODER = new TextEncoder();

const TR_MONTHS = {
  Ocak: 0,
  Şubat: 1,
  Mart: 2,
  Nisan: 3,
  Mayıs: 4,
  Haziran: 5,
  Temmuz: 6,
  Ağustos: 7,
  Eylül: 8,
  Ekim: 9,
  Kasım: 10,
  Aralık: 11,
};

function fail(message) {
  throw new Error(message);
}

/** Slice one `[ ... ]` array literal out of a TS module by bracket scanning
 *  that understands quotes, template literals (including `${}` nests) and both
 *  comment styles. Returns the literal including its brackets. */
function sliceBracketed(source, openIndex) {
  let mode = 'code';
  let depth = 0;
  const tplDepth = [];
  for (let i = openIndex; i < source.length; i += 1) {
    const c = source[i];
    const next = source[i + 1];
    if (mode === 'line') {
      if (c === '\n') mode = 'code';
      continue;
    }
    if (mode === 'block') {
      if (c === '*' && next === '/') {
        mode = 'code';
        i += 1;
      }
      continue;
    }
    if (mode === 'sq' || mode === 'dq') {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if ((mode === 'sq' && c === "'") || (mode === 'dq' && c === '"')) mode = 'code';
      continue;
    }
    if (mode === 'tpl') {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if (c === '`') {
        mode = 'code';
        continue;
      }
      if (c === '$' && next === '{') {
        tplDepth.push(depth);
        mode = 'code';
        i += 1;
      }
      continue;
    }
    if (c === '/' && next === '/') {
      mode = 'line';
      i += 1;
      continue;
    }
    if (c === '/' && next === '*') {
      mode = 'block';
      i += 1;
      continue;
    }
    if (c === "'") {
      mode = 'sq';
      continue;
    }
    if (c === '"') {
      mode = 'dq';
      continue;
    }
    if (c === '`') {
      mode = 'tpl';
      continue;
    }
    if (c === '[' || c === '{' || c === '(') depth += 1;
    else if (c === ']' || c === ')' || c === '}') {
      if (c === '}' && tplDepth.length && depth === tplDepth[tplDepth.length - 1]) {
        tplDepth.pop();
        mode = 'tpl';
        continue;
      }
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, i + 1);
    }
  }
  return fail('unterminated array literal');
}

function extractConstArray(file, name) {
  const source = readFileSync(file, 'utf8');
  const decl = new RegExp(`export const ${name}\\b[^=]*=`, 'm').exec(source);
  if (!decl) fail(`${name} declaration not found in ${file}`);
  let i = decl.index + decl[0].length;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  if (source[i] !== '[') fail(`${name} is not an array literal in ${file}`);
  const literal = sliceBracketed(source, i);
  try {
    // BASE stands in for import.meta.env.BASE_URL so template images resolve.
    return new Function('BASE', `return (${literal});`)('');
  } catch (err) {
    return fail(`${name} did not evaluate: ${err.message}`);
  }
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** "20 Eylül 2026" -> epoch ms at 00:00 Türkiye time (UTC+03:00, no DST). */
function parseTrDate(text, now) {
  const parts = String(text).trim().split(/\s+/);
  const day = Number(parts[0]);
  const month = TR_MONTHS[parts[1]];
  const year = Number(parts[2]);
  if (!Number.isInteger(day) || month === undefined || !Number.isInteger(year)) return now;
  return Date.UTC(year, month, day) - IST_UTC_OFFSET_MS;
}

function rfc822(epochMs) {
  return new Date(epochMs).toUTCString();
}

function pad2(value) {
  return value < 10 ? `0${value}` : String(value);
}

function formatUtc(date) {
  return (
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`
  );
}

function icsEscape(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/** RFC 5545 line folding: anything past 75 octets continues on the next line. */
function foldLine(line) {
  if (ENCODER.encode(line).length <= 75) return line;
  const parts = [];
  let current = '';
  let budget = 75;
  for (const char of line) {
    const size = ENCODER.encode(char).length;
    if (size > budget) {
      parts.push(current);
      current = ' ';
      budget = 74;
      continue;
    }
    current += char;
    budget -= size;
  }
  parts.push(current);
  return parts.join('\r\n');
}

function parseTimeRange(text) {
  if (!text) return null;
  const range = /(\d{1,2}):(\d{2})\s*(?:-|–|—)\s*(\d{1,2}):(\d{2})/.exec(text);
  if (range) {
    const startH = Number(range[1]);
    const startM = Number(range[2]);
    const endH = Number(range[3]);
    const endM = Number(range[4]);
    if (startH > 23 || endH > 23 || startM > 59 || endM > 59) return null;
    return { startH, startM, endH, endM };
  }
  const single = /(\d{1,2}):(\d{2})/.exec(text);
  if (single) {
    const startH = Number(single[1]);
    const startM = Number(single[2]);
    if (startH > 23 || startM > 59) return null;
    return { startH, startM, endH: -1, endM: -1 };
  }
  return null;
}

function durationMs(range) {
  if (!range || range.endH < 0) return DEFAULT_DURATION_MS;
  const minutes = range.endH * 60 + range.endM - (range.startH * 60 + range.startM);
  return minutes > 0 ? minutes * MINUTE_MS : DEFAULT_DURATION_MS;
}

function istDate(year, month, day, hour, minute) {
  return new Date(Date.UTC(year, month, day, hour, minute) - IST_UTC_OFFSET_MS);
}

/** Every start of `ev` inside [now, now+28d], weekly on its dayOfWeek. */
function occurrencesInWindow(ev, now, windowEnd) {
  const range = parseTimeRange(ev.time);
  if (!range) return [];
  if (!Number.isInteger(ev.dayOfWeek) || ev.dayOfWeek < 0 || ev.dayOfWeek > 6) return [];
  const istNow = new Date(now + IST_UTC_OFFSET_MS);
  const delta = (ev.dayOfWeek - istNow.getUTCDay() + 7) % 7;
  let start = istDate(
    istNow.getUTCFullYear(),
    istNow.getUTCMonth(),
    istNow.getUTCDate() + delta,
    range.startH,
    range.startM
  );
  if (start.getTime() <= now) start = new Date(start.getTime() + 7 * DAY_MS);
  const out = [];
  while (start.getTime() <= windowEnd) {
    out.push({ start, end: new Date(start.getTime() + durationMs(range)) });
    start = new Date(start.getTime() + 7 * DAY_MS);
  }
  return out;
}

function summaryOf(ev) {
  return `Kocaeli Social Hub: ${ev.title}`;
}

function descriptionOf(ev, url) {
  return `${ev.description}\n\n${ev.day} | ${ev.time}\nDetaylar: ${url}`;
}

function locationOf(ev) {
  if (ev.location) return ev.location;
  if (ev.district) return `${ev.district} (buluşma noktası WhatsApp grubunda paylaşılır)`;
  return 'Kocaeli';
}

function buildRss(posts, origin, base, now) {
  const blogUrl = routeUrl(origin, base, 'blog');
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `  <title>${escapeXml(CHANNEL_TITLE)}</title>`,
    `  <link>${escapeXml(routeUrl(origin, base, ''))}</link>`,
    `  <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>`,
    '  <language>tr</language>',
    `  <lastBuildDate>${rfc822(now)}</lastBuildDate>`,
  ];
  for (const post of posts) {
    const pubDate = parseTrDate(post.date, now);
    lines.push('  <item>');
    lines.push(`    <title>${escapeXml(post.title)}</title>`);
    lines.push(`    <link>${escapeXml(blogUrl)}</link>`);
    lines.push(`    <description>${escapeXml(post.excerpt)}</description>`);
    lines.push(`    <pubDate>${rfc822(pubDate)}</pubDate>`);
    lines.push(`    <guid isPermaLink="false">ksh-blog-${escapeXml(post.id)}</guid>`);
    lines.push('  </item>');
  }
  lines.push('</channel>');
  lines.push('</rss>');
  lines.push('');
  return lines.join('\n');
}

function buildIcs(events, origin, base, now) {
  const windowEnd = now + WINDOW_MS;
  const eventsUrl = routeUrl(origin, base, 'events');
  const dtstamp = formatUtc(new Date(now));
  const occurrences = [];
  for (const ev of events) {
    for (const occ of occurrencesInWindow(ev, now, windowEnd)) {
      occurrences.push({ ev, ...occ });
    }
  }
  occurrences.sort((a, b) => a.start.getTime() - b.start.getTime());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Kocaeli Social Hub',
  ];
  for (const { ev, start, end } of occurrences) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${ev.id}-${formatUtc(start)}@kocaeli-social-hub`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${formatUtc(start)}`);
    lines.push(`DTEND:${formatUtc(end)}`);
    lines.push(`SUMMARY:${icsEscape(summaryOf(ev))}`);
    lines.push(`DESCRIPTION:${icsEscape(descriptionOf(ev, eventsUrl))}`);
    lines.push(`LOCATION:${icsEscape(locationOf(ev))}`);
    lines.push(`URL:${eventsUrl}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}

function main() {
  const base = resolveBase();
  const origin = resolveOrigin();
  if (!existsSync(DIST)) fail('dist/ not found - run vite build first');

  const now = Date.now();
  const posts = extractConstArray(path.join(ROOT, 'src', 'data', 'blogData.ts'), 'BLOG_POSTS');
  const events = extractConstArray(
    path.join(ROOT, 'src', 'data', 'mockData.ts'),
    'ACTIVITIES_DATA'
  );
  if (!Array.isArray(posts) || posts.length === 0) fail('BLOG_POSTS is empty');
  if (!Array.isArray(events) || events.length === 0) fail('ACTIVITIES_DATA is empty');

  const rss = buildRss(posts, origin, base, now);
  const ics = buildIcs(events, origin, base, now);

  writeFileSync(path.join(DIST, 'feed.xml'), rss);
  writeFileSync(path.join(DIST, 'events.ics'), ics);

  const veventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
  console.log(`[gen-feeds] base=${base} origin=${origin}`);
  console.log(`[gen-feeds] feed.xml: ${posts.length} items -> dist/feed.xml`);
  console.log(`[gen-feeds] events.ics: ${veventCount} VEVENTs (next 4 weeks) -> dist/events.ics`);
  console.log(`[gen-feeds] feed: ${routeUrl(origin, base, 'feed.xml')}`);
  console.log(`[gen-feeds] calendar: ${routeUrl(origin, base, 'events.ics')}`);
}

try {
  main();
} catch (err) {
  console.error(`[gen-feeds] FAIL: ${err && err.message ? err.message : err}`);
  process.exit(1);
}

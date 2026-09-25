import type { ActivityEvent } from '../types';
import { BASE_URL, deriveEventStartDate } from './seo';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Türkiye yaz saati uygulamaz, tüm yıl UTC+03:00 sabittir. */
const IST_UTC_OFFSET_MS = 3 * HOUR_MS;
const DEFAULT_DURATION_MS = 2 * HOUR_MS;
/** Haftalık bir etkinliğin sıradaki buluşması en geç bir hafta sonradır. */
const MAX_LEAD_MS = 8 * DAY_MS;
const PRODID = '-//Kocaeli Social Hub//Etkinlik Takvimi//TR';
const ENCODER = new TextEncoder();

const TR_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export interface Occurrence {
  start: Date;
  end: Date;
}

interface TimeRange {
  startH: number;
  startM: number;
  endH: number;
  endM: number;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function parseTimeRange(text?: string): TimeRange | null {
  if (!text) return null;
  const range = /(\d{1,2}):(\d{2})\s*(?:-|\u2013|\u2014)\s*(\d{1,2}):(\d{2})/.exec(text);
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

function durationMs(range: TimeRange | null): number {
  if (!range || range.endH < 0) return DEFAULT_DURATION_MS;
  const minutes = range.endH * 60 + range.endM - (range.startH * 60 + range.startM);
  return minutes > 0 ? minutes * MINUTE_MS : DEFAULT_DURATION_MS;
}

/** Verilen İstanbul duvar saatini anlık (epoch ms) değerine çevirir. */
function istDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  return new Date(Date.UTC(year, month, day, hour, minute) - IST_UTC_OFFSET_MS);
}

/**
 * nextDate alanı ("26 Eylül Cumartesi, 18:00") gelecekte bir tarih veriyorsa onu
 * kullanır. Süresi dolmuş (geçmişte kalmış) bir alan haftalık döngüye bırakılır.
 */
function fromNextDate(ev: ActivityEvent, range: TimeRange | null): Occurrence | null {
  const iso = deriveEventStartDate(ev);
  if (!iso) return null;
  const start = new Date(iso);
  const now = Date.now();
  if (Number.isNaN(start.getTime())) return null;
  if (start.getTime() <= now) return null;
  if (start.getTime() - now > MAX_LEAD_MS) return null;
  return { start, end: new Date(start.getTime() + durationMs(range)) };
}

export function nextOccurrence(ev: ActivityEvent): Occurrence | null {
  if (!ev) return null;
  const range = parseTimeRange(ev.time);
  const upcoming = fromNextDate(ev, range);
  if (upcoming) return upcoming;
  if (!range) return null;
  if (!Number.isInteger(ev.dayOfWeek) || ev.dayOfWeek < 0 || ev.dayOfWeek > 6) return null;

  const now = Date.now();
  const istNow = new Date(now + IST_UTC_OFFSET_MS);
  const delta = (ev.dayOfWeek - istNow.getUTCDay() + 7) % 7;
  const candidate = istDate(
    istNow.getUTCFullYear(),
    istNow.getUTCMonth(),
    istNow.getUTCDate() + delta,
    range.startH,
    range.startM
  );
  const start = candidate.getTime() <= now ? new Date(candidate.getTime() + 7 * DAY_MS) : candidate;
  return { start, end: new Date(start.getTime() + durationMs(range)) };
}

export function formatUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`
  );
}

export function formatTrDateTime(date: Date): string {
  const ist = new Date(date.getTime() + IST_UTC_OFFSET_MS);
  return (
    `${ist.getUTCDate()} ${TR_MONTHS[ist.getUTCMonth()]} ${ist.getUTCFullYear()} ` +
    `${pad2(ist.getUTCHours())}:${pad2(ist.getUTCMinutes())}`
  );
}

export function eventUrl(ev: ActivityEvent): string {
  return `${BASE_URL}#event/${ev.id}`;
}

function icsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/** RFC 5545 satır katlama: 75 oktayı aşan satırlar CRLF + boşlukla bölünür. */
function foldLine(line: string): string {
  if (ENCODER.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let budget = 75;
  for (const char of line) {
    const size = ENCODER.encode(char).length;
    if (size > budget) {
      parts.push(current);
      current = ' ';
      budget = 74;
    }
    current += char;
    budget -= size;
  }
  parts.push(current);
  return parts.join('\r\n');
}

function summaryOf(ev: ActivityEvent): string {
  return `Kocaeli Social Hub: ${ev.title}`;
}

function descriptionOf(ev: ActivityEvent, url: string): string {
  const schedule = `${ev.day} | ${ev.time}`;
  return `${ev.description}\n\n${schedule}\nDetaylar: ${url}`;
}

function locationOf(ev: ActivityEvent): string {
  if (ev.location) return ev.location;
  if (ev.district) return `${ev.district} (buluşma noktası WhatsApp grubunda paylaşılır)`;
  return 'Kocaeli';
}

export function toIcs(ev: ActivityEvent): string {
  const occurrence = nextOccurrence(ev);
  if (!occurrence) return '';
  const url = eventUrl(ev);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@kocaeli-social-hub`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(occurrence.start)}`,
    `DTEND:${formatUtc(occurrence.end)}`,
    `SUMMARY:${icsEscape(summaryOf(ev))}`,
    `DESCRIPTION:${icsEscape(descriptionOf(ev, url))}`,
    `LOCATION:${icsEscape(locationOf(ev))}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}

export function googleCalendarUrl(ev: ActivityEvent): string {
  const occurrence = nextOccurrence(ev);
  if (!occurrence) return '';
  const dates = `${formatUtc(occurrence.start)}/${formatUtc(occurrence.end)}`;
  const details = descriptionOf(ev, eventUrl(ev));
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(summaryOf(ev))}` +
    `&dates=${dates}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(locationOf(ev))}`
  );
}

export function whatsappShareUrl(ev: ActivityEvent): string {
  const occurrence = nextOccurrence(ev);
  const when = occurrence
    ? formatTrDateTime(occurrence.start)
    : `${ev.day} ${ev.time}`.trim();
  const message =
    `Kocaeli Social Hub: ${ev.title} etkinliği\n` +
    `${when}\n` +
    `Detaylar ve katılım: ${eventUrl(ev)}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function slugify(text: string): string {
  const ascii: Record<string, string> = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  };
  const slug = text
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => ascii[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'etkinlik';
}

export function downloadIcs(ev: ActivityEvent): void {
  if (typeof document === 'undefined') return;
  const ics = toIcs(ev);
  if (!ics) return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = `${slugify(ev.title)}-${ev.id}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

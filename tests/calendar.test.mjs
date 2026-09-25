import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { build } = require('esbuild');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = mkdtempSync(path.join(tmpdir(), 'calendar-test-'));
const outfile = path.join(outDir, 'calendar.bundle.mjs');

await build({
  entryPoints: [path.join(root, 'src/utils/calendar.ts')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outfile,
  logLevel: 'silent',
});

const cal = await import(pathToFileURL(outfile).href);
const { nextOccurrence, toIcs, googleCalendarUrl, whatsappShareUrl } = cal;

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const IST_MS = 3 * HOUR_MS;
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
const WEEKDAYS = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi',
];

function pad(value) {
  return String(value).padStart(2, '0');
}

function baseEvent(overrides = {}) {
  return {
    id: 'speaking-club',
    title: 'Speaking Club',
    subtitle: 'Test etkinliği',
    category: 'language',
    categoryName: 'Dil',
    day: 'Her hafta Cumartesi',
    dayOfWeek: 6,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    description: 'Test açıklama; virgül, ters bölge \\ çini ve\nyeni satır içerir.',
    highlights: [],
    image: '',
    pricing: 'Ücretsiz',
    capacity: '20 kişi',
    targetAudience: 'Herkes',
    nextDate: '',
    ...overrides,
  };
}

const ev = baseEvent();

// 1) ICS iskeleti, CRLF, tek VEVENT, UTC Z tarihleri
const ics = toIcs(ev);
assert.ok(ics.startsWith('BEGIN:VCALENDAR'), 'ICS BEGIN:VCALENDAR ile başlar');
assert.ok(ics.trimEnd().endsWith('END:VCALENDAR'), 'ICS END:VCALENDAR ile biter');
assert.equal(ics.split('BEGIN:VEVENT').length - 1, 1, 'tam olarak tek BEGIN:VEVENT');
assert.ok(ics.includes('\r\n'), 'CRLF satır sonu kullanılıyor');
assert.ok(!ics.replace(/\r\n/g, '').includes('\n'), 'yalnız CRLF satır sonu var');
assert.match(ics, /DTSTART:\d{8}T\d{6}Z\r\n/, 'DTSTART UTC Z biçiminde');
assert.match(ics, /DTEND:\d{8}T\d{6}Z\r\n/, 'DTEND UTC Z biçiminde');
assert.match(ics, /DTSTAMP:\d{8}T\d{6}Z\r\n/, 'DTSTAMP UTC Z biçiminde');
assert.ok(ics.includes(`UID:${ev.id}@kocaeli-social-hub`), 'stabil UID');
assert.ok(ics.includes('CALSCALE:GREGORIAN'), 'CALSCALE');
for (const line of ics.split('\r\n')) {
  assert.ok(Buffer.byteLength(line, 'utf8') <= 75, `satır 75 oktayı aşıyor: ${line}`);
}

// 2) DESCRIPTION kaçışları (RFC 5545)
const unfolded = ics.replace(/\r\n[ \t]/g, '');
const descLine = unfolded.split('\r\n').find((line) => line.startsWith('DESCRIPTION:'));
assert.ok(descLine, 'DESCRIPTION satırı var');
const value = descLine.slice('DESCRIPTION:'.length);
assert.ok(value.includes('\\,'), 'virgül kaçışlı');
assert.ok(value.includes('\\;'), 'noktalı virgül kaçışlı');
assert.ok(value.includes('\\\\'), 'ters eğik çizgi kaçışlı');
assert.ok(value.includes('\\n'), 'yeni satır kaçışlı');
for (let i = 0; i < value.length; i += 1) {
  if (value[i] === '\\') {
    i += 1;
    continue;
  }
  assert.ok(!',;\n'.includes(value[i]), `kaçmamış özel karakter: ${value[i]}`);
}

// 3) Uzun açıklama satır katlamasına girer
const longIcs = toIcs(baseEvent({ description: `Uzun açıklama. ${'Kelime '.repeat(60)}` }));
for (const line of longIcs.split('\r\n')) {
  assert.ok(Buffer.byteLength(line, 'utf8') <= 75, `katlanmış satır 75 oktayı aşıyor: ${line}`);
}
assert.ok(longIcs.includes('\r\n '), 'devam satırı CRLF + boşluk ile başlıyor');

// 4) Geçmişte kalan haftalık slot +7 gün yuvarlar
const hourBefore = new Date(Date.now() + IST_MS).getUTCHours();
const probe = new Date(Date.now() + IST_MS);
const slotHour = probe.getUTCHours();
const passed = baseEvent({
  dayOfWeek: probe.getUTCDay(),
  time: `${pad(slotHour)}:00 - ${pad(slotHour)}:59`,
  nextDate: '',
});
const slotStart =
  Date.UTC(probe.getUTCFullYear(), probe.getUTCMonth(), probe.getUTCDate(), slotHour, 0, 0) - IST_MS;
const nowMs = Date.now();
assert.ok(slotStart <= nowMs, 'bugünün bandı şimdiye kadar geçmiş durumda');
const rolled = nextOccurrence(passed);
assert.ok(rolled, 'yuvarlanan occurrence var');
assert.ok(rolled.start.getTime() > Date.now(), 'occurrence gelecekte');
assert.equal(rolled.start.getTime(), slotStart + 7 * DAY_MS, 'tam +7 gün yuvarlaması');
assert.equal(rolled.end.getTime() - rolled.start.getTime(), 59 * 60_000, 'bitiş süresi korunuyor');
assert.equal(new Date(Date.now() + IST_MS).getUTCHours(), hourBefore, 'test saati saat sınırını aşmadı');

// 5) Gelecekteki nextDate alanı haftalık hesaptan önce gelir
const local = new Date(Date.now());
const tomorrow = new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate() + 1));
const todayUtc = Date.UTC(local.getFullYear(), local.getMonth(), local.getDate());
let expectedYear = local.getFullYear();
if (Date.UTC(expectedYear, tomorrow.getUTCMonth(), tomorrow.getUTCDate()) < todayUtc - DAY_MS) {
  expectedYear += 1;
}
const nextDateText = `${tomorrow.getUTCDate()} ${MONTHS[tomorrow.getUTCMonth()]} ${
  WEEKDAYS[tomorrow.getUTCDay()]
}, 18:00`;
const expectedNext =
  Date.UTC(expectedYear, tomorrow.getUTCMonth(), tomorrow.getUTCDate(), 18, 0, 0) - IST_MS;
const dated = nextOccurrence(baseEvent({ nextDate: nextDateText }));
assert.ok(dated, 'nextDate okundu');
assert.ok(dated.start.getTime() > Date.now(), 'nextDate gelecekte');
assert.equal(dated.start.getTime(), expectedNext, 'nextDate tercih edilir');
assert.equal(dated.end.getTime() - dated.start.getTime(), 2 * HOUR_MS, 'varsayılan 2 saat süre');

// 6) Süresi dolmuş nextDate haftalık döngüye düşer (yıl atlamaz)
const yesterday = new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate() - 1));
const stale = nextOccurrence(
  baseEvent({
    nextDate: `${yesterday.getUTCDate()} ${MONTHS[yesterday.getUTCMonth()]} ${
      WEEKDAYS[yesterday.getUTCDay()]
    }, 18:00`,
    dayOfWeek: 3,
    time: '18:00 - 20:00',
  })
);
assert.ok(stale, 'stale nextDate için haftalık occurrence var');
assert.ok(stale.start.getTime() > Date.now(), 'haftalık tarih gelecekte');
assert.ok(stale.start.getTime() - Date.now() < 7 * DAY_MS + HOUR_MS, 'tarih bir yıldan yakın');

// 7) Google Takvim URL biçimi
const gcal = googleCalendarUrl(ev);
assert.ok(
  gcal.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE&text='),
  'Google şablon URL başlangıcı'
);
assert.match(gcal, /[?&]dates=\d{8}T\d{6}Z\/\d{8}T\d{6}Z&/, 'dates=UTCZ/UTCZ biçimi');
assert.ok(gcal.includes('&details='), 'details parametresi');
assert.ok(gcal.includes('&location='), 'location parametresi');
assert.ok(!/\s/.test(gcal), 'ham boşluk içermiyor');
const details = decodeURIComponent(gcal.split('&details=')[1].split('&location=')[0]);
assert.ok(details.includes('Detaylar:'), 'details etkinlik bağlantısını taşıyor');

// 8) WhatsApp paylaşım URL'si
const wa = whatsappShareUrl(ev);
assert.ok(wa.startsWith('https://wa.me/?text='), 'wa.me şablonu');
assert.ok(!/\s/.test(wa), 'mesaj yüzde kodlamalı');
const message = decodeURIComponent(wa.slice('https://wa.me/?text='.length));
assert.ok(message.includes(ev.title), 'mesajda etkinlik adı var');
assert.ok(message.includes('#event/speaking-club'), 'mesajda etkinlik bağlantısı var');

// 9) Tarihi olmayan etkinlik: takvim kontrolleri kapanır, WhatsApp açık kalır
const untimed = baseEvent({
  id: 'camping',
  day: 'Tarih WhatsApp Grubunda Belirtilir',
  time: "Hafta Sonu (Detaylar WhatsApp'ta)",
  nextDate: 'Tarih WhatsApp Grubunda Belirtilir',
});
assert.equal(nextOccurrence(untimed), null, 'tarihsiz etkinlikte occurrence yok');
assert.equal(toIcs(untimed), '', 'boş ICS üretilmiyor');
assert.equal(googleCalendarUrl(untimed), '', 'boş Google URL üretilmiyor');
assert.ok(whatsappShareUrl(untimed).startsWith('https://wa.me/?text='), 'WhatsApp paylaşımı açık kalır');

console.log('calendar tests: 9 grup, tüm doğrulamalar geçti');

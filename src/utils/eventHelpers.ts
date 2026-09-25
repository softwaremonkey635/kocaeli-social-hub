import { ActivityEvent } from '../types';
import { nextOccurrence } from './calendar';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Takvimden hesaplanan tüm etkinlikler arasından en yakın gelecek buluşma anını
 * döndürür. Gelecekte buluşması hesaplanamayan etkinlikler (örn. kamp) atlanır.
 */
export function soonestUpcomingStart(events: ActivityEvent[]): Date | null {
  const now = Date.now();
  let best: Date | null = null;
  for (const event of events) {
    const occurrence = nextOccurrence(event);
    if (!occurrence) continue;
    const start = occurrence.start;
    if (start.getTime() <= now) continue;
    if (!best || start.getTime() < best.getTime()) best = start;
  }
  return best;
}

/**
 * Canlı geri sayım metni: "Sıradaki buluşmaya 2 gün 4 saat".
 * Bir saatten az kaldıysa yalnız dakika, bir günden az kaldıysa yalnız saat gösterilir.
 */
export function formatCountdownTo(start: Date | null, now: number = Date.now()): string | null {
  if (!start) return null;
  const remaining = start.getTime() - now;
  if (remaining <= 0) return null;
  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  if (days > 0) {
    return hours > 0
      ? `Sıradaki buluşmaya ${days} gün ${hours} saat`
      : `Sıradaki buluşmaya ${days} gün`;
  }
  if (hours > 0) return `Sıradaki buluşmaya ${hours} saat`;
  return `Sıradaki buluşmaya ${Math.max(1, Math.ceil(remaining / MINUTE_MS))} dakika`;
}

/**
 * Haftanın gününe (0: Pazar, 1: Pazartesi ... 6: Cumartesi) göre sistemde tanımlı
 * etkinlikler arasından en yakın olanını hesaplar.
 */
export function getNearestUpcomingEvent(events: ActivityEvent[]): ActivityEvent {
  if (!events || events.length === 0) {
    throw new Error('Etkinlik listesi boş olamaz.');
  }

  // Kamp gibi tarihi WhatsApp grubunda duyurulan özel/büyük etkinlikleri otomatik haftalık döngüden ayır
  const regularEvents = events.filter((e) => e.id !== 'camping');
  const candidatePool = regularEvents.length > 0 ? regularEvents : events;

  const now = new Date();
  const currentDay = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const currentHour = now.getHours();

  let closestEvent = candidatePool[0];
  let minDaysDiff = 999;

  for (const event of candidatePool) {
    let diff = event.dayOfWeek - currentDay;

    // Eğer bugün o etkinliğin günüyse ama etkinlik saati geçtiyse (örn 20:00'dan sonra), bir sonraki haftaya at
    if (diff === 0 && currentHour >= 20) {
      diff = 7;
    } else if (diff < 0) {
      diff += 7;
    }

    if (diff < minDaysDiff) {
      minDaysDiff = diff;
      closestEvent = event;
    }
  }

  return closestEvent;
}

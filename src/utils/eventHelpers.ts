import { ActivityEvent } from '../types';

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

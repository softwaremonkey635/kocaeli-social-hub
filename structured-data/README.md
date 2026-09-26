# Structured Data - Kocaeli Social Hub Etkinlikleri

Bu dizin, Google ve diğer arama motorları için schema.org Event JSON-LD dosyalarını içerir.
Bu veriler, zengin sonuçlara (rich results) yol açarak etkinliklerin arama sonuçlarında daha belirgin görüntülenmesini sağlar.

## Dosyalar

| Dosya | Amaç |
|-------|------|
| `events.json` | Tam JSON-LD belgesi (ItemList of Event) |
| `events-snippet.html` | Tek bir `<script type="application/ld+json">` bloğu, HTML'e yapıştırılabilir |
| `README.md` | Bu dosya |

## Oluşturulan Etkinlikler

- **Toplam düğüm sayısı:** 20
- **Haftalık etkinlik:** 5 (Speaking Club, Hiking, Sanat Workshop, Kitap Okuma, Halk Oyunları)
- **Kapsanan dönem:** 4 hafta (26 Eylül - 23 Ekim 2026)

## Hariç Tutulan Etkinlik

| Etkinlik | Neden |
|----------|-------|
| Kamp Etkinliklerimiz | Tarih WhatsApp grubunda belirtiliyor, sabit bir haftalık tarih yok |

## Yeniden Oluşturma

Bu dosyalar `src/data/mockData.ts` verilerinden türetilmiştir. Etkinlik listesi veya zamanlama değişikliği
yapıldığında bu dosyaların elle güncellenmesi veya bir betik ile yeniden üretilmesi gerekir.

Her etkinlik için `dayOfWeek` (0=Pazar, 6=Cumartesi) ve `time` alanları kullanılarak
gelecek 4 haftanın tarihleri hesaplanır. Saat dilimi sabit UTC+3 (Türkiye).

## Doğrulama

JSON-LD doğrulaması için:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

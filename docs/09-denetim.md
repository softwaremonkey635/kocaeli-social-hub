# 09 — Canlı Denetim Kaydı

Tarih: 2026-09-26 · `main` 9a49591, canlı `gh-pages` 4cfa2b9

## Denetim sonucu

- 9 rota x 2 viewport (1400x900, 390x844) tarandı; axe 0 ihlal, E2E matrix 212/212.
- İki gerçek sorun çıktı: yinelenen DOM id'si ve URL biçimi tutarsızlığı.

## Düzeltme 1: hava durumu widget id'si

`/guide` içinde `id="campus-live-weather"` iki kez basılıydı, çünkü `GuidePage.tsx`
widget'ı iki bölümde render ediyor (üst bilgi barı ve mikroklıma kartı). Çözüm kodda:
`WeatherWidget` `id` prop'u aldı (varsayılan `campus-live-weather`), ikinci kullanım
`id="campus-live-weather-detail"` geçiyor. Bu id'yi okuyan bir kod yok (grep ile
doğrulandı). Sonuç: `dist/guide/index.html` içinde id tam 1 kez, kontaktta 0 (widget yok).

## Düzeltme 2: sondaki eğik çizgi standardı

GitHub Pages dizin yolunu `events/` olarak sunar, `events` isteğini 301 ile yönlendirir.
Rota URL'leri artık hep sondaki eğik çizgili:

- `src/App.tsx` `routeUrl`: `navigateTo`, legacy hash shim'i ve `closeEvent` eğik
  çizgili URL üretir; anasayfa base'in kendisi.
- `src/utils/seo.ts` `currentRouteUrl`: canonical, `og:url` ve WebPage JSON-LD `url`.
- `scripts/static-routes.mjs` `routeUrl`: sitemap'in 9 rotası eğik çizgili; dosya
  yolları (`sitemap.xml`, `feed.xml`, `events.ics`) etkilenmez.
- `scripts/prerender.mjs`: beklenen canonical da eğik çizgili formda.
- Router'daki sondaki eğik çizgi kırpma kuralı duruyor, `events` ve `events/` aynı
  rotaya düşüyor.

## Doğrulama (2026-09-26)

- `npx tsc --noEmit` = 0 hata; `build:static` başarılı; sitemap 9/9 URL eğik çizgili.
- `dist/events/index.html` canonical = `.../events/`; `dist/guide/index.html` içinde
  `grep -c 'id="campus-live-weather"'` = 1.
- Yerel Playwright 4/4: `/guide` ve `/events` 0 konsol hatalı, anasayfa -> rehber
  tıklaması `/guide/` üzerinde biter, `/events/` doğrudan açılır, `/events` yönlendirmeyle
  aynı sayfaya düşer. E2E matrix yerelde 196/196 (denetimdeki 212 axe ile birlikteydi).

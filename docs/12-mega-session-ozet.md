# 12: Mega Session Özeti

Proje: `softwaremonkey635/kocaeli-social-hub` (public, branch `main`).
Okuma anı: 2026-10-07, repo head `e8dbc03`. Yalnızca ağaçta gerçekten olan şeyler; doğrulanamayan yerler "bilinmiyor" işaretli.

## 1. Ne yapıldı

Son 16 commit, üç grupta.

**Geçiş paketi (2026-10-07)**
- `70882f0` docs: add migration pack overview and manifest
- `8f5ab8e` chore: add distrobox dev container for the migration
- `fd6adfa` chore: add bootstrap and verify scripts to the migration pack
- `08cbc99` docs: add handover checklist and owner inputs
- `65c780e` chore: adopt package-lock.json, clean manifest, fix SW URL form
- `e8dbc03` docs: add migration inventory (10-envanter.md)
**Yönlendirme, SEO, performans (2026-09-26)**
- `c9c8732` feat: clean-URL history routing, host-portable base, deploy kit, operator docs and e2e matrix
- `de3f8fd` feat: build-time prerender and clean-URL sitemap
- `10cf1fa` feat: responsive WebP images, per-route OG images, Event structured data
- `c91a366` feat: RSS feed and subscribable events calendar
- `9a49591` feat: visible FAQ section with matching FAQPage structured data
- `839bb98` fix: unique weather widget id and trailing-slash route URLs
**Etkinlikler ve performans (2026-09-25)**
- `0f77b76` feat: next occurrence chip on event cards
- `e85c6e2` feat: live countdown to next event
- `e590187` fix: route empty hash back to home
- `cb3a614` chore: drop unused dev deps, declare sharp, ignore build caches

## 2. Migration paketi

`migration/` içeriği:

| Dosya | İşlev |
|---|---|
| `MANIFEST.md` | Kimlik, ortam değişkenleri, komutlar, runtime servisleri, repo düzeni. Önce bunu oku. |
| `distrobox/kocaeli.ini` | Distrobox manifesti. `node:22-bookworm`, `git ca-certificates`. |
| `distrobox/setup.sh` | Konteyneri oluşturur, içindeki Node sürümünü denetler. |
| `bootstrap.sh` | Node algılar, bağımlılıkları ve Playwright'ı kurar, tip kontrolü + tam statik build + birim test koşar, PASS/FAIL basar. |
| `verify.sh` | Tip kontrolü, tam statik build, `dist/` yerel sunumu, Playwright E2E matrisi. |
| `HANDOVER-CHECKLIST.md` | Taşıma sonrası kutular ve sandbox'a özgü ayrıntılar. |
| `OWNER-INPUTS.md` | Yalnızca sahibinin verebileceği bilgiler. |

Yeni bir Distrobox ortamında çalıştırma sırası:

```
git clone https://github.com/softwaremonkey635/kocaeli-social-hub.git
cd kocaeli-social-hub
sh migration/distrobox/setup.sh
distrobox enter kocaeli
bash migration/bootstrap.sh
sh migration/verify.sh
```

Ardından `HANDOVER-CHECKLIST.md` adımlarını izle. Vite 8 için Node 20.19+ veya
22.12+ gerekir; konteyner Node 22 LTS görüntüsünü sabitler, `bootstrap.sh` düşük sürümde reddeder.

## 3. Doğrulama

| Kapı | Komut | Ne denetler |
|---|---|---|
| Tip kontrolü | `npx tsc --noEmit` (veya `npm run lint`) | TypeScript hataları |
| Tam statik build | `npm run build:static` | Vite build + prerender + sitemap + feed |
| Birim test | `npm run test:calendar` | `src/utils/calendar.ts`, 9 grup |
| E2E matrisi | `node tests/e2e-matrix.mjs [BASE_URL]` | 9 rota x 2 viewport, 21 kategori |

E2E matrisi `tests/fixtures/routes.json` fixture'ını kullanır, JSON özetini
`/tmp/opencode/e2e-matrix.json` dosyasına yazar, hata durumunda çıkış kodu 1 olur.
Playwright `package.json` bağımlılığı değildir; `bootstrap.sh` ve `verify.sh` `--no-save` ile kurar.
Son bilinen sonuçlar (`docs/09-denetim.md`, 2026-09-26, commit `9a49591`):

- `npx tsc --noEmit` = 0 hata.
- `build:static` başarılı; sitemap 9/9 URL sondaki eğik çizgili.
- axe 0 ihlal, E2E matrisi 212/212.
- Yerel Playwright 4/4; E2E matrisi yerelde 196/196.

`839bb98` (2026-09-26) sonrası ağaçta yeni kapı koşusu kaydı yok; güncel head
için tsc/build/E2E sonucu **bilinmiyor**. Sonraki oturum `sh migration/verify.sh` koşup sonucu `docs/09-denetim.md` dosyasına eklemeli.

## 4. Açık işler

Sahibine düşenler:

- **Analitik hesabı.** `deploy/CHECKLIST.md` içinde "Google Analytics veya
  tercih edilen analitik aracı eklendi" ve "CSP bağlantı listesine analitik
  domain eklendi" kutuları işaretli değil. `MANIFEST.md` CSP'in zaten
  `googletagmanager.com` ve `google-analytics.com` alanlarını açık tuttuğunu,
  anahtar gerekmediğini söyler.
- **Host bilgileri.** `deploy/OWNER-REQUEST.md` ve `migration/OWNER-INPUTS.md`
  8 soru sorar: panel, sunucu yazılımı, PHP, domain, DNS, SSL, yükleme
  yöntemi, iletişim. Ayrıca `SITE_ORIGIN` ve `APP_BASE` build çıktısını
  değiştirir.
- **Blog taslakları.** `docs/icerik/` altında 12 taslak, `SSS.md` ve
  `YAYINLAMA-REHBERI.md` var. Akış: frontmatter doldur, `[DOĞRULANMALI]`
  iddiaları doğrula, içeriği `src/data/blogData.ts` dosyasına taşı,
  `npm run build`, deploy.
- **Mikro metinler.** `docs/08-mikro-metinler.md` 76 öneri içeriyor
  (70 uygulanabilir, 7 `[DOĞRULANMALI]`). Hiçbiri koda uygulanmamış.
Ağaçta literal `TODO`/`FIXME` yok. `[DOĞRULANMALI]` işaretleri `docs/icerik/`
taslaklarında ve `docs/08-mikro-metinler.md` içinde bulunur; `HANDOVER-CHECKLIST.md` kutuları işaretli değil.

## 5. Riskler

- **Tek bakıcı.** Proje tek sahibine (Murat Malkoç) bağlı; bilgi aktarımı
  `docs/` ve `migration/` belgelerine dayanıyor.
- **Üçüncü taraf API bağımlılığı.** Runtime'da 8 dış ana bilgisayar çağrılır:
  `finans.truncgil.com`, `scanner.tradingview.com`, `open.er-api.com`,
  `api.open-meteo.com`, `tr.wikipedia.org`, `fonts.googleapis.com`,
  `fonts.gstatic.com`, `images.unsplash.com`. Hepsi anahtarsız ve CORS açık,
  ama kullanılabilirlik garantisi yok.
- **Lockfile seçimi.** Hem `bun.lock` hem `package-lock.json` mevcut. Commit
  `65c780e` `package-lock.json` dosyasını benimsiyor; kontrol listesi bir
  yönetici seçip diğerini silmeyi öneriyor.
- **Plan modu kesintileri.** opencode plan modu salt okunurdur; geçiş paketi
  normal host ve Distrobox konteyneri varsayar. Flatpak sandbox'ına özgü sabit
  yollar (`/home/bazzite/.npm/_npx`, `/tmp/opencode/kocaeli-social-hub`,
  `~/.cache/ms-playwright`) yeni sistemde bulunmayabilir.
- **Playwright bağımlılığı.** `package.json` içinde değil; kurulum betikleri
  `--no-save` ile kurar. Temiz klonda `build:static` bu adımda hata verebilir.

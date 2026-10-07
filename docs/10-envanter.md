# 10: Envanter

Proje: `softwaremonkey635/kocaeli-social-hub` (public). Okuma anı: 2026-10-07, repo head `65c780e`.
Klon: `/tmp/opencode/kocaeli-inventory`. Tüm sayılar bu klon üzerinden `ls` ve Python betikleriyle doğrulandı.
Dil: Türkçe. Yalnızca gerçekler; öneri yok. Doğrulanamayan yerler "belirlenemedi" olarak işaretli.

---

## 1. Dizin ağacı

`node_modules`, `dist` ve `.git` hariç. Toplam **141 dosya, 4.8 MB**.

| Dizin | Dosya | Boyut |
|---|---|---:|
| `.` (kök) | 12 | 332.8 KB |
| `tests` | 3 | 31.3 KB |
| `tests/fixtures` | 1 | 2.3 KB |
| `src` | 4 | 17.2 KB |
| `src/utils` | 6 | 25.4 KB |
| `src/pages` | 9 | 268.4 KB |
| `src/data` | 4 | 38.1 KB |
| `src/constants` | 1 | 626 B |
| `src/components` | 11 | 129.2 KB |
| `scripts` | 6 | 42.8 KB |
| `public` | 7 | 479.5 KB |
| `public/structured-data` | 4 | 74.9 KB |
| `public/og` | 10 | 125.6 KB |
| `public/images` | 0 | 0 B |
| `public/images/optimized` | 1 | 4.9 KB |
| `public/images/optimized/logo` | 0 | 0 B |
| `public/images/optimized/logo/kocaeli-logo` | 1 | 13.4 KB |
| `public/images/optimized/events` | 0 | 0 B |
| `public/images/optimized/events/speaking-club` | 2 | 245.8 KB |
| `public/images/optimized/events/kitap-soylesisi` | 2 | 83.1 KB |
| `public/images/optimized/events/kil-boyama` | 2 | 116.9 KB |
| `public/images/optimized/events/hiking` | 2 | 113.5 KB |
| `public/images/optimized/events/canta-boyama` | 2 | 91.9 KB |
| `public/images/optimized/events/camping` | 2 | 81.8 KB |
| `public/images/optimized/events/biblo-boyama` | 2 | 122.9 KB |
| `public/images/logo` | 1 | 35.5 KB |
| `public/images/events` | 7 | 2.2 MB |
| `migration` | 6 | 16.0 KB |
| `migration/distrobox` | 2 | 2.5 KB |
| `docs` | 9 | 56.0 KB |
| `docs/icerik` | 14 | 45.4 KB |
| `deploy` | 8 | 20.7 KB |
| **TOPLAM** | **141** | **4.8 MB** |

Uzantı dağılımı: `md` 37, `tsx` 22, `webp` 15, `png` 13, `ts` 12, `json` 10, `mjs` 8, `jpeg` 8, `sh` 3, `html` 2, `js` 1, `css` 1, `xml` 1, `txt` 1, diğer (`.nvmrc`, `.gitignore`, `.env.example`, `.nojekyll`, `.ini`, `.snippet`, `.htaccess`) 7.

Ayrı olarak:
- `node_modules`: **YOK** (klonda bulunmuyor, `.gitignore` ile hariç tutuluyor).
- `dist`: **YOK** (klonda bulunmuyor, `.gitignore` ile hariç tutuluyor).

---

## 2. Bağımlılıklar

`package.json` sürümleri ve kullanım yerleri. "kullanilmiyor" = kaynak kodda import/require yok.

### dependencies

| Paket | Sürüm | Kullanım |
|---|---|---|
| `@tailwindcss/vite` | `^4.3.3` | `vite.config.ts:1` (Tailwind Vite eklentisi) |
| `@vitejs/plugin-react` | `^6.1.1` | `vite.config.ts:1` (React eklentisi) |
| `lucide-react` | `^0.546.0` | 21 kaynak dosya: `src/App.tsx`, `src/pages/*.tsx` (9), `src/components/*.tsx` (11) |
| `react` | `^19.0.1` | 23 kaynak dosya: `src/main.tsx`, `src/App.tsx`, `src/utils/keyboard.ts`, `src/pages/*.tsx` (9), `src/components/*.tsx` (11) |
| `react-dom` | `^19.0.1` | `src/main.tsx:2` (`react-dom/client`) |
| `react-is` | `^19.3.0` | **kullanilmiyor** (kaynakta import yok; `react-dom` üzerinden dolaylı bağımlılık) |
| `recharts` | `^3.10.1` | `src/pages/GuidePage.tsx`, `src/components/GuideCharts.tsx` |
| `vite` | `^8.3.0` | `vite.config.ts`, `scripts/prerender.mjs`, `scripts/gen-sitemap.mjs`, `scripts/gen-feeds.mjs` (build aracı) |

### devDependencies

| Paket | Sürüm | Kullanım |
|---|---|---|
| `@types/node` | `^22.14.0` | **kullanilmiyor** (kaynakta import yok; `tsconfig.json` `types` alanı yalnızca `vite/client` içeriyor) |
| `@types/react` | `^19.3.0` | **kullanilmiyor** (tip paketi, doğrudan import yok) |
| `@types/react-dom` | `^19.3.0` | **kullanilmiyor** (tip paketi, doğrudan import yok) |
| `autoprefixer` | `^10.4.21` | **kullanilmiyor** (`vite.config.ts` ve `src/index.css` içinde referans yok) |
| `esbuild` | `^0.25.0` | `tests/calendar.test.mjs:9` (`require('esbuild')` ile `src/utils/calendar.ts` derleniyor) |
| `sharp` | `^0.35.4` | `optimize-images.js`, `scripts/generate-pwa-icons.mjs` |
| `tailwindcss` | `^4.3.3` | `vite.config.ts` (eklenti), `src/index.css` (`@import "tailwindcss"`) |
| `tsx` | `^4.21.0` | **kullanilmiyor** (kaynakta import yok; `"tsx"` yalnızca dosya uzantısı olarak geçiyor) |
| `typescript` | `^7.0.2` | `npm run lint` (`tsc --noEmit`) üzerinden kullanılıyor; kaynak kodda import yok |
| `vite-plugin-pwa` | `^1.3.0` | `vite.config.ts:1` (PWA eklentisi) |

---

## 3. Scriptler

`package.json` içindeki 7 script.

| Script | Komut | Ne yaptığı | Dokunduğu dosyalar |
|---|---|---|---|
| `dev` | `vite --port=3000 --host=0.0.0.0` | Vite geliştirme sunucusunu 3000 portunda başlatır | Okur: `src/`, `index.html`, `vite.config.ts`, `public/`. Yazma yok. |
| `build` | `vite build` | `dist/` çıktısını üretir | Yazma: `dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css`, `dist/manifest.webmanifest`, `dist/sw.js`, `dist/workbox-*.js`; `public/` içindeki dosyalar `dist/` altına kopyalanır |
| `build:static` | `vite build && node scripts/prerender.mjs && node scripts/gen-sitemap.mjs && node scripts/gen-feeds.mjs` | Tam statik build | Yazma: `dist/` (yukarıdaki tümü) + `dist/<route>/index.html` (8), `dist/404.html`, `dist/feed.xml`, `dist/events.ics`; ayrıca `public/sitemap.xml` ve `public/robots.txt` üzerine yazar |
| `preview` | `vite preview` | `dist/` klasörünü yerelde sunar | Okur: `dist/`. Yazma yok. |
| `clean` | `rm -rf dist server.js` | `dist/` ve `server.js` siler | `server.js` depoda mevcut değil; yalnızca `dist/` etkilenir |
| `lint` | `tsc --noEmit` | Tip kontrolü | Okur: `tsconfig.json`, `src/`. Yazma yok. |
| `test:calendar` | `node tests/calendar.test.mjs` | `src/utils/calendar.ts` dosyasını esbuild ile geçici dizine derler ve assert çalıştırır | Okur: `src/utils/calendar.ts`; yazar: geçici dizin (`tmpdir`) |

---

## 4. Rotalar

9 rota. Rota listesi `scripts/static-routes.mjs` içindeki `ROUTES` dizisi ve `src/App.tsx` içindeki `ROUTED_PAGES` ile aynı. Ön yüzleme çıktısı `scripts/prerender.mjs` tarafından üretilir.

| Rota | Sayfa bileşeni | Ön yüzleme çıktısı |
|---|---|---|
| `/` (anasayfa) | `src/pages/HomePage.tsx` | `dist/index.html` |
| `/events` | `src/pages/EventsPage.tsx` | `dist/events/index.html` (events JSON-LD enjekte edilir) |
| `/vision` | `src/pages/VisionMissionPage.tsx` | `dist/vision/index.html` |
| `/clubs` | `src/pages/ClubsPage.tsx` | `dist/clubs/index.html` |
| `/gallery` | `src/pages/GalleryPage.tsx` | `dist/gallery/index.html` |
| `/contact` | `src/pages/ContactJoinPage.tsx` | `dist/contact/index.html` (FAQ JSON-LD enjekte edilir) |
| `/blog` | `src/pages/BlogPage.tsx` | `dist/blog/index.html` |
| `/sponsors` | `src/pages/SponsorsPage.tsx` | `dist/sponsors/index.html` |
| `/guide` | `src/pages/GuidePage.tsx` | `dist/guide/index.html` |

Ek çıktı: `dist/404.html` (anasayfa yakalamasının kopyası). Toplam 10 HTML dosyası.

---

## 5. Public varlıklar

`public/` altında **45 dosya**. Görseller için piksel boyutu başlık (header) okunarak doğrulandı.

### Kök ve yapılandırma

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/.nojekyll` | 0 B | yok |
| `public/apple-touch-icon.png` | 32688 B | 180x180 |
| `public/pwa-192x192.png` | 36173 B | 192x192 |
| `public/pwa-512x512.png` | 203665 B | 512x512 |
| `public/pwa-maskable-512x512.png` | 217137 B | 512x512 |
| `public/robots.txt` | 100 B | yok |
| `public/sitemap.xml` | 1264 B | yok |

### `public/structured-data`

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/structured-data/README.md` | 1445 B | yok |
| `public/structured-data/events-snippet.html` | 33635 B | yok |
| `public/structured-data/events.json` | 33589 B | yok |
| `public/structured-data/faq.json` | 7981 B | yok |

### `public/og` (hepsi 1200x630)

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/og/blog.png` | 12837 B | 1200x630 |
| `public/og/clubs.png` | 13514 B | 1200x630 |
| `public/og/contact.png` | 15282 B | 1200x630 |
| `public/og/events.png` | 15056 B | 1200x630 |
| `public/og/gallery.png` | 12685 B | 1200x630 |
| `public/og/guide.png` | 12589 B | 1200x630 |
| `public/og/home.png` | 14556 B | 1200x630 |
| `public/og/manifest.json` | 1316 B | yok |
| `public/og/sponsors.png` | 14110 B | 1200x630 |
| `public/og/vision.png` | 16649 B | 1200x630 |

### `public/images/logo`

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/images/logo/kocaeli-logo.jpeg` | 36314 B | 640x640 |

### `public/images/events` (orijinal JPEG)

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/images/events/biblo-boyama.jpeg` | 340999 B | 1080x1350 |
| `public/images/events/camping.jpeg` | 254475 B | 1080x1350 |
| `public/images/events/canta-boyama.jpeg` | 289400 B | 1080x1350 |
| `public/images/events/hiking.jpeg` | 303087 B | 1080x1350 |
| `public/images/events/kil-boyama.jpeg` | 339882 B | 1080x1350 |
| `public/images/events/kitap-soylesisi.jpeg` | 259205 B | 1080x1350 |
| `public/images/events/speaking-club.jpeg` | 534467 B | 960x1205 |

### `public/images/optimized` (WebP varyantları)

| Dosya | Boyut | Piksel |
|---|---:|---|
| `public/images/optimized/manifest.json` | 5059 B | yok |
| `public/images/optimized/logo/kocaeli-logo/kocaeli-logo-400.webp` | 13736 B | 400x400 |
| `public/images/optimized/events/speaking-club/speaking-club-400.webp` | 50766 B | 400x502 |
| `public/images/optimized/events/speaking-club/speaking-club-800.webp` | 200930 B | 800x1004 |
| `public/images/optimized/events/kitap-soylesisi/kitap-soylesisi-400.webp` | 24970 B | 400x500 |
| `public/images/optimized/events/kitap-soylesisi/kitap-soylesisi-800.webp` | 60168 B | 800x1000 |
| `public/images/optimized/events/kil-boyama/kil-boyama-400.webp` | 33582 B | 400x500 |
| `public/images/optimized/events/kil-boyama/kil-boyama-800.webp` | 86088 B | 800x1000 |
| `public/images/optimized/events/hiking/hiking-400.webp` | 33980 B | 400x500 |
| `public/images/optimized/events/hiking/hiking-800.webp` | 82246 B | 800x1000 |
| `public/images/optimized/events/canta-boyama/canta-boyama-400.webp` | 27510 B | 400x500 |
| `public/images/optimized/events/canta-boyama/canta-boyama-800.webp` | 66600 B | 800x1000 |
| `public/images/optimized/events/camping/camping-400.webp` | 25536 B | 400x500 |
| `public/images/optimized/events/camping/camping-800.webp` | 58212 B | 800x1000 |
| `public/images/optimized/events/biblo-boyama/biblo-boyama-400.webp` | 34404 B | 400x500 |
| `public/images/optimized/events/biblo-boyama/biblo-boyama-800.webp` | 91410 B | 800x1000 |

---

## 6. Dış ağ çağrıları (runtime)

Tarayıcının `fetch` ile yaptığı üçüncü taraf çağrılar. CORS ve anahtar durumu 2026-10-07 tarihinde `curl -H "Origin: ..."` ile doğrudan header okunarak kontrol edildi. "Anahtar" = çağrı kodunda API anahtarı olup olmadığı.

| URL | Dosya:satır | CORS | Anahtar |
|---|---|---|---|
| `https://finans.truncgil.com/today.json` | `src/components/FinanceTicker.tsx:43` | Açık (`access-control-allow-origin: *`) | Anahtarsız |
| `https://scanner.tradingview.com/symbol?symbol=BIST%3AXU100&fields=close,change&no_404=true` | `src/components/FinanceTicker.tsx:45` | Açık (`access-control-allow-origin` isteğin `Origin` değerini yansıtıyor, `allow-credentials: true`) | Anahtarsız |
| `https://open.er-api.com/v6/latest/USD` | `src/components/FinanceTicker.tsx:47` | Açık (`access-control-allow-origin: *`) | Anahtarsız |
| `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=...&timezone=Europe%2FIstanbul` | `src/components/WeatherWidget.tsx:252` | Açık (`access-control-allow-origin: *`, `Origin` header'ı ile kontrol edildi) | Anahtarsız |
| `https://tr.wikipedia.org/api/rest_v1/feed/onthisday/events/{MM}/{DD}` | `src/components/HistoryTodayWidget.tsx:33` | Açık (`access-control-allow-origin: *`) | Anahtarsız |
| `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:...&family=Outfit:...&display=swap` | `index.html:38`, `index.html:39` | Açık (`access-control-allow-origin: *`) | Anahtarsız |
| `https://fonts.gstatic.com/...` (font dosyaları) | `index.html:37` (preconnect; font dosyaları CSS üzerinden çekilir) | Açık (`access-control-allow-origin: *`) | Anahtarsız |
| `https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?...` | `src/data/mockData.ts:181`, `:297`, `:315`, `:324`, `:333`; `src/data/galleryData.ts:93`; `public/structured-data/events-snippet.html:806` | Açık (`access-control-allow-origin: *`) | Anahtarsız |

Not: `api.open-meteo.com` yanıtı `Origin` header'ı olmadan `access-control-allow-origin` göndermiyor; `Origin` header'ı ile yapıldığında `*` dönüyor. CORS açık sayıldı.

Kullanıcı tıklamasıyla açılan dış bağlantılar (fetch ile veri çekilmez, yönlendirme yapılır):

| URL | Kaynak |
|---|---|
| `https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L` | `src/constants/links.ts:3` |
| `https://wa.me/905461844136` | `src/constants/links.ts:8` |
| `https://www.instagram.com/kocaelisosyal.41?igsh=MWdvYjVnZjAyMHU2Y` | `src/constants/links.ts:9` |
| `https://forms.gle/KocaeliSosyalLiderlik` | `src/constants/links.ts:11` |
| `https://wa.me/${founderPhoneRaw}?text=...` | `src/pages/ContactJoinPage.tsx:116` |
| `https://wa.me/${founderPhoneRaw...}?text=...` | `src/pages/SponsorsPage.tsx:58` |
| `https://wa.me/?text=...` | `src/utils/calendar.ts:238` |
| `https://calendar.google.com/calendar/render?action=TEMPLATE...` | `src/utils/calendar.ts:221` |
| `https://kocaelikart.com` | `src/pages/GuidePage.tsx:1980` |

---

## 7. Ortam değişkenleri

Kod içinde okunan tüm ortam değişkenleri ve varsayılanları.

| Değişken | Okunduğu yer | Varsayılan |
|---|---|---|
| `APP_BASE` | `vite.config.ts:10`, `scripts/static-routes.mjs:29` | `/` |
| `DISABLE_HMR` | `vite.config.ts:72`, `vite.config.ts:74` | tanımsız (HMR açık; `true` olursa HMR ve dosya izleme kapanır) |
| `SITE_ORIGIN` | `scripts/static-routes.mjs:39` | `https://softwaremonkey635.github.io` |
| `PLAYWRIGHT_BROWSERS_PATH` | `scripts/prerender.mjs:128` | `~/.cache/ms-playwright` |
| `BASE_URL` (Vite yerleşik) | `src/App.tsx:42`, `src/utils/seo.ts:5`, `src/utils/responsiveImages.ts:1`, `src/pages/BlogPage.tsx:24`, `src/data/mockData.ts:3`, `src/data/galleryData.ts:3`, `src/data/blogData.ts:3`, `src/components/Logo.tsx:4` | `/` (Vite `base` değeri) |
| `PORT` | `migration/verify.sh:17` | `4173` (shell betiği, uygulama kodunda değil) |

`.env.example` içinde tanımlı ancak hiçbir kodda okunmayan değişkenler: `GEMINI_API_KEY`, `APP_URL`. `grep` ile doğrulandı: yalnızca `.env.example`, `README.md` ve `migration/` içinde anılıyor; runtime'da okunmuyor.

`scripts/gen-feeds.mjs` içinde `import.meta.env.BASE_URL` yalnızca yorum satırlarında geçiyor (`:10`, `:154`); kod tarafından okunmuyor.

---

## 8. Üretilen çıktılar

| Çıktı | Üreten script |
|---|---|
| `dist/index.html` (önce Vite, sonra `prerender.mjs` ile anasayfa yakalamasıyla üzerine yazılır) | `vite build`, `scripts/prerender.mjs` |
| `dist/<route>/index.html` (8 rota) | `scripts/prerender.mjs` |
| `dist/404.html` (anasayfa yakalamasının kopyası) | `scripts/prerender.mjs` |
| `dist/assets/*.js`, `dist/assets/*.css` | `vite build` |
| `dist/manifest.webmanifest`, `dist/sw.js`, `dist/workbox-*.js` | `vite build` (vite-plugin-pwa) |
| `dist/sitemap.xml`, `dist/robots.txt` | `scripts/gen-sitemap.mjs` (önce `vite build` `public/` kopyasını oluşturur) |
| `public/sitemap.xml`, `public/robots.txt` (takip edilen şablonların üzerine yazılır) | `scripts/gen-sitemap.mjs` |
| `dist/feed.xml` (RSS 2.0) | `scripts/gen-feeds.mjs` |
| `dist/events.ics` (RFC 5545) | `scripts/gen-feeds.mjs` |
| `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-maskable-512x512.png`, `public/apple-touch-icon.png` | `scripts/generate-pwa-icons.mjs` (manuel; npm script'i yok) |
| `public/images/optimized/**` + `public/images/optimized/manifest.json` | `optimize-images.js` (manuel; yolları betiğin kendi konumundan çözer) |
| `src/utils/imageDims.ts` | `scripts/image-dims.mjs --write` (manuel) |

---

## 9. Yeni bir makinede ne bozulur

1. **Playwright yok.** `scripts/prerender.mjs` `playwright` paketini `package.json`'dan değil, `<repo>/node_modules/playwright` veya `os.homedir()` ile kurulan `~/.npm/_npx` önbelleğinden çözümlüyor. Bu paket `package.json`'da bağımlılık olarak listelenmiyor. Yeni makinede ne `node_modules/playwright` ne de npx önbelleği ne de `~/.cache/ms-playwright` tarayıcı ikili dosyası olabilir; bu durumda `build:static` bu adımda hata verir. Playwright'ı `npm install --no-save playwright` ve `npx playwright install --with-deps --only-shell chromium` ile kurun.
2. **Sabit npx önbellek yolu (taşınabilir).** `scripts/prerender.mjs` npx önbellek yolunu `os.homedir()` ile kurar; `tests/e2e-matrix.mjs`'de `_npx` başvurusu yoktur. İki betikte de kullanıcı adına sabit bir yol kalmadı.
3. **Sabit proje yolu (taşınabilir).** `optimize-images.js` kaynak ve hedef dizinleri kendi konumundan (`import.meta.url`) çözer; betik herhangi bir klonda çalışır.
4. **Node sürümü.** `.nvmrc` = `24`; `package.json` `engines.node` = `>=22`; `migration/bootstrap.sh` Vite 8 için Node 20.19+ veya 22.12+ istiyor. Düşük sürümde build başarısız olur.
5. **Önce `vite build` şart.** `scripts/gen-sitemap.mjs` ve `scripts/gen-feeds.mjs` `dist/` klasörünün var olmasını gerektiriyor; `gen-feeds.mjs` `dist/` yoksa hata veriyor.
6. **`public/` üzerine yazma yan etkisi.** `scripts/gen-sitemap.mjs` takip edilen `public/sitemap.xml` ve `public/robots.txt` dosyalarının içeriğini değiştiriyor.
7. **Otomatik üretilen dosya.** `src/utils/imageDims.ts` `scripts/image-dims.mjs --write` ile üretiliyor; elle düzenlenmişse betik çalıştırıldığında değişebilir.
8. **Alt yol (subpath) build.** `APP_BASE` varsayılanı `/`. GitHub Pages alt yolunda (`/kocaeli-social-hub/`) sunulacaksa `APP_BASE` ayarlanmadan build edilen sözlük yollar bozulur.
9. **`npm run clean` hedefi.** `server.js` depoda mevcut değil; komutun bu kısmı etkisiz.
10. **`node_modules` ve `dist` gitignore.** İkisi de `.gitignore` içinde; temiz klonda yok. `npm ci` için `package-lock.json` mevcut.

---

## Doğrulama sayıları

- Dosya sayısı (node_modules/dist/.git hariç): **141**
- Bağımlılık sayısı: **18** (dependencies 8 + devDependencies 10)
- Rota sayısı: **9**
- Public varlık sayısı: **45**
- Runtime dış ağ çağrısı (fetch): **8** farklı üçüncü taraf ana bilgisayar

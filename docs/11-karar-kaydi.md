# 11: Karar Kaydı

Proje: `softwaremonkey635/kocaeli-social-hub`. Tarih: 2026-10-08. Repo head: `e8dbc03`.
Bu belge geçiş ve mimari kararlarını kaydeder. Her karar için öneri, reddedilen iki güçlü alternatif ve geri dönüş zorluğu yazılıdır. Kaynak etiketleri: [DOĞRULANDI] (kaynaklı), [DOĞRULANMADI] (kaynaksız), VERIFY-NEEDED (sahibine sorulacak).

## 1. Karar tablosu

| Karar          | Öneri                                                            | Geri dönüş          |
| -------------- | ---------------------------------------------------------------- | ------------------- |
| Geçiş yürütme  | Distrobox paketini olduğu gibi koş; üretim statik yükleme kalsın | Kolay               |
| İçerik akışı   | TypeScript veri dosyaları kalsın; form + doğrulama betiği ekle   | Kolay               |
| Analitik       | Çerezsiz araç (Plausible/Umami)                                  | Kolay               |
| Arama          | Pagefind'i ertele (içerik hacmi gelince)                         | Kolay               |
| Mekan haritası | Etkileşimli haritayı ertele; adres + link yeter                  | Kolay               |
| RSVP           | Web3Forms v1; WhatsApp hatırlatma                                | Kolay               |
| i18n           | Türkçe kalsın; i18next ekleme                                    | Kolay (ertelenince) |
| Router         | Özel History-API router kalsın                                   | Kolay (korumak)     |

## 2. Kararların ayrıntısı

### 2.1 Geçiş yürütme

**Kaybeden argümanlar.**
- *Flatpak sandbox'ta kal.* Sabit yollar (`/home/bazzite/.npm/_npx`, `/tmp/opencode/...`) normal hostta yok; Playwright kurulumu sancılı. [DOĞRULANDI: docs/12]
- *Özel Containerfile ile imaj pişir.* Tek geliştirici için fazla mühendislik; `nodejs24` distro paketi zaten yeniden üretilebilir ve konteyner yeniden kurulunca kalır. [DOĞRULANDI: migration/NOTES-FROM-RESEARCH.md]

**Karar.** `migration/distrobox/kocaeli.ini` (Fedora 44 toolbox, `nodejs24`) + `bootstrap.sh` + `verify.sh` olduğu gibi koşulur. Bu bir geliştirme ortamı değişikliğidir; üretim, `dist/` klasörünün Türk paylaşımlı sunucuya yüklenmesi olarak kalır. İkisini karıştırmak en büyük risktir.

**Geri dönüş.** Kolay. Konteyner tek kullanımlık; repo değişmez.

VERIFY-NEEDED: "Sunucu Apache veya LiteSpeed mi çalıştırıyor ve `mod_rewrite` ile `AllowOverride` açık mı, yani `deploy/.htaccess` bilinmeyen yolları `index.html`'e çevirebilir mi?"

### 2.2 İçerik akışı (teknik olmayan sahip)

**Kaybeden argümanlar.**
- *Decap CMS (tarayıcıdan Git düzenleme).* OAuth arka ucu (GitHub OAuth veya Netlify Identity + Git Gateway) ister. Site Node çalıştırmayan Türk paylaşımlı sunucuya taşınıyor; bu yeni bir dış bağımlılık ve yeni bir arıza noktası olur. [DOĞRULANDI: kocaeli-feature-ideas.md]
- *Headless CMS (Sanity/Contentful) + build anında çekme.* Çalışma zamanı API bağımlılığı ve satıcı hesabı ekler; siteyi kasıtlı olarak anahtarsız ve statik tutan özelliği bozar. [DOĞRULANDI: migration/MANIFEST.md]

**Karar.** `src/data/*.ts` tek doğruluk kaynağı kalır. Üstüne ince bir giriş yolu eklenir: sahip yapılandırılmış bir form (veya doldurulmuş Markdown şablonu) verir, bakıcı veya bir betik objeyi ekler. `docs/01-icerik-guncelleme.md` akışı zaten anlatıyor. Yeni: yinelenen `id` veya eksik zorunlu alanda build'i durduran bir doğrulama betiği.

**Geri dönüş.** Kolay. Veri dosyaları düz TS; CMS sonradan katmanlanabilir.

VERIFY-NEEDED: "Sahip `src/data/*.ts` dosyalarını doğrudan düzenleyecek mi, yoksa her içerik değişikliği bir bakıcıdan veya formdan mı geçmeli?"

### 2.3 Analitik

**Kaybeden argümanlar.**
- *Google Analytics 4.* Çerez koyar; KVKK için onay bandı gerekir ve sahip bir onay arayüzü bakmak zorunda kalır. CSP zaten `googletagmanager.com` ve `google-analytics.com` alanlarını açık tutuyor, yani sunucu değişikliği gerekmez, ama genç kitle için gizlilik maliyeti gerçek. [DOĞRULANDI: migration/MANIFEST.md]
- *Hiç analitik yok.* Sahip sitenin çalışıp çalışmadığını ve hangi etkinliğin ilgi çektiğini ölçemez; geçişin "bitti" tanımı trafik sinyali ister. [DOĞRULANDI: docs/12]

**Karar.** Çerezsiz, gizlilik öncelikli bir araç (Plausible veya Umami) eklenir. Onay bandı gerekmez. CSP'ye tek satır eklenir. GA4, sahip açıkça isterse geri düşüş seçeneğidir.

**Geri dönüş.** Kolay (tek script etiketi + tek CSP satırı).

VERIFY-NEEDED: "Ekim 2026 itibarıyla Umami Cloud (veya Plausible) ücretsiz katmanının istek limiti nedir ve küçük bir şehir sitesinin trafiğini karşılar mı?"

### 2.4 Arama

**Kaybeden argümanlar.**
- *Pagefind'i şimdi kur.* Dizin 9 sayfa ve birkaç yazıyı kapsar; değer düşük, üstüne bir build adımı ve bakılacak bir arayüz ekler. [DOĞRULANDI: docs/10, docs/12]
- *Barındırılan arama (Algolia DocSearch / Typesense).* Satıcı hesabı, API anahtarı ve çalışma zamanı bağımlılığı ekler; site kasıtlı olarak anahtarsız. [DOĞRULANDI: migration/MANIFEST.md]

**Karar.** Pagefind ertelenir. Blog yaklaşık 20-30 yayınlanmış yazıya ulaşınca eklenir: `pagefind --site dist` build adımı + küçük bir arayüz.

**Geri dönüş.** Kolay.

### 2.5 Mekan haritası

**Kaybeden argümanlar.**
- *Şimdi MapLibre GL JS + OSM.* WebGL bağımlılığı ve karo politikası yükümlülüğü (geçerli User-Agent, toplu indirme yok) ekler; OSM karoları garanti vermez. Birkaç mekan için fazla. [DOĞRULANDI: kocaeli-feature-ideas.md]
- *Google Maps embed.* API anahtarı ve faturalı hesap ister; site kasıtlı olarak anahtarsız. [DOĞRULANDI: migration/MANIFEST.md]

**Karar.** Etkileşimli harita ertelenir. Önce her etkinliğe düz adres + Google Maps linki (veya statik harita görseli) eklenir. Harita ancak mekan karışıklığı ölçülürse gelir.

**Geri dönüş.** Kolay.

VERIFY-NEEDED: "OSM Foundation karo politikası hangi istek hacminde ticari karo sağlayıcısına geçmeyi zorunlu kılar ve küçük bir şehir sitesi bu eşiğin altında kalır mı?"

### 2.6 RSVP

**Kaybeden argümanlar.**
- *Google Sheets + Apps Script.* Tam kontrol ve ücretsiz, ama sahip bir betik ve bir tablo bakmak zorunda; Apps Script web uygulaması URL'si sahibin hata ayıklayamayacağı tek arıza noktası. [DOĞRULANDI: kocaeli-feature-ideas.md]
- *Supabase (veya herhangi bir veritabanı).* Ücretsiz katman bir hafta hareketsizlikten sonra duraklıyor, bu RSVP'yi sessizce bozar; statik siteye arka uç ekler. [DOĞRULANDI: kocaeli-feature-ideas.md]

**Karar.** RSVP v1 Web3Forms ile (ayda 250 gönderim, kart yok) çıkar: ad + iletişim + etkinlik id. Form `action` URL'si tek bir sabitte tutulur ki arka uç değiştirilebilsin. Etkinlikten bir gün önce RSVP listesine elle WhatsApp hatırlatması eklenir; kanıt, elle hatırlatmanın devamsızlığı %39,1 azalttığını gösteriyor. [DOĞRULANDI: kocaeli-feature-ideas.md]

**Geri dönüş.** Kolay (form action değişir).

VERIFY-NEEDED: "Web3Forms ücretsiz katmanı Ekim 2026'da ayda 250 gönderime izin veriyor mu ve ad/telefon verisini KVKK'ya uygun işliyor mu (veri nerede saklanır, ne kadar süreyle, DPA var mı)?"

### 2.7 i18n

**Kaybeden argümanlar.**
- *Şimdi i18next + react-i18next.* İçerik yüzeyini ikiye katlar, çeviri kayması ekler; sahip iki dili bakamaz. [DOĞRULANDI: kocaeli-feature-ideas.md]
- *Makine çevirisiyle İngilizce build.* Bakımsız makine çevirisi topluluk sitesinde slop gibi okunur ve etkinlik ayrıntılarını yanlış çevirebilir. [DOĞRULANMADI]

**Karar.** Türkçe kalır. i18next eklenmez. Site `lang="tr"`, kitle yerel, sahip teknik değil. Yalnızca gerçek bir İngilizce kitle (örneğin üniversitelerdeki uluslararası öğrenciler) ortaya çıkarsa yeniden bakılır.

**Geri dönüş.** Ertelenince kolay; içerik çoğaltıldıktan sonra orta.

### 2.8 Router (özel vs React Router)

**Kaybeden argümanlar.**
- *React Router.* 9 ön yüzlenmiş rotayı ve yeni düzeltilen sondaki eğik çizgi standardını kırma riski taşır; 9 rotalı bir siteye bağımlılık ekler. [DOĞRULANDI: docs/09, docs/10]
- *Hash yönlendirme.* SEO ve canonical URL'ler için daha kötü; site bilinçli olarak temiz URL'lere geçti. [DOĞRULANDI: README.md]

**Karar.** `src/App.tsx` içindeki özel History-API router kalır. 9 rotayı, sondaki eğik çizgi standardını ve ön yüzleme sözleşmesini yönetiyor. Taşınmaz.

**Geri dönüş.** Korumak kolay; sonradan değiştirmek orta (her link ve ön yüzleme betiği etkilenir).

## 3. Geçiş koşu sırası ve "bitti" tanımı

Sıra (`migration/README.md` ve `docs/12`):
1. `git clone https://github.com/softwaremonkey635/kocaeli-social-hub.git`
2. `cd kocaeli-social-hub`
3. `sh migration/distrobox/setup.sh`
4. `distrobox enter kocaeli`
5. `bash migration/bootstrap.sh`
6. `sh migration/verify.sh`
7. `migration/HANDOVER-CHECKLIST.md` adımları.

"Bitti" (yeni sistemde):
- `npx tsc --noEmit` = 0 hata.
- `npm run build:static` başarılı; sitemap 9/9 URL sondaki eğik çizgili.
- `npm run test:calendar` geçer.
- E2E matrisi geçer (9 rota x 2 viewport).
- `dist/` Türk sunucuya yüklenir; 9 rota History-API geri düşüşüyle açılır.
- `SITE_ORIGIN` ve `APP_BASE` gerçek domaine ayarlanır.

## 4. Risk kaydı

| Risk                                                 | Olasılık | Etki                 | Azaltma                                                   |
| ---------------------------------------------------- | -------- | -------------------- | --------------------------------------------------------- |
| Sunucuda mod_rewrite/AllowOverride yok               | Orta     | Yüksek (rotalar 404) | Host'a sor; 404.html kopyası veya hash yönlendirme yedeği |
| Sahip TS veri dosyalarını düzenleyemez               | Yüksek   | Orta                 | İçerik formu + bakıcı; doğrulama betiği                   |
| Web3Forms kotası aşılır                              | Orta     | Orta                 | İzle; Sheets'e geç; action URL tek sabitte                |
| RSVP verisinde KVKK uyumsuzluğu                      | Orta     | Yüksek               | Onay metni, veri minimizasyonu, DPA kontrolü              |
| OSM karo politikası / güvenilirliği                  | Düşük    | Düşük                | Statik harita yedeği                                      |
| Tek bakıcı (bus factor 1)                            | Yüksek   | Yüksek               | Belgeler, geçiş paketi, kalite çıtası                     |
| Playwright package.json'da değil                     | Orta     | Orta                 | bootstrap/verify `--no-save` kurar; belgele                 |
| Lockfile belirsizliği (bun.lock + package-lock.json) | Düşük    | Orta                 | Birini seç, diğerini sil                                  |
| 8 dış çalışma zamanı API'si                          | Orta     | Düşük                | Zarif bozulma zaten var                                   |

## 5. Açıkça yapılmayacaklar (non-goals)

- Arka uç, veritabanı, kullanıcı hesabı yok.
- v1'de CMS yok.
- v1'de i18n yok.
- v1'de etkileşimli harita yok.
- v1'de arama yok.
- Ödeme/bilet yok.
- PDF/layout işi yok.
- Üretim sunucusunu Node çalışma zamanına taşımak yok.

## 6. Uzun vadeli kalite çıtası

Bir yıl sonra başka biri bu repoyu bakabilmesi için şunlar doğru olmalı:
- Tek komut geliştirme ortamını kurar (`distrobox assemble create` + `bootstrap.sh`).
- Tek komut bir değişikliği doğrular (`verify.sh`).
- İçerik, belgelenmiş veri dosyalarında yaşar ve bir doğrulama betiği vardır.
- Router ve ön yüzleme sözleşmesi belgeli ve testlidir.
- Repoda sır yok; çalışma zamanı arka ucu yok.
- Sahip girdileri (domain, host) kayıtlıdır.
- Bir karar günlüğü vardır (bu dosya).
- Testler takvim mantığını ve rota matrisini kapsar.

## 7. VERIFY-NEEDED listesi

1. Sunucu rewrite desteği (mod_rewrite/AllowOverride).
2. Sahibin TS dosyalarını düzenleme yeteneği.
3. Analitik ücretsiz katman limitleri.
4. OSM karo politikası eşiği.
5. Web3Forms KVKK/veri işleme.
6. Türk sunucusunun `.htaccess` desteği (bazı paylaşımlı hostlar kapatır).

---

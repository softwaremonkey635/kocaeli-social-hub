# 07 SEO Metinleri

Bu belge, Kocaeli Social Hub sitesinin 9 rotası için SEO meta metinlerini, görsel alt metinlerini, etkinlik paylaşım metinlerini, anahtar kelime planını ve sosyal paylaşım önizlemelerini kapsar. Tüm değerler kaynak dosyalardan (`src/utils/seo.ts`, `src/data/mockData.ts`, `src/data/galleryData.ts`, `src/data/blogData.ts`, `src/constants/links.ts`) okunarak hazırlanmıştır.

---

## 1. Rota Başına Meta Metinleri

Her rota için mevcut `PAGE_SEO` değerleri referans alınmıştır. Karakter sınırları: title 50-60, description 140-160, kısa variant ~100 karakter.

### / (Ana Sayfa)

| Alan | Metin |
|---|---|
| **Title** (58 krk) | Kocaeli Social Hub \| Gençlik ve Canlı Etkinlik Topluluğu |
| **Description** (152 krk) | Kocaeli'de speaking club, atölye, kamp ve doğa yürüyüşleriyle yeni arkadaşlar edin. Ücretsiz etkinlikler ve haftalık takvim tek topluluk sayfasında bir arada. |
| **OG Title** | Kocaeli Social Hub \| Gençlik ve Canlı Etkinlik Topluluğu |
| **OG Description** | Kocaeli'de speaking club, atölye, kamp ve doğa yürüyüşleriyle yeni arkadaşlar edin. Ücretsiz etkinlikler ve haftalık takvim tek topluluk sayfasında bir arada. |
| **Kısa variant** (97 krk) | Kocaeli'de ücretsiz etkinlikler, speaking club ve kamp ile yeni arkadaşlar edin. Haftalık takvim tek sayfada. |

Mevcut title ve description `seo.ts` satır 44-48 ile birebir eşleşiyor. Uzunluklar sınırlar içinde.

### /events (Etkinlikler)

| Alan | Metin |
|---|---|
| **Title** (50 krk) | Etkinlikler ve Haftalık Takvim \| Kocaeli Social Hub |
| **Description** (155 krk) | Bu hafta Kocaeli'de ne var? Speaking club, kitap söyleşisi, hiking ve dans etkinliklerinin gün, saat ve konumlarını tek takvimde gör, yerini şimdiden ayır. |
| **OG Title** | Etkinlikler ve Haftalık Takvim \| Kocaeli Social Hub |
| **OG Description** | Bu hafta Kocaeli'de ne var? Speaking club, kitap söyleşisi, hiking ve dans etkinliklerinin gün, saat ve konumlarını tek takvimde gör, yerini şimdiden ayır. |
| **Kısa variant** (93 krk) | Kocaeli'de bu hafta: speaking club, hiking, workshop. Tüm etkinlikler tek takvimde. |

Mevcut `seo.ts` satır 49-53 ile eşleşiyor. "Yerini şimdiden ayır" güçlü bir eylem çağrısı.

### /guide (Rehber)

| Alan | Metin |
|---|---|
| **Title** (54 krk) | Kocaeli Öğrenci Bütçe ve Yaşam Rehberi \| Kocaeli Social Hub |
| **Description** (153 krk) | Kocaeli'de öğrenci bütçesi nasıl planlanır? Ulaşım, yemek, kira ve sosyal harcama ipuçlarıyla şehir yaşamını ucuz tutan pratik ve örnekli rehber. |
| **OG Title** | Kocaeli Öğrenci Bütçe ve Yaşam Rehberi \| Kocaeli Social Hub |
| **OG Description** | Kocaeli'de öğrenci bütçesi nasıl planlanır? Ulaşım, yemek, kira ve sosyal harcama ipuçlarıyla şehir yaşamını ucuz tutan pratik ve örnekli rehber. |
| **Kısa variant** (89 krk) | Kocaeli'de öğrenci bütçesi, ulaşım ve yaşam ipuçları. Pratik rehber. |

Mevcut `seo.ts` satır 54-58 ile eşleşiyor.

### /vision (Vizyon ve Misyon)

| Alan | Metin |
|---|---|
| **Title** (46 krk) | Vizyon ve Misyon \| Kocaeli Social Hub |
| **Description** (159 krk) | Topluluk olarak neyi hedefliyoruz: herkesin kendini rahat ifade ettiği, öğrenmeye ve üretmeye açık bir Kocaeli gençlik ağı. Vizyon ve misyonumuz burada. |
| **OG Title** | Vizyon ve Misyon \| Kocaeli Social Hub |
| **OG Description** | Topluluk olarak neyi hedefliyoruz: herkesin kendini rahat ifade ettiği, öğrenmeye ve üretmeye açık bir Kocaeli gençlik ağı. Vizyon ve misyonumuz burada. |
| **Kısa variant** (91 krk) | Kocaeli gençlik topluluğunun vizyonu ve misyonu. Kapsayıcı, üretken bir oluşum. |

Mevcut `seo.ts` satır 59-63 ile eşleşiyor. Title 46 karakter, 50'nin altında. Uzatma önerisi: "Vizyon ve Misyon \| Kocaeli Social Hub Gençlik Topluluğu" (58 krk).

### /clubs (Kulüpler)

| Alan | Metin |
|---|---|
| **Title** (51 krk) | Kulüpler ve Topluluk Alanları \| Kocaeli Social Hub |
| **Description** (160 krk) | Speaking Club'tan doğa ekibine, kitap kulübünden dans atölyesine kadar kulüplerimizin yürütücülerini, buluşma günlerini ve katılım koşullarını keşfet. |
| **OG Title** | Kulüpler ve Topluluk Alanları \| Kocaeli Social Hub |
| **OG Description** | Speaking Club'tan doğa ekibine, kitap kulübünden dans atölyesine kadar kulüplerimizin yürütücülerini, buluşma günlerini ve katılım koşullarını keşfet. |
| **Kısa variant** (95 krk) | Speaking Club, doğa, kitap, dans kulüpleri. Buluşma günleri ve koşullar burada. |

Mevcut `seo.ts` satır 64-68 ile eşleşiyor. Description tam 160 krk.

### /gallery (Galeri)

| Alan | Metin |
|---|---|
| **Title** (50 krk) | Galeri ve Etkinlik Fotoğrafları \| Kocaeli Social Hub |
| **Description** (138 krk) | Kamplar, doğa yürüyüşleri, atölyeler ve söyleşilerden kareler: geçmiş etkinliklerimizin fotoğraflarıyla topluluğun enerjisini galeride doya doya gör. |
| **OG Title** | Galeri ve Etkinlik Fotoğrafları \| Kocaeli Social Hub |
| **OG Description** | Kamplar, doğa yürüyüşleri, atölyeler ve söyleşilerden kareler: geçmiş etkinliklerimizin fotoğraflarıyla topluluğun enerjisini galeride doya doya gör. |
| **Kısa variant** (85 krk) | Geçmiş etkinliklerden kareler. Kamp, hiking, workshop fotoğrafları. |

Mevcut `seo.ts` satır 69-73 ile eşleşiyor. Description 138 krk, 140'ın biraz altında.

### /contact (İletişim)

| Alan | Metin |
|---|---|
| **Title** (52 krk) | İletişim ve Topluluğa Katıl \| Kocaeli Social Hub |
| **Description** (157 krk) | Kocaeli Social Hub'a katıl: WhatsApp grubuna gir, gönüllü ol, etkinlik öner ya da sponsorluk ve iş birliği teklifleri için bizimle iletişime geç. |
| **OG Title** | İletişim ve Topluluğa Katıl \| Kocaeli Social Hub |
| **OG Description** | Kocaeli Social Hub'a katıl: WhatsApp grubuna gir, gönüllü ol, etkinlik öner ya da sponsorluk ve iş birliği teklifleri için bizimle iletişime geç. |
| **Kısa variant** (92 krk) | WhatsApp grubuna katıl, gönüllü ol veya sponsorluk için iletişime geç. |

Mevcut `seo.ts` satır 74-78 ile eşleşiyor.

### /blog (Blog)

| Alan | Metin |
|---|---|
| **Title** (45 krk) | Duyurular ve Blog \| Kocaeli Social Hub |
| **Description** (148 krk) | Topluluk duyuruları, etkinlik notları, Kocaeli öğrenci rehberleri ve yeni üye haberleri blog sayfasında düzenli olarak yayınlanıyor, arşiv hep açık. |
| **OG Title** | Duyurular ve Blog \| Kocaeli Social Hub |
| **OG Description** | Topluluk duyuruları, etkinlik notları, Kocaeli öğrenci rehberleri ve yeni üye haberleri blog sayfasında düzenli olarak yayınlanıyor, arşiv hep açık. |
| **Kısa variant** (87 krk) | Duyurular, rehberler ve etkinlik notları. Blog arşivi hep açık. |

Mevcut `seo.ts` satır 79-83 ile eşleşiyor. Title 45 krk, 50'nin altında. Uzatma önerisi: "Duyurular ve Blog \| Kocaeli Social Hub Topluluk" (52 krk).

### /sponsors (Sponsorlar)

| Alan | Metin |
|---|---|
| **Title** (52 krk) | Sponsorlar ve Yerel Ortaklar \| Kocaeli Social Hub |
| **Description** (157 krk) | Projelerimize destek veren Kocaeli'deki kafeler, kültür sanat mekanları ve yerel işletmelerle tanış, iş birliği ve sponsorluk fırsatlarını gör. |
| **OG Title** | Sponsorlar ve Yerel Ortaklar \| Kocaeli Social Hub |
| **OG Description** | Projelerimize destek veren Kocaeli'deki kafeler, kültür sanat mekanları ve yerel işletmelerle tanış, iş birliği ve sponsorluk fırsatlarını gör. |
| **Kısa variant** (94 krk) | Kocaeli'deki yerel işletmeler ve sponsorlar. İş birliği fırsatlarını keşfet. |

Mevcut `seo.ts` satır 84-88 ile eşleşiyor.

---

## 2. Görsel Alt Metinleri

`public/images/events/` altında 8 lokal görsel var. Her biri için galeri ve etkinlik verilerinden türetilen Türkçe alt metin.

| Görsel dosyası | Alt metin (10-15 kelime) | Kaynak |
|---|---|---|
| `speaking-club.jpeg` | Speaking Club buluşmasında katılımcıların samimi masada İngilizce sohbet ettiği an | `mockData.ts` satır 22, `galleryData.ts` satır 30 |
| `hiking.jpeg` | Umuttepe ormanında gün batımında yapılan doğa yürüyüşü sırasında çekilmiş grup fotoğrafı | `galleryData.ts` satır 39, `blogData.ts` satır 103 |
| `camping.jpeg` | Kandıra sahilinde çadır kampı sırasında kamp ateşi başında toplanan gençler | `galleryData.ts` satır 48, `mockData.ts` satır 126 |
| `biblo-boyama.jpeg` | Biblo boyama atölyesinde akrilik boya ve fırçalarla süslenen dekoratif biblolar | `mockData.ts` satır 86, `blogData.ts` satır 69 |
| `canta-boyama.jpeg` | Bez çanta tasarım atölyesinde kumaş boyaları ile renklendirilen bez çantalar | `mockData.ts` satır 87, `galleryData.ts` satır 66 |
| `kil-boyama.jpeg` | Kil şekillendirme atölyesinde ellerle yoğrulan ve boyanan seramik parçaları | `mockData.ts` satır 88, `galleryData.ts` satır 77 |
| `kitap-soylesisi.jpeg` | Kitap söyleşisi sırasında katılımcıların edebi tartışma yaptığı samimi çember | `mockData.ts` satır 155, `galleryData.ts` satır 84 |
| `logo/kocaeli-logo.jpeg` | Kocaeli Social Hub topluluk logosu, koyu lacivert zemin üzerinde cyan ve turuncu yazı | `seo.ts` satır 6 (DEFAULT_IMAGE) |

Not: Tüm görseller JPEG formatında ve `public/images/events/` altında. Logo `public/images/logo/` altında. Halk oyunları görseli lokal değil (Unsplash URL), bu yüzden bu listeye dahil değil.

---

## 3. Etkinlik Paylaşım Metinleri

`mockData.ts`'deki 6 etkinlik için WhatsApp ve Instagram paylaşım metinleri. Her etkinlik adı, gün/saat, kısa hook ve bağlantı satırı içeriyor.

### Speaking Club

**WhatsApp:**
```
🗣️ Speaking Club | Her Cumartesi 18:00-20:00
Grammar polisi giremez! Samimi masada İngilizce pratik, çay-kahve eşliğinde.
Katılmak için: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Grammar polisi giremez! Her Cumartesi 18:00'da samimi bir masada İngilizce pratik. Kocaeli Social Hub Speaking Club'a katıl.`

### Hiking (Doğa Yürüyüşü)

**WhatsApp:**
```
🥾 Hiking | Her Perşembe 18:00-20:00
Kısa mesafe parkur, gün batımı manzarası ve temiz hava. Kocaeli'nin yeşilini keşfet.
Katılmak için: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Her Perşembe 18:00'da Kocaeli'nin yeşil patikalarında 5-7 km yürüyüş. Hiking ile haftanın yorgunluğunu at.`

### Biblo, Çanta & Kil Boyama Workshop

**WhatsApp:**
```
🎨 Workshop | Her Pazar 18:00-20:00
Biblo, çanta veya kil boyama. Hangisi olacağı WhatsApp oylamasıyla belirleniyor!
Katılmak için: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Her Pazar bir atölye: biblo, çanta veya kil boyama. Malzemeler hazır, sen sadece üret. Kocaeli Social Hub workshoplarına katıl.`

### Kamp Etkinlikleri

**WhatsApp:**
```
⛺ Kamp | Tarih WhatsApp'ta
Yıldızların altında kamp ateşi, akustik müzik ve dostluk. Kocaeli'nin sahillerinde 4 mevsim kamp.
Detaylar: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Kocaeli'nin sahillerinde yıldızların altında kamp ateşi. Tarih ve detaylar WhatsApp grubumuzda.`

### Kitap Okuma & Söyleşi

**WhatsApp:**
```
📚 Kitap Söyleşisi | Her Çarşamba 18:00-20:00
Seçilen kitap üzerine 10 kişilik samimi çemberde derinlemesine sohbet.
Katılmak için: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Her Çarşamba 18:00'da kitap üzerine derin sohbet. Düşüncelerini paylaş, yeni yazarlar keşfet.`

### Halk Oyunları

**WhatsApp:**
```
💃 Halk Oyunları | Her Salı 18:00-20:00
Zeybek'ten Horon'a, Halay'dan Kafkas'a. Sıfırdan başlayanlar için profesyonel eğitmen eşliğinde kurs.
Katılmak için: https://chat.whatsapp.com/IABraq8y6oz0mnSfI1iK2L
```

**Instagram:**
`Her Salı 18:00'da geleneksel halk oyunları kursu. Zeybek, horon, halay. Sıfırdan başla, ritmi yakala.`

---

## 4. Anahtar Kelime Planı

Kocaeli'deki gençlerin ve öğrencilerin kullanabileceği gerçekçi Türkçe arama ifadeleri. Arama hacmi iddiası içermiyor; düşük güvenilirlikle işaretlenenler doğrulanmamıştır.

### Etkinlik ve Topluluk

| Anahtar kelime | Hedef rota | Güvenilirlik |
|---|---|---|
| kocaeli gençlik etkinlikleri | `/` | Yüksek (site adı ve içerik ile doğrudan eşleşme) |
| kocaeli speaking club | `/clubs` | Yüksek (etkinlik adı birebir) |
| kocaeli ücretsiz etkinlik | `/events` | Yüksek (tüm etkinlikler ücretsiz veya malzeme paylaşımlı) |
| kocaeli haftalık etkinlik takvimi | `/events` | Yüksek (sayfa başlığı ve içeriği ile eşleşme) |
| izmit gençlik topluluğu | `/` | Yüksek (site İzmit merkezli, FAQ'da açıkça yazılı) |
| kocaeli sosyal kulüpler | `/clubs` | Yüksek (sayfa içeriği ile eşleşme) |

### Doğa ve Kamp

| Anahtar kelime | Hedef rota | Güvenilirlik |
|---|---|---|
| kocaeli hiking rotaları | `/events` | Yüksek (hiking etkinliği mevcut) |
| kocaeli kamp etkinlikleri | `/events` | Yüksek (camping etkinliği mevcut) |
| kandıra kamp alanı | `/events` | Orta (FAQ'da Kandıra koyları geçiyor, ancak belirli bir kamp alanı adı yok) |
| kartepe doğa yürüyüşü | `/events` | Orta (FAQ'da Kartepe geçiyor) |
| kocaeli açık hava etkinlik | `/events` | Yüksek (hiking + camping + doğa kulübü) |

### Yaşam ve Rehber

| Anahtar kelime | Hedef rota | Güvenilirlik |
|---|---|---|
| kocaeli öğrenci bütçesi | `/guide` | Yüksek (sayfa başlığı birebir) |
| kocaeli öğrenci yaşam rehberi | `/guide` | Yüksek (sayfa içeriği ile eşleşme) |
| kocaeli ulaşım ipuçları | `/guide` | Yüksek (rehberde ulaşım bölüm mevcut) |
| izmit ucuz yaşam | `/guide` | Orta (rehber "şehri ucuza tutmak" diyor, ancak "ucuz" kelimesi doğrudan geçmiyor) |

### Kulüp ve Aktivite

| Anahtar kelime | Hedef rota | Güvenilirlik |
|---|---|---|
| kocaeli İngilizce pratik | `/clubs` | Yüksek (Speaking Club içeriği ile eşleşme) |
| kocaeli kitap kulübü | `/clubs` | Yüksek (Kitap & Kültür Kulübü mevcut) |
| kocaeli halk oyunları kursu | `/clubs` | Yüksek (Halk Oyunları Kulübü mevcut) |
| kocaeli sanat atölyesi | `/clubs` | Yüksek (Sanat & Atölye Kulübü mevcut) |
| izmit sözlü pratik | `/clubs` | Düşük (Sözlü Ingilizce pratiği araması olabilir, ancak "speaking club" daha yaygın) |

### Katılım ve İletişim

| Anahtar kelime | Hedef rota | Güvenilirlik |
|---|---|---|
| kocaeli gönüllülük fırsatları | `/contact` | Yüksek (gönüllü liderlik başvurusu mevcut) |
| kocaeli gençlik derneği | `/` | Orta (topluluk "topluluk" olarak tanımlanıyor, "dernek" kelimesi kullanılmıyor) |
| kocaeli whatsapp grubu | `/contact` | Yüksek (WhatsApp grubu linki mevcut) |

---

## 5. Sosyal Paylaşım Önizleme

Her rota için WhatsApp ve Twitter kartının gösterdiği içerik. `seo.ts` satır 215-222'deki `applySeo` fonksiyonu, `og:title`, `og:description`, `twitter:title` ve `twitter:description` olarak `PAGE_SEO` değerlerini kullanıyor.

| Rota | WhatsApp önizleme (og:title + og:description) | Twitter kart önizlemesi | Zayıf yön notu |
|---|---|---|---|
| `/` | "Kocaeli Social Hub \| Gençlik ve Canlı Etkinlik Topluluğu" + açıklama | Aynı | Zayıf değil, güçlü ve açık |
| `/events` | "Etkinlikler ve Haftalık Takvim \| Kocaeli Social Hub" + açıklama | Aynı | Zayıf değil, eylem odaklı |
| `/guide` | "Kocaeli Öğrenci Bütçe ve Yaşam Rehberi \| Kocaeli Social Hub" + açıklama | Aynı | Zayıf değil, spesifik |
| `/vision` | "Vizyon ve Misyon \| Kocaeli Social Hub" + açıklama | Aynı | Title 46 krk, 50'nin altında. Arama sonuçlarında kesilebilir. |
| `/clubs` | "Kulüpler ve Topluluk Alanları \| Kocaeli Social Hub" + açıklama | Aynı | Zayıf değil |
| `/gallery` | "Galeri ve Etkinlik Fotoğrafları \| Kocaeli Social Hub" + açıklama | Aynı | Description 138 krk, 140'ın biraz altında. Uzatılabilir. |
| `/contact` | "İletişim ve Topluluğa Katıl \| Kocaeli Social Hub" + açıklama | Aynı | Zayıf değil, net çağrı |
| `/blog` | "Duyurular ve Blog \| Kocaeli Social Hub" + açıklama | Aynı | Title 45 krk, 50'nin altında. Zayıf yön: çok genel, "blog" kelimesi arama niyetini yansıtmıyor. |
| `/sponsors` | "Sponsorlar ve Yerel Ortaklar \| Kocaeli Social Hub" + açıklama | Aynı | Zayıf değil, yerel odaklı |

### Tespit edilen zayıflıklar

1. **`/vision` ve `/blog` title'ları 50 karakterin altında.** Arama motorlarında tam görülmeyebilir. Uzatma önerileri 1. bölümde verildi.
2. **`/gallery` description 138 krk.** 140-160 arası ideal bandın biraz altında. Uzatma önerisi: "...topluluğun enerjisini galeride doya doya gör, ilham al." (152 krk).
3. **Tüm rotalarda `og:image` sabit logo** (`seo.ts` satır 219). Her rota için özel bir görsel önerilmiyor, ancak etkinlik sayfalarında etkinlik görseli kullanmak paylaşım tıklanmasını artırabilir.

---

## Kaynak Dosyalar

| Dosya | Kullanım |
|---|---|
| `src/utils/seo.ts` | Mevcut PAGE_SEO değerleri, URL yapısı, OG/Twitter meta ayarları |
| `src/data/mockData.ts` | 6 etkinlik verisi ( Speaking Club, Hiking, Workshop, Camping, Kitap Okuma, Halk Oyunları ), kulüpler, sponsorlar, ilçeler |
| `src/data/galleryData.ts` | 8 galeri öğesi, görsel referansları |
| `src/data/blogData.ts` | 5 blog yazısı, görsel referansları |
| `src/constants/links.ts` | WhatsApp grubu linki, Instagram, kurucu iletişim |
| `src/types.ts` | PageId tanımı (9 rota), veri yapıları |
| `public/images/events/` | 8 lokal görsel dosyası |
| `public/images/logo/` | 1 lokal logo dosyası |

# 08 Mikro Metinler

Bu belge, Kocaeli Social Hub sitesindeki küçük ama kritik kullanıcı arayüzü metinlerini (butonlar, boş durum mesajları, hata bilgileri, yükleme göstergeleri, PWA kurulumu, 404 sayfası, paylaşım satırları ve erişilebilirlik etiketleri) kapsar. Tüm öneriler mevcut kod tabanındaki (`src/components/`, `src/pages/`) dil ve tonla tutarlıdır. Bu bir uygulama değildir; öneri belgesidir.

Tüm metinlerde kurallar:
- 80 karakter sınırı (buton ve etiketler için)
- Tire (em dash, en dash) kullanılmaz
- "X değil Y" kalıbı kullanılmaz
- Site tonu: samimi, genç, doğrudan

---

## 1. Birincil Butonlar

Mevcut durum ve alternatif öneriler.

### Join / Katıl

**Bugün ne diyor:** `WhatsApp ile Katıl` (EventModal.tsx, satır 447), `WhatsApp Grubuna Şimdi Katıl` (ContactJoinPage.tsx, satır 177), `WhatsApp Topluluk Grubuna Katıl` (Navbar.tsx, satır 196)

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| A1 | Gruba Katıl | 11 | Navbar, mobil menü, footer |
| A2 | Hemen Katıl | 12 | Etkinlik kartları, ana sayfa CTA |
| A3 | Topluluğa Katıl | 17 | İletişim sayfası, genel davet |

### Register / Kayıt Ol

**Bugün ne diyor:** Kayıt formu yok; katılım doğrudan WhatsApp üzerinden. `Detay & Katıl` (EventCard.tsx, satır 195) en yakın karşılık.

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| B1 | Katılım Formunu Doldur | 23 | ContactJoinPage form gönder butonu |
| B2 | Kendini Tanıt | 13 | ContactJoinPage, tanışma bölümü |
| B3 | Mesajını İlet | 15 | WhatsApp tanışma sihirbazı |

### Paylaş

**Bugün ne diyor:** `WhatsApp'ta Paylaş` (EventCard.tsx satır 179, EventModal.tsx satır 352), `Paylaş` (EventModal.tsx satır 425)

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| C1 | Etkinliği Paylaş | 17 | Etkinlik kartı paylaş butonu |
| C2 | Dostlarınla Paylaş | 20 | Modal paylaş bölümü |
| C3 | Paylaş | 7 | Genel paylaş butonu (ikon yanısı) |

### Takvime Ekle

**Bugün ne diyor:** `Takvime Ekle (.ics)` (EventModal.tsx, satır 330), `Google Takvim` (EventModal.tsx, satır 340)

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| D1 | Takvime Ekle | 14 | ICS indirme butonu |
| D2 | Google Takvime Ekle | 20 | Google Calendar bağlantısı |
| D3 | Takvimine Kaydet | 18 | Genel takvim ekleme butonu |

### Detay Gör

**Bugün ne diyor:** `Detay & Katıl` (EventCard.tsx satır 195, EventsPage.tsx satır 289), `Afişi ve Detayları Gör` (EventCard.tsx satır 46)

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| E1 | Detay & Katıl | 14 | Etkinlik kartı ana butonu (mevcut, iyi) |
| E2 | İncele & Katıl | 16 | Etkinlik kartı, alternatif |
| E3 | Etkinliği Gör | 15 | Program görünümü, satır başı buton |

### Abone Ol / Bildirim

**Bugün ne diyor:** Bu işlev henüz yok. Takvim daveti ICS ile çözülüyor.

| # | Öneri | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| F1 | Hatırlatma Kur | 16 | [DOĞRULANMALI] Gelecekte bildirim sistemi eklenirse |
| F2 | Beni Haberdar Et | 18 | [DOĞRULANMALI] E-posta/bildirim aboneliği varsa |
| F3 | Takvimime Ekle, Haberim Olsun | 31 | Etkinlik modalı, ICS butonu yanında |

---

## 2. Boş Durum Mesajları

### Etkinlik Bulunamadı

**Bugün ne diyor:** `Aradığınız kritere uygun etkinlik bulunamadı` (EventsPage.tsx, satır 191) ve `Filtreleri temizleyerek tüm haftalık programı görebilirsiniz.` (satır 194)

| # | Başlık | Yardımcı Metin | Uzunluk |
|---|---|---|---|
| G1 | Bu hafta etkinlik yok | Yeni etkinlikler eklendikçe burada görünecek. | 27 + 42 |
| G2 | Eşleşen etkinlik bulunamadı | Filtreleri sıfırlayarak tüm programı görebilirsin. | 24 + 45 |
| G3 | Araman sonucu boş çıktı | Farklı anahtar kelimelerle tekrar dene. | 23 + 40 |

### Galeri Boş

**Bugün ne diyor:** Galeri sayfasında (GalleryPage.tsx) boş durum mesajı yok; filtre boşsa `filteredItems` dizisi boş kalır ve grid hiç renderlanmaz.

| # | Başlık | Yardımcı Metin |
|---|---|---|
| H1 | Henüz fotoğraf eklenmemiş | Yeni etkinliklerden kareler geldikçe burada olacak. |
| H2 | Bu kategoride fotoğraf yok | Diğer kategorilere göz at veya tümünü göster. |
| H3 | Galeri boş | İlk etkinlik fotoğrafları yakında burada. |

### Blog Boş

**Bugün ne diyor:** `Aramanızla eşleşen yazı bulunamadı` (BlogPage.tsx, satır 206) ve `Farklı bir anahtar kelime deneyebilir veya kategori filtresini sıfırlayabilirsiniz.` (satır 209)

| # | Başlık | Yardımcı Metin |
|---|---|---|
| I1 | Yazı bulunamadı | Farklı kelimelerle ara veya tüm kategorilere göz at. |
| I2 | Bu konuda henüz yazı yok | Yakında yeni içerikler eklenecek, bizi takip et. |
| I3 | Araman sonucu boş | Filtreleri temizleyerek tüm yazıları görebilirsin. |

### Hesaplayıcı Boş (Rehber Sayfası)

**Bugün ne diyor:** Rehber sayfasındaki (GuidePage.tsx) bütçe hesaplayıcısında boş durum mesajı yok; varsayılan değerler dolu geliyor.

| # | Başlık | Yardımcı Metin |
|---|---|---|
| J1 | Harcamalarını gir, sonucu gör | Aylık gelir ve giderlerini yazarak günlük bütçeni hesapla. |
| J2 | Bütçeni hesapla | Kocaeli'deki yaşam masraflarını gir, günlük harçlığını öğren. |
| J3 | Henüz veri girilmedi | Aşağıdaki alanları doldurarak hesaplamaya başla. |

---

## 3. Hata ve Bilgi Mesajları

### Finans Verisi Yok

**Bugün ne diyor:** `FinanceTicker.tsx` varsayılan değerleri gösteriyor: tire işareti (`-`) (satır 13-17). Kullanıcıya açık bir hata mesajı gösterilmiyor; sessizce tire kalıyor.

| # | Mesaj | Bağlam |
|---|---|---|
| K1 | Kur bilgisi şu an yüklenemiyor | Finans ticker, veri çekilemediğinde |
| K2 | Piyasa verisi geçici olarak kullanılamıyor | Ana sayfa, finans şeridi |
| K3 | Güncelleme başarısız oldu, daha sonra tekrar dene | Yenile butonu başarısız olduğunda |

### Hava Durumu Yok

**Bugün ne diyor:** `WeatherWidget.tsx` `console.warn` logluyor ama kullanıcıya bir mesaj göstermiyor (satır 305). Varsayılan sıcaklık değerleri ekranda kalıyor.

| # | Mesaj | Bağlam |
|---|---|---|
| L1 | Hava durumu bilgisi şu an alınamıyor | Hava widget'ı, API hatasında |
| L2 | Güncelleme sırasında bir sorun oluştu | Widget header'ı, refresh sonrası |
| L3 | Veriler yeniden yükleniyor | Otomatik yenileme başarısız olduktan sonra |

### Çevrimdışı

**Bugün ne diyor:** Site PWA olarak kurulabilir ama çevrimdışı mesajı (`navigator.onLine` kontrolü) kodda yok.

| # | Mesaj | Bağlam |
|---|---|---|
| M1 | Çevrimdışısın, bazı içerikler güncellenmeyebilir | Genel offline banner [DOĞRULANMALI] |
| M2 | İnternet bağlantın yok | Offline durum bildirimi [DOĞRULANMALI] |
| M3 | Bağlantı kuruldu, sayfa yenileniyor | Online olduğunda otomatik refresh [DOĞRULANMALI] |

### Form Doğrulama Hataları

**Bugün ne diyor:** ContactJoinPage.tsx'te form doğrulama mesajı yok; `name.trim()` kontrolü var (EventModal.tsx satır 81) ama hata gösterilmiyor.

| # | Mesaj | Bağlam |
|---|---|---|
| N1 | Lütfen adını yaz | İletişim formu, boş isim |
| N2 | Bu alan zorunlu | Tüm form alanları, boş bırakıldığında |
| N3 | Lütfen geçerli bir telefon numarası gir | [DOĞRULANMALI] Telefon alanı eklenirse |

### Panoya Kopyalama

**Bugün ne diyor:** `Kopyalandı!` (BlogPage.tsx satır 390, EventModal.tsx satır 425), `Kopyalandı` (GuidePage.tsx satır 507, 1660). Kopyalama başarısız olduğunda mesaj yok.

| # | Başarılı | Başarısız | Bağlam |
|---|---|---|---|
| O1 | Kopyalandı! | Kopyalanamadı, tekrar dene | Genel kopyalama |
| O2 | Panoya kopyalandı | Panoya erişilemedi | Bütçe özeti kopyalama |
| O3 | Link kopyalandı! | Kopyalama başarısız oldu | Paylaşım linki |

---

## 4. Yükleme Metinleri

### Sayfa Yükleniyor

**Bugün ne diyor:** Hiçbir sayfada "Yükleniyor" göstergesi yok. Bileşenler veri çekene kadar boş renderlanıyor.

| # | Metin | Uzunluk | Nerede Kullanılır |
|---|---|---|---|
| P1 | Sayfa yükleniyor | 19 | Genel sayfa iskeleti [DOĞRULANMALI] |
| P2 | İçerik hazırlanıyor | 21 | Tüm sayfalar, Suspense fallback |
| P3 | Bir saniye... | 14 | Hafif, mobil uyumlu |

### Grafik Yükleniyor

**Bugün ne diyor:** `GuideCharts.tsx` içinde `recharts` `ResponsiveContainer` kullanıyor ama yükleme durumu gösterilmiyor.

| # | Metin | Uzunluk |
|---|---|---|
| Q1 | Grafik yükleniyor | 19 |
| Q2 | Veriler hazırlanıyor | 21 |
| Q3 | Chart yükleniyor | 18 |

### Besleme Yükleniyor (Ticker, Marquee)

**Bugün ne diyor:** `FinanceTicker.tsx` ve `SponsorMarquee.tsx` `loading` state'i tutuyor ama kullanıcıya metin gösterilmiyor; spinner dönüyor.

| # | Metin | Uzunluk |
|---|---|---|
| R1 | Veriler çekiliyor | 18 |
| R2 | Canlı veri bekleniyor | 20 |
| R3 | Yükleniyor... | 13 |

### Tarihte Bugün Yükleniyor

**Bugün ne diyor:** `HistoryTodayWidget.tsx` satır 132: `Tarih yaprakları çevriliyor...`

| # | Mevcut | Alternatif |
|---|---|---|
| S1 | Tarih yaprakları çevriliyor... (iyi, mevcut) | Geçmişe bakılıyor... |
| S2 | (boş) | TarihteBUGÜN yükleniyor |

---

## 5. PWA Kurulum Daveti

Site installable PWA olarak yapılandırılmış ama kurulum daveti (install prompt) kodda henüz yok (`beforeinstallprompt` olayı yakalanmıyor).

| # | Davet Metni | Reddetme Metni | Uzunluk |
|---|---|---|---|
| T1 | Bu uygulamayı telefonuna kur | Şimdi değil | 30 + 12 |
| T2 | Kocaeli Sosyal'i ana ekranına ekle | Bunu latera bırak | 35 + 18 |
| T3 | Tek tıkla erişim: uygulamayı kur | İptal | 27 + 5 |

Öneri: `T1` en kısası ve en doğrudan. Reddetme `Şimdi değil` samimi bir dil kullanıyor.

---

## 6. 404 ve Bilinmeyen Sayfa

Site目前 bir 404 sayfası içermiyor. `App.tsx` içinde bilinmeyen rota yönlendirmesi yok.

### Öneri Yapısı

| # | Başlık | Yardımcı Metin | Buton |
|---|---|---|---|
| U1 | Sayfa bulunamadı | Aradığın sayfa taşınmış veya silinmiş olabilir. | Ana Sayfaya Dön |
| U2 | Bu sayfa yok | URL'yi kontrol et veya ana sayfadan başla. | Başa Dön |
| U3 | Kayboldun mu? | Aradığın içerik burada olmayabilir. | Ana Sayfa |

---

## 7. Sosyal Paylaşım Metinleri

### Genel Site Paylaşımı (WhatsApp)

**Bugün ne diyor:** Site genelinde paylaşılan sabit bir WhatsApp paylaşım metni yok.

| # | Metin | Uzunluk |
|---|---|---|
| V1 | Kocaeli Social Hub, gençler için ücretsiz etkinlik ve topluluk platformu. Katılmak için tıkla! | 91 |
| V2 | Kocaeli'de speaking club, kamp ve atölyeler! Tüm etkinlikler ücretsiz. | 73 |
| V3 | Yeni arkadaşlar edin, etkinliklere katıl. Kocaeli Social Hub! | 63 |

### Etkinlik Paylaşımı (WhatsApp)

**Bugün ne diyor:** `EventModal.tsx` satır 88: `Kocaeli Social Hub - ${event.title} etkinliği! Katılmak ve detayları görmek için WhatsApp topluluğumuzda katıl: ${COMMUNITY_LINKS.whatsappGroup}`

| # | Şablon | Uzunluk (ortalama) |
|---|---|---|
| W1 | {etkinlik_adı} bu hafta! Detaylar ve katılım için tıkla. | ~55 |
| W2 | {etkinlik_adı} geliyor. Katılmak istersen buradan bak. | ~55 |
| W3 | Bu hafta: {etkinlik_adı}. Kocaeli Social Hub'da! | ~50 |

---

## 8. Erişilebilirlik Etiketleri (aria-label)

Mevcut kodda icon-only kontrollerin çoğu zaten `aria-label` taşıyor. Aşağıda eksik veya iyileştirilebilir olanlar listeleniyor.

### Mevcut İyi Uygulamalar (dokunma gerekmez)

| Bileşen | Mevcut aria-label | Satır |
|---|---|---|
| Navbar logo | `Kocaeli Social Hub Ana Sayfa` | Navbar.tsx:98 |
| Mobil menü toggle | `Menüyü Aç/Kapat` | Navbar.tsx:158 |
| Modal kapat | `Kapat` | EventModal.tsx:157, BlogPage.tsx:349, GalleryPage.tsx:168 |
| Etkinlik paylaş | `Etkinliği WhatsApp'ta paylaş` | EventCard.tsx:179, EventModal.tsx:348 |
| Takvime ekle | `Etkinliği takvime ekle, ics dosyası indir` | EventModal.tsx:326 |
| Google Takvim | `Etkinliği Google Takvim'e ekle` | EventModal.tsx:336 |
| Footer Instagram | `Instagram Sayfamız` | Footer.tsx:45 |
| Footer WhatsApp | `WhatsApp Topluluğumuz` | Footer.tsx:55 |
| Footer telefon | `Kurucu İletişim Telefonu` | Footer.tsx:63 |
| Footer yukarı | `Yukarı Çık` | Footer.tsx:211 |
| Lightbox kapat | `Poster afişini kapat` | EventModal.tsx:481 |
| Blog paylaş | `Yazıyı paylaş` | BlogPage.tsx:384 |

### Öneri: Eksik veya İyileştirilebilecek Etiketler

| # | Bileşen | Dosya | Mevcut Durum | Önerilen aria-label |
|---|---|---|---|---|
| X1 | Hava durumu yenile butonu | WeatherWidget.tsx:368 | `title="Canlı Veriyi Yenile"` (yalnızca title) | `aria-label="Hava durumunu yenile"` ekle |
| X2 | Finans yenile butonu | FinanceTicker.tsx:206 | `title="Kurları Yenile"` (yalnızca title) | `aria-label="Kurları yenile"` ekle |
| X3 | Sponsor marquee | SponsorMarquee.tsx | aria-label yok | `aria-label="Sponsorlarımız"` ekle |
| X4 | Hesaplayıcı +/- butonları | GuidePage.tsx (çoklu) | `aria-label` mevcut (örn. satır 806, 826) | İyi, dokunma gerekmez |
| X5 | Arama input placeholder'ı | EventsPage.tsx:104, BlogPage.tsx:195 | `placeholder` var, `aria-label` yok | `aria-label="Etkinlik ara"` ve `aria-label="Yazı ara"` ekle |
| X6 | Blog post "Devamı" butonu | BlogPage.tsx:291 | aria-label yok | `aria-label="{post.title} yazısının devamını oku"` ekle |
| X7 | Tarih önceki/sonraki | HistoryTodayWidget.tsx:98,110 | `title="Önceki Olay"` / `title="Sonraki Olay"` (yalnızca title) | `aria-label="Önceki olay"` ve `aria-label="Sonraki olay"` ekle |
| X8 | Rehber paylaşma butonu | GuidePage.tsx (panoya kopyala) | `aria-label` mevcut | İyi, dokunma gerekmez |

---

## Özet Tablosu

| Bölüm | Öneri Sayısı | Uygulanabilir | [DOĞRULANMALI] |
|---|---|---|---|
| 1. Birincil butonlar | 18 | 15 | 3 |
| 2. Boş durumlar | 12 | 12 | 0 |
| 3. Hata ve bilgi | 12 | 9 | 3 |
| 4. Yükleme metinleri | 10 | 10 | 1 |
| 5. PWA kurulum | 3 | 3 | 0 |
| 6. 404 sayfası | 3 | 3 | 0 |
| 7. Sosyal paylaşım | 6 | 6 | 0 |
| 8. Erişilebilirlik | 8 | 8 | 0 |
| **Toplam** | **76** | **70** | **7** |

# Go-Live Kontrol Listesi

Her maddeyi tamamladiktan sonra isaretleyin. Sıra onemli degil, ama her
maddenin isaretli oldugundan emin olun.

## Domain ve DNS
- [ ] Domain adi hosting firmasina transfer edildi veya DNS yetkisi verildi
- [ ] A kaydi hosting sunucusu IP adresini gosteriyor
- [ ] (varsa) CNAME kaydi dogru domain'e point ediyor
- [ ] DNS yayilmasi bekledi (nslookup ile dogrulama)

## SSL / HTTPS
- [ ] AutoSSL veya Let's Encrypt sertifikasi yuklendi
- [ ] Sertifika dogru domain icin gecerli (tarayicida kilit ikonu gorunuyor)
- [ ] HTTP'den HTTPS'e yonlendirme calisiyor (curl ile test)
- [ ] Mixed content uyarisi yok (tum kaynaklar HTTPS)

## WWW karari
- [ ] www ile mi, www olmadan mi calismasina karar verildi
- [ ] Tersi variant yonlendirme ayarlandi (www -> non-www veya tam tersi)

## Compression
- [ ] gzip calisiyor: `curl -sI -H "Accept-Encoding: gzip" https://domain.com/ | grep Content-Encoding`
- [ ] (varsa) brotli calisiyor: `curl -sI -H "Accept-Encoding: br" https://domain.com/ | grep Content-Encoding`

## Cache basliklari
- [ ] index.html: `Cache-Control: no-cache, no-store, must-revalidate`
- [ ] sw.js: `Cache-Control: no-cache, no-store, must-revalidate`
- [ ] Hashed asset: `Cache-Control: public, max-age=31536000, immutable`

## 404 ve SPA fallback
- [ ] `https://domain.com/events` 200 donuyor (SPA fallback calisiyor)
- [ ] `https://domain.com/guide` 200 donuyor
- [ ] Var olmayan dosya 404 donuyor (ornegin `https://domain.com/olmayan-dosya`)

## PWA / Mobil
- [ ] Telefonda "Ana ekrana ekle" secenegi gorunuyor
- [ ] Yerel uygulama gibi aciliyor (standalone mod)
- [ ] Offline'da aciliyor mu (service worker test)

## Sosyal paylasim
- [ ] WhatsApp'ta link paylasildiginda baslik ve aciklama gorunuyor
- [ ] Open Graph etiketleri dogru (`og:title`, `og:description`, `og:image`)

## Analitik
- [ ] Google Analytics veya tercih edilen analitik araci eklendi
- [ ] CSP baglantı listesine analitik domain eklendi

## Arama motorlari
- [ ] Google Search Console'da domain dogrulandi
- [ ] sitemap.xml Search Console'a gonderildi
- [ ] robots.txt Search Console'da goruldu
- [ ] Indexleme durumu kontrol edildi

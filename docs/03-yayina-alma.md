# Yayina Alma Rehberi

Bir degisikligin canli siteye nasil yansitilacagi.

## 5 Adimda Yayina Alma

### Adim 1: Degisiklikleri Kaydedin

Degistirdiginiz dosyalari kaydedin. Emin olmak icin derleme yapin:

```sh
npm run build
```

`dist/` klasoru guncellenmeli. Hata alirsaniz once hatalari duzeltin.

### Adim 2: Derleme Klasorunu Kontrol Edin

```sh
ls -la dist/
```

`index.html`, `assets/` ve `images/` klasorlerini gormelisiniz. Eger `dist/` bossa veya `index.html` yoksa build basarisiz olmustur, hatayi duzeltin.

### Adim 3: Dosyalari Sunucuya Yukleyin

`dist/` klasorundeki TUM dosyalari sunucudaki site dizinine yukleyin. Bu islem genellikle FTP veya SSH ile yapilir.

Onemli: `.htaccess` dosyasini da yuklemeyi unutmayin. Bu dosya `deploy/` klasorunde bulunur ve sunucunun SPA (tek sayfa uygulama) calistirmasi icin gereklidir.

Detayli sunucu kurulumu icin `deploy/` klasorundeki dosyalara bakin:
- `deploy/.htaccess` - Apache / LiteSpeed SPA ve cache kurallari
- `deploy/nginx.conf.snippet` - Nginx sunucu ayarlari
- `deploy/litespeed-notes.md` - LiteSpeed ozel notlari

### Adim 4: Tarayicida Kontrol Edin

Canli siteyi tarayicida acin ve su denemeleri yapin:

1. Ana sayfa yukleniyor mu?
2. Etkinlikler sayfasinda veriler gorunuyor mu?
3. Telefon ve WhatsApp linkleri calisiyor mu?
4. Galeri fotograflari gorunuyor mu?
5. Butece rehber sayfasindaki sayilar dogru mu?

Eski versiyonu goruyorsaniz, tarayicinizi `Ctrl + Shift + R` (Windows/Linux) veya `Cmd + Shift + R` (Mac) ile sert yenileyin. Bu islem tarayici onbelleegini temizler.

### Adim 5: Service Worker Guncellemesi

Site PWA (Progressive Web App) desteklidir. Yeni bir build yuklendiginde tarayicilar eski versiyonu onbellekten gosterebilir. Kullanicilarin yeni versiyonu gorebilmesi icin:

1. Tarayicida siteyi acin
2. `Ctrl + Shift + R` ile sert yenileyin
3. Eger hala eski versiyon gorunuyorsa, tarayici gelistirici araclarindan (F12) "Application > Storage" bolumunden site verilerini temizleyin

## Onemli Notlar

- Her build islemi benzersiz dosya isimleri uretir (`index-ABC123.js` gibi). Bu sayede eski dosyalar carpismaz.
- `.htaccess` dosyasi SPA routing icin zorunludur. Yuklenmezse sayfalar arasi gecisler calismaz.
- Eger sunucuda LiteSpeed Cache aktifse, `deploy/litespeed-notes.md` dosyasindaki talimatleri izleyin.

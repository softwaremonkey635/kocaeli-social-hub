# Sorun Giderme Tablosu

| Belirti | Olasi neden | Cozum |
|---|---|---|
| Beyaz bos sayfa | `index.html` yuklenmiyor veya `dist/` tam yuklenmemis | `public_html/index.html`'in varligini kontrol edin. Dosya boyutu sifir mi? Yeniden yukleyin. |
| Beyaz bos sayfa (2) | CSP hatasi: script Engelendi | Tarayici konsolunu acin. `Refused to load the script` uyarisi varsa, CSP `script-src`'e gerekli domaini ekleyin. |
| Hashed asset 404 | `assets/` klasoru yuklenmemis veya dosya adi degismis | `dist/assets/` icindeki dosyalari kontrol edin. Build sonrasi dosya adlari degisir; eski adlari kullanmayin. |
| Temiz URL 404 | `.htaccess` yuklenmemis veya `RewriteEngine` kapali | `.htaccess` dosyasini `public_html/`'e yukleyin. `RewriteEngine On` satirini kontrol edin. Eger host Apache degilse (nginx), `.htaccess` calismaz; `nginx.conf.snippet` kullanin. |
| Temiz URL 404 (2) | `RewriteBase` yanlis | Eger site domain kokunde degilse (ornegin `/hub/` altinda), `.htaccess` icinde `RewriteBase /hub/` yazin. |
| Service worker eski icerik gosteriyor | SW cache suresi dolmamis veya yeni SW kayit olmamis | Tarayici uygulama verisini temizleyin. `sw.js` icinde `skipWaiting()` ve `clients.claim()` kullanildigindan emin olun. Yeni deploy sonrasi tarayiciyi yeniden yukleyin. |
| FX / hava durumu yuklenmiyor (CORS) | CSP `connect-src` listesinde API domaini yok | `.htaccess`'teki CSP bloguna API domainini ekleyin. Ornegin `https://api.open-meteo.com` veya `https://finans.truncgil.com`. |
| Fontlar yuklenmiyor | CSP `font-src` listesinde Google Fonts domaini yok | CSP'ye `https://fonts.gstatic.com` ekleyin. `style-src`'e de `https://fonts.googleapis.com` eklendiginden emin olun. |
| PWA yuklenemiyor (HTTP) | SSL yok veya HTTPS zorunlugu yok | PWA, yalnizca HTTPS uzerinde calisir. SSL sertifikasi yukleyin ve HTTP'den HTTPS'e yonlendirme acin. |
| PWA yuklenemiyor (2) | manifest.webmanifest MIME type yanlis | `.htaccess`'e `AddType application/manifest+json .webmanifest` ekleyin. Dogrulama: `curl -I https://domain.com/manifest.webmanifest` sonucunda `Content-Type: application/manifest+json` olmali. |
| Mixed content uyarisi | HTTP uzerinden kaynak yukleniyor | Tarayici konsolunda `Mixed Content` arayin. Sorunlu kaynagi HTTPS'e cevirin veya CSP'den kaldirin. |
| Slow yukleme (ilk acilis) | Brotli/gzip calismiyor | `curl -sI -H "Accept-Encoding: gzip" https://domain.com/ | grep Content-Encoding` ile kontrol edin. `mod_deflate` veya `mod_brotli` yuklu degilse hosting firmasina acin. |

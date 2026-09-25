# Deploy Runbook — Kocaeli Social Hub

Bu belge, siteyi GitHub Pages'ten türk bir hosting firmasina (cPanel / Apache /
LiteSpeed) tasima adimlarini aciklar. Node veya npm sunucuda yoktur; sadece
statik dosyalar yuklenir.

## On kosullar

- Site build edilmis (`dist/` klasoru hazir).
- DNS kayitlari hosting firmasina yönlendirilmis (A kaydi veya CNAME).
- SSL sertifikasi aktif (AutoSSL veya Let's Encrypt).
- FTP veya cPanel File Manager erisimi mevcut.

## Adim 1: Build dosyalarini hazirla

```
npm run build
```

`dist/` klasorundeki tum dosyalar yuklenecek.

## Adim 2: Dosyalari yukle

### cPanel File Manager ile

1. cPanel'e girin, "File Manager" acin.
2. `public_html` klasorune gidin.
3. Icerigi temizleyin (eski dosyalar varsa).
4. `dist/` icindeki TUM dosyalari `public_html/`'e yukleyin.
5. `deploy/.htaccess` dosyasini da `public_html/`'e yukleyin.

### FTP ile

1. FTP istemcisine (FileZilla, WinSCP) baglanin.
2. `public_html` klasorune gidin.
3. `dist/` icindeki tum dosyalari yukleyin.
4. `deploy/.htaccess` dosyasini yukleyin.

Not: gizli dosyalari (.htaccess) gormuyorsaniz, istemcinizde "Show hidden
files" secenegini acin.

## Adim 3: .htaccess ve dosya konumu

```
public_html/
  index.html
  sw.js
  manifest.webmanifest
  robots.txt
  sitemap.xml
  assets/
    (hashed JS, CSS, gorseller)
  .htaccess          <-- deploy/.htaccess
```

Eger site domain kokune degil, bir alt klasore kurulacaksa, `.htaccess` icinde
`RewriteBase /alt-klasor/` seklinde ayarlama yapin.

## Adim 4: Dogrulama

Sunucuda degerlendirmek icin curl komutlari:

```bash
# Ana sayfa 200 donuyor mu?
curl -sI https://domain.com/ | head -1
# Beklenen: HTTP/2 200

# SPA fallback calisiyor mu? (temiz URL)
curl -sI https://domain.com/events | head -1
# Beklenen: HTTP/2 200

curl -sI https://domain.com/guide | head -1
# Beklenen: HTTP/2 200

# robots.txt
curl -sI https://domain.com/robots.txt | head -1
# Beklenen: HTTP/2 200

# sitemap.xml
curl -sI https://domain.com/sitemap.xml | head -1
# Beklenen: HTTP/2 200

# Service worker cache kurali
curl -sI https://domain.com/sw.js | grep -i cache-control
# Beklenen: no-cache, no-store, must-revalidate

# Hashed asset cache kurali (dosya adini build ciktisindan alin)
curl -sI https://domain.com/assets/index-abc123.js | grep -i cache-control
# Beklenen: public, max-age=31536000, immutable

# Manifest
curl -sI https://domain.com/manifest.webmanifest | grep -i content-type
# Beklenen: application/manifest+json

# HTTPS yonlendirme
curl -sI http://domain.com/ | head -1
# Beklenen: HTTP/1.1 301 -> https://domain.com/
```

## Adim 5: Domain ve SSL

- DNS yonetimi nerede: domain firmasinda mi, hosting firmasinda mi?
- A kaydini hosting sunucusunun IP adresinepoint edin.
- SSL: cPanel > SSL/TLS Status > domain_secin > Run AutoSSL.
- HTTPS yonlendirme: `.htaccess`'teki HTTPS redirect blogunu acin.

## Adim 6: Geri alma plani

Eger sorun cikarsa:

1. `public_html` icindeki yeni dosyalari silin.
2. GitHub Pages'teki eski dosyalari tekrar yukleyin.
3. DNS kayitlarini GitHub Pages'e geri cevirin.
4. SSL sertifikanizi kontrol edin (eski sertifika hala gecerli olabilir).

DNS degisiklikleri yayilma suresi: 15 dakika ile 48 saat arasi.

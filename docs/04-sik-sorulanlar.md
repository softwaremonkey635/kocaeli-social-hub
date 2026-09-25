# Sik Sorulan Sorular

Site yonetimiyle ilgili en cok merak edilenler.

## Yeni bir etkinlik nasil eklenir?

`src/data/mockData.ts` dosyasini acin. `ACTIVITIES_DATA` dizisinin sonuna yeni bir obje ekleyin. Her etkinligin `id`, `title`, `category`, `day`, `time`, `image` gibi alanlari olmali. Etkinlik formunun ornegi icin `docs/01-icerik-guncelleme.md` dosyasina bakin.

Etkinlik fotografini `public/images/events/` klasorune koyun. Dosya adi buyuk harf, bosluk veya ozel karakter icermemeli (ornek: `fotograf-turu.jpeg`).

---

## Telefon veya WhatsApp linkini nasil degistiririm?

`src/constants/links.ts` dosyasindaki `COMMUNITY_LINKS` nesnesini duzenleyin. Uc satiri ayni anda degistirmeniz gerekir:

1. `founderPhone`: Gorunen telefon numarasi
2. `founderPhoneRaw`: WhatsApp icin rakamlar (ulke kodu dahil, bosluksuz)
3. `founderWhatsappUrl`: `https://wa.me/` ile baslayan WhatsApp acma linki

Ornek:
```ts
founderPhone: '+90 555 987 65 43',
founderPhoneRaw: '+905559876543',
founderWhatsappUrl: 'https://wa.me/905559876543',
```

---

## Bir fotografi nasil degistiririm?

Degistirmek istediginiz goruntunun dosya adini bulun (dosya yolunu `image` alaninda gorursunuz). Eski dosyayi `public/images/events/` klasorunde ayni isimle degistirin. Yeni dosya eski dosya ile ayni boyutta olmali, ideal boyut 900x600 pikseldir.

Harici bir URL kullaniyorsaniz (ornegin Unsplash), `image` alanindaki URL'yi guncelleyin.

---

## Site bozuldu, ne yapmaliyim?

1. Tarayicinizi `Ctrl + Shift + R` ile sert yenileyin
2. `npm run build` komutunu calistirin, hata cikiyorsa ilgili dosyadaki virgul veya parantez hatasini bulun
3. Eger build basariliysa ama site bozuksa, `dist/` klasorunu tekrar yukleyin
4. Hala sorun varsa `deploy/.htaccess` dosyasinin yuklendiginden emin olun

---

## Butce ve hava durumu rakamlari nereden geliyor?

**Hava durumu:** Site canli olarak `api.open-meteo.com` uzerinden Kocaeli'nin 13 ilcesi icin anlik hava verisi ceker. Bu ucretsiz ve acik kaynakli bir servistir. Eger internet baglantisi kesilirse veya servis erisilmez olursa son gorulen degerler ekranda kalir.

**Doviz ve borsa:** `finans.truncgil.com`, `tradingview.com` ve `open.er-api.com` ucretsiz API'lerinden canli kurlar cekilir. Bu ucretsiz servisler zaman zaman erisilemez olabilir. Erişilemediginde ilgili karda tire (-) gosterilir. Bu normaldir, site bozulmus anlamina gelmez.

**Butece rehber sayfasindaki sayilar:** `src/pages/GuidePage.tsx` dosyasinda kod olarak tanimlidir. Varsayilan degerler (KYK bursu 4.000 TL, yemekhane 40 TL, otobus 20,50 TL gibi) dosyanin basindaki `useState` satirlarindadir. Bu degerleri guncellemek icin dosyayi acin ve ilgili satiri degistirin.

---

## PWA kurulumu ne ise yarar?

PWA (Progressive Web App) sayesinde kullanicilar siteyi telefonlarina "uygulama gibi" kurabilir. Tarayicinin "Ana ekrana ekle" secenegiyle site dogrudan ana ekrandan acilir, tarayici cubugu gorunmez. Bu sadece kullanicilarin deneyimini iyilestirir, site icerigini veya guncellemeleri etkilemez.

PWA ikonlari `public/` klasorunde `pwa-192x192.png`, `pwa-512x512.png` ve `pwa-maskable-512x512.png` dosyalaridir. Bu dosyalari degistirmek icin ayni boyutta yeni goruntu dosyalariyla degistirin.

---

## Sponsorluk slotunu nasil guncellerim?

`src/data/mockData.ts` dosyasindaki `SPONSORS_DATA` dizisinde her slot bir objedir. Bir slotu doldurmak icin `name`, `shortName`, `description`, `badge` alanlarini guncelleyin. Slotu tamamen kaldirmak icin ilgili objeyi diziden silin.

```ts
// Bos slot:
{ id: 'slot-1', name: 'Sponsor Slotu 1', ... }

// Dolu slot:
{ id: 'slot-1', name: 'Kahve Dunyasi', shortName: 'Kahve Dunyasi', description: 'Kocaeli Subesi', badge: 'Alt Sponsor', ... }
```

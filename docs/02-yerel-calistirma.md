# Yerel Calistirma Rehberi

Projenin kendi bilgisayarinizda nasil calistirilacagi.

## On Kosullar

Bilgisayarinizda Node.js (surum 18 veya ustu) ve npm kurulu olmali. Kontrol etmek icin terminalde su komutu calistirin:

```sh
node --version
```

`v18.x.x` veya ustu gorunmeli. Node.js yoksa https://nodejs.org adresinden LTS surumunu indirip kurun.

## Adim 1: Dosyalari Indirme

Proje klasorunu terminalde acin:

```sh
cd /tmp/opencode/kocaeli-social-hub
```

Eger proje henuz indirilmemisse, git ile klonlayin veya dosyalari indirin.

## Adim 2: Bagimliliklarin Kurulmasi

Terminalde su komutu calistirin:

```sh
npm install
```

Bu islem ortalama 1-2 dakika surer. `node_modules` adinda bir klasor olusmali. Bu klasoru silmeyin, projenin calismasi icin gerekli.

Basarili olursa son satirda `added X packages` gibi bir cikti gorunur.

Hata alirsaniz:
- "permission denied" hatasi: `sudo npm install` deneyin
- "network error" hatasi: internet baglantinizi kontrol edin

## Adim 3: Gelistirme Sunucusunu Baslatma

```sh
npm run dev
```

Basarili olursa terminalde su turden bir cikti gorunursunuz:

```
  VITE v8.x.x  ready in 300 ms

  ➜  Local:   http://localhost:3000/kocaeli-social-hub/
  ➜  Network: http://192.168.x.x:3000/kocaeli-social-hub/
```

Tarayicinizi acin ve `http://localhost:3000/kocaeli-social-hub/` adresine gidin. Site gorunmeli.

Eger "port 3000 already in use" hatasi alirsaniz, baska bir terminalde `npm run dev` calistiran bir process olup olmadigini kontrol edin ve kapatın.

## Adim 4: Degisiklikleri Kontrol Etme

Gelistirme sunucusu calisirken `src/` altindaki herhangi bir dosyayi duzenlediginizde tarayici otomatik olarak yenilenir. Degisikligi kaydettiginizde tarayicida gorunur.

## Adim 5: Uretim Derlemesi (Build)

Siteyi yayinlamak icin once derleme yapin:

```sh
npm run build
```

Basarili olursa `dist/` adinda bir klasor olusur ve terminalde su ciktiyi gorunursunuz:

```
vite v8.x.x building for production...
✓ XX modules transformed.
dist/index.html                 0.XX kB | gzip: 0.XX kB
dist/assets/index-XXXXXXX.js   XXX.XX kB | gzip: XX.XX kB
dist/assets/index-XXXXXXX.css  XX.XX kB | gzip: XX.XX kB
✓ built in X.XXs
```

`dist/` klasorundeki dosyalar yayinlanmaya hazirdir.

## Adim 6: Derlemeyi Onizleme

Build isleminden sonra sonucu kontrol etmek icin:

```sh
npm run preview
```

Bu komut `dist/` klasorunu tarayicida acar. Gercek sunucudaki gibi gorunmeli.

## Sik Karshilaşilan Sorunlar

| Sorun | Cozum |
|---|---|
| "command not found: node" | Node.js kurulu degil. nodejs.org'den indirin. |
| "npm ERR! code EACCES" | Yetki hatasi. `sudo npm install` deneyin. |
| "Port 3000 is already used" | Baska bir surec portu kullaniyor. O sureci durdurun. |
| Build hatasi "TypeScript" | `npm run lint` calistirin, hata mesajlarini kontrol edin. |
| Site bos gorunuyor | Tarayici adres cubugunda `/kocaeli-social-hub/` olup olmadigini kontrol edin. |

# Sozluk: Teknik Kelimeler

Siteyi yonetirken karsilasacaginiz kavramlar ve ne anlama geldikleri.

**Build (Derleme):** Kaynak kodlarinin tarayicinin anlayacagi hale donusturulmesi islemi. `npm run build` komutu calistirildiginda proje `dist/` klasorune derlenir. Bu dosyalar sunucuya yuklenir. Ornegi: bir Word belgesini PDF'e donusturmek gibi.

**Deploy (Yayinlama):** Derlenmis dosyalarin canli sunucuya yuklenmesi islemi. `dist/` klasorundeki dosyalarin sunucudaki site klasorune kopyalanmasi, siteyi canli yapar.

**PWA (Progressive Web App):** Web sitesinin telefon uygulamasi gibi calismasi. Kullanicilar siteyi "Ana ekrana ekle" ile indirebilir, tarayici cubugu gorunmez, site daha hizli yuklenir. Kocaeli Sosyal Hub sitesi PWA desteklidir.

**SEO (Search Engine Optimization):** Sitenin Google gibi arama motorlarinda ust siralarda cikmasi icin yapilan iyilestirmeler. Meta etiketleri, sayfa basliklari ve aciklamalari SEO'nun parcasidir.

**Canonical:** Bir sayfanin "asil ve resmi" URL'si. Google ayni sayfayi farkli URL'lerden gorurse, canonical etiketi hangisinin asil oldugunu soyler. Tekrarlanan icerik cezasini onler.

**Cache (Onbellek):** Tarayicinin veya sunucunun sayfayi bir kez yukleyip kaydetmesi. Sonraki ziyaretlerde ayni veriyi tekrar cekmek yerine kaydedilmis kopyayi gostermesi, siteyi hizli yapar.

**Service Worker:** Tarayicinin arka planda calisan bir betigi. PWA'nin calismasini saglar, gorselleri ve sayfalari onbellige alir, internet yokken bile siteyi goruntulemeye devam eder.

**CORS (Cross-Origin Resource Sharing):** Bir web sitesinin baska bir sunucudan veri cekme kurali. Tarayicinin guvenlik nedeniyle farkli sunuculardan gelen isteklere sinir koymasi. Kocaeli Sosyal Hub sitesi farkli API'lerden (hava durumu, doviz) veri ceker ve bu veriler CORS kurallarina uygun olarak alinir.

**API (Application Programming Interface):** Bir yazilimin baska bir yazilimla iletisim kurma yolu. Ornegin hava durumu verileri `api.open-meteo.com` uzerinden bir API araciligiyla cekilir. Siz sadece sonucu gorunuz, arka planda bu iletisim otomatik olarak gerceklesir.

**TypeScript:** JavaScript'in guvenli versiyonu. Kod yazarken hatalari onceden yakalar. `src/` klasorundeki tum dosyalar TypeScript formatindadir.

**React:** Sitenin yapilandigi framework. Her sayfa bir "bileşen" (component) olarak tanimlidir. Siz icerik dosyalarini duzenlersiniz, React bu icerikleri ekranda gosterir.

**Vite:** Projenin derleme ve gelistirme araci. `npm run dev` ile gelistirme sunucusunu, `npm run build` ile uretim derlemesini baslatir.

**Tailwind CSS:** Sitenin gorunumunu belirleyen stillendirme sistemi. Renkler, bosluklar, yuvarlak köseler gibi tasarim detaylari `className` alanlariyla tanimlanir.

**Node.js:** JavaScript'in bilgisayarda calismasini saglayan platform. Proje bagimliliklari ve derleme islemleri Node.js uzerinden yapilir.

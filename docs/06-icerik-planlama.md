# Icerik Planlama Rehberi

Kocaeli genclik toplulugu icin pratik icerik takvimi ve etkinlik fikirleri.

## Haftalik Yayin Takvimi

Her hafta su zamanlarda icerik paylasimi yapmak siteyi canli tutar:

| Gun | Ne Paylasilir | Nerede Paylasilir |
|---|---|---|
| Pazartesi | Haftanin etkinlik programi (hangi gun, saat, nerede) | WhatsApp + Instagram Story |
| Salı | Bir onceki etkinlikten foto / kisa video | Instagram Reels / Story |
| Carsamba | "Haftanin Sorusu" veya kisa anket | WhatsApp + Instagram Story |
| Persembe | Hiking veya doga etkinligi hatirlatmasi | WhatsApp |
| Cuma | Hafta sonu etkinlikleri icin son hatirlatma | WhatsApp + Instagram |
| Cumartesi / Pazar | Etkinlik anlik paylasim (canli foto/video) | Instagram Story |

Ayda bir kez blog duyurusu: `src/data/blogData.ts` dosyasina yeni yazi ekleyin.

Ayda bir kez galeri guncellemesi: `src/data/galleryData.ts` dosyasina yeni foto ekleyin.

---

## Etkinlik Duyuru Sablonu

Her etkinlik icin WhatsApp grubuna atilan duyuru su formatta olmali:

```
[KULUP EMOJISI] [ETKINLIK ADI]
Tarih: [TARIH]
Saat: [SAAT]
Yer: [MEKAN]
Ucret: [UCRETSIZ / MALZEME PAYLASIMLI]
Kontenjan: [KISI SINIRI]

Aciklama: [2-3 CUMLE]

Katilmak icin: WhatsApp grubuna "katiliyorum" yazin veya yukaridaki linkten gruba dahil olun.
```

Ornek:
```
Speaking Club - Cumartesi Bulusmasi
Tarih: 26 Eylül Cumartesi
Saat: 18:00 - 20:00
Yer: WhatsApp grubunda duyurulacak
Ucret: Ucretsiz
Kontenjan: 20-25 Kisi

Grammar polisi giremez! Cay ve kahve esliginde Ingilizce sohbet.
Her seviyeden katilimciya acik.

Katilmak icin WhatsApp grubuna "katiliyorum" yazin.
```

---

## 10 Etkinlik Fikri (Kocaeli ve Ogrenciler Icin)

1. Kocaeli Sahil Yuruyusu: Sekapark'tan Izmit Koyu boyunca gun batimi yuruyusu
2. KYK Yurdu Bulusmasi: Umuttepe kampusunde disarida bulusma ve tanisma
3. Kitap Takasi Pazarı: Herkes elindeki kitabi getirip baskasiyla degistirsin
4. Kocaeli Muzesi Gezisi: Arkeoloji ve Etnografya Muzesi'nde rehberli tur
5. Sokak Lezzetleri Turu: Izmit'te yerel lokmalari ve borekcileri kesfetme
6. Fotoograf Yarismasi: "Kocaeli'nin Bilinmeyenleri" temali haftalik yarisma
7. Film Aksami: Acik havada film gosterimi (Sekapark'ta veya kampuste)
8. Kodlama Atolyesi: Sifirdan web sitesi yapma egitimi (bilgisayari olan herkes)
9. Kandira Koyu Gezisi: Tarihi Kandira evleri ve sahil koyleri gunubirlik gezi
10. Yilbasi Hediye Yapim Atolyesi: Kutu boyama, kart yapimi ve hediye paketleme

---

## Icerik Uretim Ipuculari

**Fotograf:** Her etkinlikten en az 5-10 foto cekin. Insan yuzu olan, samimi goruntuler tercih edin. Kulup fotograflari `public/images/events/` klasorune, galeri fotograflari ayni klasore `g1.jpeg`, `g2.jpeg` biciminde kaydedilebilir.

**Video:** Instagram Reels icin 15-30 saniyelik kisa videolar cekin. Etkinlik oncesi hazirlik, etkinlik sirasi eglence, etkinlik sonrasi mutluluk kareleri.

**Blog:** Ayda 1-2 blog yazisi yazin. "Yeni Donem Basliyor", "Ilk Kez Katilmak Ister Misiniz?", "Kamp Deneyimimiz" gibi basliklar site trafiğini artirir.

**Yorum:** Etkinliklere katilanlardan kisa yorumlar toplayin ve `TESTIMONIALS_DATA` dizisine ekleyin. Gercek isim ve.role ile paylasilmasi guvenilirlik saglar.

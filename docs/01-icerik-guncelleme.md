# Icerik Guncelleme Rehberi

Sifir kodlama bilgisiyle site icerigini nasil guncellersiniz.

Her sayfa kendi TypeScript dosyasindan beslenir. Asagidaki tabloda hangi dosyanin ne is yaptigi ve kac tane icerik objesi tuttugu var.

| icerik Turu | Dosya Yolu | Dizi Adi |
|---|---|---|
| Etkinlikler / Program | `src/data/mockData.ts` | `ACTIVITIES_DATA` |
| Kulupler | `src/data/mockData.ts` | `CLUBS_DATA` |
| Yorumlar | `src/data/mockData.ts` | `TESTIMONIALS_DATA` |
| SSS | `src/data/mockData.ts` | `FAQ_DATA` |
| Sponsorlar | `src/data/mockData.ts` | `SPONSORS_DATA` |
| Ilceler | `src/data/mockData.ts` | `DISTRICTS` |
| Vizyon / Misyon | `src/data/mockData.ts` | `VISION_MISSION_DATA` |
| Blog / Duyurular | `src/data/blogData.ts` | `BLOG_POSTS` |
| Galeri Fotograflari | `src/data/galleryData.ts` | `GALLERY_DATA` |
| Iletisim & Sosyal Linkler | `src/constants/links.ts` | `COMMUNITY_LINKS` |

---

## 1. Etkinlik Ekleme / Guncelleme

Dosya: `src/data/mockData.ts`

Her etkinlik `ACTIVITIES_DATA` dizisi icerinde bir objedir. Zorunlu alanlar:

```
id            : kisa, benzersiz metin (ornegin 'fotograf-turu')
title         : etkinligin kisa adi
subtitle      : etkinligin aciklamasi
category      : 'language' | 'art' | 'nature' | 'culture' | 'dance'
categoryName  : Turkce kategori adi (ornegin 'Dogu & Spor')
day           : gun bilgisi (ornegin 'Her Persembe')
dayOfWeek     : rakam (0=Pazar, 1=Pazartesi ... 6=Cumartesi)
time          : saat araligi (ornegin '18:00 - 20:00')
location      : mekan (bos birakilabilir, WhatsApp'ta duyurulur)
district      : ilce (ornegin 'Kocaeli')
pricing       : 'Ucretsiz' | 'Malzeme Paylasimli'
capacity      : kisi kapasitesi (ornegin '30 Kisi')
badge         : kisa etiket (ornegin 'Canli & Dinamik')
nextDate      : bir sonraki tarih (ornegin '24 Eylül Persembe, 18:00')
targetAudience: hedef kitle
image         : goruntunun yolu
description   : uzun aciklama
highlights    : madde madde one cikanlar (dizi)
```

Opsiyonel alanlar: `rules` (dizi), `subImages` (dizi), `whatsappFocus` (true/false), `whatsappNote` (metin).

**Ornek: Yeni bir etkinlik ekleme**

Onceki hali (son iki etkinlik):
```ts
{
  id: 'halk-oyunlari',
  title: 'Halk Oyunlari',
  ...
}
```

Yeni bir etkinlik eklemek icin dizinin sonuna su bloku ekleyin:
```ts
{
  id: 'fotograf-turu',
  title: 'Kocaeli Fotoograf Gezisi',
  subtitle: 'Sehir Ici Kultur ve Doega Fotoografciligi',
  category: 'culture',
  categoryName: 'Kultur & Gezi',
  day: 'Her Pazar',
  dayOfWeek: 0,
  time: '10:00 - 13:00',
  location: '',
  district: 'Kocaeli',
  pricing: 'Ucretsiz',
  capacity: '20 Kisi',
  badge: 'Yeni',
  nextDate: '28 Eylül Pazar, 10:00',
  targetAudience: 'Fotoograf ilgisi olan tum gencler',
  image: `${BASE}images/events/fotograf-gezisi.jpeg`,
  description:
    'Kocaeli\'nin tarihi ve dogal guzelliklerini objektifimize taniyoruz.',
  highlights: [
    'Rehberli sehir ici fotograf rotasi',
    'Teknik ipuclari ve pratik',
    'Gorsellerin paylasildigi ortak album'
  ]
}
```

Onemli: `id` alani benzersiz olmali, ayni deger iki etkinlik olamaz. `image` yolu `${BASE}images/events/` ile baslamali (kendi fotografinizi `public/images/events/` klasorune koyun).

---

## 2. Kulup Guncelleme

Dosya: `src/data/mockData.ts`, `CLUBS_DATA` dizisi.

Her kulup objesinin alanlari:
```ts
{
  id: 'kulup-id',
  name: 'Kulup Adi',
  tagline: 'Kisa slogan',
  icon: 'LucideIkonAdi',     // ornegi: 'MessageSquare', 'Palette', 'Compass'
  schedule: 'Her Gun Saat',
  coordinator: 'Sorumlu Grup',
  color: 'from-blue-600 to-cyan-600',  // Tailwind gradyan sinifi
  image: 'goruntu-yolu',
  description: 'Aciklama metni',
  features: ['ozellik 1', 'ozellik 2', 'ozellik 3', 'ozellik 4']
}
```

**Ornek:** Bir kulubun coordinator bilgisini degistirmek:
```ts
// Onceki:
coordinator: 'Dil & Iletisim Calisma Grubu',

// Yeni:
coordinator: 'Kocaeli Sosyal Dil Ekibi',
```

---

## 3. Blog / Duyuru Ekleme

Dosya: `src/data/blogData.ts`, `BLOG_POSTS` dizisi.

Her yazinin alanlari:
```ts
{
  id: 'benzersiz-yazi-id',
  title: 'Yazi Basligi',
  slug: 'yazi-basligi-url-dostu',
  category: 'Duyuru' | 'Rehber' | 'Topluluk' | 'Etkinlik Notlari',
  date: '26 Eylül 2026',
  author: { name: 'Yazar Adi', role: 'Topluluk Rolu' },
  excerpt: 'Kisa ozet (ilk gorunen kisim)',
  content: ['1. Paragraf', '2. Paragraf'],
  tags: ['Etiket1', 'Etiket2'],
  readTime: '3 dk okuma',
  image: 'goruntu-yolu',
  isPinned: true  // opsiyonel: en uste sabitler
}
```

**Ornek: Yeni duyuru ekleme**
```ts
{
  id: 'yeni-kamp-duyurusu',
  title: 'Kasim Kampi Icin Kayitlar Basladi',
  slug: 'kasim-kampi-kayitlar',
  category: 'Duyuru',
  date: '26 Eylül 2026',
  author: { name: 'Murat Malkoc', role: 'Kocaeli Sosyal Kurucusu' },
  excerpt: 'Kasim ayinda duzenlenecek kamp icin kayitlar basladi.',
  content: [
    'Kasim ayinda gerceklestirecegimiz kamp icin kayitlar baslamistir.',
    'Detaylar WhatsApp grubumuzda paylasilacaktir.'
  ],
  tags: ['Duyuru', 'Kamp'],
  readTime: '2 dk okuma',
  image: `${BASE}images/events/camping.jpeg`,
  isPinned: true
}
```

---

## 4. Galeri Fotografi Ekleme

Dosya: `src/data/galleryData.ts`, `GALLERY_DATA` dizisi.

```ts
{
  id: 'g9',
  title: 'Foto basligi',
  activity: 'Etkinlik adi',
  location: '',
  image: 'goruntu-yolu',
  date: 'Ekim 2026',
  category: 'language' | 'art' | 'nature' | 'culture' | 'dance'
}
```

---

## 5. Iletisim & Sosyal Linkler

Dosya: `src/constants/links.ts`, `COMMUNITY_LINKS` nesnesi.

Mevcut alanlar ve ornekleri:
```ts
export const COMMUNITY_LINKS = {
  whatsappGroup: 'https://chat.whatsapp.com/IABraq...',     // WhatsApp topluluk gruba davet linki
  founderName: 'Murat Malkoc',                               // Kurucu adi
  founderTitle: 'Kocaeli Social Hub Kurucusu',               // Kurucu unvani
  founderPhone: '+90 546 184 41 36',                         // Gorunen telefon
  founderPhoneRaw: '+905461844136',                           // WhatsApp icin formatlanmis
  founderWhatsappUrl: 'https://wa.me/905461844136',           // WhatsApp acma linki
  instagram: 'https://www.instagram.com/kocaelisosyal.41...', // Instagram profili
  instagramHandle: '@kocaelisosyal.41',                       // Instagram kullanici adi
  leaderApplicationForm: 'https://forms.gle/...',             // Google Form linki
};
```

**Ornek:** Telefon numarasini degistirmek icin uc satiri guncelleyin:
```ts
founderPhone: '+90 555 123 45 67',
founderPhoneRaw: '+905551234567',
founderWhatsappUrl: 'https://wa.me/905551234567',
```

---

## 6. Butece Rehber Sayfasi (GuidePage)

Bu sayfa `src/pages/GuidePage.tsx` icerisinde kod olarak tanimlidir. Sabit degerler dosya basindaki `useState` cagrilari icerisindedir:

- `rent`: kira (varsayilan 7.500 TL)
- `bills`: faturalar (varsayilan 1.250 TL)
- `kykBursary`: KYK bursu (varsayilan 4.000 TL)
- `MEAL_FIRST_FARE`: yemekhane 1. basim ucreti (40 TL)
- `MEAL_SECOND_FARE`: yemekhane 2. basim ucreti (100 TL)
- `SINGLE_BUS_FARE`: tek biniş ucreti (20,50 TL)

Bu degerleri guncellemek icin `GuidePage.tsx` dosyasindaki ilgili `useState` satirlarinda sayiyi degistirin. Ornegin KYK bursunu 4.500 TL'ye cikarmak icin:
```tsx
const [kykBursary, setKykBursary] = useState<number>(4500);
```

---

## 7. Hava Durumu ve Finans Verileri

Bu veriler dosyada sabit olarak tutulmaz. Canli olarak cekilir:

- **Hava durumu:** `src/components/WeatherWidget.tsx` dosyasi `api.open-meteo.com` uzerinden 13 Kocaeli ilcesi icin canli veri ceker. Sadece `KOCAELI_LOCATIONS` dizisindeki koordinatlari degistirerek hedef bolgeyi degistirebilirsiniz.
- **Doviz / Borsa:** `src/components/FinanceTicker.tsx` dosyasi ucretsiz API'lerden (finans.truncgil.com, tradingview.com, open.er-api.com) canli kurlar ceker. Eger bir kaynak calismazsa tire (-) gosterir. Degisiklik gerekmez.

---

## 8. SSS Ekleme / Guncelleme

Dosya: `src/data/mockData.ts`, `FAQ_DATA` dizisi.

```ts
{
  category: 'Etkinlikler',
  question: 'Soru metni buraya',
  answer: 'Cevap metni buraya'
}
```

---

## Dikkat Edilecekler

- Tum dosyalar TypeScript formatindadir. Virgul, koseli parantez ve tirnak isaretlerine dikkat edin.
- `image` yollari `${BASE}images/events/dosya-adi.jpeg` biciminde olmali. Dosyayi `public/images/events/` altina koyun.
- Bir girisi silmek icin ilgili objeyi tamamen silin, sadece icerigini bos birakmayin.
- Herhangi bir hata yaparsaniz `npm run build` komutu size hangi satirda sorun oldugunu soyleyecektir.

---
title: 'Yayın Rehberi: İçerikleri Nasıl Yayınlarız?'
slug: 'yayinlama-rehberi'
---

# Yayın Rehberi: İçerikleri Nasıl Yayınlarız?

Bu belge, `docs/icerik/` altındaki taslakların nasıl yayına alındığını adım adım anlatıyor.

## 1. Dosyayı Seçin

Hangi taslağı yayınlamak istiyorsanız `docs/icerik/` klasöründeki ilgili `.md` dosyasını açın.

## 2. Frontmatter Alanlarını Doldurun

Taslakların frontmatter'ı şu alanları içerir:

| Alan | Açıklama | Örnek |
|------|----------|-------|
| `title` | Yayın başlığı | `'Kocaeli'de İlk Haftanız'` |
| `slug` | URL dostu tanımlayıcı | `'kocaelide-ilk-haftaniz'` |
| `category` | Kategorilerden biri: `Duyuru`, `Rehber`, `Topluluk`, `Etkinlik Notları` | `'Rehber'` |
| `date` | Yayın tarihi | `'20 Eylül 2026'` |
| `author.name` | Yazar adı | `'Kocaeli Sosyal Ekibi'` |
| `author.role` | Yazar rolü | `'Rehber Yazarı'` |
| `excerpt` | Kısa özet (1-2 cümle) | `'Kocaeli'de...'` |
| `image` | Görsel yolu | `'/images/blog/kocaeli.jpg'` |

## 3. Görseli Ekleyin

Görsel yolu `image` alanında belirtilir. Görseli `/images/blog/` klasörüne ekleyin. Desteklenen formatlar: `.jpg`, `.jpeg`, `.png`, `.webp`. Önerilen boyut: 1200x630 piksel (sosyal medya paylaşımı için ideal).

## 4. DOĞRULANMALI İddiaları Kontrol Edin

Taslaklarda `[DOĞRULANMALI]` olarak işaretlenmiş iddialar doğrulanmamış bilgilerdir. Yayınlamadan önce bu iddiaları kontrol edin:

1. Dosyada `grep` ile `[DOĞRULANMALI]` arayın
2. Her iddiayı kaynakla doğrulayın
3. Doğrulanmışsa etiketi kaldırın, doğrulanamıyorsa iddiayı silin veya güvenilir bir kaynak bulun

## 5. İçeriği `blogData.ts`'e Aktarın

Markdown dosyasındaki frontmatter ve içerik `src/data/blogData.ts` dosyasına aktarılmalıdır:

1. `src/data/blogData.ts` dosyasını açın
2. `BLOG_POSTS` dizisine yeni bir obje ekleyin
3. Alanları markdown frontmatter'dan doldurun:
   - `id`: benzersiz bir tanımlayıcı (slug ile aynı olabilir)
   - `content`: paragraflar `string[]` dizisi olarak eklenir
   - `tags`: etiketler dizisi
   - `readTime`: tahmini okuma süresi (örn: `'4 dk okuma'`)

## 6. Test Edin

Yayınlamadan önce:

1. `npm run build` ile derleme hatası olmadığından emin olun
2. Local sunucuda(`npm run dev`) yazıyı kontrol edin
3. Görselin doğru yüklendiğini doğrulayın

## 7. Deploy Edin

Prodüksiyona almak için:

1. Değişikliklerinizi commit edin
2. Deploy sürecini başlatın (projenin deploy methoduna göre değişir)

## Hızlı Başvuru

```
docs/icerik/01-kocaelide-ilk-hafta.md  >  src/data/blogData.ts  >  build  >  deploy
```

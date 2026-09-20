import { BlogPost } from '../types';

/**
 * ============================================================================
 * KOCAELİ SOSYAL - BLOG & DUYURULAR VERİ MODÜLÜ
 * ============================================================================
 * 
 * 💡 YENİ YAZI / DUYURU NASIL EKLENİR?
 * Aşağıdaki `BLOG_POSTS` listesine yeni bir obje eklemeniz yeterlidir:
 * 
 * {
 *   id: 'yeni-duyuru-id',
 *   title: 'Yazı Başlığı',
 *   slug: 'yazi-basligi',
 *   category: 'Duyuru' | 'Rehber' | 'Topluluk' | 'Etkinlik Notları',
 *   date: 'Gün Ay Yıl',
 *   author: { name: 'Yazar Adı', role: 'Topluluk Rolü' },
 *   excerpt: 'Kısa özet metin...',
 *   content: ['1. Paragraf...', '2. Paragraf...'],
 *   tags: ['Etiket1', 'Etiket2'],
 *   readTime: '3 dk okuma',
 *   image: 'Görsel URLsi veya /images/events/...',
 *   isPinned: true // İsteğe bağlı: En üste sabitlemek için
 * }
 */

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'sonbahar-donemi-ve-liderlik',
    title: 'Yeni Dönem Başlıyor: Kocaeli Sosyal Etkinlik Programı & Gönüllü Liderlik Çağrısı',
    slug: 'yeni-donem-basliyor-gonullu-liderlik-cagrisi',
    category: 'Duyuru',
    date: '20 Eylül 2026',
    author: {
      name: 'Murat Malkoç',
      role: 'Kocaeli Sosyal Kurucusu'
    },
    excerpt: 'Sonbaharın gelişiyle birlikte hem doğa yürüyüşlerimizi hem de yaratıcı atölyelerimizi büyüterek sürdürüyoruz. Kendi etkinliğini yönetmek veya topluluk koordinatörü olmak isteyenler için kapılarımız açık!',
    content: [
      'Kocaeli Sosyal ailesi olarak kurulduğumuz ilk günden bu yana temel vizyonumuz; gençlerin tek bir kuruş ticari kaygı duymadan, kendilerini özgür ve güvende hissederek sosyalleşebileceği samimi bir alan inşa etmekti.',
      'Yeni dönemde haftalık 3\'ü bir arada dönerli workshoplarımız (Biblo, Çanta, Kil), doğa yürüyüşlerimiz, kamplarımız ve dil pratiklerimiz tüm hızıyla devam ediyor. Ancak büyüyen topluluğumuzla birlikte yeni fikirler ve yeni yüzlerle güçlenmek istiyoruz.',
      'Eğer sen de bir atölye yönetmek, doğa rotası belirlemek, kitap kulübü moderatörlüğü yapmak ya da halk oyunları ritimlerine öncülük etmek istersen; sayfamızdaki Google Form üzerinden gönüllü liderlik başvurunu bekliyoruz!'
    ],
    tags: ['Duyuru', 'Gönüllülük', 'Kocaeli Gençlik', 'Yeni Dönem'],
    readTime: '3 dk okuma',
    image: '/images/events/hiking.jpeg',
    isPinned: true
  },
  {
    id: 'yaratici-atolye-rehberi',
    title: 'Biblo, Çanta ve Kil Boyama: İlk Kez Atölyeye Katılacaklar İçin Pratik Rehber',
    slug: 'biblo-canta-kil-boyama-atolye-rehberi',
    category: 'Rehber',
    date: '17 Eylül 2026',
    author: {
      name: 'Ece & Atölye Ekibi',
      role: 'Sanat Koordinatörü'
    },
    excerpt: 'Pazar günleri gerçekleştirdiğimiz dönerli sanat workshoplarına katılmadan önce bilmeniz gerekenler, malzeme detayları ve haftalık oylama süreci hakkında merak edilenler.',
    content: [
      'Haftanın tüm iş, okul ve sınav yorgunluğunu geride bırakmanın en keyifli yolu elleri boyaya bulamak! Topluluğumuzda her pazar 18:00 - 20:00 arasında üç farklı atölyeden biri düzenleniyor: Biblo Boyama, Bez Çanta Tasarımı veya Kil Şekillendirme.',
      'O haftanın atölyesi her hafta başında WhatsApp grubumuzda katılımcılarımızın oyları ve talepleriyle netleşiyor. Bu nedenle gruba dahil olmanız büyük önem taşıyor.',
      'Hiçbir resim veya el sanatı yeteneğinizin olmasına gerek yok! Fırçalar, akrilik ve tekstil boyaları ile ham malzemeler topluluk tarafından temin ediliyor. Günün sonunda kendi ürettiğiniz eseri evinize götürüyorsunuz.'
    ],
    tags: ['Workshop', 'Sanat', 'Biblo Boyama', 'Kil', 'İzmit'],
    readTime: '4 dk okuma',
    image: '/images/events/biblo-boyama.jpeg'
  },
  {
    id: 'tek-basina-katilmak-korkulur-mu',
    title: 'İlk Kez Topluluğa Katılacaklar İçin: Tek Başına Gelmekten Çekinmeyin!',
    slug: 'ilk-kez-topluluga-katilacaklar-icin-tavsiyeler',
    category: 'Topluluk',
    date: '12 Eylül 2026',
    author: {
      name: 'Kocaeli Sosyal Ekibi',
      role: 'Topluluk Rehberliği'
    },
    excerpt: '"Kimseyi tanımıyorum, tek başıma gitsem garip kaçar mı?" diye düşünenlerdenseniz, bu yazı tam sizin için. Katılımcılarımızın %80\'inin ilk buluşmaya tek başına geldiğini biliyor muydunuz?',
    content: [
      'Yeni bir ortama tek başına adım atmak herkes için bir parça cesaret gerektirir. Ancak Kocaeli Sosyal’in ruhu tam olarak bu çekingenliği ilk 5 dakikada yıkmak üzerine kuruldu.',
      'Buluşma noktasına geldiğinizde koordinatörlerimiz sizi güleryüzle karşılar ve masadaki diğer arkadaşlarla tanıştırır. Çayınızı yudumlarken bir bakmışsınız ortak hobilerden, üniversite anılarından veya müzikten konuşuyorsunuz.',
      'Burada statüler, unvanlar veya önyargılar yok; yalnızca samimiyet, dayanışma ve birlikte vakit geçirmekten keyif alan gençler var.'
    ],
    tags: ['Topluluk Ruhu', 'Sosyalleşme', 'İletişim', 'Yeni Arkadaşlar'],
    readTime: '3 dk okuma',
    image: '/images/events/speaking-club.jpeg'
  },
  {
    id: 'doga-yuruyusleri-ve-camping-rotalari',
    title: 'Kocaeli’nin Yeşilinde Adımlamak: Hiking ve 4 Mevsim Kamp Rotalarımız',
    slug: 'kocaelinin-yesilinde-adimlamak-hiking-ve-camping',
    category: 'Etkinlik Notları',
    date: '05 Eylül 2026',
    author: {
      name: 'Doğa & Macera Kolu',
      role: 'Hiking Koordinasyonu'
    },
    excerpt: 'Umuttepe ormanlarından Yuvacık Barajı eteklerine ve Kandıra sahillerine uzanan doğa rotalarımızda hem fiziksel zindelik kazanıyor hem de doğayla kucaklaşıyoruz.',
    content: [
      'Kocaeli sanayi kenti kimliğinin arkasında aslında Türkiye’nin en zengin yeşil doğa ve sahil rotalarını barındırıyor. Perşembe akşamı gün batımı yürüyüşlerimizle gençleri beton binalardan alıp temiz havaya çıkarıyoruz.',
      'Rotalarımız amatör yürüyüşçülere uygun kolay-orta seviyede belirlenir. Yürüyüş ayakkabınızı giymeniz ve yanınıza mataranızı almanız yeterlidir.',
      'Hafta sonu kamplarımızda ise kamp ateşi başında şarkılar söylenir, çadır kurma dayanışması yaşanır ve doğaya sıfır atık prensibiyle saygı duyulur.'
    ],
    tags: ['Hiking', 'Doğa', 'Camping', 'Kartepe', 'Kandıra'],
    readTime: '4 dk okuma',
    image: '/images/events/camping.jpeg'
  },
  {
    id: 'edebi-soylesi-ve-fikir-kulubu',
    title: 'Kitap Söyleşisi ve Düşünce Çemberi: Fikirleri Özgürce Paylaşmak',
    slug: 'kitap-soylesisi-ve-dusunce-cemberi',
    category: 'Etkinlik Notları',
    date: '28 Ağustos 2026',
    author: {
      name: 'Kültür & Söyleşi Kolu',
      role: 'Edebiyat Kulübü'
    },
    excerpt: 'Haftalık seçilen bir kitap veya felsefi düşünce etrafında toplanıp fikirlerimizi yarıştırmadan, birbirimizi dinleyerek derinleştiğimiz samimi akşamlar.',
    content: [
      'Kitap okumak bireysel bir eylem olsa da, okunan eserin uyandırdığı hisleri ve düşünceleri başka zihinlerle paylaşmak paha biçilemez bir zenginliktir.',
      'Her çarşamba akşamı sıcak bir mekan ortamında toplanıyor, seçtiğimiz kitap üzerine konuşuyoruz. Kitabı bitirememiş olsanız dahi sohbete katılabilir, farklı bakış açılarından ilham alabilirsiniz.',
      'Siz de kitap önerilerinizi WhatsApp grubumuzdaki anketlerde paylaşabilir ve yeni kitap dostları edinebilirsiniz.'
    ],
    tags: ['Kitap Kulübü', 'Edebiyat', 'Felsefe', 'Söyleşi'],
    readTime: '3 dk okuma',
    image: '/images/events/kitap-soylesisi.jpeg'
  }
];

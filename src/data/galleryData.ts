import { GalleryItem } from '../types';

/**
 * ============================================================================
 * KOCAELİ SOSYAL - GALERİ VERİ MODÜLÜ
 * ============================================================================
 * 
 * 💡 YENİ FOTOĞRAF / AN NASIL EKLENİR?
 * Aşağıdaki `GALLERY_DATA` listesine yeni bir obje ekleyin veya çıkarın:
 * 
 * {
 *   id: 'benzersiz-id',
 *   title: 'Fotoğraf Başlığı',
 *   activity: 'Etkinlik Adı (Speaking Club, Hiking, Workshop, vb.)',
 *   location: '', // İsteğe bağlı (genel kural gereği WhatsApp'ta duyurulur)
 *   image: '/images/events/dosya-adi.jpeg' veya harici görsel URL,
 *   date: 'Eylül 2026',
 *   category: 'language' | 'art' | 'nature' | 'culture' | 'dance'
 * }
 */

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Speaking Club Kahve Sohbetleri',
    activity: 'Speaking Club',
    location: '',
    image: '/images/events/speaking-club.jpeg',
    date: 'Eylül 2026',
    category: 'language'
  },
  {
    id: 'g2',
    title: 'Umuttepe Orman Yürüyüşü',
    activity: 'Hiking',
    location: '',
    image: '/images/events/hiking.jpeg',
    date: 'Eylül 2026',
    category: 'nature'
  },
  {
    id: 'g3',
    title: 'Kandıra Sahil Çadır Kampı',
    activity: 'Kocaeli Camping',
    location: '',
    image: '/images/events/camping.jpeg',
    date: 'Ağustos 2026',
    category: 'nature'
  },
  {
    id: 'g4',
    title: 'Biblo & Seramik Boyama Atölyesi',
    activity: 'Sanat Atölyesi',
    location: '',
    image: '/images/events/biblo-boyama.jpeg',
    date: 'Eylül 2026',
    category: 'art'
  },
  {
    id: 'g5',
    title: 'Bez Çanta Tasarımı & Renkler',
    activity: 'Çanta Workshop',
    location: '',
    image: '/images/events/canta-boyama.jpeg',
    date: 'Eylül 2026',
    category: 'art'
  },
  {
    id: 'g6',
    title: 'Kil Şekillendirme Anları',
    activity: 'Kil Boyama',
    location: '',
    image: '/images/events/kil-boyama.jpeg',
    date: 'Ağustos 2026',
    category: 'art'
  },
  {
    id: 'g7',
    title: 'Kitap Söyleşisi & Fikir Molası',
    activity: 'Kitap Okuma',
    location: '',
    image: '/images/events/kitap-soylesisi.jpeg',
    date: 'Eylül 2026',
    category: 'culture'
  },
  {
    id: 'g8',
    title: 'Halk Oyunları Ritim Provası',
    activity: 'Halk Oyunları',
    location: '',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    date: 'Eylül 2026',
    category: 'dance'
  }
];

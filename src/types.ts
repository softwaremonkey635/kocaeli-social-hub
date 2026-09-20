export type PageId = 'home' | 'events' | 'vision' | 'clubs' | 'gallery' | 'contact' | 'blog' | 'sponsors' | 'guide';

export type EventCategory = 'all' | 'language' | 'art' | 'nature' | 'culture' | 'dance';

export interface ActivityEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  categoryName: string;
  day: string; // e.g. 'Her Perşembe', 'Her Salı'
  dayOfWeek: number; // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  time: string; // e.g. '18:00 - 20:00'
  location: string;
  district: string;
  description: string;
  highlights: string[];
  image: string;
  subImages?: { title: string; image: string }[];
  badge?: string;
  pricing: 'Ücretsiz' | 'Malzeme Paylaşımlı' | 'Ücretsiz (Gönüllü)';
  capacity: string;
  rules?: string[];
  targetAudience: string;
  nextDate: string;
  whatsappFocus?: boolean;
  whatsappNote?: string;
}

export interface ClubInfo {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  schedule: string;
  coordinator: string;
  features: string[];
  image: string;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  activity: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  activity: string;
  location: string;
  image: string;
  date: string;
  category: EventCategory;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Duyuru' | 'Rehber' | 'Topluluk' | 'Etkinlik Notları';
  date: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  excerpt: string;
  content: string[];
  tags: string[];
  readTime: string;
  image: string;
  isPinned?: boolean;
}

export interface SponsorItem {
  id: string;
  name: string;
  shortName?: string;
  category: string;
  description: string;
  badge?: string;
  website?: string;
  instagram?: string;
  location?: string;
  perks?: string;
  isPrimary?: boolean;
  iconType: 'cafe' | 'nature' | 'art' | 'culture' | 'youth';
}

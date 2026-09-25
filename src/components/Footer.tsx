import React from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { DISTRICTS } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import {
  MapPin,
  Calendar,
  MessageCircle,
  Instagram,
  Mail,
  Heart,
  Sparkles,
  ArrowUp,
  Phone
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-10 sm:pt-14 pb-8 sm:pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-8 pb-8 sm:pb-12 border-b border-slate-800/80">
          {/* Brand Col (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" variant="light" />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Gençlerin kendilerini özgürce ifade edebildiği, sosyal çevrelerini geliştirdiği, yeni deneyimler kazandığı ve kendi alanlarında ilerleyebildiği güçlü, kapsayıcı ve sürdürülebilir gençlik topluluğu.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={COMMUNITY_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Sayfamız"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#f27721] transition-all"
                title="Instagram: @kocaelisosyal.41"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={COMMUNITY_LINKS.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Topluluğumuz"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 transition-all"
                title="WhatsApp Topluluğuna Katıl"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${COMMUNITY_LINKS.founderPhoneRaw}`}
                aria-label="Kurucu İletişim Telefonu"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#00bcd4] transition-all"
                title={`${COMMUNITY_LINKS.founderName} (${COMMUNITY_LINKS.founderPhone})`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sayfalar */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#f27721] mb-4">
              HIZLI GEZİNTİ
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Etkinlikler &amp; Takvim</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7324]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guide')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Kocaeli &amp; Öğrenci Rehberi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vision')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Vizyon &amp; Misyonumuz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sponsors')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Sponsorlarımız &amp; Partnerler
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Duyurular &amp; Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Galeri &amp; Fotoğraflar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Topluluğa Katıl &amp; İletişim
                </button>
              </li>
            </ul>
          </div>

          {/* Haftalık Aktiviteler */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#009cb4] mb-4">
              HAFTALIK BULUŞMALAR
            </h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex flex-col">
                <span className="font-semibold text-white">Cumartesi 18:00</span>
                <span className="text-slate-400">Speaking Club (İngilizce)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-white">Perşembe 18:00</span>
                <span className="text-slate-400">Hiking (Doğa Yürüyüşü)</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-white">Pazar 18:00</span>
                <span className="text-slate-400">Biblo &amp; Çanta &amp; Kil Workshop</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-white">Çarşamba 18:00</span>
                <span className="text-slate-400">Kitap Okuma &amp; Söyleşi</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-white">Salı 18:00</span>
                <span className="text-slate-400">Halk Oyunları Kursu</span>
              </li>
            </ul>
          </div>

          {/* İlçelerimiz */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
              KOCAELİ GENELİ
            </h2>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              12 ilçemizden gençlerin buluştuğu ortak sosyal platform:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DISTRICTS.map((d) => (
                <span
                  key={d}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span>© {new Date().getFullYear()} Kocaeli Social Hub. Tüm hakları saklıdır.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400">
            <span className="flex items-center gap-1">
              İzmit, Kocaeli <Heart className="w-3.5 h-3.5 text-[#ff7324] fill-[#ff7324]" />
            </span>
            <span className="text-slate-700">|</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 transition-all cursor-pointer text-xs"
              title="Yukarı Çık"
              aria-label="Yukarı Çık"
            >
              <span>Yukarı</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

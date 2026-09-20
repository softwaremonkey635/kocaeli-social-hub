import React, { useState } from 'react';
import { SPONSORS_DATA } from '../data/mockData';
import { SponsorItem, PageId } from '../types';
import { COMMUNITY_LINKS } from '../constants/links';
import {
  Handshake,
  Coffee,
  Trees,
  Palette,
  Users,
  BookOpen,
  MapPin,
  CheckCircle2,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface SponsorsPageProps {
  onNavigate: (page: PageId) => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tüm Destekçiler' },
    { id: 'cafe', label: 'Kafe & Mekan' },
    { id: 'nature', label: 'Doğa & Ekipman' },
    { id: 'art', label: 'Sanat & Atölye' },
    { id: 'culture', label: 'Kültür & Kitap' },
    { id: 'youth', label: 'Gençlik & Sivil' }
  ];

  const filteredSponsors = activeCategory === 'all'
    ? SPONSORS_DATA
    : SPONSORS_DATA.filter((s) => s.iconType === activeCategory);

  const renderIcon = (type: SponsorItem['iconType']) => {
    switch (type) {
      case 'cafe':
        return <Coffee className="w-5 h-5 text-[#ff7324]" />;
      case 'nature':
        return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'art':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'culture':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'youth':
      default:
        return <Users className="w-5 h-5 text-[#00d2eb]" />;
    }
  };

  const getSponsorWhatsappUrl = () => {
    const text = encodeURIComponent(
      "Merhaba Murat Bey! Kocaeli Sosyal topluluğu için mekan/sponsorluk desteği ve iş birliği fırsatları hakkında görüşmek istiyorum."
    );
    return `https://wa.me/${COMMUNITY_LINKS.founderPhoneRaw.replace('+', '')}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-[#ff7324] border border-orange-500/30">
          <Handshake className="w-3.5 h-3.5" />
          <span>YEREL İŞ BİRLİĞİ VE DESTEKÇİ AĞI</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Sponsorlarımız &amp; Partnerlerimiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Kocaeli genelindeki etkinliklerimizde gençlere sıcak mekan kapılarını açan, taze kahveleriyle sohbetlerimizi tatlandıran ve atölyelerimize malzeme desteği sağlayan değerli yerel ortaklarımız.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#091120]/80 p-1.5 sm:p-2 rounded-2xl border border-slate-800/80 max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-[#10345e] to-[#009cb4] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1628] via-[#091120] to-[#060c18] border border-slate-800/90 hover:border-slate-700/90 transition-all flex flex-col justify-between shadow-lg group"
          >
            <div className="space-y-3.5">
              {/* Top Row: Icon + Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#070d1a] border border-slate-700/80 flex items-center justify-center shadow-xs">
                  {renderIcon(sponsor.iconType)}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {sponsor.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {sponsor.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#00d2eb] transition-colors">
                  {sponsor.name}
                </h3>
                <p className="text-xs font-semibold text-[#ff7324] mt-0.5">
                  {sponsor.category}
                </p>
              </div>

              {/* Location if available */}
              {sponsor.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{sponsor.location}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {sponsor.description}
              </p>
            </div>

            {/* Card Footer: Verified Badge */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Onaylı Kocaeli Sosyal Ortağı</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "Sponsor veya Destekçi Olun" CTA Section */}
      <section className="bg-gradient-to-br from-[#0c1628] via-[#091325] to-[#070d1c] p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500/15 text-[#ff7324] border border-orange-500/30">
              <Handshake className="w-3.5 h-3.5" />
              <span>İŞ BİRLİĞİ VE PARTNERLİK</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Topluluğumuza Sponsor veya Mekan Destekçisi Olun
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kocaeli&apos;de 3400+ aktif gence hitap eden Speaking Club, kültür gezileri, atölye çalışmaları ve doğa kamplarımızda markanızı gençlerle buluşturun. Kafeler, spor kulüpleri, atölyeler ve yerel işletmeler için özel ortaklık modelleri sunuyoruz.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={getSponsorWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Sponsorluk İletişimi (WhatsApp)</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-[#070c17] hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>İletişim &amp; Katılım Formu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Benefits to Sponsors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-[#060b16]/70 border border-slate-800/70 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00d2eb]" />
              <span>3400+ Aktif Genç Kitle</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kocaeli Üniversitesi öğrencileri ve çalışan gençlerin oluşturduğu dinamik kitleye doğrudan erişim.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#060b16]/70 border border-slate-800/70 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff7324]" />
              <span>Düzenli Canlı Buluşmalar</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Haftanın her günü Speaking Club, atölyeler ve toplantılarla mekanınıza nitelikli ziyaretçi akışı.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#060b16]/70 border border-slate-800/70 space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Sosyal Fayda &amp; Kent Kültürü</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kocaeli&apos;nin sosyal kalkınmasına ve gençlik kültürüne katkı sağlayan saygın kurumsal kimlik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { ActivityEvent, EventCategory } from '../types';
import { ACTIVITIES_DATA } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import { EventCard } from '../components/EventCard';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  List,
  Grid,
  CheckCircle2,
  Users,
  MessageCircle
} from 'lucide-react';

interface EventsPageProps {
  onSelectEvent: (event: ActivityEvent) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onSelectEvent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  // Default to 'schedule' (haftalık çizelge) on mobile as requested by user
  const [viewMode, setViewMode] = useState<'grid' | 'schedule'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'schedule';
    }
    return 'grid';
  });

  const categories: { id: EventCategory; label: string }[] = [
    { id: 'all', label: 'Tüm Etkinlikler' },
    { id: 'language', label: 'Speaking Club' },
    { id: 'nature', label: 'Hiking & Kamp' },
    { id: 'art', label: 'Sanat & Workshop' },
    { id: 'culture', label: 'Kitap & Söyleşi' },
    { id: 'dance', label: 'Halk Oyunları' }
  ];

  const daysFilter = [
    { id: 'all', label: 'Tüm Günler' },
    { id: 'salı', label: 'Salı', match: 'Salı' },
    { id: 'çarşamba', label: 'Çarşamba', match: 'Çarşamba' },
    { id: 'perşembe', label: 'Perşembe', match: 'Perşembe' },
    { id: 'cumartesi', label: 'Cumartesi', match: 'Cumartesi' },
    { id: 'pazar', label: 'Pazar', match: 'Pazar' }
  ];

  const filteredEvents = ACTIVITIES_DATA.filter((event) => {
    const matchesCategory =
      selectedCategory === 'all' || event.category === selectedCategory;

    const matchesDay =
      selectedDay === 'all' ||
      event.day.toLowerCase().includes(selectedDay.toLowerCase());

    const matchesSearch =
      searchQuery.trim() === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.subtitle && event.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDay && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-950/60 text-orange-400 border border-orange-800/60">
          <CalendarIcon className="w-3.5 h-3.5 text-[#ff7324]" />
          <span>CANLI AKTİVİTELER &amp; BULUŞMALAR</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Etkinlikler &amp; Haftalık Takvim
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Kocaeli genelinde her hafta düzenlenen düzenli atölyelerimiz, doğa yürüyüşlerimiz, kamplarımız ve konuşma kulübümüz. İster takvimden gün gün incele, ister kartlar halinde keşfet!
        </p>
      </div>

      {/* Filter and Search Bar - Dark Theme */}
      <div className="bg-[#0c1424]/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
        {/* Top search & view toggles */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Etkinlik, mekan veya konu ara (örn: speaking, hiking, kil)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2eb] bg-[#070c17] text-white placeholder-slate-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-[#080d19] p-1 rounded-xl shrink-0 self-end sm:self-auto border border-slate-700/60">
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'schedule'
                  ? 'bg-gradient-to-r from-[#0e2a4a] to-[#009cb4] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Haftalık Takvim</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#0e2a4a] to-[#009cb4] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Kart Görünümü</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#00d2eb]" /> Kategori:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#009cb4] to-[#00d2eb] text-slate-950 font-black shadow-[0_0_12px_rgba(0,210,235,0.3)]'
                    : 'bg-[#080d19] text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Day Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#ff7324]" /> Gün:
          </span>
          {daysFilter.map((day) => {
            const active = selectedDay === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#ff7324] text-white font-bold shadow-[0_0_10px_rgba(255,115,36,0.3)]'
                    : 'bg-[#080d19] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Results */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/80 rounded-3xl border border-slate-800 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            Aradığınız kritere uygun etkinlik bulunamadı
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Filtreleri temizleyerek tüm haftalık programı görebilirsiniz.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDay('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      ) : (
        /* Schedule Timeline View - Enhanced with clickable thumbnail for details */
        <div className="bg-[#0c1424]/90 backdrop-blur-md rounded-3xl border border-slate-800/90 overflow-hidden divide-y divide-slate-800/80 shadow-xl">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 sm:p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                {/* Clickable thumbnail - opens event modal directly */}
                <div
                  onClick={() => onSelectEvent(event)}
                  className="relative group/thumb cursor-pointer shrink-0"
                  title="Detayları ve afişi görmek için tıklayın"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-slate-700 group-hover/thumb:ring-[#00d2eb] group-hover/thumb:scale-105 transition-all shadow-md"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-[#0c1424]/90 border border-cyan-500/30 px-1.5 py-0.5 rounded">Gör</span>
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {event.categoryName}
                    </span>
                    <span className="text-xs font-bold text-[#ff7324]">
                      {event.day} • {event.time}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectEvent(event)}
                    className="font-display text-base sm:text-lg font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    {event.title}
                  </h3>

                  {event.subtitle && (
                    <p className="text-xs font-medium text-slate-400">
                      {event.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium text-emerald-400">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Konum: WhatsApp Grubunda</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      {event.pricing}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      {event.capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2.5 self-end md:self-center">
                <button
                  onClick={() => onSelectEvent(event)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-[#009cb4] border border-slate-700/80 hover:border-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Detay &amp; Katıl</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Propose an activity card - Dark Theme */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0d223a] rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#009cb4]">
            <Sparkles className="w-4 h-4" />
            <span>KENDİ ATÖLYENİ BAŞLAT</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Kocaeli&apos;de Bir Fikir veya Atölye Önermek İster misin?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Satranç, sinema gecesi, felsefe, kodlama veya başka bir alanda moderatör olmak istersen Kocaeli Sosyal altyapısı sana açık!
          </p>
        </div>
        <a
          href={COMMUNITY_LINKS.founderWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Fikrini WhatsApp&apos;tan İlet</span>
        </a>
      </div>
    </div>
  );
};

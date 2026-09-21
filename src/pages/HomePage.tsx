import React from 'react';
import { PageId, ActivityEvent, SponsorItem } from '../types';
import { ACTIVITIES_DATA, VISION_MISSION_DATA, TESTIMONIALS_DATA, SPONSORS_DATA } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import { getNearestUpcomingEvent } from '../utils/eventHelpers';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { WeatherWidget } from '../components/WeatherWidget';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  MessageCircle,
  ShieldCheck,
  Coffee,
  Trees,
  Palette,
  BookOpen,
  Music,
  Handshake,
  HeartHandshake,
  ChevronRight,
  Compass,
  PiggyBank,
  Bus
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent: (event: ActivityEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectEvent
}) => {
  // Nearest upcoming event
  const nextUpcoming = React.useMemo(() => getNearestUpcomingEvent(ACTIVITIES_DATA), []);

  // 5 Core Regular Activities for the simplified "Neler Var?" section
  const coreActivities = React.useMemo(() => {
    return ACTIVITIES_DATA.slice(0, 5);
  }, []);

  // 2 representative primary sponsors for sleek, non-cluttered display on mobile & desktop
  const featuredSponsors: SponsorItem[] = React.useMemo(() => {
    const primaries = SPONSORS_DATA.filter((s) => s.isPrimary);
    return primaries.length >= 2 ? primaries.slice(0, 2) : SPONSORS_DATA.slice(0, 2);
  }, []);

  // Other sponsors for the smooth moving ticker
  const otherSponsors: SponsorItem[] = React.useMemo(() => {
    const secondary = SPONSORS_DATA.filter((s) => !s.isPrimary);
    return secondary.length > 0 ? secondary : SPONSORS_DATA;
  }, []);

  return (
    <div className="space-y-6 sm:space-y-9 pb-12 text-slate-100">
      {/* 1. UNIFIED HERO & STATS MASTER PANEL (Merged into one sleek, cohesive command center) */}
      <section className="relative overflow-hidden pt-6 pb-6 sm:pt-8 sm:pb-8 bg-gradient-to-b from-[#070b16] via-[#0b1222] to-transparent border-b border-slate-800/80">
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#00d2eb]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#ff7324]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-5 sm:space-y-6">
          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-center">
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-center lg:text-left">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.15]">
                Kocaeli&apos;de Sosyalleş,{' '}
                <span className="text-[#00d2eb] inline-block drop-shadow-[0_0_12px_rgba(0,210,235,0.3)]">Kendini Geliştir,</span>{' '}
                <span className="text-[#ff7324] inline-block drop-shadow-[0_0_12px_rgba(255,115,36,0.3)]">
                  Birlikte Üret!
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal pt-1">
                Doğa yürüyüşlerinden İngilizce konuşma kulübüne, yaratıcı sanat atölyelerinden kitap söyleşileri ve halk oyunlarına... Kocaeli gençliğinin samimi dayanışma platformu.
              </p>

              {/* Primary Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 pt-1.5 sm:pt-2">
                <button
                  id="hero-btn-explore-events"
                  onClick={() => onNavigate('events')}
                  className="group w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0e2a4a] via-[#10345e] to-[#009cb4] hover:to-[#00d2eb] shadow-md shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/40"
                >
                  <Calendar className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Haftalık Program &amp; Takvim</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('vision')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-[#0c1424]/90 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Hakkımızda &amp; Vizyon</span>
                </button>
              </div>

              {/* Micro points */}
              <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-1.5 gap-x-3.5 text-[11px] font-semibold text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Kişisel &amp; Sosyal Gelişim</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00d2eb] shrink-0" />
                  <span>Kâr Amacı Gütmeyen Samimi Ortam</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#ff7324] shrink-0" />
                  <span>Tek Başına Gelsen Bile Yeni Arkadaşlar</span>
                </div>
              </div>
            </div>

            {/* Right Col: Sleek Live Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm bg-[#0c1424]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-800/90 hover:border-cyan-500/30 transition-all overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#00d2eb] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#00d2eb]" />
                    <span>EN YAKIN ETKİNLİK</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/70 text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </span>
                    <span>Bu Hafta Canlı</span>
                  </div>
                </div>

                <h3 className="font-display text-sm sm:text-base font-bold text-white truncate">
                  {nextUpcoming.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#ff7324] truncate">
                  {nextUpcoming.subtitle}
                </p>

                {/* Compact image */}
                <div className="mt-2 rounded-xl overflow-hidden h-24 sm:h-28 relative group">
                  <img
                    src={nextUpcoming.image}
                    alt={nextUpcoming.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 text-white text-[9px] font-medium flex items-center gap-1 bg-slate-950/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-700/60">
                    <Clock className="w-2.5 h-2.5 text-[#00d2eb]" />
                    <span>{nextUpcoming.day} • {nextUpcoming.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectEvent(nextUpcoming)}
                  className="w-full mt-2.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#10345e] to-[#009cb4] hover:to-[#00d2eb] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-cyan-500/30 shadow-xs"
                >
                  <span>Etkinlik Detayını &amp; Afişini İncele</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Integrated Metrics Strip directly at the bottom of Unified Hero */}
          <div className="pt-3 sm:pt-4 border-t border-slate-800/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-2.5 bg-[#080e1b]/85 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-md">
              <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center sm:text-left">
                <span className="font-display text-base sm:text-xl font-black text-[#00d2eb] drop-shadow-[0_0_8px_rgba(0,210,235,0.3)]">5+</span>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight mt-0.5">Düzenli Etkinlik</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block mt-0.5">Speaking, hiking, boyama, dans</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center sm:text-left">
                <span className="font-display text-base sm:text-xl font-black text-[#ff7324] drop-shadow-[0_0_8px_rgba(255,115,36,0.3)]">3.400+</span>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight mt-0.5">Genç Topluluk Üyesi</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block mt-0.5">Öğrenci &amp; genç çalışanlar</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center sm:text-left">
                <span className="font-display text-base sm:text-xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]">12</span>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight mt-0.5">Kocaeli İlçesi</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block mt-0.5">İzmit, Gebze, Kartepe...</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center sm:text-left">
                <span className="font-display text-base sm:text-xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">%100</span>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight mt-0.5">Gönüllü &amp; Samimi</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block mt-0.5">Ticari kaygısız gençlik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIMPLIFIED "NELER VAR?" (Compact on mobile: horizontal ribbon, zero wasted vertical space) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00d2eb]">
              <Sparkles className="w-3 h-3" />
              <span>HAFTALIK DÜZENLİ 5 ETKİNLİK</span>
            </div>
            <h2 className="font-display text-base sm:text-2xl font-extrabold text-white mt-0.5">
              Neler Var?
            </h2>
          </div>

          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-[#0c1424] hover:bg-slate-800 border border-cyan-500/30 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <span>Tüm Takvim</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MOBILE VIEW (sm:hidden): Ultra-compact horizontal swipe ribbon (~140px height total) */}
        <div className="sm:hidden -mx-4 px-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {coreActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectEvent(act)}
                className="snap-start shrink-0 w-44 bg-[#0c1424]/95 rounded-2xl p-2.5 border border-slate-800/90 active:border-cyan-400 shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#ff7324] text-white">
                      {act.pricing}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xs font-bold text-white line-clamp-1 leading-snug">
                    {act.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="truncate text-cyan-300 font-medium">{act.day.replace('Her ', '')}</span>
                    <span className="text-emerald-400 font-semibold">{act.capacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-0.5">
            ← Diğer etkinlikler için kaydırın • Tıklayarak afişi açın →
          </p>
        </div>

        {/* TABLET / DESKTOP VIEW (hidden sm:grid): 5 Clean, Compact Cards in 1 Row */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-3">
          {coreActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectEvent(act)}
              className="group bg-[#0c1424]/90 rounded-2xl p-2.5 border border-slate-800/90 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,210,235,0.15)] transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 shadow-md"
            >
              <div>
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#ff7324] text-white shadow-xs">
                      {act.pricing}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                  {act.categoryName}
                </div>

                <h3 className="font-display text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                  {act.title}
                </h3>

                <div className="mt-1.5 space-y-0.5 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-[#ff7324] shrink-0" />
                    <span className="truncate">{act.day}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>{act.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Detay &amp; Afiş</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VISION PREVIEW (Compact obsidian card - Full text visible on mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0c1628] via-[#091120] to-[#060c18] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-800/90 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl space-y-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#f8a834]">
                KOCAELİ SOSYAL BAKIŞI
              </span>
              <h2 className="font-display text-lg sm:text-2xl lg:text-3xl font-black mt-0.5 leading-tight">
                {VISION_MISSION_DATA.visionTitle}
              </h2>
            </div>

            {/* Full text visible on mobile without truncation */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              <p>&ldquo;{VISION_MISSION_DATA.visionParagraphs[0]}&rdquo;</p>
              <p className="text-slate-400">&ldquo;{VISION_MISSION_DATA.visionParagraphs[1]}&rdquo;</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
              <div className="p-3 sm:p-3.5 bg-[#080d19]/80 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kendini Geliştiren Gençlik</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Yalnızca etkinlik tüketen değil; üreten, iletişim becerilerini güçlendiren gençlik modeli.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#080d19]/80 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00d2eb] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kapsayıcı &amp; Güvenli Ortam</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Herkesin kendini özgürce ifade edebildiği, baskı ve yargıdan uzak pozitif arkadaşlık ortamı.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onNavigate('vision')}
                className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs hover:border-cyan-500/40"
              >
                <span>Vizyon &amp; Misyon Metninin Tamamını Oku</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPONSORLARIMIZ & YEREL DESTEKÇİLER (Directly under Vision section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ff7324]">
              <Handshake className="w-3.5 h-3.5" />
              <span>SPONSORLARIMIZ &amp; YEREL ORTAKLAR</span>
            </div>
            <h2 className="font-display text-base sm:text-2xl font-extrabold text-white mt-0.5">
              Topluluk Destekçilerimiz
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('sponsors')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-[#0c1424] hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer shadow-xs hover:border-cyan-500/40"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#ff7324]" />
              <span>Tüm Sponsor &amp; Ortaklar</span>
            </button>
          </div>
        </div>

        {/* 2 Featured Primary Sponsor Cards for Mobile & Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredSponsors.map((sp) => (
            <div
              key={sp.id}
              onClick={() => onNavigate('sponsors')}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#0c1424]/90 backdrop-blur-md border border-slate-800/90 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,210,235,0.1)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#101c30] flex items-center justify-center text-[#00d2eb] border border-cyan-500/20 shadow-xs">
                    {sp.iconType === 'cafe' && <Coffee className="w-3.5 h-3.5 text-[#ff7324]" />}
                    {sp.iconType === 'nature' && <Trees className="w-3.5 h-3.5 text-emerald-400" />}
                    {sp.iconType === 'art' && <Palette className="w-3.5 h-3.5 text-pink-400" />}
                    {sp.iconType === 'youth' && <Users className="w-3.5 h-3.5 text-[#00d2eb]" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {sp.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {sp.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-display font-bold text-white group-hover:text-[#00d2eb] transition-colors text-xs sm:text-sm">
                  {sp.name}
                </h4>
                <p className="text-[10px] font-semibold text-[#ff7324] mt-0.5">
                  {sp.category}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {sp.description}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Doğrulanmış Topluluk Destekçisi</span>
                </div>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                  Detaylar &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Continuous Moving Marquee Ticker for all other local sponsors & partners */}
        <SponsorMarquee
          sponsors={otherSponsors}
          onNavigate={onNavigate}
          title="DİĞER YEREL DESTEKÇİLER &amp; PARTNERLER"
        />
      </section>

      {/* KOCAELİ ÖĞRENCİ REHBERİ & BÜTÇE ARACI TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0d1f38] via-[#091527] to-[#122846] border border-cyan-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00d2eb]">
              <Compass className="w-3.5 h-3.5" />
              <span>ÜNİVERSİTELİLER İÇİN KOCAELİ REHBERİ</span>
            </div>
            <h3 className="font-display text-base sm:text-xl font-black text-white">
              Kocaeli Kart, Yemekhane &amp; Aylık Geçinme Hesaplayıcısı
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-light">
              25 Mayıs 2026 güncel UKOME Kocaeli Kart tarifeleri (tek biniş 20,50 ₺, 58 kontör abonman), sübvansiyonlu KOÜ yemekhanesi ve modüler bütçe hesaplayıcıyla Kocaeli&apos;de öğrenci yaşamını planla.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => onNavigate('guide')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#10345e] to-[#009cb4] hover:to-[#00d2eb] transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-cyan-500/20"
            >
              <PiggyBank className="w-4 h-4 text-amber-300" />
              <span>Rehber &amp; Bütçe Aracını Aç</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW TO JOIN IN 3 EASY STEPS (Compact & clean) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00d2eb]">
            KOLAY VE ŞEFFAF SÜREÇ
          </span>
          <h2 className="font-display text-base sm:text-2xl font-extrabold text-white mt-0.5">
            Nasıl Katılabilirim?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            İlk kez gelecekseniz endişelenmeyin! Kocaeli Sosyal&apos;de prosedür veya bürokrasi yoktur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0c1424]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md relative hover:border-orange-500/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#ff7324] flex items-center justify-center font-display font-black text-sm mb-2.5 border border-orange-500/30">
              1
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Etkinliğini Seç
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Speaking Club, doğa yürüyüşü, biblo boyama veya halk oyunları... Sana en uygun günü ve saati takvimden belirle.
            </p>
          </div>

          <div className="bg-[#0c1424]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md relative hover:border-cyan-500/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-[#00d2eb] flex items-center justify-center font-display font-black text-sm mb-2.5 border border-cyan-500/30">
              2
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Haftalık Duyuruyu Takip Et
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Her hafta etkinliklerin net toplanma noktası ve koordinatör duyurusu topluluk kanallarımızda paylaşılır.
            </p>
          </div>

          <div className="bg-[#0c1424]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md relative hover:border-blue-500/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center font-display font-black text-sm mb-2.5 border border-blue-500/30">
              3
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Ortama Gel &amp; Yeni Arkadaşlar Edin!
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Buluşma noktasına tek başına gelsen bile koordinatörlerimiz seni karşılar. 10 dakika içinde harika bir sohbettesin.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Compact obsidian glass cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ff7324]">
            KATILIMCI DENEYİMLERİ
          </span>
          <h2 className="font-display text-base sm:text-2xl font-extrabold text-white mt-0.5">
            Topluluk Üyelerimiz Ne Diyor?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-[#0c1424]/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-800/90 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-slate-800/80">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00d2eb]/50"
                />
                <div>
                  <h4 className="font-bold text-xs text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.role}</p>
                  <span className="inline-block text-[9px] font-semibold text-[#ff7324]">
                    {item.activity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CANLI KAMPÜS RADARI & TÜM KOCAELİ İLÇELERİ HAVA DURUMU (Kompakt / Mobil Öncelikli) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WeatherWidget badgeLabel="KOCAELİ İLÇELERİ &amp; KAMPÜS CANLI HAVA DURUMU" showAllDistricts={true} />
      </section>

      {/* 7. SINGLE FINAL JOIN BANNER (Compact & responsive) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0d223a] via-[#091120] to-[#0d2e3d] text-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-cyan-500/30 shadow-xl shadow-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1 text-center md:text-left relative z-10">
            <h3 className="font-display text-base sm:text-xl font-black text-white">
              Kocaeli&apos;de Hafta Sonun Boş Geçmesin!
            </h3>
            <p className="text-slate-300 text-xs max-w-xl">
              WhatsApp topluluk grubumuza katıl, anlık duyuruları al ve şehrin en samimi gençleriyle tanış.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto relative z-10">
            <a
              href={COMMUNITY_LINKS.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

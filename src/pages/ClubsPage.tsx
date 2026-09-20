import React, { useState } from 'react';
import { CLUBS_DATA, ACTIVITIES_DATA } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import { ActivityEvent } from '../types';
import {
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Palette,
  Compass,
  BookOpen,
  Music,
  FileText,
  ExternalLink
} from 'lucide-react';

interface ClubsPageProps {
  onSelectEvent: (event: ActivityEvent) => void;
}

export const ClubsPage: React.FC<ClubsPageProps> = ({ onSelectEvent }) => {
  const [selectedClubId, setSelectedClubId] = useState<string>(CLUBS_DATA[0].id);

  const activeClub = CLUBS_DATA.find((c) => c.id === selectedClubId) || CLUBS_DATA[0];

  // Map to matching events
  const relatedEvents = ACTIVITIES_DATA.filter((e) => {
    if (activeClub.id === 'speaking-club') return e.category === 'language';
    if (activeClub.id === 'art-workshop') return e.category === 'art';
    if (activeClub.id === 'nature-trekking') return e.category === 'nature';
    if (activeClub.id === 'literature-books') return e.category === 'culture';
    if (activeClub.id === 'folk-dance') return e.category === 'dance';
    return false;
  });

  const getIcon = (id: string) => {
    switch (id) {
      case 'speaking-club':
        return <MessageSquare className="w-4 h-4" />;
      case 'art-workshop':
        return <Palette className="w-4 h-4" />;
      case 'nature-trekking':
        return <Compass className="w-4 h-4" />;
      case 'literature-books':
        return <BookOpen className="w-4 h-4" />;
      case 'folk-dance':
        return <Music className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-[#00bcd4] border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KOCAELİ SOCIAL ETKİNLİK ALANLARI</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Etkinliklerimiz &amp; Topluluk Alanları
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          İlgi alanına göre özelleşmiş etkinlik kollarımıza katılabilir, yeni deneyimler kazanabilir veya gönüllü liderlik üstlenebilirsin.
        </p>
      </div>

      {/* Club Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CLUBS_DATA.map((club) => {
          const isActive = club.id === selectedClubId;
          return (
            <button
              key={club.id}
              onClick={() => setSelectedClubId(club.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#10345e] text-white shadow-md border border-cyan-500/40 -translate-y-0.5'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {getIcon(club.id)}
              <span>{club.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Club Deep Dive Banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image */}
          <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[300px]">
            <img
              src={activeClub.image}
              alt={activeClub.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00bcd4]">
                KOORDİNASYON &amp; LİDERLİK
              </span>
              <p className="text-xs font-semibold">{activeClub.coordinator}</p>
            </div>
          </div>

          {/* Body */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#f27721] bg-orange-500/15 border border-orange-500/30 mb-2">
                  {activeClub.schedule}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {activeClub.name}
                </h2>
                <p className="text-sm font-semibold text-[#00bcd4] mt-0.5">
                  {activeClub.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeClub.description}
              </p>

              {/* Features list */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ETKİNLİK KAZANIMLARI &amp; ÖZELLİKLER
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeClub.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Live Activities for this Club */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                BU ALANA AİT CANLI ETKİNLİKLER
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="p-3 bg-slate-950/60 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300">
                        {evt.title}
                      </h5>
                      <span className="text-[11px] text-[#f27721] font-semibold">
                        {evt.day} • {evt.time}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Leadership to Google Form */}
      <div className="bg-gradient-to-r from-slate-900 via-[#10345e] to-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f8a834]">
            GÖNÜLLÜ LİDERLİK
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black">
            Gönüllü Lider veya Koordinatör Ol!
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Speaking moderatörlüğü, atölye rehberliği veya yeni bir etkinlik başlatmak için resmi Google Form başvuru formumuzu hemen doldur!
          </p>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <a
            id="btn-google-form-leader"
            href={COMMUNITY_LINKS.leaderApplicationForm}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs text-slate-900 bg-[#f8a834] hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Gönüllü Liderlik Formunu Doldur</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

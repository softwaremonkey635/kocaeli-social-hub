import React from 'react';
import { ActivityEvent } from '../types';
import { whatsappShareUrl, nextOccurrence, formatTrShort } from '../utils/calendar';
import { imageDims } from '../utils/imageDims';
import { Calendar, Clock, MapPin, Users, ArrowRight, Sparkles, MessageCircle, Eye, Share2 } from 'lucide-react';

interface EventCardProps {
  event: ActivityEvent;
  onSelect: (event: ActivityEvent) => void;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, featured = false }) => {
  const occurrence = nextOccurrence(event);

  return (
    <div
      id={`event-card-${event.id}`}
      onClick={() => onSelect(event)}
      className={`group relative flex flex-col bg-[#0c1424]/95 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800/90 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/60 hover:-translate-y-1.5 cursor-pointer shadow-lg ${
        featured ? 'ring-2 ring-[#ff7324]/50' : ''
      }`}
    >
      {/* Image container - full poster view friendly */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[#060a14] flex items-center justify-center">
        <img
          src={event.image}
          alt={event.title}
          width={imageDims(event.image)?.w}
          height={imageDims(event.image)?.h}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-[#0c1424]/30 to-transparent pointer-events-none" />

        {/* Click to open full view indicator on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0c1424]/90 text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md border border-cyan-500/30">
            <Eye className="w-3.5 h-3.5 text-[#00d2eb]" />
            <span>Afişi ve Detayları Gör</span>
          </span>
        </div>

        {/* Category & Badge */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#0c1424]/90 backdrop-blur-md text-cyan-300 border border-slate-700/80 shadow-sm">
            {event.categoryName}
          </span>
          {event.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ff7324] text-slate-950 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{event.badge}</span>
            </span>
          )}
        </div>

        {/* Sub-images indicator (for the 3-in-1 Sunday workshop) */}
        {event.subImages && (
          <div className="absolute top-12 right-3.5 flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center gap-1 bg-[#0c1424]/90 backdrop-blur-md p-1 rounded-lg border border-slate-700">
              {event.subImages.map((sub, i) => (
                <img
                  key={i}
                  src={sub.image}
                  alt={sub.title}
                  width={imageDims(sub.image)?.w}
                  height={imageDims(sub.image)?.h}
                  className="w-7 h-7 rounded-md object-cover border border-slate-600"
                  title={sub.title}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <span className="text-[9px] font-extrabold text-amber-300 text-right bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
              3 Atölye Bir Arada
            </span>
          </div>
        )}

        {/* Pricing tag */}
        <div className="absolute bottom-3 left-3.5 pointer-events-none">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              event.pricing === 'Ücretsiz'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-slate-950'
            } shadow-sm backdrop-blur-md`}
          >
            {event.pricing}
          </span>
        </div>

        {/* Capacity */}
        <div className="absolute bottom-3 right-3.5 flex items-center gap-1.5 text-xs text-slate-200 bg-[#0c1424]/90 border border-slate-700/80 px-2.5 py-1 rounded-lg backdrop-blur-md pointer-events-none">
          <Users className="w-3.5 h-3.5 text-[#00d2eb]" />
          <span>{event.capacity}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between bg-[#0c1424]/95">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-semibold text-[#ff7324] mb-1.5">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.day}</span>
              <span className="text-slate-600">•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time}</span>
            </span>
            {occurrence && (
              <span
                data-testid="next-occurrence-chip"
                className="shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-cyan-400/10 text-cyan-300 border border-cyan-400/40"
              >
                {formatTrShort(occurrence.start)}
              </span>
            )}
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
            {event.title}
          </h3>

          {event.subtitle && (
            <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">
              {event.subtitle}
            </p>
          )}

          {/* WhatsApp Focus highlight banner (Customized for Workshop or Camping) */}
          {event.whatsappFocus && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {event.id === 'camping' ? (
                  <>
                    <strong className="text-white">Tarih WhatsApp&apos;ta Belirtilecek!</strong> Kapsamlı bir organizasyon olduğu için kesin kamp tarihi ve toplanma detayları WhatsApp grubumuzda duyurulur.
                  </>
                ) : (
                  <>
                    <strong className="text-white">Hangisi olacağı WhatsApp&apos;ta belirlenir!</strong> Her hafta biblo, çanta veya kilden 1 tanesi toplulukça seçilir.
                  </>
                )}
              </span>
            </div>
          )}

          <p className="text-sm text-slate-300 mt-3 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 truncate"
            title="Konum: WhatsApp Topluluk Grubunda paylaşılır"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="truncate">WhatsApp Grubu</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(whatsappShareUrl(event), '_blank', 'noopener,noreferrer');
              }}
              aria-label="Etkinliği WhatsApp'ta paylaş"
              title="WhatsApp'ta paylaş"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all duration-200 border border-slate-700/80 hover:border-emerald-500"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id={`btn-event-detail-${event.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-[#009cb4] transition-all duration-200 border border-slate-700/80 hover:border-cyan-400"
            >
              <span>Detay &amp; Katıl</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


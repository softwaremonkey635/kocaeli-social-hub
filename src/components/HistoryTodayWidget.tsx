import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Calendar, ChevronRight, ChevronLeft, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

interface WikiEvent {
  year: number;
  text: string;
  pages?: Array<{
    title: string;
    description?: string;
    content_urls?: {
      desktop?: { page?: string };
    };
  }>;
}

export const HistoryTodayWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [events, setEvents] = useState<WikiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dateLabel, setDateLabel] = useState<string>('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setDateLabel(
        now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
      );

      const res = await fetch(
        `https://tr.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
      );
      const data = await res.json();

      if (data?.events && Array.isArray(data.events)) {
        // Sort descending by year
        const sorted = [...data.events].sort((a, b) => b.year - a.year);
        setEvents(sorted.slice(0, 8)); // Top 8 events
      }
    } catch (err) {
      console.warn('Tarihte Bugün verisi alınamadı:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const nextEvent = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
  };

  const prevEvent = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <div
      id="history-today-widget"
      className={`relative rounded-2xl bg-gradient-to-br from-[#0c1c38] via-[#071124] to-[#0b162e] border border-cyan-500/25 p-4 sm:p-5 shadow-xl overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                TARİHTE BUGÜN
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Vikipedi Türkçe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {dateLabel} günü geçmişte neler oldu?
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevEvent}
            disabled={loading || events.length === 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Önceki Olay"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">
            {events.length > 0 ? `${currentIndex + 1}/${events.length}` : '-'}
          </span>
          <button
            onClick={nextEvent}
            disabled={loading || events.length === 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Sonraki Olay"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer ml-1"
            title="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-3">
        {loading ? (
          <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Tarih yaprakları çevriliyor...</span>
          </div>
        ) : currentEvent ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs shadow-xs">
                Yıl: {currentEvent.year}
              </span>
              <span className="text-[10px] text-slate-400">
                ({new Date().getFullYear() - currentEvent.year} yıl önce)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {currentEvent.text}
            </p>

            {/* Wiki Link if available */}
            {currentEvent.pages && currentEvent.pages[0]?.content_urls?.desktop?.page && (
              <div className="pt-1">
                <a
                  href={currentEvent.pages[0].content_urls.desktop.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors"
                >
                  <span>Vikipedi&apos;de oku: {currentEvent.pages[0].title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3">Bugüne ait kayıt bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

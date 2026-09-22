import React from 'react';
import { SponsorItem, PageId } from '../types';
import {
  Coffee,
  Trees,
  Palette,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SponsorMarqueeProps {
  sponsors: SponsorItem[];
  onNavigate?: (page: PageId) => void;
  title?: string;
  className?: string;
}

export const SponsorMarquee: React.FC<SponsorMarqueeProps> = ({
  sponsors,
  onNavigate,
  title = 'DİĞER YEREL DESTEKÇİLER & PARTNERLER',
  className = ''
}) => {
  // Render icon based on sponsor iconType
  const renderIcon = (type: SponsorItem['iconType']) => {
    switch (type) {
      case 'cafe':
        return <Coffee className="w-3.5 h-3.5 text-[#ff7324]" />;
      case 'nature':
        return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'art':
        return <Palette className="w-3.5 h-3.5 text-pink-400" />;
      case 'culture':
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'youth':
      default:
        return <Users className="w-3.5 h-3.5 text-[#00d2eb]" />;
    }
  };

  // Repeat the set 4x so one half of the track is at least as wide as the
  // card, which keeps the -50% loop seamless on every screen width.
  const marqueeItems = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#091120]/95 via-[#0c1628]/90 to-[#091120]/95 border border-slate-800/90 shadow-md ${className}`}
    >
      {/* Top Header Label & Link */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-slate-800/70 bg-[#060b16]/60">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-300">
          <Sparkles className="w-3 h-3 text-[#ff7324]" />
          <span>{title}</span>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('sponsors')}
            className="text-[10px] sm:text-[11px] font-bold text-[#00d2eb] hover:text-cyan-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Tüm Sponsor &amp; Ortaklar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Marquee Runner with subtle side gradients */}
      <div className="relative py-2.5 overflow-hidden">
        {/* Left and right fade gradient mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#091120] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#091120] to-transparent z-10" />

        <div className="animate-marquee items-center gap-3 select-none">
          {marqueeItems.map((sponsor, idx) => (
            <div
              key={`${sponsor.id}-${idx}`}
              onClick={() => onNavigate && onNavigate('sponsors')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070d1a]/80 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-[#0c1932] transition-all cursor-pointer shrink-0 shadow-xs group"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                {renderIcon(sponsor.iconType)}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 group-hover:text-white whitespace-nowrap">
                  {sponsor.shortName || sponsor.name}
                </span>

                {sponsor.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-semibold bg-slate-800 text-slate-300 border border-slate-700/50 whitespace-nowrap">
                    {sponsor.badge}
                  </span>
                )}
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

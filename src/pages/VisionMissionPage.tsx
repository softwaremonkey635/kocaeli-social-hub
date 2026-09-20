import React from 'react';
import { VISION_MISSION_DATA } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import {
  Sparkles,
  Target,
  Compass,
  CheckCircle2,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

export const VisionMissionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7 text-slate-100">
      {/* Header - Compact & refined */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500/15 text-[#ff7324] border border-orange-500/30">
          <Target className="w-3 h-3" />
          <span>TOPLULUK MANİFESTOSU</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
          {VISION_MISSION_DATA.title}
        </h1>
      </div>

      {/* VİZYONUMUZ - Compact Obsidian Card */}
      <section className="bg-gradient-to-br from-[#0c1628] via-[#091120] to-[#060c18] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-800/90 shadow-lg relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#10345e] to-[#009cb4] text-white flex items-center justify-center shadow-xs shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d2eb]">
              GELECEĞE BAKIŞIMIZ
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-black text-white leading-tight">
              {VISION_MISSION_DATA.visionTitle}
            </h2>
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          <p className="p-3 sm:p-4 rounded-xl bg-[#070c17]/90 border border-slate-800/80">
            {VISION_MISSION_DATA.visionParagraphs[0]}
          </p>
          <p className="p-3 sm:p-4 rounded-xl bg-[#070c17]/90 border border-slate-800/80">
            {VISION_MISSION_DATA.visionParagraphs[1]}
          </p>
        </div>
      </section>

      {/* MİSYONUMUZ - Compact, Highly Legible & Non-Scrolling Monster */}
      <section className="bg-gradient-to-br from-[#0c1628] via-[#091120] to-[#060c18] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-800/90 shadow-lg relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#ff7324] to-[#f8a834] text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff7324]">
              VAR OLUŞ AMACIMIZ
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-black text-white leading-tight">
              {VISION_MISSION_DATA.missionTitle}
            </h2>
          </div>
        </div>

        {/* Intro */}
        <div className="p-3 sm:p-4 rounded-xl bg-orange-950/25 border border-orange-800/40 text-orange-200 text-xs sm:text-sm font-medium leading-relaxed">
          &ldquo;{VISION_MISSION_DATA.missionIntro}&rdquo;
        </div>

        {/* Subheading + 8 Points */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {VISION_MISSION_DATA.missionSubheading}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {VISION_MISSION_DATA.missionPoints.map((point, index) => (
              <div
                key={index}
                className="p-2.5 sm:p-3 rounded-xl bg-[#070c17]/90 border border-slate-800/90 flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0 text-[#00d2eb]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#10345e] to-[#081120] text-white rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d2eb]">
            TEMEL AMACIMIZ
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            {VISION_MISSION_DATA.closingStatement}
          </p>
        </div>
      </section>

      {/* Quick Action - WhatsApp Join CTA */}
      <div className="text-center pt-1">
        <a
          href={COMMUNITY_LINKS.whatsappGroup}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Topluluğumuza Katıl (WhatsApp)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

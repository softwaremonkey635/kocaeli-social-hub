import React, { useState, useMemo } from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { COMMUNITY_LINKS } from '../constants/links';
import { ACTIVITIES_DATA } from '../data/mockData';
import { getNearestUpcomingEvent } from '../utils/eventHelpers';
import {
  Menu,
  X,
  Instagram,
  MessageCircle,
  Sparkles,
  Calendar,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate the nearest upcoming event dynamically from schedule
  const nearestEvent = useMemo(() => {
    return getNearestUpcomingEvent(ACTIVITIES_DATA);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'events', label: 'Etkinlikler' },
    { id: 'guide', label: 'Kocaeli Rehberi' },
    { id: 'vision', label: 'Vizyon & Misyon' },
    { id: 'sponsors', label: 'Sponsorlar' },
    { id: 'blog', label: 'Duyurular & Blog' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'contact', label: 'İletişim & Katıl' }
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/90 shadow-md">
      {/* Mini top notification bar - Dynamic Nearest Event + Murat Malkoç WhatsApp */}
      <div className="bg-gradient-to-r from-[#0d223a] via-[#10345e] to-[#0d3446] text-white py-1.5 px-3 sm:px-4 text-xs font-medium border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Authentic Dual-Ring Live Radar Ping - overflow-visible so the
                expanding ring is never clipped into a square by the row */}
            <div className="relative w-4 h-4 shrink-0 flex items-center justify-center overflow-visible" title="Canlı Takvim Aktif">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>
            <div className="truncate text-[11px] sm:text-xs">
              <span className="sm:hidden font-semibold text-slate-200">
                Sıradaki: <strong className="text-white">{nearestEvent.title}</strong> ({nearestEvent.day.replace('Her ', '')}, {nearestEvent.time.split(' - ')[0]})
              </span>
              <span className="hidden sm:inline text-slate-200">
                <strong className="text-emerald-400">Canlı Takvim:</strong> En yakın etkinlik: <strong className="text-white">{nearestEvent.title}</strong> ({nearestEvent.day}, {nearestEvent.time}) — Mekan &amp; Katılım WhatsApp Grubumuzda!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <a
              id="topbar-murat-whatsapp"
              href={COMMUNITY_LINKS.founderWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/95 hover:text-white flex items-center gap-1.5 font-bold transition-all bg-emerald-600/30 hover:bg-emerald-600/50 px-2 py-0.5 rounded-md border border-emerald-500/40 cursor-pointer"
              title="Kurucu Murat Malkoç ile WhatsApp üzerinden iletişim kurun"
            >
              <MessageCircle className="w-3 h-3 text-emerald-300 shrink-0" />
              <span>Murat Malkoç</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-amber-300 font-semibold">📍 İzmit, Kocaeli</span>
          </div>
        </div>
      </div>

      {/* Main navigation container - Compacted height (h-14 sm:h-15) to prevent taking excessive screen space */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14 sm:h-15">
          {/* Brand Logo */}
          <button
            id="nav-logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center focus:outline-none group text-left cursor-pointer shrink-0"
            aria-label="Kocaeli Social Hub Ana Sayfa"
          >
            <Logo size="sm" />
          </button>

          {/* Desktop Navigation Links - Compact, clean, no distracting orange badges */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 py-1.5 xl:px-3 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-slate-800 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#009cb4] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA: Instagram (Only Instagram logo and group IG handle) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a
              id="nav-btn-instagram"
              href={COMMUNITY_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 shadow-sm transition-all hover:scale-102 cursor-pointer shrink-0 whitespace-nowrap"
              title="Kocaeli Social Hub Instagram Sayfası"
            >
              <Instagram className="w-3.5 h-3.5 shrink-0" />
              <span>{COMMUNITY_LINKS.instagramHandle}</span>
            </a>
          </div>

          {/* Mobile buttons: Quick Instagram + Mobile menu hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <a
              href={COMMUNITY_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#f09433] to-[#dc2743] text-white shadow-xs flex items-center gap-1"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">{COMMUNITY_LINKS.instagramHandle}</span>
            </a>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Dark Mode */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1527] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2.5 shadow-2xl animate-slide-down">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-[#009cb4] font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <a
              href={COMMUNITY_LINKS.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Topluluk Grubuna Katıl</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

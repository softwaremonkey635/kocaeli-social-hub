/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, ActivityEvent } from './types';
import { ACTIVITIES_DATA } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EventModal } from './components/EventModal';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { VisionMissionPage } from './pages/VisionMissionPage';
import { ClubsPage } from './pages/ClubsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactJoinPage } from './pages/ContactJoinPage';
import { BlogPage } from './pages/BlogPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { GuidePage } from './pages/GuidePage';
import { COMMUNITY_LINKS } from './constants/links';
import { MessageCircle, Heart, ArrowUp } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  // Hash-based client routing for seamless GitHub Pages & Cloudflare Pages hosting
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash.startsWith('event/')) {
        const eventId = hash.replace('event/', '');
        const found = ACTIVITIES_DATA.find((e) => e.id === eventId);
        if (found) {
          setSelectedEvent(found);
          setCurrentPage('events');
          return;
        }
      }

      if (['home', 'events', 'vision', 'clubs', 'gallery', 'contact', 'blog', 'sponsors', 'guide'].includes(hash)) {
        setCurrentPage(hash as PageId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (event: ActivityEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 font-sans selection:bg-[#ff7324] selection:text-white relative">
      {/* Subtle & Balanced Dark Mode Atmospheric Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Colorful Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] bg-[#00d2eb]/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-[#ff7324]/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#0e2a4a]/12 rounded-full blur-[160px]" />
      </div>

      {/* Sticky Header Navigation - Seamlessly follows the user on scroll */}
      <div className="sticky top-0 z-50">
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
      </div>

      {/* Main Page Content */}
      <main className="flex-1 relative z-10">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectEvent={handleSelectEvent}
          />
        )}
        {currentPage === 'events' && (
          <EventsPage
            onSelectEvent={handleSelectEvent}
          />
        )}
        {currentPage === 'blog' && (
          <BlogPage
            onNavigateToJoin={() => navigateTo('contact')}
          />
        )}
        {currentPage === 'vision' && (
          <VisionMissionPage />
        )}
        {currentPage === 'clubs' && (
          <ClubsPage
            onSelectEvent={handleSelectEvent}
          />
        )}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'sponsors' && <SponsorsPage onNavigate={navigateTo} />}
        {currentPage === 'guide' && <GuidePage onNavigate={navigateTo} />}
        {currentPage === 'contact' && <ContactJoinPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
      />

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Floating Quick Action Widget (WhatsApp & Join) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        <a
          href={COMMUNITY_LINKS.whatsappGroup}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-emerald-600/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          title="Kocaeli Sosyal WhatsApp Topluluğuna Katıl"
          aria-label="WhatsApp Topluluk Grubuna Katıl"
        >
          {/* Subtle radar aura */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none opacity-40" style={{ animationDuration: '3s' }} />
          <MessageCircle className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline text-xs font-bold relative z-10">
            WhatsApp Topluluğuna Katıl
          </span>
        </a>
      </div>
    </div>
  );
}

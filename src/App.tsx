/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { PageId, ActivityEvent } from './types';
import { ACTIVITIES_DATA } from './data/mockData';
import { applySeo } from './utils/seo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EventModal } from './components/EventModal';
import { HomePage } from './pages/HomePage';
import { COMMUNITY_LINKS } from './constants/links';
import { MessageCircle, Heart, ArrowUp } from 'lucide-react';

const EventsPage = React.lazy(() =>
  import('./pages/EventsPage').then((m) => ({ default: m.EventsPage }))
);
const VisionMissionPage = React.lazy(() =>
  import('./pages/VisionMissionPage').then((m) => ({ default: m.VisionMissionPage }))
);
const ClubsPage = React.lazy(() =>
  import('./pages/ClubsPage').then((m) => ({ default: m.ClubsPage }))
);
const ContactJoinPage = React.lazy(() =>
  import('./pages/ContactJoinPage').then((m) => ({ default: m.ContactJoinPage }))
);
const SponsorsPage = React.lazy(() =>
  import('./pages/SponsorsPage').then((m) => ({ default: m.SponsorsPage }))
);
const GalleryPage = React.lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const BlogPage = React.lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const GuidePage = React.lazy(() =>
  import('./pages/GuidePage').then((m) => ({ default: m.GuidePage }))
);

const BASE = import.meta.env.BASE_URL;
const ROUTED_PAGES: PageId[] = [
  'events',
  'vision',
  'clubs',
  'gallery',
  'contact',
  'blog',
  'sponsors',
  'guide',
];
const KNOWN_SEGMENTS = ['home', ...ROUTED_PAGES];

interface RouteState {
  page: PageId;
  eventId: string | null;
}

/** Drops the deployment base (/ or /kocaeli-social-hub/) from a pathname. */
function stripBase(pathname: string): string {
  const baseDir = BASE === '/' ? '' : BASE.replace(/\/+$/, '');
  let rest = pathname;
  if (baseDir && (rest === baseDir || rest.startsWith(`${baseDir}/`))) {
    rest = rest.slice(baseDir.length);
  }
  return rest.replace(/^\/+|\/+$/g, '');
}

/** One path segment ("", "events", "event/abc") -> route. Unknown -> home. */
function parseSegment(segment: string): RouteState {
  const seg = segment.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (seg.startsWith('event/')) {
    const eventId = seg.slice('event/'.length);
    const found = ACTIVITIES_DATA.find((e) => e.id === eventId);
    if (found) return { page: 'events', eventId: found.id };
    return { page: 'home', eventId: null };
  }
  if (KNOWN_SEGMENTS.includes(seg)) return { page: seg as PageId, eventId: null };
  return { page: 'home', eventId: null };
}

function parseRoute(pathname: string): RouteState {
  return parseSegment(stripBase(pathname));
}

/** Clean URL for a route: home is the base itself, no trailing page segment. */
function routeUrl(route: RouteState): string {
  const suffix = route.eventId ? `event/${route.eventId}` : route.page === 'home' ? '' : route.page;
  return `${BASE}${suffix}`;
}

function eventById(eventId: string | null): ActivityEvent | null {
  return eventId ? ACTIVITIES_DATA.find((e) => e.id === eventId) ?? null : null;
}

/** Runs before the first render: #events style links land on their clean path. */
function migrateLegacyHash(): void {
  const legacy = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (!legacy) return;
  if (!KNOWN_SEGMENTS.includes(legacy) && !legacy.startsWith('event/')) return;
  window.history.replaceState(null, '', routeUrl(parseSegment(legacy)));
}

migrateLegacyHash();

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(
    () => parseRoute(window.location.pathname).page
  );
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(() =>
    eventById(parseRoute(window.location.pathname).eventId)
  );

  // History-API routing: Back/Forward re-derive the route from the pathname.
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname);
      setCurrentPage(route.page);
      setSelectedEvent(eventById(route.eventId));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Legacy "#events" links that arrive as a same-document hash change (no
  // reload) still migrate: rewrite to the clean path and follow it.
  useEffect(() => {
    const handleHashChange = () => {
      const legacy = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!KNOWN_SEGMENTS.includes(legacy) && !legacy.startsWith('event/')) return;
      migrateLegacyHash();
      const route = parseRoute(window.location.pathname);
      setCurrentPage(route.page);
      setSelectedEvent(eventById(route.eventId));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    applySeo(currentPage, selectedEvent);
  }, [currentPage, selectedEvent]);

  const navigateTo = (page: PageId) => {
    const url = routeUrl({ page, eventId: null });
    if (url !== window.location.pathname) window.history.pushState(null, '', url);
    setCurrentPage(page);
    setSelectedEvent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (event: ActivityEvent) => {
    setSelectedEvent(event);
  };

  const closeEvent = () => {
    if (parseRoute(window.location.pathname).eventId) {
      window.history.replaceState(null, '', routeUrl({ page: 'events', eventId: null }));
    }
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 font-sans selection:bg-[#ff7324] selection:text-white relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-3 focus:py-2 focus:rounded-lg focus:bg-[#10345e] focus:text-white focus:text-sm focus:font-bold">İçeriğe atla</a>
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
      <main id="main-content" tabIndex={-1} className="flex-1 relative z-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
              <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-cyan-400 animate-spin" />
              <span className="sr-only">Yükleniyor</span>
            </div>
          }
        >
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
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
      />

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        onClose={closeEvent}
      />

      {/* Floating Quick Action Widget (WhatsApp & Join) */}
      <aside
        aria-label="Hızlı İletişim"
        className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5"
      >
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
      </aside>
    </div>
  );
}

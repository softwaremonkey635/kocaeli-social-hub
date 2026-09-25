import React, { useState, useEffect, useRef } from 'react';
import { ActivityEvent } from '../types';
import { buttonProps } from '../utils/keyboard';
import { COMMUNITY_LINKS } from '../constants/links';
import {
  downloadIcs,
  formatTrDateTime,
  googleCalendarUrl,
  nextOccurrence,
  whatsappShareUrl
} from '../utils/calendar';
import {
  X,
  Calendar,
  CalendarPlus,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Share2,
  MessageCircle,
  Maximize2,
  ZoomIn,
  AlertCircle
} from 'lucide-react';

interface EventModalProps {
  event: ActivityEvent | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const lightboxOpenRef = useRef(isLightboxOpen);
  lightboxOpenRef.current = isLightboxOpen;

  // Escape closes the top-most layer (lightbox first, then the dialog) and
  // hands focus back to the control that opened it. The ref mirrors keep the
  // listener stable so focus is not yanked around on every re-render.
  useEffect(() => {
    if (!event) return;
    const trigger = document.activeElement as HTMLElement | null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightboxOpenRef.current) {
        setIsLightboxOpen(false);
        return;
      }
      onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [event]);

  if (!event) return null;

  const currentDisplayImage = selectedImage || event.image;
  const occurrence = nextOccurrence(event);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const randomTicket = `KOC-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomTicket);
    setIsRegistered(true);
  };

  const handleShare = () => {
    const text = `Kocaeli Social Hub - ${event.title} etkinliği! Katılmak ve detayları görmek için WhatsApp topluluğumuza katıl: ${COMMUNITY_LINKS.whatsappGroup}`;
    if (navigator.share) {
      navigator.share({
        title: `Kocaeli Social Hub - ${event.title}`,
        text: text,
        url: COMMUNITY_LINKS.whatsappGroup
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const downloadICS = () => downloadIcs(event);



  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${event.title} etkinlik detayı`}
          className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-800 max-h-[92vh] flex flex-col text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image area with full poster visibility button and click-to-open */}
          <div className="relative bg-slate-950 shrink-0">
            <div
              className="relative h-64 sm:h-80 w-full overflow-hidden flex items-center justify-center cursor-pointer group"
              onClick={() => setIsLightboxOpen(true)}
              {...buttonProps(() => setIsLightboxOpen(true), 'Afişi tam ekran aç')}
              title="Afişi tam boyutta görmek için tıklayın"
            >
              <img
                src={currentDisplayImage}
                alt={event.title}
                className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Center hover badge */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white font-bold text-xs shadow-xl flex items-center gap-2 backdrop-blur-md border border-slate-700 transform group-hover:scale-105 transition-transform">
                  <ZoomIn className="w-4 h-4 text-[#00bcd4]" />
                  <span>Afişi Tam Ekran Aç</span>
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105 shadow-lg border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quick full poster trigger button in top left */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md border border-slate-700"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#00bcd4]" />
              <span>Afişi Büyüt</span>
            </button>

            {/* Badges on bottom */}
            <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900/90 text-cyan-300 border border-slate-700 shadow-sm">
                {event.categoryName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f27721] text-slate-950">
                {event.pricing}
              </span>
              {event.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#009cb4] text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {event.badge}
                </span>
              )}
            </div>
          </div>

          {/* Sub-Images Switcher (Specifically for 3-in-1 Sunday workshop: Biblo, Çanta, Kil) */}
          {event.subImages && event.subImages.length > 0 && (
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-white">
                <span className="font-bold text-amber-400">3 Atölye Afişleri:</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  (Afişini incelemek istediğiniz atölyeyi seçin)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {event.subImages.map((sub, idx) => {
                  const isActive = currentDisplayImage === sub.image;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(sub.image)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#009cb4] text-slate-950 shadow-md ring-2 ring-white/50'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-4 h-4 rounded object-cover"
                      />
                      <span>{sub.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 flex items-center gap-1"
                  title="Görüntüyü büyüt"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Afişi İncele</span>
                </button>
              </div>
            </div>
          )}

          {/* Scrollable body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Title & Subtitle */}
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-sm font-semibold text-[#f27721] mt-1.5">
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* WhatsApp Specific Important Alert for 3-in-1 workshops */}
            {event.whatsappFocus && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/70 text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>Bu Etkinlik İçin WhatsApp Katılımı Esastır!</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  {event.whatsappNote ||
                    'Biblo, çanta ve kil boyama atölyelerimiz haftalık dönüşümlü olarak yapılır. O hafta hangisinin düzenleneceği ve mekan WhatsApp grubumuzda belirlenmektedir.'}
                </p>
                <div className="pt-1">
                  <a
                    href={COMMUNITY_LINKS.whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {event.id === 'camping'
                        ? 'Hemen WhatsApp Grubuna Katıl & Kamp Duyurularını Kaçırma'
                        : 'Hemen WhatsApp Grubuna Katıl & Oylamaya Dahil Ol'}
                    </span>
                  </a>
                </div>
              </div>
            )}

            {/* Key Facts grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="block text-slate-400 font-medium mb-1">GÜN</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-[#f27721]" />
                  <span>{event.day}</span>
                </div>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-1">SAAT</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-[#00bcd4]" />
                  <span>{event.time}</span>
                </div>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-1">LOKASYON</span>
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    WhatsApp Grubunda
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-slate-400 font-medium mb-1">KONTENJAN</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{event.capacity}</span>
                </div>
              </div>
            </div>

            {/* Takvim ve paylaşım aksiyonları */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {occurrence && (
                  <>
                    <button
                      type="button"
                      onClick={downloadICS}
                      aria-label="Etkinliği takvime ekle, ics dosyası indir"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-[#009cb4] transition-all duration-200 border border-slate-700/80 hover:border-cyan-400"
                    >
                      <CalendarPlus className="w-4 h-4 text-[#00bcd4]" />
                      <span>Takvime Ekle (.ics)</span>
                    </button>
                    <a
                      href={googleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Etkinliği Google Takvim'e ekle"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-[#f27721] transition-all duration-200 border border-slate-700/80 hover:border-[#f27721]"
                    >
                      <CalendarDays className="w-4 h-4 text-[#f27721]" />
                      <span>Google Takvim</span>
                    </a>
                  </>
                )}
                <a
                  href={whatsappShareUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Etkinliği WhatsApp'ta paylaş"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-emerald-600 transition-all duration-200 border border-slate-700/80 hover:border-emerald-500"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp'ta Paylaş</span>
                </a>
              </div>
              {occurrence ? (
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Sıradaki buluşma:{' '}
                  <span className="font-bold text-cyan-300">{formatTrDateTime(occurrence.start)}</span>
                </p>
              ) : (
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Bu etkinliğin tarihi WhatsApp grubunda duyurulur, takvime ekleme seçeneği kapalıdır.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                ETKİNLİK DETAYI
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {event.description}
              </p>
            </div>

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  ÖNE ÇIKANLAR &amp; KAZANIMLAR
                </h3>
                <ul className="space-y-2">
                  {event.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00bcd4] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules / Principles */}
            {event.rules && event.rules.length > 0 && (
              <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-900/60">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>TOPLULUK KURALLARI & ŞARTLARI</span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-200/90">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location Notice */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-950/40 rounded-2xl text-xs text-slate-300 border border-emerald-900/60">
              <div className="flex items-start sm:items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">
                  <strong>Buluşma Noktası &amp; Konum:</strong> Tüm etkinliklerimizin tam toplanma saati, konumu ve mekan detayları her hafta sadece <strong>WhatsApp Topluluk Grubumuzda</strong> paylaşılmaktadır.
                </span>
              </div>
              <button
                onClick={handleShare}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white font-bold border border-slate-700 shadow-sm self-end sm:self-auto cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00bcd4]" />
                <span>{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
              </button>
            </div>

            {/* Primary Action Section: WhatsApp Direct Joining */}
            <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0d223a] rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Etkinliğe Katılmak İçin WhatsApp Topluluğumuza Gel
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tüm koordinasyon, oylamalar, buluşma yerleri ve duyurular WhatsApp üzerinden yapılmaktadır.
                  </p>
                </div>
                <a
                  href={COMMUNITY_LINKS.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-600/30 text-sm shrink-0"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp ile Katıl</span>
                </a>
              </div>

              {/* Kurucu İletişim */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Sorularınız için kurucumuz <strong className="text-slate-200">{COMMUNITY_LINKS.founderName}</strong> ile iletişime geçebilirsiniz:
                </span>
                <a
                  href={`tel:${COMMUNITY_LINKS.founderPhoneRaw}`}
                  className="font-bold text-[#00bcd4] hover:text-[#f27721]"
                >
                  {COMMUNITY_LINKS.founderPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Size Image / Poster Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[95vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Lightbox */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Poster afişini kapat"
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-30 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Poster image */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl max-h-[82vh] flex items-center justify-center p-2 border border-slate-800">
              <img
                src={currentDisplayImage}
                alt={event.title}
                className="max-h-[78vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Sub-image tabs inside Lightbox if available */}
            {event.subImages && event.subImages.length > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-700">
                {event.subImages.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(sub.image)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentDisplayImage === sub.image
                        ? 'bg-[#009cb4] text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2 text-center text-xs text-slate-400">
              Kapatmak için dışarıya veya çarpıya tıklayın
            </div>
          </div>
        </div>
      )}
    </>
  );
};

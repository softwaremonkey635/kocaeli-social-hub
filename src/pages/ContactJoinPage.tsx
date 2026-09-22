import React, { useState } from 'react';
import { FAQ_DATA, DISTRICTS } from '../data/mockData';
import { COMMUNITY_LINKS } from '../constants/links';
import {
  MessageCircle,
  Instagram,
  ChevronDown,
  Sparkles,
  Heart,
  Send,
  HelpCircle,
  Phone,
  FileText,
  Check,
  Smile,
  MapPin
} from 'lucide-react';

export const ContactJoinPage: React.FC = () => {
  // Advanced self-introduction builder state
  const [quickName, setQuickName] = useState('');
  const [quickDistrict, setQuickDistrict] = useState('İzmit');
  const [quickRole, setQuickRole] = useState('Öğrenci (KOU)');
  
  // Community activity categories (with individual workshops listed directly in the same list)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Biblo & Alçı Boyama Atölyesi',
    'Doğa Yürüyüşü & Hiking (Kısa Mesafe)',
    'Speaking Club (İngilizce Sohbet)'
  ]);

  const [preferredTime, setPreferredTime] = useState('Hafta Sonu (Cumartesi / Pazar)');
  const [experienceLevel, setExperienceLevel] = useState('İlk Defa Katılacağım (Yeni Başlayan)');
  const [quickGoal, setQuickGoal] = useState('Yeni arkadaşlar edinmek & sosyalleşmek');
  const [customNote, setCustomNote] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const roleOptions = [
    'Öğrenci (KOU)',
    'Genç Çalışan / Profesyonel',
    'Yeni Mezun',
    'Kocaeli\'de İkamet Eden Genç'
  ];

  const communityActivities = [
    { id: 'biblo-workshop', label: 'Biblo & Alçı Boyama Atölyesi', icon: '🎨' },
    { id: 'canta-workshop', label: 'Bez Çanta Boyama Atölyesi', icon: '👜' },
    { id: 'kil-workshop', label: 'Kil & Seramik Şekillendirme Atölyesi', icon: '🏺' },
    { id: 'speaking', label: 'Speaking Club (İngilizce Sohbet)', icon: '🗣️' },
    { id: 'hiking', label: 'Doğa Yürüyüşü & Hiking (Kısa Mesafe)', icon: '🥾' },
    { id: 'camping', label: '4 Mevsim Gençlik Kampı', icon: '⛺' },
    { id: 'kitap', label: 'Kitap Kulübü & Edebiyat Söyleşisi', icon: '📚' },
    { id: 'dans', label: 'Halk Oyunları & Kültür Dansı', icon: '💃' },
    { id: 'games', label: 'Kutu Oyunları & Sosyal Sohbet', icon: '♟️' },
    { id: 'gezi', label: 'Şehir Kültür & Fotoğraf Gezisi', icon: '📸' }
  ];

  const timeOptions = [
    'Hafta Sonu (Cumartesi / Pazar)',
    'Hafta İçi Akşam (18:00 sonrası)',
    'Her Zaman Müsaitim (Esnek Zamanlı)'
  ];

  const experienceOptions = [
    'İlk Defa Katılacağım (Yeni Başlayan)',
    'Daha Önce Benzer Etkinliklere Katıldım',
    'Gönüllü Lider / Moderatör Olmak İsterim'
  ];

  const goalOptions = [
    'Yeni arkadaşlar edinmek & sosyalleşmek',
    'Hafta sonlarımı kaliteli hobilerle değerlendirmek',
    'Yabancı dil veya el sanatları pratiği yapmak',
    'Şehir stresini doğa & sanatla atmak'
  ];

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  // Generate dynamic preview text for WhatsApp
  const generateMessageText = () => {
    const namePart = quickName.trim() || 'bir arkadaş';
    const activitiesPart = selectedActivities.length > 0 
      ? selectedActivities.join(', ') 
      : 'Topluluk etkinlikleri';
    const notePart = customNote.trim() ? `\n💬 Ek Notum: ${customNote.trim()}` : '';

    return `Merhaba Murat Bey! Ben ${namePart} (${quickRole}), ${quickDistrict}'de yaşıyorum.

Kocaeli Sosyal topluluğunuza katılmak istiyorum.

🌟 İlgi Duyduğum Topluluk Etkinlikleri: ${activitiesPart}
⏰ Müsaitlik Durumum: ${preferredTime}
💡 Deneyim Durumu: ${experienceLevel}
🎯 Öncelikli Beklentim: ${quickGoal}${notePart}

Topluluk etkinliklerinde görüşmek üzere!`;
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(generateMessageText());
    window.open(`https://wa.me/${COMMUNITY_LINKS.founderPhoneRaw}?text=${encoded}`, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>DOĞRUDAN KATIL &amp; İLETİŞİM</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Kocaeli Sosyal&apos;e Katıl
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Uzun üyelik formları yok! İster tek tıkla doğrudan WhatsApp grubumuza girin, ister aşağıdaki sihirbazla kendinizi kurucumuza özel mesajla tanıtın.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Merged Single Unified Container */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          {/* TOP HALF: Fast One-Click WhatsApp Join */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white relative overflow-hidden border-b border-slate-800">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>TEK TIKLA DOĞRUDAN KATILIM</span>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                  WhatsApp Topluluk Grubumuz
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5 max-w-xl">
                  Haftalık 3&apos;ü bir arada workshoplar, İngilizce Speaking Club, doğa yürüyüşleri, buluşma saatleri ve canlı koordinasyon bu grupta paylaşılır.
                </p>
              </div>

              {/* Quick Community Stats */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <div className="font-extrabold text-sm sm:text-base text-white">3.400+</div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">Genç Katılımcı</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <div className="font-extrabold text-sm sm:text-base text-amber-300">5+ Etkinlik</div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">Her Hafta</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center">
                  <div className="font-extrabold text-sm sm:text-base text-cyan-300">Ücretsiz</div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">Açık Topluluk</div>
                </div>
              </div>

              {/* One Click Button */}
              <div className="pt-2">
                <a
                  href={COMMUNITY_LINKS.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  <span>WhatsApp Grubuna Şimdi Katıl</span>
                </a>
              </div>
            </div>
          </div>

          {/* TRANSITION BAR */}
          <div className="bg-slate-950/70 border-b border-slate-800 px-6 sm:px-8 py-3 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Gruptan önce kendini tanıtmak ister misin?</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Aşağıdan hazır mesaj oluşturup kurucumuza iletebilirsin 👇
            </span>
          </div>

          {/* BOTTOM HALF: Self-Intro Builder */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00bcd4]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GELİŞMİŞ TANIŞMA SİSTEMİ</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Kendini Tanıt &amp; Sana En Uygun Etkinlikleri Öğren
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aşağıdaki seçenekleri belirlediğinde sana özel bir WhatsApp tanışma mesajı hazırlanır. Tek tıkla kurucumuz Murat Bey&apos;e gönderebilirsin.
              </p>
            </div>

            <form onSubmit={handleSendDirectMessage} className="space-y-5">
              {/* Row 1: Name & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Adınız veya Lakabınız
                  </label>
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Örn: Eren Kaya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Kocaeli&apos;de Yaşadığınız İlçe
                  </label>
                  <select
                    value={quickDistrict}
                    onChange={(e) => setQuickDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-white"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Status / Role pills */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Durumunuz / Profiliniz
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roleOptions.map((role) => {
                    const isSelected = quickRole === role;
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => setQuickRole(role)}
                        className={`text-xs px-2.5 py-2 rounded-xl border font-medium text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#10345e] text-white border-cyan-500/50 font-bold shadow-xs'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: UNIFIED COMMUNITY ACTIVITIES (Workshops & Events together) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    İlgi Duyduğunuz Topluluk Etkinlikleri &amp; Atölyeler
                  </label>
                  <span className="text-[11px] text-cyan-400 font-bold">
                    {selectedActivities.length} seçildi
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {communityActivities.map((act) => {
                    const isSelected = selectedActivities.includes(act.label);
                    return (
                      <button
                        type="button"
                        key={act.id}
                        onClick={() => toggleActivity(act.label)}
                        className={`text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0e2a4a] to-[#009cb4] text-white border-cyan-400 font-bold shadow-xs'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{act.icon}</span>
                          <span className="truncate">{act.label}</span>
                        </span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: TIME AVAILABILITY & EXPERIENCE LEVEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ⏰ En Müsait Olduğunuz Zaman
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-white"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    💡 Katılım Düzeyi &amp; Yaklaşım
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-white"
                  >
                    {experienceOptions.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Primary Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  🎯 Topluluktan Öncelikli Beklentiniz
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {goalOptions.map((goal) => {
                    const isSelected = quickGoal === goal;
                    return (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => setQuickGoal(goal)}
                        className={`text-xs p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#10345e] text-white border-cyan-500/50 font-bold shadow-xs'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Optional Note */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Eklemek İstediğin Not veya Soru (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Örn: Hafta sonları müsaitim, trekking deneyimim var..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950 text-white"
                />
              </div>

              {/* LIVE WHATSAPP MESSAGE PREVIEW BUBBLE */}
              <div className="rounded-2xl bg-emerald-950/40 border border-emerald-800/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Oluşturulan WhatsApp Mesaj Önizlemen</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Murat Malkoç&apos;a iletilecek
                  </span>
                </div>
                <div className="bg-slate-950 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed border border-slate-800 shadow-2xs whitespace-pre-wrap">
                  {generateMessageText()}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Bu Mesajı WhatsApp&apos;tan Murat Bey&apos;e Gönder</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Direct Channels */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#f8a834]">
                DOĞRUDAN İLETİŞİM
              </span>
              <h3 className="font-display text-xl font-bold mt-1">
                Yetkili Kanallarımız
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kocaeli Sosyal yönetimi ve kurucu koordinasyonuna direkt ulaşabileceğiniz resmi iletişim noktaları.
              </p>
            </div>

            <div className="space-y-3">
              {/* Founder Contact */}
              <a
                href={COMMUNITY_LINKS.founderWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 block uppercase">
                    KURUCU / GENEL KOORDİNATÖR
                  </span>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300">
                    {COMMUNITY_LINKS.founderName}: {COMMUNITY_LINKS.founderPhone}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Doğrudan arama veya WhatsApp
                  </span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={COMMUNITY_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-orange-950/40 border border-slate-800 hover:border-[#f27721]/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    RESMİ INSTAGRAM SAYFASI
                  </span>
                  <p className="text-sm font-bold text-white group-hover:text-amber-300">
                    {COMMUNITY_LINKS.instagramHandle}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Haftalık reels, fotoğraflar ve hikayeler
                  </span>
                </div>
              </a>
            </div>

            {/* Yetkili / Lider Başvurusu Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Yetkili &amp; Kulüp Lideri Başvurusu</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kocaeli Sosyal ekibinde aktif rol almak, etkinlik organize etmek veya kulüp lideri olmak ister misin?
              </p>
              {COMMUNITY_LINKS.leaderApplicationForm && (
                <a
                  href={COMMUNITY_LINKS.leaderApplicationForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                >
                  <span>Google Form Başvuru Formunu Doldur</span>
                </a>
              )}
            </div>

            {/* Buluşma Noktaları */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[#00bcd4] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>BULUŞMA NOKTALARI &amp; SAATLER</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Etkinliklerin tam toplanma saati ve mekan konumları (İzmit Sekapark, Yahya Kaptan kafeleri, doğa rotaları) her hafta <strong>WhatsApp Topluluk Grubumuzda</strong> koordinatörlerimiz tarafından anlık olarak paylaşılmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="space-y-6 max-w-4xl mx-auto pt-4">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <HelpCircle className="w-4 h-4" />
            <span>SIKÇA SORULAN SORULAR</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Aklınıza Takılan Sorular &amp; Cevaplar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Etkinliklerimize ilk kez katılacak olan arkadaşlarımızın en çok sorduğu sorular.
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-white hover:text-cyan-300 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#f27721]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

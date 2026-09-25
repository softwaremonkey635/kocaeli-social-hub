import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { BlogPost } from '../types';
import { COMMUNITY_LINKS } from '../constants/links';
import { HistoryTodayWidget } from '../components/HistoryTodayWidget';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Tag,
  Share2,
  X,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Pin,
  Send
} from 'lucide-react';

interface BlogPageProps {
  onNavigateToJoin?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['Tümü', 'Duyuru', 'Rehber', 'Topluluk', 'Etkinlik Notları'];

  // Filter posts based on category and search query
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'Tümü' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const pinnedPost = BLOG_POSTS.find((p) => p.isPinned);

  const handleShare = (post: BlogPost) => {
    const text = `${post.title} - Kocaeli Sosyal Hub Duyurular & Blog`;
    if (navigator.share) {
      navigator.share({ title: post.title, text, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = `${text} ${window.location.href}`;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-[#00bcd4] border border-cyan-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DUYURULAR, YAZILAR &amp; REHBERLER</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Kocaeli Sosyal Blog
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Topluluk duyuruları, etkinlik rehberleri, atölye deneyimleri ve gençlik buluşmalarımızdan en güncel haberler burada.
        </p>
      </div>

      {/* VİKİPEDİ TÜRKÇE: TARİHTE BUGÜN */}
      <div className="max-w-4xl mx-auto">
        <HistoryTodayWidget />
      </div>

      {/* Pinned Announcement Card */}
      {pinnedPost && selectedCategory === 'Tümü' && !searchQuery && (
        <div className="bg-gradient-to-br from-[#10345e] via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#00bcd4]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f27721] text-white shadow-xs">
                  <Pin className="w-3 h-3" />
                  <span>Önemli Duyuru</span>
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {pinnedPost.date} • {pinnedPost.readTime}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                {pinnedPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {pinnedPost.excerpt}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="btn-read-pinned-post"
                  onClick={() => setActivePost(pinnedPost)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Duyurunun Devamını Oku</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={COMMUNITY_LINKS.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Topluluk Grubuna Katıl</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-56 sm:h-64 border border-slate-800">
                <img
                  src={pinnedPost.image}
                  alt={pinnedPost.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yazı veya duyuru ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00bcd4] bg-slate-900 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-white">
            Aramanızla eşleşen yazı bulunamadı
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Farklı bir anahtar kelime deneyebilir veya kategori filtresini sıfırlayabilirsiniz.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Tümü');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-md hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image Container */}
              <div
                className="relative h-48 sm:h-52 overflow-hidden cursor-pointer"
                onClick={() => setActivePost(post)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-cyan-300 border border-slate-700 shadow-xs">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#00bcd4]" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#f27721]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => setActivePost(post)}
                    className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug cursor-pointer"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer info & Read button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-medium text-slate-400 truncate">
                    <span className="font-semibold text-slate-200">{post.author.name}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{post.author.role}</span>
                  </div>

                  <button
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00bcd4] hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Devamı</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Community Contribution Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TOPLULUK KALEMİ</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold">
            Bir Yazı, Deneyim veya Duyuru Paylaşmak İster misiniz?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Atölye deneyiminizi kaleme almak, kamp anılarınızı fotoğraflarla paylaşmak veya duyuru yapmak isterseniz bize doğrudan WhatsApp üzerinden yazabilirsiniz!
          </p>
        </div>

        <a
          href={COMMUNITY_LINKS.founderWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Yazını İlet (WhatsApp)</span>
        </a>
      </div>

      {/* Full Post Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 my-8">
            {/* Modal Header Cover */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={activePost.image}
                alt={activePost.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f27721] text-white">
                  {activePost.category}
                </span>
                <h2 className="font-display text-lg sm:text-2xl font-extrabold leading-tight">
                  {activePost.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Author and Date Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                    {activePost.author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{activePost.author.name}</span>
                    <span className="text-[11px] text-slate-400">{activePost.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                  <button
                    onClick={() => handleShare(activePost)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                    title="Paylaş"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {copied && <span className="text-emerald-400 text-xs font-bold">Kopyalandı!</span>}
                </div>
              </div>

              {/* Post Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {activePost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {activePost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Modal CTA Footer */}
              <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={COMMUNITY_LINKS.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Topluluğumuzda Tartış</span>
                </a>

                <button
                  onClick={() => setActivePost(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { GALLERY_DATA } from '../data/mockData';
import { GalleryItem, EventCategory } from '../types';
import { Camera, MapPin, Calendar, X } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<EventCategory | 'all'>('all');

  const filteredItems = filter === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((i) => i.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
          <Camera className="w-3.5 h-3.5" />
          <span>TOPLULUK ANILARI</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Etkinliklerimizden Kareler
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Kocaeli’nin doğasında, atölye masalarında ve sahil sohbetlerinde gençlerin paylaştığı unutulmaz anlar.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Tüm Fotoğraflar ({GALLERY_DATA.length})
        </button>
        <button
          onClick={() => setFilter('language')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'language'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Speaking Club
        </button>
        <button
          onClick={() => setFilter('nature')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'nature'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Hiking &amp; Kamp
        </button>
        <button
          onClick={() => setFilter('art')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'art'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Sanat Atölyeleri
        </button>
        <button
          onClick={() => setFilter('culture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'culture'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Kitap &amp; Kültür
        </button>
        <button
          onClick={() => setFilter('dance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'dance'
              ? 'bg-[#10345e] text-white border border-cyan-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Halk Oyunları
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-64"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f8a834]">
                {item.activity}
              </span>
              <h4 className="font-display font-bold text-sm leading-snug line-clamp-1 mt-0.5 text-white">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00bcd4]" />
                  {item.location}
                </span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Kapat"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="w-full max-h-[75vh] object-contain bg-slate-950"
            />

            <div className="p-6 text-white space-y-1 bg-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f8a834]">
                {selectedPhoto.activity}
              </span>
              <h3 className="font-display text-xl font-bold">
                {selectedPhoto.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00bcd4]" />
                  {selectedPhoto.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPhoto.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Search, MapPin, Sparkles, Compass } from 'lucide-react';
import { CATEGORIES } from '../data/categories.js';
import { TourismCategory } from '../types/tourism.js';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: TourismCategory | 'all';
  setSelectedCategory: (cat: TourismCategory | 'all') => void;
  onExploreNearMe: () => void;
  onExploreAll: () => void;
  totalDestinations: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreNearMe,
  onExploreAll,
  totalDestinations,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#E8EBE2]/40 via-[#F7F4ED] to-[#F7F4ED] border-b border-[#E8EBE2]">
      {/* Decorative Subtle Compass Radial Background */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#354D43 1.5px, transparent 1.5px), radial-gradient(#C9A982 1.5px, #F7F4ED 1.5px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Search Block */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Lokavi Brand Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#E8EBE2] border border-[#DFCEB7]/70 text-xs font-semibold text-[#354D43]">
              <span className="w-2 h-2 rounded-full bg-[#C9A982] animate-pulse" />
              <span className="tracking-wide">lokavi · Discover the Local Within</span>
              <span className="text-[#C9A982] text-[11px]">|</span>
              <span className="text-[11px] font-medium text-[#53626F]">भारत</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-heritage text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#29323A] leading-[1.14]">
                Discover Incredible India, <br />
                <span className="text-[#354D43] italic">One Place</span> at a Time.
              </h1>
              <p className="text-base sm:text-lg text-[#53626F] max-w-xl font-normal leading-relaxed">
                Explore hidden gems, local culture, food, shops, and unforgettable experiences near you. From ancient Sahyadri fortresses and sacred ghats to vibrant bazaars and coastal retreats.
              </p>
            </div>

            {/* Interactive Search Bar */}
            <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#DFCEB7] flex flex-col sm:flex-row gap-2.5 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-[#C9A982] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city (Pune, Shirpur), state, attraction, shop, or food..."
                  className="w-full text-sm text-[#29323A] placeholder-[#53626F]/70 bg-transparent outline-none py-1.5"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#53626F] hover:text-[#29323A] px-1 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onExploreNearMe}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E8EBE2] hover:bg-[#DFCEB7]/50 text-[#354D43] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#DFCEB7] active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C9A982]" />
                  <span>Near Me</span>
                </button>
                <button
                  onClick={onExploreAll}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#354D43] hover:bg-[#24352E] text-[#F7F4ED] text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C9A982]" />
                  <span>Explore</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Categories */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-[#53626F] uppercase tracking-wider block">
                Popular Categories:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#354D43] text-[#F7F4ED] shadow-xs'
                      : 'bg-white border border-[#DFCEB7] text-[#29323A] hover:bg-[#E8EBE2]'
                  }`}
                >
                  All Places ({totalDestinations})
                </button>
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-[#354D43] text-[#F7F4ED] shadow-xs'
                        : 'bg-white border border-[#DFCEB7] text-[#29323A] hover:bg-[#E8EBE2]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Visual Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3 group">
                <img
                  src="https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80"
                  alt="Incredible Maharashtra Fort & Sahyadris"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] font-semibold text-[#C9A982] uppercase tracking-wider">
                    Maharashtra · सह्याद्रीचे किल्ले
                  </div>
                  <h3 className="font-heritage text-lg font-bold">
                    Sinhagad & Sahyadri Mountain Fortresses
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-1 mt-0.5 font-light">
                    Ancient battlements, cloud carpets & piping hot Pithla Bhakri
                  </p>
                </div>
              </div>

              {/* Floating Mini Highlight Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-2xl p-3 shadow-lg border border-[#DFCEB7] flex items-center gap-3 max-w-xs animate-in fade-in duration-500">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=200&q=80"
                  alt="Taj Mahal Agra"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-[10px] font-bold text-[#354D43] uppercase tracking-wider">
                    Iconic Heritage
                  </div>
                  <div className="text-xs font-bold text-[#29323A]">
                    Agra & Varanasi Ghats
                  </div>
                  <div className="text-[11px] text-[#53626F]">
                    35+ Curated Regional Guides
                  </div>
                </div>
              </div>

              {/* Floating Local Food & Bazaar Tag */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#354D43] text-[#F7F4ED] rounded-2xl px-3.5 py-2 shadow-md flex items-center gap-2 border border-[#C9A982]/30">
                <span className="text-base">🛍️</span>
                <div>
                  <div className="text-[10px] text-[#C9A982] font-semibold tracking-wider uppercase">Local Within</div>
                  <div className="text-xs font-bold text-white">Shops, Bazaars & Bites</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

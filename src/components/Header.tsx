import React, { useState } from 'react';
import { Compass, MapPin, Calendar, Heart, Menu, X, Info, Store } from 'lucide-react';
import { LokaviLogo } from './LokaviLogo.js';

interface HeaderProps {
  activeTab: 'home' | 'explorer' | 'near-me' | 'planner' | 'shops';
  setActiveTab: (tab: 'home' | 'explorer' | 'near-me' | 'planner' | 'shops') => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenApiInfo: () => void;
  onTriggerNearMe: () => void;
  isGpsActive: boolean;
  gpsCityName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wishlistCount,
  onOpenWishlist,
  onOpenApiInfo,
  onTriggerNearMe,
  isGpsActive,
  gpsCityName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'explorer', label: 'All India Explorer', icon: Compass },
    { id: 'shops', label: 'Local Shops', icon: Store },
    { id: 'near-me', label: 'Explore Near Me', icon: MapPin },
    { id: 'planner', label: 'Weekend Planner', icon: Calendar },
  ] as const;

  const handleNavClick = (id: 'home' | 'explorer' | 'near-me' | 'planner' | 'shops') => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#E8EBE2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center"
            title="lokavi – Discover the Local Within"
          >
            <LokaviLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#E8EBE2]/60 p-1.5 rounded-2xl border border-[#DFCEB7]/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#354D43] text-[#F7F4ED] shadow-xs'
                      : 'text-[#29323A]/80 hover:text-[#29323A] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9A982]' : 'text-[#53626F]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Near Me Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Near Me Trigger */}
            <button
              onClick={() => {
                onTriggerNearMe();
                setActiveTab('near-me');
              }}
              className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition ${
                isGpsActive
                  ? 'bg-[#354D43] text-[#F7F4ED] border-[#354D43]'
                  : 'bg-[#E8EBE2] text-[#354D43] border-[#DFCEB7] hover:bg-[#DFCEB7]/40'
              }`}
              title="Locate attractions near your current spot"
            >
              <MapPin className="w-3.5 h-3.5 animate-bounce text-[#C9A982]" />
              <span>{isGpsActive && gpsCityName ? `Near: ${gpsCityName}` : 'Near Me'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl border border-[#DFCEB7] bg-white text-[#29323A] hover:text-[#354D43] hover:border-[#354D43]/40 transition shadow-2xs"
              aria-label="View Saved Places"
              title="Saved Places Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#354D43] text-[#354D43]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#354D43] text-[#F7F4ED] text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* API Setup Information Modal */}
            <button
              onClick={onOpenApiInfo}
              className="p-2.5 rounded-xl border border-[#DFCEB7] bg-white text-[#53626F] hover:text-[#29323A] hover:bg-[#E8EBE2]/40 transition shadow-2xs"
              title="API & Architecture Overview"
              aria-label="API Integration Guide"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl border border-[#DFCEB7] bg-white text-[#29323A]"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#354D43] text-[#354D43]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#354D43] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#DFCEB7] bg-white text-[#29323A]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8EBE2] bg-[#F7F4ED] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#354D43] text-[#F7F4ED]'
                    : 'text-[#29323A] hover:bg-[#E8EBE2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A982]' : 'text-[#354D43]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-[#DFCEB7] flex items-center justify-between">
            <button
              onClick={() => {
                onTriggerNearMe();
                handleNavClick('near-me');
              }}
              className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#354D43] text-[#F7F4ED]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C9A982]" />
              <span>Explore Near Me</span>
            </button>

            <button
              onClick={() => {
                onOpenApiInfo();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#53626F] underline flex items-center gap-1 font-medium"
            >
              <Info className="w-3.5 h-3.5" /> API Instructions
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Destination } from '../types/tourism.js';
import { X, Heart, Trash2, ArrowRight, MapPin } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onRemoveFromWishlist: (destId: string) => void;
  onClearWishlist: () => void;
  onPlanTripWithWishlist: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  destinations,
  onSelectDestination,
  onRemoveFromWishlist,
  onClearWishlist,
  onPlanTripWithWishlist,
}) => {
  if (!isOpen) return null;

  const wishlistedDestinations = destinations.filter((d) => wishlistIds.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#F7F4ED] h-full shadow-2xl border-l border-[#DFCEB7] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8EBE2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8EBE2] text-[#354D43] flex items-center justify-center border border-[#DFCEB7]/70">
              <Heart className="w-4 h-4 fill-[#354D43]" />
            </div>
            <div>
              <h3 className="font-heritage text-base font-bold text-[#29323A]">
                Saved Places & Wishlist
              </h3>
              <p className="text-[11px] text-[#53626F]">
                {wishlistedDestinations.length} destination{wishlistedDestinations.length === 1 ? '' : 's'} saved in lokavi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#53626F] hover:text-[#29323A] rounded-xl hover:bg-[#E8EBE2]"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedDestinations.length > 0 ? (
            wishlistedDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => {
                  onSelectDestination(dest);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-[#E8EBE2]/50 rounded-2xl border border-[#DFCEB7]/80 transition flex items-center gap-3 cursor-pointer group shadow-2xs"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-[#53626F] uppercase flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#C9A982]" />
                    <span>{dest.city}, {dest.state}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#29323A] group-hover:text-[#354D43] truncate">
                    {dest.name}
                  </h4>
                  <p className="text-[11px] text-[#53626F] line-clamp-1">
                    {dest.categories.slice(0, 2).join(' · ')}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(dest.id);
                  }}
                  className="p-2 text-[#53626F] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#53626F]">
              <Heart className="w-10 h-10 text-[#DFCEB7]" />
              <p className="text-xs">
                Your lokavi saved list is empty. Tap the heart icon on any destination card to save places for your upcoming journey.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {wishlistedDestinations.length > 0 && (
          <div className="p-4 border-t border-[#E8EBE2] bg-white space-y-2">
            <button
              onClick={() => {
                onPlanTripWithWishlist();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#354D43] hover:bg-[#24352E] text-[#F7F4ED] text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
            >
              <span>Plan Weekend Trip with These</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A982]" />
            </button>

            <button
              onClick={onClearWishlist}
              className="w-full py-2 text-xs text-[#53626F] hover:text-rose-700 font-medium"
            >
              Clear All Saved Places
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

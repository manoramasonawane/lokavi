import React from 'react';
import { LocalShop } from '../types/shops.js';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Star, 
  Clock, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/geo.js';

interface ShopCardProps {
  shop: LocalShop;
  onSelect: (shop: LocalShop) => void;
  userCoords?: { lat: number; lng: number };
  calculatedDistanceKm?: number;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  onSelect,
  userCoords,
  calculatedDistanceKm,
}) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(
    `${shop.name}, ${shop.locality}, ${shop.city}`,
    shop.coordinates.lat,
    shop.coordinates.lng,
    userCoords?.lat,
    userCoords?.lng
  );

  return (
    <div
      onClick={() => onSelect(shop)}
      className="bg-white rounded-3xl border border-[#DFCEB7]/80 overflow-hidden hover:border-[#354D43] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-16/9 overflow-hidden bg-[#E8EBE2]">
          <img
            src={shop.image}
            alt={shop.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-[#29323A]/80 backdrop-blur-md text-[#F7F4ED] text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
              {shop.categoryLabel}
            </span>

            {calculatedDistanceKm !== undefined ? (
              <span className="bg-[#354D43]/90 backdrop-blur-md text-[#E8EBE2] text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                <MapPin className="w-3 h-3 text-[#C9A982]" />
                <span>{calculatedDistanceKm} km away</span>
              </span>
            ) : shop.distanceFromAttractionKm !== undefined ? (
              <span className="bg-[#29323A]/70 backdrop-blur-md text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10">
                ~{shop.distanceFromAttractionKm} km from sight
              </span>
            ) : null}
          </div>

          {/* Bottom Overlay: Open Status & Rating */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <span className={`w-2 h-2 rounded-full ${shop.isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>{shop.isOpenNow ? 'Open Now' : 'Closed'}</span>
            </div>

            {shop.rating !== undefined && (
              <div className="flex items-center gap-1 font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{shop.rating.toFixed(1)}</span>
                {shop.reviewsCount && (
                  <span className="text-white/70 font-normal text-[10px]">({shop.reviewsCount})</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          
          <div className="space-y-1">
            {/* Unboxed Metadata */}
            <div className="flex items-center gap-1.5 text-xs text-[#53626F] font-medium">
              <span>{shop.city}</span>
              <span aria-hidden="true">·</span>
              <span>PIN {shop.pinCode}</span>
              {shop.isVerified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#354D43] font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#354D43] inline" /> Verified
                  </span>
                </>
              )}
            </div>

            <h3 className="font-heritage text-base sm:text-lg font-bold text-[#29323A] group-hover:text-[#354D43] transition-colors leading-snug">
              {shop.name}
            </h3>
            {shop.localName && (
              <p className="text-xs text-[#53626F] font-medium">
                {shop.localName}
              </p>
            )}
          </div>

          {/* Address & Near Destination context */}
          <div className="space-y-1.5 text-xs text-[#53626F]">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A982] shrink-0 mt-0.5" />
              <span className="line-clamp-2 font-light">{shop.address}, {shop.locality}</span>
            </div>

            {shop.nearDestinationName && (
              <div className="text-[11px] text-[#29323A] bg-[#E8EBE2]/60 px-3 py-1 rounded-xl border border-[#DFCEB7]/60">
                📍 Near: <strong className="text-[#354D43]">{shop.nearDestinationName}</strong>
              </div>
            )}

            {shop.timings && (
              <div className="flex items-center gap-1.5 text-[#53626F] text-[11px] pt-1">
                <Clock className="w-3 h-3 text-[#354D43]" />
                <span className="truncate">{shop.timings}</span>
              </div>
            )}
          </div>

          {/* Specialties snippet */}
          {shop.specialties && shop.specialties.length > 0 && (
            <div className="pt-2 border-t border-[#E8EBE2]">
              <div className="text-[11px] text-[#53626F]">
                Specialties: <span className="text-[#29323A] font-medium">{shop.specialties.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-[#E8EBE2] flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#354D43] hover:bg-[#24352E] text-white flex items-center gap-1.5 transition shadow-2xs active:scale-95"
              title="Directions via Google Maps"
            >
              <Navigation className="w-3 h-3 text-[#C9A982]" />
              <span>Directions</span>
            </a>

            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#DFCEB7] bg-[#F7F4ED] hover:bg-[#E8EBE2] text-[#29323A] flex items-center gap-1.5 transition"
                title="Call Shop"
              >
                <Phone className="w-3 h-3 text-[#354D43]" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
          </div>

          <button
            onClick={() => onSelect(shop)}
            className="text-xs font-bold text-[#354D43] group-hover:underline flex items-center gap-0.5"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Transparent sample data badge */}
        {shop.isSampleDemonstration && (
          <div className="mt-2 text-[10px] text-[#53626F]/80 text-right italic">
            Demonstration data (verified landmark)
          </div>
        )}
      </div>

    </div>
  );
};

import React from 'react';
import { Destination } from '../types/tourism.js';
import { Heart, MapPin, Navigation, Star, Clock, Utensils, ShieldCheck } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/geo.js';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
  isWishlisted: boolean;
  onToggleWishlist: (destId: string, e: React.MouseEvent) => void;
  calculatedDistanceKm?: number;
  userCoords?: { lat: number; lng: number };
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  calculatedDistanceKm,
  userCoords,
}) => {
  const directionsUrl = getGoogleMapsDirectionsUrl(
    `${destination.name}, ${destination.city}, ${destination.state}`,
    destination.coordinates.lat,
    destination.coordinates.lng,
    userCoords?.lat,
    userCoords?.lng
  );

  return (
    <div
      onClick={() => onSelect(destination)}
      className="bg-white rounded-3xl border border-[#DFCEB7]/80 overflow-hidden hover:border-[#354D43] hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Thumbnail Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#E8EBE2]">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Distance indicator if location is active */}
          {calculatedDistanceKm !== undefined ? (
            <div className="bg-[#29323A]/85 backdrop-blur-md text-[#F7F4ED] text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
              <MapPin className="w-3 h-3 text-[#C9A982]" />
              <span>{calculatedDistanceKm} km away</span>
            </div>
          ) : (
            <div className="bg-[#29323A]/75 backdrop-blur-md text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10">
              {destination.state}
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={(e) => onToggleWishlist(destination.id, e)}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#53626F] hover:text-[#354D43] flex items-center justify-center transition shadow-xs cursor-pointer"
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            title={isWishlisted ? 'Saved' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#354D43] text-[#354D43]' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: City and Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#C9A982]" />
            <span className="truncate">{destination.city}, {destination.district}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{destination.rating.toFixed(1)}</span>
            <span className="text-white/70 font-normal text-[10px]">({destination.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#53626F] font-medium">
            <span>{destination.region} India</span>
            <span aria-hidden="true">·</span>
            <span>{destination.categories.slice(0, 2).join(' / ').replace('_', ' ')}</span>
            {destination.entryFee.isVerified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#354D43] flex items-center gap-0.5 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-[#354D43] inline" /> Verified
                </span>
              </>
            )}
          </div>

          {/* Destination Title & Local Name */}
          <h3 className="font-heritage text-lg font-bold text-[#29323A] group-hover:text-[#354D43] transition-colors leading-snug">
            {destination.name}
          </h3>
          {destination.localName && (
            <p className="text-xs text-[#53626F] font-medium">
              {destination.localName}
            </p>
          )}

          {/* Description snippet */}
          <p className="text-xs text-[#53626F] line-clamp-2 leading-relaxed pt-0.5 font-light">
            {destination.description}
          </p>
        </div>

        {/* Best Season & Food Highlights */}
        <div className="pt-2 border-t border-[#E8EBE2] space-y-2 text-xs">
          
          <div className="flex items-center gap-2 text-[#53626F]">
            <Clock className="w-3.5 h-3.5 text-[#354D43] shrink-0" />
            <span className="truncate">
              <strong>Best time:</strong> {destination.bestTimeToVisit.split('(')[0]}
            </span>
          </div>

          {destination.localFood[0] && (
            <div className="flex items-center gap-2 text-[#53626F]">
              <Utensils className="w-3.5 h-3.5 text-[#C9A982] shrink-0" />
              <span className="truncate">
                <strong>Try:</strong> {destination.localFood[0].name}
              </span>
            </div>
          )}

        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#E8EBE2] flex items-center justify-between gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-[#354D43] hover:text-[#24352E] flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-lg hover:bg-[#E8EBE2]/60 transition"
            title="Open directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Map Directions</span>
          </a>

          <button
            onClick={() => onSelect(destination)}
            className="text-xs font-bold text-[#354D43] group-hover:underline flex items-center gap-1"
          >
            <span>View Details</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
};

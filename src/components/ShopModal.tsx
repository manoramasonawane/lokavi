import React from 'react';
import { LocalShop } from '../types/shops.js';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  CreditCard, 
  Car,
  Footprints,
  Bus,
  Sparkles
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/geo.js';

interface ShopModalProps {
  shop: LocalShop | null;
  onClose: () => void;
  userCoords?: { lat: number; lng: number };
}

export const ShopModal: React.FC<ShopModalProps> = ({ shop, onClose, userCoords }) => {
  if (!shop) return null;

  const baseDirectionsUrl = getGoogleMapsDirectionsUrl(
    `${shop.name}, ${shop.locality}, ${shop.city}, ${shop.pinCode}`,
    shop.coordinates.lat,
    shop.coordinates.lng,
    userCoords?.lat,
    userCoords?.lng
  );

  const drivingUrl = `${baseDirectionsUrl}&travelmode=driving`;
  const walkingUrl = `${baseDirectionsUrl}&travelmode=walking`;
  const transitUrl = `${baseDirectionsUrl}&travelmode=transit`;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#F7F4ED] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#DFCEB7] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Header */}
        <div className="relative aspect-16/9 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-[#29323A]/80 backdrop-blur-md text-[#F7F4ED] text-xs font-semibold px-3 py-1 rounded-xl border border-white/10">
              {shop.categoryLabel}
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition"
              aria-label="Close Shop Details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#C9A982] font-semibold uppercase tracking-wider">
              <span>{shop.locality}, {shop.city}</span>
              {shop.localName && (
                <>
                  <span>·</span>
                  <span>{shop.localName}</span>
                </>
              )}
            </div>

            <h2 className="font-heritage text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              {shop.name}
            </h2>

            <div className="flex items-center gap-3 pt-0.5 text-xs text-white/80">
              <div className="flex items-center gap-1.5 font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <span className={`w-2 h-2 rounded-full ${shop.isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span>{shop.isOpenNow ? 'Open Now' : 'Currently Closed'}</span>
              </div>
              {shop.rating !== undefined && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{shop.rating.toFixed(1)}</span>
                    {shop.reviewsCount && <span className="text-white/70 font-normal">({shop.reviewsCount} reviews)</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-[#29323A]">
          
          {/* Address & Near Destination context */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFCEB7] space-y-2">
            <div className="flex items-start gap-2 text-xs text-[#53626F]">
              <MapPin className="w-4 h-4 text-[#C9A982] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#29323A] text-sm font-bold">
                  {shop.address}
                </strong>
                <span className="font-light">{shop.locality}, {shop.city}, {shop.district}, {shop.state} – PIN {shop.pinCode}</span>
              </div>
            </div>

            {shop.nearDestinationName && (
              <div className="text-xs text-[#53626F] pt-2 border-t border-[#E8EBE2]">
                Tourist attraction proximity: <strong className="text-[#354D43]">{shop.nearDestinationName}</strong>
                {shop.distanceFromAttractionKm !== undefined && ` (~${shop.distanceFromAttractionKm} km)`}
              </div>
            )}
          </div>

          {/* Timings & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {shop.timings && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#DFCEB7] space-y-1">
                <div className="text-[#53626F] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#354D43]" /> Operating Hours
                </div>
                <div className="font-semibold text-[#29323A]">
                  {shop.timings}
                </div>
              </div>
            )}

            {shop.phone && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#DFCEB7] space-y-1">
                <div className="text-[#53626F] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#354D43]" /> Contact Number
                </div>
                <a
                  href={`tel:${shop.phone}`}
                  className="font-bold text-[#354D43] hover:underline transition block"
                >
                  {shop.phone}
                </a>
              </div>
            )}
          </div>

          {/* Specialties Checklist */}
          {shop.specialties && shop.specialties.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A982]" /> Available Products & Specialties
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {shop.specialties.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-xl bg-white border border-[#DFCEB7] text-[#29323A] font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {shop.paymentMethods && shop.paymentMethods.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#53626F] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#53626F]" /> Accepted Payments
              </span>
              <div className="text-xs text-[#53626F]">
                {shop.paymentMethods.join(' · ')}
              </div>
            </div>
          )}

          {/* Google Maps Directions with Driving, Walking, Transit */}
          <div className="p-4 rounded-2xl bg-[#E8EBE2]/60 border border-[#DFCEB7] space-y-2.5">
            <span className="text-xs font-bold text-[#354D43] block">
              Directions in Google Maps
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={drivingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#354D43] hover:bg-[#24352E] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95"
              >
                <Car className="w-3.5 h-3.5 text-[#C9A982]" />
                <span>Driving Route</span>
              </a>

              <a
                href={walkingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCEB7] hover:bg-[#E8EBE2] text-[#29323A] text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              >
                <Footprints className="w-3.5 h-3.5 text-[#354D43]" />
                <span>Walking Path</span>
              </a>

              <a
                href={transitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCEB7] hover:bg-[#E8EBE2] text-[#29323A] text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              >
                <Bus className="w-3.5 h-3.5 text-[#354D43]" />
                <span>Public Transit</span>
              </a>
            </div>
          </div>

          {/* Demonstration Notice */}
          {shop.isSampleDemonstration && (
            <div className="text-[11px] text-[#53626F] italic bg-white p-2.5 rounded-xl border border-[#DFCEB7]">
              ℹ️ Sample demonstration data based on verified regional commercial hubs and artisan traditions.
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-[#E8EBE2] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#53626F]">
            lokavi Local Business Directory
          </div>

          <div className="flex items-center gap-2">
            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="px-4 py-2 rounded-xl bg-[#E8EBE2] border border-[#DFCEB7] text-[#354D43] text-xs font-bold hover:bg-[#DFCEB7]/50 transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Shop</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#354D43] text-white text-xs font-bold hover:bg-[#24352E] transition active:scale-95"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

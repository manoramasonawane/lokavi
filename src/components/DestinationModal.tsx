import React, { useState } from 'react';
import { Destination } from '../types/tourism.js';
import { 
  X, 
  MapPin, 
  Heart, 
  Share2, 
  Navigation, 
  Clock, 
  Ticket, 
  ShieldCheck, 
  AlertCircle, 
  Utensils, 
  Lightbulb, 
  Compass, 
  Star, 
  ChevronRight, 
  Check,
  CloudSun,
  Store,
  ShoppingBag
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/geo.js';
import { WeatherWidget } from './WeatherWidget.js';
import { LOCAL_SHOPS } from '../data/shops.js';
import { ShopCard } from './ShopCard.js';
import { ShopModal } from './ShopModal.js';
import { LocalShop } from '../types/shops.js';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (destId: string, e: React.MouseEvent) => void;
  onSelectRelatedDestination?: (destName: string) => void;
  onNavigateToShops?: (attractionId: string) => void;
  userCoords?: { lat: number; lng: number };
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onSelectRelatedDestination,
  onNavigateToShops,
  userCoords,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'weather' | 'culture' | 'food' | 'tips'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedShopModal, setSelectedShopModal] = useState<LocalShop | null>(null);

  if (!destination) return null;

  const directionsUrl = getGoogleMapsDirectionsUrl(
    `${destination.name}, ${destination.city}, ${destination.state}`,
    destination.coordinates.lat,
    destination.coordinates.lng,
    userCoords?.lat,
    userCoords?.lng
  );

  const handleShare = async () => {
    const shareText = `Check out ${destination.name} in ${destination.city}, ${destination.state} on Explore India!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination.name,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const destinationShops = LOCAL_SHOPS.filter(
    (s) => s.nearDestinationId === destination.id || s.city.toLowerCase() === destination.city.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E8DFC8] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Hero Image & Controls */}
        <div className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top Floating Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {destination.state} · {destination.region} India
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#231F1D] hover:bg-white hover:text-[#C85A32] transition shadow-xs"
                title="Share Destination"
                aria-label="Share Destination"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => onToggleWishlist(destination.id, e)}
                className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#231F1D] hover:bg-white hover:text-[#C85A32] transition shadow-xs"
                title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                aria-label="Bookmark Destination"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C85A32] text-[#C85A32]' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title Banner on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#FDBA74] font-semibold tracking-wide uppercase">
                {destination.city}, {destination.district}
              </span>
              {destination.localName && (
                <>
                  <span className="text-white/60">·</span>
                  <span className="text-xs text-white/90 font-medium">
                    {destination.localName}
                  </span>
                </>
              )}
            </div>
            
            <h2 className="font-heritage text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              {destination.name}
            </h2>

            <div className="flex items-center gap-3 pt-1 text-xs text-white/80">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{destination.rating.toFixed(1)}</span>
                <span className="text-white/70 font-normal">({destination.reviewsCount} reviews)</span>
              </div>
              <span>·</span>
              <span>Duration: {destination.visitDuration}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Segmented buttons) */}
        <div className="border-b border-[#E8DFC8] bg-[#FAF7F2] px-4 sm:px-6 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview & Logistics' },
            { id: 'shops', label: 'Shop Nearby & Bazaars' },
            { id: 'weather', label: 'Live Weather & Forecast' },
            { id: 'culture', label: 'History & Culture' },
            { id: 'food', label: 'Local Food & Street Eateries' },
            { id: 'tips', label: 'Travel Tips & Nearby' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-[#1A3E31] shadow-xs'
                  : 'text-[#6B635B] hover:text-[#1A3E31] hover:bg-white/50'
              }`}
            >
              {tab.id === 'shops' && <Store className="w-3.5 h-3.5 text-[#C85A32]" />}
              {tab.id === 'weather' && <CloudSun className="w-3.5 h-3.5 text-[#D97706]" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#231F1D]">
          
          {/* TAB 1: OVERVIEW & LOGISTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-heritage text-lg font-bold text-[#1A3E31]">
                  About this Destination
                </h3>
                <p className="text-sm text-[#5A524A] leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Key Verification Grid: Entry Fee, Timings & Best Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Entry Fee Box */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-[#C85A32]" /> Entry Fees
                    </span>
                    {destination.entryFee.isVerified ? (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#1A3E31]">
                    {destination.entryFee.value}
                  </p>
                  {destination.entryFee.note && (
                    <p className="text-[11px] text-[#8C8275] italic">
                      Note: {destination.entryFee.note}
                    </p>
                  )}
                </div>

                {/* Opening Hours Box */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C85A32]" /> Opening Hours
                    </span>
                    {destination.timings.isVerified ? (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#1A3E31]">
                    {destination.timings.value}
                  </p>
                </div>

                {/* Best Season */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#D97706]" /> Best Time to Visit
                  </span>
                  <p className="text-xs font-semibold text-[#1A3E31]">
                    {destination.bestTimeToVisit}
                  </p>
                  <p className="text-[11px] text-[#8C8275]">
                    Estimated visit duration: {destination.visitDuration}
                  </p>
                </div>

              </div>

              {/* Live Weather & 3-Day Forecast Widget */}
              <div className="space-y-2">
                <WeatherWidget
                  lat={destination.coordinates.lat}
                  lng={destination.coordinates.lng}
                  cityName={destination.city}
                  stateName={destination.state}
                />
              </div>

              {/* Tourist-Friendly Shopping & Local Businesses Preview */}
              <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#C85A32]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3E31]">
                      Local Businesses & Bazaars Near {destination.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('shops')}
                    className="text-xs font-bold text-[#C85A32] hover:underline"
                  >
                    View All ({destinationShops.length}) &rarr;
                  </button>
                </div>
                <p className="text-xs text-[#5A524A] leading-relaxed">
                  Discover authentic souvenir stores, pharmacies, traditional sweet marts, and essential services located around this attraction.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {destinationShops.slice(0, 2).map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShopModal(shop)}
                      className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8] hover:border-[#C85A32] transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-[#C85A32] uppercase">{shop.categoryLabel}</div>
                        <div className="text-xs font-bold text-[#1A3E31]">{shop.name}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C8275]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar: Directions Button */}
              <div className="p-4 rounded-xl bg-[#FAF2E6] border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-[#1A3E31]">
                    Ready to navigate to {destination.name}?
                  </h4>
                  <p className="text-xs text-[#6B635B]">
                    Coordinates: {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}
                  </p>
                </div>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#1A3E31] hover:bg-[#0E291E] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs w-full sm:w-auto justify-center"
                >
                  <Navigation className="w-4 h-4 text-[#FDBA74]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: SHOP NEARBY & LOCAL BUSINESSES */}
          {activeTab === 'shops' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-heritage text-lg font-bold text-[#1A3E31] flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#C85A32]" />
                    <span>Local Businesses & Bazaars Near {destination.name}</span>
                  </h3>
                  <p className="text-xs text-[#6B635B]">
                    Curated handicraft stores, pharmacies, prasad stalls, and local markets around {destination.city}.
                  </p>
                </div>

                {onNavigateToShops && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToShops(destination.id);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1A3E31] hover:bg-[#0E291E] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FDBA74]" />
                    <span>Open in Interactive Map Explorer</span>
                  </button>
                )}
              </div>

              {/* Category-Specific Shopping Advice */}
              <div className="p-4 rounded-xl bg-[#FAF2E6] border border-[#E8DFC8] space-y-1.5 text-xs">
                <div className="font-bold text-[#1A3E31] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Tourist Shopping Guide for {destination.name}</span>
                </div>
                <p className="text-[#5A524A] leading-relaxed">
                  {destination.categories.includes('temple')
                    ? 'Near sacred shrines, support local cooperative flower vendors, brass pooja lamps (samai), pure desi ghee prasad stalls, and clean vegetarian bhojanalayas.'
                    : destination.categories.includes('fort') || destination.categories.includes('historical')
                    ? 'Around ancient forts and monuments, look for authentic stone carvings, miniature brass artifacts, registered khadi handlooms, and emergency medical stores.'
                    : destination.categories.includes('beach')
                    ? 'Along the coast, explore beach shacks, coconut water stalls, UV protection eyewear, and local fish masala spice stores.'
                    : 'In this hill retreat, savor farm-fresh seasonal fruits, wild forest honey, wooden handicrafts, and warm traditional shawls.'}
                </p>
              </div>

              {/* Shops List */}
              {destinationShops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinationShops.map((shop) => (
                    <ShopCard
                      key={shop.id}
                      shop={shop}
                      onSelect={(s) => setSelectedShopModal(s)}
                      userCoords={userCoords}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] space-y-2">
                  <Store className="w-8 h-8 text-[#8C8275] mx-auto" />
                  <p className="text-xs text-[#5A524A]">
                    No specific registered sample shops found immediately beside {destination.name}.
                  </p>
                  {onNavigateToShops && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToShops(destination.id);
                      }}
                      className="text-xs font-bold text-[#C85A32] underline"
                    >
                      Search all shops in {destination.city} on the interactive map &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE WEATHER & 3-DAY FORECAST */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-heritage text-lg font-bold text-[#1A3E31] flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-[#D97706]" />
                  <span>Weather Forecast & Visiting Advisory for {destination.city}</span>
                </h3>
                <p className="text-xs text-[#6B635B]">
                  Real-time conditions and upcoming 3-day meteorological predictions powered by Open-Meteo public telemetry.
                </p>
              </div>

              <WeatherWidget
                lat={destination.coordinates.lat}
                lng={destination.coordinates.lng}
                cityName={destination.city}
                stateName={destination.state}
              />

              {/* Climate & Seasonality Context */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] space-y-2 text-xs">
                <h4 className="font-bold text-[#1A3E31] uppercase tracking-wider text-[11px]">
                  Seasonal Best Time: {destination.bestTimeToVisit}
                </h4>
                <p className="text-[#5A524A] leading-relaxed">
                  Weather in {destination.state} varies by elevation and season. Western Ghats and Himalayan regions experience monsoon mists and cool winters, while central and plains regions are best visited between October and March.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY & CULTURE */}
          {activeTab === 'culture' && (
            <div className="space-y-4">
              <div className="border-l-3 border-[#C85A32] pl-4 py-1 space-y-2">
                <h3 className="font-heritage text-lg font-bold text-[#1A3E31]">
                  Historical & Cultural Significance
                </h3>
                <p className="text-sm text-[#5A524A] leading-relaxed">
                  {destination.significance}
                </p>
              </div>

              {/* Cultural Highlights Breakdown */}
              <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E8DFC8] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3E31]">
                  Preserved Heritage & Architectural Styles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A524A]">
                  <div className="p-3 bg-white rounded-lg border border-[#E8DFC8]">
                    <strong className="block text-[#1A3E31] mb-1">State & Tradition:</strong>
                    {destination.state} ({destination.region} India)
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E8DFC8]">
                    <strong className="block text-[#1A3E31] mb-1">Categories:</strong>
                    {destination.categories.map((c) => c.replace('_', ' ')).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL FOOD */}
          {activeTab === 'food' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-heritage text-lg font-bold text-[#1A3E31]">
                  Authentic Regional Food & Street Spots
                </h3>
                <p className="text-xs text-[#6B635B]">
                  Food culture is an inseparable part of exploring India. Don’t leave {destination.city} without tasting these signature preparations:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.localFood.map((dish, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                          dish.isVegetarian 
                            ? 'border-emerald-600 text-emerald-600' 
                            : 'border-rose-600 text-rose-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dish.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <h4 className="text-sm font-bold text-[#1A3E31]">
                          {dish.name}
                        </h4>
                      </div>
                      <Utensils className="w-3.5 h-3.5 text-[#D97706]" />
                    </div>
                    <p className="text-xs text-[#5A524A] leading-relaxed">
                      {dish.description}
                    </p>
                    {dish.recommendedPlaces && (
                      <p className="text-[11px] text-[#C85A32] font-medium pt-1">
                        📍 Recommended spot: {dish.recommendedPlaces}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIPS & NEARBY */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              
              {/* Practical Tips */}
              <div className="space-y-3">
                <h3 className="font-heritage text-lg font-bold text-[#1A3E31] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#D97706]" /> Practical Travel Tips
                </h3>
                <ul className="space-y-2">
                  {destination.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#5A524A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby Attractions */}
              <div className="space-y-3 pt-3 border-t border-[#E8DFC8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3E31]">
                  Nearby Sights & Day Excursions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {destination.nearbyAttractions.map((attraction, i) => (
                    <div 
                      key={i}
                      onClick={() => onSelectRelatedDestination && onSelectRelatedDestination(attraction.name)}
                      className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] hover:border-[#C85A32] transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#8C8275]">
                        <span className="capitalize">{attraction.category}</span>
                        <span className="font-semibold text-[#C85A32]">{attraction.distanceKm} km</span>
                      </div>
                      <div className="text-xs font-bold text-[#1A3E31] group-hover:text-[#C85A32] transition mt-1">
                        {attraction.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#FAF7F2] border-t border-[#E8DFC8] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#6B635B]">
            Explore India Verified Tourism Database
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5A524A] hover:text-[#1A3E31]"
            >
              Close
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#A94522] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

      </div>

      {/* Shop Detail Modal */}
      <ShopModal
        shop={selectedShopModal}
        onClose={() => setSelectedShopModal(null)}
        userCoords={userCoords}
      />
    </div>
  );
};

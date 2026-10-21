import React, { useState, useMemo } from 'react';
import { LocalShop, ShopCategory } from '../types/shops.js';
import { LOCAL_SHOPS, SHOP_CATEGORIES } from '../data/shops.js';
import { DESTINATIONS } from '../data/destinations.js';
import { CITY_PIN_DIRECTORY, CityPinLocation } from '../data/pinCodes.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { UserLocation, Destination } from '../types/tourism.js';
import { ShopCard } from './ShopCard.js';
import { ShopModal } from './ShopModal.js';
import { ShopMapView } from './ShopMapView.js';
import { 
  Store, 
  Search, 
  MapPin, 
  Navigation, 
  SlidersHorizontal, 
  RotateCcw, 
  Map as MapIcon, 
  LayoutGrid, 
  AlertTriangle, 
  CheckCircle2, 
  Compass,
  Filter
} from 'lucide-react';

interface LocalShopsViewProps {
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;
  initialAttractionId?: string;
  onSelectDestination?: (dest: Destination) => void;
}

export const LocalShopsView: React.FC<LocalShopsViewProps> = ({
  userLocation,
  setUserLocation,
  initialAttractionId,
  onSelectDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all'>('all');
  const [selectedAttractionId, setSelectedAttractionId] = useState<string>(initialAttractionId || 'all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 means all distances
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedShopForModal, setSelectedShopForModal] = useState<LocalShop | null>(null);
  const [manualCityQuery, setManualCityQuery] = useState('');

  // Request browser location permission ONLY after user clicks
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please select your city or PIN code below.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          cityName: 'Your Live GPS Location',
          isRealGps: true,
        });
        setSortBy('nearest');
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Location access was not granted.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can select your city or area manually below.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal is currently unavailable. Please pick your city below.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please choose your city or PIN code below.';
        }
        setGeoError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectManualCity = (entry: CityPinLocation) => {
    setUserLocation({
      lat: entry.lat,
      lng: entry.lng,
      cityName: `${entry.city}, ${entry.state}`,
      pinCode: entry.pinCode,
      isRealGps: false,
    });
    setSelectedCity(entry.city);
    setGeoError(null);
  };

  // Filter and sort shops
  const filteredShops = useMemo(() => {
    return LOCAL_SHOPS
      .map((shop) => {
        let calculatedDist: number | undefined = undefined;
        if (userLocation) {
          calculatedDist = calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            shop.coordinates.lat,
            shop.coordinates.lng
          );
        }
        return {
          ...shop,
          calculatedDistance: calculatedDist,
        };
      })
      .filter((shop) => {
        // Category filter
        const matchCategory = selectedCategory === 'all' || shop.category === selectedCategory;

        // Attraction filter
        const matchAttraction = selectedAttractionId === 'all' || shop.nearDestinationId === selectedAttractionId;

        // City filter
        const matchCity = selectedCity === 'all' || shop.city.toLowerCase() === selectedCity.toLowerCase();

        // Open now filter
        const matchOpenNow = !openNowOnly || shop.isOpenNow === true;

        // Distance filter
        const matchDistance =
          maxDistanceKm === 0 ||
          (shop.calculatedDistance !== undefined && shop.calculatedDistance <= maxDistanceKm);

        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          shop.name.toLowerCase().includes(q) ||
          shop.categoryLabel.toLowerCase().includes(q) ||
          shop.locality.toLowerCase().includes(q) ||
          shop.city.toLowerCase().includes(q) ||
          shop.state.toLowerCase().includes(q) ||
          shop.pinCode.includes(q) ||
          (shop.nearDestinationName && shop.nearDestinationName.toLowerCase().includes(q)) ||
          (shop.specialties && shop.specialties.some((s) => s.toLowerCase().includes(q)));

        return matchCategory && matchAttraction && matchCity && matchOpenNow && matchDistance && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest' && a.calculatedDistance !== undefined && b.calculatedDistance !== undefined) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return a.name.localeCompare(b.name);
      });
  }, [selectedCategory, selectedAttractionId, selectedCity, openNowOnly, maxDistanceKm, searchQuery, sortBy, userLocation]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAttractionId('all');
    setSelectedCity('all');
    setMaxDistanceKm(0);
    setOpenNowOnly(false);
    setSortBy('rating');
  };

  const manualCitySuggestions = useMemo(() => {
    if (!manualCityQuery.trim()) return CITY_PIN_DIRECTORY.slice(0, 7);
    const q = manualCityQuery.toLowerCase().trim();
    return CITY_PIN_DIRECTORY.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.pinCode.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    ).slice(0, 7);
  }, [manualCityQuery]);

  return (
    <div className="space-y-8">
      
      {/* Title & Introduction */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#354D43]">
          <Store className="w-3.5 h-3.5 text-[#C9A982]" />
          <span>Discover the Local Within · Bazaars & Essential Services</span>
        </div>
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#29323A]">
          Local Shops & Nearby Places
        </h2>
        <p className="text-sm text-[#53626F] max-w-3xl leading-relaxed font-light">
          Discover trusted local businesses, traditional handicraft emporiums, pharmacies, street food stalls, markets, bookstores, and essential services near tourist attractions or your current location in India with lokavi.
        </p>
      </div>

      {/* Location Controller Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE1]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              userLocation 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-[#FAF2E6] text-[#C85A32] border border-[#E8DFC8]'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8C8275]">
                Active Shopping Reference Location
              </div>
              <div className="text-sm font-bold text-[#1A3E31] flex items-center gap-2 flex-wrap">
                {userLocation ? (
                  <>
                    <span>{userLocation.cityName}</span>
                    {userLocation.isRealGps ? (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live GPS Fix
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#8C8275] bg-[#FAF2E6] px-2 py-0.5 rounded-md">
                        Selected City / PIN: {userLocation.pinCode || 'Active'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[#8C8275] font-normal">
                    Location not selected yet. Click below or pick your city.
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A94522] text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs active:scale-95 shrink-0"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Use My Location'}</span>
          </button>
        </div>

        {/* Location error message */}
        {geoError && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{geoError}</span>
              <p className="text-amber-800/80 mt-0.5">
                Pick a city or enter your 6-digit PIN code below to calculate accurate distances.
              </p>
            </div>
          </div>
        )}

        {/* Quick City / PIN Code selector */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#C85A32]" /> Search by City or PIN Code
            </span>
            <span className="text-[11px] text-[#8C8275]">
              Includes Maharashtra (Pune, Shirpur, Dhule, Nashik, Mumbai) & other hubs
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
            <input
              type="text"
              value={manualCityQuery}
              onChange={(e) => setManualCityQuery(e.target.value)}
              placeholder="e.g. Pune, Shirpur 425405, Dhule, Mumbai, Jaipur, Varanasi..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] placeholder-[#8C8275] focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[11px] text-[#8C8275] font-medium mr-1">Quick Select:</span>
            {manualCitySuggestions.map((c) => (
              <button
                key={c.city + c.pinCode}
                onClick={() => handleSelectManualCity(c)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  userLocation?.cityName?.includes(c.city)
                    ? 'bg-[#1A3E31] text-white border-[#1A3E31] font-semibold'
                    : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                }`}
              >
                {c.city} ({c.pinCode})
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm space-y-4">
        
        {/* Row 1: Search, Near Attraction, and Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8275] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shop name, sweets, craft..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] placeholder-[#8C8275] focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          {/* Near Tourist Attraction Selector */}
          <div>
            <select
              value={selectedAttractionId}
              onChange={(e) => setSelectedAttractionId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32]"
            >
              <option value="all">Near All Tourist Attractions</option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  Near {d.name} ({d.city})
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              disabled={!userLocation}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32] disabled:opacity-50"
            >
              <option value={0}>Distance: Any Distance</option>
              <option value={2}>Within 2 km (Walking)</option>
              <option value={5}>Within 5 km</option>
              <option value={15}>Within 15 km</option>
              <option value={30}>Within 30 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32]"
            >
              {userLocation && <option value="nearest">Sort: Nearest First</option>}
              <option value="rating">Sort: Highest Rated</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Row 2: Category Chips (Segmented buttons) */}
        <div className="pt-2 border-t border-[#F2ECE1] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B635B]">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C85A32]" /> Shop Categories
            </span>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#1A3E31]">
                <input
                  type="checkbox"
                  checked={openNowOnly}
                  onChange={(e) => setOpenNowOnly(e.target.checked)}
                  className="rounded text-[#C85A32] accent-[#C85A32]"
                />
                <span>Open Now Only</span>
              </label>

              {(searchQuery || selectedCategory !== 'all' || selectedAttractionId !== 'all' || maxDistanceKm !== 0 || openNowOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#C85A32] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-[#1A3E31] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
              }`}
            >
              All Categories ({LOCAL_SHOPS.length})
            </button>
            {SHOP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#C85A32] text-white shadow-2xs'
                    : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Results Header with View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#5A524A] font-medium">
          Showing <strong className="text-[#1A3E31] font-bold">{filteredShops.length}</strong> verified shops & local markets
          {userLocation && ` sorted relative to ${userLocation.cityName}`}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E8DFC8]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition ${
              viewMode === 'grid' ? 'bg-[#FAF2E6] text-[#C85A32]' : 'text-[#8C8275]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition ${
              viewMode === 'map' ? 'bg-[#FAF2E6] text-[#C85A32]' : 'text-[#8C8275]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* VIEW: MAP or CARDS */}
      {viewMode === 'map' ? (
        <div className="space-y-6">
          <ShopMapView
            shops={filteredShops}
            selectedShop={selectedShopForModal}
            onSelectShop={(shop) => setSelectedShopForModal(shop)}
            userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
            userCityName={userLocation?.cityName}
          />

          {/* Cards below map for easy scrolling */}
          <div className="space-y-3">
            <h3 className="font-heritage text-base font-bold text-[#1A3E31]">
              Shops Visible on Map
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  onSelect={(s) => setSelectedShopForModal(s)}
                  userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
                  calculatedDistanceKm={shop.calculatedDistance}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CARDS GRID */
        filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onSelect={(s) => setSelectedShopForModal(s)}
                userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
                calculatedDistanceKm={shop.calculatedDistance}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DFC8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF2E6] text-[#C85A32] flex items-center justify-center mx-auto">
              <Store className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heritage text-lg font-bold text-[#1A3E31]">
                No Local Shops Match Your Filters
              </h3>
              <p className="text-xs text-[#6B635B] max-w-md mx-auto">
                Try widening your distance radius, switching categories, or resetting the search filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-bold hover:bg-[#A94522] transition"
            >
              Reset All Filters
            </button>
          </div>
        )
      )}

      {/* Shop Detail Modal */}
      <ShopModal
        shop={selectedShopForModal}
        onClose={() => setSelectedShopForModal(null)}
        userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
      />

    </div>
  );
};

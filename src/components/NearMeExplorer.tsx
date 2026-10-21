import React, { useState, useMemo } from 'react';
import { Destination, UserLocation } from '../types/tourism.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { CITY_PIN_DIRECTORY, CityPinLocation } from '../data/pinCodes.js';
import { DestinationCard } from './DestinationCard.js';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

interface NearMeExplorerProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  wishlist: string[];
  onToggleWishlist: (destId: string, e: React.MouseEvent) => void;
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;
}

export const NearMeExplorer: React.FC<NearMeExplorerProps> = ({
  destinations,
  onSelectDestination,
  wishlist,
  onToggleWishlist,
  userLocation,
  setUserLocation,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState('');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(300);

  // Request GPS permission ONLY upon user click
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please select your city or PIN code manually.');
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
          cityName: 'Your Current GPS Location',
          isRealGps: true,
        });
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Location access was not granted.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can easily pick your city or PIN code below.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal is currently unavailable. Please pick your city below.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please select your city or PIN code below.';
        }
        setGeoError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Manual selection of city or PIN code
  const handleSelectCity = (cityEntry: CityPinLocation) => {
    setUserLocation({
      lat: cityEntry.lat,
      lng: cityEntry.lng,
      cityName: `${cityEntry.city}, ${cityEntry.state}`,
      pinCode: cityEntry.pinCode,
      isRealGps: false,
    });
    setGeoError(null);
  };

  // Filter and sort destinations by computed distance
  const nearbyDestinations = useMemo(() => {
    if (!userLocation) return [];

    return destinations
      .map((dest) => {
        const dist = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          dest.coordinates.lat,
          dest.coordinates.lng
        );
        return {
          ...dest,
          calculatedDistance: dist,
        };
      })
      .filter((dest) => maxRadiusKm === 0 || dest.calculatedDistance <= maxRadiusKm)
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  }, [destinations, userLocation, maxRadiusKm]);

  // City suggestions for manual search
  const filteredCitySuggestions = useMemo(() => {
    if (!manualQuery.trim()) return CITY_PIN_DIRECTORY.slice(0, 8);
    const q = manualQuery.toLowerCase().trim();
    return CITY_PIN_DIRECTORY.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.pinCode.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [manualQuery]);

  return (
    <div className="space-y-8">
      
      {/* Title & Honest Methodology Notice */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#354D43]">
          <Navigation className="w-3.5 h-3.5 text-[#C9A982]" />
          <span>Discover the Local Within · Local Distance & Nearby Places</span>
        </div>
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#29323A]">
          Explore Attractions Near Me
        </h2>
        <p className="text-sm text-[#53626F] max-w-3xl leading-relaxed font-light">
          Find forts, temples, waterfalls, and heritage spots within driving distance of your location with lokavi. We use verified coordinates and mathematical calculations for honest, straight-line distances.
        </p>
      </div>

      {/* Location Controller Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm space-y-6">
        
        {/* Status indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F2ECE1]">
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
                Current Active Reference Point
              </div>
              <div className="text-sm font-bold text-[#1A3E31] flex items-center gap-2">
                {userLocation ? (
                  <>
                    <span>{userLocation.cityName}</span>
                    {userLocation.isRealGps ? (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live GPS Fix
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#8C8275] bg-[#FAF2E6] px-2 py-0.5 rounded-md">
                        PIN / City Center: {userLocation.pinCode || 'Selected'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[#8C8275] font-normal">
                    Location not yet selected. Click below to use GPS or choose your city.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleRequestGps}
            disabled={isLocating}
            className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A94522] text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS Signal...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {/* Error message / Notice */}
        {geoError && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold">{geoError}</span>
              <p className="text-amber-800/80">
                You can continue without browser permission by simply picking your city or entering your 6-digit PIN code below.
              </p>
            </div>
          </div>
        )}

        {/* Manual City / PIN Code Directory Picker */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#C85A32]" /> Or Select Your City / PIN Code
            </label>
            <span className="text-[11px] text-[#8C8275]">
              Includes Maharashtra hubs (Pune, Shirpur, Dhule, Nashik, Mumbai) & other states
            </span>
          </div>

          <div className="relative max-w-md">
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder="Type city or PIN (e.g. Shirpur, 425405, Dhule, Pune, Mumbai)..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] placeholder-[#8C8275] focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          {/* Quick Clickable Suggestions (Interactive buttons) */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-[#8C8275] font-medium mr-1">Quick Select:</span>
            {filteredCitySuggestions.map((c) => (
              <button
                key={c.pinCode + c.city}
                onClick={() => handleSelectCity(c)}
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

        {/* Radius Filter Slider */}
        {userLocation && (
          <div className="pt-4 border-t border-[#F2ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85A32]" /> Distance Radius Filter
              </span>
              <p className="text-[11px] text-[#8C8275]">
                {maxRadiusKm === 0 ? 'Showing all destinations sorted by nearest' : `Showing attractions within ${maxRadiusKm} km`}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {[50, 100, 200, 350, 600, 0].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setMaxRadiusKm(radius)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    maxRadiusKm === radius
                      ? 'bg-[#1A3E31] text-white shadow-2xs font-semibold'
                      : 'bg-[#FAF7F2] border border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                  }`}
                >
                  {radius === 0 ? 'All' : `${radius} km`}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Results Section */}
      {userLocation ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#5A524A]">
            <div>
              Found <strong className="text-[#1A3E31] font-bold">{nearbyDestinations.length}</strong> places sorted by proximity to <strong>{userLocation.cityName}</strong>
            </div>
            <div className="text-[11px] text-[#8C8275] italic">
              Distances computed via straight-line Haversine coordinates
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={onSelectDestination}
                isWishlisted={wishlist.includes(dest.id)}
                onToggleWishlist={onToggleWishlist}
                calculatedDistanceKm={dest.calculatedDistance}
                userCoords={{ lat: userLocation.lat, lng: userLocation.lng }}
              />
            ))}
          </div>

          {nearbyDestinations.length === 0 && (
            <div className="p-10 text-center bg-white rounded-2xl border border-[#E8DFC8] space-y-3">
              <Compass className="w-8 h-8 text-[#C85A32] mx-auto" />
              <h3 className="font-heritage text-base font-bold text-[#1A3E31]">
                No Destinations Within {maxRadiusKm} km
              </h3>
              <p className="text-xs text-[#6B635B] max-w-sm mx-auto">
                Try expanding the distance radius to 350 km or 600 km to view popular weekend destinations.
              </p>
              <button
                onClick={() => setMaxRadiusKm(600)}
                className="px-4 py-2 bg-[#C85A32] text-white text-xs font-bold rounded-xl"
              >
                Expand Radius to 600 km
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty Prompt State */
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DFC8] space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF2E6] text-[#C85A32] flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heritage text-xl font-bold text-[#1A3E31]">
              Where are you exploring from?
            </h3>
            <p className="text-xs text-[#6B635B] max-w-md mx-auto leading-relaxed">
              Click <strong>"Use My GPS Location"</strong> or pick your city above (Shirpur, Dhule, Pune, Mumbai, Nashik, etc.) to immediately view and rank nearby attractions by driving distance.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

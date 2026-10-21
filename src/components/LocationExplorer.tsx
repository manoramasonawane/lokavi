import React, { useState, useMemo } from 'react';
import { Destination, TourismCategory } from '../types/tourism.js';
import { INDIAN_STATES } from '../data/states.js';
import { CATEGORIES } from '../data/categories.js';
import { DestinationCard } from './DestinationCard.js';
import { Search, Filter, RotateCcw, LayoutGrid, List, MapPin } from 'lucide-react';

interface LocationExplorerProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  wishlist: string[];
  onToggleWishlist: (destId: string, e: React.MouseEvent) => void;
  initialStateFilter?: string;
  initialCategoryFilter?: TourismCategory | 'all';
}

export const LocationExplorer: React.FC<LocationExplorerProps> = ({
  destinations,
  onSelectDestination,
  wishlist,
  onToggleWishlist,
  initialStateFilter = 'All',
  initialCategoryFilter = 'all',
}) => {
  const [selectedState, setSelectedState] = useState<string>(initialStateFilter);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<TourismCategory | 'all'>(initialCategoryFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'reviews'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Compute available districts dynamically based on selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All') {
      const districts = Array.from(new Set(destinations.map((d) => d.district))).sort();
      return ['All', ...districts];
    }
    const filtered = destinations.filter((d) => d.state.toLowerCase() === selectedState.toLowerCase());
    const districts = Array.from(new Set(filtered.map((d) => d.district))).sort();
    return ['All', ...districts];
  }, [destinations, selectedState]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // State filter
        const matchState = selectedState === 'All' || dest.state.toLowerCase() === selectedState.toLowerCase();

        // District filter
        const matchDistrict = selectedDistrict === 'All' || dest.district.toLowerCase() === selectedDistrict.toLowerCase();

        // Category filter
        const matchCategory = selectedCategory === 'all' || dest.categories.includes(selectedCategory);

        // Search Query filter
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          dest.name.toLowerCase().includes(q) ||
          dest.city.toLowerCase().includes(q) ||
          dest.district.toLowerCase().includes(q) ||
          dest.state.toLowerCase().includes(q) ||
          (dest.localName && dest.localName.toLowerCase().includes(q)) ||
          dest.description.toLowerCase().includes(q) ||
          dest.localFood.some((f) => f.name.toLowerCase().includes(q)) ||
          dest.nearbyAttractions.some((a) => a.name.toLowerCase().includes(q));

        return matchState && matchDistrict && matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
        return a.name.localeCompare(b.name);
      });
  }, [destinations, selectedState, selectedDistrict, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('rating');
  };

  return (
    <div className="space-y-8">
      
      {/* Header section with description */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#354D43]">
          <MapPin className="w-3.5 h-3.5 text-[#C9A982]" />
          <span>Discover the Local Within · Pan-India Directory</span>
        </div>
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#29323A]">
          India Location & Destination Explorer
        </h2>
        <p className="text-sm text-[#53626F] max-w-3xl leading-relaxed font-light">
          Filter and discover local tourist destinations across all 28 Indian States and 8 Union Territories with lokavi. From historical Sahyadri forts in Maharashtra to royal palaces in Rajasthan, pristine Kerala backwaters, and Himalayan yoga retreats.
        </p>
      </div>

      {/* Filter Control Board */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm space-y-4">
        
        {/* Row 1: Search and Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8275] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, fort, temple..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] placeholder-[#8C8275] focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          {/* State Selector */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
              }}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32]"
            >
              <option value="All">All Indian States & UTs ({INDIAN_STATES.length})</option>
              <optgroup label="Popular States & Highlights">
                <option value="Maharashtra">Maharashtra (Pune, Mumbai, Nashik, Dhule, Shirpur)</option>
                <option value="Rajasthan">Rajasthan (Jaipur, Udaipur, Amber)</option>
                <option value="Goa">Goa (Beaches, Dudhsagar, Basilica)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (Varanasi, Agra Taj Mahal)</option>
                <option value="Kerala">Kerala (Munnar, Alleppey Backwaters)</option>
                <option value="Telangana">Telangana (Hyderabad, Golconda, Charminar)</option>
                <option value="Karnataka">Karnataka (Bengaluru, Hampi, Mysore)</option>
                <option value="Delhi">Delhi (Red Fort, Qutub Minar, Chandni Chowk)</option>
              </optgroup>
              <optgroup label="All States & Union Territories">
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name} ({state.type === 'Union Territory' ? 'UT' : 'State'})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* District / City Selector */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={availableDistricts.length <= 1}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32] disabled:opacity-50"
            >
              <option value="All">All Districts / Cities</option>
              {availableDistricts.filter((d) => d !== 'All').map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32]"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="reviews">Sort: Most Reviewed</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Row 2: Category Filters (Interactive Segmented buttons, Zero-Pill discipline) */}
        <div className="pt-2 border-t border-[#F2ECE1] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B635B]">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C85A32]" /> Tourism Themes & Filters
            </span>
            {(selectedState !== 'All' || selectedDistrict !== 'All' || selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#C85A32] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
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
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
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

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#5A524A] font-medium">
          Showing <strong className="text-[#1A3E31] font-bold">{filteredDestinations.length}</strong> of{' '}
          {destinations.length} destinations across India
          {selectedState !== 'All' && ` in ${selectedState}`}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E8DFC8]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#FAF2E6] text-[#C85A32]' : 'text-[#8C8275]'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#FAF2E6] text-[#C85A32]' : 'text-[#8C8275]'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Destination Grid / List */}
      {filteredDestinations.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={onSelectDestination}
              isWishlisted={wishlist.includes(destination.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DFC8] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF2E6] text-[#C85A32] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heritage text-lg font-bold text-[#1A3E31]">
              No Destinations Match Your Filter
            </h3>
            <p className="text-xs text-[#6B635B] max-w-md mx-auto">
              We couldn’t find places matching "{searchQuery || selectedCategory || selectedState}". Try widening your search or resetting filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-bold hover:bg-[#A94522] transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};

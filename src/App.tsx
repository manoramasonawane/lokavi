import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from './data/destinations.js';
import { Destination, TourismCategory, UserLocation } from './types/tourism.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { DestinationCard } from './components/DestinationCard.js';
import { DestinationModal } from './components/DestinationModal.js';
import { LocationExplorer } from './components/LocationExplorer.js';
import { NearMeExplorer } from './components/NearMeExplorer.js';
import { TripPlannerView } from './components/TripPlannerView.js';
import { LocalShopsView } from './components/LocalShopsView.js';
import { WishlistDrawer } from './components/WishlistDrawer.js';
import { ApiSetupModal } from './components/ApiSetupModal.js';
import { Footer } from './components/Footer.js';
import { 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  Calendar, 
  Compass, 
  Check,
  Store,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explorer' | 'near-me' | 'planner' | 'shops'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TourismCategory | 'all'>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [selectedShopAttractionId, setSelectedShopAttractionId] = useState<string | undefined>(undefined);
  
  // Selected destination for detail modal
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // User Location (GPS or manual selection)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Wishlist / Bookmarks (stored in localStorage under lokavi_wishlist with fallback)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lokavi_wishlist') || localStorage.getItem('explore_india_wishlist');
      return saved ? JSON.parse(saved) : ['pune-sinhagad-shaniwarwada', 'ajanta-ellora-caves-kailasa', 'shirpur-khandesh-educational-oasis'];
    } catch {
      return [];
    }
  });

  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('lokavi_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore storage errors
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (destId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(destId)) {
      setWishlist((prev) => prev.filter((id) => id !== destId));
      showToast('Removed from saved places.');
    } else {
      setWishlist((prev) => [...prev, destId]);
      showToast('Saved to your lokavi list!');
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Clear all destinations from your saved list?')) {
      setWishlist([]);
      showToast('Saved list cleared.');
    }
  };

  const handleOpenDestinationByName = (name: string) => {
    const found = DESTINATIONS.find((d) => d.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.name.toLowerCase()));
    if (found) {
      setSelectedDestination(found);
    }
  };

  // Featured destinations
  const featuredDestinations = DESTINATIONS.filter((d) => d.isFeatured);
  const weekendGetaways = DESTINATIONS.filter((d) => d.isWeekendGetaway);
  const trendingDestinations = DESTINATIONS.filter((d) => d.isTrending);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#29323A] selection:bg-[#354D43] selection:text-[#F7F4ED]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#354D43] text-[#F7F4ED] px-4 py-2.5 rounded-2xl shadow-xl border border-[#24352E] flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-[#C9A982]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenApiInfo={() => setApiModalOpen(true)}
        onTriggerNearMe={() => setActiveTab('near-me')}
        isGpsActive={Boolean(userLocation?.isRealGps)}
        gpsCityName={userLocation?.cityName}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* ======================================================== */}
        {/* VIEW 1: HOMEPAGE */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 sm:space-y-20">
            
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('explorer');
              }}
              onExploreNearMe={() => setActiveTab('near-me')}
              onExploreAll={() => setActiveTab('explorer')}
              totalDestinations={DESTINATIONS.length}
            />

            {/* SECTION: FEATURED DESTINATIONS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A982]" />
                    <span>Curated Highlights · lokavi Selection</span>
                  </div>
                  <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#29323A]">
                    Featured Destinations Across India
                  </h2>
                  <p className="text-xs sm:text-sm text-[#53626F]">
                    Timeless monuments, sacred pilgrimages, and scenic retreats with verified timings, fees, and local tips.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('explorer')}
                  className="text-xs font-bold text-[#354D43] hover:text-[#24352E] flex items-center gap-1 self-start sm:self-auto group"
                >
                  <span>Explore all {DESTINATIONS.length} places</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDestinations.slice(0, 6).map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    onSelect={setSelectedDestination}
                    isWishlisted={wishlist.includes(dest.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </section>

            {/* SECTION: MAHARASHTRA & POPULAR WEEKEND GETAWAYS */}
            <section className="bg-[#E8EBE2]/40 py-14 border-y border-[#DFCEB7]/70">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A982]" />
                      <span>Short Breaks & Roadtrips</span>
                    </div>
                    <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#29323A]">
                      Popular Weekend Getaways
                    </h2>
                    <p className="text-xs sm:text-sm text-[#53626F]">
                      Carefully designed 1-day and 2-day escapes from Pune, Mumbai, Nashik, Dhule, Shirpur, and other hubs.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('planner')}
                    className="px-4 py-2.5 rounded-xl bg-[#354D43] text-[#F7F4ED] text-xs font-bold hover:bg-[#24352E] transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
                  >
                    <span>Open Weekend Planner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A982]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weekendGetaways.slice(0, 6).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onSelect={setSelectedDestination}
                      isWishlisted={wishlist.includes(dest.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>

              </div>
            </section>

            {/* SECTION: TRENDING EXPERIENCES & LOCAL CULTURE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#354D43]">
                    Trending Experiences
                  </div>
                  <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#29323A]">
                    Living Heritage & Iconic Wonders
                  </h2>
                  <p className="text-xs sm:text-sm text-[#53626F]">
                    Immerse yourself in world-renowned rock-cut architecture, holy river aartis, and vibrant coastal quarters.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('historical');
                    setActiveTab('explorer');
                  }}
                  className="text-xs font-bold text-[#354D43] hover:text-[#24352E] flex items-center gap-1"
                >
                  <span>View heritage places</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingDestinations.slice(0, 6).map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    onSelect={setSelectedDestination}
                    isWishlisted={wishlist.includes(dest.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </section>

            {/* SECTION: REGIONAL CULINARY TRAIL */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DFCEB7] shadow-sm space-y-8">
                
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-[#C9A982]" /> Regional Gastronomy
                  </div>
                  <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#29323A]">
                    Taste India: Authentic Food Trails
                  </h2>
                  <p className="text-xs sm:text-sm text-[#53626F] max-w-2xl leading-relaxed">
                    Every district of India boasts distinct flavors, wood-fired breadmaking traditions, and time-honored spices. Here are signature dishes recommended by locals:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      name: 'Khandeshi Shev Bhaji & Mande',
                      region: 'Shirpur & Dhule, Maharashtra',
                      desc: 'Fiery kala rassa coconut gravy with crispy shev, paired with hand-stretched puranpoli cooked on earthen khapra.',
                      icon: '🍲',
                      destId: 'shirpur-khandesh-educational-oasis'
                    },
                    {
                      name: 'Chulivarchi Misal & Pithla Bhakri',
                      region: 'Pune & Nashik, Maharashtra',
                      desc: 'Spicy sprouted lentil curry cooked over firewood, and hot bajra bhakris atop Sinhagad Fort.',
                      icon: '🌶️',
                      destId: 'pune-sinhagad-shaniwarwada'
                    },
                    {
                      name: 'Banarasi Tamatar Chaat & Paan',
                      region: 'Varanasi, Uttar Pradesh',
                      desc: 'Mashed ghee-roasted spiced tomatoes topped with sugar syrup, followed by fresh Banarasi Meetha Paan.',
                      icon: '🍅',
                      destId: 'varanasi-ghats-kashi-vishwanath'
                    },
                    {
                      name: 'Hyderabadi Dum Biryani & Irani Chai',
                      region: 'Hyderabad, Telangana',
                      desc: 'Fragrant basmati rice slow-cooked under dough seal with saffron and whole spices; paired with Osmania biscuits.',
                      icon: '🍚',
                      destId: 'hyderabad-charminar-golconda'
                    },
                  ].map((food, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const target = DESTINATIONS.find((d) => d.id === food.destId);
                        if (target) setSelectedDestination(target);
                      }}
                      className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DFCEB7] hover:border-[#354D43] transition cursor-pointer group space-y-2"
                    >
                      <div className="text-2xl">{food.icon}</div>
                      <div className="text-[10px] font-bold text-[#354D43] uppercase tracking-wider">
                        {food.region}
                      </div>
                      <h4 className="text-xs font-bold text-[#29323A] group-hover:text-[#354D43] transition">
                        {food.name}
                      </h4>
                      <p className="text-[11px] text-[#53626F] leading-relaxed">
                        {food.desc}
                      </p>
                      <div className="text-[11px] font-semibold text-[#354D43] flex items-center gap-1 pt-1">
                        <span>Explore Place</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* SECTION: LOCAL SHOPS & BAZAARS PREVIEW */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DFCEB7] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#C9A982]" />
                      <span>Discover the Local Within · Neighborhood Bazaars</span>
                    </div>
                    <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#29323A]">
                      Explore Local Shops & Essential Services
                    </h2>
                    <p className="text-xs sm:text-sm text-[#53626F] max-w-xl">
                      Discover verified sweet marts, medical stores, copper craftsmen, traditional handlooms, and essential services near your destinations.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedShopAttractionId(undefined);
                      setActiveTab('shops');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#354D43] text-[#F7F4ED] text-xs font-bold hover:bg-[#24352E] transition flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto active:scale-95"
                  >
                    <Store className="w-3.5 h-3.5 text-[#C9A982]" />
                    <span>Open Local Shops Explorer</span>
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION: PAN-INDIA STATES EXPLORER BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#354D43] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-[#24352E]">
                <div className="space-y-3 max-w-xl text-center md:text-left">
                  <div className="text-xs font-semibold text-[#C9A982] uppercase tracking-wider">
                    Complete Geographic Coverage
                  </div>
                  <h3 className="font-heritage text-2xl sm:text-3xl font-bold">
                    Discover All 28 States & 8 Union Territories
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
                    Filter by state, district, or theme. Discover sacred jyotirlingas, ancient UNESCO caves, Sahyadri fort scrambles, and secluded beaches with lokavi.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('explorer')}
                  className="px-6 py-3.5 rounded-2xl bg-[#C9A982] hover:bg-[#b8956e] text-[#29323A] text-xs font-bold transition flex items-center gap-2 shadow-md shrink-0 active:scale-95"
                >
                  <Compass className="w-4 h-4 text-[#29323A]" />
                  <span>Open Full State Explorer</span>
                </button>
              </div>
            </section>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: ALL INDIA LOCATION EXPLORER */}
        {/* ======================================================== */}
        {activeTab === 'explorer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LocationExplorer
              destinations={DESTINATIONS}
              onSelectDestination={setSelectedDestination}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              initialStateFilter={selectedStateFilter}
              initialCategoryFilter={selectedCategory}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: EXPLORE NEAR ME */}
        {/* ======================================================== */}
        {activeTab === 'near-me' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <NearMeExplorer
              destinations={DESTINATIONS}
              onSelectDestination={setSelectedDestination}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: LOCAL SHOPS & NEARBY PLACES */}
        {/* ======================================================== */}
        {activeTab === 'shops' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LocalShopsView
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              initialAttractionId={selectedShopAttractionId}
              onSelectDestination={setSelectedDestination}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: WEEKEND TRIP PLANNER */}
        {/* ======================================================== */}
        {activeTab === 'planner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <TripPlannerView />
          </div>
        )}

      </main>

      {/* Destination Detail Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        isWishlisted={selectedDestination ? wishlist.includes(selectedDestination.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onSelectRelatedDestination={handleOpenDestinationByName}
        onNavigateToShops={(attractionId) => {
          setSelectedShopAttractionId(attractionId);
          setActiveTab('shops');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
      />

      {/* Saved Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlistIds={wishlist}
        destinations={DESTINATIONS}
        onSelectDestination={setSelectedDestination}
        onRemoveFromWishlist={(id) => {
          setWishlist((prev) => prev.filter((d) => d !== id));
          showToast('Removed from saved places.');
        }}
        onClearWishlist={handleClearWishlist}
        onPlanTripWithWishlist={() => setActiveTab('planner')}
      />

      {/* API Setup Instructions Modal */}
      <ApiSetupModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectState={(st) => {
          setSelectedStateFilter(st);
          setActiveTab('explorer');
        }}
        onOpenExplorer={() => setActiveTab('explorer')}
        onOpenPlanner={() => setActiveTab('planner')}
        onOpenShops={() => {
          setSelectedShopAttractionId(undefined);
          setActiveTab('shops');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

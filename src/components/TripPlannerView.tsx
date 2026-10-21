import React, { useState } from 'react';
import { TripPlanPreferences, TourismCategory, GeneratedItinerary } from '../types/tourism.js';
import { generateWeekendTripPlan } from '../utils/tripPlanner.js';
import { formatInr } from '../utils/geo.js';
import { 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Compass, 
  Car, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Utensils, 
  Luggage 
} from 'lucide-react';

export const TripPlannerView: React.FC = () => {
  const [startingCity, setStartingCity] = useState('Pune');
  const [durationDays, setDurationDays] = useState<1 | 2 | 3>(2);
  const [budgetInr, setBudgetInr] = useState<number>(8000);
  const [selectedInterests, setSelectedInterests] = useState<TourismCategory[]>([
    'fort',
    'historical',
    'food',
    'nature'
  ]);
  const [travelMode, setTravelMode] = useState<'car' | 'bike' | 'public_transport'>('car');
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(() => {
    return generateWeekendTripPlan({
      startingCity: 'Pune',
      durationDays: 2,
      budgetInr: 8000,
      interests: ['fort', 'historical', 'food', 'nature'],
      travelPace: 'moderate',
      travelMode: 'car',
    });
  });

  const cityPresets = ['Pune', 'Mumbai', 'Nashik', 'Dhule', 'Shirpur', 'Delhi', 'Bengaluru', 'Jaipur', 'Hyderabad'];

  const interestOptions: { id: TourismCategory; label: string; icon: string }[] = [
    { id: 'fort', label: 'Forts & Citadels', icon: '🏰' },
    { id: 'historical', label: 'UNESCO Heritage & Caves', icon: '🏛️' },
    { id: 'temple', label: 'Temples & Spiritual', icon: '🛕' },
    { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
    { id: 'waterfall', label: 'Waterfalls & Cascades', icon: '🌊' },
    { id: 'food', label: 'Local Food & Street Bazaars', icon: '🍲' },
    { id: 'hill_station', label: 'Hill Stations & Mist', icon: '⛰️' },
    { id: 'adventure', label: 'Adventure & Trekking', icon: '🧗' },
  ];

  const handleToggleInterest = (cat: TourismCategory) => {
    if (selectedInterests.includes(cat)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((c) => c !== cat));
      }
    } else {
      setSelectedInterests([...selectedInterests, cat]);
    }
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = generateWeekendTripPlan({
      startingCity: startingCity.trim() || 'Pune',
      durationDays,
      budgetInr,
      interests: selectedInterests,
      travelPace: 'moderate',
      travelMode,
    });
    setGeneratedItinerary(plan);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#354D43]">
          <Calendar className="w-3.5 h-3.5 text-[#C9A982]" />
          <span>Discover the Local Within · Interactive Itinerary Engine</span>
        </div>
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#29323A]">
          Weekend & One-Day Trip Planner
        </h2>
        <p className="text-sm text-[#53626F] max-w-3xl leading-relaxed font-light">
          Craft realistic itineraries with hour-by-hour breakdowns, authentic regional food recommendations, and honest INR budget estimates for one-day dashes or relaxed weekend getaways across India with lokavi.
        </p>
      </div>

      {/* Trip Configuration Form */}
      <form
        onSubmit={handleGeneratePlan}
        className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Starting City */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" /> Starting City
            </label>
            <input
              type="text"
              value={startingCity}
              onChange={(e) => setStartingCity(e.target.value)}
              placeholder="e.g. Pune, Mumbai, Dhule, Shirpur..."
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E2D6C0] rounded-xl text-[#231F1D] focus:outline-none focus:border-[#C85A32]"
            />
            <div className="flex items-center gap-1 flex-wrap pt-1">
              <span className="text-[11px] text-[#8C8275]">Quick:</span>
              {cityPresets.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setStartingCity(c)}
                  className={`text-[11px] px-2 py-0.5 rounded border ${
                    startingCity.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#1A3E31] text-white border-[#1A3E31]'
                      : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5A524A]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C85A32]" /> Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 1, label: '1 Day', sub: 'Quick Excursion' },
                { days: 2, label: '2 Days', sub: 'Weekend Trip' },
                { days: 3, label: '3 Days', sub: 'Long Weekend' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.days}
                  onClick={() => setDurationDays(item.days as any)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    durationDays === item.days
                      ? 'bg-[#1A3E31] text-white border-[#1A3E31] shadow-2xs'
                      : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget in INR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#D97706]" /> Budget (INR)
              </label>
              <span className="text-xs font-mono font-bold text-[#C85A32]">
                {formatInr(budgetInr)}
              </span>
            </div>
            <input
              type="range"
              min={2500}
              max={30000}
              step={500}
              value={budgetInr}
              onChange={(e) => setBudgetInr(Number(e.target.value))}
              className="w-full accent-[#C85A32] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-[#8C8275]">
              <span>Budget (₹2.5k)</span>
              <span>Mid-Range (₹12k)</span>
              <span>Premium (₹30k)</span>
            </div>
          </div>

        </div>

        {/* Travel Mode & Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F2ECE1]">
          
          {/* Mode of travel */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#C85A32]" /> Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'car', label: 'Car / Cab', desc: 'Family flexibility' },
                { id: 'bike', label: 'Motorbike', desc: 'Scenic ghat rides' },
                { id: 'public_transport', label: 'Bus / Train', desc: 'Economical travel' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setTravelMode(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    travelMode === m.id
                      ? 'bg-[#C85A32] text-white border-[#C85A32]'
                      : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] opacity-80">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C85A32]" /> Vibe & Interests
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleToggleInterest(opt.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1A3E31] text-white border-[#1A3E31] font-semibold'
                        : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5A524A] hover:bg-[#FAF2E6]'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Generate Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#C85A32] hover:bg-[#A94522] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom Itinerary</span>
          </button>
        </div>

      </form>

      {/* Generated Itinerary Display */}
      {generatedItinerary && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="bg-[#1A3E31] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md">
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FDBA74] uppercase tracking-wider">
                <span>{generatedItinerary.durationDays}-Day Suggested Itinerary</span>
                <span>·</span>
                <span>From {generatedItinerary.startingCity}</span>
              </div>
              <h3 className="font-heritage text-2xl sm:text-3xl font-bold">
                {generatedItinerary.tripTitle}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {generatedItinerary.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">Estimated Cost:</span>
                  <span className="font-mono font-bold text-base text-[#FDBA74]">
                    {formatInr(generatedItinerary.expenseBreakdown.total)}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">Your Budget:</span>
                  <span className="font-mono font-medium text-white/90">
                    {formatInr(budgetInr)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Plan</span>
              </button>
            </div>
          </div>

          {/* Days Timeline */}
          <div className="space-y-6">
            {generatedItinerary.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm space-y-4"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F2ECE1]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#C85A32] text-white text-xs font-bold flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h4 className="font-heritage text-base font-bold text-[#1A3E31]">
                        Day {day.dayNumber}: {day.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#8C8275]">
                        <span>Key stops: {day.highlights.join(' · ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-semibold text-[#6B635B]">
                    Day Est: {formatInr(day.dayTotalEstimatedInr)}
                  </div>
                </div>

                {/* Day Activities List */}
                <div className="space-y-4 pt-1">
                  {day.activities.map((act, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#C85A32]">
                            {act.timeSlot}
                          </span>
                          <span className="text-xs font-bold text-[#1A3E31]">
                            — {act.activityTitle}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#8C8275]">
                          Approx: {formatInr(act.estimatedCostInr)}
                        </span>
                      </div>

                      <p className="text-xs text-[#5A524A] leading-relaxed">
                        {act.description}
                      </p>

                      {act.tips && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#C85A32] font-medium pt-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Tip: {act.tips}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Realistic Expenses Breakdown & Packing Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Expense Breakdown Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
              <h4 className="font-heritage text-base font-bold text-[#1A3E31] flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-[#D97706]" /> Estimated Expense Breakdown
              </h4>
              <div className="space-y-2.5 text-xs text-[#5A524A]">
                <div className="flex items-center justify-between py-1 border-b border-[#F2ECE1]">
                  <span>Transport & Tolls ({travelMode}):</span>
                  <span className="font-mono font-semibold">{formatInr(generatedItinerary.expenseBreakdown.transport)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F2ECE1]">
                  <span>Lodging & Stay ({durationDays > 1 ? `${durationDays - 1} night(s)` : 'Day trip'}):</span>
                  <span className="font-mono font-semibold">{formatInr(generatedItinerary.expenseBreakdown.accommodation)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F2ECE1]">
                  <span>Meals & Street Food ({durationDays} days):</span>
                  <span className="font-mono font-semibold">{formatInr(generatedItinerary.expenseBreakdown.foodAndDining)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F2ECE1]">
                  <span>Monument Entry Passes & Parking:</span>
                  <span className="font-mono font-semibold">{formatInr(generatedItinerary.expenseBreakdown.entryTickets)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F2ECE1]">
                  <span>Buffer / Local Shopping:</span>
                  <span className="font-mono font-semibold">{formatInr(generatedItinerary.expenseBreakdown.bufferAndActivities)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm font-bold text-[#1A3E31]">
                  <span>Total Estimated Spend:</span>
                  <span className="font-mono text-[#C85A32]">{formatInr(generatedItinerary.expenseBreakdown.total)}</span>
                </div>
              </div>
            </div>

            {/* Packing Advice Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
              <h4 className="font-heritage text-base font-bold text-[#1A3E31] flex items-center gap-2">
                <Luggage className="w-4 h-4 text-[#C85A32]" /> Packing & Route Advice
              </h4>
              <p className="text-xs text-[#6B635B]">
                {generatedItinerary.routeAdvice}
              </p>
              <ul className="space-y-2 text-xs text-[#5A524A]">
                {generatedItinerary.packingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

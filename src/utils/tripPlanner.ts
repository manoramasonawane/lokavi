import { Destination, GeneratedItinerary, ItineraryDay, TripPlanPreferences, TourismCategory } from '../types/tourism.js';
import { DESTINATIONS } from '../data/destinations.js';
import { calculateDistanceKm } from './geo.js';
import { CITY_PIN_DIRECTORY } from '../data/pinCodes.js';

export function generateWeekendTripPlan(prefs: TripPlanPreferences): GeneratedItinerary {
  // 1. Locate starting city coordinates if possible
  const startLoc = CITY_PIN_DIRECTORY.find(
    (c) => c.city.toLowerCase() === prefs.startingCity.toLowerCase()
  );

  // 2. Score destinations based on proximity and interest match
  const scored = DESTINATIONS.map((dest) => {
    let score = 0;
    // Interest matches
    const matchingInterests = dest.categories.filter((cat) => prefs.interests.includes(cat));
    score += matchingInterests.length * 20;

    // Proximity check if we know starting coordinates
    let distanceKm = 150; // fallback default
    if (startLoc) {
      distanceKm = calculateDistanceKm(startLoc.lat, startLoc.lng, dest.coordinates.lat, dest.coordinates.lng);
      // For 1-day trips, prefer destinations within 250km
      if (prefs.durationDays === 1) {
        if (distanceKm <= 150) score += 35;
        else if (distanceKm <= 250) score += 15;
        else score -= 30; // too far for a single day
      } else {
        // 2-3 day weekend trips can comfortably cover up to 500km
        if (distanceKm <= 350) score += 30;
        else if (distanceKm <= 600) score += 15;
      }
    }

    // Weekend getaway suitability
    if (dest.isWeekendGetaway) score += 15;
    if (dest.suggestedStartingCities?.some((c) => c.toLowerCase() === prefs.startingCity.toLowerCase())) {
      score += 25;
    }

    return { dest, score, distanceKm };
  });

  scored.sort((a, b) => b.score - a.score);
  const primary = scored[0]?.dest || DESTINATIONS[0];
  const distance = scored[0]?.distanceKm || 120;

  // 3. Build days
  const days: ItineraryDay[] = [];
  const duration = prefs.durationDays;

  // Day 1
  const day1Activities = [
    {
      timeSlot: '07:00 AM – 09:30 AM',
      destinationName: primary.name,
      activityTitle: `Scenic Drive / Journey from ${prefs.startingCity} to ${primary.city}`,
      description: `Depart early to avoid highway choke points. Enjoy a roadside breakfast featuring traditional regional snacks along the expressway.`,
      category: 'adventure' as TourismCategory,
      estimatedCostInr: prefs.travelMode === 'car' ? 800 : prefs.travelMode === 'bike' ? 400 : 350,
      tips: 'Fill fuel the previous evening; carry offline maps and bottled water.'
    },
    {
      timeSlot: '10:00 AM – 01:00 PM',
      destinationName: primary.name,
      activityTitle: `Main Landmark Exploration: ${primary.name}`,
      description: primary.description,
      category: primary.categories[0] || 'historical',
      estimatedCostInr: 150,
      tips: primary.travelTips[0] || 'Wear comfortable walking shoes.'
    },
    {
      timeSlot: '01:30 PM – 03:00 PM',
      destinationName: primary.city,
      activityTitle: `Authentic Regional Lunch & Refreshment`,
      description: primary.localFood[0]
        ? `Savor ${primary.localFood[0].name} – ${primary.localFood[0].description}`
        : 'Indulge in authentic regional thali with fresh buttermilk.',
      category: 'food' as TourismCategory,
      estimatedCostInr: 350,
      tips: 'Ask for mild spice level if travelling with children.'
    },
    {
      timeSlot: '04:30 PM – 06:45 PM',
      destinationName: primary.nearbyAttractions[0]?.name || primary.city,
      activityTitle: `Sunset Vantage & Local Cultural Stroll`,
      description: `Visit ${primary.nearbyAttractions[0]?.name || 'the local viewpoint/bazaar'} for photography, golden-hour light, and artisan handicrafts.`,
      category: 'nature' as TourismCategory,
      estimatedCostInr: 100,
      tips: primary.travelTips[1] || 'Reach 30 minutes before sunset.'
    },
    {
      timeSlot: '07:30 PM – 09:30 PM',
      destinationName: primary.city,
      activityTitle: duration === 1 ? `Evening Street Food Walk & Return Journey` : `Dinner & Check-in at Local Heritage Stay`,
      description: duration === 1
        ? `Grab evening snacks like ${primary.localFood[1]?.name || 'hot chai & savories'} before driving back to ${prefs.startingCity}.`
        : `Check into your resort/homestay. Relish an authentic dinner and rest for tomorrow’s excursions.`,
      category: 'food' as TourismCategory,
      estimatedCostInr: duration === 1 ? 400 : 700,
      tips: 'Drive safe on state highways during nighttime.'
    }
  ];

  days.push({
    dayNumber: 1,
    title: `Arrival & Prime Exploration of ${primary.name}`,
    highlights: [primary.name, primary.localFood[0]?.name || 'Local Delicacies', primary.nearbyAttractions[0]?.name || 'Sunset Viewpoint'],
    activities: day1Activities,
    dayTotalEstimatedInr: day1Activities.reduce((acc, a) => acc + a.estimatedCostInr, 0)
  });

  // Day 2 (if duration >= 2)
  if (duration >= 2) {
    const nearby1 = primary.nearbyAttractions[0]?.name || 'Nature Trail';
    const nearby2 = primary.nearbyAttractions[1]?.name || 'Heritage Sanctuary';
    const day2Activities = [
      {
        timeSlot: '06:30 AM – 09:00 AM',
        destinationName: nearby1,
        activityTitle: `Dawn Panorama & Rural Breakfast`,
        description: `Witness morning mist rising over the hills or river. Enjoy freshly cooked village breakfast.`,
        category: 'nature' as TourismCategory,
        estimatedCostInr: 250,
        tips: 'Crisp morning air makes for stunning natural light photography.'
      },
      {
        timeSlot: '10:00 AM – 01:00 PM',
        destinationName: nearby2,
        activityTitle: `Deep Cultural Excursion: ${nearby2}`,
        description: `Explore local ancient temples, fort ruins, or craft cooperatives. Interact with local craftsmen.`,
        category: 'historical' as TourismCategory,
        estimatedCostInr: 100,
        tips: 'Support local artisans by buying genuine handicrafts directly.'
      },
      {
        timeSlot: '01:30 PM – 03:00 PM',
        destinationName: primary.city,
        activityTitle: `Farm-to-Table Traditional Lunch`,
        description: primary.localFood[1]
          ? `Enjoy ${primary.localFood[1].name} with accompaniments.`
          : 'Traditional local meal cooked on firewood.',
        category: 'food' as TourismCategory,
        estimatedCostInr: 350,
        tips: 'Try seasonal local fruits and homemade chutneys.'
      },
      {
        timeSlot: '04:00 PM – 06:30 PM',
        destinationName: primary.city,
        activityTitle: duration === 2 ? `Souvenir Shopping & Return Journey` : `Lakeside Relaxation & Sunset Tea`,
        description: duration === 2
          ? `Pick up regional snacks, masalas, or handicrafts before embarking on the scenic drive back to ${prefs.startingCity}.`
          : `Unwind by the tranquil waterfront or garden with hot ginger tea and local snacks.`,
        category: 'family' as TourismCategory,
        estimatedCostInr: duration === 2 ? 600 : 300,
        tips: 'Pack your vehicle before checking out of your stay.'
      }
    ];

    days.push({
      dayNumber: 2,
      title: `Offbeat Heritage, Local Bazaars & Countryside Charm`,
      highlights: [nearby1, nearby2, primary.localFood[1]?.name || 'Artisan Markets'],
      activities: day2Activities,
      dayTotalEstimatedInr: day2Activities.reduce((acc, a) => acc + a.estimatedCostInr, 0)
    });
  }

  // Day 3 (if duration === 3)
  if (duration === 3) {
    const day3Activities = [
      {
        timeSlot: '08:00 AM – 11:30 AM',
        destinationName: primary.city,
        activityTitle: `Hidden Gem Morning Exploration`,
        description: `Visit quiet lesser-known spots, village dams, or serene spiritual sanctuaries away from the tourist crowd.`,
        category: 'hidden_gem' as TourismCategory,
        estimatedCostInr: 150,
        tips: 'Enjoy the unhurried morning pace.'
      },
      {
        timeSlot: '12:30 PM – 02:00 PM',
        destinationName: primary.city,
        activityTitle: `Celebratory Farewell Lunch`,
        description: `Delight in the best rated local dhaba or thali restaurant with signature dessert.`,
        category: 'food' as TourismCategory,
        estimatedCostInr: 450,
        tips: 'Carry water and sweet treats for the road.'
      },
      {
        timeSlot: '03:00 PM – 07:00 PM',
        destinationName: prefs.startingCity,
        activityTitle: `Relaxed Road Trip Back to ${prefs.startingCity}`,
        description: `Comfortable journey back home with memories, photographs, and regional goodies.`,
        category: 'adventure' as TourismCategory,
        estimatedCostInr: prefs.travelMode === 'car' ? 800 : 400,
        tips: 'Plan a rest-stop mid-way to stretch your legs.'
      }
    ];

    days.push({
      dayNumber: 3,
      title: `Secret Spots & Peaceful Return Journey`,
      highlights: ['Hidden Gems', 'Farewell Banquet', 'Scenic Country Drive'],
      activities: day3Activities,
      dayTotalEstimatedInr: day3Activities.reduce((acc, a) => acc + a.estimatedCostInr, 0)
    });
  }

  // Compute realistic expense breakdown
  const transportPerDay = prefs.travelMode === 'car' ? 1400 : prefs.travelMode === 'bike' ? 700 : 500;
  const transportTotal = Math.round(transportPerDay * duration * (distance > 200 ? 1.3 : 1));
  const stayPerNight = prefs.budgetInr > 12000 ? 3200 : prefs.budgetInr > 5000 ? 1800 : 1000;
  const accommodationTotal = duration === 1 ? 0 : stayPerNight * (duration - 1);
  const foodTotal = duration * 850;
  const entryTotal = duration * 250;
  const bufferTotal = Math.max(500, Math.round(prefs.budgetInr * 0.1));
  const total = transportTotal + accommodationTotal + foodTotal + entryTotal + bufferTotal;

  return {
    id: `plan-${Date.now()}`,
    tripTitle: `${duration}-Day ${primary.name.split(' ')[0]} Getaway from ${prefs.startingCity}`,
    summary: `A carefully paced ${duration}-day itinerary designed around ${primary.name} in ${primary.state}, featuring historical monuments, scenic vistas, and authentic ${primary.localFood[0]?.name || 'local cuisine'}.`,
    startingCity: prefs.startingCity,
    durationDays: duration,
    primaryDestination: primary.name,
    days,
    expenseBreakdown: {
      transport: transportTotal,
      accommodation: accommodationTotal,
      foodAndDining: foodTotal,
      entryTickets: entryTotal,
      bufferAndActivities: bufferTotal,
      total,
    },
    packingTips: [
      'Comfortable walking shoes with good traction for stone steps and nature trails.',
      'Refillable water bottle, sun hat, UV sunglasses, and light cotton clothes for daytime.',
      'Light shawl or jacket for evening drop in temperatures and breezy hilltops.',
      'Cash in small INR denominations (₹50, ₹100, ₹200) for rural toll booths, prasad, and street vendors.',
      'Power bank to keep cameras and mobile GPS charged during full-day explorations.'
    ],
    routeAdvice: `Take NH highways early in the morning before 7:00 AM to beat rush hour traffic out of ${prefs.startingCity}. Keep FASTag recharged for toll plazas.`
  };
}

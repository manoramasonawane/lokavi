export type TourismCategory =
  | 'temple'
  | 'fort'
  | 'historical'
  | 'nature'
  | 'waterfall'
  | 'beach'
  | 'hill_station'
  | 'adventure'
  | 'food'
  | 'family'
  | 'hidden_gem';

export interface VerifiedField {
  value: string;
  isVerified: boolean;
  note?: string;
}

export interface LocalFoodItem {
  name: string;
  description: string;
  recommendedPlaces?: string;
  isVegetarian?: boolean;
}

export interface NearbyAttraction {
  name: string;
  distanceKm: number;
  category: TourismCategory;
}

export interface Destination {
  id: string;
  name: string;
  localName?: string;
  city: string;
  district: string;
  state: string;
  region: 'West' | 'North' | 'South' | 'East' | 'Central' | 'North-East';
  categories: TourismCategory[];
  description: string;
  significance: string;
  bestTimeToVisit: string;
  entryFee: VerifiedField;
  timings: VerifiedField;
  visitDuration: string;
  travelTips: string[];
  localFood: LocalFoodItem[];
  nearbyAttractions: NearbyAttraction[];
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  gallery?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isWeekendGetaway?: boolean;
  suggestedStartingCities?: string[];
  rating: number;
  reviewsCount: number;
}

export interface IndianState {
  code: string;
  name: string;
  capital: string;
  type: 'State' | 'Union Territory';
  region: 'West' | 'North' | 'South' | 'East' | 'Central' | 'North-East';
  popularFor: string;
  destinationCount?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  cityName?: string;
  pinCode?: string;
  isRealGps: boolean;
}

export interface TripPlanPreferences {
  startingCity: string;
  durationDays: 1 | 2 | 3;
  budgetInr: number;
  interests: TourismCategory[];
  travelPace: 'relaxed' | 'moderate' | 'packed';
  travelMode: 'car' | 'bike' | 'public_transport';
}

export interface ItineraryActivity {
  timeSlot: string; // e.g. "08:00 AM - 10:30 AM"
  destinationName: string;
  activityTitle: string;
  description: string;
  category: TourismCategory;
  estimatedCostInr: number;
  tips?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  highlights: string[];
  activities: ItineraryActivity[];
  dayTotalEstimatedInr: number;
}

export interface GeneratedItinerary {
  id: string;
  tripTitle: string;
  summary: string;
  startingCity: string;
  durationDays: number;
  primaryDestination: string;
  days: ItineraryDay[];
  expenseBreakdown: {
    transport: number;
    accommodation: number;
    foodAndDining: number;
    entryTickets: number;
    bufferAndActivities: number;
    total: number;
  };
  packingTips: string[];
  routeAdvice: string;
}

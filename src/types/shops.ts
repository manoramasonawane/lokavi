export type ShopCategory =
  | 'grocery'
  | 'medical'
  | 'clothing'
  | 'handicrafts'
  | 'market'
  | 'food_dining'
  | 'electronics'
  | 'bookstore'
  | 'artisan'
  | 'services';

export interface ShopCategoryMeta {
  id: ShopCategory;
  label: string;
  hindiLabel: string;
  iconName: string;
  color: string;
}

export interface LocalShop {
  id: string;
  name: string;
  localName?: string;
  category: ShopCategory;
  categoryLabel: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  address: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearDestinationId?: string;
  nearDestinationName?: string;
  distanceFromAttractionKm?: number;
  timings?: string;
  isOpenNow?: boolean;
  isVerified?: boolean;
  phone?: string;
  website?: string;
  specialties?: string[];
  paymentMethods?: string[];
  isSampleDemonstration: boolean;
}

export interface ShopFilterParams {
  searchQuery: string;
  category: ShopCategory | 'all';
  selectedCity: string;
  nearDestinationId?: string;
  maxDistanceKm?: number;
  openNowOnly: boolean;
  sortBy: 'nearest' | 'rating' | 'name';
}

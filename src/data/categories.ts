import { TourismCategory } from '../types/tourism.js';

export interface CategoryMeta {
  id: TourismCategory;
  label: string;
  hindiLabel: string;
  description: string;
  iconName: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'temple', label: 'Temples & Spiritual', hindiLabel: 'मंदिर व तीर्थक्षेत्र', description: 'Ancient sanctums, jyotirlingas, ghats & sacred shrines', iconName: 'Flame' },
  { id: 'fort', label: 'Forts & Palaces', hindiLabel: 'किल्ले व राजवाडे', description: 'Historic Maratha, Rajput, and Mughal citadels', iconName: 'Shield' },
  { id: 'historical', label: 'Heritage & UNESCO Sites', hindiLabel: 'ऐतिहासिक वारसा', description: 'Rock-cut caves, architecture, museums & monuments', iconName: 'Landmark' },
  { id: 'nature', label: 'Nature & Wildlife', hindiLabel: 'निसर्ग व अभयारण्य', description: 'National parks, tiger reserves, lakes & sanctuaries', iconName: 'Trees' },
  { id: 'waterfall', label: 'Waterfalls & Rivers', hindiLabel: 'धबधबे व नद्या', description: 'Roaring monsoon cascades, river rapids & valleys', iconName: 'Waves' },
  { id: 'beach', label: 'Beaches & Backwaters', hindiLabel: 'समुद्रकिनारे व बॅकवॉटर', description: 'Golden sands, palm-fringed lagoons & coastal ports', iconName: 'Palmtree' },
  { id: 'hill_station', label: 'Hill Stations & Misty Peaks', hindiLabel: 'थंड हवेची ठिकाणे', description: 'Sahyadri & Himalayan retreats, tea hills & cool vistas', iconName: 'Mountain' },
  { id: 'adventure', label: 'Adventure & Trekking', hindiLabel: 'साहस व ट्रेकिंग', description: 'Fort scrambles, river rafting, camping & trails', iconName: 'Compass' },
  { id: 'food', label: 'Local Food & Street Markets', hindiLabel: 'स्थानिक खाद्यसंस्कृती', description: 'Authentic regional cuisines, street food & bazaars', iconName: 'Utensils' },
  { id: 'family', label: 'Family & Leisure', hindiLabel: 'कौटुंबिक सहल', description: 'Accessible sights, gardens, boat rides & resorts', iconName: 'Users' },
  { id: 'hidden_gem', label: 'Hidden Gems & Offbeat', hindiLabel: 'अनोखी व शांत ठिकाणे', description: 'Lesser-known hamlets, secret waterfalls & rustic trails', iconName: 'Sparkles' },
];

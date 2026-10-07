export type PriceStatus = 'available' | 'out_of_stock' | 'low_stock';
export type PriceTrendDirection = 'rising' | 'falling' | 'stable';

export interface PriceHistoryPoint {
  date: string;
  label: string;
  price: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  changeAmount?: number;
  changeNote?: string;
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  storeType: string;
  barangay: string;
  city: string;
  price: number;
  previousPrice?: number;
  unit: string;
  status: PriceStatus;
  updatedAt: string;
  verifiedCitizen: boolean;
  distanceKm: number;
  stockNote?: string;
}

export interface Commodity {
  id: string;
  name: string;
  localName?: string;
  category: string;
  subcategory: string;
  unit: string;
  standardUnit: string;
  image: string;
  description: string;
  currentAveragePrice: number;
  cheapestPrice: number;
  highestPrice: number;
  cheapestStoreId: string;
  cheapestStoreName: string;
  cheapestStoreLocation: string;
  status: PriceStatus;
  trend: PriceTrendDirection;
  trendPercentage: number;
  trendPeriodDays: number;
  lastUpdated: string;
  storePrices: StorePrice[];
  priceHistory: PriceHistoryPoint[];
  tags: string[];
  suggestedRetailPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  itemCount: number;
  averagePriceRange: string;
  image: string;
  popularItems: string[];
}

export interface MarketLocation {
  id: string;
  name: string;
  type: 'Public Wet Market' | 'Supermarket' | 'Grocery Store' | 'Farmers Market' | 'Barangay Talipapa';
  barangay: string;
  city: string;
  address: string;
  operatingHours: string;
  totalCommoditiesTracked: number;
  verifiedBadge: boolean;
  distanceKm: number;
  rating: number;
  featuredDealsCount: number;
  popularFor: string[];
}

export type NavigationTab = 'catalog' | 'compare' | 'categories' | 'locations' | 'trends' | 'basket';

export interface BasketItem {
  commodity: Commodity;
  quantity: number;
}

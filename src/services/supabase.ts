/**
 * Supabase Client & API Service for SUKI Commodity Price Monitoring System
 * 
 * Provides live connection, schema verification, data seeding, querying,
 * and real-time subscription for the frontend application.
 */

import { createClient } from '@supabase/supabase-js';
import type { 
  Commodity, 
  Category, 
  MarketLocation, 
  StorePrice, 
  PriceHistoryPoint,
  PriceStatus,
  PriceTrendDirection
} from '../types';
import { CATEGORIES, MARKETS, COMMODITIES } from '../data/mockData';

// Supabase Project Credentials
export const SUPABASE_URL = 'https://dsmxzovrvclvxyxkbpxx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXh6b3ZydmNsdnh5eGticHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjM4MzMsImV4cCI6MjEwNjg5OTgzM30.aSb-LkUcEoC26fdrK-EwEo0x9hUr86vWs-C4Sf4PvjU';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table definitions for verification and monitoring
export const DB_TABLES = [
  'categories',
  'market_locations',
  'commodities',
  'store_prices',
  'price_history',
  'citizen_price_reports'
] as const;

export type DbTableName = typeof DB_TABLES[number];

export interface TableStatusInfo {
  name: DbTableName;
  exists: boolean;
  rowCount: number;
  errorMessage?: string;
}

export interface NewCitizenReport {
  commodityId: string;
  marketId: string;
  reportedPrice: number;
  unit: string;
  notes?: string;
  reporterName?: string;
  reporterEmail?: string;
}

// ============================================================================
// API Service Methods (Correlating to Frontend Views)
// ============================================================================

export const SukiApi = {
  /**
   * Checks whether all required database tables exist in Supabase.
   */
  async checkAllTables(): Promise<{
    allExist: boolean;
    tables: TableStatusInfo[];
    supabaseReachable: boolean;
  }> {
    const results: TableStatusInfo[] = [];
    let reachable = true;

    for (const tableName of DB_TABLES) {
      try {
        const { data, count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          if (error.code === 'PGRST205' || error.message.includes('Could not find') || error.message.includes('schema cache')) {
            results.push({ name: tableName, exists: false, rowCount: 0, errorMessage: 'Table not created in schema' });
          } else {
            results.push({ name: tableName, exists: false, rowCount: 0, errorMessage: error.message });
          }
        } else {
          results.push({ name: tableName, exists: true, rowCount: count ?? (data ? data.length : 0) });
        }
      } catch (err: any) {
        reachable = false;
        results.push({ name: tableName, exists: false, rowCount: 0, errorMessage: err.message || 'Network error' });
      }
    }

    const allExist = results.every(t => t.exists);
    return { allExist, tables: results, supabaseReachable: reachable };
  },

  /**
   * 1. CATEGORIES VIEW
   * Fetches all categories with their item counts and price ranges.
   */
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*, commodities(count)')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase getCategories fallback to mock:', error.message);
      return CATEGORIES;
    }

    if (!data || data.length === 0) {
      return CATEGORIES;
    }

    return data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      tagline: cat.tagline || '',
      icon: cat.icon || 'Package',
      itemCount: cat.commodities?.[0]?.count ?? 0,
      averagePriceRange: cat.average_price_range || '',
      image: cat.image_url || '',
      popularItems: cat.popular_items || []
    }));
  },

  /**
   * 2. LOCATIONS VIEW
   * Fetches all market locations, optionally filtered by type or search query.
   */
  async getMarketLocations(options?: { type?: string; search?: string }): Promise<MarketLocation[]> {
    let query = supabase.from('market_locations').select('*');

    if (options?.type && options.type !== 'all') {
      query = query.eq('type', options.type);
    }

    if (options?.search) {
      const q = `%${options.search}%`;
      query = query.or(`name.ilike.${q},barangay.ilike.${q},city.ilike.${q}`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.warn('Supabase getMarketLocations fallback to mock:', error.message);
      return MARKETS;
    }

    if (!data || data.length === 0) {
      return MARKETS;
    }

    return data.map((m: any) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      barangay: m.barangay,
      city: m.city,
      address: m.address,
      operatingHours: m.operating_hours,
      totalCommoditiesTracked: 0,
      verifiedBadge: m.verified_badge,
      distanceKm: Number(m.distance_km) || 0,
      rating: Number(m.rating) || 4.5,
      featuredDealsCount: m.featured_deals_count || 0,
      popularFor: m.popular_for || []
    }));
  },

  /**
   * 3. CATALOG & SEARCH VIEW
   * Fetches all commodities with joined store prices, computed cheapest price, and trends.
   */
  async getCommodities(options?: {
    categoryId?: string;
    searchQuery?: string;
    locationBarangay?: string;
    statusFilter?: string;
    sortBy?: 'cheapest' | 'expensive' | 'name' | 'trend-drop';
  }): Promise<Commodity[]> {
    const { data, error } = await supabase
      .from('commodities')
      .select(`
        *,
        store_prices (
          id,
          price,
          previous_price,
          unit,
          status,
          verified_citizen,
          stock_note,
          updated_at,
          market_locations:store_id (
            id,
            name,
            type,
            barangay,
            city,
            distance_km
          )
        ),
        price_history (
          recorded_date,
          label,
          price,
          average_price,
          lowest_price,
          highest_price,
          change_amount,
          change_note
        )
      `)
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      console.warn('Supabase getCommodities fallback to mock:', error?.message || 'Empty table');
      return COMMODITIES;
    }

    // Map and transform to the frontend's Commodity interface
    const commodities: Commodity[] = data.map((raw: any) => {
      const storePrices: StorePrice[] = (raw.store_prices || []).map((sp: any) => {
        const m = sp.market_locations || {};
        return {
          storeId: m.id || sp.store_id,
          storeName: m.name || 'Unknown Store',
          storeType: m.type || 'Public Market',
          barangay: m.barangay || '',
          city: m.city || 'Calbayog City',
          price: Number(sp.price),
          previousPrice: sp.previous_price ? Number(sp.previous_price) : undefined,
          unit: sp.unit,
          status: sp.status as PriceStatus,
          updatedAt: new Date(sp.updated_at).toLocaleDateString(),
          verifiedCitizen: Boolean(sp.verified_citizen),
          distanceKm: Number(m.distance_km) || 0,
          stockNote: sp.stock_note || undefined,
        };
      });

      const validPrices = storePrices.filter(sp => sp.status === 'available').map(sp => sp.price);
      const allPrices = storePrices.map(sp => sp.price);
      const cheapestPrice = validPrices.length ? Math.min(...validPrices) : (allPrices.length ? Math.min(...allPrices) : 0);
      const highestPrice = allPrices.length ? Math.max(...allPrices) : 0;
      const currentAveragePrice = allPrices.length 
        ? Number((allPrices.reduce((a, b) => a + b, 0) / allPrices.length).toFixed(2)) 
        : 0;

      const cheapestStore = storePrices.find(sp => sp.price === cheapestPrice);

      const priceHistory: PriceHistoryPoint[] = (raw.price_history || [])
        .sort((a: any, b: any) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime())
        .map((ph: any) => ({
          date: ph.recorded_date,
          label: ph.label || ph.recorded_date,
          price: Number(ph.price),
          averagePrice: Number(ph.average_price || ph.price),
          lowestPrice: Number(ph.lowest_price || ph.price),
          highestPrice: Number(ph.highest_price || ph.price),
          changeAmount: ph.change_amount ? Number(ph.change_amount) : undefined,
          changeNote: ph.change_note || undefined,
        }));

      // Calculate trend from history
      let trend: PriceTrendDirection = 'stable';
      let trendPercentage = 0;
      if (priceHistory.length >= 2) {
        const first = priceHistory[0].price;
        const last = priceHistory[priceHistory.length - 1].price;
        const diff = last - first;
        if (diff > 0.5) trend = 'rising';
        else if (diff < -0.5) trend = 'falling';
        trendPercentage = first > 0 ? Number(((Math.abs(diff) / first) * 100).toFixed(1)) : 0;
      }

      return {
        id: raw.id,
        name: raw.name,
        localName: raw.local_name || undefined,
        category: raw.category_id,
        subcategory: raw.subcategory,
        unit: raw.unit,
        standardUnit: raw.standard_unit,
        image: raw.image_url,
        description: raw.description,
        currentAveragePrice,
        cheapestPrice,
        highestPrice,
        cheapestStoreId: cheapestStore?.storeId || '',
        cheapestStoreName: cheapestStore?.storeName || '',
        cheapestStoreLocation: cheapestStore ? `${cheapestStore.barangay}, ${cheapestStore.city}` : '',
        status: (storePrices.some(sp => sp.status === 'available') ? 'available' : 'out_of_stock') as PriceStatus,
        trend,
        trendPercentage,
        trendPeriodDays: 30,
        lastUpdated: 'Recently updated',
        storePrices,
        priceHistory,
        tags: raw.tags || [],
        suggestedRetailPrice: raw.suggested_retail_price ? Number(raw.suggested_retail_price) : undefined,
      };
    });

    // Apply sorting
    if (options?.sortBy === 'cheapest') {
      commodities.sort((a, b) => a.cheapestPrice - b.cheapestPrice);
    } else if (options?.sortBy === 'expensive') {
      commodities.sort((a, b) => b.cheapestPrice - a.cheapestPrice);
    } else if (options?.sortBy === 'name') {
      commodities.sort((a, b) => a.name.localeCompare(b.name));
    } else if (options?.sortBy === 'trend-drop') {
      commodities.sort((a, b) => a.trendPercentage - b.trendPercentage);
    }

    return commodities;
  },

  /**
   * 4. SEED / POPULATE DATABASE
   * Batches and populates categories, market locations, commodities,
   * store prices, and longitudinal price history from mock data into Supabase.
   */
  async seedAllData(onProgress?: (message: string, progressPct: number) => void): Promise<{
    success: boolean;
    inserted: { categories: number; markets: number; commodities: number; storePrices: number; history: number };
    error?: string;
  }> {
    try {
      onProgress?.('Verifying Supabase table existence...', 10);
      const status = await this.checkAllTables();
      if (!status.allExist) {
        const missing = status.tables.filter(t => !t.exists).map(t => t.name).join(', ');
        throw new Error(`Tables not found in Supabase: [${missing}]. Please run the SQL schema script in Supabase first.`);
      }

      // 1. Populate Categories
      onProgress?.('Populating 9 Categories...', 25);
      const categoryRows = CATEGORIES.map((c, index) => ({
        id: c.id,
        name: c.name,
        tagline: c.tagline,
        icon: c.icon,
        average_price_range: c.averagePriceRange,
        image_url: c.image,
        popular_items: c.popularItems,
        display_order: index + 1
      }));
      const { error: catErr } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'id' });
      if (catErr) throw new Error(`Failed to seed categories: ${catErr.message}`);

      // 2. Populate Market Locations
      onProgress?.('Populating 6 Market Locations across Calbayog City...', 45);
      const marketRows = MARKETS.map(m => ({
        id: m.id,
        name: m.name,
        type: m.type,
        barangay: m.barangay,
        city: m.city,
        address: m.address,
        operating_hours: m.operatingHours,
        verified_badge: m.verifiedBadge,
        distance_km: m.distanceKm,
        rating: m.rating,
        featured_deals_count: m.featuredDealsCount,
        popular_for: m.popularFor
      }));
      const { error: mktErr } = await supabase.from('market_locations').upsert(marketRows, { onConflict: 'id' });
      if (mktErr) throw new Error(`Failed to seed market locations: ${mktErr.message}`);

      // 3. Populate Commodities
      onProgress?.('Populating Monitored Commodities...', 65);
      const commodityRows = COMMODITIES.map(c => ({
        id: c.id,
        name: c.name,
        local_name: c.localName || null,
        category_id: c.category,
        subcategory: c.subcategory,
        unit: c.unit,
        standard_unit: c.standardUnit,
        image_url: c.image,
        description: c.description,
        suggested_retail_price: c.suggestedRetailPrice || null,
        tags: c.tags,
        is_active: true
      }));
      const { error: cmdErr } = await supabase.from('commodities').upsert(commodityRows, { onConflict: 'id' });
      if (cmdErr) throw new Error(`Failed to seed commodities: ${cmdErr.message}`);

      // 4. Populate Store Prices
      onProgress?.('Linking Store Prices across Markets...', 85);
      const storePriceRows: any[] = [];
      COMMODITIES.forEach(c => {
        c.storePrices.forEach(sp => {
          storePriceRows.push({
            commodity_id: c.id,
            store_id: sp.storeId,
            price: sp.price,
            previous_price: sp.previousPrice || null,
            unit: sp.unit,
            status: sp.status,
            verified_citizen: sp.verifiedCitizen,
            stock_note: sp.stockNote || null
          });
        });
      });
      const { error: spErr } = await supabase.from('store_prices').upsert(storePriceRows, { 
        onConflict: 'commodity_id,store_id,unit' 
      });
      if (spErr) throw new Error(`Failed to seed store prices: ${spErr.message}`);

      // 5. Populate Price History
      onProgress?.('Seeding 30-Day Longitudinal Price History...', 95);
      const historyRows: any[] = [];
      COMMODITIES.forEach(c => {
        c.priceHistory.forEach(ph => {
          historyRows.push({
            commodity_id: c.id,
            recorded_date: ph.date,
            label: ph.label,
            price: ph.price,
            average_price: ph.averagePrice,
            lowest_price: ph.lowestPrice,
            highest_price: ph.highestPrice,
            change_amount: ph.changeAmount || null,
            change_note: ph.changeNote || null
          });
        });
      });
      if (historyRows.length > 0) {
        const { error: phErr } = await supabase.from('price_history').insert(historyRows);
        if (phErr) console.warn('Price history seed note:', phErr.message);
      }

      onProgress?.('Database population successfully completed!', 100);

      return {
        success: true,
        inserted: {
          categories: categoryRows.length,
          markets: marketRows.length,
          commodities: commodityRows.length,
          storePrices: storePriceRows.length,
          history: historyRows.length
        }
      };
    } catch (err: any) {
      return {
        success: false,
        inserted: { categories: 0, markets: 0, commodities: 0, storePrices: 0, history: 0 },
        error: err.message || 'Seeding failed'
      };
    }
  },

  /**
   * 5. CITIZEN PRICE REPORTING (ReportPriceModal)
   */
  async reportPrice(report: NewCitizenReport): Promise<{ success: boolean; data?: any; error?: any }> {
    const { data, error } = await supabase
      .from('citizen_price_reports')
      .insert({
        commodity_id: report.commodityId,
        market_id: report.marketId,
        reported_price: report.reportedPrice,
        unit: report.unit,
        notes: report.notes || null,
        reporter_name: report.reporterName || 'Citizen Contributor',
        verification_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting citizen report:', error);
      return { success: false, error };
    }

    // Also update or insert the live store price
    await supabase.from('store_prices').upsert({
      commodity_id: report.commodityId,
      store_id: report.marketId,
      price: report.reportedPrice,
      unit: report.unit,
      status: 'available',
      verified_citizen: true,
      stock_note: report.notes || 'Citizen contribution'
    }, { onConflict: 'commodity_id,store_id,unit' });

    return { success: true, data };
  }
};

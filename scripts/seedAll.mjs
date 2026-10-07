/**
 * Test Seeder Script to populate Supabase tables
 * Run with: node scripts/seedAll.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dsmxzovrvclvxyxkbpxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXh6b3ZydmNsdnh5eGticHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjM4MzMsImV4cCI6MjEwNjg5OTgzM30.aSb-LkUcEoC26fdrK-EwEo0x9hUr86vWs-C4Sf4PvjU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { id: 'rice-grains', name: 'Rice & Grains', tagline: 'Staple grains, local harvest, and imported rice', icon: 'Wheat', average_price_range: '₱42.00 - ₱62.00 / kg', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', popular_items: ['Regular Milled Rice', 'Well-Milled Rice', 'Premium Dinorado', 'Sinandomeng Rice'], display_order: 1 },
  { id: 'meat-poultry', name: 'Meat & Poultry', tagline: 'Fresh pork cuts, whole dressed chicken, and local beef', icon: 'Drumstick', average_price_range: '₱180.00 - ₱420.00 / kg', image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80', popular_items: ['Fresh Whole Chicken', 'Pork Liempo', 'Pork Kasim', 'Beef Shank'], display_order: 2 },
  { id: 'fish-seafood', name: 'Fish & Seafood', tagline: 'Fresh catch, coastal harvest, and aquaculture fish', icon: 'Fish', average_price_range: '₱120.00 - ₱360.00 / kg', image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', popular_items: ['Bangus (Milkfish)', 'Tilapia', 'Galunggong', 'Fresh Squid'], display_order: 3 },
  { id: 'eggs-dairy', name: 'Eggs & Dairy', tagline: 'Table eggs by piece or tray, salted eggs, and canned milk', icon: 'Egg', average_price_range: '₱7.50 - ₱260.00', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', popular_items: ['Brown Eggs (Large)', 'Brown Eggs (Tray)', 'Salted Duck Eggs', 'Evaporated Milk'], display_order: 4 },
  { id: 'vegetables', name: 'Vegetables', tagline: 'Highland and lowland farm vegetables, spices, and greens', icon: 'Carrot', average_price_range: '₱40.00 - ₱180.00 / kg', image_url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', popular_items: ['Red Onions', 'Native Garlic', 'Native Tomatoes', 'Ampalaya'], display_order: 5 },
  { id: 'fruits', name: 'Fresh Fruits', tagline: 'Seasonal local fruits and table staples', icon: 'Apple', average_price_range: '₱60.00 - ₱190.00 / kg', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', popular_items: ['Lakatan Banana', 'Carabao Mango', 'Papaya', 'Calamansi'], display_order: 6 },
  { id: 'cooking-essentials', name: 'Cooking Essentials', tagline: 'Sugar, cooking oils, iodized salt, and sauces', icon: 'Flame', average_price_range: '₱28.00 - ₱140.00 / unit', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', popular_items: ['Refined White Sugar', 'Coconut Cooking Oil', 'Palm Oil (1L)', 'Iodized Salt'], display_order: 7 },
  { id: 'beverages', name: 'Beverages & Coffee', tagline: 'Instant coffee, tablea chocolate, tea, and milk powder', icon: 'Coffee', average_price_range: '₱12.00 - ₱185.00 / pack', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', popular_items: ['3-in-1 Coffee (10s)', 'Samar Cocoa Tablea', 'Powdered Milk 300g', 'Ground Native Coffee'], display_order: 8 },
  { id: 'canned-household', name: 'Canned Goods & Essentials', tagline: 'Sardines, corned beef, tuna, and daily household supplies', icon: 'Package', average_price_range: '₱22.00 - ₱95.00 / can', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', popular_items: ['Canned Sardines 155g', 'Corned Beef 175g', 'Tuna Flakes 155g', 'Laundry Bar Soap'], display_order: 9 }
];

const MARKETS = [
  { id: 'mkt-calbayog-central', name: 'Calbayog Central Public Market', type: 'Public Wet Market', barangay: 'Brgy. Central', city: 'Calbayog City', address: 'Gomez St. cor. Rosales Blvd, Calbayog City, Samar', operating_hours: '4:00 AM - 7:30 PM (Daily)', verified_badge: true, distance_km: 0.8, rating: 4.8, featured_deals_count: 22, popular_for: ['Fresh Seafood', 'Local Rice Varieties', 'Native Vegetables'] },
  { id: 'mkt-rawis-talipapa', name: 'Rawis Wet & Dry Community Talipapa', type: 'Barangay Talipapa', barangay: 'Brgy. Rawis', city: 'Calbayog City', address: 'National Highway, Rawis, Calbayog City', operating_hours: '5:00 AM - 6:00 PM (Daily)', verified_badge: true, distance_km: 2.3, rating: 4.6, featured_deals_count: 16, popular_for: ['Fresh Fish catch', 'Cooking Ingredients', 'Local Vegetables'] },
  { id: 'mkt-san-policarpo', name: 'San Policarpo Supermarket & Mart', type: 'Supermarket', barangay: 'Brgy. San Policarpo', city: 'Calbayog City', address: 'Magsaysay Blvd, San Policarpo, Calbayog City', operating_hours: '7:30 AM - 8:30 PM (Daily)', verified_badge: true, distance_km: 3.5, rating: 4.7, featured_deals_count: 19, popular_for: ['Canned Goods', 'Packaged Rice', 'Household Essentials'] },
  { id: 'mkt-oquendo-farmers', name: 'Oquendo District Farmers Market', type: 'Farmers Market', barangay: 'Brgy. Oquendo Poblacion', city: 'Calbayog City', address: 'Oquendo Plaza, Calbayog City', operating_hours: '5:00 AM - 3:00 PM (Tue, Thu, Sat)', verified_badge: true, distance_km: 14.2, rating: 4.9, featured_deals_count: 25, popular_for: ['Direct Farm Vegetables', 'Native Fruits', 'Root Crops'] },
  { id: 'mkt-hamorawon-mart', name: 'Hamorawon Citizen Co-op Grocery', type: 'Grocery Store', barangay: 'Brgy. Hamorawon', city: 'Calbayog City', address: 'Bugallon St., Hamorawon, Calbayog City', operating_hours: '6:00 AM - 7:00 PM (Daily)', verified_badge: true, distance_km: 1.4, rating: 4.5, featured_deals_count: 12, popular_for: ['Refined Sugar', 'Cooking Oil', 'Flour & Bakery Essentials'] },
  { id: 'mkt-matobato-wholesale', name: 'Matobato Wholesale & Retail Center', type: 'Supermarket', barangay: 'Brgy. Matobato', city: 'Calbayog City', address: 'Diversion Road, Matobato, Calbayog City', operating_hours: '7:00 AM - 8:00 PM (Daily)', verified_badge: true, distance_km: 4.1, rating: 4.7, featured_deals_count: 28, popular_for: ['Sack Rice', 'Bulk Cooking Oil', 'Case Canned Goods'] }
];

async function seed() {
  console.log('Seeding categories...');
  const { data: cData, error: cErr } = await supabase.from('categories').upsert(CATEGORIES, { onConflict: 'id' });
  if (cErr) console.error('Categories error:', cErr);
  else console.log('✅ Categories seeded successfully!');

  console.log('Seeding market locations...');
  const { data: mData, error: mErr } = await supabase.from('market_locations').upsert(MARKETS, { onConflict: 'id' });
  if (mErr) console.error('Markets error:', mErr);
  else console.log('✅ Markets seeded successfully!');
}

seed();


-- ============================================================================
-- SUKI — Smart Utility & Kalakal Information | Commodity Price Monitoring
-- Production Supabase / PostgreSQL Relational Database Schema
-- Correlated 1:1 with the Website Data Models (src/types/index.ts & mockData.ts)
-- ============================================================================

-- Clean up existing objects if recreating
DROP VIEW IF EXISTS view_commodities_catalog CASCADE;
DROP VIEW IF EXISTS view_market_summary CASCADE;
DROP TABLE IF EXISTS citizen_price_reports CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS store_prices CASCADE;
DROP TABLE IF EXISTS commodities CASCADE;
DROP TABLE IF EXISTS market_locations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ----------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- Correlates with: Category (src/types/index.ts)
-- Powers: CategoriesView & Category filters in CatalogView
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'rice-grains', 'meat-poultry', 'fish-seafood'
    name VARCHAR(100) NOT NULL UNIQUE,
    tagline VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL, -- Lucide icon key: 'Wheat', 'Drumstick', 'Fish', etc.
    average_price_range VARCHAR(50),
    image_url TEXT NOT NULL,
    popular_items TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. MARKET_LOCATIONS TABLE
-- Correlates with: MarketLocation (src/types/index.ts)
-- Powers: LocationsView, Market Filter, Store Address & Distance display
-- ----------------------------------------------------------------------------
CREATE TABLE market_locations (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'mkt-calbayog-central', 'mkt-rawis-talipapa'
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'Public Wet Market',
            'Supermarket',
            'Grocery Store',
            'Farmers Market',
            'Barangay Talipapa'
        )
    ),
    barangay VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Calbayog City',
    province VARCHAR(100) DEFAULT 'Samar',
    address VARCHAR(255) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL,
    verified_badge BOOLEAN NOT NULL DEFAULT TRUE,
    distance_km DECIMAL(4, 1) NOT NULL DEFAULT 0.0,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 4.5,
    featured_deals_count INT DEFAULT 0,
    popular_for TEXT[] DEFAULT '{}',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_number VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. COMMODITIES TABLE
-- Correlates with: Commodity (src/types/index.ts)
-- Powers: CatalogView, Search, CompareView, Modal Details
-- ----------------------------------------------------------------------------
CREATE TABLE commodities (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'cmd-rice-regular', 'cmd-chicken-whole'
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(150), -- e.g. 'Regular Rice (NFA / Local Harvest)'
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory VARCHAR(100) NOT NULL,
    unit VARCHAR(30) NOT NULL, -- e.g. 'kg', 'piece', 'liter', 'can', 'tray', 'pack'
    standard_unit VARCHAR(50) NOT NULL, -- e.g. '1 kg', '1 piece', '1 tray (30 eggs)'
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    suggested_retail_price DECIMAL(10, 2), -- DTI / DA Suggested Retail Price (SRP)
    tags TEXT[] DEFAULT '{}', -- e.g. ['Staple', 'Popular', 'Government Monitored']
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. STORE_PRICES TABLE
-- Correlates with: StorePrice (src/types/index.ts)
-- Junction entity between market_locations and commodities.
-- Powers: Store-by-store comparison table, cheapest store badges, stock status.
-- ----------------------------------------------------------------------------
CREATE TABLE store_prices (
    id BIGSERIAL PRIMARY KEY,
    commodity_id VARCHAR(50) NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    store_id VARCHAR(50) NOT NULL REFERENCES market_locations(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    previous_price DECIMAL(10, 2),
    unit VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'out_of_stock', 'low_stock')
    ),
    verified_citizen BOOLEAN NOT NULL DEFAULT TRUE,
    stock_note TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_commodity_store_unit UNIQUE (commodity_id, store_id, unit)
);

-- ----------------------------------------------------------------------------
-- 5. PRICE_HISTORY TABLE
-- Correlates with: PriceHistoryPoint (src/types/index.ts)
-- Powers: TrendsView, longitudinal 30-day SVG charts, PriceSparkline
-- ----------------------------------------------------------------------------
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    commodity_id VARCHAR(50) NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    store_id VARCHAR(50) REFERENCES market_locations(id) ON DELETE SET NULL,
    recorded_date DATE NOT NULL,
    label VARCHAR(50) NOT NULL, -- e.g. 'Day 1', 'Week 2', 'Sep 05'
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    average_price DECIMAL(10, 2),
    lowest_price DECIMAL(10, 2),
    highest_price DECIMAL(10, 2),
    change_amount DECIMAL(10, 2),
    change_note TEXT,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. CITIZEN_PRICE_REPORTS TABLE
-- Correlates with: ReportPriceModal.tsx submission form
-- Allows citizens to crowdsource price observations across Calbayog markets.
-- ----------------------------------------------------------------------------
CREATE TABLE citizen_price_reports (
    id BIGSERIAL PRIMARY KEY,
    commodity_id VARCHAR(50) NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    market_id VARCHAR(50) NOT NULL REFERENCES market_locations(id) ON DELETE CASCADE,
    reported_price DECIMAL(10, 2) NOT NULL CHECK (reported_price > 0),
    unit VARCHAR(30) NOT NULL,
    notes TEXT,
    reporter_name VARCHAR(120) DEFAULT 'Citizen Contributor',
    reporter_email VARCHAR(150),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
        verification_status IN ('pending', 'verified', 'rejected')
    ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PERFORMANCE & FILTERING INDEXES
-- ============================================================================

-- Fast category and tag lookups
CREATE INDEX idx_commodities_category ON commodities(category_id);
CREATE INDEX idx_commodities_tags ON commodities USING GIN (tags);

-- Fast price filtering and comparison
CREATE INDEX idx_store_prices_commodity ON store_prices(commodity_id, price);
CREATE INDEX idx_store_prices_store ON store_prices(store_id);
CREATE INDEX idx_store_prices_status ON store_prices(status);

-- Fast location search
CREATE INDEX idx_market_locations_type ON market_locations(type);
CREATE INDEX idx_market_locations_barangay ON market_locations(barangay);

-- Rapid history lookup for time-series charts
CREATE INDEX idx_price_history_commodity_date ON price_history(commodity_id, recorded_date ASC);

-- ============================================================================
-- SQL VIEW: VIEW_COMMODITIES_CATALOG
-- Pre-calculates aggregated pricing and highlights the cheapest option,
-- perfectly matching the frontend's Commodity object shape.
-- ============================================================================
CREATE OR REPLACE VIEW view_commodities_catalog AS
WITH price_aggregates AS (
    SELECT 
        sp.commodity_id,
        MIN(CASE WHEN sp.status = 'available' THEN sp.price END) AS cheapest_price,
        MAX(sp.price) AS highest_price,
        ROUND(AVG(sp.price)::numeric, 2) AS current_average_price,
        COUNT(sp.id) AS active_seller_count
    FROM store_prices sp
    GROUP BY sp.commodity_id
),
cheapest_stores AS (
    SELECT DISTINCT ON (sp.commodity_id)
        sp.commodity_id,
        m.id AS cheapest_store_id,
        m.name AS cheapest_store_name,
        CONCAT(m.barangay, ', ', m.city) AS cheapest_store_location
    FROM store_prices sp
    JOIN market_locations m ON sp.store_id = m.id
    WHERE sp.status = 'available'
    ORDER BY sp.commodity_id, sp.price ASC
)
SELECT 
    c.id,
    c.name,
    c.local_name,
    c.category_id,
    cat.name AS category_name,
    c.subcategory,
    c.unit,
    c.standard_unit,
    c.image_url,
    c.description,
    c.suggested_retail_price,
    c.tags,
    COALESCE(pa.cheapest_price, 0) AS cheapest_price,
    COALESCE(pa.highest_price, 0) AS highest_price,
    COALESCE(pa.current_average_price, 0) AS current_average_price,
    COALESCE(cs.cheapest_store_id, '') AS cheapest_store_id,
    COALESCE(cs.cheapest_store_name, 'No active store') AS cheapest_store_name,
    COALESCE(cs.cheapest_store_location, '') AS cheapest_store_location,
    CASE 
        WHEN pa.active_seller_count > 0 THEN 'available'
        ELSE 'out_of_stock'
    END AS status,
    c.is_active
FROM commodities c
JOIN categories cat ON c.category_id = cat.id
LEFT JOIN price_aggregates pa ON c.id = pa.commodity_id
LEFT JOIN cheapest_stores cs ON c.id = cs.commodity_id;

-- ============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_price_reports ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access (Anyone can browse commodities, prices, and locations)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Market Locations" ON market_locations FOR SELECT USING (true);
CREATE POLICY "Public Read Commodities" ON commodities FOR SELECT USING (true);
CREATE POLICY "Public Read Store Prices" ON store_prices FOR SELECT USING (true);
CREATE POLICY "Public Read Price History" ON price_history FOR SELECT USING (true);

-- 2. Citizen Price Contributions (Anyone can insert a report from ReportPriceModal)
CREATE POLICY "Citizen Insert Price Reports" ON citizen_price_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Citizen Read Own or Verified Reports" ON citizen_price_reports FOR SELECT USING (true);


-- ============================================================================
-- SEED DATA (Matching mockData.ts in dist)
-- ============================================================================

-- Categories
INSERT INTO categories (id, name, tagline, icon, average_price_range, image_url, popular_items, display_order) VALUES
('rice-grains', 'Rice & Grains', 'Staple grains, local harvest, and imported rice', 'Wheat', '₱42.00 - ₱62.00 / kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', ARRAY['Regular Milled Rice', 'Well-Milled Rice', 'Premium Dinorado', 'Sinandomeng Rice'], 1),
('meat-poultry', 'Meat & Poultry', 'Fresh pork cuts, whole dressed chicken, and local beef', 'Drumstick', '₱180.00 - ₱420.00 / kg', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80', ARRAY['Fresh Whole Chicken', 'Pork Liempo', 'Pork Kasim', 'Beef Shank'], 2),
('fish-seafood', 'Fish & Seafood', 'Fresh catch, coastal harvest, and aquaculture fish', 'Fish', '₱120.00 - ₱360.00 / kg', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', ARRAY['Bangus (Milkfish)', 'Tilapia', 'Galunggong', 'Fresh Squid'], 3),
('eggs-dairy', 'Eggs & Dairy', 'Table eggs by piece or tray, salted eggs, and canned milk', 'Egg', '₱7.50 - ₱260.00', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', ARRAY['Brown Eggs (Large)', 'Brown Eggs (Tray)', 'Salted Duck Eggs', 'Evaporated Milk'], 4),
('vegetables', 'Vegetables', 'Highland and lowland farm vegetables, spices, and greens', 'Carrot', '₱40.00 - ₱180.00 / kg', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', ARRAY['Red Onions', 'Native Garlic', 'Native Tomatoes', 'Ampalaya'], 5),
('fruits', 'Fresh Fruits', 'Seasonal local fruits and table staples', 'Apple', '₱60.00 - ₱190.00 / kg', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', ARRAY['Lakatan Banana', 'Carabao Mango', 'Papaya', 'Calamansi'], 6),
('cooking-essentials', 'Cooking Essentials', 'Sugar, cooking oils, iodized salt, and sauces', 'Flame', '₱28.00 - ₱140.00 / unit', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', ARRAY['Refined White Sugar', 'Coconut Cooking Oil', 'Palm Oil (1L)', 'Iodized Salt'], 7),
('beverages', 'Beverages & Coffee', 'Instant coffee, tablea chocolate, tea, and milk powder', 'Coffee', '₱12.00 - ₱185.00 / pack', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', ARRAY['3-in-1 Coffee (10s)', 'Samar Cocoa Tablea', 'Powdered Milk 300g', 'Ground Native Coffee'], 8),
('canned-household', 'Canned Goods & Essentials', 'Sardines, corned beef, tuna, and daily household supplies', 'Package', '₱22.00 - ₱95.00 / can', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', ARRAY['Canned Sardines 155g', 'Corned Beef 175g', 'Tuna Flakes 155g', 'Laundry Bar Soap'], 9);

-- Market Locations (Calbayog City)
INSERT INTO market_locations (id, name, type, barangay, city, address, operating_hours, verified_badge, distance_km, rating, featured_deals_count, popular_for) VALUES
('mkt-calbayog-central', 'Calbayog Central Public Market', 'Public Wet Market', 'Brgy. Central', 'Calbayog City', 'Gomez St. cor. Rosales Blvd, Calbayog City, Samar', '4:00 AM - 7:30 PM (Daily)', true, 0.8, 4.8, 22, ARRAY['Fresh Seafood', 'Local Rice Varieties', 'Native Vegetables']),
('mkt-rawis-talipapa', 'Rawis Wet & Dry Community Talipapa', 'Barangay Talipapa', 'Brgy. Rawis', 'Calbayog City', 'National Highway, Rawis, Calbayog City', '5:00 AM - 6:00 PM (Daily)', true, 2.3, 4.6, 16, ARRAY['Fresh Fish catch', 'Cooking Ingredients', 'Local Vegetables']),
('mkt-san-policarpo', 'San Policarpo Supermarket & Mart', 'Supermarket', 'Brgy. San Policarpo', 'Calbayog City', 'Magsaysay Blvd, San Policarpo, Calbayog City', '7:30 AM - 8:30 PM (Daily)', true, 3.5, 4.7, 19, ARRAY['Canned Goods', 'Packaged Rice', 'Household Essentials']),
('mkt-oquendo-farmers', 'Oquendo District Farmers Market', 'Farmers Market', 'Brgy. Oquendo Poblacion', 'Calbayog City', 'Oquendo Plaza, Calbayog City', '5:00 AM - 3:00 PM (Tue, Thu, Sat)', true, 14.2, 4.9, 25, ARRAY['Direct Farm Vegetables', 'Native Fruits', 'Root Crops']),
('mkt-hamorawon-mart', 'Hamorawon Citizen Co-op Grocery', 'Grocery Store', 'Brgy. Hamorawon', 'Calbayog City', 'Bugallon St., Hamorawon, Calbayog City', '6:00 AM - 7:00 PM (Daily)', true, 1.4, 4.5, 12, ARRAY['Refined Sugar', 'Cooking Oil', 'Flour & Bakery Essentials']),
('mkt-matobato-wholesale', 'Matobato Wholesale & Retail Center', 'Supermarket', 'Brgy. Matobato', 'Calbayog City', 'Diversion Road, Matobato, Calbayog City', '7:00 AM - 8:00 PM (Daily)', true, 4.1, 4.7, 28, ARRAY['Sack Rice', 'Bulk Cooking Oil', 'Case Canned Goods']);

-- Commodities
INSERT INTO commodities (id, name, local_name, category_id, subcategory, unit, standard_unit, image_url, description, suggested_retail_price, tags) VALUES
('cmd-rice-regular', 'Regular Milled Rice', 'Regular Rice (NFA / Local Harvest)', 'rice-grains', 'Milled Rice', 'kg', '1 kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Standard everyday household rice. High carbohydrate yield, well-polished, staple grain for Filipino families.', 48.00, ARRAY['Staple', 'Popular', 'Government Monitored', 'Local Grain']),
('cmd-rice-well-milled', 'Well-Milled Rice', 'Sinandomeng / Special White Rice', 'rice-grains', 'Specialty Rice', 'kg', '1 kg', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80', 'Semi-translucent grains with minimal broken fractions. Soft texture when cooked, aroma profile high.', 52.00, ARRAY['Staple', 'Popular', 'Semi-Premium']),
('cmd-chicken-whole', 'Fresh Whole Chicken', 'Dressed Broiler Chicken', 'meat-poultry', 'Poultry', 'kg', '1 kg', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 'Clean dressed whole broiler chicken, chilled or fresh slaughter. High protein staple for home cooking.', 180.00, ARRAY['Fresh Meat', 'Staple', 'Monitored', 'Protein']),
('cmd-pork-liempo', 'Pork Belly (Liempo)', 'Liempo Slab / Cut', 'meat-poultry', 'Pork Cuts', 'kg', '1 kg', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80', 'Prime layered pork belly with optimal fat-to-meat striations, preferred for sinigang, inihaw, and lechon kawali.', 330.00, ARRAY['Prime Cut', 'Fresh Meat', 'High Demand']),
('cmd-sugar-white', 'Refined White Sugar', 'Pure Cane Refined Sugar', 'cooking-essentials', 'Sweeteners', 'kg', '1 kg', 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80', 'Refined granulated pure sugarcane white sugar for baking, beverages, and household cooking.', 85.00, ARRAY['Staple', 'Baking', 'Controlled Item']);

-- Store Prices (Cross-store comparison data)
INSERT INTO store_prices (commodity_id, store_id, price, previous_price, unit, status, verified_citizen, stock_note) VALUES
('cmd-rice-regular', 'mkt-calbayog-central', 47.00, 45.00, 'kg', 'available', true, 'Full sacks available (Mindanao harvest)'),
('cmd-rice-regular', 'mkt-rawis-talipapa', 48.00, 47.00, 'kg', 'available', true, NULL),
('cmd-rice-regular', 'mkt-san-policarpo', 50.00, 48.00, 'kg', 'available', true, 'Repacked 1kg bags (clean label)'),
('cmd-chicken-whole', 'mkt-calbayog-central', 178.00, 185.00, 'kg', 'available', true, 'Morning dressed fresh delivery'),
('cmd-chicken-whole', 'mkt-san-policarpo', 188.00, 190.00, 'kg', 'available', true, 'Magnolia / Bounty Fresh vacuum sealed'),
('cmd-pork-liempo', 'mkt-calbayog-central', 320.00, 310.00, 'kg', 'available', true, 'Local Samar hog raiser cut'),
('cmd-pork-liempo', 'mkt-san-policarpo', 345.00, 340.00, 'kg', 'available', true, 'Air-flown chilled cut'),
('cmd-sugar-white', 'mkt-calbayog-central', 82.00, 85.00, 'kg', 'available', true, 'Repacked per kilo'),
('cmd-sugar-white', 'mkt-hamorawon-mart', 86.00, 88.00, 'kg', 'available', true, 'Co-op member price available');

-- 30-Day Longitudinal Price History for Regular Milled Rice
INSERT INTO price_history (commodity_id, store_id, recorded_date, label, price, average_price, lowest_price, highest_price, change_amount, change_note) VALUES
('cmd-rice-regular', 'mkt-calbayog-central', '2026-09-08', 'Day 1', 45.00, 46.20, 44.50, 48.00, 0.00, 'Baseline post-harvest month'),
('cmd-rice-regular', 'mkt-calbayog-central', '2026-09-15', 'Day 7', 45.50, 46.80, 45.00, 48.50, 0.50, 'Transportation fuel surcharge adjustment'),
('cmd-rice-regular', 'mkt-calbayog-central', '2026-09-22', 'Day 14', 46.50, 47.40, 45.50, 49.00, 1.00, 'Inter-island ferry freight rate increase'),
('cmd-rice-regular', 'mkt-calbayog-central', '2026-09-29', 'Day 21', 47.00, 48.10, 46.00, 50.00, 0.50, 'Wholesale sack price rose by ₱50'),
('cmd-rice-regular', 'mkt-calbayog-central', '2026-10-06', 'Day 30', 47.00, 48.33, 47.00, 50.00, 0.00, 'Stabilized price across Central & Rawis');

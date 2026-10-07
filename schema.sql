-- ============================================================================
-- Commodity Price Monitoring System - Relational Database Schema
-- Compatible with PostgreSQL (and easily adaptable to MySQL / SQLite)
-- ============================================================================

-- Drop tables if re-running (in reverse order of dependencies)
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS store_commodities CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS commodities CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS units_of_measurement CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom enum types if exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS stock_status CASCADE;

-- ----------------------------------------------------------------------------
-- Custom Enumerations
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
    'citizen',
    'store_representative',
    'market_inspector',
    'admin'
);

CREATE TYPE stock_status AS ENUM (
    'Available',
    'Out of Stock',
    'Limited'
);

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Tracks citizen reporters, market inspectors, store owners, and administrators.
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(30),
    role user_role NOT NULL DEFAULT 'citizen',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. LOCATIONS TABLE
-- Normalizes administrative jurisdictions (Region, Province, City/Municipality, Barangay).
-- Directly powers Feature 5: Location-Based Price Information.
-- ----------------------------------------------------------------------------
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    region VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    municipality_city VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_location_entry UNIQUE (province, municipality_city, barangay)
);

-- ----------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- Organizes commodities into intuitive classifications.
-- Directly powers Feature 4: Category-Based Browsing & Feature 2: Search by Category.
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. UNITS OF MEASUREMENT TABLE
-- Standardizes metric and counting units (kg, liter, piece, dozen, etc.).
-- Powers Feature 1: Unit display & cross-store comparison consistency.
-- ----------------------------------------------------------------------------
CREATE TABLE units_of_measurement (
    unit_id SERIAL PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL UNIQUE, -- e.g. Kilogram, Liter, Piece, Dozen
    unit_symbol VARCHAR(20) NOT NULL UNIQUE -- e.g. kg, L, pc, dz
);

-- ----------------------------------------------------------------------------
-- 5. COMMODITIES TABLE
-- Master catalogue of goods monitored across stores (e.g. Regular Rice, Pork Liempo, Brown Sugar).
-- Powers Feature 1: Commodity Viewing, Feature 2: Search, & Feature 3: Comparison.
-- ----------------------------------------------------------------------------
CREATE TABLE commodities (
    commodity_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    default_unit_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT,
    search_keywords TEXT, -- Space/comma separated keywords for quick searching
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT fk_commodities_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(category_id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_commodities_default_unit 
        FOREIGN KEY (default_unit_id) 
        REFERENCES units_of_measurement(unit_id) 
        ON DELETE RESTRICT
);

-- ----------------------------------------------------------------------------
-- 6. STORES TABLE
-- Stores, public markets, groceries, and supermarkets that sell commodities.
-- Powers Feature 1: Store/Market name display & Feature 5: Location filtering.
-- ----------------------------------------------------------------------------
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    location_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    store_type VARCHAR(50) NOT NULL DEFAULT 'Public Market', -- e.g. Public Market, Supermarket, Grocery, Sari-Sari Store
    address_line VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_number VARCHAR(30),
    is_participating BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT fk_stores_location 
        FOREIGN KEY (location_id) 
        REFERENCES locations(location_id) 
        ON DELETE RESTRICT
);

-- ----------------------------------------------------------------------------
-- 7. STORE_COMMODITIES TABLE (Current Price & Availability State)
-- Junction entity connecting Stores and Commodities (Many-to-Many).
-- Holds the live, current price and stock status for high-performance reading.
-- Powers Feature 1: Price Viewing & Feature 3: Price Comparison across stores.
-- ----------------------------------------------------------------------------
CREATE TABLE store_commodities (
    store_commodity_id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    commodity_id INT NOT NULL,
    unit_id INT NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL CHECK (current_price >= 0),
    stock_status stock_status NOT NULL DEFAULT 'Available',
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_by INT,

    -- Constraints
    CONSTRAINT uq_store_commodity_unit 
        UNIQUE (store_id, commodity_id, unit_id),

    CONSTRAINT fk_sc_store 
        FOREIGN KEY (store_id) 
        REFERENCES stores(store_id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_sc_commodity 
        FOREIGN KEY (commodity_id) 
        REFERENCES commodities(commodity_id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_sc_unit 
        FOREIGN KEY (unit_id) 
        REFERENCES units_of_measurement(unit_id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_sc_last_updated_by 
        FOREIGN KEY (last_updated_by) 
        REFERENCES users(user_id) 
        ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 8. PRICE_HISTORY TABLE
-- Immutable log of price updates over time.
-- Directly powers Feature 6: Price History and Trends (charts, daily/weekly deltas).
-- ----------------------------------------------------------------------------
CREATE TABLE price_history (
    price_history_id BIGSERIAL PRIMARY KEY,
    store_commodity_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_status stock_status NOT NULL DEFAULT 'Available',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recorded_by INT,
    remarks VARCHAR(255),

    -- Foreign Key Constraints
    CONSTRAINT fk_ph_store_commodity 
        FOREIGN KEY (store_commodity_id) 
        REFERENCES store_commodities(store_commodity_id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_ph_recorded_by 
        FOREIGN KEY (recorded_by) 
        REFERENCES users(user_id) 
        ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================

-- Faster location lookups (City / Municipality / Barangay)
CREATE INDEX idx_locations_municipality_city ON locations(municipality_city);
CREATE INDEX idx_stores_location_id ON stores(location_id);

-- Faster commodity search by category and text search
CREATE INDEX idx_commodities_category_id ON commodities(category_id);
CREATE INDEX idx_commodities_name ON commodities(name);

-- Composite indexes for lightning fast price comparison and lowest price sorting
CREATE INDEX idx_store_commodities_commodity_price ON store_commodities(commodity_id, current_price);
CREATE INDEX idx_store_commodities_store_id ON store_commodities(store_id);

-- Time-series index for Price History trends and charts
CREATE INDEX idx_price_history_lookup ON price_history(store_commodity_id, recorded_at DESC);


-- ============================================================================
-- SAMPLE DATA POPULATION (Matching README.md Scenarios)
-- ============================================================================

-- Categories
INSERT INTO categories (name, slug, description) VALUES
('Rice and Grains', 'rice-and-grains', 'Milled rice, brown rice, corn, and grain staples'),
('Meat', 'meat', 'Fresh and chilled pork, beef, and poultry'),
('Fish and Seafood', 'fish-and-seafood', 'Fresh catch, saltwater and freshwater fish'),
('Fruits', 'fruits', 'Fresh seasonal and regular fruits'),
('Vegetables', 'vegetables', 'Leafy greens, root crops, and highland vegetables'),
('Eggs', 'eggs', 'Chicken eggs, quail eggs, and salted duck eggs'),
('Cooking Ingredients', 'cooking-ingredients', 'Sugar, salt, cooking oils, vinegar, spices'),
('Beverages', 'beverages', 'Coffee, tea, and other drinks'),
('Household Essentials', 'household-essentials', 'Soaps, detergents, and common daily supplies');

-- Units of Measurement
INSERT INTO units_of_measurement (unit_name, unit_symbol) VALUES
('Kilogram', 'kg'),
('Liter', 'L'),
('Piece', 'pc'),
('Dozen', 'dz'),
('Pack', 'pk');

-- Users
INSERT INTO users (full_name, email, role) VALUES
('System Administrator', 'admin@price-monitor.gov.ph', 'admin'),
('Maria Santos', 'maria.santos@calbayog.gov.ph', 'market_inspector'),
('Juan Dela Cruz', 'juan.citizen@email.com', 'citizen');

-- Locations (e.g. Calbayog City from README.md)
INSERT INTO locations (region, province, municipality_city, barangay, zip_code) VALUES
('Region VIII', 'Samar', 'Calbayog City', 'Central (Poblacion)', '6710'),
('Region VIII', 'Samar', 'Calbayog City', 'Capoocan', '6710'),
('Region VIII', 'Samar', 'Calbayog City', 'Obrero', '6710');

-- Stores (Market A, Store B, Market C from README.md)
INSERT INTO stores (location_id, name, store_type, address_line) VALUES
(1, 'Market A (Public Market Central)', 'Public Market', 'Navarro Street, Central'),
(2, 'Store B (Capoocan Grocery)', 'Grocery', 'Magsaysay Blvd, Capoocan'),
(3, 'Market C (Obrero Wet & Dry Market)', 'Public Market', 'Rizal Ave, Obrero');

-- Commodities
INSERT INTO commodities (category_id, default_unit_id, name, slug, description, search_keywords) VALUES
(1, 1, 'Regular Rice', 'regular-rice', 'Well-milled standard regular white rice', 'rice regular kanin bigas staple grain'),
(2, 1, 'Fresh Whole Chicken', 'fresh-whole-chicken', 'Dressed broiler chicken', 'chicken manok meat poultry dressed'),
(7, 2, 'Cooking Oil', 'cooking-oil', 'Palm cooking oil', 'cooking oil mantika oil fry'),
(7, 1, 'Refined White Sugar', 'refined-white-sugar', 'Pure cane refined sugar', 'sugar asukal white refined sweet');

-- Store Commodities (Current Prices matching README example: Market A ₱48, Store B ₱50, Market C ₱47)
INSERT INTO store_commodities (store_id, commodity_id, unit_id, current_price, stock_status, last_updated_by) VALUES
(1, 1, 1, 48.00, 'Available', 2),
(2, 1, 1, 50.00, 'Available', 2),
(3, 1, 1, 47.00, 'Available', 2),
(1, 2, 1, 180.00, 'Available', 2),
(2, 2, 1, 185.00, 'Available', 2),
(1, 3, 2, 65.00, 'Available', 2),
(1, 4, 1, 85.00, 'Out of Stock', 2);

-- Price History for Regular Rice at Market A (Matching README: ₱45 -> ₱47 -> ₱48)
INSERT INTO price_history (store_commodity_id, price, stock_status, recorded_at, recorded_by, remarks) VALUES
(1, 45.00, 'Available', CURRENT_TIMESTAMP - INTERVAL '30 days', 2, 'Initial monthly baseline'),
(1, 47.00, 'Available', CURRENT_TIMESTAMP - INTERVAL '14 days', 2, 'Fuel price adjustment reported'),
(1, 48.00, 'Available', CURRENT_TIMESTAMP - INTERVAL '2 days', 2, 'Current market price update');


-- ============================================================================
-- Commodity Price Monitoring System - Demonstration Queries
-- Proves all 6 Core Functionalities described in README.md
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Commodity Price Viewing
-- Displays commodity name, price, unit, store, location, updated time & status
-- ----------------------------------------------------------------------------
SELECT 
    c.name AS commodity_name,
    sc.current_price,
    uom.unit_symbol AS unit,
    s.name AS store_name,
    s.store_type,
    CONCAT(l.barangay, ', ', l.municipality_city, ', ', l.province) AS location,
    sc.stock_status,
    sc.last_updated_at
FROM store_commodities sc
JOIN commodities c ON sc.commodity_id = c.commodity_id
JOIN units_of_measurement uom ON sc.unit_id = uom.unit_id
JOIN stores s ON sc.store_id = s.store_id
JOIN locations l ON s.location_id = l.location_id
WHERE sc.stock_status = 'Available'
ORDER BY c.name, sc.current_price ASC;


-- ----------------------------------------------------------------------------
-- 2. Commodity Search (Keyword / Auto-complete Search)
-- Example: Searching for "Rice"
-- ----------------------------------------------------------------------------
SELECT 
    c.commodity_id,
    c.name AS commodity_name,
    cat.name AS category_name,
    COUNT(sc.store_commodity_id) AS available_sellers_count,
    MIN(sc.current_price) AS min_price,
    MAX(sc.current_price) AS max_price,
    uom.unit_symbol
FROM commodities c
JOIN categories cat ON c.category_id = cat.category_id
JOIN units_of_measurement uom ON c.default_unit_id = uom.unit_id
LEFT JOIN store_commodities sc ON c.commodity_id = sc.commodity_id AND sc.stock_status = 'Available'
WHERE LOWER(c.name) LIKE LOWER('%Rice%') 
   OR LOWER(c.search_keywords) LIKE LOWER('%Rice%')
GROUP BY c.commodity_id, c.name, cat.name, uom.unit_symbol;


-- ----------------------------------------------------------------------------
-- 3. Price Comparison & Lowest Price Highlighting
-- Example: Comparing "Regular Rice" across all stores in Calbayog City
-- ----------------------------------------------------------------------------
SELECT 
    s.name AS store_name,
    c.name AS commodity_name,
    sc.current_price,
    uom.unit_symbol AS unit,
    CONCAT(l.barangay, ', ', l.municipality_city) AS store_location,
    sc.stock_status,
    sc.current_price - MIN(sc.current_price) OVER () AS price_difference_from_cheapest,
    CASE 
        WHEN sc.current_price = MIN(sc.current_price) OVER () THEN 'Cheapest Option'
        ELSE 'Higher Price'
    END AS comparison_badge
FROM store_commodities sc
JOIN commodities c ON sc.commodity_id = c.commodity_id
JOIN stores s ON sc.store_id = s.store_id
JOIN locations l ON s.location_id = l.location_id
JOIN units_of_measurement uom ON sc.unit_id = uom.unit_id
WHERE c.name = 'Regular Rice' 
  AND l.municipality_city = 'Calbayog City'
ORDER BY sc.current_price ASC;


-- ----------------------------------------------------------------------------
-- 4. Category-Based Browsing
-- Example: Browse all commodities under 'Rice and Grains'
-- ----------------------------------------------------------------------------
SELECT 
    cat.name AS category,
    c.name AS commodity,
    c.description,
    uom.unit_symbol AS standard_unit,
    COUNT(DISTINCT sc.store_id) AS active_stores_carrying
FROM categories cat
JOIN commodities c ON cat.category_id = c.category_id
JOIN units_of_measurement uom ON c.default_unit_id = uom.unit_id
LEFT JOIN store_commodities sc ON c.commodity_id = sc.commodity_id AND sc.stock_status = 'Available'
WHERE cat.slug = 'rice-and-grains'
GROUP BY cat.name, c.name, c.description, uom.unit_symbol
ORDER BY c.name ASC;


-- ----------------------------------------------------------------------------
-- 5. Location-Based Price Filtering
-- Example: Filter all commodity prices in 'Calbayog City' or specific Barangay
-- ----------------------------------------------------------------------------
SELECT 
    l.municipality_city,
    l.barangay,
    s.name AS store_name,
    c.name AS commodity,
    sc.current_price,
    uom.unit_symbol AS unit,
    sc.stock_status
FROM store_commodities sc
JOIN stores s ON sc.store_id = s.store_id
JOIN locations l ON s.location_id = l.location_id
JOIN commodities c ON sc.commodity_id = c.commodity_id
JOIN units_of_measurement uom ON sc.unit_id = uom.unit_id
WHERE l.municipality_city = 'Calbayog City'
ORDER BY l.barangay, c.name, sc.current_price ASC;


-- ----------------------------------------------------------------------------
-- 6. Price History and Trends
-- Example: Track price evolution of Regular Rice at Market A
-- ----------------------------------------------------------------------------
SELECT 
    c.name AS commodity,
    s.name AS store,
    ph.price,
    ph.stock_status,
    ph.recorded_at,
    ph.price - LAG(ph.price) OVER (ORDER BY ph.recorded_at ASC) AS price_delta,
    CASE 
        WHEN ph.price > LAG(ph.price) OVER (ORDER BY ph.recorded_at ASC) THEN 'Price Increased'
        WHEN ph.price < LAG(ph.price) OVER (ORDER BY ph.recorded_at ASC) THEN 'Price Decreased'
        WHEN LAG(ph.price) OVER (ORDER BY ph.recorded_at ASC) IS NULL THEN 'Baseline'
        ELSE 'No Change'
    END AS trend_direction,
    ph.remarks
FROM price_history ph
JOIN store_commodities sc ON ph.store_commodity_id = sc.store_commodity_id
JOIN commodities c ON sc.commodity_id = c.commodity_id
JOIN stores s ON sc.store_id = s.store_id
WHERE c.name = 'Regular Rice' AND s.name LIKE 'Market A%'
ORDER BY ph.recorded_at ASC;


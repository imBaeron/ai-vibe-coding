-- ============================================================================
-- SUKI — Smart Utility & Kalakal Information | Database Queries
-- Correlated 1:1 with Frontend Views (Catalog, Compare, Locations, Trends, Basket)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CATALOG VIEW: Full Commodities List with Aggregated Pricing
-- Powers: CatalogView.tsx (Cards & Table modes)
-- ----------------------------------------------------------------------------
SELECT 
    c.id,
    c.name,
    c.local_name,
    cat.name AS category_name,
    c.subcategory,
    c.standard_unit,
    c.image_url,
    pa.cheapest_price,
    pa.highest_price,
    pa.current_average_price,
    cs.cheapest_store_name,
    cs.cheapest_store_location,
    c.tags
FROM commodities c
JOIN categories cat ON c.category_id = cat.id
LEFT JOIN (
    SELECT 
        commodity_id,
        MIN(CASE WHEN status = 'available' THEN price END) AS cheapest_price,
        MAX(price) AS highest_price,
        ROUND(AVG(price)::numeric, 2) AS current_average_price
    FROM store_prices
    GROUP BY commodity_id
) pa ON c.id = pa.commodity_id
LEFT JOIN (
    SELECT DISTINCT ON (sp.commodity_id)
        sp.commodity_id,
        m.name AS cheapest_store_name,
        CONCAT(m.barangay, ', ', m.city) AS cheapest_store_location
    FROM store_prices sp
    JOIN market_locations m ON sp.store_id = m.id
    WHERE sp.status = 'available'
    ORDER BY sp.commodity_id, sp.price ASC
) cs ON c.id = cs.commodity_id
WHERE c.is_active = TRUE
ORDER BY pa.cheapest_price ASC;


-- ----------------------------------------------------------------------------
-- 2. COMPARE VIEW: Multi-Store Price Comparison for a Specific Commodity
-- Powers: CompareView.tsx & CommodityDetailModal.tsx
-- Example: Comparing "Regular Milled Rice" across all Calbayog City markets
-- ----------------------------------------------------------------------------
SELECT 
    m.id AS store_id,
    m.name AS store_name,
    m.type AS store_type,
    m.barangay,
    m.city,
    m.distance_km,
    sp.price,
    sp.previous_price,
    sp.unit,
    sp.status,
    sp.verified_citizen,
    sp.stock_note,
    sp.updated_at,
    -- Calculate savings relative to the lowest available price
    sp.price - MIN(sp.price) OVER() AS difference_from_cheapest,
    CASE 
        WHEN sp.price = MIN(sp.price) OVER() THEN 'Cheapest Option'
        ELSE 'Higher Price'
    END AS comparison_label
FROM store_prices sp
JOIN market_locations m ON sp.store_id = m.id
WHERE sp.commodity_id = 'cmd-rice-regular'
ORDER BY sp.price ASC;


-- ----------------------------------------------------------------------------
-- 3. LOCATIONS VIEW: Markets Directory with Tracked Commodity Counts
-- Powers: LocationsView.tsx (Directory & Store Explorer)
-- ----------------------------------------------------------------------------
SELECT 
    m.id,
    m.name,
    m.type,
    m.barangay,
    m.city,
    m.address,
    m.operating_hours,
    m.distance_km,
    m.rating,
    m.verified_badge,
    m.popular_for,
    COUNT(sp.id) AS total_commodities_tracked,
    COUNT(CASE WHEN sp.status = 'available' THEN 1 END) AS active_in_stock_items
FROM market_locations m
LEFT JOIN store_prices sp ON m.id = sp.store_id
GROUP BY m.id
ORDER BY m.distance_km ASC;


-- ----------------------------------------------------------------------------
-- 4. TRENDS VIEW: 30-Day Longitudinal Price Tracking
-- Powers: TrendsView.tsx & PriceSparkline.tsx
-- Example: Historical trajectory of Regular Milled Rice
-- ----------------------------------------------------------------------------
SELECT 
    ph.recorded_date,
    ph.label,
    ph.price,
    ph.average_price,
    ph.lowest_price,
    ph.highest_price,
    ph.change_amount,
    ph.change_note,
    -- Compute running percentage delta from initial baseline
    ROUND(
        ((ph.price - FIRST_VALUE(ph.price) OVER (ORDER BY ph.recorded_date ASC)) 
        / FIRST_VALUE(ph.price) OVER (ORDER BY ph.recorded_date ASC) * 100)::numeric, 
        1
    ) AS cumulative_percent_change
FROM price_history ph
WHERE ph.commodity_id = 'cmd-rice-regular'
ORDER BY ph.recorded_date ASC;


-- ----------------------------------------------------------------------------
-- 5. BASKET CALCULATOR VIEW: Multi-Item Shopping Basket Cost across Stores
-- Powers: BasketCalculatorView.tsx (Finds the best market for an entire grocery list)
-- Example: Basket with 5kg Regular Rice + 2kg Whole Chicken + 1kg White Sugar
-- ----------------------------------------------------------------------------
WITH user_basket AS (
    SELECT 'cmd-rice-regular' AS commodity_id, 5.0 AS quantity
    UNION ALL
    SELECT 'cmd-chicken-whole' AS commodity_id, 2.0 AS quantity
    UNION ALL
    SELECT 'cmd-sugar-white' AS commodity_id, 1.0 AS quantity
)
SELECT 
    m.id AS store_id,
    m.name AS store_name,
    m.type AS store_type,
    m.barangay,
    m.distance_km,
    SUM(sp.price * b.quantity) AS total_basket_cost,
    COUNT(sp.id) AS items_available_count,
    (SELECT COUNT(*) FROM user_basket) AS total_basket_items
FROM user_basket b
JOIN store_prices sp ON b.commodity_id = sp.commodity_id AND sp.status = 'available'
JOIN market_locations m ON sp.store_id = m.id
GROUP BY m.id, m.name, m.type, m.barangay, m.distance_km
HAVING COUNT(sp.id) = (SELECT COUNT(*) FROM user_basket) -- Store must have all items in stock
ORDER BY total_basket_cost ASC;


-- ----------------------------------------------------------------------------
-- 6. CITIZEN PRICE REPORTING: Insert new crowdsourced price observation
-- Powers: ReportPriceModal.tsx
-- ----------------------------------------------------------------------------
INSERT INTO citizen_price_reports (
    commodity_id,
    market_id,
    reported_price,
    unit,
    notes,
    reporter_name,
    reporter_email
) VALUES (
    'cmd-rice-regular',
    'mkt-calbayog-central',
    47.50,
    'kg',
    'Stall #18, fresh delivery from Mindanao',
    'Juan Dela Cruz',
    'juan.delacruz@gmail.com'
)
RETURNING *;

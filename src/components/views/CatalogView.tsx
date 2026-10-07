import React, { useState, useMemo } from 'react';
import { Commodity } from '../../types';
import { COMMODITIES, CATEGORIES } from '../../data/mockData';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { PriceSparkline } from '../common/PriceSparkline';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  LayoutGrid, 
  List, 
  ShoppingBag, 
  ArrowLeftRight, 
  SlidersHorizontal,
  Store
} from 'lucide-react';

interface CatalogViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLocation: string;
  onSelectCommodity: (c: Commodity) => void;
  onCompareCommodity: (c: Commodity) => void;
  onAddToBasket: (c: Commodity) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onSelectCommodity,
  onCompareCommodity,
  onAddToBasket,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('cheapest');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Filtered and sorted commodities
  const filteredCommodities = useMemo(() => {
    return COMMODITIES.filter((item) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.localName && item.localName.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query) ||
        item.subcategory.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.storePrices.some(
          (sp) =>
            sp.storeName.toLowerCase().includes(query) ||
            sp.barangay.toLowerCase().includes(query)
        );

      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Status match
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;

      // Location match
      const matchesLocation =
        selectedLocation === 'All Locations' ||
        item.storePrices.some(
          (sp) =>
            sp.barangay.includes(selectedLocation) ||
            sp.storeName.includes(selectedLocation)
        );

      // Quick filter
      let matchesQuick = true;
      if (quickFilter === 'price-drops') {
        matchesQuick = item.trend === 'falling';
      } else if (quickFilter === 'staples') {
        matchesQuick = item.tags.includes('Staple') || item.category === 'rice-grains';
      } else if (quickFilter === 'under-50') {
        matchesQuick = item.cheapestPrice <= 50;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesQuick;
    }).sort((a, b) => {
      if (sortBy === 'cheapest') return a.cheapestPrice - b.cheapestPrice;
      if (sortBy === 'expensive') return b.cheapestPrice - a.cheapestPrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'trend-drop') return a.trendPercentage - b.trendPercentage;
      return 0;
    });
  }, [searchQuery, selectedCategory, statusFilter, selectedLocation, sortBy, quickFilter]);

  return (
    <div className="space-y-6">
      
      {/* Category Pills Scroller */}
      <div className="bg-canvas-light p-4 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-shade-50 font-semibold">
            Browse by Category
          </span>
          <span className="text-xs text-shade-50 font-mono">
            {CATEGORIES.length} Categories
          </span>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-canvas-cream text-ink border border-hairline-light hover:bg-shade-30/50'
            }`}
          >
            All Commodities ({COMMODITIES.length})
          </button>
          
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-canvas-cream text-ink border border-hairline-light hover:bg-shade-30/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Search input, quick filter pills, sorting, view toggle */}
      <div className="bg-canvas-light p-4 sm:p-5 rounded-xl border border-hairline-light shadow-level-3 space-y-4">
        
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-shade-40" />
            <input
              type="text"
              placeholder="Search commodity name, brand, stall, or keyword (e.g. Sinandomeng, Liempo, Galunggong)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-canvas-cream text-ink placeholder:text-shade-40 rounded-pill border border-hairline-light focus:outline-none focus:border-ink transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-shade-40 hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & View Switches */}
          <div className="flex items-center gap-2 flex-wrap">
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-canvas-cream rounded-pill border border-hairline-light text-xs text-ink">
              <ArrowUpDown className="w-3.5 h-3.5 text-shade-50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-ink focus:outline-none cursor-pointer pr-1"
              >
                <option value="cheapest">Lowest Price First</option>
                <option value="expensive">Highest Price First</option>
                <option value="name">Name (A-Z)</option>
                <option value="trend-drop">Biggest Price Drops</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-canvas-cream rounded-pill border border-hairline-light text-xs text-ink">
              <Filter className="w-3.5 h-3.5 text-shade-50" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-ink focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available in Stock</option>
                <option value="low_stock">Low Stock</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-canvas-cream rounded-pill border border-hairline-light p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-pill transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-on-primary' : 'text-shade-50 hover:text-ink'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-pill transition-colors ${
                  viewMode === 'table' ? 'bg-primary text-on-primary' : 'text-shade-50 hover:text-ink'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-hairline-light text-xs">
          <span className="text-shade-50 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Quick Filters:
          </span>
          <button
            onClick={() => setQuickFilter(quickFilter === 'price-drops' ? null : 'price-drops')}
            className={`px-3 py-1 rounded-pill transition-colors ${
              quickFilter === 'price-drops'
                ? 'bg-aloe-10 text-ink font-semibold'
                : 'bg-canvas-cream text-shade-60 hover:bg-shade-30/40 border border-hairline-light'
            }`}
          >
            📉 Price Drops & Deals
          </button>
          <button
            onClick={() => setQuickFilter(quickFilter === 'staples' ? null : 'staples')}
            className={`px-3 py-1 rounded-pill transition-colors ${
              quickFilter === 'staples'
                ? 'bg-aloe-10 text-ink font-semibold'
                : 'bg-canvas-cream text-shade-60 hover:bg-shade-30/40 border border-hairline-light'
            }`}
          >
            🌾 Daily Household Staples
          </button>
          <button
            onClick={() => setQuickFilter(quickFilter === 'under-50' ? null : 'under-50')}
            className={`px-3 py-1 rounded-pill transition-colors ${
              quickFilter === 'under-50'
                ? 'bg-aloe-10 text-ink font-semibold'
                : 'bg-canvas-cream text-shade-60 hover:bg-shade-30/40 border border-hairline-light'
            }`}
          >
            💰 Under ₱50 Items
          </button>

          {quickFilter && (
            <button
              onClick={() => setQuickFilter(null)}
              className="text-xs text-shade-50 hover:text-ink underline ml-1"
            >
              Clear filter
            </button>
          )}

          <div className="ml-auto text-xs text-shade-50 font-mono">
            Showing {filteredCommodities.length} of {COMMODITIES.length} items
          </div>
        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommodities.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCommodity(item)}
              className="bg-canvas-light rounded-xl border border-hairline-light p-5 card-stacked-shadow card-stacked-shadow-hover cursor-pointer flex flex-col justify-between transition-all group"
            >
              <div>
                
                {/* Image + Header Tags */}
                <div className="relative mb-4 overflow-hidden rounded-lg bg-canvas-cream h-44 border border-hairline-light">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <PillTag variant="shade" size="xs">
                      {item.subcategory}
                    </PillTag>
                    {item.trend === 'falling' && (
                      <PillTag variant="mint" size="xs">
                        Price Drop
                      </PillTag>
                    )}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {item.status === 'available' ? (
                      <PillTag variant="status-available" size="xs">
                        Available
                      </PillTag>
                    ) : (
                      <PillTag variant="status-low" size="xs">
                        Low Stock
                      </PillTag>
                    )}
                  </div>
                </div>

                {/* Commodity Title & Subtitle */}
                <div className="mb-2">
                  <h3 className="font-semibold text-lg text-ink group-hover:text-shade-70 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  {item.localName && (
                    <p className="text-xs text-shade-50 mt-0.5 line-clamp-1">{item.localName}</p>
                  )}
                </div>

                {/* Main Price Display */}
                <div className="my-3 py-2.5 px-3 bg-canvas-cream rounded-lg border border-hairline-light flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-shade-50 font-medium">
                      Lowest Rate
                    </div>
                    <div className="text-2xl font-light text-ink font-mono">
                      ₱{item.cheapestPrice.toFixed(2)}
                      <span className="text-xs text-shade-50 font-normal"> / {item.unit}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[11px] text-shade-50">Market Avg</div>
                    <div className="text-sm font-medium text-shade-60 font-mono">
                      ₱{item.currentAveragePrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Cheapest Store Location */}
                <div className="space-y-1.5 text-xs text-shade-60 mb-3">
                  <div className="flex items-center gap-1.5 text-ink font-medium">
                    <Store className="w-3.5 h-3.5 text-shade-50 flex-shrink-0" />
                    <span className="truncate">{item.cheapestStoreName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-shade-50">
                    <MapPin className="w-3.5 h-3.5 text-shade-40 flex-shrink-0" />
                    <span className="truncate">{item.cheapestStoreLocation}</span>
                  </div>
                </div>

                {/* Trend sparkline & update timestamp */}
                <div className="flex items-center justify-between pt-2.5 border-t border-hairline-light text-xs text-shade-50">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-shade-40" />
                    <span>{item.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.trend === 'rising' && (
                      <span className="text-rose-600 font-mono text-[11px] flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> +{item.trendPercentage}%
                      </span>
                    )}
                    {item.trend === 'falling' && (
                      <span className="text-emerald-700 font-mono text-[11px] flex items-center">
                        <TrendingDown className="w-3 h-3 mr-0.5" /> {item.trendPercentage}%
                      </span>
                    )}
                    {item.trend === 'stable' && (
                      <span className="text-shade-50 font-mono text-[11px] flex items-center">
                        <Minus className="w-3 h-3 mr-0.5" /> Stable
                      </span>
                    )}
                    <PriceSparkline data={item.priceHistory} width={60} height={20} />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div 
                className="mt-4 pt-3 border-t border-hairline-light flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <PillButton
                  variant="outline-light"
                  size="sm"
                  onClick={() => onCompareCommodity(item)}
                  icon={<ArrowLeftRight className="w-3 h-3" />}
                  className="flex-1 text-xs"
                >
                  Compare
                </PillButton>
                <PillButton
                  variant="aloe"
                  size="sm"
                  onClick={() => onAddToBasket(item)}
                  icon={<ShoppingBag className="w-3 h-3" />}
                  className="flex-1 text-xs"
                >
                  + Basket
                </PillButton>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-canvas-light rounded-xl border border-hairline-light shadow-level-3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-canvas-cream border-b border-hairline-light text-xs uppercase tracking-wider text-shade-50 font-medium">
                  <th className="py-3.5 px-4">Commodity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Lowest Price</th>
                  <th className="py-3.5 px-4">Cheapest Seller / Market</th>
                  <th className="py-3.5 px-4">Avg Price</th>
                  <th className="py-3.5 px-4">30-Day Trend</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-light">
                {filteredCommodities.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectCommodity(item)}
                    className="hover:bg-canvas-cream/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-md object-cover border border-hairline-light"
                        />
                        <div>
                          <div className="font-semibold text-ink">{item.name}</div>
                          {item.localName && (
                            <div className="text-xs text-shade-50">{item.localName}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <PillTag variant="shade" size="xs">
                        {item.subcategory}
                      </PillTag>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-ink">
                        ₱{item.cheapestPrice.toFixed(2)}
                        <span className="text-xs text-shade-50 font-normal"> / {item.unit}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-ink">{item.cheapestStoreName}</div>
                      <div className="text-xs text-shade-50">{item.cheapestStoreLocation}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-shade-60">
                      ₱{item.currentAveragePrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.trend === 'rising' && (
                          <span className="text-rose-600 font-mono text-xs flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5" /> +{item.trendPercentage}%
                          </span>
                        )}
                        {item.trend === 'falling' && (
                          <span className="text-emerald-700 font-mono text-xs flex items-center">
                            <TrendingDown className="w-3 h-3 mr-0.5" /> {item.trendPercentage}%
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="text-shade-50 font-mono text-xs">Stable</span>
                        )}
                        <PriceSparkline data={item.priceHistory} width={50} height={18} />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs text-shade-50 whitespace-nowrap">
                      {item.lastUpdated}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <PillButton
                          variant="outline-light"
                          size="sm"
                          onClick={() => onCompareCommodity(item)}
                          className="text-xs py-1 px-2.5"
                        >
                          Compare
                        </PillButton>
                        <PillButton
                          variant="aloe"
                          size="sm"
                          onClick={() => onAddToBasket(item)}
                          className="text-xs py-1 px-2.5"
                        >
                          + Basket
                        </PillButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCommodities.length === 0 && (
        <div className="bg-canvas-light rounded-xl border border-hairline-light p-12 text-center shadow-level-3 space-y-3">
          <div className="w-12 h-12 rounded-pill bg-canvas-cream text-shade-50 flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <h3 className="text-lg font-medium text-ink">No commodities found</h3>
          <p className="text-sm text-shade-50 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or selecting a different location.
          </p>
          <PillButton
            variant="outline-light"
            size="sm"
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('all');
              setStatusFilter('all');
              setQuickFilter(null);
            }}
          >
            Reset All Filters
          </PillButton>
        </div>
      )}

    </div>
  );
};

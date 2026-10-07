import React, { useState } from 'react';
import { Commodity } from '../../types';
import { MARKETS, COMMODITIES } from '../../data/mockData';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Search,
  ChevronRight
} from 'lucide-react';

interface LocationsViewProps {
  onSelectCommodity: (c: Commodity) => void;
  onCompareCommodity: (c: Commodity) => void;
  onAddToBasket: (c: Commodity) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  onSelectCommodity,
  onCompareCommodity,
  onAddToBasket,
}) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>(MARKETS[0].id);
  const [filterType, setFilterType] = useState<string>('all');
  const [marketSearch, setMarketSearch] = useState<string>('');

  const activeMarket =
    MARKETS.find((m) => m.id === selectedMarketId) || MARKETS[0];

  const filteredMarkets = MARKETS.filter((m) => {
    const matchesSearch =
      !marketSearch ||
      m.name.toLowerCase().includes(marketSearch.toLowerCase()) ||
      m.barangay.toLowerCase().includes(marketSearch.toLowerCase()) ||
      m.city.toLowerCase().includes(marketSearch.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get all commodities sold at active market
  const marketCommodities = COMMODITIES.filter((c) =>
    c.storePrices.some((sp) => sp.storeId === selectedMarketId)
  ).map((c) => {
    const storePrice = c.storePrices.find((sp) => sp.storeId === selectedMarketId)!;
    return {
      commodity: c,
      storePrice,
    };
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-canvas-light p-6 sm:p-8 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex items-center gap-2 mb-2">
          <PillTag variant="mint" size="xs">
            Location-Based Price System
          </PillTag>
          <span className="text-xs text-shade-50 font-mono">
            Calbayog City & Samar Municipalities
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-ink tracking-tight font-display-thin">
          Local Markets, Talipapa & Store Directory
        </h2>
        <p className="text-sm sm:text-base text-shade-60 mt-1 max-w-2xl font-light">
          Compare prices by geographic location. Find out what items cost at your nearest neighborhood wet market or supermarket.
        </p>
      </div>

      {/* Market Selector Grid & Interactive Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Market List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Market Search & Filter */}
          <div className="bg-canvas-light p-4 rounded-xl border border-hairline-light shadow-level-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-shade-40" />
              <input
                type="text"
                placeholder="Search market name or barangay..."
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs bg-canvas-cream text-ink rounded-pill border border-hairline-light focus:outline-none focus:border-ink"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                  filterType === 'all'
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-canvas-cream text-shade-60 border border-hairline-light'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setFilterType('Public Wet Market')}
                className={`px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                  filterType === 'Public Wet Market'
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-canvas-cream text-shade-60 border border-hairline-light'
                }`}
              >
                Wet Markets
              </button>
              <button
                onClick={() => setFilterType('Supermarket')}
                className={`px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                  filterType === 'Supermarket'
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-canvas-cream text-shade-60 border border-hairline-light'
                }`}
              >
                Supermarkets
              </button>
              <button
                onClick={() => setFilterType('Farmers Market')}
                className={`px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                  filterType === 'Farmers Market'
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-canvas-cream text-shade-60 border border-hairline-light'
                }`}
              >
                Farmers Market
              </button>
            </div>
          </div>

          {/* List of Markets */}
          <div className="space-y-3">
            {filteredMarkets.map((m) => {
              const isSelected = m.id === selectedMarketId;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarketId(m.id)}
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-level-3'
                      : 'bg-canvas-light text-ink border-hairline-light hover:border-shade-40 shadow-level-3'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-pill font-semibold ${
                        isSelected ? 'bg-canvas-night-elevated text-aloe-10' : 'bg-shade-30 text-ink'
                      }`}>
                        {m.type}
                      </span>
                      {m.verifiedBadge && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${
                          isSelected ? 'text-aloe-10' : 'text-emerald-700 font-medium'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" /> Verified Hub
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-base leading-snug">
                      {m.name}
                    </h4>

                    <div className={`flex items-center gap-1 text-xs mt-1 ${
                      isSelected ? 'text-link-cool-2' : 'text-shade-50'
                    }`}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{m.barangay}, {m.city}</span>
                    </div>

                    <div className={`flex items-center gap-3 text-xs mt-2.5 font-mono ${
                      isSelected ? 'text-link-cool-1' : 'text-shade-60'
                    }`}>
                      <span>📍 {m.distanceKm} km away</span>
                      <span>•</span>
                      <span>{m.totalCommoditiesTracked} Commodities</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 flex-shrink-0 mt-1 ${
                    isSelected ? 'text-aloe-10' : 'text-shade-40'
                  }`} />
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Selected Market Detail & Price List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Market Profile Card */}
          <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-hairline-light">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PillTag variant="mint" size="xs">
                    {activeMarket.type}
                  </PillTag>
                  <span className="text-xs text-shade-50 font-mono">
                    ID: {activeMarket.id}
                  </span>
                </div>
                <h3 className="text-2xl font-light text-ink tracking-tight font-display-thin">
                  {activeMarket.name}
                </h3>
              </div>

              <PillButton
                variant="outline-light"
                size="sm"
                icon={<Navigation className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Directions ({activeMarket.distanceKm} km)
              </PillButton>
            </div>

            {/* Address & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-shade-60">
              <div className="flex items-start gap-2 bg-canvas-cream p-3 rounded-lg border border-hairline-light">
                <MapPin className="w-4 h-4 text-shade-40 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-ink block">Physical Address:</strong>
                  <span>{activeMarket.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-canvas-cream p-3 rounded-lg border border-hairline-light">
                <Clock className="w-4 h-4 text-shade-40 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-ink block">Market Schedule:</strong>
                  <span>{activeMarket.operatingHours}</span>
                </div>
              </div>
            </div>

            {/* Specialties & Deals */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-shade-50 font-medium">Market Specialties:</span>
              {activeMarket.popularFor.map((item) => (
                <PillTag key={item} variant="shade" size="xs">
                  ★ {item}
                </PillTag>
              ))}
            </div>

          </div>

          {/* Commodity Price List at this specific location */}
          <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-semibold text-ink">
                  Current Commodity Prices at {activeMarket.name}
                </h4>
                <p className="text-xs text-shade-50">
                  Showing recorded rates for items available at this seller
                </p>
              </div>
              <span className="text-xs font-mono text-shade-50">
                {marketCommodities.length} Items Listed
              </span>
            </div>

            <div className="divide-y divide-hairline-light">
              {marketCommodities.map(({ commodity, storePrice }) => {
                const isLowestOverall = storePrice.price === commodity.cheapestPrice;

                return (
                  <div
                    key={commodity.id}
                    onClick={() => onSelectCommodity(commodity)}
                    className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-canvas-cream/50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={commodity.image}
                        alt={commodity.name}
                        className="w-12 h-12 rounded-lg object-cover border border-hairline-light flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-ink">{commodity.name}</span>
                          {isLowestOverall && (
                            <PillTag variant="mint" size="xs">
                              Cheapest in Calbayog
                            </PillTag>
                          )}
                        </div>
                        <div className="text-xs text-shade-50 mt-0.5">
                          {commodity.subcategory} • Standard: {commodity.standardUnit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
                      <div className="text-right">
                        <div className="text-xl font-medium text-ink font-mono">
                          ₱{storePrice.price.toFixed(2)}
                          <span className="text-xs text-shade-50 font-normal"> / {storePrice.unit}</span>
                        </div>
                        <div className="text-[11px] text-shade-50">
                          Updated {storePrice.updatedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <PillButton
                          variant="outline-light"
                          size="sm"
                          onClick={() => onCompareCommodity(commodity)}
                          className="text-xs py-1 px-2.5"
                        >
                          Compare
                        </PillButton>
                        <PillButton
                          variant="aloe"
                          size="sm"
                          onClick={() => onAddToBasket(commodity)}
                          className="text-xs py-1 px-2.5"
                        >
                          + Basket
                        </PillButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Commodity } from '../../types';
import { COMMODITIES } from '../../data/mockData';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  Trophy, 
  Clock, 
  ShoppingBag,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface CompareViewProps {
  initialCommodity?: Commodity | null;
  onSelectCommodityForModal: (c: Commodity) => void;
  onAddToBasket: (c: Commodity) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  initialCommodity,
  onSelectCommodityForModal,
  onAddToBasket,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialCommodity?.id || COMMODITIES[0].id
  );
  const [sortOrder, setSortOrder] = useState<'lowest' | 'distance'>('lowest');

  const currentCommodity =
    COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];

  const sortedStorePrices = [...currentCommodity.storePrices].sort((a, b) => {
    if (sortOrder === 'lowest') return a.price - b.price;
    if (sortOrder === 'distance') return a.distanceKm - b.distanceKm;
    return 0;
  });

  const cheapestStore = sortedStorePrices[0];
  const mostExpensiveStore = sortedStorePrices[sortedStorePrices.length - 1];
  const maxSavings = mostExpensiveStore.price - cheapestStore.price;

  return (
    <div className="space-y-6">
      
      {/* Header & Commodity Selector Bar */}
      <div className="bg-canvas-light p-5 sm:p-6 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PillTag variant="mint" size="xs">
                Price Comparison Engine
              </PillTag>
              <span className="text-xs text-shade-50 font-mono">
                {currentCommodity.storePrices.length} Participating Sellers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-ink tracking-tight font-display-thin">
              Compare Commodity Prices Across Markets
            </h2>
            <p className="text-sm text-shade-60 mt-1">
              Find the cheapest store, compare location distance, and calculate exact price differences.
            </p>
          </div>

          {/* Commodity Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-shade-50 font-semibold whitespace-nowrap">
              Select Item:
            </span>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="appearance-none bg-canvas-cream text-ink text-sm font-medium pl-4 pr-10 py-2.5 rounded-pill border border-hairline-light focus:outline-none focus:border-ink cursor-pointer shadow-sm"
              >
                {COMMODITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.standardUnit}) — from ₱{c.cheapestPrice.toFixed(2)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-shade-50 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Quick Horizontal Selector Pills for Staples */}
        <div className="mt-5 pt-4 border-t border-hairline-light flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-shade-50 flex-shrink-0 font-medium">
            Quick Staples:
          </span>
          {COMMODITIES.slice(0, 7).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition-all ${
                selectedId === c.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-canvas-cream text-shade-60 border border-hairline-light hover:bg-shade-30/50'
              }`}
            >
              {c.name} (₱{c.cheapestPrice.toFixed(2)})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Cheapest Spotlight Banner */}
      <div className="bg-aloe-10 rounded-xl border border-emerald-300 p-6 sm:p-8 relative overflow-hidden shadow-level-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-pill bg-ink text-aloe-10 flex items-center justify-center flex-shrink-0 shadow-md">
              <Trophy className="w-6 h-6 text-aloe-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-pill bg-ink text-on-primary text-xs uppercase tracking-widest font-semibold">
                  Cheapest Available Option
                </span>
                <span className="text-xs text-emerald-900 font-medium">
                  • Best Value Deal
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-medium text-ink mt-1.5 tracking-tight">
                {cheapestStore.storeName}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-950 mt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {cheapestStore.barangay}, {cheapestStore.city}
                </span>
                <span>•</span>
                <span>{cheapestStore.distanceKm} km from center</span>
                <span>•</span>
                <span>Updated {cheapestStore.updatedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-200">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-900 font-semibold">
                Price at Cheapest Store
              </div>
              <div className="text-3xl sm:text-4xl font-light text-ink font-mono">
                ₱{cheapestStore.price.toFixed(2)}
                <span className="text-sm text-shade-60 font-normal"> / {currentCommodity.unit}</span>
              </div>
              {maxSavings > 0 && (
                <div className="text-xs text-emerald-800 font-bold font-mono mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Save ₱{maxSavings.toFixed(2)} / {currentCommodity.unit} vs highest store
                </div>
              )}
            </div>

            <PillButton
              variant="primary"
              size="md"
              onClick={() => onAddToBasket(currentCommodity)}
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Add Deal to Basket
            </PillButton>
          </div>

        </div>
      </div>

      {/* Comparison Options & Filter Bar */}
      <div className="bg-canvas-light p-4 rounded-xl border border-hairline-light shadow-level-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-widest text-shade-50 font-semibold">
          Side-by-Side Store Pricing Matrix ({sortedStorePrices.length} Locations)
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-shade-50">Sort by:</span>
          <button
            onClick={() => setSortOrder('lowest')}
            className={`px-3 py-1.5 rounded-pill transition-colors ${
              sortOrder === 'lowest'
                ? 'bg-primary text-on-primary font-medium'
                : 'bg-canvas-cream text-shade-60 hover:bg-shade-30/40 border border-hairline-light'
            }`}
          >
            Lowest Price First
          </button>
          <button
            onClick={() => setSortOrder('distance')}
            className={`px-3 py-1.5 rounded-pill transition-colors ${
              sortOrder === 'distance'
                ? 'bg-primary text-on-primary font-medium'
                : 'bg-canvas-cream text-shade-60 hover:bg-shade-30/40 border border-hairline-light'
            }`}
          >
            Closest Distance First
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedStorePrices.map((sp, index) => {
          const isLowest = sp.price === cheapestStore.price;
          const diffFromLowest = sp.price - cheapestStore.price;

          return (
            <div
              key={sp.storeId}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                isLowest
                  ? 'bg-pistachio-10/30 border-emerald-300 shadow-level-3 ring-2 ring-emerald-500/20'
                  : 'bg-canvas-light border-hairline-light shadow-level-3'
              }`}
            >
              <div>
                
                {/* Store Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <PillTag variant={isLowest ? 'mint' : 'shade'} size="xs">
                        {sp.storeType}
                      </PillTag>
                      {sp.verifiedCitizen && (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-pill">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-base text-ink leading-snug">
                      {sp.storeName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-shade-50">
                      Rank #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Location & Distance */}
                <div className="space-y-1 text-xs text-shade-60 mb-4 pb-3 border-b border-hairline-light">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-shade-40" />
                    <span>{sp.barangay}, {sp.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-shade-50">
                    <Store className="w-3.5 h-3.5 text-shade-40" />
                    <span>{sp.distanceKm} km away from city hall</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-3 py-3 px-3.5 bg-canvas-cream rounded-lg border border-hairline-light">
                  <div className="text-xs uppercase tracking-wider text-shade-50 font-medium">
                    Store Price
                  </div>
                  <div className="text-3xl font-light text-ink font-mono mt-0.5">
                    ₱{sp.price.toFixed(2)}
                    <span className="text-xs text-shade-50 font-normal"> / {sp.unit}</span>
                  </div>

                  {/* Price Difference Indicator */}
                  <div className="mt-2 pt-2 border-t border-hairline-light text-xs flex items-center justify-between">
                    <span className="text-shade-50">Difference:</span>
                    {isLowest ? (
                      <span className="text-emerald-800 font-bold font-mono">
                        ★ Lowest Price
                      </span>
                    ) : (
                      <span className="text-rose-600 font-mono font-medium">
                        +₱{diffFromLowest.toFixed(2)} / {sp.unit} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock note or additional details */}
                {sp.stockNote && (
                  <p className="text-xs text-shade-60 italic bg-canvas-cream/50 p-2 rounded-md border border-hairline-light mb-3">
                    &quot;{sp.stockNote}&quot;
                  </p>
                )}

              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-hairline-light flex items-center justify-between text-xs text-shade-50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-shade-40" />
                  {sp.updatedAt}
                </span>
                <button
                  onClick={() => onSelectCommodityForModal(currentCommodity)}
                  className="text-xs text-ink font-medium hover:underline"
                >
                  View Details →
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Multi-Commodity Direct Comparison Matrix Table */}
      <div className="bg-canvas-light rounded-xl border border-hairline-light shadow-level-3 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-ink">
              Multi-Store Commodity Price Summary Matrix
            </h3>
            <p className="text-xs text-shade-50 mt-0.5">
              Side-by-side snapshot of common goods across Calbayog public markets and supermarkets.
            </p>
          </div>
          <PillTag variant="shade" size="xs">
            Live Comparison Matrix
          </PillTag>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-canvas-cream border-b border-hairline-light text-xs uppercase tracking-wider text-shade-50 font-medium">
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Calbayog Central</th>
                <th className="py-3 px-4">Rawis Talipapa</th>
                <th className="py-3 px-4">San Policarpo</th>
                <th className="py-3 px-4">Oquendo Farmers</th>
                <th className="py-3 px-4">Cheapest Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-light text-xs sm:text-sm">
              {COMMODITIES.map((c) => {
                const central = c.storePrices.find((sp) => sp.storeId === 'mkt-calbayog-central');
                const rawis = c.storePrices.find((sp) => sp.storeId === 'mkt-rawis-talipapa');
                const policarpo = c.storePrices.find((sp) => sp.storeId === 'mkt-san-policarpo');
                const oquendo = c.storePrices.find((sp) => sp.storeId === 'mkt-oquendo-farmers');

                return (
                  <tr key={c.id} className="hover:bg-canvas-cream/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-ink">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-shade-50 font-mono">
                      {c.unit}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {central ? `₱${central.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {rawis ? `₱${rawis.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {policarpo ? `₱${policarpo.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {oquendo ? `₱${oquendo.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-pill bg-aloe-10 text-emerald-950 font-bold font-mono text-xs">
                        ₱{c.cheapestPrice.toFixed(2)} ({c.cheapestStoreName.split(' ')[0]})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

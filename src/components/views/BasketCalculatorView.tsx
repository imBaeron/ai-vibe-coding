import React from 'react';
import { BasketItem, Commodity } from '../../types';
import { MARKETS, COMMODITIES } from '../../data/mockData';
import { PillTag } from '../common/PillTag';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Trophy, 
  Sparkles
} from 'lucide-react';

interface BasketCalculatorViewProps {
  basket: BasketItem[];
  onUpdateQuantity: (commodityId: string, quantity: number) => void;
  onRemoveItem: (commodityId: string) => void;
  onAddQuickItem: (commodity: Commodity) => void;
  onClearBasket: () => void;
}

export const BasketCalculatorView: React.FC<BasketCalculatorViewProps> = ({
  basket,
  onUpdateQuantity,
  onRemoveItem,
  onAddQuickItem,
  onClearBasket,
}) => {
  // Compute total basket cost for each market
  const marketComparisons = MARKETS.map((market) => {
    let totalCost = 0;
    let availableItemsCount = 0;
    const itemBreakdown: { commodityName: string; unitPrice: number; subtotal: number; quantity: number; available: boolean }[] = [];

    basket.forEach((bItem) => {
      const sp = bItem.commodity.storePrices.find((s) => s.storeId === market.id);
      if (sp) {
        const subtotal = sp.price * bItem.quantity;
        totalCost += subtotal;
        availableItemsCount += 1;
        itemBreakdown.push({
          commodityName: bItem.commodity.name,
          unitPrice: sp.price,
          subtotal,
          quantity: bItem.quantity,
          available: true,
        });
      } else {
        // Fallback to average price if store doesn't list item
        const subtotal = bItem.commodity.currentAveragePrice * bItem.quantity;
        totalCost += subtotal;
        itemBreakdown.push({
          commodityName: bItem.commodity.name,
          unitPrice: bItem.commodity.currentAveragePrice,
          subtotal,
          quantity: bItem.quantity,
          available: false,
        });
      }
    });

    return {
      market,
      totalCost,
      availableItemsCount,
      itemBreakdown,
    };
  }).sort((a, b) => a.totalCost - b.totalCost);

  const cheapestMarket = marketComparisons[0];
  const mostExpensiveMarket = marketComparisons[marketComparisons.length - 1];
  const totalBasketSavings = mostExpensiveMarket
    ? mostExpensiveMarket.totalCost - cheapestMarket.totalCost
    : 0;

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-canvas-light p-6 sm:p-8 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex items-center gap-2 mb-2">
          <PillTag variant="mint" size="xs">
            Basket Price Optimizer
          </PillTag>
          <span className="text-xs text-shade-50 font-mono">
            Multi-Item Total Cost Estimator
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-ink tracking-tight font-display-thin">
          Cheapest Market Shopping Basket Calculator
        </h2>
        <p className="text-sm sm:text-base text-shade-60 mt-1 max-w-2xl font-light">
          Add your family&apos;s weekly grocery list to see which Calbayog market gives you the lowest combined total receipt.
        </p>
      </div>

      {basket.length === 0 ? (
        /* Empty State */
        <div className="bg-canvas-light rounded-xl border border-hairline-light p-10 sm:p-14 text-center shadow-level-3 space-y-4">
          <div className="w-16 h-16 rounded-pill bg-aloe-10 text-ink flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-ink">Your shopping basket is empty</h3>
          <p className="text-sm text-shade-60 max-w-md mx-auto">
            Add staple commodities below to calculate total savings across Calbayog City markets.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="text-xs uppercase tracking-widest text-shade-50 font-semibold mb-3">
              Add Common Household Staples:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COMMODITIES.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onAddQuickItem(c)}
                  className="p-2.5 bg-canvas-cream hover:bg-aloe-10 text-ink rounded-lg border border-hairline-light text-xs font-medium flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{c.name}</span>
                  <Plus className="w-3.5 h-3.5 flex-shrink-0 ml-1 text-shade-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Basket Items Editor (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-canvas-light rounded-xl border border-hairline-light p-5 shadow-level-3">
              <div className="flex items-center justify-between pb-3 border-b border-hairline-light">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-ink" />
                  <h3 className="font-semibold text-base text-ink">
                    My Grocery Basket ({basket.length})
                  </h3>
                </div>
                <button
                  onClick={onClearBasket}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>

              {/* Basket Items List */}
              <div className="divide-y divide-hairline-light my-2">
                {basket.map((bItem) => (
                  <div key={bItem.commodity.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={bItem.commodity.image}
                        alt={bItem.commodity.name}
                        className="w-10 h-10 rounded-md object-cover border border-hairline-light"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                          {bItem.commodity.name}
                        </h4>
                        <div className="text-[11px] text-shade-50">
                          Unit: {bItem.commodity.unit}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-canvas-cream rounded-pill border border-hairline-light">
                        <button
                          onClick={() => onUpdateQuantity(bItem.commodity.id, bItem.quantity - 1)}
                          className="p-1 text-shade-60 hover:text-ink"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-semibold">
                          {bItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(bItem.commodity.id, bItem.quantity + 1)}
                          className="p-1 text-shade-60 hover:text-ink"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(bItem.commodity.id)}
                        className="text-shade-40 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add More Commodities */}
              <div className="pt-3 border-t border-hairline-light">
                <div className="text-[11px] uppercase tracking-wider text-shade-50 font-semibold mb-2">
                  + Add more items to basket:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMMODITIES.filter((c) => !basket.some((b) => b.commodity.id === c.id)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onAddQuickItem(c)}
                      className="px-2.5 py-1 bg-canvas-cream hover:bg-shade-30 text-ink rounded-pill text-[11px] border border-hairline-light transition-colors"
                    >
                      + {c.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Market Total Comparisons (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Best Deal Winner Banner */}
            {cheapestMarket && (
              <div className="bg-aloe-10 rounded-xl border border-emerald-300 p-6 shadow-level-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-pill bg-ink text-aloe-10 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Trophy className="w-5 h-5 text-aloe-10" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-pill bg-ink text-on-primary text-[11px] uppercase tracking-widest font-semibold">
                        Cheapest Store for Your Basket
                      </span>
                      <h3 className="text-2xl font-semibold text-ink mt-1">
                        {cheapestMarket.market.name}
                      </h3>
                      <p className="text-xs text-emerald-950 mt-0.5">
                        {cheapestMarket.market.barangay} • {cheapestMarket.market.distanceKm} km away
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-lg border border-emerald-200 text-right">
                    <div className="text-xs uppercase tracking-wider text-emerald-900 font-semibold">
                      Total Estimated Bill
                    </div>
                    <div className="text-3xl font-light text-ink font-mono">
                      ₱{cheapestMarket.totalCost.toFixed(2)}
                    </div>
                    {totalBasketSavings > 0 && (
                      <div className="text-xs text-emerald-800 font-bold font-mono mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Save ₱{totalBasketSavings.toFixed(2)} overall!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Cards for All Markets */}
            <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold text-ink">
                  Total Basket Bill Comparison Across All 6 Stores
                </h4>
                <span className="text-xs text-shade-50">Ranked by lowest total</span>
              </div>

              <div className="space-y-3">
                {marketComparisons.map((mComp, idx) => {
                  const isWinner = idx === 0;
                  const diffFromWinner = mComp.totalCost - cheapestMarket.totalCost;

                  return (
                    <div
                      key={mComp.market.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isWinner
                          ? 'bg-pistachio-10/40 border-emerald-300'
                          : 'bg-canvas-cream/50 border-hairline-light'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink">
                            #{idx + 1} {mComp.market.name}
                          </span>
                          {isWinner && (
                            <PillTag variant="mint" size="xs">
                              Lowest Total
                            </PillTag>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-shade-50 mt-1">
                          <span>{mComp.market.barangay}</span>
                          <span>•</span>
                          <span>{mComp.market.distanceKm} km away</span>
                          <span>•</span>
                          <span>{mComp.market.operatingHours}</span>
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                        <div className="text-xl font-medium text-ink font-mono">
                          ₱{mComp.totalCost.toFixed(2)}
                        </div>
                        <div className="text-xs">
                          {isWinner ? (
                            <span className="text-emerald-800 font-bold">★ Best Value</span>
                          ) : (
                            <span className="text-rose-600 font-mono font-medium">
                              +₱{diffFromWinner.toFixed(2)} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

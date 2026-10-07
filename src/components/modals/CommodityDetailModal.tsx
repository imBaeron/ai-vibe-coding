import React from 'react';
import { Commodity } from '../../types';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { PriceSparkline } from '../common/PriceSparkline';
import { 
  X, 
  MapPin, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  Store, 
  ArrowLeftRight, 
  ShoppingBag,
  BarChart3
} from 'lucide-react';

interface CommodityDetailModalProps {
  commodity: Commodity | null;
  onClose: () => void;
  onCompare: (commodity: Commodity) => void;
  onAddToBasket: (commodity: Commodity) => void;
  onViewTrends: (commodity: Commodity) => void;
}

export const CommodityDetailModal: React.FC<CommodityDetailModalProps> = ({
  commodity,
  onClose,
  onCompare,
  onAddToBasket,
  onViewTrends,
}) => {
  if (!commodity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-canvas-light text-ink w-full max-w-3xl rounded-xl border border-hairline-light shadow-level-4 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Image & Title */}
        <div className="relative bg-canvas-night text-on-primary p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-pill bg-canvas-night-elevated text-on-primary hover:bg-shade-70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <img
              src={commodity.image}
              alt={commodity.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-white/20 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <PillTag variant="mint" size="xs">
                  {commodity.subcategory}
                </PillTag>
                {commodity.tags.map((tag) => (
                  <span key={tag} className="text-[11px] text-link-cool-2 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-on-primary">
                {commodity.name}
              </h2>
              {commodity.localName && (
                <p className="text-sm text-link-cool-1 mt-0.5">{commodity.localName}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-link-cool-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-aloe-10" />
                  {commodity.lastUpdated}
                </span>
                <span>•</span>
                <span>Unit: <strong className="text-on-primary font-mono">{commodity.standardUnit}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Key Pricing Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Cheapest Price Card */}
            <div className="bg-pistachio-10/40 border border-emerald-200 rounded-lg p-4">
              <span className="text-xs uppercase tracking-wider text-emerald-900 font-semibold block mb-1">
                Lowest Available Price
              </span>
              <div className="text-3xl font-light text-ink">
                ₱{commodity.cheapestPrice.toFixed(2)}
                <span className="text-xs text-shade-60 font-normal"> / {commodity.unit}</span>
              </div>
              <div className="text-xs text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {commodity.cheapestStoreName}
              </div>
            </div>

            {/* Average Market Price Card */}
            <div className="bg-canvas-cream border border-hairline-light rounded-lg p-4">
              <span className="text-xs uppercase tracking-wider text-shade-50 font-medium block mb-1">
                Calbayog Market Average
              </span>
              <div className="text-3xl font-light text-ink">
                ₱{commodity.currentAveragePrice.toFixed(2)}
                <span className="text-xs text-shade-60 font-normal"> / {commodity.unit}</span>
              </div>
              <div className="text-xs text-shade-50 mt-1.5">
                Range: ₱{commodity.cheapestPrice.toFixed(2)} – ₱{commodity.highestPrice.toFixed(2)}
              </div>
            </div>

            {/* Price Trend Metric Card */}
            <div className="bg-canvas-cream border border-hairline-light rounded-lg p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-shade-50 font-medium block mb-1">
                  30-Day Trend
                </span>
                <div className="flex items-center gap-2">
                  {commodity.trend === 'rising' && (
                    <span className="inline-flex items-center text-rose-600 font-medium text-lg">
                      <TrendingUp className="w-5 h-5 mr-1" /> +{commodity.trendPercentage}%
                    </span>
                  )}
                  {commodity.trend === 'falling' && (
                    <span className="inline-flex items-center text-emerald-600 font-medium text-lg">
                      <TrendingDown className="w-5 h-5 mr-1" /> {commodity.trendPercentage}%
                    </span>
                  )}
                  {commodity.trend === 'stable' && (
                    <span className="inline-flex items-center text-shade-60 font-medium text-lg">
                      <Minus className="w-5 h-5 mr-1" /> Stable Rate
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <PriceSparkline data={commodity.priceHistory} width={140} height={28} />
              </div>
            </div>

          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-shade-50 font-semibold mb-2">
              Commodity Description
            </h4>
            <p className="text-sm text-shade-60 leading-relaxed">
              {commodity.description}
            </p>
          </div>

          {/* Store-by-Store Pricing Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-widest text-ink font-semibold">
                Prices Across Participating Markets & Stores ({commodity.storePrices.length})
              </h4>
              <span className="text-xs text-shade-50">Sorted by lowest price</span>
            </div>

            <div className="border border-hairline-light rounded-lg overflow-hidden divide-y divide-hairline-light">
              {commodity.storePrices
                .slice()
                .sort((a, b) => a.price - b.price)
                .map((sp, idx) => {
                  const isCheapest = idx === 0;
                  const diffFromAvg = sp.price - commodity.currentAveragePrice;
                  
                  return (
                    <div
                      key={sp.storeId}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCheapest ? 'bg-pistachio-10/20' : 'bg-canvas-light'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ink">{sp.storeName}</span>
                          {isCheapest && (
                            <PillTag variant="mint" size="xs">
                              Lowest Price
                            </PillTag>
                          )}
                          {sp.verifiedCitizen && (
                            <span className="inline-flex items-center text-[11px] text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-shade-50 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-shade-40" />
                            {sp.barangay}, {sp.city}
                          </span>
                          <span>•</span>
                          <span>{sp.distanceKm} km away</span>
                          <span>•</span>
                          <span>Updated {sp.updatedAt}</span>
                        </div>

                        {sp.stockNote && (
                          <div className="text-xs text-shade-60 mt-1 italic">
                            &quot;{sp.stockNote}&quot;
                          </div>
                        )}
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between">
                        <div className="text-xl font-medium text-ink font-mono">
                          ₱{sp.price.toFixed(2)}
                          <span className="text-xs text-shade-50 font-normal"> / {sp.unit}</span>
                        </div>
                        <div className="text-xs">
                          {diffFromAvg < 0 ? (
                            <span className="text-emerald-700 font-medium font-mono">
                              Save ₱{Math.abs(diffFromAvg).toFixed(2)} vs avg
                            </span>
                          ) : diffFromAvg > 0 ? (
                            <span className="text-rose-600 font-mono">
                              +₱{diffFromAvg.toFixed(2)} vs avg
                            </span>
                          ) : (
                            <span className="text-shade-50">Market average</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Historical Progression */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-widest text-ink font-semibold">
                Price History Sequence
              </h4>
              <button
                onClick={() => {
                  onViewTrends(commodity);
                  onClose();
                }}
                className="text-xs text-ink font-medium hover:underline flex items-center gap-1"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Full Interactive Chart →
              </button>
            </div>
            <div className="bg-canvas-cream border border-hairline-light rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {commodity.priceHistory.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center">
                      <span className="font-mono font-medium text-base text-ink">
                        ₱{step.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-shade-50">{step.label}</span>
                    </div>
                    {idx < commodity.priceHistory.length - 1 && (
                      <span className="text-shade-40 font-bold px-1">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-hairline-light text-xs text-shade-60">
                Summary: Recorded price shifted from ₱{commodity.priceHistory[0]?.price.toFixed(2)} to ₱{commodity.priceHistory[commodity.priceHistory.length - 1]?.price.toFixed(2)} ({commodity.trend === 'rising' ? 'increased' : commodity.trend === 'falling' ? 'decreased' : 'maintained'} over the recorded 30 days).
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-canvas-cream border-t border-hairline-light p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-shade-50">
            Citizen-monitored price records are updated daily.
          </div>
          <div className="flex items-center gap-3">
            <PillButton
              variant="outline-light"
              size="sm"
              onClick={() => {
                onCompare(commodity);
                onClose();
              }}
              icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
            >
              Compare Sellers
            </PillButton>
            <PillButton
              variant="primary"
              size="sm"
              onClick={() => {
                onAddToBasket(commodity);
                onClose();
              }}
              icon={<ShoppingBag className="w-3.5 h-3.5" />}
            >
              Add to Basket
            </PillButton>
          </div>
        </div>

      </div>
    </div>
  );
};

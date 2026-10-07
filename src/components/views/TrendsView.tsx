import React, { useState } from 'react';
import { Commodity } from '../../types';
import { COMMODITIES } from '../../data/mockData';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowRight, 
  ChevronDown, 
  ArrowLeftRight,
  Eye
} from 'lucide-react';

interface TrendsViewProps {
  initialCommodity?: Commodity | null;
  onSelectCommodityForModal: (c: Commodity) => void;
  onCompareCommodity: (c: Commodity) => void;
}

export const TrendsView: React.FC<TrendsViewProps> = ({
  initialCommodity,
  onSelectCommodityForModal,
  onCompareCommodity,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialCommodity?.id || COMMODITIES[0].id
  );
  const [timeframe, setTimeframe] = useState<'30D' | '14D' | '7D'>('30D');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const currentCommodity =
    COMMODITIES.find((c) => c.id === selectedId) || COMMODITIES[0];

  const history = currentCommodity.priceHistory;
  const firstPrice = history[0]?.price || currentCommodity.cheapestPrice;
  const latestPrice = history[history.length - 1]?.price || currentCommodity.cheapestPrice;
  const netChange = latestPrice - firstPrice;
  const netChangePct = firstPrice > 0 ? ((netChange / firstPrice) * 100).toFixed(1) : '0';

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const prices = history.map((h) => h.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  const rangeP = maxP - minP || 1;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((item.price - minP) / rangeP) * (chartHeight - paddingY * 2);
    return { x, y, item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Categorize market trend movers
  const risingGoods = COMMODITIES.filter((c) => c.trend === 'rising');
  const fallingGoods = COMMODITIES.filter((c) => c.trend === 'falling');
  const stableGoods = COMMODITIES.filter((c) => c.trend === 'stable');

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-canvas-light p-6 sm:p-8 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex items-center gap-2 mb-2">
          <PillTag variant="mint" size="xs">
            Price History & Analytics
          </PillTag>
          <span className="text-xs text-shade-50 font-mono">
            30-Day Longitudinal Tracking
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-ink tracking-tight font-display-thin">
          Commodity Price History & Market Trends
        </h2>
        <p className="text-sm sm:text-base text-shade-60 mt-1 max-w-2xl font-light">
          Monitor commodity price inflation, recorded milestone increments, seasonal trends, and price drops over time.
        </p>
      </div>

      {/* Main Interactive Trend Card */}
      <div className="bg-canvas-light rounded-xl border border-hairline-light shadow-level-3 p-6 sm:p-8 space-y-6">
        
        {/* Top Controls: Commodity Switcher & Timeframe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
          
          <div className="flex items-center gap-3">
            <img
              src={currentCommodity.image}
              alt={currentCommodity.name}
              className="w-14 h-14 rounded-lg object-cover border border-hairline-light flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-shade-50 font-medium">
                  {currentCommodity.category}
                </span>
                {currentCommodity.trend === 'rising' && (
                  <span className="text-xs text-rose-600 font-mono font-semibold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Rising (+{currentCommodity.trendPercentage}%)
                  </span>
                )}
                {currentCommodity.trend === 'falling' && (
                  <span className="text-xs text-emerald-700 font-mono font-semibold flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Price Drop ({currentCommodity.trendPercentage}%)
                  </span>
                )}
                {currentCommodity.trend === 'stable' && (
                  <span className="text-xs text-shade-60 font-mono flex items-center">
                    <Minus className="w-3.5 h-3.5 mr-0.5" /> Stable Rate
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-medium text-ink tracking-tight">
                {currentCommodity.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="appearance-none bg-canvas-cream text-ink text-xs font-semibold pl-4 pr-10 py-2 rounded-pill border border-hairline-light focus:outline-none focus:border-ink cursor-pointer"
              >
                {COMMODITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.standardUnit})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-shade-50 pointer-events-none" />
            </div>

            <div className="flex items-center bg-canvas-cream rounded-pill border border-hairline-light p-0.5 text-xs">
              <button
                onClick={() => setTimeframe('7D')}
                className={`px-3 py-1 rounded-pill transition-colors ${
                  timeframe === '7D' ? 'bg-primary text-on-primary font-medium' : 'text-shade-60 hover:text-ink'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeframe('14D')}
                className={`px-3 py-1 rounded-pill transition-colors ${
                  timeframe === '14D' ? 'bg-primary text-on-primary font-medium' : 'text-shade-60 hover:text-ink'
                }`}
              >
                14D
              </button>
              <button
                onClick={() => setTimeframe('30D')}
                className={`px-3 py-1 rounded-pill transition-colors ${
                  timeframe === '30D' ? 'bg-primary text-on-primary font-medium' : 'text-shade-60 hover:text-ink'
                }`}
              >
                30D
              </button>
            </div>
          </div>

        </div>

        {/* Milestone Sequence Callout (Directly matching README.md specification) */}
        <div className="bg-canvas-cream border border-hairline-light rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-shade-50 font-semibold">
              Price Progression Milestone History ({currentCommodity.name})
            </span>
            <span className="text-xs font-mono text-shade-50">
              Unit: {currentCommodity.standardUnit}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 my-2">
            {history.map((pt, idx) => (
              <React.Fragment key={idx}>
                <div 
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activePointIndex === idx 
                      ? 'bg-primary text-on-primary border-primary shadow-sm scale-105' 
                      : 'bg-canvas-light text-ink border-hairline-light hover:border-shade-40'
                  }`}
                  onClick={() => setActivePointIndex(idx)}
                >
                  <div className="text-xl font-light font-mono leading-none">
                    ₱{pt.price.toFixed(2)}
                  </div>
                  <div className={`text-[11px] mt-1 font-mono ${
                    activePointIndex === idx ? 'text-aloe-10' : 'text-shade-50'
                  }`}>
                    {pt.label}
                  </div>
                </div>

                {idx < history.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-shade-40 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Change Statement Summary */}
          <div className="mt-4 pt-3 border-t border-hairline-light text-sm text-ink flex items-center justify-between flex-wrap gap-2">
            <div>
              {netChange > 0 ? (
                <span>
                  Price <strong>increased by ₱{netChange.toFixed(2)}</strong> (+{netChangePct}%) over the recorded period.
                </span>
              ) : netChange < 0 ? (
                <span className="text-emerald-800">
                  Price <strong>decreased by ₱{Math.abs(netChange).toFixed(2)}</strong> ({netChangePct}%) over the recorded period.
                </span>
              ) : (
                <span>Price maintained stable rate of ₱{latestPrice.toFixed(2)} across the period.</span>
              )}
            </div>

            <div className="text-xs text-shade-50 font-mono">
              Market Range: ₱{minP.toFixed(2)} (Low) – ₱{maxP.toFixed(2)} (High)
            </div>
          </div>
        </div>

        {/* Interactive SVG History Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-shade-50">
            <span>Historical Price Trajectory (PHP)</span>
            <span>Hover / click nodes to inspect</span>
          </div>

          <div className="w-full overflow-x-auto bg-canvas-cream/50 rounded-xl border border-hairline-light p-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 sm:h-64 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c1fbd4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c1fbd4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#e4e4e7"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#e4e4e7"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#e4e4e7"
              />

              {/* Area & Stroke */}
              <path d={areaD} fill="url(#trendGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {points.map((pt, i) => {
                const isActive = activePointIndex === i;
                return (
                  <g
                    key={i}
                    className="cursor-pointer transition-all"
                    onClick={() => setActivePointIndex(i)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? 7 : 4.5}
                      fill={isActive ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth={2}
                    />
                    
                    {/* Price Tag above point */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="text-[12px] font-mono font-bold fill-ink"
                    >
                      ₱{pt.item.price.toFixed(2)}
                    </text>

                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      className="text-[11px] fill-shade-50 font-mono"
                    >
                      {pt.item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Record Point Notes */}
        {activePointIndex !== null && (
          <div className="p-4 bg-aloe-10/40 border border-emerald-200 rounded-lg text-xs text-ink flex items-center justify-between">
            <div>
              <strong className="font-semibold">{history[activePointIndex].label}: </strong>
              <span>Price recorded at ₱{history[activePointIndex].price.toFixed(2)} / {currentCommodity.unit}. </span>
              {history[activePointIndex].changeNote && (
                <span className="italic">Note: &quot;{history[activePointIndex].changeNote}&quot;</span>
              )}
            </div>
            <button
              onClick={() => setActivePointIndex(null)}
              className="text-xs text-shade-50 hover:text-ink ml-2 font-mono"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-hairline-light text-xs text-shade-50">
          <div>
            Data sourced from participating Calbayog City vendors and municipal monitors.
          </div>
          <div className="flex items-center gap-2">
            <PillButton
              variant="outline-light"
              size="sm"
              onClick={() => onSelectCommodityForModal(currentCommodity)}
              icon={<Eye className="w-3.5 h-3.5" />}
            >
              Inspect Details
            </PillButton>
            <PillButton
              variant="outline-light"
              size="sm"
              onClick={() => onCompareCommodity(currentCommodity)}
              icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
            >
              Compare Sellers
            </PillButton>
          </div>
        </div>

      </div>

      {/* Market Volatility & Trends Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Price Drops */}
        <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-pill bg-aloe-10 text-emerald-900">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-base text-ink">Price Drops Today</h4>
            </div>
            <span className="text-xs font-mono text-emerald-800 font-bold">
              {fallingGoods.length} Items
            </span>
          </div>

          <div className="space-y-3">
            {fallingGoods.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="p-3 bg-canvas-cream rounded-lg border border-hairline-light cursor-pointer hover:border-shade-40 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-xs text-ink">{item.name}</div>
                  <div className="text-[11px] text-shade-50">from ₱{item.cheapestPrice.toFixed(2)} / {item.unit}</div>
                </div>
                <div className="text-right text-emerald-700 font-mono text-xs font-bold">
                  {item.trendPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stable Commodities */}
        <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-pill bg-shade-30 text-ink">
                <Minus className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-base text-ink">Stable Market Rates</h4>
            </div>
            <span className="text-xs font-mono text-shade-60">
              {stableGoods.length} Items
            </span>
          </div>

          <div className="space-y-3">
            {stableGoods.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="p-3 bg-canvas-cream rounded-lg border border-hairline-light cursor-pointer hover:border-shade-40 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-xs text-ink">{item.name}</div>
                  <div className="text-[11px] text-shade-50">₱{item.cheapestPrice.toFixed(2)} / {item.unit}</div>
                </div>
                <div className="text-right text-shade-60 font-mono text-xs">
                  ±0.0%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rising Commodities */}
        <div className="bg-canvas-light rounded-xl border border-hairline-light p-6 shadow-level-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-pill bg-rose-100 text-rose-800">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-base text-ink">Rising Rates (Watch)</h4>
            </div>
            <span className="text-xs font-mono text-rose-700 font-bold">
              {risingGoods.length} Items
            </span>
          </div>

          <div className="space-y-3">
            {risingGoods.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="p-3 bg-canvas-cream rounded-lg border border-hairline-light cursor-pointer hover:border-shade-40 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-xs text-ink">{item.name}</div>
                  <div className="text-[11px] text-shade-50">from ₱{item.cheapestPrice.toFixed(2)} / {item.unit}</div>
                </div>
                <div className="text-right text-rose-600 font-mono text-xs font-bold">
                  +{item.trendPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

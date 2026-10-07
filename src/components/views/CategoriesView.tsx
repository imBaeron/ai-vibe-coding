import React, { useState, useRef } from 'react';
import { Commodity, Category } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { PillButton } from '../common/PillButton';
import { PillTag } from '../common/PillTag';
import { 
  Wheat, 
  Drumstick, 
  Fish, 
  Egg, 
  Carrot, 
  Apple, 
  Flame, 
  Coffee, 
  Package, 
  Layers, 
  ArrowRight, 
  Store, 
  MapPin, 
  ArrowLeftRight, 
  ShoppingBag 
} from 'lucide-react';

interface CategoriesViewProps {
  commodities: Commodity[];
  onSelectCommodity: (c: Commodity) => void;
  onCompareCommodity: (c: Commodity) => void;
  onAddToBasket: (c: Commodity) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  commodities,
  onSelectCommodity,
  onCompareCommodity,
  onAddToBasket,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(CATEGORIES[0].id);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  const activeCategory =
    CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];

  const categoryCommodities = commodities.filter(
    (c) => c.category === selectedCatId
  );

  const handleCategoryClick = (catId: string) => {
    setSelectedCatId(catId);
    setTimeout(() => {
      detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat': return <Wheat className="w-5 h-5" />;
      case 'Drumstick': return <Drumstick className="w-5 h-5" />;
      case 'Fish': return <Fish className="w-5 h-5" />;
      case 'Egg': return <Egg className="w-5 h-5" />;
      case 'Carrot': return <Carrot className="w-5 h-5" />;
      case 'Apple': return <Apple className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="bg-canvas-light p-6 sm:p-8 rounded-xl border border-hairline-light shadow-level-3">
        <div className="flex items-center gap-2 mb-2">
          <PillTag variant="mint" size="xs">
            Category Directory
          </PillTag>
          <span className="text-xs text-shade-50 font-mono">
            {CATEGORIES.length} Official Commodity Groups
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-ink tracking-tight font-display-thin">
          Category-Based Commodity Browsing
        </h2>
        <p className="text-sm sm:text-base text-shade-60 mt-1 max-w-2xl font-light">
          Click any commodity category below to view and compare updated market prices.
        </p>
      </div>

      {/* Visual Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCatId;
          const matchingItemsCount = commodities.filter((c) => c.category === cat.id).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`rounded-xl border p-4 sm:p-5 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-level-3 scale-[1.02] ring-2 ring-aloe-10/40'
                  : 'bg-canvas-light text-ink border-hairline-light hover:border-shade-40 shadow-level-3'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-pill ${
                    isSelected ? 'bg-canvas-night-elevated text-aloe-10' : 'bg-canvas-cream text-ink'
                  }`}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-pill ${
                    isSelected ? 'bg-white/10 text-on-primary' : 'bg-shade-30 text-ink'
                  }`}>
                    {matchingItemsCount > 0 ? `${matchingItemsCount} Items` : `${cat.itemCount} Listed`}
                  </span>
                </div>

                <h3 className="font-semibold text-base sm:text-lg leading-snug">
                  {cat.name}
                </h3>
                <p className={`text-xs mt-1 line-clamp-2 ${
                  isSelected ? 'text-link-cool-2' : 'text-shade-50'
                }`}>
                  {cat.tagline}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t text-xs flex items-center justify-between font-mono ${
                isSelected ? 'border-white/15 text-aloe-10' : 'border-hairline-light text-shade-60'
              }`}>
                <span>{cat.averagePriceRange}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Category Detail Section (Smooth Scroll Target) */}
      <div 
        ref={detailSectionRef}
        className="bg-canvas-light rounded-xl border border-hairline-light shadow-level-3 p-6 sm:p-8 space-y-6 scroll-mt-24"
      >
        
        {/* Category Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-pill bg-aloe-10 text-ink">
                {getCategoryIcon(activeCategory.icon)}
              </span>
              <span className="text-xs uppercase tracking-wider text-shade-50 font-semibold">
                Viewing Category
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-ink font-display-thin">
              {activeCategory.name}
            </h3>
            <p className="text-sm text-shade-60 mt-1">
              {activeCategory.tagline} • Typical price range: <strong className="font-mono text-ink">{activeCategory.averagePriceRange}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-shade-50">Popular in category:</span>
            {activeCategory.popularItems.map((item) => (
              <PillTag key={item} variant="shade" size="xs">
                {item}
              </PillTag>
            ))}
          </div>
        </div>

        {/* Commodity Items in This Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryCommodities.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCommodity(item)}
              className="bg-canvas-cream/50 rounded-xl border border-hairline-light p-5 card-stacked-shadow hover:shadow-level-3 cursor-pointer flex flex-col justify-between transition-all"
            >
              <div>
                <div className="relative mb-3 h-36 rounded-lg overflow-hidden bg-canvas-cream border border-hairline-light">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <PillTag variant="shade" size="xs">
                      {item.subcategory}
                    </PillTag>
                  </div>
                </div>

                <h4 className="font-semibold text-base text-ink">
                  {item.name}
                </h4>
                {item.localName && (
                  <p className="text-xs text-shade-50 mt-0.5 line-clamp-1">{item.localName}</p>
                )}

                <div className="my-3 p-3 bg-canvas-light rounded-lg border border-hairline-light flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-shade-50 font-medium">
                      Lowest Price
                    </span>
                    <div className="text-2xl font-light text-ink font-mono">
                      ₱{item.cheapestPrice.toFixed(2)}
                      <span className="text-xs text-shade-50 font-normal"> / {item.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-shade-50">Avg Rate</span>
                    <div className="text-sm font-mono text-shade-60">
                      ₱{item.currentAveragePrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-shade-60 mb-2">
                  <div className="flex items-center gap-1.5 text-ink font-medium">
                    <Store className="w-3.5 h-3.5 text-shade-50" />
                    <span className="truncate">{item.cheapestStoreName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-shade-50">
                    <MapPin className="w-3.5 h-3.5 text-shade-40" />
                    <span className="truncate">{item.cheapestStoreLocation}</span>
                  </div>
                </div>
              </div>

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

      </div>

    </div>
  );
};

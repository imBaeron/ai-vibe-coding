import React from 'react';
import { NavigationTab } from '../../types';
import { PillButton } from '../common/PillButton';
import { 
  Search, 
  MapPin, 
  BarChart3, 
  ArrowLeftRight, 
  LayoutGrid, 
  ShoppingBag, 
  PlusCircle, 
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenReportModal: () => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  basketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenReportModal,
  selectedLocation,
  onLocationChange,
  searchQuery,
  onSearchChange,
  basketCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-canvas-night text-on-primary border-b border-hairline-dark/60 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('catalog')}>
            <div className="w-9 h-9 rounded-pill bg-aloe-10 text-ink flex items-center justify-center font-bold text-lg tracking-tight shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-wider text-on-primary">SUKI</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest bg-shade-70 text-on-primary rounded-pill border border-white/10">
                  Kalakal Info
                </span>
              </div>
              <p className="text-[11px] text-link-cool-1 hidden md:block leading-none">
                Citizen Commodity Price Monitor
              </p>
            </div>
          </div>

          {/* Search Bar in Navbar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-link-cool-2" />
              <input
                type="text"
                placeholder="Search rice, eggs, chicken, pork, sugar..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 text-sm bg-canvas-night-elevated text-on-primary placeholder:text-link-cool-2 rounded-pill border border-hairline-dark focus:outline-none focus:border-aloe-10 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-link-cool-2 hover:text-on-primary"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <div className="relative hidden sm:flex items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-on-primary bg-canvas-night-elevated rounded-pill border border-hairline-dark">
                <MapPin className="w-3.5 h-3.5 text-aloe-10" />
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="bg-transparent text-xs text-on-primary focus:outline-none cursor-pointer pr-1"
                >
                  <option value="All Locations" className="bg-canvas-night text-on-primary">All Calbayog & Samar</option>
                  <option value="Calbayog Central" className="bg-canvas-night text-on-primary">Calbayog Central</option>
                  <option value="Brgy. Rawis" className="bg-canvas-night text-on-primary">Brgy. Rawis</option>
                  <option value="Brgy. San Policarpo" className="bg-canvas-night text-on-primary">Brgy. San Policarpo</option>
                  <option value="Brgy. Oquendo" className="bg-canvas-night text-on-primary">Brgy. Oquendo Poblacion</option>
                  <option value="Brgy. Hamorawon" className="bg-canvas-night text-on-primary">Brgy. Hamorawon</option>
                  <option value="Brgy. Matobato" className="bg-canvas-night text-on-primary">Brgy. Matobato</option>
                </select>
                <ChevronDown className="w-3 h-3 text-link-cool-2" />
              </div>
            </div>

            {/* Report Price Modal Trigger */}
            <PillButton
              variant="outline-dark"
              size="sm"
              onClick={onOpenReportModal}
              icon={<PlusCircle className="w-3.5 h-3.5 text-aloe-10" />}
              className="text-xs"
            >
              <span className="hidden sm:inline">Report Price</span>
              <span className="sm:hidden">Report</span>
            </PillButton>

            {/* Basket Quick Link */}
            <button
              onClick={() => onTabChange('basket')}
              className={`relative flex items-center justify-center p-2 rounded-pill transition-colors ${
                activeTab === 'basket' ? 'bg-aloe-10 text-ink' : 'bg-canvas-night-elevated text-on-primary hover:bg-shade-70'
              }`}
              title="Shopping Basket Price Optimizer"
            >
              <ShoppingBag className="w-4 h-4" />
              {basketCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-aloe-10 text-ink text-[10px] font-bold rounded-pill flex items-center justify-center">
                  {basketCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-hairline-dark/40">
          <button
            onClick={() => onTabChange('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'catalog'
                ? 'bg-on-primary text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Commodity Prices</span>
          </button>

          <button
            onClick={() => onTabChange('compare')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'compare'
                ? 'bg-aloe-10 text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Price Compare</span>
          </button>

          <button
            onClick={() => onTabChange('categories')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-on-primary text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => onTabChange('locations')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'locations'
                ? 'bg-on-primary text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Markets & Stores</span>
          </button>

          <button
            onClick={() => onTabChange('trends')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'trends'
                ? 'bg-on-primary text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Price History & Trends</span>
          </button>

          <button
            onClick={() => onTabChange('basket')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-pill whitespace-nowrap transition-all ${
              activeTab === 'basket'
                ? 'bg-aloe-10 text-ink shadow-sm'
                : 'text-link-cool-3 hover:text-on-primary hover:bg-canvas-night-elevated'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cheapest Basket ({basketCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};

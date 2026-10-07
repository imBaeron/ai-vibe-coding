import React from 'react';
import { PillButton } from '../common/PillButton';
import { ArrowLeftRight, TrendingUp, CheckCircle2, Store, Database } from 'lucide-react';
import { NavigationTab } from '../../types';

interface HeroBannerProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenReportModal: () => void;
  onOpenDatabaseModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onNavigate, 
  onOpenReportModal,
  onOpenDatabaseModal 
}) => {
  return (
    <section className="bg-canvas-night text-on-primary border-b border-hairline-dark relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-surface-elevated-dark/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-aloe-10/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        
        {/* Top Eyebrow Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-canvas-night-elevated text-aloe-10 text-xs uppercase tracking-widest border border-hairline-dark">
            <span className="w-2 h-2 rounded-full bg-aloe-10 animate-pulse" />
            Live Commodity Monitoring • Calbayog & Samar
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-link-cool-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-aloe-10" />
            Citizen Verified
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-on-primary font-display-thin leading-[1.08] mb-4">
              Know today&apos;s real market prices. <br />
              <span className="text-aloe-10 font-normal">Compare, save, and buy smart.</span>
            </h1>
            <p className="text-base sm:text-lg text-link-cool-3 max-w-2xl font-light leading-relaxed mb-6">
              SUKI gives citizens transparent, community-updated prices of everyday goods — rice, meat, fish, eggs, and groceries across local wet markets, talipapa, and supermarkets.
            </p>

            {/* Action Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <PillButton
                variant="aloe"
                size="md"
                onClick={() => onNavigate('compare')}
                icon={<ArrowLeftRight className="w-4 h-4" />}
              >
                Compare Market Prices
              </PillButton>

              <PillButton
                variant="outline-dark"
                size="md"
                onClick={() => onNavigate('trends')}
                icon={<TrendingUp className="w-4 h-4 text-aloe-10" />}
              >
                View Price History & Trends
              </PillButton>

              <PillButton
                variant="outline-dark"
                size="md"
                onClick={onOpenReportModal}
                className="hidden sm:inline-flex"
              >
                Submit Price Update
              </PillButton>

              <PillButton
                variant="outline-dark"
                size="md"
                onClick={onOpenDatabaseModal}
                icon={<Database className="w-4 h-4 text-aloe-10" />}
                className="bg-canvas-night-elevated border-white/20"
              >
                Database & Supabase Hub
              </PillButton>
            </div>
          </div>

          {/* Quick Stat Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="bg-canvas-night-elevated border border-hairline-dark/80 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-link-cool-2 mb-2">
                <span className="text-xs uppercase tracking-wider">Cheapest Rice</span>
                <span className="text-[10px] bg-aloe-10/20 text-aloe-10 px-1.5 py-0.5 rounded-pill font-mono">Today</span>
              </div>
              <div className="text-2xl font-light text-on-primary">₱47.00<span className="text-xs text-link-cool-1 font-normal"> /kg</span></div>
              <div className="text-[11px] text-link-cool-1 mt-1 truncate">Calbayog Central Public Market</div>
            </div>

            <div className="bg-canvas-night-elevated border border-hairline-dark/80 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-link-cool-2 mb-2">
                <span className="text-xs uppercase tracking-wider">Table Eggs</span>
                <span className="text-[10px] bg-aloe-10/20 text-aloe-10 px-1.5 py-0.5 rounded-pill font-mono">Farm</span>
              </div>
              <div className="text-2xl font-light text-on-primary">₱7.80<span className="text-xs text-link-cool-1 font-normal"> /pc</span></div>
              <div className="text-[11px] text-link-cool-1 mt-1 truncate">Oquendo District Farmers</div>
            </div>

            <div className="bg-canvas-night-elevated border border-hairline-dark/80 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-link-cool-2 mb-2">
                <span className="text-xs uppercase tracking-wider">Tracked Stores</span>
                <Store className="w-3.5 h-3.5 text-link-cool-2" />
              </div>
              <div className="text-2xl font-light text-on-primary">6 <span className="text-xs text-link-cool-1 font-normal">Markets</span></div>
              <div className="text-[11px] text-link-cool-1 mt-1">Wet markets & supermarkets</div>
            </div>

            <div className="bg-canvas-night-elevated border border-hairline-dark/80 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-link-cool-2 mb-2">
                <span className="text-xs uppercase tracking-wider">Price Index</span>
                <TrendingUp className="w-3.5 h-3.5 text-aloe-10" />
              </div>
              <div className="text-2xl font-light text-aloe-10">-3.2%</div>
              <div className="text-[11px] text-link-cool-1 mt-1">Fish & poultry price easing</div>
            </div>
          </div>

        </div>

        {/* Live Ticker Bar */}
        <div className="mt-8 pt-4 border-t border-hairline-dark/60 flex items-center gap-4 text-xs overflow-x-auto no-scrollbar">
          <span className="flex-shrink-0 font-medium text-aloe-10 uppercase tracking-wider text-[11px]">
            Live Rates:
          </span>
          <div className="flex items-center gap-6 whitespace-nowrap text-link-cool-3">
            <span>🌾 Regular Rice: <strong className="text-on-primary font-mono">₱47 - ₱50/kg</strong></span>
            <span>•</span>
            <span>🍗 Whole Chicken: <strong className="text-on-primary font-mono">₱185 - ₱210/kg</strong> <span className="text-aloe-10 font-mono">(-₱15)</span></span>
            <span>•</span>
            <span>🐟 Bangus: <strong className="text-on-primary font-mono">₱190 - ₱240/kg</strong></span>
            <span>•</span>
            <span>🥚 Large Eggs: <strong className="text-on-primary font-mono">₱7.80 - ₱9.50/pc</strong></span>
            <span>•</span>
            <span>🧅 Red Onion: <strong className="text-on-primary font-mono">₱120 - ₱150/kg</strong></span>
            <span>•</span>
            <span>🥥 Cooking Oil (1L): <strong className="text-on-primary font-mono">₱98 - ₱125</strong></span>
            <span>•</span>
            <span>🥫 Sardines (155g): <strong className="text-on-primary font-mono">₱22 - ₱27/can</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};

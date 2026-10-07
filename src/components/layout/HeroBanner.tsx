import React from 'react';
import { PillButton } from '../common/PillButton';
import { ArrowLeftRight, TrendingUp, Sparkles, Store, Flame } from 'lucide-react';
import { NavigationTab } from '../../types';

interface HeroBannerProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenReportModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, onOpenReportModal }) => {
  return (
    <section className="bg-canvas-night text-on-primary border-b border-hairline-dark relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-surface-elevated-dark/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-aloe-10/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Top Eyebrow with SUKI acronym definition */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-canvas-night-elevated text-aloe-10 text-xs uppercase tracking-wider border border-hairline-dark font-medium">
            <span className="w-2 h-2 rounded-full bg-aloe-10 animate-pulse" />
            SUKI • Smart Utility &amp; Kalakal Information
          </span>
          <span className="text-xs text-link-cool-2 hidden sm:inline">
            Citizen Price Monitoring System
          </span>
        </div>

        {/* Hero Title & Single Highlights Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Shortened Text & Actions */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-on-primary font-display-thin leading-[1.1] mb-3">
              Real market prices across <br />
              <span className="text-aloe-10 font-normal">Calbayog &amp; Samar.</span>
            </h1>
            <p className="text-sm sm:text-base text-link-cool-3 max-w-xl font-light leading-relaxed mb-5">
              Compare transparent, daily citizen-updated prices of rice, meats, seafood, and essentials across local wet markets and supermarkets.
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
                View Price Trends
              </PillButton>

              <PillButton
                variant="outline-dark"
                size="md"
                onClick={onOpenReportModal}
                className="hidden sm:inline-flex"
              >
                Submit Price
              </PillButton>
            </div>
          </div>

          {/* Right Column: Single Card showing 3 Examples of Currently Cheap Goods */}
          <div className="lg:col-span-5">
            <div className="bg-canvas-night-elevated border border-hairline-dark/90 rounded-xl p-5 shadow-level-2">
              
              <div className="flex items-center justify-between pb-3 border-b border-hairline-dark">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-pill bg-aloe-10 text-ink">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-on-primary">Cheapest Today</h3>
                    <p className="text-[11px] text-link-cool-2">Lowest recorded local options</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-pill bg-aloe-10/20 text-aloe-10 border border-aloe-10/30">
                  Verified Rates
                </span>
              </div>

              {/* 3 Highlights List */}
              <div className="divide-y divide-hairline-dark/60">
                
                {/* 1. Rice */}
                <div 
                  onClick={() => onNavigate('compare')}
                  className="py-3 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🌾</span>
                    <div>
                      <div className="font-medium text-xs text-on-primary">Regular Milled Rice</div>
                      <div className="text-[11px] text-link-cool-1 flex items-center gap-1">
                        <Store className="w-3 h-3 text-aloe-10" />
                        <span>Central Public Market</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-on-primary font-mono">
                      ₱47.00<span className="text-xs text-link-cool-2 font-normal"> /kg</span>
                    </div>
                    <div className="text-[10px] text-aloe-10 font-medium">Lowest in city</div>
                  </div>
                </div>

                {/* 2. Whole Chicken */}
                <div 
                  onClick={() => onNavigate('compare')}
                  className="py-3 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🍗</span>
                    <div>
                      <div className="font-medium text-xs text-on-primary">Whole Dressed Chicken</div>
                      <div className="text-[11px] text-link-cool-1 flex items-center gap-1">
                        <Store className="w-3 h-3 text-aloe-10" />
                        <span>Central Public Market</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-on-primary font-mono">
                      ₱185.00<span className="text-xs text-link-cool-2 font-normal"> /kg</span>
                    </div>
                    <div className="text-[10px] text-aloe-10 font-medium flex items-center justify-end gap-0.5">
                      <Sparkles className="w-3 h-3" /> -₱15 drop
                    </div>
                  </div>
                </div>

                {/* 3. Fresh Eggs */}
                <div 
                  onClick={() => onNavigate('compare')}
                  className="py-3 flex items-center justify-between hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🥚</span>
                    <div>
                      <div className="font-medium text-xs text-on-primary">Table Eggs (Large)</div>
                      <div className="text-[11px] text-link-cool-1 flex items-center gap-1">
                        <Store className="w-3 h-3 text-aloe-10" />
                        <span>Oquendo Farmers Market</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-on-primary font-mono">
                      ₱7.80<span className="text-xs text-link-cool-2 font-normal"> /pc</span>
                    </div>
                    <div className="text-[10px] text-link-cool-1">₱230 / 30-egg tray</div>
                  </div>
                </div>

              </div>

              <div className="pt-2.5 mt-1 border-t border-hairline-dark/60 flex items-center justify-between text-[11px] text-link-cool-2">
                <span>6 Participating Markets Tracked</span>
                <button 
                  onClick={() => onNavigate('compare')}
                  className="text-aloe-10 hover:underline"
                >
                  Compare all sellers →
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Automatic Scrolling Live Rate Ticker / Carousel */}
        <div className="mt-8 pt-4 border-t border-hairline-dark/60 flex items-center gap-3 text-xs overflow-hidden">
          <div className="flex-shrink-0 font-medium text-aloe-10 uppercase tracking-wider text-[11px] z-10 bg-canvas-night pr-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-aloe-10 animate-ping" />
            Live Rates:
          </div>
          
          <div className="overflow-hidden relative w-full mask-gradient">
            <div className="animate-ticker text-link-cool-3">
              <span className="inline-flex items-center gap-6 whitespace-nowrap pr-6">
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
                <span>•</span>
                <span>🥩 Pork Liempo: <strong className="text-on-primary font-mono">₱320 - ₱360/kg</strong></span>
                <span>•</span>
                <span>🍌 Lakatan Banana: <strong className="text-on-primary font-mono">₱65 - ₱85/kg</strong></span>
              </span>
              
              <span className="inline-flex items-center gap-6 whitespace-nowrap pr-6" aria-hidden="true">
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
                <span>•</span>
                <span>🥩 Pork Liempo: <strong className="text-on-primary font-mono">₱320 - ₱360/kg</strong></span>
                <span>•</span>
                <span>🍌 Lakatan Banana: <strong className="text-on-primary font-mono">₱65 - ₱85/kg</strong></span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

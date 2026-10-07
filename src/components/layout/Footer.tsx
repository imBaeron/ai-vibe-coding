import React from 'react';
import { NavigationTab } from '../../types';
import { ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenReportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenReportModal }) => {
  return (
    <footer className="bg-canvas-night text-on-primary border-t border-hairline-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-pill bg-aloe-10 text-ink flex items-center justify-center font-bold text-sm">
                S
              </div>
              <span className="font-semibold text-lg tracking-wider text-on-primary">SUKI</span>
            </div>
            <p className="text-sm text-link-cool-2 leading-relaxed mb-4 max-w-sm">
              Smart Utility & Kalakal Information — A citizen-oriented open price transparency platform for local consumers, wet markets, and grocery stores.
            </p>
            <div className="flex items-center gap-2 text-xs text-link-cool-1">
              <ShieldCheck className="w-4 h-4 text-aloe-10" />
              <span>Aligned with Local Fair Trade & Price Monitoring standards</span>
            </div>
          </div>

          {/* Col 3: Core Tools */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-on-primary font-medium mb-4">
              Price Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-link-cool-2">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-on-primary transition-colors text-left">
                  Browse Commodity Prices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-on-primary transition-colors text-left">
                  Side-by-Side Store Comparison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-on-primary transition-colors text-left">
                  Category Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('locations')} className="hover:text-on-primary transition-colors text-left">
                  Market & Store Locator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trends')} className="hover:text-on-primary transition-colors text-left">
                  Price History & Trends
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('basket')} className="hover:text-on-primary transition-colors text-left">
                  Cheapest Basket Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Monitored Commodities */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-on-primary font-medium mb-4">
              Top Staples
            </h4>
            <ul className="space-y-2.5 text-sm text-link-cool-2">
              <li><span>Regular & Well-Milled Rice</span></li>
              <li><span>Fresh Chicken & Pork Liempo</span></li>
              <li><span>Bangus & Galunggong</span></li>
              <li><span>Brown Table Eggs</span></li>
              <li><span>Red Onion & Garlic</span></li>
              <li><span>Cooking Oil & Sugar</span></li>
              <li><span>Canned Goods & Sardines</span></li>
            </ul>
          </div>

          {/* Col 5: Citizen & Feedback */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-on-primary font-medium mb-4">
              Community & Help
            </h4>
            <ul className="space-y-2.5 text-sm text-link-cool-2">
              <li>
                <button onClick={onOpenReportModal} className="text-aloe-10 hover:underline flex items-center gap-1 text-left">
                  Submit a Store Price
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/Kilo-Org/kilocode/issues" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-on-primary flex items-center gap-1 transition-colors"
                >
                  Give Feedback <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://kilo.ai/docs" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-on-primary flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" /> /help & Docs
                </a>
              </li>
              <li>
                <span className="text-xs text-link-cool-1">Coverage: Calbayog City, Samar & nearby municipalities</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-hairline-dark/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-link-cool-2">
          <p>© 2026 SUKI (Smart Utility & Kalakal Information). Citizen Price Monitoring System.</p>
          <div className="flex items-center gap-4">
            <span>Calbayog City, Samar</span>
            <span>•</span>
            <span>Frontend Preview Prototype</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

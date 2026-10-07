import React, { useState, useEffect } from 'react';
import { Commodity, NavigationTab, BasketItem } from './types';
import { SukiApi } from './services/supabase';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/layout/HeroBanner';
import { Footer } from './components/layout/Footer';
import { CatalogView } from './components/views/CatalogView';
import { CompareView } from './components/views/CompareView';
import { CategoriesView } from './components/views/CategoriesView';
import { LocationsView } from './components/views/LocationsView';
import { TrendsView } from './components/views/TrendsView';
import { BasketCalculatorView } from './components/views/BasketCalculatorView';
import { CommodityDetailModal } from './components/modals/CommodityDetailModal';
import { ReportPriceModal } from './components/modals/ReportPriceModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  
  // Modals & Data
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [modalCommodity, setModalCommodity] = useState<Commodity | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [compareCommodityTarget, setCompareCommodityTarget] = useState<Commodity | null>(null);
  const [trendCommodityTarget, setTrendCommodityTarget] = useState<Commodity | null>(null);

  // Shopping Basket
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await SukiApi.getCommodities();
      setCommodities(data);
    };
    fetchData();
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareCommodity = (commodity: Commodity) => {
    setCompareCommodityTarget(commodity);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTrends = (commodity: Commodity) => {
    setTrendCommodityTarget(commodity);
    setActiveTab('trends');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToBasket = (commodity: Commodity) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.commodity.id === commodity.id);
      if (existing) {
        return prev.map((item) =>
          item.commodity.id === commodity.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { commodity, quantity: 1 }];
    });
    showToast(`Added ${commodity.name} to your basket!`);
  };

  const handleUpdateQuantity = (commodityId: string, quantity: number) => {
    if (quantity <= 0) {
      setBasket((prev) => prev.filter((item) => item.commodity.id !== commodityId));
      return;
    }
    setBasket((prev) =>
      prev.map((item) =>
        item.commodity.id === commodityId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (commodityId: string) => {
    setBasket((prev) => prev.filter((item) => item.commodity.id !== commodityId));
    showToast('Item removed from basket');
  };

  const handleClearBasket = () => {
    setBasket([]);
    showToast('Basket cleared');
  };

  return (
    <div className="min-h-screen bg-canvas-cream text-ink flex flex-col font-sans selection:bg-aloe-10 selection:text-ink">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-pill text-xs font-medium shadow-level-4 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-aloe-10" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'catalog') {
            setActiveTab('catalog');
          }
        }}
        basketCount={basket.length}
      />

      {/* Hero Banner */}
      {activeTab === 'catalog' && !searchQuery && (
        <HeroBanner
          onNavigate={handleTabChange}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {activeTab === 'catalog' && (
          <CatalogView
            commodities={commodities}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLocation={selectedLocation}
            onSelectCommodity={(c) => setModalCommodity(c)}
            onCompareCommodity={handleCompareCommodity}
            onAddToBasket={handleAddToBasket}
          />
        )}
        
        {activeTab === 'compare' && (
          <CompareView
            commodities={commodities}
            initialCommodity={compareCommodityTarget}
            onSelectCommodityForModal={(c) => setModalCommodity(c)}
            onAddToBasket={handleAddToBasket}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            commodities={commodities}
            onSelectCommodity={(c) => setModalCommodity(c)}
            onCompareCommodity={handleCompareCommodity}
            onAddToBasket={handleAddToBasket}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsView
            commodities={commodities}
            onSelectCommodity={(c) => setModalCommodity(c)}
            onCompareCommodity={handleCompareCommodity}
            onAddToBasket={handleAddToBasket}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView
            commodities={commodities}
            initialCommodity={trendCommodityTarget}
            onSelectCommodityForModal={(c) => setModalCommodity(c)}
            onCompareCommodity={handleCompareCommodity}
          />
        )}

        {activeTab === 'basket' && (
          <BasketCalculatorView
            basket={basket}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onAddQuickItem={handleAddToBasket}
            onClearBasket={handleClearBasket}
          />
        )}

      </main>

      {/* Commodity Detail Modal */}
      <CommodityDetailModal
        commodity={modalCommodity}
        onClose={() => setModalCommodity(null)}
        onCompare={handleCompareCommodity}
        onAddToBasket={handleAddToBasket}
        onViewTrends={handleViewTrends}
      />

      {/* Citizen Price Submission Modal */}
      <ReportPriceModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={() => {
          showToast('Price report submitted to Supabase successfully!');
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleTabChange}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

    </div>
  );
};

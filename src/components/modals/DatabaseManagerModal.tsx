import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  UploadCloud, 
  Copy, 
  ExternalLink, 
  Table, 
  ArrowRight,
  Sparkles,
  X,
  Radio
} from 'lucide-react';
import { SukiApi, TableStatusInfo, SUPABASE_URL } from '../../services/supabase';
import { PillButton } from '../common/PillButton';

interface DatabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshLiveData: () => void;
  isUsingLiveData: boolean;
  onToggleDataSource: (live: boolean) => void;
}

export const DatabaseManagerModal: React.FC<DatabaseManagerModalProps> = ({
  isOpen,
  onClose,
  onRefreshLiveData,
  isUsingLiveData,
  onToggleDataSource,
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'populate' | 'flow'>('flow');
  const [isChecking, setIsChecking] = useState(false);
  const [tableStatuses, setTableStatuses] = useState<TableStatusInfo[]>([]);
  const [allTablesExist, setAllTablesExist] = useState<boolean | null>(null);
  
  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [seedLog, setSeedLog] = useState<string[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);

  // Check tables on open
  useEffect(() => {
    if (isOpen) {
      checkTables();
    }
  }, [isOpen]);

  const checkTables = async () => {
    setIsChecking(true);
    try {
      const res = await SukiApi.checkAllTables();
      setTableStatuses(res.tables);
      setAllTablesExist(res.allExist);
    } catch (err) {
      console.error('Check failed:', err);
      setAllTablesExist(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopySql = () => {
    // Read the schema.sql content or notify user
    const sqlNotice = `-- You can copy the complete schema directly from schema.sql in your workspace.
-- Tables included: categories, market_locations, commodities, store_prices, price_history, citizen_price_reports.
-- Open schema.sql in your editor, copy all text, and paste into Supabase SQL Editor.`;
    navigator.clipboard.writeText(sqlNotice);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedProgress(5);
    setSeedLog(['[Start] Initializing database seeding to Supabase...']);

    const res = await SukiApi.seedAllData((msg, pct) => {
      setSeedProgress(pct);
      setSeedLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    });

    setIsSeeding(false);
    if (res.success) {
      setSeedLog(prev => [
        ...prev,
        `[Done] Successfully inserted:`,
        `  • ${res.inserted.categories} Categories`,
        `  • ${res.inserted.markets} Market Locations`,
        `  • ${res.inserted.commodities} Commodities`,
        `  • ${res.inserted.storePrices} Cross-Store Prices`,
        `  • ${res.inserted.history} Price History points`,
        `[Sync] Refreshing application with live Supabase data...`
      ]);
      await checkTables();
      onToggleDataSource(true);
      onRefreshLiveData();
    } else {
      setSeedLog(prev => [...prev, `[Error] ${res.error}`]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-canvas-light text-ink w-full max-w-4xl rounded-2xl border border-hairline-light shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-canvas-night text-on-primary p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-pill bg-canvas-night-elevated text-on-primary hover:bg-shade-70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-pill text-[11px] font-mono tracking-wider bg-aloe-10 text-ink uppercase font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Supabase Integration Hub
            </span>
            <span className="text-xs text-link-cool-2 font-mono">
              Project: dsmxzovrvclvxyxkbpxx
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-light text-on-primary tracking-tight font-display-thin">
            Database Architecture & Data Integration Flow
          </h2>
          <p className="text-xs sm:text-sm text-link-cool-1 mt-1 max-w-2xl font-light">
            Monitor real-time table creation, populate sample commodity prices, and switch between live Supabase data and mock data.
          </p>

          {/* Quick status badge */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className={`px-3 py-1 rounded-pill flex items-center gap-2 border ${
              allTablesExist 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${allTablesExist ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>
                {isChecking 
                  ? 'Scanning Supabase tables...' 
                  : allTablesExist 
                    ? 'All 6 Tables Ready in Supabase' 
                    : 'Tables not yet created in Supabase'}
              </span>
            </div>

            <div className="px-3 py-1 rounded-pill bg-canvas-night-elevated text-on-primary border border-white/10 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-aloe-10" />
              <span>Active Mode: <strong>{isUsingLiveData ? 'Live Supabase API' : 'Local Mock Data'}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-hairline-light bg-canvas-cream px-6 py-2 gap-2 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-pill transition-all font-medium flex items-center gap-2 ${
              activeTab === 'flow' 
                ? 'bg-primary text-on-primary' 
                : 'text-shade-60 hover:text-ink'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            1. Integration Flow & Overview
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-pill transition-all font-medium flex items-center gap-2 ${
              activeTab === 'tables' 
                ? 'bg-primary text-on-primary' 
                : 'text-shade-60 hover:text-ink'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            2. Table Creation Status
          </button>
          <button
            onClick={() => setActiveTab('populate')}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-pill transition-all font-medium flex items-center gap-2 ${
              activeTab === 'populate' 
                ? 'bg-primary text-on-primary' 
                : 'text-shade-60 hover:text-ink'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            3. Data Population (Seeder)
          </button>
        </div>

        {/* Tab Contents (Scrollable body) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: INTEGRATION FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="bg-canvas-cream p-5 rounded-xl border border-hairline-light space-y-3">
                <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-aloe-10" />
                  Complete Integration Flow Overview
                </h3>
                <p className="text-sm text-shade-60 leading-relaxed">
                  The diagram below illustrates the end-to-end data lifecycle from SQL table creation in Supabase to live population and UI rendering.
                </p>

                {/* Step cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-canvas-light border border-hairline-light space-y-2">
                    <div className="w-7 h-7 rounded-pill bg-canvas-night text-on-primary text-xs font-bold flex items-center justify-center">
                      1
                    </div>
                    <h4 className="text-sm font-semibold text-ink">Table Creation</h4>
                    <p className="text-xs text-shade-60 leading-normal">
                      PostgreSQL DDL script creates the 6 relational tables (<code className="text-xs">categories</code>, <code className="text-xs">commodities</code>, <code className="text-xs">store_prices</code>, etc.) in Supabase.
                    </p>
                    <button
                      onClick={() => setActiveTab('tables')}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1 pt-1"
                    >
                      Check tables status →
                    </button>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-canvas-light border border-hairline-light space-y-2">
                    <div className="w-7 h-7 rounded-pill bg-aloe-10 text-ink text-xs font-bold flex items-center justify-center">
                      2
                    </div>
                    <h4 className="text-sm font-semibold text-ink">Data Population</h4>
                    <p className="text-xs text-shade-60 leading-normal">
                      Click the <strong>"Populate Sample Data"</strong> button to insert 9 categories, 6 Calbayog markets, commodities, and store prices into Supabase.
                    </p>
                    <button
                      onClick={() => setActiveTab('populate')}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1 pt-1"
                    >
                      Go to Seeder button →
                    </button>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl bg-canvas-light border border-hairline-light space-y-2">
                    <div className="w-7 h-7 rounded-pill bg-shade-30 text-ink text-xs font-bold flex items-center justify-center">
                      3
                    </div>
                    <h4 className="text-sm font-semibold text-ink">Live UI Sync</h4>
                    <p className="text-xs text-shade-60 leading-normal">
                      The application switches from mock fallback to live Supabase REST API queries. Citizen submissions via <code className="text-xs">ReportPriceModal</code> sync in real-time.
                    </p>
                    <div className="pt-1">
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-pill">
                        Reactive updates active
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Data Source Switcher Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-canvas-light rounded-xl border border-hairline-light gap-4 shadow-sm">
                <div>
                  <h4 className="text-sm font-medium text-ink">Active Data Source Mode</h4>
                  <p className="text-xs text-shade-60">
                    Switch between live Supabase queries and local mock data for testing.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PillButton
                    variant={isUsingLiveData ? 'primary' : 'outline-light'}
                    size="sm"
                    onClick={() => {
                      onToggleDataSource(!isUsingLiveData);
                      onRefreshLiveData();
                    }}
                  >
                    {isUsingLiveData ? '● Using Live Supabase' : '○ Using Local Mock'}
                  </PillButton>
                  <PillButton
                    variant="outline-light"
                    size="sm"
                    onClick={onRefreshLiveData}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Refresh
                  </PillButton>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TABLE CREATION STATUS */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-ink">Supabase Table Verification</h3>
                  <p className="text-xs text-shade-60">
                    Scans the Supabase database schema to verify that the required relational tables exist.
                  </p>
                </div>
                <PillButton
                  variant="primary"
                  size="sm"
                  onClick={checkTables}
                  disabled={isChecking}
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
                  {isChecking ? 'Scanning...' : 'Scan / Verify Tables'}
                </PillButton>
              </div>

              {/* Table Status List */}
              <div className="border border-hairline-light rounded-xl overflow-hidden bg-canvas-light">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-canvas-cream text-shade-60 font-mono uppercase text-[11px] border-b border-hairline-light">
                    <tr>
                      <th className="py-3 px-4 font-medium">Table Name</th>
                      <th className="py-3 px-4 font-medium">Status in Supabase</th>
                      <th className="py-3 px-4 font-medium">Row Count</th>
                      <th className="py-3 px-4 font-medium">Mapped Website Feature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light">
                    {tableStatuses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-shade-50">
                          Click "Scan / Verify Tables" to inspect Supabase schema.
                        </td>
                      </tr>
                    ) : (
                      tableStatuses.map((t) => (
                        <tr key={t.name} className="hover:bg-canvas-cream/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-ink">
                            {t.name}
                          </td>
                          <td className="py-3 px-4">
                            {t.exists ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-pill border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Created & Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-pill border border-amber-200">
                                <XCircle className="w-3.5 h-3.5" />
                                {t.errorMessage || 'Not created yet'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-shade-700">
                            {t.exists ? `${t.rowCount} rows` : '—'}
                          </td>
                          <td className="py-3 px-4 text-xs text-shade-60">
                            {t.name === 'categories' && 'CategoriesView & Category Filters'}
                            {t.name === 'market_locations' && 'LocationsView & Market Directory'}
                            {t.name === 'commodities' && 'CatalogView & Search Bar'}
                            {t.name === 'store_prices' && 'CompareView & Basket Calculator'}
                            {t.name === 'price_history' && 'TrendsView (30-Day SVG Charts)'}
                            {t.name === 'citizen_price_reports' && 'ReportPriceModal Submissions'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Instructions if tables are missing */}
              {!allTablesExist && (
                <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900">
                        How Table Creation Happens in Supabase
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Supabase REST clients cannot execute DDL commands (<code className="text-[11px] bg-amber-100 px-1 py-0.5 rounded">CREATE TABLE</code>) directly over the anonymous API for security reasons. Table creation is performed by executing the SQL schema script in your Supabase project's SQL Editor.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href="https://supabase.com/dashboard/project/dsmxzovrvclvxyxkbpxx/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-canvas-night text-on-primary text-xs font-medium hover:bg-shade-70 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-aloe-10" />
                      Open Supabase SQL Editor
                    </a>

                    <button
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-canvas-light text-ink border border-hairline-light text-xs font-medium hover:bg-canvas-cream transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-shade-60" />
                      {copiedSql ? 'Notice Copied!' : 'Copy SQL Instructions'}
                    </button>

                    <button
                      onClick={checkTables}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-aloe-10 text-ink text-xs font-medium hover:bg-emerald-200 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Verify After Running SQL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POPULATE SAMPLE DATA */}
          {activeTab === 'populate' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-xl bg-canvas-cream border border-hairline-light space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-aloe-10" />
                      Populate Database with Sample Data
                    </h3>
                    <p className="text-xs text-shade-60 mt-1">
                      Batches and seeds the 9 categories, 6 Calbayog City markets, commodities, cross-store prices, and 30-day longitudinal price history.
                    </p>
                  </div>

                  <PillButton
                    variant="aloe"
                    size="md"
                    onClick={handleSeedDatabase}
                    disabled={isSeeding}
                  >
                    <UploadCloud className={`w-4 h-4 mr-2 ${isSeeding ? 'animate-bounce' : ''}`} />
                    {isSeeding ? 'Populating Data...' : 'Populate Sample Data to Supabase'}
                  </PillButton>
                </div>

                {/* Progress bar */}
                {isSeeding && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-shade-60 font-mono">
                      <span>Inserting data records...</span>
                      <span>{seedProgress}%</span>
                    </div>
                    <div className="w-full bg-shade-30 h-2 rounded-pill overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full transition-all duration-300"
                        style={{ width: `${seedProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Execution Log Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-shade-60 font-semibold">
                    Live Seeding Terminal Log
                  </span>
                  {seedLog.length > 0 && (
                    <button
                      onClick={() => setSeedLog([])}
                      className="text-[11px] text-shade-50 hover:text-ink"
                    >
                      Clear Log
                    </button>
                  )}
                </div>

                <div className="bg-canvas-night text-on-primary font-mono text-xs p-4 rounded-xl h-56 overflow-y-auto space-y-1.5 border border-hairline-dark">
                  {seedLog.length === 0 ? (
                    <p className="text-shade-50 italic">
                      Ready. Click "Populate Sample Data to Supabase" above to begin seeding data.
                    </p>
                  ) : (
                    seedLog.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={
                          log.includes('[Error]') 
                            ? 'text-red-400' 
                            : log.includes('[Done]') || log.includes('Successfully')
                              ? 'text-aloe-10 font-bold'
                              : 'text-link-cool-2'
                        }
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Items to be populated summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-canvas-light rounded-xl border border-hairline-light">
                  <div className="text-xl font-semibold text-ink">9</div>
                  <div className="text-xs text-shade-50">Categories</div>
                </div>
                <div className="p-3 bg-canvas-light rounded-xl border border-hairline-light">
                  <div className="text-xl font-semibold text-ink">6</div>
                  <div className="text-xs text-shade-50">Market Locations</div>
                </div>
                <div className="p-3 bg-canvas-light rounded-xl border border-hairline-light">
                  <div className="text-xl font-semibold text-ink">10+</div>
                  <div className="text-xs text-shade-50">Commodities</div>
                </div>
                <div className="p-3 bg-canvas-light rounded-xl border border-hairline-light">
                  <div className="text-xl font-semibold text-ink">30-Day</div>
                  <div className="text-xs text-shade-50">Price Trajectories</div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-canvas-cream px-6 py-4 border-t border-hairline-light flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 text-xs text-shade-60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Supabase Endpoint: <code className="text-[11px] text-ink">{SUPABASE_URL}</code></span>
          </div>
          <PillButton variant="outline-light" size="sm" onClick={onClose}>
            Close Manager
          </PillButton>
        </div>

      </div>
    </div>
  );
};

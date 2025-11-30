import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Clock, 
  Activity, 
  DollarSign, 
  BarChart3,
  Globe,
  Newspaper,
  AlertCircle,
  Search
} from 'lucide-react';

import { SearchBar } from './components/SearchBar';
import { MarketChart } from './components/MarketChart';
import { StatCard } from './components/StatCard';
import { StockWatchlist } from './components/StockWatchlist';
import { getMarketData } from './services/geminiService';
import { AppState, LoadingState, StockData } from './types';

// Initial state or placeholders
const INITIAL_SYMBOL = 'TATAMOTORS';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: LoadingState.IDLE,
    data: null,
    error: null,
  });

  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchData = useCallback(async (symbol: string) => {
    setState(prev => ({ ...prev, status: LoadingState.LOADING, error: null }));
    try {
      const data = await getMarketData(symbol);
      setState({
        status: LoadingState.SUCCESS,
        data,
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: LoadingState.ERROR,
        error: err.message || "An unexpected error occurred",
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(INITIAL_SYMBOL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh logic (simulated real-time)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && state.data) {
      interval = setInterval(() => {
        fetchData(state.data!.symbol);
      }, 60000); // Update every minute to respect quotas while looking "live"
    }
    return () => clearInterval(interval);
  }, [autoRefresh, state.data, fetchData]);

  const handleRefresh = () => {
    if (state.data) {
      fetchData(state.data.symbol);
    }
  };

  const isPositive = state.data ? state.data.change >= 0 : true;
  const priceColor = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 vs rose-500

  return (
    <div className="min-h-screen w-full bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              GeminiMarket Live
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              AI-Powered Real-Time Market Intelligence
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
               <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
               <label className="text-xs text-slate-400 font-medium cursor-pointer select-none">
                 <input 
                  type="checkbox" 
                  checked={autoRefresh} 
                  onChange={(e) => setAutoRefresh(e.target.checked)} 
                  className="hidden" 
                 />
                 {autoRefresh ? 'Live Updates On' : 'Live Updates Off'}
               </label>
             </div>
             {state.data && (
                <button 
                  onClick={handleRefresh}
                  disabled={state.status === LoadingState.LOADING}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                  title="Refresh Now"
                >
                  <RefreshCw className={`w-4 h-4 ${state.status === LoadingState.LOADING ? 'animate-spin' : ''}`} />
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Search */}
            <SearchBar onSearch={fetchData} isLoading={state.status === LoadingState.LOADING} />

            {/* Error State */}
            {state.status === LoadingState.ERROR && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3 mb-8">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Dashboard Content */}
            {state.data && (
              <div className={`transition-opacity duration-500 ${state.status === LoadingState.LOADING ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Top Row: Price & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  
                  {/* Main Price Card */}
                  <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-500/5">
                    <div>
                      <div className="flex items-center justify-between">
                         <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold tracking-wider">{state.data.symbol}</span>
                         <span className="text-slate-500 text-xs">{state.data.currency}</span>
                      </div>
                      <div className="text-slate-400 text-sm font-medium mt-2">{state.data.companyName}</div>
                      
                      <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-5xl font-bold tracking-tight text-white">
                          {state.data.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className={`flex items-center gap-2 mt-2 font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="text-lg">
                          {isPositive ? '+' : ''}{state.data.change.toFixed(2)} ({state.data.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Last Updated</span>
                      </div>
                      <div className="text-slate-200 text-sm font-mono">{state.data.lastUpdated}</div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-indigo-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-100 font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        Intraday Movement
                      </h3>
                      <div className="flex gap-2">
                         <span className="text-xs text-slate-500">1D</span>
                      </div>
                    </div>
                    <MarketChart data={state.data.chartData} color={priceColor} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard label="Market Cap" value={state.data.marketCap} icon={<Globe className="w-4 h-4" />} />
                  <StatCard label="Volume" value={state.data.volume} icon={<BarChart3 className="w-4 h-4" />} />
                  <StatCard label="Open" value={state.data.open.toFixed(2)} icon={<DollarSign className="w-4 h-4" />} />
                  <StatCard 
                    label="Day Range" 
                    value={`${state.data.low.toFixed(2)} - ${state.data.high.toFixed(2)}`} 
                    icon={<Activity className="w-4 h-4" />} 
                  />
                </div>

                {/* Bottom Row: Analysis & News */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* AI Analysis */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
                       <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                       AI Market Analysis
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                      {state.data.analysis}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded">Grounding: Google Search</span>
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs rounded">Model: Gemini 2.5 Flash</span>
                    </div>
                  </div>

                  {/* News Feed */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                     <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
                       <Newspaper className="w-5 h-5 text-slate-400" />
                       Relevant News
                    </h3>
                    <div className="space-y-4">
                      {state.data.news.map((item, idx) => (
                        <div key={idx} className="group cursor-pointer">
                          <div className="flex justify-between items-start">
                            <h4 className="text-slate-200 text-sm font-medium group-hover:text-indigo-400 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{item.timeAgo}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{item.source}</div>
                        </div>
                      ))}
                      {state.data.news.length === 0 && (
                        <div className="text-slate-500 text-sm italic">No recent news found.</div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {!state.data && state.status !== LoadingState.LOADING && state.status !== LoadingState.ERROR && (
               <div className="text-center mt-20">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                 </div>
                 <h3 className="text-slate-300 font-medium">Search for a stock to begin</h3>
               </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2 w-full">
            <StockWatchlist 
              onSelect={fetchData} 
              currentSymbol={state.data?.symbol}
              isLoading={state.status === LoadingState.LOADING}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default App;

import React from 'react';
import { TrendingUp, ArrowRight, Globe } from 'lucide-react';

interface StockWatchlistProps {
  onSelect: (symbol: string) => void;
  currentSymbol?: string;
  isLoading?: boolean;
}

const MARKET_MOVERS = [
  // Indian Stocks (NSE)
  { symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', type: 'NSE' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Svcs', type: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'NSE' },
  // US Stocks (NASDAQ/NYSE)
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'NASDAQ' },
];

export const StockWatchlist: React.FC<StockWatchlistProps> = ({ onSelect, currentSymbol, isLoading }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-indigo-500/5 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <span>Market Watch</span>
        </h3>
        <Globe className="w-4 h-4 text-slate-500" />
      </div>
      
      <div className="space-y-3">
        {MARKET_MOVERS.map((stock) => {
          // Normalize for comparison
          const isActive = currentSymbol?.toUpperCase() === stock.symbol;
          
          return (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              disabled={isLoading || isActive}
              className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-200 border text-left ${
                isActive
                  ? 'bg-indigo-600/10 border-indigo-500/50 cursor-default'
                  : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isActive ? 'text-indigo-400' : 'text-slate-200'}`}>
                    {stock.symbol}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">
                    {stock.type}
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors truncate pr-2">
                  {stock.name}
                </span>
              </div>
              
              {!isActive && (
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

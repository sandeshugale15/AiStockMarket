import React, { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  }, [input, onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
        <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 shadow-xl">
          <Search className="ml-4 text-slate-400 w-5 h-5" />
          <input
            type="text"
            className="w-full bg-transparent text-slate-100 px-4 py-3 focus:outline-none placeholder-slate-500 font-medium"
            placeholder="Search ticker (e.g. AAPL, TSLA, NVDA)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mr-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
          </button>
        </div>
      </div>
    </form>
  );
};
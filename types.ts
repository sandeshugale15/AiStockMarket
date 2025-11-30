export interface ChartPoint {
  time: string;
  price: number;
}

export interface NewsItem {
  title: string;
  source: string;
  url?: string;
  timeAgo?: string;
}

export interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  high: number;
  low: number;
  open: number;
  analysis: string;
  chartData: ChartPoint[];
  news: NewsItem[];
  lastUpdated: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AppState {
  status: LoadingState;
  data: StockData | null;
  error: string | null;
}
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartPoint } from '../types';

interface MarketChartProps {
  data: ChartPoint[];
  color: string;
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, color }) => {
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const buffer = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-[300px] w-full mt-4 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[minPrice - buffer, maxPrice + buffer]} 
            stroke="#64748b" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val.toFixed(2)}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <ReferenceLine y={data[0]?.price} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Open', position: 'right', fill: '#94a3b8', fontSize: 10 }} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
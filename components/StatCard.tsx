import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
      <div>
        <div className="text-lg font-bold text-slate-100">{value}</div>
        {subValue && <div className="text-xs text-slate-500 mt-1">{subValue}</div>}
      </div>
    </div>
  );
};
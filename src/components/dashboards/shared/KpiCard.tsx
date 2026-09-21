import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'slate';
  change?: {
    value: number | string;
    isPositive?: boolean;
    periodText?: string;
  };
  sparklineData?: number[];
  onClick?: () => void;
  badgeText?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-200/80',
    text: 'text-blue-700',
    iconBg: 'bg-blue-600 text-white',
    sparkColor: '#2563eb',
    accent: 'hover:border-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200/80',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-600 text-white',
    sparkColor: '#059669',
    accent: 'hover:border-emerald-400',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-200/80',
    text: 'text-purple-700',
    iconBg: 'bg-purple-600 text-white',
    sparkColor: '#7c3aed',
    accent: 'hover:border-purple-400',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-200/80',
    text: 'text-amber-800',
    iconBg: 'bg-amber-500 text-white',
    sparkColor: '#d97706',
    accent: 'hover:border-amber-400',
  },
  rose: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-200/80',
    text: 'text-rose-700',
    iconBg: 'bg-rose-600 text-white',
    sparkColor: '#e11d48',
    accent: 'hover:border-rose-400',
  },
  indigo: {
    bg: 'bg-indigo-50/70',
    border: 'border-indigo-200/80',
    text: 'text-indigo-700',
    iconBg: 'bg-indigo-600 text-white',
    sparkColor: '#4f46e5',
    accent: 'hover:border-indigo-400',
  },
  cyan: {
    bg: 'bg-cyan-50/70',
    border: 'border-cyan-200/80',
    text: 'text-cyan-800',
    iconBg: 'bg-cyan-600 text-white',
    sparkColor: '#0891b2',
    accent: 'hover:border-cyan-400',
  },
  slate: {
    bg: 'bg-slate-50/80',
    border: 'border-slate-200',
    text: 'text-slate-700',
    iconBg: 'bg-slate-700 text-white',
    sparkColor: '#475569',
    accent: 'hover:border-slate-400',
  },
};

export default function KpiCard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'blue',
  change,
  sparklineData,
  onClick,
  badgeText,
}: KpiCardProps) {
  const theme = colorMap[colorScheme] || colorMap.blue;

  // Render a minimal SVG sparkline
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 64;
    const height = 24;
    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg
        className="w-16 h-6 overflow-visible opacity-80"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={theme.sparkColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      id={id}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`bg-white rounded-xl border ${theme.border} p-4 transition-all duration-200 shadow-xs flex flex-col justify-between relative group ${
        onClick ? `cursor-pointer ${theme.accent} hover:shadow-md hover:-translate-y-0.5` : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              {title}
            </span>
            {badgeText && (
              <span className="text-[10px] px-1.5 py-0.5 font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">
                {badgeText}
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-baseline gap-2">
            <span>{value}</span>
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${theme.iconBg}`}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          {change ? (
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                change.isPositive === undefined
                  ? 'bg-slate-100 text-slate-700'
                  : change.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {change.isPositive === undefined ? (
                <Minus className="w-3 h-3 mr-0.5" />
              ) : change.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5 text-rose-600" />
              )}
              {change.value}
            </span>
          ) : null}
          <span className="text-slate-400 text-[11px] truncate">
            {change?.periodText || subtitle || 'Real-time sync'}
          </span>
        </div>

        {renderSparkline()}
      </div>
    </div>
  );
}

import React, { ReactNode } from 'react';
import { Download, RefreshCw, Maximize2, MoreVertical, LucideIcon } from 'lucide-react';

interface ChartCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  footerContent?: ReactNode;
  onExportCSV?: () => void;
  onRefresh?: () => void;
  className?: string;
  minHeight?: string;
}

export default function ChartCard({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  headerActions,
  children,
  footerContent,
  onExportCSV,
  onRefresh,
  className = '',
  minHeight = 'min-h-[300px]',
}: ChartCardProps) {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden transition-all hover:border-slate-300 ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {headerActions}
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              title="Export chart data as CSV"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh dataset"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Body */}
      <div className={`p-4 flex-1 flex flex-col justify-center ${minHeight}`}>
        {children}
      </div>

      {/* Optional Footer Details */}
      {footerContent && (
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600">
          {footerContent}
        </div>
      )}
    </div>
  );
}

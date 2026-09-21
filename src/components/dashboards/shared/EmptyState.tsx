import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  compact?: boolean;
}

export default function EmptyState({
  id,
  icon: Icon = Inbox,
  title = 'No data available yet',
  description = 'There are currently no records matching the selected parameters or date range.',
  actionText,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-300/80 bg-slate-50/50 ${
        compact ? 'p-6' : 'p-10'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
        <Icon className="w-6 h-6 text-slate-500" aria-hidden="true" />
      </div>
      <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Download,
  Printer,
  ChevronDown,
  X,
  SlidersHorizontal,
  Building,
  GraduationCap,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CampusBranch, AcademicSession, ClassInfo } from '../../../types';

export type DatePreset =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'This Month'
  | 'This Term'
  | 'This Academic Year'
  | 'Last Month'
  | 'Custom Range';

export interface GlobalFilterState {
  datePreset: DatePreset;
  startDate?: string;
  endDate?: string;
  academicYear: string;
  term: string;
  campus: string;
  department: string;
  className: string;
  section: string;
  paymentStatus: string;
  searchQuery: string;
}

interface DashboardHeaderProps {
  id?: string;
  title: string;
  subtitle: string;
  roleBadgeText: string;
  roleBadgeColor?: string;
  campuses?: CampusBranch[];
  classes?: ClassInfo[];
  sessions?: AcademicSession[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters?: () => void;
  onRefresh?: () => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
  isSyncing?: boolean;
  lastSyncTime?: string;
  showClassFilter?: boolean;
  showPaymentStatusFilter?: boolean;
  showDepartmentFilter?: boolean;
  showTermFilter?: boolean;
  extraActions?: React.ReactNode;
}

export default function DashboardHeader({
  id = 'dashboard-header',
  title,
  subtitle,
  roleBadgeText,
  roleBadgeColor = 'bg-blue-600 text-white',
  campuses = [],
  classes = [],
  sessions = [],
  filters,
  onFilterChange,
  onResetFilters,
  onRefresh,
  onExportCSV,
  onPrint,
  isSyncing = false,
  lastSyncTime = 'Just now',
  showClassFilter = true,
  showPaymentStatusFilter = false,
  showDepartmentFilter = false,
  showTermFilter = true,
  extraActions,
}: DashboardHeaderProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const datePresets: DatePreset[] = [
    'Today',
    'Yesterday',
    'This Week',
    'This Month',
    'This Term',
    'This Academic Year',
    'Last Month',
    'Custom Range',
  ];

  const terms = ['All Terms', 'Term 1 / First Term', 'Term 2 / Mid Term', 'Term 3 / Final Term'];
  const departments = ['All Departments', 'Academics', 'Science & Tech', 'Humanities', 'Sports & Arts', 'Administration'];
  const paymentStatuses = ['All Statuses', 'Paid', 'Unpaid', 'Partial', 'Overdue'];

  // Check active filter count
  const activeFiltersCount =
    (filters.datePreset !== 'This Academic Year' ? 1 : 0) +
    (filters.campus !== 'all' && filters.campus ? 1 : 0) +
    (filters.className !== 'all' && filters.className ? 1 : 0) +
    (filters.section !== 'all' && filters.section ? 1 : 0) +
    (filters.term !== 'all' && filters.term ? 1 : 0) +
    (filters.department !== 'all' && filters.department ? 1 : 0) +
    (filters.paymentStatus !== 'all' && filters.paymentStatus ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div id={id} className="space-y-3">
      {/* Top Banner / Welcome Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-2xs ${roleBadgeColor}`}>
              {roleBadgeText}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Engine Live</span>
            </div>
            <span className="text-xs text-slate-400">• Synced {lastSyncTime}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {extraActions}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isSyncing}
              title="Synchronize database metrics"
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              title="Export filtered dataset to CSV"
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              title="Print current report"
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowFilterDrawer((prev) => !prev)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              activeFiltersCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Quick Filter Ribbon (Always Visible) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Range:
          </span>
          {datePresets.map((preset) => {
            const isSelected = filters.datePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onFilterChange({ datePreset: preset })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Global Live Search Bar */}
        <div className="relative min-w-[220px] max-w-xs shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records, students, classes..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Custom Filter Drawer */}
      {(showFilterDrawer || filters.datePreset === 'Custom Range') && (
        <div className="bg-white rounded-xl border border-blue-100 shadow-xs p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Custom Date Range Pickers if selected */}
          {filters.datePreset === 'Custom Range' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => onFilterChange({ startDate: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => onFilterChange({ endDate: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {/* Academic Session / Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Academic Session
            </label>
            <select
              value={filters.academicYear}
              onChange={(e) => onFilterChange({ academicYear: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="2024-2025">2024-2025 (Current)</option>
              <option value="2023-2024">2023-2024 (Archived)</option>
              <option value="2025-2026">2025-2026 (Upcoming)</option>
            </select>
          </div>

          {/* Campus Selector */}
          {campuses.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Campus / Branch
              </label>
              <select
                value={filters.campus}
                onChange={(e) => onFilterChange({ campus: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Campuses (Consolidated)</option>
                {campuses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Term / Semester */}
          {showTermFilter && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Term / Semester
              </label>
              <select
                value={filters.term}
                onChange={(e) => onFilterChange({ term: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {terms.map((t) => (
                  <option key={t} value={t === 'All Terms' ? 'all' : t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Class / Grade Filter */}
          {showClassFilter && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Grade / Class
              </label>
              <select
                value={filters.className}
                onChange={(e) => onFilterChange({ className: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Status Filter */}
          {showPaymentStatusFilter && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {paymentStatuses.map((s) => (
                  <option key={s} value={s === 'All Statuses' ? 'all' : s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department Filter */}
          {showDepartmentFilter && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange({ department: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d === 'All Departments' ? 'all' : d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Action */}
          {onResetFilters && activeFiltersCount > 0 && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

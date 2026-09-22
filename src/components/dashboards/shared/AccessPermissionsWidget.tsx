import React, { useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  ArrowRight,
  User,
  Building,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ActiveNavTab, UserRole } from '../../../types';
import { calculatePermissionSummary, getRoleScope } from '../../../services/rbacService';
import { authService } from '../../../services/authService';

interface AccessPermissionsWidgetProps {
  role: UserRole;
  onNavigate?: (tab: ActiveNavTab) => void;
  className?: string;
  compact?: boolean;
}

export default function AccessPermissionsWidget({
  role,
  onNavigate,
  className = '',
  compact = false,
}: AccessPermissionsWidgetProps) {
  const activeSession = authService.getActiveSession();
  const userAccount = activeSession ? authService.findAccount(activeSession.user.email) : null;

  const summary = useMemo(() => {
    return calculatePermissionSummary(role, userAccount);
  }, [role, userAccount]);

  const scopeInfo = useMemo(() => {
    return getRoleScope(role);
  }, [role]);

  // Color theme per role
  const roleTheme = useMemo(() => {
    switch (role) {
      case 'super_admin':
        return {
          bg: 'bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent',
          border: 'border-purple-200 dark:border-purple-900/50',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
          iconBg: 'bg-purple-600 text-white',
          accentText: 'text-purple-700 dark:text-purple-300',
        };
      case 'campus_admin':
        return {
          bg: 'bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent',
          border: 'border-indigo-200 dark:border-indigo-900/50',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300',
          iconBg: 'bg-indigo-600 text-white',
          accentText: 'text-indigo-700 dark:text-indigo-300',
        };
      case 'teacher':
        return {
          bg: 'bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-transparent',
          border: 'border-blue-200 dark:border-blue-900/50',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
          iconBg: 'bg-blue-600 text-white',
          accentText: 'text-blue-700 dark:text-blue-300',
        };
      case 'accountant':
        return {
          bg: 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent',
          border: 'border-amber-200 dark:border-amber-900/50',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
          iconBg: 'bg-amber-600 text-white',
          accentText: 'text-amber-700 dark:text-amber-300',
        };
      case 'parent':
        return {
          bg: 'bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent',
          border: 'border-sky-200 dark:border-sky-900/50',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300',
          iconBg: 'bg-sky-600 text-white',
          accentText: 'text-sky-700 dark:text-sky-300',
        };
      case 'student':
      default:
        return {
          bg: 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent',
          border: 'border-emerald-200 dark:border-emerald-900/50',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-700 dark:text-emerald-300',
        };
    }
  }, [role]);

  return (
    <div
      id="access-permissions-widget"
      className={`rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all overflow-hidden ${roleTheme.border} ${className}`}
    >
      {/* Widget Header */}
      <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800 ${roleTheme.bg} flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl shadow-sm ${roleTheme.iconBg}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Access & Permissions
              </h3>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${roleTheme.badge}`}>
                {summary.roleDisplayName}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1.5">
              <span>Status:</span>
              <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                {summary.accountStatus}
              </span>
              <span>•</span>
              <span>Scope: <strong className="text-slate-700 dark:text-slate-200 font-medium">{scopeInfo.scope}</strong></span>
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('permissions_access')}
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60"
            title="View full granular permission matrix"
          >
            <span>Full Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dynamic Summary Metric Counters */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Granted</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {summary.totalGranted}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Actions Allowed</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Read-Only</span>
              <Eye className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {summary.readOnlyCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">View Catalogs</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Restricted</span>
              <Lock className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {summary.totalRestricted}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Security Locked</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Modules</span>
              <Layers className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {summary.allowedModulesCount} <span className="text-xs font-normal text-slate-400">/ 11</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active Suites</p>
          </div>
        </div>

        {/* Scope Notice Banner */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 mb-4 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Security Scope: {summary.scopeLabel}
            </span>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {summary.scopeDescription}
            </p>
          </div>
        </div>

        {/* Key Capabilities Checklist */}
        {!compact && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Key Role Capabilities
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {summary.keyCapabilities.slice(0, 6).map((cap, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${
                    cap.granted
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="truncate pr-2">{cap.label}</span>
                  {cap.granted ? (
                    <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Allowed
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-slate-400 dark:text-slate-500 flex-shrink-0">
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      Locked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        {onNavigate && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Authoritative Default-Deny Security Engine</span>
            </div>
            <button
              onClick={() => onNavigate('permissions_access')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group"
            >
              <span>View All Permissions & Scopes</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

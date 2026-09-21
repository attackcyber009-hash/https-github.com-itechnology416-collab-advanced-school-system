import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { ActiveNavTab, UserRole } from '../types';
import { getDefaultTabForRole } from '../services/rbacService';

interface AccessDeniedViewProps {
  userRole: UserRole;
  attemptedTab: ActiveNavTab;
  onNavigateHome: (tab: ActiveNavTab) => void;
}

export default function AccessDeniedView({
  userRole,
  attemptedTab,
  onNavigateHome,
}: AccessDeniedViewProps) {
  const defaultTab = getDefaultTabForRole(userRole);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl border border-red-200 overflow-hidden text-center">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 shadow-inner">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider">403 Forbidden Access</h2>
          <p className="text-xs text-red-100 mt-1 font-medium">
            Strict Role-Based Access Control (RBAC) Enforcement
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Privilege Boundary Violation:</span> Your current role (
              <span className="font-mono font-bold text-red-700 uppercase bg-red-100 px-1.5 py-0.5 rounded">
                {userRole.replace('_', ' ')}
              </span>
              ) is not authorized to view or execute module{' '}
              <code className="bg-amber-100 font-mono text-slate-800 px-1 py-0.5 rounded font-bold">
                {attemptedTab}
              </code>
              .
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This security boundary is enforced at both the client routing and server API layers to
            protect institutional integrity and prevent unauthorized administrative modifications.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateHome(defaultTab)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Authorized {userRole.replace('_', ' ').toUpperCase()} Portal</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Security Incident Logged: RBAC_403_ATTEMPT_CAPTURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

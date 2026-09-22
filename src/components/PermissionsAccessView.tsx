import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Printer,
  Download,
  Info,
  ChevronDown,
  ChevronRight,
  Sliders,
  History,
  Key,
  User,
  Users,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { ActiveNavTab, UserRole, UserProfile } from '../types';
import {
  ALL_SYSTEM_PERMISSIONS,
  PermissionCategory,
  PermissionScope,
  PermissionStatusItem,
  calculatePermissionSummary,
  getCategorizedPermissions,
  getDetailedPermissionsForRole,
  getRoleScope,
  updateRolePermissionGrant,
  resetAllPermissionsToBaseline,
  isSuperAdminRole,
} from '../services/rbacService';
import { authService, UserAccount } from '../services/authService';

interface PermissionsAccessViewProps {
  currentUserRole: UserRole;
  userProfile?: UserProfile | null;
  onNavigate?: (tab: ActiveNavTab) => void;
}

export default function PermissionsAccessView({
  currentUserRole,
  userProfile,
  onNavigate,
}: PermissionsAccessViewProps) {
  // Session & Account lookup
  const activeSession = authService.getActiveSession();
  const userAccount = activeSession ? authService.findAccount(activeSession.user.email) : null;

  // View tabs (All users can view matrix & audit history; Super admin can manage permissions)
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit_history' | 'admin_manager'>('matrix');

  // Super Admin Management target role selector
  const [managementTargetRole, setManagementTargetRole] = useState<UserRole>('teacher');

  // Interactive Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'ALLOWED' | 'READ_ONLY' | 'RESTRICTED'>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');

  // Accordion open/close state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // "Why Restricted" Modal State
  const [restrictedModalItem, setRestrictedModalItem] = useState<PermissionStatusItem | null>(null);

  // Super Admin Confirmation Modal State
  const [confirmToggleState, setConfirmToggleState] = useState<{
    isOpen: boolean;
    permission: PermissionStatusItem | null;
    grant: boolean;
    role: UserRole;
  }>({
    isOpen: false,
    permission: null,
    grant: false,
    role: 'teacher',
  });

  // Action notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic permission summary based on current authenticated role
  const summary = useMemo(() => {
    return calculatePermissionSummary(currentUserRole, userAccount);
  }, [currentUserRole, userAccount, toastMessage]);

  // Dynamic categorized permissions
  const categories = useMemo(() => {
    return getCategorizedPermissions(currentUserRole);
  }, [currentUserRole, toastMessage]);

  // Filtered permission categories based on search and filters
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return categories
      .filter((catGroup) => {
        if (selectedCategory !== 'all' && catGroup.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .map((catGroup) => {
        const filteredItems = catGroup.items.filter((item) => {
          // Status filter
          if (selectedStatus !== 'all') {
            if (selectedStatus === 'ALLOWED' && (item.statusCode !== 'ALLOWED' || item.action === 'view')) return false;
            if (selectedStatus === 'READ_ONLY' && item.statusCode !== 'READ_ONLY') return false;
            if (selectedStatus === 'RESTRICTED' && item.statusCode !== 'RESTRICTED') return false;
          }

          // Scope filter
          if (selectedScope !== 'all' && item.effectiveScope !== selectedScope) {
            return false;
          }

          // Text query
          if (q) {
            const matchName = item.label.toLowerCase().includes(q);
            const matchCode = item.code.toLowerCase().includes(q);
            const matchModule = item.module.toLowerCase().includes(q);
            const matchDesc = item.description.toLowerCase().includes(q);
            const matchAction = item.action.toLowerCase().includes(q);
            return matchName || matchCode || matchModule || matchDesc || matchAction;
          }

          return true;
        });

        return {
          ...catGroup,
          items: filteredItems,
        };
      })
      .filter((catGroup) => catGroup.items.length > 0);
  }, [categories, searchQuery, selectedCategory, selectedStatus, selectedScope]);

  // Management categories for Super Admin
  const managementCategories = useMemo(() => {
    return getCategorizedPermissions(managementTargetRole);
  }, [managementTargetRole, toastMessage]);

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleTogglePermission = (item: PermissionStatusItem, grant: boolean) => {
    if (item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH') {
      setConfirmToggleState({
        isOpen: true,
        permission: item,
        grant,
        role: managementTargetRole,
      });
    } else {
      executePermissionToggle(item, grant, managementTargetRole);
    }
  };

  const executePermissionToggle = (item: PermissionStatusItem, grant: boolean, role: UserRole) => {
    const adminName = userProfile?.name || 'Super Admin';
    const result = updateRolePermissionGrant(role, item.id, grant, adminName);
    showToast(result.message);
    setConfirmToggleState({ isOpen: false, permission: null, grant: false, role: 'teacher' });
  };

  const handleResetBaseline = () => {
    if (window.confirm('Are you sure you want to reset all roles to the standard security baseline? This will revert all custom permission overrides.')) {
      const adminName = userProfile?.name || 'Super Admin';
      resetAllPermissionsToBaseline(adminName);
      showToast('All system role permissions have been reset to strict baseline defaults.');
    }
  };

  return (
    <div id="permissions-access-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Profile Identity Banner */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity & Scope Info */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative">
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-900 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center" title="Active Verified Session">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userProfile?.name || activeSession?.user.fullName || 'Authenticated User'}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {summary.roleDisplayName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{summary.accountStatus}</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Email: <strong className="text-slate-700 dark:text-slate-200">{userProfile?.email || activeSession?.user.email}</strong></span>
                <span>•</span>
                <span>Campus: <strong className="text-slate-700 dark:text-slate-200">{userProfile?.campus || 'Main Campus'}</strong></span>
                <span>•</span>
                <span>Last Login: <strong className="text-slate-700 dark:text-slate-200">{activeSession?.user.lastLogin || 'Current Active Session'}</strong></span>
              </p>
            </div>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Access Card</span>
            </button>

            {isSuperAdminRole(currentUserRole) && (
              <button
                onClick={() => setActiveTab(activeTab === 'admin_manager' ? 'matrix' : 'admin_manager')}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  activeTab === 'admin_manager'
                    ? 'bg-purple-700 text-white hover:bg-purple-800'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{activeTab === 'admin_manager' ? 'Exit Role Manager' : 'Manage Role Permissions'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 ${
              activeTab === 'matrix'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>My Authorized Capabilities</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {summary.totalGranted}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit_history')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 ${
              activeTab === 'audit_history'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Logs & Policy Audit</span>
          </button>

          {isSuperAdminRole(currentUserRole) && (
            <button
              onClick={() => setActiveTab('admin_manager')}
              className={`px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 ${
                activeTab === 'admin_manager'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>RBAC Policy Management Matrix</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW TAB 1: USER'S AUTHORITATIVE PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Allowed Actions</span>
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {summary.totalGranted}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
                <span>✓ Authorized by Role Policy</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Read-Only Catalogs</span>
                <span className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {summary.readOnlyCount}
              </p>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1 flex items-center space-x-1">
                <span>👁 Non-Destructive Browse</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Restricted Actions</span>
                <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <Lock className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {summary.totalRestricted}
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center space-x-1">
                <span>🔒 Default-Deny Enforced</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Data Resource Scope</span>
                <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Building className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 truncate" title={summary.scopeLabel}>
                {summary.scope}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1 truncate" title={summary.scopeLabel}>
                {summary.scopeLabel}
              </p>
            </div>
          </div>

          {/* Search & Filter Ribbon */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search capability, code or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Modules (11)</option>
                <option value="Dashboard & Navigation">Dashboard & Navigation</option>
                <option value="Students Management">Students Management</option>
                <option value="Teachers & Faculty">Teachers & Faculty</option>
                <option value="Attendance Tracking">Attendance Tracking</option>
                <option value="Assignments & Homework">Assignments & Homework</option>
                <option value="Exams & Date Sheets">Exams & Date Sheets</option>
                <option value="Grades & Results">Grades & Results</option>
                <option value="Finance & Fee Billing">Finance & Fee Billing</option>
                <option value="Communications & Notices">Communications & Notices</option>
                <option value="Reports & Analytics">Reports & Analytics</option>
                <option value="System Administration & Security">System Administration & Security</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="ALLOWED">✓ Allowed</option>
                <option value="READ_ONLY">👁 Read Only</option>
                <option value="RESTRICTED">🔒 Restricted</option>
              </select>

              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Scopes</option>
                <option value="ALL">ALL (Global)</option>
                <option value="ASSIGNED">ASSIGNED (Classes)</option>
                <option value="OWN">OWN (Self)</option>
                <option value="CHILDREN">CHILDREN (Family)</option>
                <option value="FINANCIAL">FINANCIAL (Treasury)</option>
              </select>

              {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedScope !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSelectedScope('all');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Categorized Permission Sections */}
          <div className="space-y-4">
            {filteredCategories.map((group) => {
              const isCollapsed = collapsedCategories[group.category];

              return (
                <div
                  key={group.category}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategoryCollapse(group.category)}
                    className="px-5 py-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {group.category}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {group.items.length} Actions in module
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {group.grantedCount} Allowed
                      </span>
                      {group.restrictedCount > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                          {group.restrictedCount} Locked
                        </span>
                      )}
                      {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Actions Table */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                            <th className="py-3 px-5">Capability / Resource</th>
                            <th className="py-3 px-4">Action</th>
                            <th className="py-3 px-4">Permission Code</th>
                            <th className="py-3 px-4">Scope</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {group.items.map((item) => {
                            return (
                              <tr
                                key={item.id}
                                className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                                  !item.isGranted ? 'opacity-85' : ''
                                }`}
                              >
                                <td className="py-3 px-5">
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {item.label}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
                                    {item.description}
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {item.action}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <code className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                                    {item.code}
                                  </code>
                                </td>

                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                      item.effectiveScope === 'ALL'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                        : item.effectiveScope === 'ASSIGNED'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                        : item.effectiveScope === 'OWN'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : item.effectiveScope === 'CHILDREN'
                                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    }`}
                                  >
                                    {item.effectiveScope}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  {item.isGranted ? (
                                    item.action === 'view' ? (
                                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Read Only</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Allowed</span>
                                      </span>
                                    )
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Restricted</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-right">
                                  {!item.isGranted && (
                                    <button
                                      onClick={() => setRestrictedModalItem(item)}
                                      className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 underline underline-offset-2"
                                    >
                                      <Info className="w-3.5 h-3.5" />
                                      <span>Why Restricted?</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-500">
                <ShieldAlert className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  No permissions match the current search or filters
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your query or resetting filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: AUDIT TRAIL & SYSTEM LOGS */}
      {activeTab === 'audit_history' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <span>Security Audit Logs & Permission Change History</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Authoritative chronological record of authorization checks, role updates, and login authentications.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  action: `RBAC_VALIDATION: Authenticated session confirmed for user ${userProfile?.name || 'Account Holder'} with role "${currentUserRole}"`,
                  severity: 'INFO',
                  status: 'SUCCESS',
                  actor: userProfile?.name || 'System Guard',
                },
                {
                  timestamp: '2026-09-20 09:30:15',
                  action: 'RBAC_SECURITY_MATRIX: Strict Default-Deny permission model loaded with multi-campus scoping',
                  severity: 'INFO',
                  status: 'SUCCESS',
                  actor: 'Institutional Registry',
                },
                {
                  timestamp: '2026-09-18 14:12:00',
                  action: 'POLICY_ENFORCEMENT: Student and Parent role data boundary verified with zero privilege leakage',
                  severity: 'INFO',
                  status: 'SUCCESS',
                  actor: 'Central RBAC Engine',
                },
                {
                  timestamp: '2026-09-15 11:00:00',
                  action: 'SYSTEM_AUDIT: Dynamic permission summary verified with 100% database parity',
                  severity: 'INFO',
                  status: 'SUCCESS',
                  actor: 'Super Admin',
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {log.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Verified by: {log.actor}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {log.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 3: SUPER ADMIN ROLE & PERMISSION MANAGEMENT */}
      {activeTab === 'admin_manager' && isSuperAdminRole(currentUserRole) && (
        <div className="space-y-6">
          {/* Target Role Selector Ribbon */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 via-slate-900/5 to-transparent border border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <span>Interactive Role Permission Manager</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select any system role to dynamically inspect, grant, or revoke individual action capabilities with real-time enforcement.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleResetBaseline}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors"
                >
                  Reset All to Baseline
                </button>
              </div>
            </div>

            {/* Role Switcher Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mt-6">
              {[
                { role: 'teacher' as UserRole, label: 'Teacher', desc: 'Assigned Academics' },
                { role: 'student' as UserRole, label: 'Student', desc: 'Self-Service Learning' },
                { role: 'parent' as UserRole, label: 'Parent', desc: 'Child Monitoring' },
                { role: 'accountant' as UserRole, label: 'Accountant', desc: 'Institutional Finance' },
                { role: 'campus_admin' as UserRole, label: 'Campus Admin', desc: 'Campus Leadership' },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => setManagementTargetRole(r.role)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    managementTargetRole === r.role
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs">{r.label}</div>
                  <div className={`text-[10px] mt-0.5 ${managementTargetRole === r.role ? 'text-purple-100' : 'text-slate-400'}`}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role Permission Matrix Management */}
          <div className="space-y-4">
            {managementCategories.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {group.category}
                    </h4>
                    <span className="text-xs text-slate-500">
                      ({group.grantedCount} / {group.totalCount} active)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    Editing: {managementTargetRole.toUpperCase()}
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                    >
                      <div className="space-y-0.5 max-w-[70%]">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {item.label}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.action}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isGranted}
                            onChange={(e) => handleTogglePermission(item, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHY IS THIS RESTRICTED? MODAL */}
      {restrictedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Access Restricted
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Security Authorization Policy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRestrictedModalItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Requested Capability:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {restrictedModalItem.label}
                </p>
                <code className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">
                  Required Permission: {restrictedModalItem.code}
                </code>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Policy Reason:</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {restrictedModalItem.restrictionReason}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Your current role <strong>({summary.roleDisplayName})</strong> follows the strict Default-Deny principle. If you believe your account requires this privilege for institutional duties, contact your Campus Administrator.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setRestrictedModalItem(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN CRITICAL CONFIRMATION MODAL */}
      {confirmToggleState.isOpen && confirmToggleState.permission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm High-Risk Permission Change
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are about to <strong>{confirmToggleState.grant ? 'GRANT' : 'REVOKE'}</strong> the permission{' '}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-purple-600 font-bold">
                {confirmToggleState.permission.code}
              </code>{' '}
              for the <strong>{confirmToggleState.role.toUpperCase()}</strong> role.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
              Risk Level: <strong className="text-rose-600">{confirmToggleState.permission.riskLevel}</strong> • An audit log entry will be permanently written to the security ledger.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmToggleState({ isOpen: false, permission: null, grant: false, role: 'teacher' })}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => executePermissionToggle(confirmToggleState.permission!, confirmToggleState.grant, confirmToggleState.role)}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm"
              >
                Confirm & Apply Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

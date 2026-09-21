import { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  Calendar,
  Lock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Key,
  Database,
  Globe,
  Check,
  X,
  Smartphone,
  Server,
  Fingerprint,
} from 'lucide-react';
import {
  CampusBranch,
  SystemUser,
  AuditLogEntry,
  AcademicSession,
  SecurityPolicyConfig,
  UserRole,
} from '../types';

interface Phase1AdministrationViewProps {
  campuses: CampusBranch[];
  users: SystemUser[];
  auditLogs: AuditLogEntry[];
  sessions: AcademicSession[];
  securityPolicy: SecurityPolicyConfig;
  selectedCampus: string;
  onSelectCampus: (campusName: string) => void;
  onAddCampus: (campus: Omit<CampusBranch, 'id' | 'studentCount' | 'staffCount'>) => void;
  onAddUser: (user: Omit<SystemUser, 'id' | 'lastLogin'>) => void;
  onUpdateSecurityPolicy: (policy: SecurityPolicyConfig) => void;
}

export default function Phase1AdministrationView({
  campuses,
  users,
  auditLogs,
  sessions,
  securityPolicy,
  selectedCampus,
  onSelectCampus,
  onAddCampus,
  onAddUser,
  onUpdateSecurityPolicy,
}: Phase1AdministrationViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'campuses' | 'users_rbac' | 'cybersecurity' | 'sessions' | 'branding'
  >('campuses');

  // Campus Form State
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [campusForm, setCampusForm] = useState({
    code: '',
    name: '',
    city: 'Lahore',
    principal: '',
    phone: '+92 ',
    email: '',
    address: '',
    bankTitle: '',
    bankAccount: '',
    status: 'Active' as 'Active' | 'Under Setup',
  });

  // User Form State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'teacher' as UserRole,
    campusName: selectedCampus,
    status: 'Active' as 'Active' | 'Locked' | 'Suspended',
    twoFactorEnabled: true,
    phone: '+92 ',
  });

  // Security Policy local state
  const [policyState, setPolicyState] = useState<SecurityPolicyConfig>(securityPolicy);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Audit Logs Filter
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState('');

  // RBAC Matrix Permissions Map
  const [rbacMatrix, setRbacMatrix] = useState<{ [role: string]: { [key: string]: boolean } }>({
    super_admin: {
      admit_student: true,
      collect_fee: true,
      delete_voucher: true,
      alter_grades: true,
      send_bulk_sms: true,
      manage_campuses: true,
      manage_rbac: true,
      view_audit_logs: true,
      export_db_backup: true,
    },
    campus_admin: {
      admit_student: true,
      collect_fee: true,
      delete_voucher: false,
      alter_grades: true,
      send_bulk_sms: true,
      manage_campuses: false,
      manage_rbac: false,
      view_audit_logs: true,
      export_db_backup: false,
    },
    accountant: {
      admit_student: false,
      collect_fee: true,
      delete_voucher: false,
      alter_grades: false,
      send_bulk_sms: true,
      manage_campuses: false,
      manage_rbac: false,
      view_audit_logs: false,
      export_db_backup: false,
    },
    teacher: {
      admit_student: false,
      collect_fee: false,
      delete_voucher: false,
      alter_grades: true,
      send_bulk_sms: false,
      manage_campuses: false,
      manage_rbac: false,
      view_audit_logs: false,
      export_db_backup: false,
    },
    parent: {
      admit_student: false,
      collect_fee: false,
      delete_voucher: false,
      alter_grades: false,
      send_bulk_sms: false,
      manage_campuses: false,
      manage_rbac: false,
      view_audit_logs: false,
      export_db_backup: false,
    },
    student: {
      admit_student: false,
      collect_fee: false,
      delete_voucher: false,
      alter_grades: false,
      send_bulk_sms: false,
      manage_campuses: false,
      manage_rbac: false,
      view_audit_logs: false,
      export_db_backup: false,
    },
  });

  const togglePermission = (role: string, permKey: string) => {
    if (role === 'super_admin') return; // Super admin permissions are locked
    setRbacMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role][permKey],
      },
    }));
  };

  const handleAddCampusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campusForm.name || !campusForm.code) {
      alert('Please provide Campus Name and Code.');
      return;
    }
    onAddCampus(campusForm);
    setShowCampusModal(false);
    setCampusForm({
      code: '',
      name: '',
      city: 'Lahore',
      principal: '',
      phone: '+92 ',
      email: '',
      address: '',
      bankTitle: '',
      bankAccount: '',
      status: 'Active',
    });
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username || !userForm.fullName || !userForm.email) {
      alert('Please fill all required user identity fields.');
      return;
    }
    onAddUser(userForm);
    setShowUserModal(false);
    setUserForm({
      username: '',
      fullName: '',
      email: '',
      role: 'teacher',
      campusName: selectedCampus,
      status: 'Active',
      twoFactorEnabled: true,
      phone: '+92 ',
    });
  };

  const handleSaveSecurityPolicy = () => {
    onUpdateSecurityPolicy(policyState);
    alert('Security and access control policy successfully updated in central directory!');
  };

  const handleAddIp = () => {
    if (newIpAddress.trim() && !policyState.ipWhitelist.includes(newIpAddress.trim())) {
      setPolicyState({
        ...policyState,
        ipWhitelist: [...policyState.ipWhitelist, newIpAddress.trim()],
      });
      setNewIpAddress('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setPolicyState({
      ...policyState,
      ipWhitelist: policyState.ipWhitelist.filter((item) => item !== ip),
    });
  };

  const handleRunBackup = () => {
    setBackupLoading(true);
    setBackupSuccess(false);
    setTimeout(() => {
      setBackupLoading(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 1800);
  };

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = logFilter === 'ALL' || log.category === logFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(logSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="phase1-administration" className="space-y-4">
      {/* Module Title Banner */}
      <div className="bg-white border-l-4 border-[#002147] p-4 rounded-md shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#002147]" />
            <h1 className="text-lg font-bold text-[#002147]">
              Phase 1: Multi-Campus Architecture, RBAC &amp; Cybersecurity
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise multi-branch configuration, granular role permissions matrix, cybersecurity audit logs &amp; session security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Current Scope:</span>
          <span className="px-2.5 py-1 bg-[#002147] text-white text-xs font-bold rounded">
            {selectedCampus}
          </span>
        </div>
      </div>

      {/* Sub-Navigation Ribbon */}
      <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-lg border border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('campuses')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition ${
            activeSubTab === 'campuses'
              ? 'bg-[#002147] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Multi-Campus Branches ({campuses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('users_rbac')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition ${
            activeSubTab === 'users_rbac'
              ? 'bg-[#002147] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>System Users &amp; RBAC Matrix ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('cybersecurity')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition ${
            activeSubTab === 'cybersecurity'
              ? 'bg-[#002147] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Security Operations &amp; Audit Trail</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sessions')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition ${
            activeSubTab === 'sessions'
              ? 'bg-[#002147] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Sessions &amp; Terms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded transition ${
            activeSubTab === 'branding'
              ? 'bg-[#002147] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Institutional Branding &amp; SMS Gateway</span>
        </button>
      </div>

      {/* SUB-VIEW 1: CAMPUSES & BRANCHES */}
      {activeSubTab === 'campuses' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Campus Branch Network</h2>
              <p className="text-xs text-slate-500">
                Configure campuses, designated principals, local bank account credentials for fee receipts, and branch capacity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCampusModal(true)}
              className="px-3 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Campus</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campuses.map((cmp) => {
              const isSelected = selectedCampus.includes(cmp.name) || cmp.name === selectedCampus;
              return (
                <div
                  key={cmp.id}
                  className={`bg-white rounded-lg border p-4 shadow-xs flex flex-col justify-between transition ${
                    isSelected ? 'border-[#002147] ring-2 ring-[#002147]/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded">
                          {cmp.code}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{cmp.name}</h3>
                        <p className="text-xs text-slate-500">{cmp.city}, Pakistan</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          cmp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cmp.status}
                      </span>
                    </div>

                    <div className="mt-3 text-xs space-y-1.5 border-t pt-2.5 text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700">Principal:</span> {cmp.principal}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Phone:</span> {cmp.phone}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Email:</span> {cmp.email}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Bank Details:</span>{' '}
                        <span className="font-mono text-[11px] text-slate-800">{cmp.bankAccount}</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Students</div>
                        <div className="font-bold text-slate-800 font-mono">{cmp.studentCount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Staff Members</div>
                        <div className="font-bold text-slate-800 font-mono">{cmp.staffCount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    {isSelected ? (
                      <span className="text-xs font-bold text-[#002147] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active Session Campus</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectCampus(cmp.name)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition"
                      >
                        Switch To This Campus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: USERS & RBAC MATRIX */}
      {activeSubTab === 'users_rbac' && (
        <div className="space-y-5">
          {/* User Directory */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">System Operator &amp; User Accounts</h2>
                <p className="text-xs text-slate-500">
                  Manage administrative credentials, 2FA states, assigned campuses, and user status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className="px-3 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create System User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b">
                  <tr>
                    <th className="p-2.5">User Identity</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Assigned Campus</th>
                    <th className="p-2.5 text-center">2FA Auth</th>
                    <th className="p-2.5">Last Login</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50">
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{usr.fullName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          @{usr.username} • {usr.email}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-semibold rounded text-[11px] uppercase">
                          {usr.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">{usr.campusName}</td>
                      <td className="p-2.5 text-center">
                        {usr.twoFactorEnabled ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            Enforced (OTP)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                            Password Only
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-600">{usr.lastLogin}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            usr.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {usr.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Password reset token sent to ${usr.email}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold mr-1"
                        >
                          Reset Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Granular RBAC Permissions Matrix */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Role-Based Access Control (RBAC) Matrix</h2>
              <p className="text-xs text-slate-500">
                Configure module-level authority across roles. Super Administrator permissions are immutable by design.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-[#002147] text-white font-bold border-b">
                  <tr>
                    <th className="p-2.5">System Permission</th>
                    <th className="p-2.5 text-center">Super Admin</th>
                    <th className="p-2.5 text-center">Campus Admin</th>
                    <th className="p-2.5 text-center">Bursar / Accountant</th>
                    <th className="p-2.5 text-center">Teacher</th>
                    <th className="p-2.5 text-center">Parent</th>
                    <th className="p-2.5 text-center">Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { key: 'admit_student', label: 'Admit & Register Students' },
                    { key: 'collect_fee', label: 'Collect Fees & Issue Vouchers' },
                    { key: 'delete_voucher', label: 'Void / Delete Fee Vouchers' },
                    { key: 'alter_grades', label: 'Enter & Alter Exam Marks' },
                    { key: 'send_bulk_sms', label: 'Send GSM Bulk SMS Broadcasts' },
                    { key: 'manage_campuses', label: 'Create & Edit Campus Branches' },
                    { key: 'manage_rbac', label: 'Manage Roles & Security Policies' },
                    { key: 'view_audit_logs', label: 'View Security Audit Trail' },
                    { key: 'export_db_backup', label: 'Export Encrypted Database Backups' },
                  ].map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-800">{perm.label}</td>
                      {['super_admin', 'campus_admin', 'accountant', 'teacher', 'parent', 'student'].map(
                        (roleKey) => {
                          const allowed = rbacMatrix[roleKey]?.[perm.key] ?? false;
                          const isSuperAdmin = roleKey === 'super_admin';
                          return (
                            <td key={roleKey} className="p-2.5 text-center">
                              <button
                                type="button"
                                disabled={isSuperAdmin}
                                onClick={() => togglePermission(roleKey, perm.key)}
                                className={`w-6 h-6 rounded inline-flex items-center justify-center transition ${
                                  allowed
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                } ${isSuperAdmin ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {allowed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => alert('RBAC Matrix rules synchronized to backend security service!')}
                className="px-3 py-1.5 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded shadow-xs"
              >
                Apply RBAC Policy Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CYBERSECURITY & AUDIT TRAIL */}
      {activeSubTab === 'cybersecurity' && (
        <div className="space-y-5">
          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Security Health</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Optimal
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">98.4%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero critical vulnerabilities detected</div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">2FA Enforcement</span>
                <Shield className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">Enabled</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Mandatory for all Admin &amp; Bursar accounts</div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">WAF Rate Limiting</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">Active (100 req/min)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Brute-force protection enabled</div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Data Encryption</span>
                <Lock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">AES-256 + TLS 1.3</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Rest and transit encryption active</div>
            </div>
          </div>

          {/* Security Policy Configuration & Whitelist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Policy Form */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <Lock className="w-4 h-4 text-[#002147]" />
                <h3 className="text-sm font-bold text-slate-900">Session &amp; Password Security Policies</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Automatic Session Inactivity Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={policyState.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setPolicyState({ ...policyState, sessionTimeoutMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Failed Login Attempts Before Lockout
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={policyState.maxLoginAttempts}
                    onChange={(e) =>
                      setPolicyState({ ...policyState, maxLoginAttempts: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="24"
                    value={policyState.passwordMinLength}
                    onChange={(e) =>
                      setPolicyState({ ...policyState, passwordMinLength: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyState.require2FA}
                      onChange={(e) =>
                        setPolicyState({ ...policyState, require2FA: e.target.checked })
                      }
                      className="rounded text-[#002147]"
                    />
                    <span className="font-semibold text-slate-700">
                      Enforce Mandatory Two-Factor Authentication (2FA OTP)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyState.requireSpecialChar}
                      onChange={(e) =>
                        setPolicyState({ ...policyState, requireSpecialChar: e.target.checked })
                      }
                      className="rounded text-[#002147]"
                    />
                    <span className="font-semibold text-slate-700">
                      Enforce Special Characters &amp; Numbers in Passwords
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyState.ipWhitelistEnabled}
                      onChange={(e) =>
                        setPolicyState({ ...policyState, ipWhitelistEnabled: e.target.checked })
                      }
                      className="rounded text-[#002147]"
                    />
                    <span className="font-semibold text-slate-700">
                      Enable Administrator IP Whitelist Firewall
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSecurityPolicy}
                  className="w-full py-2 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded shadow-xs transition"
                >
                  Save Security Policies
                </button>
              </div>
            </div>

            {/* IP Whitelist & Database Backup */}
            <div className="space-y-4">
              {/* Whitelist Panel */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Trusted IP Whitelist Firewall</h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 182.185.132.40 or 192.168.1.0/24"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded outline-none text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddIp}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded"
                  >
                    Add IP
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {policyState.ipWhitelist.map((ip) => (
                    <div
                      key={ip}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border rounded text-xs"
                    >
                      <span className="font-mono text-slate-800">{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disaster Recovery & Encrypted Backup */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Database Disaster Recovery &amp; Backups</h3>
                </div>

                <p className="text-xs text-slate-500">
                  Automated nightly snapshots are mirrored to secondary regional storage in Frankfurt and Karachi.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={backupLoading}
                    onClick={handleRunBackup}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded flex items-center gap-2 shadow-xs transition"
                  >
                    {backupLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{backupLoading ? 'Creating AES-256 Snapshot...' : 'Create Instant Backup'}</span>
                  </button>

                  {backupSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Backup complete &amp; verified!</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Audit Trail Log */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Real-Time Security &amp; Audit Trail</h3>
                <p className="text-xs text-slate-500">
                  Immutable cybersecurity log recording every privilege elevation, login, and sensitive alteration.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search audit trail..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border rounded outline-none text-xs w-48"
                  />
                </div>

                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="px-3 py-1.5 border rounded text-xs bg-white outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="SECURITY">Security Events</option>
                  <option value="AUTH">Authentication</option>
                  <option value="FINANCE">Finance</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b">
                  <tr>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">User &amp; Role</th>
                    <th className="p-2.5">Client IP &amp; Geolocation</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Action Details</th>
                    <th className="p-2.5 text-center">Severity</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800">{log.user}</span>
                        <span className="ml-1 text-[10px] text-slate-500 font-mono">({log.role})</span>
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 font-mono text-slate-700 rounded text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-800 font-medium">{log.action}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: ACADEMIC SESSIONS */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Academic Sessions &amp; Calendar Terms</h2>
              <p className="text-xs text-slate-500">
                Manage academic calendar years, term schedules, and define active enrollment cohorts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('New Academic Session creation wizard initiated.')}
              className="px-3 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Academic Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((ses) => (
              <div
                key={ses.id}
                className={`bg-white rounded-lg border p-4 shadow-xs space-y-3 ${
                  ses.isCurrent ? 'border-[#002147] ring-2 ring-[#002147]/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">{ses.sessionName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ses.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ses.status === 'Upcoming'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ses.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 border-t pt-2">
                  <div>
                    <span className="font-semibold text-slate-700">Term Start:</span> {ses.startDate}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Term End:</span> {ses.endDate}
                  </div>
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  {ses.isCurrent ? (
                    <span className="text-xs font-bold text-[#002147] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Active Operating Year</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Activated session: ${ses.sessionName}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                    >
                      Make Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: INSTITUTIONAL BRANDING & SMS GATEWAY */}
      {activeSubTab === 'branding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Institutional Identity &amp; Header</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">School Name</label>
              <input
                type="text"
                readOnly
                value="The Educators"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline / Sub-Heading</label>
              <input
                type="text"
                readOnly
                value="A Project of Beaconhouse"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-semibold text-slate-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Code</label>
              <input
                type="text"
                readOnly
                value="PKR (Rs.)"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Timezone</label>
              <input
                type="text"
                readOnly
                value="Asia/Karachi (GMT+5)"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Telecom SMS Gateway Integration</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Telecom Provider</label>
              <select className="w-full px-3 py-1.5 border rounded bg-white">
                <option>Telenor Pakistan Corporate SMS API</option>
                <option>Jazz Business GSM Gateway</option>
                <option>Zong 4G Bulk Messaging Service</option>
                <option>Twilio Cloud SMS API</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Masking Header ID</label>
              <input
                type="text"
                readOnly
                value="EDUCATORS"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">API Key / Secret Token</label>
              <input
                type="password"
                readOnly
                value="••••••••••••••••••••••••••••••••"
                className="w-full px-3 py-1.5 border rounded bg-slate-50 font-mono"
              />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Available SMS Credits: <strong className="text-slate-800 font-mono">14,280</strong></span>
              <button
                type="button"
                onClick={() => alert('SMS test ping packet successfully delivered to network operator!')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold"
              >
                Send Test Ping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: REGISTER NEW CAMPUS */}
      {showCampusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-sm">Register New Campus Branch</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCampusModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCampusSubmit} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LHR-VAL-04"
                    value={campusForm.code}
                    onChange={(e) => setCampusForm({ ...campusForm, code: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={campusForm.city}
                    onChange={(e) => setCampusForm({ ...campusForm, city: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valencia Town Campus"
                  value={campusForm.name}
                  onChange={(e) => setCampusForm({ ...campusForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Principal / Campus Head</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rashid Minhas"
                    value={campusForm.principal}
                    onChange={(e) => setCampusForm({ ...campusForm, principal: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={campusForm.phone}
                    onChange={(e) => setCampusForm({ ...campusForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="campus@theeducators.edu.pk"
                    value={campusForm.email}
                    onChange={(e) => setCampusForm({ ...campusForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={campusForm.status}
                    onChange={(e) =>
                      setCampusForm({ ...campusForm, status: e.target.value as 'Active' | 'Under Setup' })
                    }
                    className="w-full px-3 py-1.5 border rounded bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Setup">Under Setup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Collection Bank Account</label>
                <input
                  type="text"
                  placeholder="e.g. HBL 00427909988201"
                  value={campusForm.bankAccount}
                  onChange={(e) => setCampusForm({ ...campusForm, bankAccount: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  placeholder="e.g. Block A, Valencia Town, Lahore"
                  value={campusForm.address}
                  onChange={(e) => setCampusForm({ ...campusForm, address: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCampusModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded shadow-xs"
                >
                  Register Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE SYSTEM USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-sm">Create New System User Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Farzana Parveen"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. farzana.p"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@theeducators.edu"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Designation *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 border rounded bg-white font-semibold"
                  >
                    <option value="campus_admin">Campus Admin / Principal</option>
                    <option value="accountant">Accountant / Bursar</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="parent">Parent</option>
                    <option value="student">Student</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Campus</label>
                  <select
                    value={userForm.campusName}
                    onChange={(e) => setUserForm({ ...userForm, campusName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded bg-white"
                  >
                    {campuses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userForm.twoFactorEnabled}
                    onChange={(e) => setUserForm({ ...userForm, twoFactorEnabled: e.target.checked })}
                    className="rounded text-[#002147]"
                  />
                  <span className="font-semibold text-slate-700">
                    Require Two-Factor Authentication (OTP via SMS / Authenticator App)
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded shadow-xs"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

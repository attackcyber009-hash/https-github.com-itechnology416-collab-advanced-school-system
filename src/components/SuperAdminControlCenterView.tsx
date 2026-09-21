import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  Key,
  Activity,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Sliders,
  Database,
  Cpu,
  Server,
  FileSpreadsheet,
  Download,
  Copy,
  RotateCcw,
  Check,
  X,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserRole, ActiveNavTab } from '../types';

// ==========================================
// RBAC MODULE PERMISSION INTERFACES
// ==========================================
export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'import'
  | 'print'
  | 'manage'
  | 'configure';

export interface ModulePermissionRule {
  moduleId: string;
  moduleName: string;
  category: 'Core Academics' | 'Student & Staff' | 'Finance & Accounts' | 'Operations & Logistics' | 'System & Security';
  allowedActions: Record<PermissionAction, boolean>;
}

export interface RoleDefinition {
  id: string;
  name: string;
  roleKey: UserRole | string;
  description: string;
  isSystemRole: boolean;
  color: string;
  usersCount: number;
  permissions: Record<string, Record<PermissionAction, boolean>>;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole | string;
  status: 'active' | 'locked' | 'deactivated';
  campus: string;
  phone: string;
  lastLogin: string;
  createdAt: string;
  mfaEnabled: boolean;
}

export interface SystemAuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  module: string;
  resource: string;
  status: 'success' | 'warning' | 'denied' | 'failed';
  ipAddress: string;
  userAgent: string;
  details: string;
}

interface SuperAdminControlCenterViewProps {
  onNavigate?: (tab: ActiveNavTab) => void;
  onSimulateRole?: (role: UserRole) => void;
}

// Available Standard Modules
const SYSTEM_MODULES: { id: string; name: string; category: ModulePermissionRule['category'] }[] = [
  { id: 'students', name: 'Student Records & Dossiers', category: 'Student & Staff' },
  { id: 'admissions', name: 'Admissions & Inquiries', category: 'Student & Staff' },
  { id: 'staff', name: 'Faculty & HR Staff', category: 'Student & Staff' },
  { id: 'attendance', name: 'Attendance & Biometrics', category: 'Core Academics' },
  { id: 'academics', name: 'Curriculum & Classes', category: 'Core Academics' },
  { id: 'timetable', name: 'Timetable & Substitutions', category: 'Core Academics' },
  { id: 'exams', name: 'Examinations & Marks', category: 'Core Academics' },
  { id: 'study_materials', name: 'LMS & Study Materials', category: 'Core Academics' },
  { id: 'fees', name: 'Fee Vouchers & Collection', category: 'Finance & Accounts' },
  { id: 'expenses', name: 'Expenses & Ledgers', category: 'Finance & Accounts' },
  { id: 'payroll', name: 'Staff Payroll & Salaries', category: 'Finance & Accounts' },
  { id: 'procurement', name: 'Procurement & Inventory', category: 'Finance & Accounts' },
  { id: 'library', name: 'Library & Catalog', category: 'Operations & Logistics' },
  { id: 'transport', name: 'Transport & Fleet', category: 'Operations & Logistics' },
  { id: 'hostel', name: 'Hostel & Boarding', category: 'Operations & Logistics' },
  { id: 'gate_security', name: 'Visitor Gate Security', category: 'Operations & Logistics' },
  { id: 'reports', name: 'BI Reports & Analytics', category: 'System & Security' },
  { id: 'roles_permissions', name: 'Roles & Permissions', category: 'System & Security' },
  { id: 'audit_logs', name: 'Audit Logs & Security Trail', category: 'System & Security' },
  { id: 'settings', name: 'System Settings & Gateway', category: 'System & Security' },
];

const PERMISSION_ACTIONS: { key: PermissionAction; label: string; tooltip: string }[] = [
  { key: 'view', label: 'View', tooltip: 'Read and browse data records' },
  { key: 'create', label: 'Create', tooltip: 'Add new entries and records' },
  { key: 'edit', label: 'Edit', tooltip: 'Modify existing records' },
  { key: 'delete', label: 'Delete', tooltip: 'Remove or archive records' },
  { key: 'approve', label: 'Approve', tooltip: 'Authorize discounts, leaves and vouchers' },
  { key: 'export', label: 'Export', tooltip: 'Download Excel, CSV, PDF datasets' },
  { key: 'import', label: 'Import', tooltip: 'Bulk upload spreadsheets' },
  { key: 'print', label: 'Print', tooltip: 'Generate official slips, ID cards, receipts' },
  { key: 'manage', label: 'Manage', tooltip: 'Perform operational actions' },
  { key: 'configure', label: 'Config', tooltip: 'Modify module parameters & policies' },
];

export default function SuperAdminControlCenterView({
  onNavigate,
  onSimulateRole,
}: SuperAdminControlCenterViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'roles' | 'users' | 'audit' | 'system_health'>('overview');

  // Initial Roles with comprehensive granular matrix
  const [roles, setRoles] = useState<RoleDefinition[]>([
    {
      id: 'role-superadmin',
      name: 'Super Admin',
      roleKey: 'super_admin',
      description: 'Root system administrator with unrestricted access across all multi-branch modules and security settings.',
      isSystemRole: true,
      color: 'bg-red-500 text-white',
      usersCount: 2,
      permissions: SYSTEM_MODULES.reduce((acc, mod) => {
        acc[mod.id] = {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true,
          import: true,
          print: true,
          manage: true,
          configure: true,
        };
        return acc;
      }, {} as Record<string, Record<PermissionAction, boolean>>),
    },
    {
      id: 'role-teacher',
      name: 'Teacher',
      roleKey: 'teacher',
      description: 'Teaching faculty member with access to assigned class attendance, marks entry, diaries, and LMS.',
      isSystemRole: true,
      color: 'bg-emerald-600 text-white',
      usersCount: 38,
      permissions: {
        students: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        admissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        staff: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        attendance: { view: true, create: true, edit: true, delete: false, approve: false, export: true, import: false, print: true, manage: true, configure: false },
        academics: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        timetable: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        exams: { view: true, create: true, edit: true, delete: false, approve: false, export: true, import: true, print: true, manage: true, configure: false },
        study_materials: { view: true, create: true, edit: true, delete: true, approve: false, export: true, import: true, print: true, manage: true, configure: false },
        fees: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        expenses: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        procurement: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        library: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        transport: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        hostel: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        gate_security: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        reports: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        roles_permissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        audit_logs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
      },
    },
    {
      id: 'role-accountant',
      name: 'Accountant',
      roleKey: 'accountant',
      description: 'Finance department officer responsible for fee collection, voucher generation, payroll and expense ledgers.',
      isSystemRole: true,
      color: 'bg-amber-600 text-white',
      usersCount: 4,
      permissions: {
        students: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        admissions: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        staff: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        attendance: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        academics: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        timetable: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        exams: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        study_materials: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        fees: { view: true, create: true, edit: true, delete: false, approve: true, export: true, import: true, print: true, manage: true, configure: true },
        expenses: { view: true, create: true, edit: true, delete: false, approve: true, export: true, import: true, print: true, manage: true, configure: false },
        payroll: { view: true, create: true, edit: true, delete: false, approve: false, export: true, import: false, print: true, manage: true, configure: false },
        procurement: { view: true, create: true, edit: true, delete: false, approve: true, export: true, import: false, print: true, manage: true, configure: false },
        library: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        transport: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        hostel: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        gate_security: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        reports: { view: true, create: false, edit: false, delete: false, approve: false, export: true, import: false, print: true, manage: false, configure: false },
        roles_permissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        audit_logs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
      },
    },
    {
      id: 'role-parent',
      name: 'Parent / Guardian',
      roleKey: 'parent',
      description: 'Parent guardian portal account strictly isolated to viewing personal children records, fee dues, results and circulars.',
      isSystemRole: true,
      color: 'bg-sky-600 text-white',
      usersCount: 840,
      permissions: {
        students: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        admissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        staff: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        attendance: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        academics: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        timetable: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        exams: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        study_materials: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        fees: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        expenses: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        procurement: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        library: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        transport: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        hostel: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        gate_security: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        reports: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        roles_permissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        audit_logs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
      },
    },
    {
      id: 'role-student',
      name: 'Student',
      roleKey: 'student',
      description: 'Student portal account with access to personal class schedule, diary homework, exam marks, and quiz vault.',
      isSystemRole: true,
      color: 'bg-purple-600 text-white',
      usersCount: 1250,
      permissions: {
        students: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        admissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        staff: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        attendance: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        academics: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        timetable: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        exams: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        study_materials: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        fees: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: true, manage: false, configure: false },
        expenses: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        procurement: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        library: { view: true, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        transport: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        hostel: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        gate_security: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        reports: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        roles_permissions: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        audit_logs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, import: false, print: false, manage: false, configure: false },
      },
    },
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-teacher');
  const [selectedModuleCategory, setSelectedModuleCategory] = useState<string>('All');
  const [searchRoleQuery, setSearchRoleQuery] = useState('');

  // Managed Users state
  const [users, setUsers] = useState<ManagedUser[]>([
    { id: 'usr-1', name: 'Zia-ur-Rehman', email: 'zia@educators.edu', username: 'admin_zia', role: 'super_admin', status: 'active', campus: 'Central Secretariat', phone: '+92 300 8472910', lastLogin: 'Active Now', createdAt: '2025-01-10', mfaEnabled: true },
    { id: 'usr-2', name: 'Ms. Ayesha Siddiqa', email: 'ayesha.s@educators.edu', username: 'teacher_ayesha', role: 'teacher', status: 'active', campus: 'Main Executive Campus', phone: '+92 321 4982311', lastLogin: '10 mins ago', createdAt: '2025-03-15', mfaEnabled: false },
    { id: 'usr-3', name: 'Mr. Tariq Mehmood', email: 'tariq.m@educators.edu', username: 'teacher_tariq', role: 'teacher', status: 'active', campus: 'Cantt Girls Branch', phone: '+92 333 1298471', lastLogin: '1 hour ago', createdAt: '2025-04-01', mfaEnabled: false },
    { id: 'usr-4', name: 'Muhammad Kashif', email: 'kashif.accounts@educators.edu', username: 'accountant_kashif', role: 'accountant', status: 'active', campus: 'Central Secretariat', phone: '+92 312 9988771', lastLogin: '25 mins ago', createdAt: '2025-02-18', mfaEnabled: true },
    { id: 'usr-5', name: 'Dr. Imran Qureshi', email: 'imran.parent@gmail.com', username: 'parent_imran', role: 'parent', status: 'active', campus: 'Main Executive Campus', phone: '+92 300 5544332', lastLogin: 'Yesterday 08:30 PM', createdAt: '2025-08-20', mfaEnabled: false },
    { id: 'usr-6', name: 'Sarah Ali (Std #1042)', email: 'sarah.ali@student.edu', username: 'student_sarah', role: 'student', status: 'active', campus: 'Main Executive Campus', phone: '+92 321 4455822', lastLogin: 'Today 07:45 AM', createdAt: '2025-08-22', mfaEnabled: false },
    { id: 'usr-7', name: 'Hamza Farooq', email: 'hamza.f@educators.edu', username: 'clerk_hamza', role: 'teacher', status: 'locked', campus: 'DHA Phase 5 Campus', phone: '+92 345 6677889', lastLogin: '5 days ago', createdAt: '2025-05-12', mfaEnabled: false },
  ]);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<SystemAuditLogEntry[]>([
    { id: 'aud-101', timestamp: '2026-09-21 10:24:15', actor: 'Zia-ur-Rehman (Super Admin)', actorRole: 'super_admin', action: 'ROLE_PERMISSION_UPDATE', module: 'Roles & Permissions', resource: 'Role: Teacher -> Exams Edit Granted', status: 'success', ipAddress: '192.168.1.100', userAgent: 'Chrome 128 / macOS', details: 'Updated examination marks edit toggle for mid-term' },
    { id: 'aud-102', timestamp: '2026-09-21 09:48:30', actor: 'Muhammad Kashif', actorRole: 'accountant', action: 'FEE_VOUCHER_COLLECT', module: 'Fee Management', resource: 'Voucher #VCH-2026-09-0412 (Sarah Ali)', status: 'success', ipAddress: '192.168.10.45', userAgent: 'Firefox 130 / Win11', details: 'Collected PKR 18,500 via Bank Alfalah Cash deposit' },
    { id: 'aud-103', timestamp: '2026-09-21 09:12:00', actor: 'Ms. Ayesha Siddiqa', actorRole: 'teacher', action: 'ATTENDANCE_LOCK', module: 'Attendance', resource: 'Class 10-A Daily Attendance (28 Present, 2 Absent)', status: 'success', ipAddress: '192.168.1.120', userAgent: 'Safari 18 / iPadOS', details: 'Biometric sync validated. SMS trigger dispatched.' },
    { id: 'aud-104', timestamp: '2026-09-21 08:30:11', actor: 'Unknown Client', actorRole: 'anonymous', action: 'UNAUTHORIZED_API_BLOCKED', module: 'Security Firewall', resource: '/api/v1/superadmin/security-keys', status: 'denied', ipAddress: '103.255.4.19', userAgent: 'Python-Requests / Linux', details: 'RBAC Authorization Failed: Missing super_admin token' },
    { id: 'aud-105', timestamp: '2026-09-20 18:40:22', actor: 'Zia-ur-Rehman (Super Admin)', actorRole: 'super_admin', action: 'USER_ACCOUNT_LOCKED', module: 'User Management', resource: 'User: Hamza Farooq (clerk_hamza)', status: 'warning', ipAddress: '192.168.1.100', userAgent: 'Chrome 128 / macOS', details: 'Account temporarily locked due to 5 consecutive invalid PIN attempts' },
  ]);

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [filterUserRole, setFilterUserRole] = useState('all');
  const [searchAuditQuery, setSearchAuditQuery] = useState('');
  const [filterAuditModule, setFilterAuditModule] = useState('all');

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    username: '',
    role: 'teacher' as UserRole,
    campus: 'Main Executive Campus',
    phone: '',
    password: '',
  });

  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    roleKey: '',
    description: '',
    cloneFrom: 'role-teacher',
  });

  // Selected Role object
  const currentRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Filtered modules for permission matrix
  const filteredModules = useMemo(() => {
    return SYSTEM_MODULES.filter((m) => {
      const matchCategory = selectedModuleCategory === 'All' || m.category === selectedModuleCategory;
      return matchCategory;
    });
  }, [selectedModuleCategory]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
        u.campus.toLowerCase().includes(searchUserQuery.toLowerCase());
      const matchesRole = filterUserRole === 'all' || u.role === filterUserRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchUserQuery, filterUserRole]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchAuditQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchAuditQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchAuditQuery.toLowerCase()) ||
        log.ipAddress.includes(searchAuditQuery);
      const matchesModule = filterAuditModule === 'all' || log.module === filterAuditModule;
      return matchesSearch && matchesModule;
    });
  }, [auditLogs, searchAuditQuery, filterAuditModule]);

  // Toggle individual permission in matrix
  const handleTogglePermission = (moduleId: string, action: PermissionAction) => {
    if (currentRole.roleKey === 'super_admin') {
      alert('Super Admin has root permissions by design and cannot be restricted.');
      return;
    }

    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === selectedRoleId) {
          const currentModulePerms = role.permissions[moduleId] || {
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false,
            import: false,
            print: false,
            manage: false,
            configure: false,
          };
          const currentVal = !!currentModulePerms[action];
          const updatedModulePerms = {
            ...currentModulePerms,
            [action]: !currentVal,
          };

          return {
            ...role,
            permissions: {
              ...role.permissions,
              [moduleId]: updatedModulePerms,
            },
          };
        }
        return role;
      })
    );

    // Record in Audit Trail
    const newAudit: SystemAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
      actor: 'Super Admin (System Override)',
      actorRole: 'super_admin',
      action: 'PERMISSION_TOGGLED',
      module: 'Roles & Permissions',
      resource: `Role: ${currentRole.name} -> ${moduleId} [${action.toUpperCase()}]`,
      status: 'success',
      ipAddress: '127.0.0.1 (Local Admin Session)',
      userAgent: 'Secure Administrative Console',
      details: `Permission ${action.toUpperCase()} updated for module ${moduleId}.`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Toggle all actions for a specific module
  const handleToggleAllModuleActions = (moduleId: string, enable: boolean) => {
    if (currentRole.roleKey === 'super_admin') return;

    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === selectedRoleId) {
          const allActions: Record<PermissionAction, boolean> = {
            view: enable,
            create: enable,
            edit: enable,
            delete: enable,
            approve: enable,
            export: enable,
            import: enable,
            print: enable,
            manage: enable,
            configure: enable,
          };
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [moduleId]: allActions,
            },
          };
        }
        return role;
      })
    );
  };

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'locked' : 'active';
          // Log audit
          const newAudit: SystemAuditLogEntry = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
            actor: 'Super Admin',
            actorRole: 'super_admin',
            action: nextStatus === 'locked' ? 'USER_ACCOUNT_LOCKED' : 'USER_ACCOUNT_UNLOCKED',
            module: 'User Management',
            resource: `User: ${u.name} (${u.username})`,
            status: 'warning',
            ipAddress: '192.168.1.100',
            userAgent: 'Admin Console',
            details: `Status changed from ${u.status} to ${nextStatus}`,
          };
          setAuditLogs((a) => [newAudit, ...a]);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetUserPassword = (userName: string, email: string) => {
    const tempPass = `Edu@${Math.floor(100000 + Math.random() * 900000)}`;
    alert(`Temporary one-time password generated for ${userName} (${email}):\n\n🔑 ${tempPass}\n\nA secure password reset link has been queued to their official inbox.`);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.username) {
      alert('Please fill out all required fields.');
      return;
    }

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      username: newUserForm.username,
      role: newUserForm.role,
      status: 'active',
      campus: newUserForm.campus,
      phone: newUserForm.phone || '+92 300 0000000',
      lastLogin: 'Never Signed In',
      createdAt: new Date().toISOString().split('T')[0],
      mfaEnabled: false,
    };

    setUsers((prev) => [newUser, ...prev]);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      username: '',
      role: 'teacher',
      campus: 'Main Executive Campus',
      phone: '',
      password: '',
    });

    // Record audit
    const newAudit: SystemAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
      actor: 'Super Admin',
      actorRole: 'super_admin',
      action: 'USER_PROVISIONED',
      module: 'User Management',
      resource: `New Account: ${newUser.name} [Role: ${newUser.role}]`,
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Admin Console',
      details: `User credentials created and assigned to ${newUser.campus}`,
    };
    setAuditLogs((a) => [newAudit, ...a]);

    alert(`User "${newUser.name}" successfully created with role [${newUser.role.toUpperCase()}]. Welcome email dispatched.`);
  };

  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.name || !newRoleForm.roleKey) {
      alert('Please provide Role Name and Unique Key.');
      return;
    }

    const sourceRole = roles.find((r) => r.id === newRoleForm.cloneFrom) || roles[1];
    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: newRoleForm.name,
      roleKey: newRoleForm.roleKey.toLowerCase().replace(/\s+/g, '_'),
      description: newRoleForm.description || `Custom role cloned from ${sourceRole.name}`,
      isSystemRole: false,
      color: 'bg-indigo-600 text-white',
      usersCount: 0,
      permissions: JSON.parse(JSON.stringify(sourceRole.permissions)),
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    setShowAddRoleModal(false);
    setNewRoleForm({
      name: '',
      roleKey: '',
      description: '',
      cloneFrom: 'role-teacher',
    });

    alert(`Custom Role "${newRole.name}" created successfully. You can now customize permissions in the matrix.`);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-slate-900 to-sky-950 rounded-2xl p-5 text-white shadow-md border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise RBAC &amp; Security Control Center</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              System Control &amp; Permission Architecture
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Centralized identity governance, granular multi-role access control, user lifecycle management, and real-time security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSimulateRole && (
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-[10px] text-slate-300 font-bold px-2">Quick Preview:</span>
                <button
                  type="button"
                  onClick={() => onSimulateRole('teacher')}
                  className="px-2.5 py-1 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateRole('accountant')}
                  className="px-2.5 py-1 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                >
                  Accountant
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateRole('parent')}
                  className="px-2.5 py-1 bg-sky-500/80 hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateRole('student')}
                  className="px-2.5 py-1 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                >
                  Student
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeSubTab === 'overview'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Center Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('roles')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeSubTab === 'roles'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Role &amp; Permission Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('users')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeSubTab === 'users'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeSubTab === 'audit'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Security Audit Trail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('system_health')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeSubTab === 'system_health'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>System Health &amp; Security</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total User Directory</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">2,135</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 99.4% Active Accounts
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Configured Roles</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">{roles.length} Roles</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">5 System + {roles.length - 5} Custom</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Active Sessions</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">142 Live</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Across 4 Campuses</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Security Intercepts</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-amber-700 mt-2">0 Breaches</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% RBAC Enforced</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">System Uptime</span>
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-sky-800 mt-2">99.98%</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Database &amp; API Online</div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002147] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure granular View, Create, Edit, Delete, Approve, Export, and Configure permissions across 20+ functional modules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('roles')}
                className="w-full py-2 bg-[#002147] hover:bg-black text-white text-xs font-bold rounded-lg transition"
              >
                Open Permission Matrix &rarr;
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">User Governance &amp; Accounts</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provision new operators, lock/unlock delinquent accounts, reset credentials, assign branches, and enforce multi-factor rules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('users')}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
              >
                Manage System Users &rarr;
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Security Audit &amp; Activity Log</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect cryptographic audit records including actor ID, client IP address, altered records, previous values, and time stamps.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('audit')}
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition"
              >
                Inspect Audit Logs &rarr;
              </button>
            </div>
          </div>

          {/* Role Architecture Distribution Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#002147]" />
              <span>Multi-Role Dashboard Isolation Architecture</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl">
                <div className="font-bold text-red-900 flex items-center justify-between">
                  <span>Super Admin</span>
                  <span className="px-1.5 py-0.2 bg-red-200 text-red-900 rounded text-[9px]">Root</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Unrestricted system control, settings, user governance &amp; global overrides.</p>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span>Teacher</span>
                  <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded text-[9px]">Classroom</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Daily attendance, marks submission, daily diaries, LMS files &amp; schedules.</p>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="font-bold text-amber-900 flex items-center justify-between">
                  <span>Accountant</span>
                  <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[9px]">Finance</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Fee collection vouchers, expense ledgers, payroll slips &amp; financial reports.</p>
              </div>

              <div className="p-3 bg-sky-50/60 border border-sky-200 rounded-xl">
                <div className="font-bold text-sky-900 flex items-center justify-between">
                  <span>Parent</span>
                  <span className="px-1.5 py-0.2 bg-sky-200 text-sky-900 rounded text-[9px]">Family</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Child performance, attendance alerts, fee vouchers, exam datesheets &amp; notices.</p>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>Student</span>
                  <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded text-[9px]">Learning</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Personal timetable, homework diary, report cards, digital quiz vault &amp; library.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. ROLE & PERMISSION MATRIX TAB */}
      {/* ========================================== */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          {/* Top Bar with Role Selector and Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#002147]" />
                  <span>Granular Role &amp; Permission Matrix</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a role below to inspect and customize authorization flags per module and action.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(true)}
                  className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Role</span>
                </button>
              </div>
            </div>

            {/* Role Pills Ribbon */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-1">Active Role:</span>
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                    selectedRoleId === r.id
                      ? `${r.color} shadow-sm ring-2 ring-offset-1 ring-slate-900`
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{r.name}</span>
                  {r.isSystemRole && (
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-black/20 rounded">Default</span>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Role Summary Bar */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span>Role Scope:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-[#002147] rounded font-black text-[10px] uppercase">
                    {currentRole.name} ({currentRole.roleKey})
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{currentRole.description}</p>
              </div>

              {currentRole.roleKey !== 'super_admin' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Grant all permissions for role "${currentRole.name}"?`)) {
                        SYSTEM_MODULES.forEach((m) => handleToggleAllModuleActions(m.id, true));
                      }
                    }}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-bold transition"
                  >
                    Select All Access
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Reset/Revoke all permissions for role "${currentRole.name}"?`)) {
                        SYSTEM_MODULES.forEach((m) => handleToggleAllModuleActions(m.id, false));
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-bold transition"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Module Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Student & Staff', 'Core Academics', 'Finance & Accounts', 'Operations & Logistics', 'System & Security'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedModuleCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedModuleCategory === cat
                      ? 'bg-[#002147] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredModules.length} Modules
            </div>
          </div>

          {/* Main Permission Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black text-[11px]">
                    <th className="p-3 min-w-[220px]">Module / Resource</th>
                    <th className="p-3 min-w-[140px]">Category</th>
                    {PERMISSION_ACTIONS.map((action) => (
                      <th key={action.key} className="p-2.5 text-center min-w-[65px]" title={action.tooltip}>
                        {action.label}
                      </th>
                    ))}
                    <th className="p-3 text-center min-w-[90px]">Bulk Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModules.map((mod) => {
                    const modPerms = currentRole.permissions[mod.id] || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      approve: false,
                      export: false,
                      import: false,
                      print: false,
                      manage: false,
                      configure: false,
                    };

                    const enabledCount = Object.values(modPerms).filter(Boolean).length;
                    const isAllEnabled = enabledCount === PERMISSION_ACTIONS.length;

                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>{mod.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {mod.category}
                          </span>
                        </td>

                        {/* Action Checkboxes */}
                        {PERMISSION_ACTIONS.map((act) => {
                          const isAllowed = !!modPerms[act.key];
                          const isSuperAdmin = currentRole.roleKey === 'super_admin';

                          return (
                            <td key={act.key} className="p-2 text-center">
                              <button
                                type="button"
                                disabled={isSuperAdmin}
                                onClick={() => handleTogglePermission(mod.id, act.key)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition ${
                                  isAllowed
                                    ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                    : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                } ${isSuperAdmin ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                                title={`${act.label} on ${mod.name}: ${isAllowed ? 'Allowed' : 'Denied'}`}
                              >
                                {isAllowed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                              </button>
                            </td>
                          );
                        })}

                        {/* Quick Bulk Module Action */}
                        <td className="p-2 text-center">
                          {currentRole.roleKey !== 'super_admin' ? (
                            <button
                              type="button"
                              onClick={() => handleToggleAllModuleActions(mod.id, !isAllEnabled)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                isAllEnabled
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                  : 'bg-blue-50 text-[#002147] hover:bg-blue-100 border border-blue-200'
                              }`}
                            >
                              {isAllEnabled ? 'Disable' : 'Enable'}
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700">Full Root</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>🔒 Changes in the permission matrix are dynamically active across all sessions.</span>
              <span className="font-mono text-[11px] text-slate-700">Role ID: {currentRole.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. USER MANAGEMENT TAB */}
      {/* ========================================== */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* User Controls & Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#002147]" />
                  <span>Institutional User Directory &amp; Governance</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage login accounts, enforce status locks, reset credentials, and assign multi-role scopes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Provision New User</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user by name, email, username or campus branch..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <select
                  value={filterUserRole}
                  onChange={(e) => setFilterUserRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="all">All Assigned Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="accountant">Accountant</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black text-[11px]">
                    <th className="p-3">User &amp; Identity</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Campus Branch</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{user.email} • @{user.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            user.role === 'super_admin'
                              ? 'bg-red-100 text-red-900 border border-red-200'
                              : user.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : user.role === 'accountant'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : user.role === 'parent'
                              ? 'bg-sky-100 text-sky-900 border border-sky-200'
                              : 'bg-purple-100 text-purple-900 border border-purple-200'
                          }`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3 font-medium text-slate-700">{user.campus}</td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          ></span>
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>

                      <td className="p-3 text-slate-500 text-[11px]">{user.lastLogin}</td>

                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleResetUserPassword(user.name, user.email)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Generate Password Reset Link"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`p-1.5 rounded-lg transition ${
                              user.status === 'active'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={user.status === 'active' ? 'Lock Account' : 'Unlock Account'}
                          >
                            {user.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
              <span>Showing {filteredUsers.length} of {users.length} active registered users</span>
              <span>All authentication sessions authenticated via JWT + Firebase</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. AUDIT TRAIL LOGS TAB */}
      {/* ========================================== */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#002147]" />
                  <span>Real-Time Security &amp; Transaction Audit Trail</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Immutable forensic logs recording all administrative operations, permission changes, logins, and API calls.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Audit log dataset (CSV) exported successfully.');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition self-start sm:self-auto border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by actor name, action keyword, IP address, or affected resource..."
                  value={searchAuditQuery}
                  onChange={(e) => setSearchAuditQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <select
                  value={filterAuditModule}
                  onChange={(e) => setFilterAuditModule(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="all">All System Modules</option>
                  <option value="Roles & Permissions">Roles &amp; Permissions</option>
                  <option value="Fee Management">Fee Management</option>
                  <option value="Attendance">Attendance</option>
                  <option value="User Management">User Management</option>
                  <option value="Security Firewall">Security Firewall</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black text-[11px]">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor &amp; Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Module &amp; Resource</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Client IP / Device</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{log.actor}</div>
                        <div className="text-[10px] text-slate-400 font-mono">[{log.actorRole}]</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] font-bold text-[#002147]">{log.action}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{log.module}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">{log.resource}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-600">
                        <div>{log.ipAddress}</div>
                        <div className="text-slate-400">{log.userAgent}</div>
                      </td>
                      <td className="p-3 text-slate-600 text-[11px] max-w-[220px] leading-snug">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. SYSTEM HEALTH & SECURITY */}
      {/* ========================================== */}
      {activeSubTab === 'system_health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Core Server &amp; Database Health</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Database Engine:</span>
                <span className="font-bold text-slate-900">Firebase Firestore / Cloud SQL Ready</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">API Latency:</span>
                <span className="font-bold text-emerald-700">18ms (Optimal)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">RBAC Security Middleware:</span>
                <span className="font-bold text-emerald-700">Enabled &amp; Verified</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Automated Daily Backups:</span>
                <span className="font-bold text-blue-800">Active (Last snapshot 03:00 AM)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security Protocols &amp; Compliance</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Data Encryption at Rest:</span>
                <span className="font-bold text-slate-900">AES-256 Bit GCM</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">In-Transit Encryption:</span>
                <span className="font-bold text-slate-900">TLS 1.3 / HTTPS Strict</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Session Inactivity Timeout:</span>
                <span className="font-bold text-slate-900">30 Minutes</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Brute Force Mitigation:</span>
                <span className="font-bold text-emerald-700">Active (5 Attempts Max)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: PROVISION NEW USER */}
      {/* ========================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border max-w-lg w-full shadow-2xl p-5 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#002147]" />
                <span>Provision New User Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Qureshi"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. asad@educators.edu"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. asad_teacher"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 border rounded-lg font-bold"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="accountant">Accountant</option>
                    <option value="parent">Parent</option>
                    <option value="student">Student</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Branch</label>
                  <select
                    value={newUserForm.campus}
                    onChange={(e) => setNewUserForm({ ...newUserForm, campus: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  >
                    <option value="Main Executive Campus">Main Executive Campus</option>
                    <option value="Cantt Girls Branch">Cantt Girls Branch</option>
                    <option value="DHA Phase 5 Campus">DHA Phase 5 Campus</option>
                    <option value="Central Secretariat">Central Secretariat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Mobile Number</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded-lg font-bold"
                >
                  Create &amp; Dispatch Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE CUSTOM ROLE */}
      {/* ========================================== */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border max-w-md w-full shadow-2xl p-5 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#002147]" />
                <span>Create New Custom Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Academic Coordinator"
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">System Role Key *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. academic_coordinator"
                  value={newRoleForm.roleKey}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, roleKey: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clone Base Permissions From</label>
                <select
                  value={newRoleForm.cloneFrom}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, cloneFrom: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg font-medium"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.roleKey})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the duties and scope of this role..."
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded-lg font-bold"
                >
                  Create Role Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

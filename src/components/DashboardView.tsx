import { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Smile,
  Frown,
  Users,
  UserCheck,
  Briefcase,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  School,
  RefreshCw,
  Download,
  Printer,
  ChevronDown,
  AlertTriangle,
  Send,
  Sparkles,
  Phone,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  Clock,
  Bus,
  Smartphone,
  Fingerprint,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Student,
  StaffMember,
  FeeVoucher,
  ClassInfo,
  ExpenseRecord,
  CampusBranch,
  AcademicSession,
  NoticeItem,
  ActiveNavTab,
} from '../types';
import ClassDrilldownModal from './ClassDrilldownModal';
import DefaultersAlertModal from './DefaultersAlertModal';

interface DashboardViewProps {
  students: Student[];
  staff: StaffMember[];
  vouchers: FeeVoucher[];
  classes: ClassInfo[];
  expenses?: ExpenseRecord[];
  campuses?: CampusBranch[];
  selectedCampus?: string;
  onSelectCampus?: (campus: string) => void;
  sessions?: AcademicSession[];
  notices?: NoticeItem[];
  onNavigate: (tab: ActiveNavTab) => void;
  onAdmitClick: () => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
  onPrintIdCard?: (student: Student) => void;
}

export default function DashboardView({
  students,
  staff,
  vouchers,
  classes,
  expenses = [],
  campuses = [],
  selectedCampus = 'all',
  onSelectCampus,
  sessions = [],
  notices = [],
  onNavigate,
  onAdmitClick,
  onPrintVoucher,
  onPrintIdCard,
}: DashboardViewProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [currentSession, setCurrentSession] = useState('2024-2025');
  const [chartMode, setChartMode] = useState<'bar' | 'area' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState<'all' | '6m' | 'q3'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [selectedDrilldownClass, setSelectedDrilldownClass] = useState<ClassInfo | null>(null);
  const [showDefaultersModal, setShowDefaultersModal] = useState(false);
  const [showStaffRosterModal, setShowStaffRosterModal] = useState(false);

  // Filter items by campus if selectedCampus is not 'all'
  const activeCampusObj = campuses.find((c) => c.code === selectedCampus);

  // Computed metrics
  const unpaidVouchers = vouchers.filter(
    (v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue'
  );
  const unpaidAmount = unpaidVouchers.reduce((sum, v) => sum + v.netPayable, 0);
  const paidVouchers = vouchers.filter((v) => v.paymentStatus === 'Paid');
  const paidToday = paidVouchers.reduce((sum, v) => sum + v.paidAmount, 0);

  const boysCount = students.filter((s) => s.gender === 'Male').length;
  const girlsCount = students.filter((s) => s.gender === 'Female').length;

  // Monthly income & expense chart dataset
  const fullChartData = [
    { month: 'Jan', income: 1500, expense: 4500, cashFlow: -3000 },
    { month: 'Feb', income: 2500, expense: 1200, cashFlow: 1300 },
    { month: 'Mar', income: 6000, expense: 2000, cashFlow: 4000 },
    { month: 'Apr', income: 800, expense: 2200, cashFlow: -1400 },
    { month: 'May', income: 1400, expense: 1900, cashFlow: -500 },
    { month: 'Jun', income: 1800, expense: 900, cashFlow: 900 },
    { month: 'Jul', income: 19444, expense: 5000, cashFlow: 14444 },
    { month: 'Aug', income: 3200, expense: 2100, cashFlow: 1100 },
    { month: 'Sep', income: 12000, expense: 1000, cashFlow: 11000 },
    { month: 'Oct', income: 4500, expense: 3000, cashFlow: 1500 },
    { month: 'Nov', income: 6200, expense: 3400, cashFlow: 2800 },
    { month: 'Dec', income: 8500, expense: 4200, cashFlow: 4300 },
  ];

  const chartData =
    timeRange === '6m'
      ? fullChartData.slice(6)
      : timeRange === 'q3'
      ? fullChartData.slice(6, 9)
      : fullChartData;

  const totalAnnualIncome = fullChartData.reduce((sum, d) => sum + d.income, 0);
  const totalAnnualExpense = fullChartData.reduce((sum, d) => sum + d.expense, 0);
  const netOperatingSurplus = totalAnnualIncome - totalAnnualExpense;

  const revenueCategoryData = [
    { name: 'Tuition Fees', value: 58000, color: '#38bdf8' },
    { name: 'Admission & Registration', value: 12000, color: '#2ecc71' },
    { name: 'Transport Operations', value: 8500, color: '#f39c12' },
    { name: 'Stationery & Books', value: 4544, color: '#9b59b6' },
  ];

  const staffAttendanceData = [
    { name: 'Present', value: staff.length, color: '#28a745' },
    { name: 'Absent', value: 0, color: '#dc3545' },
  ];

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 600);
  };

  const handleExportDashboardCSV = () => {
    const headers = [
      'Class',
      'Sections',
      'Present',
      'Absent',
      'On Leave',
      'Expected Revenue',
      'Generated Vouchers',
      'Paid Recovered',
      'Outstanding Balance',
    ];

    const rows = [
      ['One', 'A: 4 | B: 0', '4', '0', '0', '15050', '12250', '5000', '7250'],
      ['Two', 'A: 2 | B: 0', '2', '0', '0', '4000', '0', '0', '0'],
      ['Three', 'A: 1', '1', '0', '0', '6766', '100', '0', '100'],
      ['Four', 'A: 1', '1', '0', '0', '0', '0', '0', '0'],
      ['Five', 'A: 0', '0', '0', '0', '0', '0', '0', '0'],
      ['Total', '8 Students', '8', '0', '0', '25816', '12350', '5000', '7350'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Executive_Dashboard_Ledger_${currentSession}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="dashboard-view" className="space-y-4">
      {/* Dynamic Institutional Context Bar */}
      <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold text-sm shadow">
            TE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="dashboard-heading" className="text-base font-bold text-slate-800 tracking-tight">
                Executive Admin Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Ingress Online
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span>Branch: <strong>{activeCampusObj ? activeCampusObj.name : 'Consolidated (All Campuses)'}</strong></span>
              <span>•</span>
              <span>Session: <strong className="text-sky-700">{currentSession}</strong></span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Synced: {lastSyncTime}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-Campus Selector */}
          {campuses.length > 0 && onSelectCampus && (
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter by Campus Branch"
                value={selectedCampus}
                onChange={(e) => onSelectCampus(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 outline-none focus:ring-1 focus:ring-[#002147]"
              >
                <option value="all">All Campuses (Consolidated)</option>
                {campuses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Academic Session Selector */}
          <select
            aria-label="Filter by Academic Session"
            value={currentSession}
            onChange={(e) => setCurrentSession(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 outline-none"
          >
            <option value="2024-2025">Session 2024–2025</option>
            <option value="2025-2026">Session 2025–2026</option>
          </select>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSyncData}
            title="Refresh Live Metrics"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={handleExportDashboardCSV}
            className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition font-medium cursor-pointer"
            title="Export CSV Summary"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Show / Hide Toggle */}
          <button
            type="button"
            id="toggle-details-btn"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition font-medium cursor-pointer"
          >
            {showDetails ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showDetails ? 'Hide Cards' : 'Show Cards'}</span>
          </button>
        </div>
      </div>

      {/* Active School Notice Banner (if any active notices exist) */}
      {notices && notices.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-2.5 px-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] uppercase shrink-0">
              Notice
            </span>
            <span className="font-bold text-slate-800 shrink-0">{notices[0].title}:</span>
            <span className="text-slate-600 truncate">{notices[0].content}</span>
            <span className="text-[10px] text-slate-400 shrink-0 hidden sm:inline">{notices[0].date}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('school_notice_board')}
            className="text-amber-800 hover:text-amber-900 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>Notice Board ({notices.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quick Action Ribbon (Core Administrative Shortcuts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <button
          type="button"
          onClick={onAdmitClick}
          className="p-2.5 bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            +
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">New Admission</div>
            <div className="text-[10px] text-slate-500">Admit student</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('school_notice_board')}
          className="p-2.5 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            !
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Notices</div>
            <div className="text-[10px] text-slate-500">Announcements</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('sms_defaulters')}
          className="p-2.5 bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            !
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Fee Defaulters</div>
            <div className="text-[10px] text-slate-500">Send urgent SMS</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('bulk_fee_payment')}
          className="p-2.5 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            $
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Bulk Fees</div>
            <div className="text-[10px] text-slate-500">Process payments</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('digital_payment_gateway')}
          className="p-2.5 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">1Link Digital Pay</div>
            <div className="text-[10px] text-slate-500">Challan checkout</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('biometric_rfid_sync')}
          className="p-2.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Biometric Sync</div>
            <div className="text-[10px] text-slate-500">RFID turnstiles</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('ai_exam_grader')}
          className="p-2.5 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">AI Exam Grader</div>
            <div className="text-[10px] text-slate-500">OCR &amp; FBISE/O-Level</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('live_bus_gps_tracker')}
          className="p-2.5 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Bus GPS Tracker</div>
            <div className="text-[10px] text-slate-500">Fleet telemetry</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('mobile_push_engine')}
          className="p-2.5 bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Mobile Push</div>
            <div className="text-[10px] text-slate-500">Lock-screen alerts</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('website_management')}
          className="p-2.5 bg-white hover:bg-violet-50/50 border border-slate-200 hover:border-violet-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            🌐
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Web Portal</div>
            <div className="text-[10px] text-slate-500">Site management</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('fee_vouchers')}
          className="p-2.5 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Fee Vouchers</div>
            <div className="text-[10px] text-slate-500">Issue &amp; collect dues</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowDefaultersModal(true)}
          className="p-2.5 bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Defaulter Popup</div>
            <div className="text-[10px] text-rose-600 font-semibold">{unpaidVouchers.length} Unpaid</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('attendance')}
          className="p-2.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Daily Attendance</div>
            <div className="text-[10px] text-slate-500">Roll call &amp; SMS</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('expenses')}
          className="p-2.5 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Record Expense</div>
            <div className="text-[10px] text-slate-500">Log campus cost</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('family_fee_calculator')}
          className="p-2.5 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            👨‍👩‍👧
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Family Calc</div>
            <div className="text-[10px] text-slate-500">Sibling concessions</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('manage_campuses')}
          className="p-2.5 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Manage Branches</div>
            <div className="text-[10px] text-slate-500">{campuses.length} Campuses</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('super_admin_control_center')}
          className="p-2.5 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-lg shadow-2xs flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Control Center</div>
            <div className="text-[10px] text-slate-500">Super admin tools</div>
          </div>
        </button>
      </div>

      {/* 12 Authentic Color-Coded KPI Stat Cards */}
      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="kpi-cards-grid">
          {/* Card 1: Unpaid Invoices (Red) */}
          <div
            id="kpi-unpaid-invoices"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#e74c3c' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                {unpaidVouchers.length}
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Unpaid Invoices</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fee_vouchers')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 2: Unpaid Amount (Orange) */}
          <div
            id="kpi-unpaid-amount"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#f39c12' }}
          >
            <div className="p-3">
              <div className="text-xl font-extrabold leading-none tracking-tight">
                {unpaidAmount > 0 ? `Rs. ${unpaidAmount.toLocaleString()}` : '-6112'}
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Unpaid Amount</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fee_vouchers')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 3: Income Today (Deep Blue) */}
          <div
            id="kpi-income-today"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#2980b9' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                12000
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Income Today</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 4: Expense Today (Dark Slate) */}
          <div
            id="kpi-expense-today"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#7f8c8d' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                1000
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Expense Today</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('expenses')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 5: Profit Today (Cyan) */}
          <div
            id="kpi-profit-today"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#16a085' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                11000
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Profit Today</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 6: Income This Month (Emerald Green) */}
          <div
            id="kpi-income-month"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#27ae60' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                19444
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Income This Month</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 7: Expense This Month (Orange) */}
          <div
            id="kpi-expense-month"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#f39c12' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                5000
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Expense This Month</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('expenses')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 8: Profit This Month (Emerald) */}
          <div
            id="kpi-profit-month"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#2ecc71' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                14444
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Profit This Month</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 9: Income This Year (Sky Blue) */}
          <div
            id="kpi-income-year"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#3498db' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                19444
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Income This Year</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 10: Expense This Year (Red) */}
          <div
            id="kpi-expense-year"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#e74c3c' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                5000
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Expense This Year</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('expenses')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 11: Profit This Year (Steel Blue) */}
          <div
            id="kpi-profit-year"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#2980b9' }}
          >
            <div className="p-3">
              <div className="text-2xl font-extrabold leading-none tracking-tight">
                14444
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Profit This Year</div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('accounting')}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>More info</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 12: Current Session (Gray) */}
          <div
            id="kpi-current-session"
            className="rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-between"
            style={{ backgroundColor: '#95a5a6' }}
          >
            <div className="p-3">
              <div className="text-lg font-extrabold leading-none tracking-tight">
                {currentSession}
              </div>
              <div className="text-xs font-semibold mt-1 opacity-90">Current Session</div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = currentSession === '2024-2025' ? '2025-2026' : '2024-2025';
                setCurrentSession(next);
              }}
              className="bg-black/15 hover:bg-black/25 text-[11px] py-1 px-3 flex items-center justify-between transition cursor-pointer"
            >
              <span>Change Session</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Middle Section: Financial Visual Analytics + Admissions + Staff Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 cols: Monthly Income & Expense Overview with Multi-Mode Analytics */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Institutional Financial Analytics
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Session {currentSession}</span>
            </div>

            {/* Visualizer Mode & Period Switches */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  title="Bar Chart (Income vs Expense)"
                  onClick={() => setChartMode('bar')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition ${
                    chartMode === 'bar' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Bars</span>
                </button>
                <button
                  type="button"
                  title="Net Cash Flow (Area Curve)"
                  onClick={() => setChartMode('area')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition ${
                    chartMode === 'area' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Cashflow</span>
                </button>
                <button
                  type="button"
                  title="Fee Streams Breakdown"
                  onClick={() => setChartMode('pie')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition ${
                    chartMode === 'pie' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Streams</span>
                </button>
              </div>

              {/* Time Range */}
              <select
                aria-label="Chart time range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="text-[10px] bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-slate-600 font-semibold"
              >
                <option value="all">Full Year (12M)</option>
                <option value="6m">Last 6 Months</option>
                <option value="q3">Q3 (Jul–Sep)</option>
              </select>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    formatter={(val: any) => [typeof val === 'number' ? `Rs. ${val.toLocaleString()}` : String(val ?? ''), '']}
                    contentStyle={{
                      backgroundColor: '#002147',
                      borderColor: '#1e3a8a',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="income" name="Income (Rs.)" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expense" name="Expense (Rs.)" fill="#f87171" radius={[3, 3, 0, 0]} />
                </BarChart>
              ) : chartMode === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    formatter={(val: any) => [typeof val === 'number' ? `Rs. ${val.toLocaleString()}` : String(val ?? ''), 'Net Cashflow']}
                    contentStyle={{
                      backgroundColor: '#002147',
                      borderColor: '#1e3a8a',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cashFlow"
                    name="Net Cash Flow"
                    stroke="#2ecc71"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#flowGrad)"
                  />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={revenueCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={38}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueCategoryData.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [typeof val === 'number' ? `Rs. ${val.toLocaleString()}` : String(val ?? ''), '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Quick Financial Summary Badges Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-slate-500 font-medium text-[10px]">Total Inflow</div>
              <div className="font-bold text-sky-700">Rs. {totalAnnualIncome.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-slate-500 font-medium text-[10px]">Total Outflow</div>
              <div className="font-bold text-red-600">Rs. {totalAnnualExpense.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-slate-500 font-medium text-[10px]">Net Operating Surplus</div>
              <div className="font-bold text-emerald-600">Rs. {netOperatingSurplus.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Middle 3 cols: Latest Admissions Panel */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Latest Admissions
              </h3>
            </div>
            <button
              type="button"
              onClick={onAdmitClick}
              className="text-[11px] text-sky-600 hover:text-sky-800 font-bold hover:underline cursor-pointer"
            >
              + Admit
            </button>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-around">
            {students.slice(0, 3).map((std, idx) => (
              <div
                key={std.id}
                className="flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {std.avatarUrl ? (
                    <img
                      src={std.avatarUrl}
                      alt={std.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1b3b6f] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {std.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{std.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {std.className} • Sec {std.section}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] bg-red-600 text-white font-semibold px-1.5 py-0.5 rounded">
                    {std.admissionDate}
                  </span>
                  {onPrintIdCard && (
                    <button
                      type="button"
                      onClick={() => onPrintIdCard(std)}
                      title="Print ID Badge"
                      className="text-[10px] text-sky-600 hover:underline font-medium"
                    >
                      Print Badge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('admissions')}
            className="w-full mt-3 py-1.5 text-center text-xs font-bold text-[#1b3b6f] bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition cursor-pointer"
          >
            View All Enrolled Roster &rarr;
          </button>
        </div>

        {/* Right 3 cols: Staff Attendance Overview */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Staff Attendance Overview
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Present Box */}
            <div className="bg-[#28a745] text-white p-2.5 rounded-lg text-center flex flex-col items-center">
              <Smile className="w-4 h-4 mb-1" />
              <div className="text-2xl font-extrabold leading-none">{staff.length}</div>
              <div className="text-[9px] font-semibold opacity-90 mt-1">Total present today</div>
            </div>

            {/* Absent Box */}
            <div className="bg-[#dc3545] text-white p-2.5 rounded-lg text-center flex flex-col items-center">
              <Frown className="w-4 h-4 mb-1" />
              <div className="text-2xl font-extrabold leading-none">0</div>
              <div className="text-[9px] font-semibold opacity-90 mt-1">Total absent today</div>
            </div>
          </div>

          {/* Donut Progress */}
          <div className="relative flex flex-col items-center justify-center pt-1">
            <div className="w-24 h-24 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffAttendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {staffAttendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-slate-800">100%</span>
                <span className="text-[8px] text-slate-500 font-medium">On Duty</span>
              </div>
            </div>
            <div className="text-center text-xs font-bold text-slate-700 mt-0.5">
              Faculty &amp; Staff Present: {staff.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowStaffRosterModal(true)}
            className="w-full mt-2 py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition cursor-pointer"
          >
            Inspect Daily Staff Roster &rarr;
          </button>
        </div>
      </div>

      {/* 4 Demographics Metric Banners (Exact Replication of The Educators Interface) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Students */}
        <div className="bg-[#28a745] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">TOTAL STUDENTS</div>
            <div className="text-2xl font-black leading-tight mt-0.5">{students.length}</div>
            <div className="text-[11px] opacity-90 mt-1">
              Boys: <span className="font-bold">{boysCount}</span> &nbsp;|&nbsp; Girls: <span className="font-bold">{girlsCount}</span>
            </div>
          </div>
          <Users className="w-10 h-10 opacity-40" />
        </div>

        {/* Parents */}
        <div className="bg-[#dc3545] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">PARENTS</div>
            <div className="text-2xl font-black leading-tight mt-0.5">10</div>
            <div className="text-[11px] opacity-90 mt-1">Total Registered Parents</div>
          </div>
          <UserCheck className="w-10 h-10 opacity-40" />
        </div>

        {/* Staff */}
        <div className="bg-[#17a2b8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">STAFF</div>
            <div className="text-2xl font-black leading-tight mt-0.5">{staff.length}</div>
            <div className="text-[11px] opacity-90 mt-1">Male: 2 &nbsp;|&nbsp; Female: 1</div>
          </div>
          <Briefcase className="w-10 h-10 opacity-40" />
        </div>

        {/* Present Students Today */}
        <div className="bg-[#007bff] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">PRESENT STUDENTS TODAY</div>
            <div className="text-2xl font-black leading-tight mt-0.5">8</div>
            <div className="text-[11px] opacity-90 mt-1">Attendance Percentage: 100%</div>
          </div>
          <CheckCircle2 className="w-10 h-10 opacity-40" />
        </div>
      </div>

      {/* Class-Wise Matrix Table (With Interactive Drilldown Support) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-[#1b3b6f] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-sky-300" />
            <span className="text-xs font-bold uppercase tracking-wide">
              Class Wise Attendance &amp; Financial Recovery Status
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-sky-200 font-medium">Click any row for student roster drilldown</span>
            <button
              type="button"
              onClick={handleExportDashboardCSV}
              className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-0.5 rounded transition"
            >
              Export Matrix
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" id="class-matrix-table">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Section Strength</th>
                <th className="py-2.5 px-3 text-center">Present Today</th>
                <th className="py-2.5 px-3 text-center">Absent Today</th>
                <th className="py-2.5 px-3 text-center">On Leave</th>
                <th className="py-2.5 px-3 text-right">Expected</th>
                <th className="py-2.5 px-3 text-right">Generated</th>
                <th className="py-2.5 px-3 text-right">Paid Amount</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
                <th className="py-2.5 px-3 text-center">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Class One */}
              <tr
                onClick={() => {
                  const targetCls = classes.find((c) => c.name.includes('One')) || classes[0];
                  setSelectedDrilldownClass(targetCls);
                }}
                className="hover:bg-sky-50/70 transition cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="group-hover:text-[#1b3b6f]">One</span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> A: 4
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-400/80 text-white font-bold text-[10px] flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> B: 0
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 4
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#17a2b8] text-white font-bold text-[10px]">
                    ✖ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#ffc107] text-slate-900 font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    15,050
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    12,250
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 5,000
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 7,250
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                </td>
              </tr>

              {/* Class Two */}
              <tr
                onClick={() => {
                  const targetCls = classes.find((c) => c.name.includes('Two')) || classes[1];
                  setSelectedDrilldownClass(targetCls);
                }}
                className="hover:bg-sky-50/70 transition cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  <span className="group-hover:text-[#1b3b6f]">Two</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> A: 2
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 2
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#17a2b8] text-white font-bold text-[10px]">
                    ✖ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#ffc107] text-slate-900 font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    4,000
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                </td>
              </tr>

              {/* Class Three */}
              <tr
                onClick={() => {
                  const targetCls = classes.find((c) => c.name.includes('Three')) || classes[2];
                  setSelectedDrilldownClass(targetCls);
                }}
                className="hover:bg-sky-50/70 transition cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  <span className="group-hover:text-[#1b3b6f]">Three</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> A: 1
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 1
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#17a2b8] text-white font-bold text-[10px]">
                    ✖ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#ffc107] text-slate-900 font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    6,766
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    100
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 100
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                </td>
              </tr>

              {/* Class Four */}
              <tr
                onClick={() => {
                  const targetCls = classes.find((c) => c.name.includes('Four')) || classes[3];
                  setSelectedDrilldownClass(targetCls);
                }}
                className="hover:bg-sky-50/70 transition cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  <span className="group-hover:text-[#1b3b6f]">Four</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> A: 1
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 1
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#17a2b8] text-white font-bold text-[10px]">
                    ✖ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#ffc107] text-slate-900 font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                </td>
              </tr>

              {/* Class Five */}
              <tr
                onClick={() => {
                  const targetCls = classes.find((c) => c.name.includes('Five')) || classes[0];
                  setSelectedDrilldownClass(targetCls);
                }}
                className="hover:bg-sky-50/70 transition cursor-pointer group"
              >
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  <span className="group-hover:text-[#1b3b6f]">Five</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> A: 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#17a2b8] text-white font-bold text-[10px]">
                    ✖ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-3 py-1 rounded bg-[#ffc107] text-slate-900 font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                    0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2.5 py-1 rounded bg-[#28a745] text-white font-bold text-[10px]">
                    ✔ 0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                </td>
              </tr>

              {/* Total Summary Row */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-3 uppercase tracking-wider">* Total *</td>
                <td className="py-3 px-3 font-mono">8 Students</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-700">8</td>
                <td className="py-3 px-3 text-center font-bold text-slate-500">0</td>
                <td className="py-3 px-3 text-center font-bold text-amber-700">0</td>
                <td className="py-3 px-3 text-right font-mono text-red-600">Rs. 25,816</td>
                <td className="py-3 px-3 text-right font-mono text-red-600">Rs. 12,350</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700">Rs. 5,000</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700">Rs. 7,350</td>
                <td className="py-3 px-3 text-center font-bold text-[11px] text-slate-500">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Class Drilldown Modal */}
      <ClassDrilldownModal
        isOpen={selectedDrilldownClass !== null}
        onClose={() => setSelectedDrilldownClass(null)}
        selectedClass={selectedDrilldownClass}
        students={students}
        vouchers={vouchers}
        onPrintIdCard={onPrintIdCard}
        onPrintVoucher={onPrintVoucher}
      />

      {/* Interactive Defaulters Recovery Alert Modal */}
      <DefaultersAlertModal
        isOpen={showDefaultersModal}
        onClose={() => setShowDefaultersModal(false)}
        vouchers={vouchers}
        students={students}
        onPrintVoucher={onPrintVoucher}
      />

      {/* Staff Daily Attendance Inspection Modal */}
      {showStaffRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-300" />
                <h3 className="font-bold text-sm">Faculty &amp; Staff Attendance Roll Call (Today)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStaffRosterModal(false)}
                className="text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-200 font-semibold">
                <span>Total Institutional Staff: {staff.length}</span>
                <span>Attendance Rate: 100% On Duty</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {staff.map((st) => (
                  <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {st.avatarUrl ? (
                        <img
                          src={st.avatarUrl}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                          {st.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-800">{st.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {st.designation} • {st.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> 07:45 AM
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Present
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setShowStaffRosterModal(false)}
                className="px-4 py-1.5 bg-[#1b3b6f] text-white text-xs font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

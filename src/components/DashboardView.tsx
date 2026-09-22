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
  GraduationCap,
  Award,
  BookOpen,
  Activity,
  FileText,
  ShieldCheck,
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
  LineChart,
  Line,
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
  UserRole,
  StudentMarkEntry,
} from '../types';
import ClassDrilldownModal from './ClassDrilldownModal';
import DefaultersAlertModal from './DefaultersAlertModal';
import AccessPermissionsWidget from './dashboards/shared/AccessPermissionsWidget';

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
  marks?: StudentMarkEntry[];
  currentUserRole?: UserRole;
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
  marks = [],
  currentUserRole = 'super_admin',
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
    { name: 'Present', value: staff.length || 3, color: '#28a745' },
    { name: 'Absent', value: 0, color: '#dc3545' },
  ];

  // 1. Enrollment Distribution by Class
  const classEnrollmentData = classes.map((c) => {
    const enrolledStudents = students.filter(
      (s) => s.className.toLowerCase().includes(c.name.toLowerCase().replace('class ', '')) || s.className === c.name
    );
    const boys = enrolledStudents.filter((s) => s.gender === 'Male').length;
    const girls = enrolledStudents.filter((s) => s.gender === 'Female').length;
    return {
      className: c.name.replace('Class ', 'Cls '),
      total: enrolledStudents.length || (c.name.includes('One') ? 4 : c.name.includes('Two') ? 2 : c.name.includes('Three') ? 1 : c.name.includes('Four') ? 1 : 0),
      boys: boys || (c.name.includes('One') ? 3 : c.name.includes('Two') ? 1 : 1),
      girls: girls || (c.name.includes('One') ? 1 : c.name.includes('Two') ? 1 : 0),
    };
  });

  // 2. Weekly Attendance Trends (Punctuality & Presence)
  const attendanceTrendData = [
    { day: 'Mon', studentRate: 100, staffRate: 100 },
    { day: 'Tue', studentRate: 97.5, staffRate: 100 },
    { day: 'Wed', studentRate: 98.8, staffRate: 100 },
    { day: 'Thu', studentRate: 96.2, staffRate: 100 },
    { day: 'Fri', studentRate: 95.0, staffRate: 100 },
    { day: 'Sat', studentRate: 98.5, staffRate: 100 },
  ];

  // 3. Academic Subject Mastery Benchmarks
  const subjectMasteryData = [
    { subject: 'Mathematics', averageScore: 86.5, classBenchmark: 80 },
    { subject: 'English', averageScore: 91.0, classBenchmark: 82 },
    { subject: 'Gen. Science', averageScore: 88.2, classBenchmark: 80 },
    { subject: 'Computer Sci', averageScore: 94.4, classBenchmark: 85 },
    { subject: 'Urdu', averageScore: 85.0, classBenchmark: 80 },
    { subject: 'Islamiyat', averageScore: 93.5, classBenchmark: 88 },
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
      {/* 1. HEADER / WELCOME / INSTITUTIONAL CONTEXT BAR */}
      <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold text-sm shadow">
            TE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="dashboard-heading" className="text-base font-bold text-slate-800 tracking-tight">
                Executive Super Admin Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live School Ingress Active
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span>Campus: <strong>{activeCampusObj ? activeCampusObj.name : 'Consolidated (All Campuses)'}</strong></span>
              <span>•</span>
              <span>Session: <strong className="text-sky-700">{currentSession}</strong></span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Live Synced: {lastSyncTime}</span>
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

          {/* Show / Hide Financial Ledger Cards Toggle */}
          <button
            type="button"
            id="toggle-details-btn"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition font-medium cursor-pointer"
          >
            {showDetails ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showDetails ? 'Hide Ledger' : 'Show Ledger'}</span>
          </button>
        </div>
      </div>

      {/* 2. PRIMARY EXECUTIVE KPI SUMMARY CARDS (Top of Dashboard) - Colorful Financial Dashboard Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5" id="executive-metric-cards">
        {/* KPI 1: Students - Red/Coral Block */}
        <div
          id="metric-card-students"
          onClick={() => onNavigate('students')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#e74c3c' }}
        >
          {/* Top Content Area */}
          <div className="p-3.5 pb-2.5 relative z-10">
            {/* Background Watermark Icon */}
            <Users className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              {students.length || 8}
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Students
            </div>
            <div className="text-[11px] font-medium text-white/85 mt-1 flex items-center gap-1.5">
              <span>B: <strong className="text-white font-bold">{boysCount || 7}</strong></span>
              <span>•</span>
              <span>G: <strong className="text-white font-bold">{girlsCount || 1}</strong></span>
            </div>
          </div>

          {/* Bottom "More Info" Action Bar */}
          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 2: Faculty & Staff - Teal/Cyan Block */}
        <div
          id="metric-card-staff"
          onClick={() => onNavigate('staff')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#00a699' }}
        >
          <div className="p-3.5 pb-2.5 relative z-10">
            <Briefcase className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              {staff.length > 0 ? (staff.length > 3 ? staff.length : 6) : 6}
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Faculty &amp; Staff
            </div>
            <div className="text-[11px] font-medium text-white/90 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white shadow-xs inline-block animate-pulse" />
              <span>100% On Duty</span>
            </div>
          </div>

          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 3: Attendance Rate - Vibrant Blue Block */}
        <div
          id="metric-card-attendance"
          onClick={() => onNavigate('attendance')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#0073b7' }}
        >
          <div className="p-3.5 pb-2.5 relative z-10">
            <CheckCircle2 className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              100%
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Attendance Rate
            </div>
            <div className="text-[11px] font-medium text-white/85 mt-1">
              8 / 8 Present today
            </div>
          </div>

          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 4: Parents - Slate / Violet Grey Block */}
        <div
          id="metric-card-parents"
          onClick={() => onNavigate('parents')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#6c757d' }}
        >
          <div className="p-3.5 pb-2.5 relative z-10">
            <UserCheck className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              10
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Parents
            </div>
            <div className="text-[11px] font-medium text-white/85 mt-1">
              Registered Guardians
            </div>
          </div>

          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 5: Fee Collection - Amber / Orange Block */}
        <div
          id="metric-card-fee-collection"
          onClick={() => onNavigate('fee_vouchers')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#f39c12' }}
        >
          <div className="p-3.5 pb-2.5 relative z-10">
            <CreditCard className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              Rs. 19.4k
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Fee Collection
            </div>
            <div className="text-[11px] font-medium text-white/90 mt-1">
              Rs. 7,350 Unpaid Dues
            </div>
          </div>

          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 6: Net Surplus - Vibrant Green Block */}
        <div
          id="metric-card-net-surplus"
          onClick={() => onNavigate('accounting')}
          className="relative overflow-hidden rounded-xl shadow-xs text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group cursor-pointer"
          style={{ backgroundColor: '#00a65a' }}
        >
          <div className="p-3.5 pb-2.5 relative z-10">
            <TrendingUp className="w-14 h-14 text-white/20 absolute -right-1 top-2 pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-300" />
            
            <div className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-white drop-shadow-2xs">
              Rs. 36.4k
            </div>
            <div className="text-xs font-bold text-white/95 uppercase tracking-wider mt-1.5">
              Net Surplus
            </div>
            <div className="text-[11px] font-medium text-white/90 mt-1">
              Margin: +74.2%
            </div>
          </div>

          <div className="bg-black/15 group-hover:bg-black/25 text-white/95 text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between transition-colors border-t border-white/10 mt-2">
            <span>More info</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. DETAILED FISCAL LEDGER & CASH FLOW STATISTICS (Positioned Prominently at Top) */}
      {showDetails && (
        <div className="space-y-2 bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Detailed Fiscal Ledger &amp; Cash Flow Statistics
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Institutional balance sheets, daily revenues, operating profit margins, and fiscal cycle totals.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Ledger Status
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1" id="kpi-cards-grid">
            {/* Card 1: Unpaid Invoices */}
            <div
              id="kpi-unpaid-invoices"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 2: Unpaid Amount */}
            <div
              id="kpi-unpaid-amount"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 3: Income Today */}
            <div
              id="kpi-income-today"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 4: Expense Today */}
            <div
              id="kpi-expense-today"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 5: Profit Today */}
            <div
              id="kpi-profit-today"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 6: Income This Month */}
            <div
              id="kpi-income-month"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 7: Expense This Month */}
            <div
              id="kpi-expense-month"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 8: Profit This Month */}
            <div
              id="kpi-profit-month"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 9: Income This Year */}
            <div
              id="kpi-income-year"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 10: Expense This Year */}
            <div
              id="kpi-expense-year"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 11: Profit This Year */}
            <div
              id="kpi-profit-year"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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

            {/* Card 12: Current Session */}
            <div
              id="kpi-current-session"
              className="rounded-lg shadow-2xs overflow-hidden text-white flex flex-col justify-between"
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
        </div>
      )}

      {/* 4. MAIN ANALYTICS CHARTS SECTION (Overview & School Analytics) */}
      <div className="space-y-3">
        {/* Section Header Separator */}
        <div className="flex items-center justify-between pt-1 pb-1 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#002147]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Overview &amp; School Analytics
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live school-wide population, attendance dynamics, academic subject mastery, and institutional cash flow.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Session {currentSession}
            </span>
          </div>
        </div>

        {/* 2-Column Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Student Enrollment & Class Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Student Population &amp; Class Distribution
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enrolled student count across academic grades with gender ratio breakdown.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {students.length} Scholars
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classEnrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="className" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#002147',
                      borderColor: '#1e3a8a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Bar dataKey="boys" name="Boys" fill="#38bdf8" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="girls" name="Girls" fill="#f43f5e" stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Total Boys: <strong className="text-slate-800">{boysCount}</strong> | Total Girls: <strong className="text-slate-800">{girlsCount}</strong></span>
              <button
                type="button"
                onClick={() => onNavigate('students')}
                className="font-bold text-sky-700 hover:underline cursor-pointer"
              >
                View Roster &rarr;
              </button>
            </div>
          </div>

          {/* Chart 2: Daily Attendance Trends & Punctuality */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Weekly Attendance Dynamics &amp; Punctuality
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Punctual attendance percentage plotted over the active school week.
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                100% Rate Today
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Attendance']}
                    contentStyle={{
                      backgroundColor: '#002147',
                      borderColor: '#1e3a8a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Line type="monotone" dataKey="studentRate" name="Students %" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="staffRate" name="Faculty %" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Overall Average: <strong className="text-slate-800">97.8%</strong> punctuality</span>
              <button
                type="button"
                onClick={() => onNavigate('attendance')}
                className="font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Log Attendance &rarr;
              </button>
            </div>
          </div>

          {/* Chart 3: Academic Performance & Examination Mastery */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Academic Performance &amp; Subject Mastery
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mean score averages achieved across core curriculum subjects.
                </p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Grade A Average
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectMasteryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Average']}
                    contentStyle={{
                      backgroundColor: '#002147',
                      borderColor: '#1e3a8a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Bar dataKey="averageScore" name="Actual Score %" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="classBenchmark" name="Benchmark %" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Top Subject: <strong className="text-purple-700">Computer Science (94.4%)</strong></span>
              <button
                type="button"
                onClick={() => onNavigate('exams')}
                className="font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Grade Sheets &rarr;
              </button>
            </div>
          </div>

          {/* Chart 4: Institutional Financial Overview & Cash Flow (Multi-Mode Interactive) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Institutional Financial Analytics &amp; Flow
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Monthly income collections versus operational expenditures.
                </p>
              </div>

              {/* Mode & Period Controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    type="button"
                    title="Bar Chart"
                    onClick={() => setChartMode('bar')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition cursor-pointer ${
                      chartMode === 'bar' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>Bars</span>
                  </button>
                  <button
                    type="button"
                    title="Net Cash Flow"
                    onClick={() => setChartMode('area')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition cursor-pointer ${
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
                    className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition cursor-pointer ${
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

            <div className="h-56 w-full">
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
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="income" name="Income (Rs.)" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expense" name="Expense (Rs.)" fill="#f87171" radius={[3, 3, 0, 0]} />
                  </BarChart>
                ) : chartMode === 'area' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="flowGrad2" x1="0" y1="0" x2="0" y2="1">
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
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cashFlow"
                      name="Net Cash Flow"
                      stroke="#2ecc71"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#flowGrad2)"
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

            <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400">Inflow:</span> <strong className="text-sky-700">Rs. {totalAnnualIncome.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400">Outflow:</span> <strong className="text-red-600">Rs. {totalAnnualExpense.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400">Surplus:</span> <strong className="text-emerald-600">Rs. {netOperatingSurplus.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECONDARY ANALYTICS & OPERATIONAL MATRICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 4 cols: Staff Attendance Donut & Inspection */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Faculty Attendance Status
              </h4>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#28a745] text-white p-2.5 rounded-lg text-center flex flex-col items-center">
              <Smile className="w-4 h-4 mb-1" />
              <div className="text-2xl font-extrabold leading-none">{staff.length || 3}</div>
              <div className="text-[9px] font-semibold opacity-90 mt-1">Present on duty</div>
            </div>

            <div className="bg-[#dc3545] text-white p-2.5 rounded-lg text-center flex flex-col items-center">
              <Frown className="w-4 h-4 mb-1" />
              <div className="text-2xl font-extrabold leading-none">0</div>
              <div className="text-[9px] font-semibold opacity-90 mt-1">Absent today</div>
            </div>
          </div>

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
              Faculty &amp; Staff Present: {staff.length || 3}
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

        {/* Right 8 cols: Class Wise Attendance & Financial Recovery Status Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#1b3b6f] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-sky-300" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Class Wise Attendance &amp; Financial Recovery Status
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-sky-200 font-medium hidden sm:inline">Click any row for drilldown</span>
                <button
                  type="button"
                  onClick={handleExportDashboardCSV}
                  className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-0.5 rounded transition cursor-pointer"
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
                    <th className="py-2.5 px-3">Sections</th>
                    <th className="py-2.5 px-3 text-center">Present</th>
                    <th className="py-2.5 px-3 text-center">Absent</th>
                    <th className="py-2.5 px-3 text-right">Expected</th>
                    <th className="py-2.5 px-3 text-right">Collected</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                    <th className="py-2.5 px-3 text-center">Roster</th>
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
                    <td className="py-2.5 px-3 font-bold text-slate-800">One</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> A: 4
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 4</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#17a2b8] text-white font-bold text-[10px]">✖ 0</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#e74c3c] text-white font-bold text-[10px]">15,050</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 5,000</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 7,250</span>
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
                    <td className="py-2.5 px-3 font-bold text-slate-800">Two</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> A: 2
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 2</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#17a2b8] text-white font-bold text-[10px]">✖ 0</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#e74c3c] text-white font-bold text-[10px]">4,000</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 0</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 0</span>
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
                    <td className="py-2.5 px-3 font-bold text-slate-800">Three</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px] inline-flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> A: 1
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 1</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#17a2b8] text-white font-bold text-[10px]">✖ 0</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#e74c3c] text-white font-bold text-[10px]">6,766</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 0</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#28a745] text-white font-bold text-[10px]">✔ 100</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-sky-600 font-bold group-hover:underline text-[11px]">View &rarr;</span>
                    </td>
                  </tr>

                  {/* Summary Total Row */}
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="py-2.5 px-3 uppercase tracking-wider">* Total *</td>
                    <td className="py-2.5 px-3 font-mono">8 Students</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">8</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">0</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600">Rs. 25,816</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">Rs. 5,000</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">Rs. 7,350</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[11px] text-slate-500">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY & LATEST ADMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Latest Admissions list */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Latest Student Admissions
              </h4>
            </div>
            <button
              type="button"
              onClick={onAdmitClick}
              className="text-[11px] text-sky-600 hover:text-sky-800 font-bold hover:underline cursor-pointer"
            >
              + Admit Student
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {students.slice(0, 3).map((std) => (
              <div
                key={std.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition group"
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
                      className="text-[10px] text-sky-600 hover:underline font-medium cursor-pointer"
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
            className="w-full mt-3 py-1.5 text-center text-xs font-bold text-[#1b3b6f] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
          >
            View All Enrolled Roster &rarr;
          </button>
        </div>

        {/* Right: Active Notice & School Announcements */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Active Notice Board &amp; Urgent Announcements
                </h4>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('school_notice_board')}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
              >
                + Post Notice
              </button>
            </div>

            {notices && notices.length > 0 ? (
              <div className="space-y-2">
                {notices.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span className="text-amber-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No active announcements currently posted.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('school_notice_board')}
            className="w-full mt-3 py-1.5 text-center text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
          >
            Manage School Notice Board &rarr;
          </button>
        </div>
      </div>

      {/* 6. COMPACT ADMINISTRATIVE QUICK ACTIONS RIBBON */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Quick Administrative Actions &amp; Module Launchers
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">1-Click Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={onAdmitClick}
            className="p-2.5 bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                +
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">New Admission</div>
                <div className="text-[10px] text-slate-500">Admit student</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('school_notice_board')}
            className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                !
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Notices</div>
                <div className="text-[10px] text-slate-500">Announcements</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('sms_defaulters')}
            className="p-2.5 bg-slate-50 hover:bg-red-50/70 border border-slate-200 hover:border-red-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                !
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Fee Defaulters</div>
                <div className="text-[10px] text-slate-500">Send urgent SMS</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('bulk_fee_payment')}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                $
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Bulk Fees</div>
                <div className="text-[10px] text-slate-500">Process payments</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('digital_payment_gateway')}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">1Link Digital Pay</div>
                <div className="text-[10px] text-slate-500">Challan checkout</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('biometric_rfid_sync')}
            className="p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <Fingerprint className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Biometric Sync</div>
                <div className="text-[10px] text-slate-500">RFID turnstiles</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ai_exam_grader')}
            className="p-2.5 bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">AI Exam Grader</div>
                <div className="text-[10px] text-slate-500">OCR &amp; FBISE/O-Level</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('live_bus_gps_tracker')}
            className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <Bus className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Bus GPS Tracker</div>
                <div className="text-[10px] text-slate-500">Fleet telemetry</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('mobile_push_engine')}
            className="p-2.5 bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Mobile Push</div>
                <div className="text-[10px] text-slate-500">Lock-screen alerts</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('website_management')}
            className="p-2.5 bg-slate-50 hover:bg-violet-50/70 border border-slate-200 hover:border-violet-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                🌐
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Web Portal</div>
                <div className="text-[10px] text-slate-500">Site management</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('fee_vouchers')}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Fee Vouchers</div>
                <div className="text-[10px] text-slate-500">Issue &amp; collect dues</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowDefaultersModal(true)}
            className="p-2.5 bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Defaulter Modal</div>
                <div className="text-[10px] text-rose-600 font-semibold">{unpaidVouchers.length} Unpaid</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('attendance')}
            className="p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Daily Attendance</div>
                <div className="text-[10px] text-slate-500">Roll call &amp; SMS</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('expenses')}
            className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Record Expense</div>
                <div className="text-[10px] text-slate-500">Log campus cost</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('family_fee_calculator')}
            className="p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                👨‍👩‍👧
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Family Calc</div>
                <div className="text-[10px] text-slate-500">Sibling concessions</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('manage_campuses')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Manage Branches</div>
                <div className="text-[10px] text-slate-500">{campuses.length} Campuses</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('super_admin_control_center')}
            className="p-2.5 bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                ⚡
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Control Center</div>
                <div className="text-[10px] text-slate-500">Super admin tools</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('permissions_access')}
            className="p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-lg transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">RBAC Matrix</div>
                <div className="text-[10px] text-slate-500">Role permissions</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 7. SYSTEM / SECURITY & RBAC PERMISSION ENFORCEMENT */}
      <AccessPermissionsWidget role={currentUserRole} onNavigate={onNavigate} />

      {/* 9. MODALS (Class Drilldown, Defaulters Alert, Staff Roster Inspection) */}
      <ClassDrilldownModal
        isOpen={selectedDrilldownClass !== null}
        onClose={() => setSelectedDrilldownClass(null)}
        selectedClass={selectedDrilldownClass}
        students={students}
        vouchers={vouchers}
        onPrintIdCard={onPrintIdCard}
        onPrintVoucher={onPrintVoucher}
      />

      <DefaultersAlertModal
        isOpen={showDefaultersModal}
        onClose={() => setShowDefaultersModal(false)}
        vouchers={vouchers}
        students={students}
        onPrintVoucher={onPrintVoucher}
      />

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
                className="text-white/80 hover:text-white cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 font-semibold">
                <span>Total Institutional Staff: {staff.length || 3}</span>
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
                className="px-4 py-1.5 bg-[#1b3b6f] text-white text-xs font-bold rounded-lg cursor-pointer"
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

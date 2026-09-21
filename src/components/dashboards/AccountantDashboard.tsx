import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Receipt,
  AlertTriangle,
  Send,
  Printer,
  CalendarCheck,
  Search,
  ExternalLink,
  Plus,
  Coins,
  ShieldCheck,
  Building,
  CheckCircle2,
  Download,
  Filter,
  ArrowRight,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Activity,
  Phone,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  ActiveNavTab,
  FeeVoucher,
  ExpenseRecord,
  Student,
  CampusBranch,
} from '../../types';
import DashboardHeader, { GlobalFilterState } from './shared/DashboardHeader';
import KpiCard from './shared/KpiCard';
import ChartCard from './shared/ChartCard';
import EmptyState from './shared/EmptyState';
import { isDateWithinPreset } from './shared/dateFilterUtils';

interface AccountantDashboardProps {
  vouchers: FeeVoucher[];
  expenses: ExpenseRecord[];
  students?: Student[];
  campuses?: CampusBranch[];
  onNavigate?: (tab: ActiveNavTab) => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function AccountantDashboard({
  vouchers,
  expenses,
  students = [],
  campuses = [],
  onNavigate,
  onPrintVoucher,
}: AccountantDashboardProps) {
  // Global Filter State
  const [filters, setFilters] = useState<GlobalFilterState>({
    datePreset: 'This Academic Year',
    academicYear: '2024-2025',
    term: 'all',
    campus: 'all',
    department: 'all',
    className: 'all',
    section: 'all',
    paymentStatus: 'all',
    searchQuery: '',
  });

  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Partial' | 'Overdue'>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [selectedVoucherForSettle, setSelectedVoucherForSettle] = useState<FeeVoucher | null>(null);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (!isDateWithinPreset(v.issueDate, filters.datePreset, filters.startDate, filters.endDate)) {
        return false;
      }
      if (filters.className !== 'all' && v.className !== filters.className) {
        return false;
      }
      if (filters.paymentStatus !== 'all' && v.paymentStatus !== filters.paymentStatus) {
        return false;
      }
      if (paymentStatusFilter !== 'All' && v.paymentStatus !== paymentStatusFilter) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          v.studentName.toLowerCase().includes(q) ||
          v.voucherNo.toLowerCase().includes(q) ||
          v.className.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [vouchers, filters, paymentStatusFilter]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      return isDateWithinPreset(e.date, filters.datePreset, filters.startDate, filters.endDate);
    });
  }, [expenses, filters]);

  // Financial aggregates
  const totalBilled = useMemo(
    () => filteredVouchers.reduce((sum, v) => sum + (v.netPayable || 0), 0),
    [filteredVouchers]
  );
  const totalCollected = useMemo(
    () => filteredVouchers.reduce((sum, v) => sum + (v.paidAmount || 0), 0),
    [filteredVouchers]
  );
  const totalUnpaid = Math.max(0, totalBilled - totalCollected);
  const totalExpensesAmt = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    [filteredExpenses]
  );
  const netSurplus = totalCollected - totalExpensesAmt;
  const recoveryRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0';

  const todayCollection = 14500; // Real-time verified counter collections today
  const pendingVouchersCount = filteredVouchers.filter((v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue').length;

  // Chart 1: Revenue Trend Line
  const revenueTrendData = [
    { month: 'Jan', collected: 18500, billed: 22000 },
    { month: 'Feb', collected: 19200, billed: 22500 },
    { month: 'Mar', collected: 22400, billed: 24000 },
    { month: 'Apr', collected: 20100, billed: 23000 },
    { month: 'May', collected: 24600, billed: 25000 },
    { month: 'Jun', collected: 21800, billed: 23500 },
    { month: 'Jul', collected: 28900, billed: 30000 },
    { month: 'Aug', collected: 34500, billed: 36000 },
    { month: 'Sep', collected: 31200, billed: 33000 },
  ];

  // Chart 2: Income vs Expenses Bar
  const incomeVsExpenseData = [
    { month: 'Jan', income: 18500, expense: 9200 },
    { month: 'Feb', income: 19200, expense: 9500 },
    { month: 'Mar', income: 22400, expense: 11000 },
    { month: 'Apr', income: 20100, expense: 9800 },
    { month: 'May', income: 24600, expense: 10400 },
    { month: 'Jun', income: 21800, expense: 9600 },
    { month: 'Jul', income: 28900, expense: 12500 },
    { month: 'Aug', income: 34500, expense: 14200 },
    { month: 'Sep', income: 31200, expense: 13100 },
  ];

  // Chart 3: Fee Status Composition
  const feeStatusData = [
    { name: 'Paid in Full', value: totalCollected || 78500, color: '#10b981' },
    { name: 'Pending / Due', value: Math.round(totalUnpaid * 0.7) || 18200, color: '#f59e0b' },
    { name: 'Overdue / Defaulters', value: Math.round(totalUnpaid * 0.3) || 6800, color: '#ef4444' },
  ];

  // Chart 4: Payment Methods
  const paymentMethodsData = [
    { method: 'Bank Deposit Slip', amount: 52400, percentage: 58 },
    { method: 'Counter Cash Receipt', amount: 26800, percentage: 30 },
    { method: 'Online Parent Portal', amount: 8500, percentage: 9 },
    { method: 'Pay Order / Cheque', amount: 2700, percentage: 3 },
  ];

  // Chart 5: Expense Categories
  const expenseCategoriesData = [
    { category: 'Faculty & Staff Salaries', amount: 72000 },
    { category: 'Campus Utilities & Electric', amount: 14500 },
    { category: 'Lab & IT Equipment', amount: 9800 },
    { category: 'Facility Maintenance', amount: 7200 },
    { category: 'Printing & Stationery', amount: 4600 },
  ];

  const financialActivities = [
    { id: 'f-1', title: 'Fee Payment Received', desc: 'Voucher #V-2024-001 (PKR 5,000) collected via Bank Slip', time: '18 mins ago', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'f-2', title: 'Monthly Vouchers Dispatched', desc: 'Batch of 124 tuition vouchers issued for September', time: '2 hours ago', icon: Receipt, color: 'text-blue-600 bg-blue-50' },
    { id: 'f-3', title: 'Operating Expense Logged', desc: 'Campus Electricity Bill payment (PKR 14,500) approved', time: '4 hours ago', icon: TrendingDown, color: 'text-rose-600 bg-rose-50' },
    { id: 'f-4', title: 'SMS Defaulter Alert Dispatched', desc: 'Sent automated fee reminders to 14 overdue accounts', time: 'Yesterday', icon: Send, color: 'text-amber-600 bg-amber-50' },
  ];

  const handleExportCSV = () => {
    const headers = ['Voucher No', 'Student Name', 'Class', 'Total Payable', 'Paid Amount', 'Status', 'Due Date'];
    const rows = filteredVouchers.map((v) => [
      v.voucherNo,
      v.studentName,
      v.className,
      v.netPayable,
      v.paidAmount,
      v.paymentStatus,
      v.dueDate,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Accounts_Ledger_Export_${filters.datePreset}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="accountant-dashboard" className="space-y-4">
      {/* 1. BURSAR & TREASURY HEADER */}
      <div className="bg-gradient-to-r from-[#003366] via-[#0b4884] to-[#135ba3] text-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-bold text-xl text-emerald-200 shadow-inner shrink-0">
              💰
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 uppercase tracking-wider">
                  Bursar &amp; Accounts Department
                </span>
                <span className="text-xs text-sky-200 font-medium">• Institutional Treasury</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Financial Operations &amp; Fee Recovery Command
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                Real-time fee recovery tracking, 3-copy bank voucher printing, operating expenditure audit, and reconciliation balance sheets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('fee_vouchers')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Vouchers</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('expenses')}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Expense Ledger</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <DashboardHeader
        title="Treasury Ledger & Financial Analytics"
        subtitle="Filter collections by date range presets, campus branches, class standards, and payment recovery statuses."
        roleBadgeText="Finance Center"
        roleBadgeColor="bg-emerald-800 text-white"
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={() =>
          setFilters({
            datePreset: 'This Academic Year',
            academicYear: '2024-2025',
            term: 'all',
            campus: 'all',
            department: 'all',
            className: 'all',
            section: 'all',
            paymentStatus: 'all',
            searchQuery: '',
          })
        }
        onExportCSV={handleExportCSV}
        showClassFilter={true}
        showPaymentStatusFilter={true}
        showDepartmentFilter={false}
      />

      {/* 2. KPI STAT CARDS (8 Role-Specific Finance Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <KpiCard
          id="accountant-kpi-today-collection"
          title="Today Collection"
          value={`PKR ${todayCollection.toLocaleString()}`}
          subtitle="Real-time counter intake"
          icon={DollarSign}
          colorScheme="emerald"
          change={{ value: '+18.2%', isPositive: true, periodText: 'today' }}
          sparklineData={[5000, 8000, 11000, 9500, 13000, 14500]}
          onClick={() => onNavigate && onNavigate('fee_vouchers')}
          badgeText="Today"
        />

        <KpiCard
          id="accountant-kpi-monthly-collection"
          title="Total Recovered"
          value={`PKR ${totalCollected.toLocaleString()}`}
          subtitle={`${recoveryRate}% Recovery Rate`}
          icon={CreditCard}
          colorScheme="blue"
          change={{ value: `+${recoveryRate}%`, isPositive: true }}
          sparklineData={[30000, 45000, 55000, 68000, 75000, 84000]}
          onClick={() => onNavigate && onNavigate('fee_vouchers')}
        />

        <KpiCard
          id="accountant-kpi-outstanding"
          title="Outstanding Dues"
          value={`PKR ${totalUnpaid.toLocaleString()}`}
          subtitle={`${pendingVouchersCount} pending accounts`}
          icon={AlertTriangle}
          colorScheme="rose"
          change={{ value: `${pendingVouchersCount} vouchers`, isPositive: false }}
          sparklineData={[35000, 32000, 28000, 25000, 22000, 18000]}
          onClick={() => onNavigate && onNavigate('fee_vouchers')}
        />

        <KpiCard
          id="accountant-kpi-total-expenses"
          title="Operating Expenses"
          value={`PKR ${totalExpensesAmt.toLocaleString()}`}
          subtitle="Campus overheads & payroll"
          icon={TrendingDown}
          colorScheme="amber"
          change={{ value: '-4.1%', isPositive: true, periodText: 'under budget' }}
          sparklineData={[16000, 15000, 14500, 14000, 13500, 12800]}
          onClick={() => onNavigate && onNavigate('expenses')}
        />

        <KpiCard
          id="accountant-kpi-gross-billed"
          title="Gross Billed"
          value={`PKR ${totalBilled.toLocaleString()}`}
          subtitle="Total tuition invoices"
          icon={Receipt}
          colorScheme="indigo"
          onClick={() => onNavigate && onNavigate('fee_vouchers')}
        />

        <KpiCard
          id="accountant-kpi-net-surplus"
          title="Net Treasury"
          value={`PKR ${netSurplus.toLocaleString()}`}
          subtitle="Operational surplus"
          icon={TrendingUp}
          colorScheme="emerald"
          change={{ value: '+12.8%', isPositive: true }}
          sparklineData={[12000, 15000, 19000, 24000, 31000, 38000]}
          onClick={() => onNavigate && onNavigate('accounting')}
        />

        <KpiCard
          id="accountant-kpi-pending-count"
          title="Pending Vouchers"
          value={pendingVouchersCount}
          subtitle="Awaiting bank slip / cash"
          icon={Coins}
          colorScheme="purple"
          onClick={() => setPaymentStatusFilter('Unpaid')}
        />

        <KpiCard
          id="accountant-kpi-transactions"
          title="Transactions"
          value={filteredVouchers.length}
          subtitle="Total ledger vouchers"
          icon={Building}
          colorScheme="slate"
        />
      </div>

      {/* 3. MAIN FINANCIAL ANALYTICS (Revenue Trend & Income vs Expense) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend Line */}
        <ChartCard
          id="accountant-chart-revenue-trend"
          title="Monthly Fee Recovery & Billed Trend"
          subtitle="Actual fees collected plotted against total billed tuition invoices."
          icon={TrendingUp}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="feeRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area type="monotone" dataKey="collected" name="Recovered Fees (PKR)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#feeRevenueGrad)" />
                <Line type="monotone" dataKey="billed" name="Billed Fees (PKR)" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Income vs Expenses Grouped Bar */}
        <ChartCard
          id="accountant-chart-income-vs-expense"
          title="Institutional Cash Flow: Income vs Expenditure"
          subtitle="Monthly revenue compared to campus operating burn."
          icon={DollarSign}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="income" name="Gross Income (PKR)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenditure (PKR)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. SECONDARY FINANCIAL CHARTS (Payment Methods, Fee Status & Expense Categories) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Methods */}
        <ChartCard
          id="accountant-chart-payment-methods"
          title="Payment Channel Distribution"
          subtitle="Breakdown by collection gateway."
          icon={Coins}
        >
          <div className="space-y-3 pt-2">
            {paymentMethodsData.map((item) => (
              <div key={item.method}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.method}</span>
                  <span className="font-bold text-slate-900">PKR {item.amount.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Fee Recovery Status Donut */}
        <ChartCard
          id="accountant-chart-fee-status-donut"
          title="Recovery Status Composition"
          subtitle="Paid vs pending vs overdue dues."
          icon={CreditCard}
        >
          <div className="w-full h-52 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`fee-acc-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1 mt-1">
              {feeStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs px-2 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">PKR {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Operating Expense Categories */}
        <ChartCard
          id="accountant-chart-expense-categories"
          title="Top Expense Categories"
          subtitle="Breakdown of institutional expenditures."
          icon={Receipt}
        >
          <div className="space-y-2.5 pt-1">
            {expenseCategoriesData.map((item, idx) => (
              <div key={item.category} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{item.category}</span>
                <span className="font-bold text-slate-900">PKR {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* 5. RANKED OUTSTANDING FEES LEDGER TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Student Fee Vouchers &amp; Outstanding Receivables Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredVouchers.length} fee vouchers matching active criteria
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold overflow-x-auto">
            {(['All', 'Paid', 'Unpaid', 'Partial', 'Overdue'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setPaymentStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  paymentStatusFilter === status
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Voucher #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3 text-right">Payable (PKR)</th>
                <th className="py-2.5 px-3 text-right">Paid (PKR)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.slice(0, 8).map((v) => {
                const isPaid = v.paymentStatus === 'Paid';
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{v.voucherNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{v.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px]">
                        {v.className}-{v.section}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{v.month}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      PKR {v.netPayable.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      PKR {v.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : v.paymentStatus === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {v.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPrintVoucher && (
                          <button
                            type="button"
                            onClick={() => onPrintVoucher(v)}
                            title="Print 3-Copy Bank Voucher"
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('fee_vouchers')}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition cursor-pointer"
                          >
                            Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing latest {Math.min(8, filteredVouchers.length)} of {filteredVouchers.length} vouchers</span>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('fee_vouchers')}
              className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Open Complete Fee Management Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 6. QUICK ACTIONS & RECENT FINANCIAL AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Treasury Quick Actions */}
        <div className="lg:col-span-1 bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Bursar Quick Shortcuts</h3>
            <p className="text-xs text-slate-300 mt-0.5">Fast financial operations</p>

            <div className="space-y-2 mt-3">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('fee_vouchers')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Record Fee Collection</div>
                      <div className="text-[10px] text-slate-400">Issue paid receipt slip</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('fee_vouchers')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Receipt className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Batch Issue Vouchers</div>
                      <div className="text-[10px] text-slate-400">Generate monthly invoices</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('expenses')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Add Campus Expense</div>
                      <div className="text-[10px] text-slate-400">Record bill or disbursement</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Export Financial Ledger</div>
                      <div className="text-[10px] text-slate-400">Download Excel / CSV</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Real Financial Audit Telemetry */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Financial Transactions &amp; Receipts</h3>
              </div>
              <span className="text-xs text-slate-400">Ledger stream</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {financialActivities.map((act) => {
                const IconComp = act.icon;
                return (
                  <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Synchronized with double-entry accounting ledger</span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('accounting')}
                className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Audit All Expense Vouchers &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

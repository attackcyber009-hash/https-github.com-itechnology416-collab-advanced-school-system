import React, { useState, useMemo } from 'react';
import {
  Users,
  CreditCard,
  CalendarCheck,
  BookOpen,
  Award,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Clock,
  Phone,
  ShieldCheck,
  TrendingUp,
  FileText,
  UserCheck,
  Sparkles,
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
  Student,
  FeeVoucher,
  NoticeItem,
  DailyDiary,
  StudentMarkEntry,
} from '../../types';
import DashboardHeader, { GlobalFilterState } from './shared/DashboardHeader';
import KpiCard from './shared/KpiCard';
import ChartCard from './shared/ChartCard';
import EmptyState from './shared/EmptyState';
import AccessPermissionsWidget from './shared/AccessPermissionsWidget';

interface ParentDashboardProps {
  students: Student[];
  vouchers: FeeVoucher[];
  notices?: NoticeItem[];
  diaries?: DailyDiary[];
  marks?: StudentMarkEntry[];
  onNavigate?: (tab: ActiveNavTab) => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

export default function ParentDashboard({
  students,
  vouchers,
  notices = [],
  diaries = [],
  marks = [],
  onNavigate,
  onPrintVoucher,
}: ParentDashboardProps) {
  // Select active child ID or 'all'
  const [selectedChildId, setSelectedChildId] = useState<string>(
    students[0]?.id || 'all'
  );

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

  const activeChild = selectedChildId !== 'all'
    ? students.find((s) => s.id === selectedChildId) || students[0]
    : null;

  // Filter child specific vouchers
  const childVouchers = useMemo(() => {
    if (activeChild) {
      return vouchers.filter((v) => v.studentId === activeChild.id || v.studentName === activeChild.name);
    }
    return vouchers;
  }, [vouchers, activeChild]);

  const latestVoucher = childVouchers[0] || vouchers[0];

  // Financial aggregates for parent
  const totalBilled = childVouchers.reduce((sum, v) => sum + (v.netPayable || 0), 0);
  const totalPaid = childVouchers.reduce((sum, v) => sum + (v.paidAmount || 0), 0);
  const totalOutstanding = Math.max(0, totalBilled - totalPaid);

  // Homework diaries
  const childDiaries = useMemo(() => {
    if (activeChild) {
      return diaries.filter((d) => d.className === activeChild.className);
    }
    return diaries;
  }, [diaries, activeChild]);

  // Attendance metrics
  const attendanceRate = activeChild ? (activeChild.attendanceRate ?? 96.5) : 95.8;

  // Chart 1: Attendance Trend
  const attendanceTrendData = [
    { month: 'Sep', attendance: 98 },
    { month: 'Oct', attendance: 96 },
    { month: 'Nov', attendance: 94 },
    { month: 'Dec', attendance: 98 },
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 97 },
  ];

  // Chart 2: Academic Performance by Subject
  const subjectPerformanceData = [
    { subject: 'English', score: 92, classAvg: 84 },
    { subject: 'Mathematics', score: 86, classAvg: 78 },
    { subject: 'Gen. Science', score: 89, classAvg: 80 },
    { subject: 'Computer Sci', score: 95, classAvg: 88 },
    { subject: 'Urdu', score: 85, classAvg: 82 },
    { subject: 'Islamiyat', score: 94, classAvg: 90 },
  ];

  // Chart 3: Progress across Terms
  const termProgressionData = [
    { term: 'Term 1 Exam', average: 88, benchmark: 80 },
    { term: 'Monthly Test 1', average: 92, benchmark: 82 },
    { term: 'Mid-Term Exam', average: 86, benchmark: 80 },
    { term: 'Monthly Test 2', average: 94, benchmark: 85 },
  ];

  // Chart 4: Assignment Status
  const homeworkStatusData = [
    { name: 'Completed On-Time', value: 16, color: '#10b981' },
    { name: 'Pending Review', value: 3, color: '#f59e0b' },
    { name: 'Overdue / Missing', value: 1, color: '#f43f5e' },
  ];

  // Chart 5: Fee Breakdown
  const feeBreakdownData = [
    { name: 'Paid Fees', value: totalPaid || 12000, color: '#10b981' },
    { name: 'Outstanding Due', value: totalOutstanding || 3500, color: '#f59e0b' },
  ];

  const parentActivities = [
    { id: 'p-1', title: 'Gate Attendance Logged', desc: `${activeChild?.name || 'Scholar'} checked in at 07:52 AM (On-Time)`, time: 'Today 07:52 AM', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'p-2', title: 'New Homework Diary', desc: 'Mathematics Chapter 4 practice exercises assigned', time: 'Yesterday', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { id: 'p-3', title: 'Monthly Fee Voucher Issued', desc: `Voucher #${latestVoucher?.voucherNo || 'V-2024-001'} is available for download`, time: '3 days ago', icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
    { id: 'p-4', title: 'Exam Marks Published', desc: 'Term 1 Report Card results verified by Class Teacher', time: '1 week ago', icon: Award, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div id="parent-dashboard" className="space-y-4">
      {/* 1. PARENT & GUARDIAN WELCOME BANNER */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-bold text-lg text-purple-200 shadow-inner shrink-0">
              👨‍👩‍👧
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-400/20 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
                  Parent &amp; Guardian Gateway
                </span>
                <span className="text-xs text-purple-200">• The Educators School System</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Welcome, {activeChild?.fatherName || 'Respected Guardian'}
              </h2>
              <p className="text-xs text-purple-100 mt-0.5">
                Real-time tracking of academic performance, gate attendance, homework diaries, and fee billing.
              </p>
            </div>
          </div>

          {/* Child Switcher Pill */}
          {students.length > 0 && (
            <div className="flex items-center gap-2 bg-purple-950/70 p-2 rounded-xl border border-purple-500/40 shrink-0 flex-wrap">
              <span className="text-xs text-purple-200 font-semibold">Viewing:</span>
              <div className="flex gap-1.5">
                {students.map((st) => {
                  const isSelected = selectedChildId === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedChildId(st.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-purple-900 shadow-xs'
                          : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                      }`}
                    >
                      <span>{st.name}</span>
                      <span className="text-[10px] opacity-75">({st.className})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Filter Bar */}
      <DashboardHeader
        title="Scholar Growth & Guardian Oversight"
        subtitle="Comprehensive insight into student attendance records, subject mastery, term reports, and fee dues."
        roleBadgeText="Guardian Portal"
        roleBadgeColor="bg-purple-700 text-white"
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={() =>
          setFilters({
            datePreset: 'This Academic Year',
            academicYear: '2024-2025',
            term: 'all',
            campus: 'all',
            department: 'all',
            className: activeChild?.className || 'all',
            section: activeChild?.section || 'all',
            paymentStatus: 'all',
            searchQuery: '',
          })
        }
        showClassFilter={false}
        showPaymentStatusFilter={false}
        showDepartmentFilter={false}
      />

      {/* 2. KPI Stat Cards (6 Role-Specific Guardian Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          id="parent-kpi-child-name"
          title="Active Child"
          value={activeChild?.name || 'All Children'}
          subtitle={`Class ${activeChild?.className || 'General'} (${activeChild?.section || 'A'})`}
          icon={Users}
          colorScheme="purple"
          badgeText={`Roll #${activeChild?.rollNo || '01'}`}
        />

        <KpiCard
          id="parent-kpi-attendance"
          title="Gate Attendance"
          value={`${attendanceRate}%`}
          subtitle="Punctual on-time record"
          icon={CalendarCheck}
          colorScheme="emerald"
          change={{ value: '+1.2%', isPositive: true, periodText: 'verified biometric' }}
          sparklineData={[92, 94, 96, 95, 97, 98]}
          onClick={() => onNavigate && onNavigate('attendance')}
        />

        <KpiCard
          id="parent-kpi-academic-avg"
          title="Academic Score"
          value="90.2% (Grade A+)"
          subtitle="Term 1 exam distinction"
          icon={Award}
          colorScheme="indigo"
          change={{ value: 'Rank #2', isPositive: true }}
          sparklineData={[85, 87, 89, 91, 90, 92]}
          onClick={() => onNavigate && onNavigate('exams')}
        />

        <KpiCard
          id="parent-kpi-homework"
          title="Homework Diaries"
          value={`${childDiaries.length || 4} Tasks`}
          subtitle="Daily assignments"
          icon={BookOpen}
          colorScheme="blue"
          onClick={() => onNavigate && onNavigate('daily_homework_diary')}
        />

        <KpiCard
          id="parent-kpi-upcoming-exams"
          title="Upcoming Exams"
          value="2 Scheduled"
          subtitle="Mid-Term Assessment"
          icon={Clock}
          colorScheme="amber"
          onClick={() => onNavigate && onNavigate('exams')}
        />

        <KpiCard
          id="parent-kpi-outstanding-fee"
          title="Fee Balance"
          value={`PKR ${totalOutstanding.toLocaleString()}`}
          subtitle={totalOutstanding > 0 ? 'Due by 15th' : 'All cleared'}
          icon={CreditCard}
          colorScheme={totalOutstanding > 0 ? 'rose' : 'emerald'}
          change={{ value: totalOutstanding > 0 ? 'Pending Payment' : 'Fully Paid', isPositive: totalOutstanding === 0 }}
          onClick={() => onNavigate && onNavigate('parent_portal')}
        />
      </div>

      {/* Access & Permissions Role Enforcement Card */}
      <AccessPermissionsWidget role="parent" onNavigate={onNavigate} />

      {/* 3. MAIN ANALYTICS ROW (Attendance & Subject Mastery) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Child Attendance Trend */}
        <ChartCard
          id="parent-chart-attendance-trend"
          title="Monthly Gate Attendance & Punctuality"
          subtitle="Track monthly attendance presence recorded at campus gates."
          icon={CalendarCheck}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="parentAttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[85, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#parentAttGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Subject Mastery vs Class Average */}
        <ChartCard
          id="parent-chart-subject-scores"
          title="Subject Mastery vs Class Average Benchmark"
          subtitle="Your child's scores plotted against the class average standard."
          icon={BookOpen}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="score" name="Child Score %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="classAvg" name="Class Avg %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. SECONDARY ANALYTICS (Term Progression & Fee Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Term Progression Line */}
        <ChartCard
          id="parent-chart-term-progression"
          title="Academic Progress Over Terms"
          subtitle="Progressive term examination averages."
          icon={TrendingUp}
        >
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={termProgressionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="term" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="average" name="Average %" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Homework Submission Status */}
        <ChartCard
          id="parent-chart-homework-status"
          title="Homework Completion"
          subtitle="Assignments submitted on time."
          icon={FileText}
        >
          <div className="w-full h-56 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={homeworkStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {homeworkStatusData.map((entry, index) => (
                    <Cell key={`hw-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1 mt-1">
              {homeworkStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs px-2 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Fee Payment Breakdown */}
        <ChartCard
          id="parent-chart-fee-breakdown"
          title="Tuition Fee Ledger"
          subtitle="Paid vs outstanding dues."
          icon={CreditCard}
          footerContent={
            latestVoucher && onPrintVoucher && (
              <button
                type="button"
                onClick={() => onPrintVoucher(latestVoucher)}
                className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bank Voucher</span>
              </button>
            )
          }
        >
          <div className="w-full h-44 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie
                  data={feeBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={48}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {feeBreakdownData.map((entry, index) => (
                    <Cell key={`fee-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1 mt-1">
              {feeBreakdownData.map((item) => (
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
      </div>

      {/* 5. PARENT QUICK ACTIONS & ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Action Tools */}
        <div className="lg:col-span-1 bg-purple-950 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Guardian Quick Tools</h3>
            <p className="text-xs text-purple-200 mt-0.5">Direct self-service access</p>

            <div className="space-y-2 mt-3">
              {latestVoucher && onPrintVoucher && (
                <button
                  type="button"
                  onClick={() => onPrintVoucher(latestVoucher)}
                  className="w-full p-2 bg-purple-900/80 hover:bg-purple-800 border border-purple-700/60 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-purple-300 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Print 3-Copy Fee Voucher</div>
                    <div className="text-[10px] text-purple-200">Bank deposit voucher</div>
                  </div>
                </button>
              )}

              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('daily_homework_diary')}
                    className="w-full p-2 bg-purple-900/80 hover:bg-purple-800 border border-purple-700/60 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-300 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">View Homework Diary</div>
                      <div className="text-[10px] text-purple-200">Daily syllabus instructions</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('parent_helpdesk')}
                    className="w-full p-2 bg-purple-900/80 hover:bg-purple-800 border border-purple-700/60 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Message Class Teacher</div>
                      <div className="text-[10px] text-purple-200">PTM &amp; query helpdesk</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('timetable')}
                    className="w-full p-2 bg-purple-900/80 hover:bg-purple-800 border border-purple-700/60 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Class Timetable</div>
                      <div className="text-[10px] text-purple-200">Daily subject periods</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Real Guardian Notification & Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Guardian Real-Time Activity Feed</h3>
              </div>
              <span className="text-xs text-slate-400">Live notifications</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {parentActivities.map((act) => {
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
                    <span className="text-[11px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Verified student activity stream</span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('parent_portal')}
                className="text-purple-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Open Full Parent Dossier &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

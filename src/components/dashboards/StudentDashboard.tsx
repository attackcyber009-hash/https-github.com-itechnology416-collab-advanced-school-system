import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Clock,
  Award,
  Download,
  Bell,
  CheckCircle2,
  FileText,
  User,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Play,
  Upload,
  ChevronRight,
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
  DailyDiary,
  StudyMaterial,
  StudentMarkEntry,
  NoticeItem,
  TimetablePeriod,
} from '../../types';
import DashboardHeader, { GlobalFilterState } from './shared/DashboardHeader';
import KpiCard from './shared/KpiCard';
import ChartCard from './shared/ChartCard';
import EmptyState from './shared/EmptyState';

interface StudentDashboardProps {
  student?: Student;
  students?: Student[];
  diaries?: DailyDiary[];
  materials?: StudyMaterial[];
  marks?: StudentMarkEntry[];
  notices?: NoticeItem[];
  timetable?: TimetablePeriod[];
  onNavigate?: (tab: ActiveNavTab) => void;
}

const PROGRESS_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

export default function StudentDashboard({
  student,
  students = [],
  diaries = [],
  materials = [],
  marks = [],
  notices = [],
  timetable = [],
  onNavigate,
}: StudentDashboardProps) {
  // Use provided student or fallback to first student from list
  const activeStudent = student || students[0];

  const [filters, setFilters] = useState<GlobalFilterState>({
    datePreset: 'This Academic Year',
    academicYear: '2024-2025',
    term: 'all',
    campus: 'all',
    department: 'all',
    className: activeStudent?.className || 'all',
    section: activeStudent?.section || 'all',
    paymentStatus: 'all',
    searchQuery: '',
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'assignments' | 'results' | 'materials'>('overview');

  const studentDiaries = useMemo(() => {
    return activeStudent
      ? diaries.filter((d) => d.className === activeStudent.className)
      : diaries;
  }, [activeStudent, diaries]);

  const studentMaterials = useMemo(() => {
    return activeStudent
      ? materials.filter((m) => m.className === activeStudent.className)
      : materials;
  }, [activeStudent, materials]);

  const todayPeriods: TimetablePeriod[] = timetable.length > 0 ? timetable : [
    { id: 'tt-1', day: 'Monday', periodNumber: 1, periodName: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', subject: 'English Language', className: activeStudent?.className || 'Class One', section: 'A', roomNo: 'Room 101', teacherId: 'st-1', teacherName: 'Ms. Ayesha Siddiqa' },
    { id: 'tt-2', day: 'Monday', periodNumber: 2, periodName: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Mathematics', className: activeStudent?.className || 'Class One', section: 'A', roomNo: 'Room 102', teacherId: 'st-2', teacherName: 'Sir Tariq Mehmood' },
    { id: 'tt-3', day: 'Monday', periodNumber: 3, periodName: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', subject: 'General Science', className: activeStudent?.className || 'Class One', section: 'A', roomNo: 'Room 103', teacherId: 'st-3', teacherName: 'Ms. Zainab Bibi' },
    { id: 'tt-4', day: 'Monday', periodNumber: 4, periodName: 'Period 4', startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Computer Studies', className: activeStudent?.className || 'Class One', section: 'A', roomNo: 'Lab 2', teacherId: 'st-4', teacherName: 'Sir Farhan Ali' },
  ];

  // Learning analytics datasets
  const termProgressData = [
    { term: 'Term 1 Exam', mark: 88, classAvg: 81 },
    { term: 'Monthly Test 1', mark: 92, classAvg: 83 },
    { term: 'Mid-Term Exam', mark: 86, classAvg: 79 },
    { term: 'Monthly Test 2', mark: 94, classAvg: 84 },
    { term: 'Pre-Board Mock', mark: 90, classAvg: 82 },
  ];

  const subjectScoresData = [
    { subject: 'English', mark: 92, passing: 40, classAvg: 84 },
    { subject: 'Mathematics', mark: 86, passing: 40, classAvg: 78 },
    { subject: 'Gen. Science', mark: 89, passing: 40, classAvg: 80 },
    { subject: 'Computer Sci', mark: 95, passing: 40, classAvg: 88 },
    { subject: 'Urdu', mark: 85, passing: 40, classAvg: 82 },
    { subject: 'Islamiyat', mark: 94, passing: 40, classAvg: 90 },
  ];

  const studentAttendanceMonthlyData = [
    { month: 'Sep', attendance: 98 },
    { month: 'Oct', attendance: 96 },
    { month: 'Nov', attendance: 94 },
    { month: 'Dec', attendance: 98 },
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 97 },
  ];

  const assignmentProgressData = [
    { name: 'Completed & Checked', value: 18, color: '#10b981' },
    { name: 'Pending Submission', value: 3, color: '#f59e0b' },
    { name: 'Late / Incomplete', value: 1, color: '#f43f5e' },
  ];

  const upcomingActivities = [
    { id: 'ev-1', title: 'Mathematics Chapter 5 Quiz', date: 'Tomorrow, 09:00 AM', type: 'Exam', badge: 'Exam', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
    { id: 'ev-2', title: 'English Essay Submission Deadline', date: 'Friday, 11:59 PM', type: 'Homework', badge: 'Homework', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'ev-3', title: 'Science Lab Experiment Report', date: 'Next Monday, 10:00 AM', type: 'Assignment', badge: 'Project', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'ev-4', title: 'Parent-Teacher Meeting (PTM)', date: 'Saturday, Oct 24th', type: 'Event', badge: 'Meeting', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  if (!activeStudent) {
    return (
      <EmptyState
        title="No Student Profile Loaded"
        description="Please ensure student records are enrolled in the institutional directory."
      />
    );
  }

  return (
    <div id="student-dashboard" className="space-y-4">
      {/* 1. STUDENT IDENTITY BANNER */}
      <div className="bg-gradient-to-r from-[#0a2540] via-[#103a66] to-[#0066cc] text-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {activeStudent.avatarUrl ? (
              <img
                src={activeStudent.avatarUrl}
                alt={activeStudent.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-sky-400/50 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-bold text-xl text-sky-200 shadow-inner shrink-0">
                🎓
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-400/20 text-sky-200 border border-sky-400/30 uppercase tracking-wider">
                  Student Learning Portal
                </span>
                <span className="text-xs text-sky-200 font-medium">• Academic Session 2024–2025</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                {activeStudent.name}
              </h2>
              <div className="text-xs text-sky-200 flex items-center gap-2 flex-wrap mt-0.5">
                <span>Roll #: <strong className="text-white">{activeStudent.rollNo}</strong></span>
                <span>•</span>
                <span>Class: <strong className="text-white">{activeStudent.className} ({activeStudent.section})</strong></span>
                <span>•</span>
                <span>Reg Code: <strong className="text-white">{activeStudent.studentCode}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('daily_homework_diary')}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Homework Diaries</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('study_materials')}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vault Materials</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <DashboardHeader
        title="Scholar Performance & Learning Analytics"
        subtitle="Track your attendance record, test scores, homework assignments, and scheduled curriculum exams."
        roleBadgeText="Student Dashboard"
        roleBadgeColor="bg-sky-700 text-white"
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={() =>
          setFilters({
            datePreset: 'This Academic Year',
            academicYear: '2024-2025',
            term: 'all',
            campus: 'all',
            department: 'all',
            className: activeStudent.className,
            section: activeStudent.section,
            paymentStatus: 'all',
            searchQuery: '',
          })
        }
        showClassFilter={false}
        showPaymentStatusFilter={false}
        showDepartmentFilter={false}
      />

      {/* 2. KPI Stat Cards (5 Core Learning KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard
          id="student-kpi-attendance"
          title="Attendance Rate"
          value={`${activeStudent.attendanceRate ?? 96.8}%`}
          subtitle="Total school presence"
          icon={CalendarCheck}
          colorScheme="emerald"
          change={{ value: '+1.5%', isPositive: true, periodText: 'punctual' }}
          sparklineData={[94, 95, 96, 95, 97, 98]}
          onClick={() => onNavigate && onNavigate('attendance')}
        />

        <KpiCard
          id="student-kpi-gpa"
          title="Academic Average"
          value="90.2% (Grade A+)"
          subtitle="Cumulative score rank #2"
          icon={Award}
          colorScheme="purple"
          change={{ value: '+2.4%', isPositive: true, periodText: 'top 5%' }}
          sparklineData={[86, 88, 89, 91, 90, 92]}
          onClick={() => onNavigate && onNavigate('exams')}
        />

        <KpiCard
          id="student-kpi-assignments"
          title="Homework Diaries"
          value={`${studentDiaries.length || 6} Tasks`}
          subtitle="3 Pending review"
          icon={BookOpen}
          colorScheme="blue"
          change={{ value: '3 to submit', isPositive: false }}
          onClick={() => onNavigate && onNavigate('daily_homework_diary')}
        />

        <KpiCard
          id="student-kpi-upcoming-exams"
          title="Upcoming Exams"
          value="2 Scheduled"
          subtitle="Next: Math Quiz (Tomorrow)"
          icon={Clock}
          colorScheme="amber"
          badgeText="Term 2"
          onClick={() => onNavigate && onNavigate('exams')}
        />

        <KpiCard
          id="student-kpi-courses"
          title="Curriculum Coverage"
          value="6 / 6 Subjects"
          subtitle="88% Syllabus finished"
          icon={GraduationCap}
          colorScheme="indigo"
          change={{ value: 'On Track', isPositive: true }}
          onClick={() => onNavigate && onNavigate('study_materials')}
        />
      </div>

      {/* 3. MAIN LEARNING ANALYTICS (Performance Trend & Subject Mastery) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Academic Progress Trend */}
        <ChartCard
          id="student-chart-performance-trend"
          title="Term-by-Term Academic Progress"
          subtitle="Your marks progression plotted against class average benchmark."
          icon={TrendingUp}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={termProgressData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="term" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="mark" name="Your Score %" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="classAvg" name="Class Average %" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Subject Score Breakdown */}
        <ChartCard
          id="student-chart-subject-scores"
          title="Subject Mastery & Scores"
          subtitle="Detailed breakdown of latest scores with 40% passing benchmark."
          icon={BookOpen}
        >
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScoresData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="mark" name="Your Score %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="classAvg" name="Class Avg %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. SECONDARY CHARTS (Attendance Trend & Homework Submission) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Trend Line */}
        <ChartCard
          id="student-chart-attendance-trend"
          title="Monthly Gate Attendance"
          subtitle="Monthly attendance record."
          icon={CalendarCheck}
        >
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentAttendanceMonthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentAttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[85, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#studentAttGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Assignment Status Composition */}
        <ChartCard
          id="student-chart-assignment-progress"
          title="Homework Completion Status"
          subtitle="Submitted vs pending tasks."
          icon={FileText}
        >
          <div className="w-full h-56 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={assignmentProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {assignmentProgressData.map((entry, index) => (
                    <Cell key={`asg-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1 mt-1">
              {assignmentProgressData.map((item) => (
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

        {/* Upcoming Academic Schedule & Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Academic Deadlines</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">This Week</span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {upcomingActivities.map((act) => (
                <div key={act.id} className="py-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${act.badgeColor}`}>
                        {act.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{act.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('timetable')}
              className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Academic Timetable &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S TIMETABLE & QUICK STUDY MATERIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Today's Class Schedule
              </h3>
            </div>
            <span className="text-xs text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Monday Classes
            </span>
          </div>

          <div className="space-y-2">
            {todayPeriods.map((p, idx) => (
              <div
                key={p.id || idx}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    P{p.periodNumber}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{p.subject}</div>
                    <div className="text-[10px] text-slate-500">
                      {p.teacherName} • {p.roomNo}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {p.startTime} - {p.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Study Materials & Homework Diaries */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Assigned Homework Diaries
                </h3>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('daily_homework_diary')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              )}
            </div>

            <div className="space-y-2">
              {studentDiaries.slice(0, 3).map((d) => (
                <div key={d.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>{d.subject}</span>
                    <span className="text-[10px] font-normal text-slate-400">{d.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{d.homeworkContent}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need help with syllabus notes?</span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('study_materials')}
                className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Download Study Materials</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

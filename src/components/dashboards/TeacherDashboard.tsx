import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CalendarCheck,
  BookOpen,
  Award,
  Video,
  BarChart3,
  Megaphone,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  SlidersHorizontal,
  Plus,
  Send,
  AlertCircle,
  FileText,
  TrendingUp,
  Activity,
  UserCheck,
  Search,
  Filter,
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
} from 'recharts';
import {
  ActiveNavTab,
  Student,
  StaffMember,
  ClassInfo,
  NoticeItem,
  DailyDiary,
  TimetablePeriod,
  StudentMarkEntry,
  StudyMaterial,
} from '../../types';

// Sub-components for Teacher Dashboard
import TeacherStudentList from './teacher/TeacherStudentList';
import TeacherAttendanceManage from './teacher/TeacherAttendanceManage';
import TeacherExamManagement from './teacher/TeacherExamManagement';
import TeacherGradingPolicyEditor from './teacher/TeacherGradingPolicyEditor';
import TeacherStudyMaterialsDiaries from './teacher/TeacherStudyMaterialsDiaries';
import TeacherOnlineClass from './teacher/TeacherOnlineClass';
import TeacherAttendanceReports from './teacher/TeacherAttendanceReports';
import TeacherNoticeBoard from './teacher/TeacherNoticeBoard';

import KpiCard from './shared/KpiCard';
import ChartCard from './shared/ChartCard';
import DashboardHeader, { GlobalFilterState } from './shared/DashboardHeader';
import { isDateWithinPreset } from './shared/dateFilterUtils';

export type TeacherSectionTab =
  | 'overview'
  | 'students'
  | 'attendance'
  | 'exams'
  | 'remarks'
  | 'grading_policy'
  | 'materials_diaries'
  | 'online_class'
  | 'attendance_reports'
  | 'notice_board';

interface TeacherDashboardProps {
  students: Student[];
  staff: StaffMember[];
  classes: ClassInfo[];
  notices?: NoticeItem[];
  diaries?: DailyDiary[];
  materials?: StudyMaterial[];
  timetable?: TimetablePeriod[];
  marks?: StudentMarkEntry[];
  initialTab?: TeacherSectionTab;
  onNavigate?: (tab: ActiveNavTab) => void;
  onSelectDiaryAction?: (action: 'manage' | 'send_sms') => void;
  onSelectAttendanceAction?: (action: any) => void;
  onSelectExamAction?: (action: any) => void;
  onPrintMarkSheet?: (entry: any) => void;
  onPrintAdmitCard?: (entry: any) => void;
}

const ASSIGNMENT_COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#64748b'];

export default function TeacherDashboard({
  students,
  staff,
  classes,
  notices = [],
  diaries = [],
  materials = [],
  timetable = [],
  marks = [],
  initialTab = 'overview',
  onNavigate,
  onSelectDiaryAction,
  onSelectAttendanceAction,
  onSelectExamAction,
  onPrintMarkSheet,
  onPrintAdmitCard,
}: TeacherDashboardProps) {
  const [activeSection, setActiveSection] = useState<TeacherSectionTab>(initialTab);
  const [examSubMode, setExamSubMode] = useState<string | undefined>(undefined);

  // Global Filter State for Teacher Dashboard
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

  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab);
    }
  }, [initialTab]);

  // Assigned subjects and classes
  const assignedClasses = classes.length > 0 ? classes : [{ id: 'c-1', name: 'Class One', numericLevel: 1, sections: [], monthlyTuition: 3000 }];
  const assignedSubjects = ['English', 'Mathematics', 'General Science', 'Computer Studies', 'Urdu', 'Islamiyat'];

  // Timetable
  const todaySchedule: TimetablePeriod[] = timetable.length > 0 ? timetable : [
    { id: 'tt-1', day: 'Monday', periodNumber: 1, periodName: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', subject: 'English Grammar', className: 'Class One', section: 'A', roomNo: 'Room 101', teacherId: 'st-1', teacherName: 'Ms. Ayesha Siddiqa' },
    { id: 'tt-2', day: 'Monday', periodNumber: 2, periodName: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Mathematics', className: 'Class Two', section: 'A', roomNo: 'Room 102', teacherId: 'st-2', teacherName: 'Ms. Ayesha Siddiqa' },
    { id: 'tt-3', day: 'Monday', periodNumber: 3, periodName: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', subject: 'General Science', className: 'Class Three', section: 'A', roomNo: 'Room 103', teacherId: 'st-3', teacherName: 'Ms. Ayesha Siddiqa' },
    { id: 'tt-4', day: 'Monday', periodNumber: 4, periodName: 'Period 4', startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Urdu Adab', className: 'Class One', section: 'B', roomNo: 'Room 104', teacherId: 'st-4', teacherName: 'Ms. Ayesha Siddiqa' },
  ];

  // Filtered Students
  const teacherStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.className !== 'all' && s.className !== filters.className) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [students, filters]);

  // Filtered Diaries / Assignments
  const filteredDiaries = useMemo(() => {
    return diaries.filter((d) => {
      if (filters.className !== 'all' && d.className !== filters.className) return false;
      if (selectedSubject !== 'all' && d.subject !== selectedSubject) return false;
      return true;
    });
  }, [diaries, filters.className, selectedSubject]);

  // Attendance metrics
  const attendanceRate = 96.4;
  const pendingAssignmentsCount = 3;
  const pendingGradesCount = 2;
  const upcomingExamsCount = 4;

  // Analytics Datasets
  const classAttendanceTrendData = [
    { day: 'Mon', ClassOne: 98, ClassTwo: 95, ClassThree: 96 },
    { day: 'Tue', ClassOne: 96, ClassTwo: 94, ClassThree: 97 },
    { day: 'Wed', ClassOne: 95, ClassTwo: 96, ClassThree: 94 },
    { day: 'Thu', ClassOne: 97, ClassTwo: 97, ClassThree: 98 },
    { day: 'Fri', ClassOne: 99, ClassTwo: 95, ClassThree: 96 },
  ];

  const classPerformanceData = [
    { className: 'Class One (A)', avgScore: 86.5, passRate: 98 },
    { className: 'Class One (B)', avgScore: 82.0, passRate: 95 },
    { className: 'Class Two (A)', avgScore: 84.8, passRate: 96 },
    { className: 'Class Three (A)', avgScore: 89.2, passRate: 100 },
  ];

  const subjectPerformanceData = [
    { subject: 'English', avgScore: 88.4, highest: 98 },
    { subject: 'Mathematics', avgScore: 82.1, highest: 99 },
    { subject: 'Gen. Science', avgScore: 85.6, highest: 96 },
    { subject: 'Computer Sci', avgScore: 91.0, highest: 100 },
    { subject: 'Urdu', avgScore: 84.5, highest: 95 },
  ];

  const assignmentStatusData = [
    { name: 'Submitted (On-Time)', value: 68, color: '#10b981' },
    { name: 'Pending Review', value: 18, color: '#f59e0b' },
    { name: 'Late Submission', value: 8, color: '#f43f5e' },
    { name: 'Not Submitted', value: 6, color: '#64748b' },
  ];

  const teacherActivities = [
    { id: 't-1', title: 'Homework Diary Dispatched', desc: 'English Grammar Chapter 4 Exercises assigned to Class 1-A', time: '1 hour ago', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { id: 't-2', title: 'Roll Call Submitted', desc: 'Class 2-A attendance finalized (31/32 Present)', time: '3 hours ago', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' },
    { id: 't-3', title: 'Exam Marks Uploaded', desc: 'Mathematics Quiz #2 graded for 28 students', time: 'Yesterday', icon: Award, color: 'text-purple-600 bg-purple-50' },
    { id: 't-4', title: 'Parent Message Sent', desc: 'Broadcasted syllabus completion update to Class 3 parents', time: '2 days ago', icon: Send, color: 'text-amber-600 bg-amber-50' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview Analytics', icon: Sparkles },
    { id: 'students', label: 'Student List', icon: Users },
    { id: 'attendance', label: 'Manage Attendance', icon: CalendarCheck },
    { id: 'exams', label: 'Exam Marks & Remarks', icon: Award },
    { id: 'grading_policy', label: 'Grading Policy Editor', icon: SlidersHorizontal },
    { id: 'materials_diaries', label: 'Study Materials & Diaries', icon: BookOpen },
    { id: 'online_class', label: 'Online Class', icon: Video },
    { id: 'attendance_reports', label: 'Attendance Reports', icon: BarChart3 },
    { id: 'notice_board', label: 'School Notice Board', icon: Megaphone },
  ];

  return (
    <div id="teacher-dashboard-main-container" className="space-y-4">
      {/* 1. TEACHER WELCOME & NAV HEADER */}
      <div className="bg-gradient-to-r from-[#002147] via-[#0b3866] to-[#1b3b6f] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-bold text-xl text-sky-200 shadow-inner shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-400/20 text-sky-200 border border-sky-400/30 uppercase tracking-wider">
                  Teacher Faculty Workspace
                </span>
                <span className="text-xs text-sky-200 font-medium">• Academic Session 2024–2025</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Faculty &amp; Classroom Command Center
              </h2>
              <p className="text-xs text-slate-200 mt-0.5">
                Teaching schedule, classroom attendance rates, homework diaries, marks entry, and student academic performance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('attendance')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Mark Roll Call</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setExamSubMode('marks_entry');
                setActiveSection('exams');
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Enter Marks</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('materials_diaries')}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Post Diary</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation Ribbon Tabs */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSection(tab.id as TeacherSectionTab);
                  if (tab.id === 'exams') setExamSubMode(undefined);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-[#002147] shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#002147]' : 'text-sky-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW SECTION: OVERVIEW ANALYTICS */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* Dashboard Header Filters */}
          <DashboardHeader
            title="Classroom & Faculty Performance Analytics"
            subtitle="Real-time teaching effectiveness, student mastery, assignment completion, and timetable schedule."
            roleBadgeText="Educator Dashboard"
            roleBadgeColor="bg-blue-800 text-white"
            classes={classes}
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
            showClassFilter={true}
            showPaymentStatusFilter={false}
            showDepartmentFilter={false}
          />

          {/* 2. KPI Stat Cards (7 Role-Specific Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <KpiCard
              id="teacher-kpi-my-classes"
              title="My Classes"
              value={assignedClasses.length}
              subtitle="Assigned standards"
              icon={Users}
              colorScheme="blue"
              onClick={() => setActiveSection('students')}
            />

            <KpiCard
              id="teacher-kpi-my-students"
              title="My Students"
              value={teacherStudents.length}
              subtitle="Enrolled learners"
              icon={UserCheck}
              colorScheme="indigo"
              change={{ value: '+3', isPositive: true, periodText: 'active roster' }}
              onClick={() => setActiveSection('students')}
            />

            <KpiCard
              id="teacher-kpi-today-classes"
              title="Today's Periods"
              value={`${todaySchedule.length} Periods`}
              subtitle="Active teaching slots"
              icon={Clock}
              colorScheme="purple"
              badgeText="Today"
            />

            <KpiCard
              id="teacher-kpi-attendance"
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              subtitle="Daily classroom average"
              icon={CalendarCheck}
              colorScheme="emerald"
              change={{ value: '+0.8%', isPositive: true }}
              onClick={() => setActiveSection('attendance')}
            />

            <KpiCard
              id="teacher-kpi-pending-assignments"
              title="Pending Homework"
              value={pendingAssignmentsCount}
              subtitle="Diaries for review"
              icon={BookOpen}
              colorScheme="amber"
              change={{ value: '3 to grade', isPositive: false }}
              onClick={() => setActiveSection('materials_diaries')}
            />

            <KpiCard
              id="teacher-kpi-pending-grades"
              title="Pending Grades"
              value={pendingGradesCount}
              subtitle="Tests awaiting entry"
              icon={Award}
              colorScheme="rose"
              change={{ value: 'Mid-term Quiz', isPositive: false }}
              onClick={() => {
                setExamSubMode('marks_entry');
                setActiveSection('exams');
              }}
            />

            <KpiCard
              id="teacher-kpi-upcoming-exams"
              title="Upcoming Exams"
              value={upcomingExamsCount}
              subtitle="Scheduled in 2 wks"
              icon={FileText}
              colorScheme="cyan"
              onClick={() => setActiveSection('exams')}
            />
          </div>

          {/* 3. MAIN TEACHER ANALYTICS (Attendance Trend & Class Performance) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Class Attendance Trend */}
            <ChartCard
              id="teacher-chart-attendance-trend"
              title="Class Attendance Trend by Grade"
              subtitle="Weekly attendance rates across your assigned classes."
              icon={CalendarCheck}
            >
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={classAttendanceTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[90, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Line type="monotone" dataKey="ClassOne" name="Class One" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ClassTwo" name="Class Two" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ClassThree" name="Class Three" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Chart 2: Class Performance Comparison */}
            <ChartCard
              id="teacher-chart-class-performance"
              title="Class Performance Comparison"
              subtitle="Average marks scored by class section in latest assessments."
              icon={BarChart3}
            >
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="className" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="avgScore" name="Average Score %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* 4. SECONDARY TEACHER CHARTS (Subject Mastery & Assignment Status) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 3: Subject Performance */}
            <ChartCard
              id="teacher-chart-subject-performance"
              title="Subject Mastery & Benchmark"
              subtitle="Average score per subject with top performer benchmark."
              icon={BookOpen}
            >
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="avgScore" name="Class Average %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="highest" name="Highest Score %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Chart 4: Assignment Status Analytics */}
            <ChartCard
              id="teacher-chart-assignment-status"
              title="Assignment & Homework Submission Status"
              subtitle="Breakdown of submitted, pending, and late student homework."
              icon={FileText}
            >
              <div className="w-full h-64 flex flex-col justify-center items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={assignmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {assignmentStatusData.map((entry, index) => (
                        <Cell key={`asg-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full grid grid-cols-2 gap-2 mt-2">
                  {assignmentStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs px-2 py-1 bg-slate-50 rounded border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* 5. TIMETABLE SCHEDULE & STUDENT ROSTER TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Today's Teaching Periods */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Today's Teaching Periods
                    </h3>
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('timetable')}
                      className="text-[11px] text-sky-600 hover:text-sky-800 font-bold hover:underline cursor-pointer"
                    >
                      Full Timetable &rarr;
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {todaySchedule.slice(0, 4).map((p, idx) => (
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
                            {p.className} ({p.section}) • {p.roomNo}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {p.startTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSection('attendance')}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Launch Roll Call Register</span>
                </button>
              </div>
            </div>

            {/* Quick Student Performance Roster Table */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Student Performance Roster
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSection('students')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All {teacherStudents.length} Students</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                        <th className="py-2 px-2.5">Roll #</th>
                        <th className="py-2 px-2.5">Student Name</th>
                        <th className="py-2 px-2.5">Class</th>
                        <th className="py-2 px-2.5">Attendance</th>
                        <th className="py-2 px-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teacherStudents.slice(0, 5).map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2 px-2.5 font-mono font-bold text-slate-600">{std.rollNo}</td>
                          <td className="py-2 px-2.5 font-bold text-slate-800">{std.name}</td>
                          <td className="py-2 px-2.5 text-slate-600">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                              {std.className}-{std.section}
                            </span>
                          </td>
                          <td className="py-2 px-2.5">
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {std.attendanceRate ?? 95}%
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setExamSubMode('marks_entry');
                                setActiveSection('exams');
                              }}
                              className="text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                            >
                              Enter Marks
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Showing top active scholars</span>
                <button
                  type="button"
                  onClick={() => setActiveSection('students')}
                  className="font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Full Student Directory &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* 6. TEACHER QUICK ACTIONS & ACTIVITY FEED */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Faculty Quick Actions</h3>
                <p className="text-xs text-slate-300 mt-0.5">Quick access to teaching tools</p>

                <div className="space-y-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('attendance')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Take Attendance</div>
                      <div className="text-[10px] text-slate-400">Classroom roll call</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('materials_diaries')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Post Homework Diary</div>
                      <div className="text-[10px] text-slate-400">Assignment instructions</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExamSubMode('marks_entry');
                      setActiveSection('exams');
                    }}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Enter Exam Grades</div>
                      <div className="text-[10px] text-slate-400">Marks &amp; remarks entry</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('online_class')}
                    className="w-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Launch Online Class</div>
                      <div className="text-[10px] text-slate-400">Virtual lecture meeting</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">Recent Classroom Updates</h3>
                  </div>
                  <span className="text-xs text-slate-400">Faculty activity</span>
                </div>

                <div className="divide-y divide-slate-100 mt-2">
                  {teacherActivities.map((act) => {
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
                <span>All notifications synchronized with school database</span>
                <button
                  type="button"
                  onClick={() => setActiveSection('notice_board')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View Notice Board &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SECTION: 2. STUDENT LIST */}
      {activeSection === 'students' && (
        <TeacherStudentList
          students={students}
          classes={classes}
          onNavigateToMarks={(studentId) => {
            setExamSubMode('marks_entry');
            setActiveSection('exams');
          }}
          onNavigateToAttendance={(className) => {
            setActiveSection('attendance');
          }}
        />
      )}

      {/* VIEW SECTION: 3. ATTENDANCE */}
      {activeSection === 'attendance' && (
        <TeacherAttendanceManage
          students={students}
          classes={classes}
        />
      )}

      {/* VIEW SECTION: 4. EXAM & TEST MARKS */}
      {activeSection === 'exams' && (
        <TeacherExamManagement
          students={students}
          classes={classes}
          marks={marks}
          initialSubTab={examSubMode}
          onPrintMarkSheet={onPrintMarkSheet}
          onPrintAdmitCard={onPrintAdmitCard}
          onOpenGradingPolicy={() => setActiveSection('grading_policy')}
        />
      )}

      {/* VIEW SECTION: 5. GRADING POLICY */}
      {activeSection === 'grading_policy' && (
        <TeacherGradingPolicyEditor
          classes={classes}
        />
      )}

      {/* VIEW SECTION: 6. MATERIALS & DIARIES */}
      {activeSection === 'materials_diaries' && (
        <TeacherStudyMaterialsDiaries
          classes={classes}
          students={students}
          diaries={diaries}
          materials={materials}
        />
      )}

      {/* VIEW SECTION: 7. ONLINE CLASS */}
      {activeSection === 'online_class' && (
        <TeacherOnlineClass
          classes={classes}
          students={students}
        />
      )}

      {/* VIEW SECTION: 8. ATTENDANCE REPORTS */}
      {activeSection === 'attendance_reports' && (
        <TeacherAttendanceReports students={students} classes={classes} />
      )}

      {/* VIEW SECTION: 9. NOTICE BOARD */}
      {activeSection === 'notice_board' && (
        <TeacherNoticeBoard notices={notices} classes={classes} />
      )}
    </div>
  );
}

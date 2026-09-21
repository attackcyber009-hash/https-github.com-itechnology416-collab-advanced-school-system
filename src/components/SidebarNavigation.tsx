import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  Briefcase,
  CreditCard,
  MessageSquareWarning,
  Layers,
  BookOpen,
  CalendarCheck,
  Video,
  Clock,
  Receipt,
  TrendingDown,
  Coins,
  Package,
  Award,
  FileCheck2,
  BookMarked,
  FileText,
  Mail,
  Building2,
  Shield,
  ShieldAlert,
  Bus,
  Library,
  Home,
  BarChart3,
  Trophy,
  HeartPulse,
  FlaskConical,
  Sparkles,
  BrainCircuit,
  HeartHandshake,
  Compass,
  DollarSign,
  Activity,
  LifeBuoy,
  Radio,
  Shuffle,
  Wrench,
  Globe,
  Calculator,
  Megaphone,
  HelpCircle,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  MessageSquare,
  Bell,
  MessageCircle,
  Send,
  Check,
  Edit3,
  FileSpreadsheet,
} from 'lucide-react';
import { ActiveNavTab, UserRole } from '../types';

interface SidebarNavigationProps {
  currentUserRole?: UserRole;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onSelectDiaryAction?: (action: 'manage' | 'send_sms') => void;
  onSelectStudyMaterialsAction?: (action: 'browse' | 'upload') => void;
  onSelectLeaveAction?: (action: 'requests' | 'balances' | 'apply') => void;
  onSelectSmsAction?: (action: 'parents' | 'students' | 'staff' | 'specific' | 'templates' | 'history') => void;
  onSelectMobileAction?: (action: 'parents' | 'staff' | 'students' | 'history') => void;
  onSelectWhatsappAction?: (action: 'parents' | 'staff' | 'history') => void;
  onSelectTelegramAction?: (action: 'parents' | 'staff' | 'history') => void;
  onSelectEmailAction?: (action: 'specific' | 'history') => void;
  onSelectCertificationsAction?: (action: 'printing' | 'template' | 'student' | 'staff') => void;
  onSelectAdmissionSubTab?: (subTab: 'admit' | 'inquiries' | 'bulk' | 'requests', action?: string) => void;
  onSelectStudentAction?: (action: 'info' | 'promotion' | 'birthday' | 'transfer') => void;
  onSelectParentAction?: (action: 'manage' | 'requests' | 'reports') => void;
  onSelectIdCardAction?: (action: 'student' | 'staff' | 'settings') => void;
  onSelectClassAction?: (action: 'classes' | 'sections') => void;
  onSelectAttendanceAction?: (action: 'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report') => void;
  onSelectTimetableAction?: (action: 'add' | 'manage') => void;
  onSelectFeeAction?: (
    action:
      | 'monthly'
      | 'custom'
      | 'transport'
      | 'types'
      | 'increment_pct'
      | 'increment_amt'
      | 'decrement_pct'
      | 'decrement_amt'
      | 'family_calc'
      | 'family_credit'
      | 'wallet'
      | 'direct_student'
      | 'direct_custom'
      | 'sms_defaulters'
      | 'balance_sheets'
      | 'deleted_fees'
      | 'discount_print'
      | 'discount_student'
      | 'discount_family'
      | 'print_student'
      | 'print_family'
  ) => void;
  onSelectExamAction?: (
    action:
      | 'exam_list'
      | 'marks_entry'
      | 'timetable_add'
      | 'timetable_manage'
      | 'grade_particular'
      | 'grade_final'
      | 'teacher_remarks'
      | 'tabulation_particular'
      | 'tabulation_final'
      | 'positions_particular'
      | 'positions_final'
      | 'admit_cards_particular'
      | 'admit_cards_final'
      | 'sms_particular'
      | 'sms_final'
      | 'print_mark_sheets'
      | 'exam_reports'
  ) => void;
  onSelectTestAction?: (
    action:
      | 'tests_list'
      | 'marks_entry'
      | 'timetable_add'
      | 'timetable_manage'
      | 'schedules_add'
      | 'schedules_manage'
      | 'grade_particular'
      | 'grade_combined'
      | 'teacher_remarks'
      | 'tabulation_particular'
      | 'tabulation_combined'
      | 'positions_particular'
      | 'positions_combined'
      | 'admit_cards_particular'
      | 'admit_cards_combined'
      | 'sms_particular'
      | 'sms_combined'
      | 'print_mark_sheets'
      | 'test_reports'
  ) => void;
  complaintsCount: number;
  unpaidFeesCount: number;
  onSelectTeacherDashboardAction?: (action: 'overview' | 'students' | 'attendance' | 'exams' | 'remarks' | 'grading_policy' | 'materials_diaries' | 'online_class' | 'attendance_reports' | 'notice_board') => void;
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  userName: string;
  userRole: string;
}

export default function SidebarNavigation({
  currentUserRole,
  activeTab,
  onSelectTab,
  onSelectDiaryAction,
  onSelectStudyMaterialsAction,
  onSelectLeaveAction,
  onSelectSmsAction,
  onSelectMobileAction,
  onSelectWhatsappAction,
  onSelectTelegramAction,
  onSelectEmailAction,
  onSelectCertificationsAction,
  onSelectAdmissionSubTab,
  onSelectStudentAction,
  onSelectParentAction,
  onSelectIdCardAction,
  onSelectClassAction,
  onSelectAttendanceAction,
  onSelectTimetableAction,
  onSelectFeeAction,
  onSelectExamAction,
  onSelectTestAction,
  complaintsCount,
  unpaidFeesCount,
  onSelectTeacherDashboardAction,
  isOpen = true,
  onToggle,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  userName,
  userRole,
}: SidebarNavigationProps) {
  const effectiveRole: UserRole = currentUserRole || (
    (userRole || '').toLowerCase().includes('teacher') ? 'teacher' :
    (userRole || '').toLowerCase().includes('student') ? 'student' :
    (userRole || '').toLowerCase().includes('parent') ? 'parent' :
    (userRole || '').toLowerCase().includes('accountant') ? 'accountant' :
    'super_admin'
  );
  const isSuperAdmin = effectiveRole === 'super_admin' || effectiveRole === 'campus_admin';

  // Expanded parent submenus
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dashboard: false,
    teacherDashboard: false,
    websiteManagement: false,
    admissions: true,
    students: false,
    attendance: true,
    fees: true,
    exams: true,
    tests: true,
    timetable: true,
    onlinePayment: false,
    expenses: false,
    salaries: false,
    reports: false,
    inventory: true,
    certifications: false,
    homeworkDiary: false,
    studyMaterials: false,
    leaveManagement: false,
    smsManagement: false,
    mobileNotifications: false,
    whatsappNotifications: false,
    telegramNotifications: false,
    emailAlerts: false,
  });

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabClick = (tab: ActiveNavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleExamSubClick = (action: any) => {
    onSelectTab('exams');
    if (onSelectExamAction) {
      onSelectExamAction(action);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleTestSubClick = (action: any) => {
    onSelectTab('tests');
    if (onSelectTestAction) {
      onSelectTestAction(action);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Semi-Transparent Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        id="main-sidebar"
        className={`bg-[#0c1e38] text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-[#081527] z-40 shrink-0 h-full select-none
          /* Mobile Drawer Positioning */
          fixed inset-y-0 left-0 lg:static
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          /* Desktop Width (Expanded w-64 vs Collapsed w-20) */
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Brand & Collapse Header */}
        <div className="relative bg-[#102a4e] p-3 border-b border-[#1b3b6f] flex items-center justify-between overflow-hidden shrink-0 min-h-[60px]">
          {/* Decorative Dot Pattern Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#60a5fa 1.5px, transparent 1.5px)',
              backgroundSize: '10px 10px',
            }}
          />

          {/* Logo & Brand Info */}
          <div className={`flex items-center gap-2.5 z-10 ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="w-9 h-9 rounded-lg bg-white p-0.5 shadow flex items-center justify-center border border-emerald-600 shrink-0">
              <div className="w-full h-full bg-gradient-to-b from-emerald-600 to-teal-800 rounded flex flex-col items-center justify-center text-white">
                <div className="w-2 h-2 rounded-full bg-amber-300" />
                <span className="text-[4px] font-black uppercase text-emerald-100 tracking-tighter">EDUCATORS</span>
              </div>
            </div>

            {/* Title / Subtitle (Hidden when desktop collapsed) */}
            <div className={`transition-all duration-200 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <div className="text-white font-bold text-xs tracking-wide uppercase leading-tight whitespace-nowrap">
                THE EDUCATORS
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] text-emerald-300 font-medium truncate max-w-[120px]">
                  {userName || userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              id="sidebar-collapse-toggle-btn"
              onClick={onToggleCollapse}
              className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition z-10 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                isCollapsed ? 'mx-auto mt-2' : ''
              }`}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-sky-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-300" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              type="button"
              id="sidebar-mobile-close-btn"
              onClick={onCloseMobile}
              className="lg:hidden text-slate-300 hover:text-white p-1 rounded hover:bg-slate-700/50 z-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation List Container */}
        <nav
          className="flex-1 overflow-y-auto py-2 text-xs select-none custom-scrollbar space-y-0.5"
          id="sidebar-nav-menu"
        >
          {/* Main Section Header */}
          <div className={`px-4 pt-2 pb-0.5 flex items-center gap-1.5 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded border ${
              (userRole || '').toLowerCase().includes('teacher')
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : (userRole || '').toLowerCase().includes('student')
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : (userRole || '').toLowerCase().includes('parent')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : (userRole || '').toLowerCase().includes('accountant')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {userRole ? userRole.toUpperCase() : 'SUPER ADMIN'}
            </span>
          </div>
          <div className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            {effectiveRole === 'teacher'
              ? 'TEACHER WORKSPACE'
              : effectiveRole === 'student'
              ? 'STUDENT ACADEMIC PORTAL'
              : effectiveRole === 'parent'
              ? 'PARENT GUARDIAN DESK'
              : effectiveRole === 'accountant'
              ? 'FINANCE & ACCOUNTS DESK'
              : 'MAIN NAVIGATION'}
          </div>

          {/* TEACHER ROLE MENU */}
          {effectiveRole === 'teacher' && (
            <>
              <SidebarNavItem
                id="teacher-nav-overview"
                icon={LayoutDashboard}
                iconColor="text-sky-400"
                label="Teacher Dashboard"
                active={activeTab === 'teacher_portal' || activeTab === 'dashboard'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('overview');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-students"
                icon={GraduationCap}
                iconColor="text-emerald-400"
                label="My Students & Classes"
                active={activeTab === 'teacher_portal'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('students');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-attendance"
                icon={Check}
                iconColor="text-teal-400"
                label="Class Attendance"
                active={activeTab === 'attendance'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('attendance');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-marks"
                icon={Edit3}
                iconColor="text-amber-400"
                label="Exam & Test Marks"
                active={activeTab === 'exams' || activeTab === 'tests'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('exams');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-grading"
                icon={Award}
                iconColor="text-indigo-400"
                label="Grading Policy"
                active={activeTab === 'teacher_portal'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('grading_policy');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-diary"
                icon={BookOpen}
                iconColor="text-orange-400"
                label="Daily Homework Diary"
                active={activeTab === 'daily_homework_diary'}
                onClick={() => handleTabClick('daily_homework_diary')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-materials"
                icon={BookMarked}
                iconColor="text-cyan-400"
                label="Study Materials & Vault"
                active={activeTab === 'study_materials'}
                onClick={() => handleTabClick('study_materials')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-online-class"
                icon={Video}
                iconColor="text-purple-400"
                label="Online Classes"
                active={activeTab === 'online_classes'}
                onClick={() => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('online_class');
                }}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-leave"
                icon={CalendarCheck}
                iconColor="text-rose-400"
                label="Leave Requests"
                active={activeTab === 'leave_management'}
                onClick={() => handleTabClick('leave_management')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-question-bank"
                icon={BrainCircuit}
                iconColor="text-purple-400"
                label="AI Question Bank & Papers"
                active={activeTab === 'ai_question_bank_engine'}
                onClick={() => handleTabClick('ai_question_bank_engine')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-cpd"
                icon={Award}
                iconColor="text-emerald-400"
                label="CPD Training & Skills"
                active={activeTab === 'teacher_cpd'}
                onClick={() => handleTabClick('teacher_cpd')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="teacher-nav-notice"
                icon={Bell}
                iconColor="text-amber-400"
                label="School Notice Board"
                active={activeTab === 'school_notice_board'}
                onClick={() => handleTabClick('school_notice_board')}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* STUDENT ROLE MENU */}
          {effectiveRole === 'student' && (
            <>
              <SidebarNavItem
                id="student-nav-overview"
                icon={LayoutDashboard}
                iconColor="text-purple-400"
                label="Student Dashboard"
                active={activeTab === 'student_portal' || activeTab === 'dashboard'}
                onClick={() => handleTabClick('student_portal')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-timetable"
                icon={Clock}
                iconColor="text-sky-400"
                label="Class Timetable"
                active={activeTab === 'timetable'}
                onClick={() => handleTabClick('timetable')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-diary"
                icon={BookOpen}
                iconColor="text-orange-400"
                label="Daily Homework Diary"
                active={activeTab === 'daily_homework_diary'}
                onClick={() => handleTabClick('daily_homework_diary')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-materials"
                icon={BookMarked}
                iconColor="text-teal-400"
                label="Study Materials Repository"
                active={activeTab === 'study_materials'}
                onClick={() => handleTabClick('study_materials')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-exams"
                icon={FileText}
                iconColor="text-amber-400"
                label="Exams & Date Sheets"
                active={activeTab === 'exams'}
                onClick={() => handleTabClick('exams')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-results"
                icon={Award}
                iconColor="text-emerald-400"
                label="My Marks & Results"
                active={activeTab === 'tests'}
                onClick={() => handleTabClick('tests')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-attendance"
                icon={Check}
                iconColor="text-cyan-400"
                label="Attendance Record"
                active={activeTab === 'attendance'}
                onClick={() => handleTabClick('attendance')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-library"
                icon={Library}
                iconColor="text-indigo-400"
                label="Library Catalog"
                active={activeTab === 'library'}
                onClick={() => handleTabClick('library')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-quiz"
                icon={BrainCircuit}
                iconColor="text-rose-400"
                label="Practice Quizzes"
                active={activeTab === 'quiz'}
                onClick={() => handleTabClick('quiz')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="student-nav-notices"
                icon={Bell}
                iconColor="text-amber-400"
                label="School Announcements"
                active={activeTab === 'school_notice_board'}
                onClick={() => handleTabClick('school_notice_board')}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* PARENT ROLE MENU */}
          {effectiveRole === 'parent' && (
            <>
              <SidebarNavItem
                id="parent-nav-overview"
                icon={LayoutDashboard}
                iconColor="text-emerald-400"
                label="Parent Dashboard"
                active={activeTab === 'parent_portal' || activeTab === 'dashboard'}
                onClick={() => handleTabClick('parent_portal')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-children"
                icon={GraduationCap}
                iconColor="text-sky-400"
                label="My Children Profiles"
                active={activeTab === 'students'}
                onClick={() => handleTabClick('students')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-attendance"
                icon={Check}
                iconColor="text-teal-400"
                label="Attendance Tracker"
                active={activeTab === 'attendance'}
                onClick={() => handleTabClick('attendance')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-exams"
                icon={Award}
                iconColor="text-amber-400"
                label="Academic Progress & Reports"
                active={activeTab === 'exams' || activeTab === 'tests'}
                onClick={() => handleTabClick('exams')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-diary"
                icon={BookOpen}
                iconColor="text-orange-400"
                label="Daily Homework Diary"
                active={activeTab === 'daily_homework_diary'}
                onClick={() => handleTabClick('daily_homework_diary')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-fees"
                icon={CreditCard}
                iconColor="text-rose-400"
                label="Fee Vouchers & Payments"
                active={activeTab === 'fee_vouchers'}
                onClick={() => handleTabClick('fee_vouchers')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-calc"
                icon={DollarSign}
                iconColor="text-emerald-400"
                label="Family Fee Calculator"
                active={activeTab === 'family_fee_calculator'}
                onClick={() => handleTabClick('family_fee_calculator')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-helpdesk"
                icon={LifeBuoy}
                iconColor="text-indigo-400"
                label="Parent Helpdesk & Tickets"
                active={activeTab === 'parent_helpdesk'}
                onClick={() => handleTabClick('parent_helpdesk')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-ptm"
                icon={Users}
                iconColor="text-purple-400"
                label="Parent-Teacher Meetings"
                active={activeTab === 'ptm_portal'}
                onClick={() => handleTabClick('ptm_portal')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="parent-nav-notices"
                icon={Bell}
                iconColor="text-amber-400"
                label="School Circulars"
                active={activeTab === 'school_notice_board'}
                onClick={() => handleTabClick('school_notice_board')}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* ACCOUNTANT ROLE MENU */}
          {effectiveRole === 'accountant' && (
            <>
              <SidebarNavItem
                id="accountant-nav-overview"
                icon={LayoutDashboard}
                iconColor="text-amber-400"
                label="Finance Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => handleTabClick('dashboard')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-vouchers"
                icon={CreditCard}
                iconColor="text-sky-400"
                label="Fee Vouchers"
                active={activeTab === 'fee_vouchers'}
                onClick={() => handleTabClick('fee_vouchers')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-defaulters"
                icon={MessageSquare}
                iconColor="text-rose-400"
                label="SMS to Fee Defaulters"
                active={activeTab === 'sms_defaulters'}
                onClick={() => handleTabClick('sms_defaulters')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-bulk"
                icon={FileSpreadsheet}
                iconColor="text-emerald-400"
                label="Bulk Fee Payment"
                active={activeTab === 'bulk_fee_payment'}
                onClick={() => handleTabClick('bulk_fee_payment')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-heads"
                icon={DollarSign}
                iconColor="text-teal-400"
                label="Fee Types & Heads"
                active={activeTab === 'fee_types_heads'}
                onClick={() => handleTabClick('fee_types_heads')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-calc"
                icon={DollarSign}
                iconColor="text-amber-400"
                label="Family Fee Calculator"
                active={activeTab === 'family_fee_calculator'}
                onClick={() => handleTabClick('family_fee_calculator')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-ledgers"
                icon={FileText}
                iconColor="text-cyan-400"
                label="Cash Book & Ledgers"
                active={activeTab === 'accounting'}
                onClick={() => handleTabClick('accounting')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-expenses"
                icon={TrendingDown}
                iconColor="text-rose-400"
                label="Campus Expenses"
                active={activeTab === 'expenses'}
                onClick={() => handleTabClick('expenses')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-salaries"
                icon={Briefcase}
                iconColor="text-indigo-400"
                label="Staff Payroll & Salaries"
                active={activeTab === 'salaries'}
                onClick={() => handleTabClick('salaries')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-budget"
                icon={FileSpreadsheet}
                iconColor="text-purple-400"
                label="Capex/Opex Budget & POs"
                active={activeTab === 'budget_procurement'}
                onClick={() => handleTabClick('budget_procurement')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-reports"
                icon={Award}
                iconColor="text-emerald-400"
                label="Financial Reports & Statements"
                active={activeTab === 'analytics'}
                onClick={() => handleTabClick('analytics')}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                id="accountant-nav-notices"
                icon={Bell}
                iconColor="text-amber-400"
                label="School Notice Board"
                active={activeTab === 'school_notice_board'}
                onClick={() => handleTabClick('school_notice_board')}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* SUPER ADMIN SUITES (Strictly Only Rendered for Super Admin & Campus Admin) */}
          {isSuperAdmin && (
            <>
          {/* 1. Dashboard Submenu Suite */}
          <SidebarNavSubmenu
            id="nav-dashboard-suite"
            icon={LayoutDashboard}
            iconColor="text-sky-400"
            label="Dashboard"
            active={
              activeTab === 'dashboard' ||
              activeTab === 'school_notice_board' ||
              activeTab === 'manage_campuses' ||
              activeTab === 'admin_roles' ||
              activeTab === 'sms_defaulters' ||
              activeTab === 'bulk_fee_payment' ||
              activeTab === 'admit_student_form' ||
              activeTab === 'fee_types_heads' ||
              activeTab === 'family_fee_calculator' ||
              activeTab === 'manage_biometric_devices' ||
              activeTab === 'website_management' ||
              activeTab === 'digital_payment_gateway' ||
              activeTab === 'biometric_rfid_sync' ||
              activeTab === 'ai_exam_grader' ||
              activeTab === 'live_bus_gps_tracker' ||
              activeTab === 'mobile_push_engine'
            }
            isExpanded={expandedMenus.dashboard}
            onToggleExpand={() => toggleSubmenu('dashboard')}
            onClickParent={() => handleTabClick('dashboard')}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Overview Dashboard',
                onClick: () => handleTabClick('dashboard'),
              },
              {
                label: '• Digital 1Link & Challan Pay',
                onClick: () => handleTabClick('digital_payment_gateway'),
              },
              {
                label: '• Biometric & Turnstile Sync',
                onClick: () => handleTabClick('biometric_rfid_sync'),
              },
              {
                label: '• AI Exam Grader & Papers',
                onClick: () => handleTabClick('ai_exam_grader'),
              },
              {
                label: '• Live Bus GPS Tracker',
                onClick: () => handleTabClick('live_bus_gps_tracker'),
              },
              {
                label: '• Mobile Push Notifications',
                onClick: () => handleTabClick('mobile_push_engine'),
              },
              {
                label: '• School notice board',
                onClick: () => handleTabClick('school_notice_board'),
              },
              {
                label: '• Manage campuses',
                onClick: () => handleTabClick('manage_campuses'),
              },
              {
                label: '• Admin role management',
                onClick: () => handleTabClick('admin_roles'),
              },
              {
                label: '• SMS to fee defaulter',
                onClick: () => handleTabClick('sms_defaulters'),
              },
              {
                label: '• Bulk fee payment',
                onClick: () => handleTabClick('bulk_fee_payment'),
              },
              {
                label: '• Admit student',
                onClick: () => handleTabClick('admit_student_form'),
              },
              {
                label: '• Fee types/heads',
                onClick: () => handleTabClick('fee_types_heads'),
              },
              {
                label: '• Family fee calculator',
                onClick: () => handleTabClick('family_fee_calculator'),
              },
              {
                label: '• Manage transport',
                onClick: () => handleTabClick('transport'),
              },
              {
                label: '• Transport report',
                onClick: () => handleTabClick('transport'),
              },
              {
                label: '• Manage biometric devices',
                onClick: () => handleTabClick('manage_biometric_devices'),
              },
              {
                label: '• Website management',
                onClick: () => handleTabClick('website_management'),
              },
            ]}
          />

          {/* TEACHER DASHBOARD SUITE */}
          <SidebarNavSubmenu
            id="nav-teacher-dashboard-main"
            icon={GraduationCap}
            iconColor="text-sky-400"
            label="Teacher Dashboard"
            badge="PORTAL"
            badgeColor="bg-sky-500/20 text-sky-300 border border-sky-500/30"
            active={activeTab === 'teacher_portal'}
            isExpanded={expandedMenus.teacherDashboard}
            onToggleExpand={() => toggleSubmenu('teacherDashboard')}
            onClickParent={() => {
              handleTabClick('teacher_portal');
              if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('overview');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Dashboard Overview',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('overview');
                },
              },
              {
                label: '• Student list',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('students');
                },
              },
              {
                label: '• Manage attendance',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('attendance');
                },
              },
              {
                label: '• Exam/test marks entry management',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('exams');
                },
              },
              {
                label: '• Grading policy editor',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('grading_policy');
                },
              },
              {
                label: '• Exam/test remarks entry management',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('remarks');
                },
              },
              {
                label: '• Study materials - lectures',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('materials_diaries');
                },
              },
              {
                label: '• Daily diaries',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('materials_diaries');
                },
              },
              {
                label: '• Online class',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('online_class');
                },
              },
              {
                label: '• Attendance reports',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('attendance_reports');
                },
              },
              {
                label: '• School notice board',
                onClick: () => {
                  handleTabClick('teacher_portal');
                  if (onSelectTeacherDashboardAction) onSelectTeacherDashboardAction('notice_board');
                },
              },
            ]}
          />

          {/* Settings Submenu */}
          <SidebarNavSubmenu
            id="nav-settings"
            icon={Settings}
            iconColor="text-slate-500"
            label="Settings"
            active={activeTab.startsWith('settings')}
            isExpanded={expandedMenus.settings}
            onToggleExpand={() => toggleSubmenu('settings')}
            onClickParent={() => handleTabClick('settings_general')}
            isCollapsed={isCollapsed}
            subItems={[
              { label: '• General settings', onClick: () => handleTabClick('settings_general') },
              { label: '• SMS settings', onClick: () => handleTabClick('settings_sms') },
              { label: '• Email settings', onClick: () => handleTabClick('settings_email') },
              { label: '• Payment settings', onClick: () => handleTabClick('settings_payment') },
              { label: '• WhatsApp API settings', onClick: () => handleTabClick('settings_whatsapp') },
              { label: '• Telegram API settings', onClick: () => handleTabClick('settings_telegram') },
              { label: '• Automations settings', onClick: () => handleTabClick('settings_automations') },
            ]}
          />

          {/* Daily Homework Diary (Main Navigation submenu as requested) */}
          <SidebarNavSubmenu
            id="nav-homework-diary-main"
            icon={BookOpen}
            iconColor="text-amber-500"
            label="Daily homework diary"
            active={activeTab === 'daily_homework_diary'}
            isExpanded={expandedMenus.homeworkDiary}
            onToggleExpand={() => toggleSubmenu('homeworkDiary')}
            onClickParent={() => {
              handleTabClick('daily_homework_diary');
              if (onSelectDiaryAction) onSelectDiaryAction('manage');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Add and manage diaries',
                onClick: () => {
                  handleTabClick('daily_homework_diary');
                  if (onSelectDiaryAction) onSelectDiaryAction('manage');
                },
              },
              {
                label: '• Send diary via SMS',
                onClick: () => {
                  handleTabClick('daily_homework_diary');
                  if (onSelectDiaryAction) onSelectDiaryAction('send_sms');
                },
              },
            ]}
          />

          {/* Study materials (Main Navigation submenu as requested) */}
          <SidebarNavSubmenu
            id="nav-study-materials-main"
            icon={BookMarked}
            iconColor="text-teal-400"
            label="Study materials"
            active={activeTab === 'study_materials'}
            isExpanded={expandedMenus.studyMaterials}
            onToggleExpand={() => toggleSubmenu('studyMaterials')}
            onClickParent={() => {
              handleTabClick('study_materials');
              if (onSelectStudyMaterialsAction) onSelectStudyMaterialsAction('browse');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Browse Repository',
                onClick: () => {
                  handleTabClick('study_materials');
                  if (onSelectStudyMaterialsAction) onSelectStudyMaterialsAction('browse');
                },
              },
              {
                label: '• Upload Materials',
                onClick: () => {
                  handleTabClick('study_materials');
                  if (onSelectStudyMaterialsAction) onSelectStudyMaterialsAction('upload');
                },
              },
            ]}
          />

          {/* Leave management (Main Navigation submenu as requested) */}
          <SidebarNavSubmenu
            id="nav-leave-management-main"
            icon={CalendarCheck}
            iconColor="text-sky-400"
            label="Leave management"
            active={activeTab === 'leave_management'}
            isExpanded={expandedMenus.leaveManagement}
            onToggleExpand={() => toggleSubmenu('leaveManagement')}
            onClickParent={() => {
              handleTabClick('leave_management');
              if (onSelectLeaveAction) onSelectLeaveAction('requests');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Leave Requests',
                onClick: () => {
                  handleTabClick('leave_management');
                  if (onSelectLeaveAction) onSelectLeaveAction('requests');
                },
              },
              {
                label: '• Leave Balances',
                onClick: () => {
                  handleTabClick('leave_management');
                  if (onSelectLeaveAction) onSelectLeaveAction('balances');
                },
              },
              {
                label: '• Apply for Leave',
                onClick: () => {
                  handleTabClick('leave_management');
                  if (onSelectLeaveAction) onSelectLeaveAction('apply');
                },
              },
            ]}
          />

          {/* SMS Management */}
          <SidebarNavSubmenu
            id="nav-sms-management-main"
            icon={MessageSquare}
            iconColor="text-amber-500"
            label="SMS Management"
            active={activeTab === 'sms_management'}
            isExpanded={expandedMenus.smsManagement}
            onToggleExpand={() => toggleSubmenu('smsManagement')}
            onClickParent={() => {
              handleTabClick('sms_management');
              if (onSelectSmsAction) onSelectSmsAction('parents');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• SMS to parents',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('parents');
                },
              },
              {
                label: '• SMS to students',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('students');
                },
              },
              {
                label: '• SMS to staff',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('staff');
                },
              },
              {
                label: '• SMS to specific number',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('specific');
                },
              },
              {
                label: '• SMS templates',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('templates');
                },
              },
              {
                label: '• SMS history',
                onClick: () => {
                  handleTabClick('sms_management');
                  if (onSelectSmsAction) onSelectSmsAction('history');
                },
              },
            ]}
          />

          {/* Mobile App Notifications */}
          <SidebarNavSubmenu
            id="nav-mobile-notifications-main"
            icon={Bell}
            iconColor="text-rose-400"
            label="Mobile App Notifications"
            active={activeTab === 'mobile_notifications'}
            isExpanded={expandedMenus.mobileNotifications}
            onToggleExpand={() => toggleSubmenu('mobileNotifications')}
            onClickParent={() => {
              handleTabClick('mobile_notifications');
              if (onSelectMobileAction) onSelectMobileAction('parents');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Notifications to parent',
                onClick: () => {
                  handleTabClick('mobile_notifications');
                  if (onSelectMobileAction) onSelectMobileAction('parents');
                },
              },
              {
                label: '• Notifications to staff',
                onClick: () => {
                  handleTabClick('mobile_notifications');
                  if (onSelectMobileAction) onSelectMobileAction('staff');
                },
              },
              {
                label: '• Notifications to students',
                onClick: () => {
                  handleTabClick('mobile_notifications');
                  if (onSelectMobileAction) onSelectMobileAction('students');
                },
              },
              {
                label: '• Send notifications history',
                onClick: () => {
                  handleTabClick('mobile_notifications');
                  if (onSelectMobileAction) onSelectMobileAction('history');
                },
              },
            ]}
          />

          {/* WhatsApp Notifications */}
          <SidebarNavSubmenu
            id="nav-whatsapp-notifications-main"
            icon={MessageCircle}
            iconColor="text-emerald-500"
            label="WhatsApp Notifications"
            active={activeTab === 'whatsapp_notifications'}
            isExpanded={expandedMenus.whatsappNotifications}
            onToggleExpand={() => toggleSubmenu('whatsappNotifications')}
            onClickParent={() => {
              handleTabClick('whatsapp_notifications');
              if (onSelectWhatsappAction) onSelectWhatsappAction('parents');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Message to parents',
                onClick: () => {
                  handleTabClick('whatsapp_notifications');
                  if (onSelectWhatsappAction) onSelectWhatsappAction('parents');
                },
              },
              {
                label: '• Message to staff',
                onClick: () => {
                  handleTabClick('whatsapp_notifications');
                  if (onSelectWhatsappAction) onSelectWhatsappAction('staff');
                },
              },
              {
                label: '• Send message history',
                onClick: () => {
                  handleTabClick('whatsapp_notifications');
                  if (onSelectWhatsappAction) onSelectWhatsappAction('history');
                },
              },
            ]}
          />

          {/* Telegram Notifications */}
          <SidebarNavSubmenu
            id="nav-telegram-notifications-main"
            icon={Send}
            iconColor="text-sky-500"
            label="Telegram Notifications"
            active={activeTab === 'telegram_notifications'}
            isExpanded={expandedMenus.telegramNotifications}
            onToggleExpand={() => toggleSubmenu('telegramNotifications')}
            onClickParent={() => {
              handleTabClick('telegram_notifications');
              if (onSelectTelegramAction) onSelectTelegramAction('parents');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Message to parents',
                onClick: () => {
                  handleTabClick('telegram_notifications');
                  if (onSelectTelegramAction) onSelectTelegramAction('parents');
                },
              },
              {
                label: '• Message to staff',
                onClick: () => {
                  handleTabClick('telegram_notifications');
                  if (onSelectTelegramAction) onSelectTelegramAction('staff');
                },
              },
              {
                label: '• Send message history',
                onClick: () => {
                  handleTabClick('telegram_notifications');
                  if (onSelectTelegramAction) onSelectTelegramAction('history');
                },
              },
            ]}
          />

          {/* Email Alerts */}
          <SidebarNavSubmenu
            id="nav-email-alerts-main"
            icon={Mail}
            iconColor="text-purple-400"
            label="Email Alerts"
            active={activeTab === 'email_alerts'}
            isExpanded={expandedMenus.emailAlerts}
            onToggleExpand={() => toggleSubmenu('emailAlerts')}
            onClickParent={() => {
              handleTabClick('email_alerts');
              if (onSelectEmailAction) onSelectEmailAction('specific');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Message to specific emails',
                onClick: () => {
                  handleTabClick('email_alerts');
                  if (onSelectEmailAction) onSelectEmailAction('specific');
                },
              },
              {
                label: '• Send email history’s',
                onClick: () => {
                  handleTabClick('email_alerts');
                  if (onSelectEmailAction) onSelectEmailAction('history');
                },
              },
            ]}
          />

          {/* Certifications (Main Navigation submenu as requested) */}
          <SidebarNavSubmenu
            id="nav-certifications-main"
            icon={Award}
            iconColor="text-amber-400"
            label="Certifications"
            active={activeTab === 'certifications_hub'}
            isExpanded={expandedMenus.certifications}
            onToggleExpand={() => toggleSubmenu('certifications')}
            onClickParent={() => {
              handleTabClick('certifications_hub');
              if (onSelectCertificationsAction) onSelectCertificationsAction('printing');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Certificate printing',
                onClick: () => {
                  handleTabClick('certifications_hub');
                  if (onSelectCertificationsAction) onSelectCertificationsAction('printing');
                },
              },
              {
                label: '• Certificate template',
                onClick: () => {
                  handleTabClick('certifications_hub');
                  if (onSelectCertificationsAction) onSelectCertificationsAction('template');
                },
              },
              {
                label: '• Student certificate',
                onClick: () => {
                  handleTabClick('certifications_hub');
                  if (onSelectCertificationsAction) onSelectCertificationsAction('student');
                },
              },
              {
                label: '• Staff certificate',
                onClick: () => {
                  handleTabClick('certifications_hub');
                  if (onSelectCertificationsAction) onSelectCertificationsAction('staff');
                },
              },
            ]}
          />

          {/* 2. Admission Management (Submenu) */}
          <SidebarNavSubmenu
            id="nav-admissions-parent"
            icon={UserPlus}
            iconColor="text-emerald-400"
            label="Admission Management"
            active={activeTab === 'admissions'}
            isExpanded={expandedMenus.admissions}
            onToggleExpand={() => toggleSubmenu('admissions')}
            onClickParent={() => {
              handleTabClick('admissions');
              if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('admit');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Admit student',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('admit');
                },
              },
              {
                label: '• Admit bulk student',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('bulk');
                },
              },
              {
                label: '• Admission requests',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('requests');
                },
              },
              {
                label: '• Admission inquiries',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('inquiries');
                },
              },
              {
                label: '    Manage inquiries',
                className: 'pl-5 text-[10.5px] text-slate-300 hover:text-amber-300 font-medium',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('inquiries');
                },
              },
              {
                label: '    Send SMS to inquires',
                className: 'pl-5 text-[10.5px] text-slate-300 hover:text-amber-300 font-medium',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('inquiries', 'sms');
                },
              },
              {
                label: '• Print admission forms',
                onClick: () => {
                  handleTabClick('admissions');
                  if (onSelectAdmissionSubTab) onSelectAdmissionSubTab('admit');
                },
              },
            ]}
          />

          {/* 3. Student Management */}
          <SidebarNavSubmenu
            id="nav-students"
            icon={GraduationCap}
            iconColor="text-amber-400"
            label="Student Management"
            badge="8"
            badgeColor="bg-sky-900 text-sky-200"
            active={activeTab === 'students'}
            isExpanded={expandedMenus.students}
            onToggleExpand={() => toggleSubmenu('students')}
            onClickParent={() => {
              handleTabClick('students');
              if (onSelectStudentAction) onSelectStudentAction('info');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: "• Student information’s",
                onClick: () => {
                  handleTabClick('students');
                  if (onSelectStudentAction) onSelectStudentAction('info');
                },
              },
              {
                label: '• Student promotion',
                onClick: () => {
                  handleTabClick('students');
                  if (onSelectStudentAction) onSelectStudentAction('promotion');
                },
              },
              {
                label: '• Student birthday',
                onClick: () => {
                  handleTabClick('students');
                  if (onSelectStudentAction) onSelectStudentAction('birthday');
                },
              },
              {
                label: '• Student transfer',
                onClick: () => {
                  handleTabClick('students');
                  if (onSelectStudentAction) onSelectStudentAction('transfer');
                },
              },
            ]}
          />

          {/* 4. Parent Accounts */}
          <SidebarNavSubmenu
            id="nav-parents"
            icon={Users}
            iconColor="text-purple-400"
            label="Parent Accounts"
            active={activeTab === 'parents'}
            isExpanded={expandedMenus.parents}
            onToggleExpand={() => toggleSubmenu('parents')}
            onClickParent={() => {
              handleTabClick('parents');
              if (onSelectParentAction) onSelectParentAction('manage');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Manage accounts',
                onClick: () => {
                  handleTabClick('parents');
                  if (onSelectParentAction) onSelectParentAction('manage');
                },
              },
              {
                label: '• Account requests',
                onClick: () => {
                  handleTabClick('parents');
                  if (onSelectParentAction) onSelectParentAction('requests');
                },
              },
              {
                label: '• Parent information reports',
                onClick: () => {
                  handleTabClick('parents');
                  if (onSelectParentAction) onSelectParentAction('reports');
                },
              },
            ]}
          />

          {/* 5. Teachers */}
          <SidebarNavItem
            id="nav-staff"
            icon={Briefcase}
            iconColor="text-rose-400"
            label="Teachers"
            active={activeTab === 'staff'}
            onClick={() => handleTabClick('staff')}
            isCollapsed={isCollapsed}
          />

          {/* 6. ID Card Printing */}
          <SidebarNavSubmenu
            id="nav-id-cards"
            icon={CreditCard}
            iconColor="text-cyan-400"
            label="ID Card Printing"
            active={activeTab === 'id_cards'}
            isExpanded={expandedMenus.id_cards}
            onToggleExpand={() => toggleSubmenu('id_cards')}
            onClickParent={() => {
              handleTabClick('id_cards');
              if (onSelectIdCardAction) onSelectIdCardAction('student');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Print student cards',
                onClick: () => {
                  handleTabClick('id_cards');
                  if (onSelectIdCardAction) onSelectIdCardAction('student');
                },
              },
              {
                label: '• Print staff cards',
                onClick: () => {
                  handleTabClick('id_cards');
                  if (onSelectIdCardAction) onSelectIdCardAction('staff');
                },
              },
              {
                label: '• ID card settings',
                onClick: () => {
                  handleTabClick('id_cards');
                  if (onSelectIdCardAction) onSelectIdCardAction('settings');
                },
              },
            ]}
          />

          {/* Accountants */}
          <SidebarNavItem
            id="nav-accountants"
            icon={Calculator}
            iconColor="text-emerald-400"
            label="Accountants"
            active={activeTab === 'accounting' || activeTab === 'salaries'}
            onClick={() => handleTabClick('accounting')}
            isCollapsed={isCollapsed}
          />

          {/* Public messages */}
          <SidebarNavItem
            id="nav-public-messages"
            icon={Megaphone}
            iconColor="text-amber-400"
            label="Public messages"
            active={activeTab === 'broadcast_gateway' || activeTab === 'communications'}
            onClick={() => handleTabClick('broadcast_gateway')}
            isCollapsed={isCollapsed}
          />

          {/* Parent Complaints */}
          <SidebarNavItem
            id="nav-complaints"
            icon={MessageSquareWarning}
            iconColor="text-rose-500"
            label="Parent Complaints"
            badge={complaintsCount > 0 ? complaintsCount : undefined}
            badgeColor="bg-red-600 text-white font-bold"
            active={activeTab === 'communications'}
            onClick={() => handleTabClick('communications')}
            isCollapsed={isCollapsed}
          />

          {/* Classes & Sections Submenu */}
          <SidebarNavSubmenu
            id="nav-classes"
            icon={Layers}
            iconColor="text-indigo-400"
            label="Classes & Sections"
            active={activeTab === 'classes'}
            isExpanded={expandedMenus.classes}
            onToggleExpand={() => toggleSubmenu('classes')}
            onClickParent={() => {
              handleTabClick('classes');
              if (onSelectClassAction) onSelectClassAction('classes');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Manage classes',
                onClick: () => {
                  handleTabClick('classes');
                  if (onSelectClassAction) onSelectClassAction('classes');
                },
              },
              {
                label: '• Manage sections',
                onClick: () => {
                  handleTabClick('classes');
                  if (onSelectClassAction) onSelectClassAction('sections');
                },
              },
            ]}
          />

          {/* 9. Manage Subjects */}
          <SidebarNavItem
            id="nav-subjects"
            icon={BookOpen}
            iconColor="text-teal-400"
            label="Manage Subjects"
            active={activeTab === 'subjects'}
            onClick={() => handleTabClick('subjects')}
            isCollapsed={isCollapsed}
          />

          {/* 10. Manage Attendance (Submenu) */}
          <SidebarNavSubmenu
            id="nav-attendance-parent"
            icon={CalendarCheck}
            iconColor="text-emerald-400"
            label="Manage Attendance"
            active={activeTab === 'attendance'}
            isExpanded={expandedMenus.attendance}
            onToggleExpand={() => toggleSubmenu('attendance')}
            onClickParent={() => {
              handleTabClick('attendance');
              if (onSelectAttendanceAction) onSelectAttendanceAction('student');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Student attendance (manual/digital attendance) add voice attendance update',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('student');
                },
              },
              {
                label: '• Staff attendance (manual/digital attendance)',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('staff');
                },
              },
              {
                label: '• Barcode attendance',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('barcode');
                },
              },
              {
                label: '• Attendance account',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('account');
                },
              },
              {
                label: '• Biometric attendance',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('biometric');
                },
              },
              {
                label: '• Attendance report',
                onClick: () => {
                  handleTabClick('attendance');
                  if (onSelectAttendanceAction) onSelectAttendanceAction('report');
                },
              },
            ]}
          />

          {/* 11. Daily Homework Diary */}
          <SidebarNavItem
            id="nav-daily-diary"
            icon={BookOpen}
            iconColor="text-emerald-400"
            label="Daily Homework Diary"
            active={activeTab === 'diary'}
            onClick={() => handleTabClick('diary')}
            isCollapsed={isCollapsed}
          />

          {/* 12. Online Classes */}
          <SidebarNavItem
            id="nav-online-classes"
            icon={Video}
            iconColor="text-red-400"
            label="Online Classes"
            active={activeTab === 'online_classes'}
            onClick={() => handleTabClick('online_classes')}
            isCollapsed={isCollapsed}
          />

          {/* 13. Timetable Management (Submenu) */}
          <SidebarNavSubmenu
            id="nav-timetable-parent"
            icon={Clock}
            iconColor="text-yellow-400"
            label="Timetable Management"
            active={activeTab === 'timetable'}
            isExpanded={expandedMenus.timetable}
            onToggleExpand={() => toggleSubmenu('timetable')}
            onClickParent={() => {
              handleTabClick('timetable');
              if (onSelectTimetableAction) onSelectTimetableAction('manage');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Add timetable',
                onClick: () => {
                  handleTabClick('timetable');
                  if (onSelectTimetableAction) onSelectTimetableAction('add');
                },
              },
              {
                label: '• Manage timetable',
                onClick: () => {
                  handleTabClick('timetable');
                  if (onSelectTimetableAction) onSelectTimetableAction('manage');
                },
              },
            ]}
          />

          {/* 14. Accounting (Submenu) */}
          <SidebarNavSubmenu
            id="nav-fees-parent"
            icon={Receipt}
            iconColor="text-emerald-400"
            label="Accounting"
            badge={unpaidFeesCount > 0 ? unpaidFeesCount : undefined}
            badgeColor="bg-red-600 text-white font-bold"
            active={activeTab === 'fee_vouchers' || activeTab === 'accounting'}
            isExpanded={expandedMenus.fees}
            onToggleExpand={() => toggleSubmenu('fees')}
            onClickParent={() => {
              handleTabClick('fee_vouchers');
              if (onSelectFeeAction) onSelectFeeAction('monthly');
            }}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Generate monthly fee',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('monthly'); },
              },
              {
                label: '• Generate custom fee',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('custom'); },
              },
              {
                label: '• Generate transport fee',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('transport'); },
              },
              {
                label: '• Fee types',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('types'); },
              },
              {
                label: '• Generate fee increment',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('increment_pct'); },
              },
              {
                label: '   - Increment by percentage',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('increment_pct'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Increment by amount',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('increment_amt'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '• Generate fee decrement',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('decrement_pct'); },
              },
              {
                label: '   - Decrement by percentage',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('decrement_pct'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Decrement by amount',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('decrement_amt'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '• Family fee calculator',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('family_calc'); },
              },
              {
                label: '• Family credit systems',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('family_credit'); },
              },
              {
                label: '• Parent wallet systems',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('wallet'); },
              },
              {
                label: '• Direct payment',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('direct_student'); },
              },
              {
                label: '   - Student payment',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('direct_student'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Custom payment',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('direct_custom'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '• SMS to fee defaulters',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('sms_defaulters'); },
              },
              {
                label: '• Balance sheets',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('balance_sheets'); },
              },
              {
                label: '   - Print balance sheets',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('balance_sheets'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '• Deleted fees',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('deleted_fees'); },
              },
              {
                label: '• Discount student',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('discount_student'); },
              },
              {
                label: '   - Print fee voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('discount_print'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Student voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('discount_student'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Family voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('discount_family'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '• Print fee voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('print_student'); },
              },
              {
                label: '   - Student voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('print_student'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
              {
                label: '   - Family voucher',
                onClick: () => { handleTabClick('fee_vouchers'); if (onSelectFeeAction) onSelectFeeAction('print_family'); },
                className: 'text-slate-400 pl-3 text-[10px]',
              },
            ]}
          />

          {/* Online Payment Submenu */}
          <SidebarNavSubmenu
            id="nav-online-payment"
            icon={Globe}
            iconColor="text-teal-400"
            label="Online payment"
            active={activeTab === 'fee_vouchers'}
            isExpanded={expandedMenus.onlinePayment}
            onToggleExpand={() => toggleSubmenu('onlinePayment')}
            onClickParent={() => handleTabClick('fee_vouchers')}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Accounts settlement',
                onClick: () => handleTabClick('fee_vouchers'),
              },
            ]}
          />

          {/* Expense Management Submenu */}
          <SidebarNavSubmenu
            id="nav-expenses"
            icon={TrendingDown}
            iconColor="text-rose-400"
            label="Expense management"
            active={activeTab === 'expenses'}
            isExpanded={expandedMenus.expenses}
            onToggleExpand={() => toggleSubmenu('expenses')}
            onClickParent={() => handleTabClick('expenses')}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Add/manage expense',
                onClick: () => handleTabClick('expenses'),
              },
              {
                label: '• Expense categories',
                onClick: () => handleTabClick('expenses'),
              },
            ]}
          />

          {/* Salary and Loan Management Submenu */}
          <SidebarNavSubmenu
            id="nav-salaries"
            icon={Coins}
            iconColor="text-amber-400"
            label="Salary and loan management"
            active={activeTab === 'salaries'}
            isExpanded={expandedMenus.salaries}
            onToggleExpand={() => toggleSubmenu('salaries')}
            onClickParent={() => handleTabClick('salaries')}
            isCollapsed={isCollapsed}
            subItems={[
              {
                label: '• Generate salary',
                onClick: () => handleTabClick('salaries'),
              },
              {
                label: '• Manage salaries',
                onClick: () => handleTabClick('salaries'),
              },
              {
                label: '• Loan management',
                onClick: () => handleTabClick('salaries'),
              },
              {
                label: '• Salary settings',
                onClick: () => handleTabClick('salaries'),
              },
              {
                label: '• Salary and loan reports',
                onClick: () => handleTabClick('salaries'),
              },
            ]}
          />

          {/* Reporting Area Submenu */}
          <SidebarNavSubmenu
            id="nav-reports"
            icon={BarChart3}
            iconColor="text-emerald-400"
            label="Reporting area"
            active={activeTab === 'analytics' || activeTab === 'fee_vouchers'}
            isExpanded={expandedMenus.reports}
            onToggleExpand={() => toggleSubmenu('reports')}
            onClickParent={() => handleTabClick('analytics')}
            isCollapsed={isCollapsed}
            subItems={[
              { label: '• Fee defaulter report', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Income and expense report', onClick: () => handleTabClick('expenses') },
              { label: '• Fee discount report', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Detailed income report', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Detailed expense report', onClick: () => handleTabClick('expenses') },
              { label: '• Head wise due summary', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Income and expense summary', onClick: () => handleTabClick('analytics') },
              { label: '• Accounts summary report', onClick: () => handleTabClick('analytics') },
              { label: '• List of unpaid invoices', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Staff salary reports', onClick: () => handleTabClick('salaries') },
              { label: '• Admission date report', onClick: () => handleTabClick('admissions') },
              { label: '• Student information reports', onClick: () => handleTabClick('students') },
              { label: '• Find balance sheet', onClick: () => handleTabClick('fee_vouchers') },
              { label: '• Attendance report', onClick: () => handleTabClick('attendance') },
              { label: '   - Student attendance', onClick: () => handleTabClick('attendance'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - Staff attendance', onClick: () => handleTabClick('attendance'), className: 'text-slate-400 pl-3 text-[10px]' },
            ]}
          />

          {/* Stock and Inventory Submenu */}
          <SidebarNavSubmenu
            id="nav-inventory"
            icon={Package}
            iconColor="text-orange-400"
            label="Stock and inventory"
            active={activeTab === 'inventory'}
            isExpanded={expandedMenus.inventory}
            onToggleExpand={() => toggleSubmenu('inventory')}
            onClickParent={() => handleTabClick('inventory')}
            isCollapsed={isCollapsed}
            subItems={[
              { label: '• Point of sale', onClick: () => handleTabClick('inventory') },
              { label: '• Manage categories', onClick: () => handleTabClick('inventory') },
              { label: '• Products and stocks', onClick: () => handleTabClick('inventory') },
              { label: '• Add bulk products', onClick: () => handleTabClick('inventory') },
              { label: '• Stock and sales report', onClick: () => handleTabClick('inventory') },
            ]}
          />

          {/* Exam Management Submenu */}
          <SidebarNavSubmenu
            id="nav-exams"
            icon={Award}
            iconColor="text-purple-400"
            label="Exam management"
            active={activeTab === 'exams'}
            isExpanded={expandedMenus.exams}
            onToggleExpand={() => toggleSubmenu('exams')}
            onClickParent={() => handleTabClick('exams')}
            isCollapsed={isCollapsed}
            subItems={[
              { label: '• Exam list', onClick: () => handleExamSubClick('exam_list') },
              { label: '• Marks entry', onClick: () => handleExamSubClick('marks_entry') },
              { label: '• Exam timetable', onClick: () => handleExamSubClick('timetable_manage') },
              { label: '   - Add timetable', onClick: () => handleExamSubClick('timetable_add'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - Manage timetable', onClick: () => handleExamSubClick('timetable_manage'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Assign grade', onClick: () => handleExamSubClick('grade_particular') },
              { label: '   - For particular exam', onClick: () => handleExamSubClick('grade_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For final result', onClick: () => handleExamSubClick('grade_final'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Teacher remarks', onClick: () => handleExamSubClick('teacher_remarks') },
              { label: '• Tabulation sheet', onClick: () => handleExamSubClick('tabulation_particular') },
              { label: '   - For particular exam', onClick: () => handleExamSubClick('tabulation_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For final result', onClick: () => handleExamSubClick('tabulation_final'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Position holder', onClick: () => handleExamSubClick('positions_particular') },
              { label: '   - For particular exam', onClick: () => handleExamSubClick('positions_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For final exam', onClick: () => handleExamSubClick('positions_final'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Print admits cards / slips', onClick: () => handleExamSubClick('admit_cards_particular') },
              { label: '   - For particular exam', onClick: () => handleExamSubClick('admit_cards_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For final exam', onClick: () => handleExamSubClick('admit_cards_final'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Send marks by SMS', onClick: () => handleExamSubClick('sms_particular') },
              { label: '   - For particular exam', onClick: () => handleExamSubClick('sms_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For final result', onClick: () => handleExamSubClick('sms_final'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Print mark sheets', onClick: () => handleExamSubClick('print_mark_sheets') },
              { label: '• Exam reports', onClick: () => handleExamSubClick('exam_reports') },
            ]}
          />

          {/* Test Management Submenu */}
          <SidebarNavSubmenu
            id="nav-tests"
            icon={CheckSquare}
            iconColor="text-indigo-400"
            label="Test management"
            active={activeTab === 'tests'}
            isExpanded={expandedMenus.tests}
            onToggleExpand={() => toggleSubmenu('tests')}
            onClickParent={() => handleTabClick('tests')}
            isCollapsed={isCollapsed}
            subItems={[
              { label: '• Test list', onClick: () => handleTestSubClick('tests_list') },
              { label: '• Marks entry', onClick: () => handleTestSubClick('marks_entry') },
              { label: '• Test timetable', onClick: () => handleTestSubClick('timetable_manage') },
              { label: '   - Add timetable', onClick: () => handleTestSubClick('timetable_add'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - Manage timetable', onClick: () => handleTestSubClick('timetable_manage'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Test schedules', onClick: () => handleTestSubClick('schedules_manage') },
              { label: '   - Add schedules', onClick: () => handleTestSubClick('schedules_add'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - Manage schedules', onClick: () => handleTestSubClick('schedules_manage'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Assign grade', onClick: () => handleTestSubClick('grade_particular') },
              { label: '   - For particular test', onClick: () => handleTestSubClick('grade_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For combined result', onClick: () => handleTestSubClick('grade_combined'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Teacher remarks', onClick: () => handleTestSubClick('teacher_remarks') },
              { label: '• Tabulation sheet', onClick: () => handleTestSubClick('tabulation_particular') },
              { label: '   - For particular test', onClick: () => handleTestSubClick('tabulation_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For combined result', onClick: () => handleTestSubClick('tabulation_combined'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Position holder', onClick: () => handleTestSubClick('positions_particular') },
              { label: '   - For particular test', onClick: () => handleTestSubClick('positions_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For combined exam', onClick: () => handleTestSubClick('positions_combined'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Print admit cards / slips', onClick: () => handleTestSubClick('admit_cards_particular') },
              { label: '   - For particular test', onClick: () => handleTestSubClick('admit_cards_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For combined exam', onClick: () => handleTestSubClick('admit_cards_combined'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Send marks by SMS', onClick: () => handleTestSubClick('sms_particular') },
              { label: '   - For particular test', onClick: () => handleTestSubClick('sms_particular'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '   - For combined result', onClick: () => handleTestSubClick('sms_combined'), className: 'text-slate-400 pl-3 text-[10px]' },
              { label: '• Print mark sheets', onClick: () => handleTestSubClick('print_mark_sheets') },
              { label: '• Test reports', onClick: () => handleTestSubClick('test_reports') },
            ]}
          />

          {/* Quiz management */}
          <SidebarNavItem
            id="nav-quiz"
            icon={HelpCircle}
            iconColor="text-pink-400"
            label="Quiz management"
            active={activeTab === 'quiz'}
            onClick={() => handleTabClick('quiz')}
            isCollapsed={isCollapsed}
          />

          {/* 19. Certifications & Slips */}
          <SidebarNavItem
            id="nav-certifications"
            icon={FileCheck2}
            iconColor="text-emerald-400"
            label="Certifications & Slips"
            active={activeTab === 'certifications'}
            onClick={() => handleTabClick('certifications')}
            isCollapsed={isCollapsed}
          />

          {/* 20. Study Materials - LMS */}
          <SidebarNavItem
            id="nav-lms"
            icon={FileText}
            iconColor="text-blue-400"
            label="Study Materials - LMS"
            active={activeTab === 'lms'}
            onClick={() => handleTabClick('lms')}
            isCollapsed={isCollapsed}
          />

          {/* 21. SMS & Notice Board */}
          <SidebarNavItem
            id="nav-communications"
            icon={Mail}
            iconColor="text-yellow-400"
            label="SMS & Notice Board"
            active={activeTab === 'communications'}
            onClick={() => handleTabClick('communications')}
            isCollapsed={isCollapsed}
          />

          {/* 22. Transport Management */}
          <SidebarNavItem
            id="nav-transport"
            icon={Bus}
            iconColor="text-amber-400"
            label="Transport Management"
            active={activeTab === 'transport'}
            onClick={() => handleTabClick('transport')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 7 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>CAMPUS OPS &amp; BI (PHASE 7)</span>
            <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-library"
            icon={Library}
            iconColor="text-indigo-400"
            label="Library & OPAC Catalog"
            active={activeTab === 'library'}
            onClick={() => handleTabClick('library')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-gate-security"
            icon={ShieldAlert}
            iconColor="text-rose-400"
            label="Gate Passes & Visitors"
            active={activeTab === 'gate_security'}
            onClick={() => handleTabClick('gate_security')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-hostel"
            icon={Home}
            iconColor="text-amber-400"
            label="Hostel & Mess Suite"
            active={activeTab === 'hostel'}
            onClick={() => handleTabClick('hostel')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-analytics"
            icon={BarChart3}
            iconColor="text-emerald-400"
            label="BI Analytics & Alumni"
            active={activeTab === 'analytics'}
            onClick={() => handleTabClick('analytics')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 8 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>SPORTS, HEALTH &amp; AI (PHASE 8)</span>
            <span className="px-1.5 py-0.2 bg-rose-400/20 text-rose-300 rounded text-[9px]">LATEST</span>
          </div>

          <SidebarNavItem
            id="nav-sports-houses"
            icon={Trophy}
            iconColor="text-amber-400"
            label="Houses & Sports Olympiad"
            active={activeTab === 'sports_houses'}
            onClick={() => handleTabClick('sports_houses')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-infirmary"
            icon={HeartPulse}
            iconColor="text-rose-400"
            label="Infirmary & Student Health"
            active={activeTab === 'infirmary'}
            onClick={() => handleTabClick('infirmary')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-lab-assets"
            icon={FlaskConical}
            iconColor="text-cyan-400"
            label="Science & IT Lab Assets"
            active={activeTab === 'lab_assets'}
            onClick={() => handleTabClick('lab_assets')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-question-paper"
            icon={Sparkles}
            iconColor="text-violet-400"
            label="Exam Paper Generator (AI/SLO)"
            active={activeTab === 'question_paper'}
            onClick={() => handleTabClick('question_paper')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 9 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>MERIT, CPD &amp; ALUMNI (PHASE 9)</span>
            <span className="px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-admission-merit"
            icon={Award}
            iconColor="text-teal-400"
            label="Admission Merit & Quota Engine"
            active={activeTab === 'admission_merit'}
            onClick={() => handleTabClick('admission_merit')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-teacher-cpd"
            icon={BookOpen}
            iconColor="text-indigo-400"
            label="Faculty CPD & Lesson Plans"
            active={activeTab === 'teacher_cpd'}
            onClick={() => handleTabClick('teacher_cpd')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-ptm-portal"
            icon={HeartHandshake}
            iconColor="text-emerald-400"
            label="PTM Scheduling & Feedback"
            active={activeTab === 'ptm_portal'}
            onClick={() => handleTabClick('ptm_portal')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-career-alumni"
            icon={Compass}
            iconColor="text-cyan-400"
            label="Alumni & Career Placements"
            active={activeTab === 'career_alumni'}
            onClick={() => handleTabClick('career_alumni')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 10 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 10: E-LEARNING &amp; BI ERP</span>
            <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-lms-vault"
            icon={Video}
            iconColor="text-blue-400"
            label="Digital LMS & SLO Quiz Vault"
            active={activeTab === 'lms_vault'}
            onClick={() => handleTabClick('lms_vault')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-sports-olympiad"
            icon={Trophy}
            iconColor="text-amber-400"
            label="Sports Gala & Olympiad Hub"
            active={activeTab === 'sports_olympiad'}
            onClick={() => handleTabClick('sports_olympiad')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-budget-procurement"
            icon={DollarSign}
            iconColor="text-emerald-400"
            label="Capex/Opex Budget & PR/PO"
            active={activeTab === 'budget_procurement'}
            onClick={() => handleTabClick('budget_procurement')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-executive-bi"
            icon={Activity}
            iconColor="text-indigo-400"
            label="Executive BI & AI Risk Center"
            active={activeTab === 'executive_bi'}
            onClick={() => handleTabClick('executive_bi')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 11 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 11: BROADCAST &amp; HELPDESK</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-broadcast-gateway"
            icon={Radio}
            iconColor="text-emerald-400"
            label="WhatsApp / SMS Broadcast Gateway"
            active={activeTab === 'broadcast_gateway'}
            onClick={() => handleTabClick('broadcast_gateway')}
            isCollapsed={isCollapsed}
          />

          <SidebarNavItem
            id="nav-parent-helpdesk"
            icon={LifeBuoy}
            iconColor="text-indigo-400"
            label="Parent Helpdesk & SLA Tickets"
            active={activeTab === 'parent_helpdesk'}
            onClick={() => handleTabClick('parent_helpdesk')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 12 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 12: MASTER TIMETABLE</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-master-timetable"
            icon={Shuffle}
            iconColor="text-cyan-400"
            label="Master Timetable & Substitutions"
            active={activeTab === 'master_timetable_engine'}
            onClick={() => handleTabClick('master_timetable_engine')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 13 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 13: FACILITY &amp; FLEET</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-facility-fleet-maintenance"
            icon={Wrench}
            iconColor="text-amber-400"
            label="Facility, Fleet & Solar Telemetry"
            active={activeTab === 'facility_fleet_maintenance'}
            onClick={() => handleTabClick('facility_fleet_maintenance')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 14 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 14: HOSTEL &amp; CAFETERIA</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-hostel-cafeteria-inventory"
            icon={Home}
            iconColor="text-emerald-400"
            label="Hostel, Mess & Tuck Shop POS"
            active={activeTab === 'hostel_cafeteria_inventory'}
            onClick={() => handleTabClick('hostel_cafeteria_inventory')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 16 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 16: AI QUESTION &amp; EXAM BANK</span>
            <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-ai-question-bank-engine"
            icon={BrainCircuit}
            iconColor="text-purple-400"
            label="AI Question Bank & Exam Papers"
            active={activeTab === 'ai_question_bank_engine'}
            onClick={() => handleTabClick('ai_question_bank_engine')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 17 Header */}
          <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span>PHASE 17: PORTAL LOCALIZATION</span>
            <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded text-[9px]">NEW</span>
          </div>

          <SidebarNavItem
            id="nav-localization-portal"
            icon={Globe}
            iconColor="text-teal-400"
            label="Tri-Lingual Localization"
            active={activeTab === 'localization_portal'}
            onClick={() => handleTabClick('localization_portal')}
            isCollapsed={isCollapsed}
          />

          {/* Phase 1 Settings */}
          <SidebarNavItem
            id="nav-settings"
            icon={Shield}
            iconColor="text-emerald-400"
            label="Admin & Security (Phase 1)"
            badge="RBAC"
            badgeColor="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            active={activeTab === 'settings'}
            onClick={() => handleTabClick('settings')}
            isCollapsed={isCollapsed}
          />

          {/* Security System Footer Links */}
          <div className={`mt-4 pt-3 border-t border-slate-800 px-4 space-y-1.5 pb-6 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SECURITY &amp; SYSTEM
            </div>
            <button
              type="button"
              onClick={() => handleTabClick('settings')}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-[11px] w-full text-left focus:outline-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Multi-Branch Switcher</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('settings')}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-[11px] w-full text-left focus:outline-none"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Audit Trail &amp; 2FA Policy</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('settings')}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-[11px] w-full text-left focus:outline-none"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
              <span>Granular RBAC Matrix</span>
            </button>
          </div>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

// Helper Sub-Component for Navigation Items
interface SidebarNavItemProps {
  id: string;
  icon: React.ElementType;
  iconColor?: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
  active: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

function SidebarNavItem({
  id,
  icon: Icon,
  iconColor = 'text-sky-400',
  label,
  badge,
  badgeColor = 'bg-sky-900 text-sky-200',
  active,
  onClick,
  isCollapsed,
}: SidebarNavItemProps) {
  return (
    <div className="relative group">
      <button
        type="button"
        id={id}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={`w-full flex items-center transition duration-150 font-medium text-left focus:outline-none focus:ring-2 focus:ring-sky-400 ${
          isCollapsed ? 'lg:px-0 lg:justify-center px-4 py-2.5' : 'px-4 py-2'
        } ${
          active
            ? 'bg-[#1b3b6f] text-white border-l-4 border-sky-400 shadow-xs'
            : 'hover:bg-[#122847] hover:text-white text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
          <span className={`transition-opacity duration-200 truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            {label}
          </span>
        </div>

        {badge !== undefined && (
          <span
            className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-mono ${badgeColor} ${
              isCollapsed ? 'lg:hidden' : 'block'
            }`}
          >
            {badge}
          </span>
        )}
      </button>

      {/* Floating Tooltip in Desktop Collapsed Mode */}
      {isCollapsed && (
        <div className="hidden lg:flex absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 items-center gap-2">
          <span>{label}</span>
          {badge !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Helper Sub-Component for Submenu Parent Items
interface SidebarNavSubmenuProps {
  id: string;
  icon: React.ElementType;
  iconColor?: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
  active: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClickParent: () => void;
  isCollapsed: boolean;
  subItems: { label: string; onClick: () => void; className?: string }[];
}

function SidebarNavSubmenu({
  id,
  icon: Icon,
  iconColor = 'text-emerald-400',
  label,
  badge,
  badgeColor = 'bg-sky-900 text-sky-200',
  active,
  isExpanded,
  onToggleExpand,
  onClickParent,
  isCollapsed,
  subItems,
}: SidebarNavSubmenuProps) {
  return (
    <div className="relative group">
      <button
        type="button"
        id={id}
        onClick={() => {
          if (isCollapsed) {
            onClickParent();
          } else {
            onToggleExpand();
            onClickParent();
          }
        }}
        aria-expanded={!isCollapsed && isExpanded}
        className={`w-full flex items-center justify-between transition duration-150 font-medium text-left focus:outline-none focus:ring-2 focus:ring-sky-400 ${
          isCollapsed ? 'lg:px-0 lg:justify-center px-4 py-2.5' : 'px-4 py-2.5'
        } ${
          active
            ? 'bg-[#1b3b6f] text-white border-l-4 border-sky-400'
            : 'hover:bg-[#122847] hover:text-white text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
          <span className={`transition-opacity duration-200 truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            {label}
          </span>
        </div>

        <div className={`flex items-center gap-1 ${isCollapsed ? 'lg:hidden' : 'flex'}`}>
          {badge !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${badgeColor}`}>
              {badge}
            </span>
          )}
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      </button>

      {/* Floating Tooltip in Desktop Collapsed Mode */}
      {isCollapsed && (
        <div className="hidden lg:flex absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 items-center gap-2">
          <span>{label}</span>
          {badge !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Submenu Accordion Items (When Expanded & Not Collapsed) */}
      {!isCollapsed && isExpanded && (
        <div className="bg-[#09172c] py-1 pl-8 pr-2 space-y-0.5 text-slate-400 text-[11px] border-l-2 border-[#1b3b6f] ml-4 my-0.5">
          {subItems.map((sub, idx) => (
            <button
              key={idx}
              type="button"
              onClick={sub.onClick}
              className={`w-full text-left py-1 hover:text-white flex items-center gap-1.5 transition rounded px-1 focus:outline-none focus:text-white ${sub.className || ''}`}
            >
              <span>{sub.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

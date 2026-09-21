import React from 'react';
import {
  Plus,
  GraduationCap,
  Check,
  Users,
  CreditCard,
  DollarSign,
  ThumbsUp,
  Briefcase,
  PieChart,
  UserCheck,
  MessageSquare,
  MessageCircle,
  Bell,
  RefreshCw,
  Settings,
  BookOpen,
  Edit3,
  FileSpreadsheet,
  Bus,
  Award,
  BookMarked,
  LifeBuoy,
  FileText,
  Clock,
} from 'lucide-react';
import { ActiveNavTab, UserRole } from '../types';

interface QuickActionRibbonProps {
  userRole?: UserRole;
  onSelectTab: (tab: ActiveNavTab) => void;
  onQuickAdmissionModal: () => void;
  onRefreshData: () => void;
}

export default function QuickActionRibbon({
  userRole = 'super_admin',
  onSelectTab,
  onQuickAdmissionModal,
  onRefreshData,
}: QuickActionRibbonProps) {
  // Super Admin actions (Full spectrum)
  const superAdminActions = [
    {
      id: 'quick-add-student',
      label: 'Admit Student',
      icon: Plus,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: onQuickAdmissionModal,
    },
    {
      id: 'quick-student-list',
      label: 'Students Directory',
      icon: GraduationCap,
      bg: 'bg-[#dc3545] hover:bg-[#c82333]',
      action: () => onSelectTab('students'),
    },
    {
      id: 'quick-attendance',
      label: 'Campus Attendance',
      icon: Check,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'quick-classes',
      label: 'Classes & Sections',
      icon: Users,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: () => onSelectTab('classes'),
    },
    {
      id: 'quick-vouchers',
      label: 'Fee Vouchers',
      icon: CreditCard,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('fee_vouchers'),
    },
    {
      id: 'quick-accounting',
      label: 'Direct Fee Collection',
      icon: DollarSign,
      bg: 'bg-[#20c997] hover:bg-[#1ba87e]',
      action: () => onSelectTab('accounting'),
    },
    {
      id: 'quick-leave',
      label: 'Leave Management',
      icon: ThumbsUp,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('leave_management'),
    },
    {
      id: 'quick-staff',
      label: 'Staff Directory',
      icon: Briefcase,
      bg: 'bg-[#d39e00] hover:bg-[#b08300]',
      action: () => onSelectTab('staff'),
    },
    {
      id: 'quick-expenses',
      label: 'Campus Expenses',
      icon: PieChart,
      bg: 'bg-[#e83e8c] hover:bg-[#d63384]',
      action: () => onSelectTab('expenses'),
    },
    {
      id: 'quick-parents',
      label: 'Parents Directory',
      icon: UserCheck,
      bg: 'bg-[#6610f2] hover:bg-[#520dc2]',
      action: () => onSelectTab('parents'),
    },
    {
      id: 'quick-sms',
      label: 'SMS Broadcast',
      icon: MessageSquare,
      bg: 'bg-[#82c91e] hover:bg-[#6fa818]',
      action: () => onSelectTab('communications'),
    },
    {
      id: 'quick-notices',
      label: 'Notice Board',
      icon: Bell,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('school_notice_board'),
    },
    {
      id: 'quick-settings',
      label: 'Settings & Security',
      icon: Settings,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('settings'),
    },
    {
      id: 'quick-diary',
      label: 'Daily Diary',
      icon: BookOpen,
      bg: 'bg-[#f08c00] hover:bg-[#cc7700]',
      action: () => onSelectTab('daily_homework_diary'),
    },
    {
      id: 'quick-marks',
      label: 'Marks Entry',
      icon: Edit3,
      bg: 'bg-[#e03131] hover:bg-[#c92a2a]',
      action: () => onSelectTab('exams'),
    },
    {
      id: 'quick-certificates',
      label: 'Certificates & SLC',
      icon: Award,
      bg: 'bg-[#002147] hover:bg-[#072e5e]',
      action: () => onSelectTab('certifications'),
    },
    {
      id: 'quick-transport',
      label: 'Transport Fleet',
      icon: Bus,
      bg: 'bg-[#e67700] hover:bg-[#d9480f]',
      action: () => onSelectTab('transport'),
    },
    {
      id: 'quick-sync',
      label: 'Refresh Sync',
      icon: RefreshCw,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: onRefreshData,
    },
  ];

  // Teacher quick actions
  const teacherActions = [
    {
      id: 'teacher-quick-portal',
      label: 'Teacher Portal Dashboard',
      icon: GraduationCap,
      bg: 'bg-[#1b3b6f] hover:bg-[#122847]',
      action: () => onSelectTab('teacher_portal'),
    },
    {
      id: 'teacher-quick-attendance',
      label: 'Mark Attendance',
      icon: Check,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'teacher-quick-marks',
      label: 'Enter Exam/Test Marks',
      icon: Edit3,
      bg: 'bg-[#e03131] hover:bg-[#c92a2a]',
      action: () => onSelectTab('exams'),
    },
    {
      id: 'teacher-quick-diary',
      label: 'Add Daily Homework Diary',
      icon: BookOpen,
      bg: 'bg-[#f08c00] hover:bg-[#cc7700]',
      action: () => onSelectTab('daily_homework_diary'),
    },
    {
      id: 'teacher-quick-materials',
      label: 'Study Materials Repository',
      icon: BookMarked,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: () => onSelectTab('study_materials'),
    },
    {
      id: 'teacher-quick-leave',
      label: 'Apply for Leave',
      icon: ThumbsUp,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('leave_management'),
    },
    {
      id: 'teacher-quick-notices',
      label: 'School Notice Board',
      icon: Bell,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('school_notice_board'),
    },
    {
      id: 'teacher-quick-sync',
      label: 'Sync Data',
      icon: RefreshCw,
      bg: 'bg-slate-700 hover:bg-slate-600',
      action: onRefreshData,
    },
  ];

  // Student quick actions
  const studentActions = [
    {
      id: 'student-quick-portal',
      label: 'Student Portal',
      icon: GraduationCap,
      bg: 'bg-[#1b3b6f] hover:bg-[#122847]',
      action: () => onSelectTab('student_portal'),
    },
    {
      id: 'student-quick-schedule',
      label: 'Class Timetable',
      icon: Clock,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: () => onSelectTab('timetable'),
    },
    {
      id: 'student-quick-diary',
      label: 'Homework Diary',
      icon: BookOpen,
      bg: 'bg-[#f08c00] hover:bg-[#cc7700]',
      action: () => onSelectTab('daily_homework_diary'),
    },
    {
      id: 'student-quick-materials',
      label: 'Lecture Materials & Vault',
      icon: BookMarked,
      bg: 'bg-[#20c997] hover:bg-[#1ba87e]',
      action: () => onSelectTab('study_materials'),
    },
    {
      id: 'student-quick-results',
      label: 'My Exam Results & Marks',
      icon: Award,
      bg: 'bg-[#e03131] hover:bg-[#c92a2a]',
      action: () => onSelectTab('tests'),
    },
    {
      id: 'student-quick-attendance',
      label: 'My Attendance Record',
      icon: Check,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'student-quick-notices',
      label: 'School Announcements',
      icon: Bell,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('school_notice_board'),
    },
  ];

  // Parent quick actions
  const parentActions = [
    {
      id: 'parent-quick-portal',
      label: 'Parent Portal Dashboard',
      icon: UserCheck,
      bg: 'bg-[#1b3b6f] hover:bg-[#122847]',
      action: () => onSelectTab('parent_portal'),
    },
    {
      id: 'parent-quick-children',
      label: 'My Children Profiles',
      icon: GraduationCap,
      bg: 'bg-[#6610f2] hover:bg-[#520dc2]',
      action: () => onSelectTab('students'),
    },
    {
      id: 'parent-quick-attendance',
      label: 'Child Attendance Tracker',
      icon: Check,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'parent-quick-diary',
      label: 'Daily Homework Diary',
      icon: BookOpen,
      bg: 'bg-[#f08c00] hover:bg-[#cc7700]',
      action: () => onSelectTab('daily_homework_diary'),
    },
    {
      id: 'parent-quick-fees',
      label: 'Fee Vouchers & Payment',
      icon: CreditCard,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('fee_vouchers'),
    },
    {
      id: 'parent-quick-helpdesk',
      label: 'Parent Helpdesk & Support',
      icon: LifeBuoy,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: () => onSelectTab('parent_helpdesk'),
    },
    {
      id: 'parent-quick-notices',
      label: 'School Circulars',
      icon: Bell,
      bg: 'bg-[#dc3545] hover:bg-[#bd2130]',
      action: () => onSelectTab('school_notice_board'),
    },
  ];

  // Accountant quick actions
  const accountantActions = [
    {
      id: 'accountant-quick-dashboard',
      label: 'Finance Dashboard',
      icon: DollarSign,
      bg: 'bg-[#1b3b6f] hover:bg-[#122847]',
      action: () => onSelectTab('dashboard'),
    },
    {
      id: 'accountant-quick-vouchers',
      label: 'Fee Vouchers Management',
      icon: CreditCard,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('fee_vouchers'),
    },
    {
      id: 'accountant-quick-defaulters',
      label: 'SMS to Fee Defaulters',
      icon: MessageSquare,
      bg: 'bg-[#dc3545] hover:bg-[#bd2130]',
      action: () => onSelectTab('sms_defaulters'),
    },
    {
      id: 'accountant-quick-bulk',
      label: 'Bulk Fee Payment',
      icon: FileSpreadsheet,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('bulk_fee_payment'),
    },
    {
      id: 'accountant-quick-accounting',
      label: 'Daily Cash Ledgers',
      icon: DollarSign,
      bg: 'bg-[#20c997] hover:bg-[#1ba87e]',
      action: () => onSelectTab('accounting'),
    },
    {
      id: 'accountant-quick-expenses',
      label: 'Campus Expenses',
      icon: PieChart,
      bg: 'bg-[#e83e8c] hover:bg-[#d63384]',
      action: () => onSelectTab('expenses'),
    },
    {
      id: 'accountant-quick-salaries',
      label: 'Staff Payroll & Salaries',
      icon: Briefcase,
      bg: 'bg-[#d39e00] hover:bg-[#b08300]',
      action: () => onSelectTab('salaries'),
    },
    {
      id: 'accountant-quick-reports',
      label: 'Financial Statements & Reports',
      icon: FileText,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('analytics'),
    },
    {
      id: 'accountant-quick-sync',
      label: 'Sync Ledger',
      icon: RefreshCw,
      bg: 'bg-slate-700 hover:bg-slate-600',
      action: onRefreshData,
    },
  ];

  let selectedActions = superAdminActions;
  if (userRole === 'teacher') selectedActions = teacherActions;
  else if (userRole === 'student') selectedActions = studentActions;
  else if (userRole === 'parent') selectedActions = parentActions;
  else if (userRole === 'accountant') selectedActions = accountantActions;

  return (
    <div
      id="quick-action-ribbon"
      className="bg-white rounded-lg shadow-xs border border-slate-200 p-2 overflow-x-auto select-none mb-3"
    >
      <div className="flex items-center gap-1.5 min-w-max">
        {selectedActions.map((act) => (
          <button
            key={act.id}
            id={act.id}
            type="button"
            title={act.label}
            onClick={act.action}
            className={`w-8 h-8 rounded text-white flex items-center justify-center shadow-xs transition duration-150 active:scale-90 cursor-pointer ${act.bg}`}
          >
            <act.icon className="w-4 h-4 stroke-[2.2]" />
          </button>
        ))}
      </div>
    </div>
  );
}

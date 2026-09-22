import React, { useEffect } from 'react';
import { ArrowLeft, Home, ChevronRight, ShieldCheck } from 'lucide-react';
import { UserRole, ActiveNavTab } from '../types';

interface BackToDashboardProps {
  role: UserRole;
  currentTab?: ActiveNavTab;
  pageTitle?: string;
  category?: string;
  onNavigateDashboard: (tab: ActiveNavTab) => void;
  className?: string;
  customAction?: () => void;
}

// Role-aware metadata resolution
export const getRoleDashboardMeta = (role: UserRole) => {
  switch (role) {
    case 'super_admin':
      return {
        label: 'Super Admin Dashboard',
        shortLabel: 'Admin Dashboard',
        badge: 'Super Admin',
        colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        route: 'dashboard' as ActiveNavTab,
      };
    case 'campus_admin':
      return {
        label: 'Campus Admin Dashboard',
        shortLabel: 'Admin Dashboard',
        badge: 'Campus Admin',
        colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
        route: 'dashboard' as ActiveNavTab,
      };
    case 'teacher':
      return {
        label: 'Teacher Dashboard',
        shortLabel: 'Teacher Dashboard',
        badge: 'Faculty Lead',
        colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        route: 'dashboard' as ActiveNavTab,
      };
    case 'student':
      return {
        label: 'Student Dashboard',
        shortLabel: 'Student Dashboard',
        badge: 'Scholar',
        colorClass: 'bg-sky-50 text-sky-700 border-sky-200',
        route: 'dashboard' as ActiveNavTab,
      };
    case 'parent':
      return {
        label: 'Parent Dashboard',
        shortLabel: 'Parent Dashboard',
        badge: 'Guardian',
        colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
        route: 'dashboard' as ActiveNavTab,
      };
    case 'accountant':
      return {
        label: 'Accountant Dashboard',
        shortLabel: 'Finance Dashboard',
        badge: 'Finance Officer',
        colorClass: 'bg-purple-50 text-purple-700 border-purple-200',
        route: 'dashboard' as ActiveNavTab,
      };
    default:
      return {
        label: 'Dashboard',
        shortLabel: 'Dashboard',
        badge: 'Staff',
        colorClass: 'bg-slate-50 text-slate-700 border-slate-200',
        route: 'dashboard' as ActiveNavTab,
      };
  }
};

// Human-readable Tab Names & Categories for Breadcrumbs
export const getTabNavigationMeta = (tab?: ActiveNavTab): { title: string; category: string } => {
  if (!tab) return { title: 'Internal View', category: 'Operations' };

  const metaMap: Record<string, { title: string; category: string }> = {
    students: { title: 'Student Management & Roster', category: 'Academics' },
    staff: { title: 'Staff & Faculty Directory', category: 'Human Resources' },
    classes: { title: 'Class & Section Architecture', category: 'Academics' },
    subjects: { title: 'Subject & Curriculum Allotment', category: 'Academics' },
    admissions: { title: 'Admissions & Inquiries Desk', category: 'Administration' },
    fee_vouchers: { title: 'Fee Vouchers & Invoicing', category: 'Finance' },
    fee_types_heads: { title: 'Fee Types & Structural Heads', category: 'Finance' },
    family_fee_calculator: { title: 'Family Fee Concession Calculator', category: 'Finance' },
    bulk_fee_payment: { title: 'Bulk Fee Payment Processing', category: 'Finance' },
    expenses: { title: 'Institutional Expense Ledger', category: 'Finance' },
    accounting: { title: 'General Accounting & Chart of Accounts', category: 'Finance' },
    payroll: { title: 'Faculty Payroll & Salary Slips', category: 'Finance' },
    attendance: { title: 'Student & Staff Attendance Ledger', category: 'Operations' },
    exams: { title: 'Examinations & Marks Grading', category: 'Academics' },
    marks_entry: { title: 'Marks Entry & Term Result Cards', category: 'Academics' },
    tests: { title: 'Class Tests & Continuous Assessment', category: 'Academics' },
    certifications: { title: 'Certificates & Character Slips', category: 'Administration' },
    certificates: { title: 'Formal Document Generator', category: 'Administration' },
    diary: { title: 'Daily Homework & Class Diary', category: 'Academics' },
    lms: { title: 'Digital LMS & Study Repository', category: 'Academics' },
    communications: { title: 'Multi-Channel Dispatch Hub', category: 'Communication' },
    sms: { title: 'SMS Gateway Broadcasts', category: 'Communication' },
    email: { title: 'Email Notice Dispatch', category: 'Communication' },
    whatsapp: { title: 'WhatsApp Business Alerts', category: 'Communication' },
    telegram: { title: 'Telegram Channel Alerts', category: 'Communication' },
    mobile_notifications: { title: 'Mobile App Notifications', category: 'Communication' },
    transport: { title: 'Transport & Fleet Routes', category: 'Logistics' },
    library: { title: 'Library & Book Circulation', category: 'Academics' },
    gate_security: { title: 'Gate Security & Visitor Passes', category: 'Security' },
    hostel: { title: 'Boarding Hostel & Mess Allotment', category: 'Logistics' },
    alumni: { title: 'Alumni & University Placement', category: 'Institutional' },
    analytics: { title: 'Executive BI & Institutional Analytics', category: 'Intelligence' },
    sports_houses: { title: 'Sports Houses & Extracurriculars', category: 'Student Life' },
    infirmary: { title: 'Campus Infirmary & Medical Records', category: 'Health' },
    lab_assets: { title: 'Science & Computer Lab Assets', category: 'Inventory' },
    question_paper: { title: 'AI Question Paper Studio', category: 'Academics' },
    quiz: { title: 'Digital LMS Quiz Vault', category: 'Academics' },
    admission_merit: { title: 'Admission Merit Assessment', category: 'Administration' },
    teacher_cpd: { title: 'Teacher CPD & Lesson Planning', category: 'Academics' },
    ptm_portal: { title: 'PTM Scheduler & Parent Feedback', category: 'Administration' },
    career_alumni: { title: 'Career Guidance Network', category: 'Institutional' },
    lms_vault: { title: 'LMS Resource Vault', category: 'Academics' },
    sports_olympiad: { title: 'Sports Olympiad & Tournaments', category: 'Student Life' },
    budget_procurement: { title: 'ERP Budget & Procurement', category: 'Finance' },
    executive_bi: { title: 'Executive BI Command Center', category: 'Intelligence' },
    broadcast_gateway: { title: 'Broadcast Gateway', category: 'Communication' },
    parent_helpdesk: { title: 'Parent Helpdesk & Complaints', category: 'Administration' },
    master_timetable_engine: { title: 'Master Timetable Engine', category: 'Academics' },
    facility_fleet_maintenance: { title: 'Facility & Fleet Maintenance', category: 'Logistics' },
    hostel_cafeteria_inventory: { title: 'Hostel Mess & Cafeteria POS', category: 'Logistics' },
    ai_question_bank_engine: { title: 'AI Question Bank Engine', category: 'Academics' },
    localization_portal: { title: 'Localization & Language Portal', category: 'Settings' },
    settings: { title: 'Institutional Settings & Security', category: 'Settings' },
    settings_general: { title: 'General School Settings', category: 'Settings' },
    settings_sms: { title: 'SMS Gateway Credentials', category: 'Settings' },
    settings_email: { title: 'SMTP Email Configuration', category: 'Settings' },
    settings_payment: { title: 'Payment Gateway Configuration', category: 'Settings' },
    settings_whatsapp: { title: 'WhatsApp Business API Setup', category: 'Settings' },
    settings_telegram: { title: 'Telegram Bot Configuration', category: 'Settings' },
    settings_automations: { title: 'Background Automation Rules', category: 'Settings' },
    teacher_portal: { title: 'Teacher Academic Workspace', category: 'Faculty' },
    parent_portal: { title: 'Parent & Ward Portal', category: 'Family' },
    student_portal: { title: 'Student Learning Workspace', category: 'Scholar' },
    school_notice_board: { title: 'Institutional Notice Board', category: 'Administration' },
    manage_campuses: { title: 'Campus & Branch Management', category: 'Administration' },
    admin_roles: { title: 'Role Access & Permission Governance', category: 'Security' },
    super_admin_control_center: { title: 'Super Admin Control Center', category: 'Administration' },
    sms_defaulters: { title: 'SMS to Fee Defaulters', category: 'Finance' },
    admit_student_form: { title: 'New Student Admission Form', category: 'Administration' },
    manage_biometric_devices: { title: 'Biometric Attendance Devices', category: 'Security' },
    website_management: { title: 'Public School Website CMS', category: 'Administration' },
    digital_payment_gateway: { title: 'Digital Payment Gateway', category: 'Finance' },
    biometric_rfid_sync: { title: 'Biometric & RFID Sync Engine', category: 'Security' },
    ai_exam_grader: { title: 'AI Assessment & Automated Grader', category: 'Academics' },
    live_bus_gps_tracker: { title: 'Live Bus GPS & Route Telemetry', category: 'Logistics' },
    mobile_push_engine: { title: 'Mobile App Push Engine', category: 'Communication' },
    permissions_access: { title: 'Access & Permissions Dashboard', category: 'Security' },
  };

  if (metaMap[tab]) {
    return metaMap[tab];
  }

  // Fallback formatter
  const formattedTitle = tab
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return { title: formattedTitle, category: 'School Management' };
};

export default function BackToDashboard({
  role,
  currentTab,
  pageTitle,
  category,
  onNavigateDashboard,
  className = '',
  customAction,
}: BackToDashboardProps) {
  const roleMeta = getRoleDashboardMeta(role);
  const tabMeta = getTabNavigationMeta(currentTab);
  const activeTitle = pageTitle || tabMeta.title;
  const activeCategory = category || tabMeta.category;

  // Handle keyboard shortcut (Escape or Alt+Left)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Escape when not inside an input/textarea/select
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if (e.key === 'Escape' && !isInput) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roleMeta.route, customAction, onNavigateDashboard]);

  const handleBack = () => {
    if (customAction) {
      customAction();
    } else {
      onNavigateDashboard(roleMeta.route);
    }
  };

  return (
    <div
      id="global-back-to-dashboard-bar"
      className={`mb-4 w-full bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs transition-all duration-200 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Side: Back Arrow Button & Breadcrumbs */}
        <div className="flex items-center flex-wrap gap-2.5 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            id="back-to-dashboard-btn"
            aria-label={`Back to ${roleMeta.label}`}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/90 hover:bg-emerald-600 active:bg-emerald-700 text-slate-700 hover:text-white border border-slate-200/80 hover:border-emerald-600 text-xs font-bold transition-all duration-150 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1 text-slate-500 group-hover:text-white" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden inline">Dashboard</span>
          </button>

          {/* Breadcrumb Hierarchy */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-300">/</span>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-medium transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">{roleMeta.shortLabel}</span>
              <span className="md:hidden inline">Home</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            <span className="text-slate-400 hidden lg:inline font-normal">
              {activeCategory}
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden lg:inline shrink-0" />

            <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[320px] md:max-w-[420px]">
              {activeTitle}
            </span>
          </nav>
        </div>

        {/* Right Side: Role Badge & Shortcut Pill */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${roleMeta.colorClass}`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{roleMeta.badge}</span>
          </div>

          <div className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            Esc to Return
          </div>
        </div>
      </div>
    </div>
  );
}

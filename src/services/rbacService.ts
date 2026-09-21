import { ActiveNavTab, UserRole } from '../types';

/**
 * STRICT ROLE-BASED ACCESS CONTROL (RBAC) SERVICE
 * Defines exact allowed routes/tabs for every role with Default-Deny architecture.
 */

// Teacher allowed tabs
const TEACHER_ALLOWED_TABS = new Set<ActiveNavTab>([
  'teacher_portal',
  'dashboard',
  'attendance',
  'exams',
  'tests',
  'daily_homework_diary',
  'diary',
  'study_materials',
  'leave_management',
  'school_notice_board',
  'online_classes',
  'quiz',
  'question_paper',
  'ai_question_bank_engine',
  'ai_exam_grader',
  'lms',
  'lms_vault',
  'teacher_cpd',
  'ptm_portal',
]);

// Student allowed tabs
const STUDENT_ALLOWED_TABS = new Set<ActiveNavTab>([
  'student_portal',
  'dashboard',
  'timetable',
  'daily_homework_diary',
  'diary',
  'study_materials',
  'exams',
  'tests',
  'attendance',
  'library',
  'school_notice_board',
  'quiz',
  'lms',
  'live_bus_gps_tracker',
  'mobile_push_engine',
]);

// Parent allowed tabs
const PARENT_ALLOWED_TABS = new Set<ActiveNavTab>([
  'parent_portal',
  'dashboard',
  'students',
  'attendance',
  'exams',
  'tests',
  'daily_homework_diary',
  'diary',
  'fee_vouchers',
  'family_fee_calculator',
  'digital_payment_gateway',
  'live_bus_gps_tracker',
  'mobile_push_engine',
  'school_notice_board',
  'parent_helpdesk',
  'ptm_portal',
]);

// Accountant allowed tabs
const ACCOUNTANT_ALLOWED_TABS = new Set<ActiveNavTab>([
  'dashboard',
  'fee_vouchers',
  'sms_defaulters',
  'bulk_fee_payment',
  'fee_types_heads',
  'family_fee_calculator',
  'digital_payment_gateway',
  'accounting',
  'expenses',
  'salaries',
  'analytics',
  'budget_procurement',
  'school_notice_board',
]);

/**
 * Check if the given role is allowed to access a specific tab/module.
 * Super Admin and Campus Admin have full access. All other roles follow Default-Deny.
 */
export function isTabAllowedForRole(role: UserRole, tab: ActiveNavTab): boolean {
  if (role === 'super_admin' || role === 'campus_admin') {
    return true;
  }

  switch (role) {
    case 'teacher':
      return TEACHER_ALLOWED_TABS.has(tab);
    case 'student':
      return STUDENT_ALLOWED_TABS.has(tab);
    case 'parent':
      return PARENT_ALLOWED_TABS.has(tab);
    case 'accountant':
      return ACCOUNTANT_ALLOWED_TABS.has(tab);
    default:
      return false;
  }
}

/**
 * Return default landing tab for a role upon login or redirection.
 */
export function getDefaultTabForRole(role: UserRole): ActiveNavTab {
  switch (role) {
    case 'teacher':
      return 'teacher_portal';
    case 'student':
      return 'student_portal';
    case 'parent':
      return 'parent_portal';
    case 'accountant':
      return 'dashboard';
    case 'super_admin':
    case 'campus_admin':
    default:
      return 'dashboard';
  }
}

/**
 * Check if role is an administrative role with super admin privileges.
 */
export function isSuperAdminRole(role: UserRole): boolean {
  return role === 'super_admin' || role === 'campus_admin';
}

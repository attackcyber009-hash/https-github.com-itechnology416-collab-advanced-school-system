import { ActiveNavTab, UserRole } from '../types';
import { authService, UserAccount } from './authService';

/**
 * ============================================================================
 * ENTERPRISE ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION AUTHORIZATION ENGINE
 * Default-Deny Security Model with Resource-Scope Validation
 * ============================================================================
 */

export type PermissionScope =
  | 'ALL'        // Full institutional access across all campuses & entities
  | 'ASSIGNED'   // Only assigned classes, sections, subjects, or students
  | 'OWN'        // Authenticated user's own profile and academic records
  | 'CHILDREN'   // Verified linked child accounts only
  | 'FINANCIAL'; // Institutional treasury, accounts, vouchers, and ledger only

export type ActionType =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'mark'
  | 'disburse'
  | 'export'
  | 'print'
  | 'manage';

export type PermissionCategory =
  | 'Dashboard & Navigation'
  | 'Students Management'
  | 'Teachers & Faculty'
  | 'Attendance Tracking'
  | 'Assignments & Homework'
  | 'Exams & Date Sheets'
  | 'Grades & Results'
  | 'Finance & Fee Billing'
  | 'Communications & Notices'
  | 'Reports & Analytics'
  | 'System Administration & Security';

export type Permission =
  // 1. Student Self-Service Academic Permissions
  | 'student.dashboard.view'
  | 'student.profile.view'
  | 'student.profile.edit'
  | 'student.password.change'
  | 'student.classes.view'
  | 'student.timetable.view'
  | 'student.assignments.view'
  | 'student.assignments.submit'
  | 'student.assignments.submissions.view'
  | 'student.exams.view'
  | 'student.results.view'
  | 'student.grades.view'
  | 'student.attendance.view'
  | 'student.materials.view'
  | 'student.materials.download'
  | 'student.notifications.view'
  | 'student.notifications.read'
  | 'student.announcements.view'
  | 'student.library.view'
  | 'student.library.borrow'
  | 'student.library.history'
  | 'student.messages.view'
  | 'student.messages.send'
  | 'student.bus_gps.view'
  | 'student.quiz.take'

  // 2. Parent Child-Monitoring Permissions
  | 'parent.dashboard.view'
  | 'parent.profile.view'
  | 'parent.profile.edit'
  | 'parent.password.change'
  | 'parent.children.view'
  | 'parent.children.attendance.view'
  | 'parent.children.grades.view'
  | 'parent.children.results.view'
  | 'parent.children.assignments.view'
  | 'parent.children.exams.view'
  | 'parent.children.fees.view'
  | 'parent.children.payments.view'
  | 'parent.children.receipts.view'
  | 'parent.notifications.view'
  | 'parent.notifications.read'
  | 'parent.announcements.view'
  | 'parent.calendar.view'
  | 'parent.messages.view'
  | 'parent.messages.send'
  | 'parent.helpdesk.view'
  | 'parent.helpdesk.create'
  | 'parent.ptm.view'
  | 'parent.fee_calc.view'
  | 'parent.bus_gps.view'

  // 3. Teacher Academic Permissions
  | 'teacher.dashboard.view'
  | 'teacher.classes.view'
  | 'teacher.students.view'
  | 'teacher.attendance.view'
  | 'teacher.attendance.mark'
  | 'teacher.grades.view'
  | 'teacher.grades.enter'
  | 'teacher.exams.view'
  | 'teacher.exams.manage_marks'
  | 'teacher.assignments.create'
  | 'teacher.assignments.view'
  | 'teacher.assignments.grade'
  | 'teacher.materials.upload'
  | 'teacher.materials.delete'
  | 'teacher.leave.apply'
  | 'teacher.leave.view'
  | 'teacher.cpd.view'
  | 'teacher.question_bank.view'
  | 'teacher.question_bank.generate'

  // 4. Accountant Finance Permissions
  | 'accountant.dashboard.view'
  | 'finance.vouchers.view'
  | 'finance.vouchers.create'
  | 'finance.vouchers.print'
  | 'finance.payments.record'
  | 'finance.defaulters.view'
  | 'finance.defaulters.sms'
  | 'finance.expenses.view'
  | 'finance.expenses.create'
  | 'finance.salaries.view'
  | 'finance.salaries.disburse'
  | 'finance.reports.view'
  | 'finance.procurement.view'
  | 'finance.pos.view'
  | 'finance.pos.transact'

  // 5. Super Admin Institutional Permissions
  | 'admin.dashboard.view'
  | 'super_admin.dashboard.view'
  | 'user.create'
  | 'user.edit'
  | 'user.delete'
  | 'user.manage'
  | 'role.create'
  | 'role.edit'
  | 'role.delete'
  | 'role.manage'
  | 'permission.manage'
  | 'system.settings'
  | 'school.settings'
  | 'security.settings'
  | 'audit.logs.view'
  | 'audit.logs.manage'
  | 'teacher.create'
  | 'teacher.edit'
  | 'teacher.delete'
  | 'teacher.manage'
  | 'parent.create'
  | 'parent.edit'
  | 'parent.delete'
  | 'parent.manage'
  | 'student.create'
  | 'student.edit'
  | 'student.delete'
  | 'student.manage'
  | 'class.create'
  | 'class.edit'
  | 'class.delete'
  | 'class.manage'
  | 'section.manage'
  | 'subject.manage'
  | 'attendance.manage_all'
  | 'grade.manage_all'
  | 'exam.manage_all'
  | 'finance.manage'
  | 'system.backup'
  | 'analytics.executive.view';

export interface PermissionDefinition {
  id: Permission;
  code: string;
  label: string;
  module: string;
  category: PermissionCategory;
  action: ActionType;
  defaultScope: PermissionScope;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  restrictionReason: string;
}

// COMPLETE MASTER CATALOG OF SYSTEM PERMISSIONS WITH METADATA
export const ALL_SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  // Dashboard & Navigation
  {
    id: 'super_admin.dashboard.view',
    code: 'dashboard.super_admin',
    label: 'Executive Command Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'ALL',
    description: 'View institutional KPIs, revenue metrics, campus branches, and system alerts.',
    riskLevel: 'HIGH',
    restrictionReason: 'Restricted to Super Admin & Central Executive Directors.',
  },
  {
    id: 'admin.dashboard.view',
    code: 'dashboard.admin',
    label: 'Campus Administration Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'ALL',
    description: 'View operational KPIs for campus attendance, admissions, and collections.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Restricted to Campus Administrators.',
  },
  {
    id: 'teacher.dashboard.view',
    code: 'dashboard.teacher',
    label: 'Teacher Academic Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'ASSIGNED',
    description: 'View assigned classes, subject schedules, pending diary tasks, and lesson plans.',
    riskLevel: 'LOW',
    restrictionReason: 'Available to Verified Faculty Members only.',
  },
  {
    id: 'student.dashboard.view',
    code: 'dashboard.student',
    label: 'Student Learning Portal Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'OWN',
    description: 'View personal timetable, today homework diary, learning vault, and attendance summary.',
    riskLevel: 'LOW',
    restrictionReason: 'Personal Student Dashboard only.',
  },
  {
    id: 'parent.dashboard.view',
    code: 'dashboard.parent',
    label: 'Parent Child Monitor Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'View linked children academic standing, attendance rate, fee challans, and notices.',
    riskLevel: 'LOW',
    restrictionReason: 'Accessible to Verified Parents for linked children only.',
  },
  {
    id: 'accountant.dashboard.view',
    code: 'dashboard.accountant',
    label: 'Finance & Accounts Dashboard',
    module: 'Dashboard',
    category: 'Dashboard & Navigation',
    action: 'view',
    defaultScope: 'FINANCIAL',
    description: 'View fee recovery status, pending arrears, expense trends, and bank balances.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Restricted to Campus Finance & Accounts Officers.',
  },

  // Students Management
  {
    id: 'student.manage',
    code: 'student.manage',
    label: 'Full Student Roster Management',
    module: 'Students',
    category: 'Students Management',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Perform full student lifecycle management: admissions, transfers, concessions, and archiving.',
    riskLevel: 'HIGH',
    restrictionReason: 'Modifying official student records requires Administrative clearance.',
  },
  {
    id: 'student.create',
    code: 'student.create',
    label: 'Register New Student Admission',
    module: 'Students',
    category: 'Students Management',
    action: 'create',
    defaultScope: 'ALL',
    description: 'Create new student admission records, generate student codes, and enroll into classes.',
    riskLevel: 'HIGH',
    restrictionReason: 'Admissions are handled by Admission Officers and Central Administration.',
  },
  {
    id: 'student.edit',
    code: 'student.edit',
    label: 'Edit Official Student Information',
    module: 'Students',
    category: 'Students Management',
    action: 'edit',
    defaultScope: 'ALL',
    description: 'Update student demographics, fee concessions, discount categories, and class assignments.',
    riskLevel: 'HIGH',
    restrictionReason: 'Modifying official student profiles is restricted to Administrators.',
  },
  {
    id: 'student.delete',
    code: 'student.delete',
    label: 'Delete / Archive Student Records',
    module: 'Students',
    category: 'Students Management',
    action: 'delete',
    defaultScope: 'ALL',
    description: 'Permanently remove or archive student profiles from the central database.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Destructive deletion of student records is restricted strictly to Super Admin.',
  },
  {
    id: 'teacher.students.view',
    code: 'student.view.assigned',
    label: 'View Assigned Class Students',
    module: 'Students',
    category: 'Students Management',
    action: 'view',
    defaultScope: 'ASSIGNED',
    description: 'Inspect profiles, contact information, and attendance history of students in assigned classes.',
    riskLevel: 'LOW',
    restrictionReason: 'Restricted to assigned classes for academic tracking.',
  },
  {
    id: 'parent.children.view',
    code: 'student.view.children',
    label: 'View Linked Children Profiles',
    module: 'Students',
    category: 'Students Management',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'View academic standing, student codes, and class sections of verified linked children.',
    riskLevel: 'LOW',
    restrictionReason: 'Parents can only access verified children linked to their account.',
  },
  {
    id: 'student.profile.view',
    code: 'student.view.own',
    label: 'View Own Student Profile',
    module: 'Students',
    category: 'Students Management',
    action: 'view',
    defaultScope: 'OWN',
    description: 'View personal roll number, admission registration, class section, and blood group.',
    riskLevel: 'LOW',
    restrictionReason: 'Self-service view of own profile only.',
  },
  {
    id: 'student.profile.edit',
    code: 'student.profile.update_contact',
    label: 'Update Self Contact & Avatar',
    module: 'Students',
    category: 'Students Management',
    action: 'edit',
    defaultScope: 'OWN',
    description: 'Update non-academic self details such as emergency phone, profile avatar, and address.',
    riskLevel: 'LOW',
    restrictionReason: 'Limited self-service contact update only.',
  },

  // Teachers & Faculty
  {
    id: 'teacher.manage',
    code: 'teacher.manage',
    label: 'Faculty & Staff Administration',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Manage staff employment, subject allocations, salaries, and leave policies.',
    riskLevel: 'HIGH',
    restrictionReason: 'Staff administration requires Central HR & Super Admin authority.',
  },
  {
    id: 'teacher.create',
    code: 'teacher.create',
    label: 'Onboard New Faculty Member',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'create',
    defaultScope: 'ALL',
    description: 'Register new teachers, assign employee codes, basic salary, and department designations.',
    riskLevel: 'HIGH',
    restrictionReason: 'Restricted to HR and Campus Administration.',
  },
  {
    id: 'teacher.edit',
    code: 'teacher.edit',
    label: 'Edit Faculty Information & Salaries',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'edit',
    defaultScope: 'ALL',
    description: 'Modify teacher designations, department allocations, phone numbers, and compensation.',
    riskLevel: 'HIGH',
    restrictionReason: 'Editing staff records is restricted to Administrative HR personnel.',
  },
  {
    id: 'teacher.delete',
    code: 'teacher.delete',
    label: 'Terminate / Remove Staff Record',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'delete',
    defaultScope: 'ALL',
    description: 'Terminate or permanently delete faculty profiles and revoke system access.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Staff termination requires Super Admin confirmation.',
  },
  {
    id: 'teacher.cpd.view',
    code: 'teacher.cpd.view',
    label: 'Continuous Professional Development & Lesson Plans',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'view',
    defaultScope: 'ASSIGNED',
    description: 'Access pedagogical training modules, teaching rubrics, and upload weekly lesson plans.',
    riskLevel: 'LOW',
    restrictionReason: 'Available to active Faculty members.',
  },
  {
    id: 'teacher.leave.apply',
    code: 'teacher.leave.apply',
    label: 'Apply for Faculty Leave',
    module: 'Teachers & Staff',
    category: 'Teachers & Faculty',
    action: 'create',
    defaultScope: 'OWN',
    description: 'Submit leave applications with medical/casual documentation to Campus Principal.',
    riskLevel: 'LOW',
    restrictionReason: 'Self-service faculty leave portal.',
  },

  // Attendance Tracking
  {
    id: 'attendance.manage_all',
    code: 'attendance.manage_all',
    label: 'Master Attendance & Turnstile Sync',
    module: 'Attendance',
    category: 'Attendance Tracking',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Configure biometric turnstiles, RFID card scanners, and override school-wide attendance records.',
    riskLevel: 'HIGH',
    restrictionReason: 'School-wide attendance overrides require Administrative clearance.',
  },
  {
    id: 'teacher.attendance.mark',
    code: 'attendance.mark.assigned',
    label: 'Mark & Record Class Attendance',
    module: 'Attendance',
    category: 'Attendance Tracking',
    action: 'mark',
    defaultScope: 'ASSIGNED',
    description: 'Record daily Present, Absent, Late, or On-Leave status for students in assigned classes.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Only appointed class teachers can mark daily roll calls.',
  },
  {
    id: 'teacher.attendance.view',
    code: 'attendance.view.assigned',
    label: 'View Assigned Class Attendance Logs',
    module: 'Attendance',
    category: 'Attendance Tracking',
    action: 'view',
    defaultScope: 'ASSIGNED',
    description: 'View monthly attendance registers and calculate percentage thresholds for assigned classes.',
    riskLevel: 'LOW',
    restrictionReason: 'Scoped to assigned teaching classes.',
  },
  {
    id: 'student.attendance.view',
    code: 'attendance.view.own',
    label: 'View Personal Attendance Record',
    module: 'Attendance',
    category: 'Attendance Tracking',
    action: 'view',
    defaultScope: 'OWN',
    description: 'Check personal daily attendance timestamps, check-in logs, and cumulative attendance percentage.',
    riskLevel: 'LOW',
    restrictionReason: 'Read-only view of own personal attendance record.',
  },
  {
    id: 'parent.children.attendance.view',
    code: 'attendance.view.children',
    label: 'Track Children Daily Attendance & Alerts',
    module: 'Attendance',
    category: 'Attendance Tracking',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'Receive automated arrival/departure notifications and monthly attendance breakdown for children.',
    riskLevel: 'LOW',
    restrictionReason: 'Read-only tracking for verified children only.',
  },

  // Assignments & Homework
  {
    id: 'teacher.assignments.create',
    code: 'assignments.create',
    label: 'Create & Publish Homework Diaries',
    module: 'Assignments & Diary',
    category: 'Assignments & Homework',
    action: 'create',
    defaultScope: 'ASSIGNED',
    description: 'Publish daily homework tasks, textbook page references, submission deadlines, and SMS notifications.',
    riskLevel: 'LOW',
    restrictionReason: 'Faculty members create homework for assigned classes.',
  },
  {
    id: 'teacher.assignments.grade',
    code: 'assignments.grade',
    label: 'Review & Grade Student Submissions',
    module: 'Assignments & Diary',
    category: 'Assignments & Homework',
    action: 'mark',
    defaultScope: 'ASSIGNED',
    description: 'Review uploaded student homework documents, add teacher remarks, and assign rubric scores.',
    riskLevel: 'LOW',
    restrictionReason: 'Assigned teachers evaluate their class submissions.',
  },
  {
    id: 'teacher.materials.upload',
    code: 'materials.upload',
    label: 'Upload Study Materials & Past Papers',
    module: 'Study Materials',
    category: 'Assignments & Homework',
    action: 'create',
    defaultScope: 'ASSIGNED',
    description: 'Upload PDF lecture notes, syllabi, question banks, and video links to the digital vault.',
    riskLevel: 'LOW',
    restrictionReason: 'Teachers upload study content for assigned subjects.',
  },
  {
    id: 'student.assignments.submit',
    code: 'assignments.submit.own',
    label: 'Submit Homework Solutions Online',
    module: 'Assignments & Diary',
    category: 'Assignments & Homework',
    action: 'submit',
    defaultScope: 'OWN',
    description: 'Upload scanned homework copies, digital assignments, and view teacher feedback.',
    riskLevel: 'LOW',
    restrictionReason: 'Students submit work for their enrolled classes.',
  },
  {
    id: 'student.materials.download',
    code: 'materials.download.own',
    label: 'Browse & Download Study Vault Files',
    module: 'Study Materials',
    category: 'Assignments & Homework',
    action: 'export',
    defaultScope: 'OWN',
    description: 'Search, preview, and download study notes, solved question papers, and worksheets.',
    riskLevel: 'LOW',
    restrictionReason: 'Self-service study repository for enrolled students.',
  },
  {
    id: 'parent.children.assignments.view',
    code: 'assignments.view.children',
    label: 'Inspect Children Daily Homework & Diary',
    module: 'Assignments & Diary',
    category: 'Assignments & Homework',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'Monitor daily homework assignments, pending deadlines, and submission verification for children.',
    riskLevel: 'LOW',
    restrictionReason: 'Read-only view for linked children.',
  },

  // Exams & Date Sheets
  {
    id: 'exam.manage_all',
    code: 'exams.manage_all',
    label: 'Master Exam Terms & Date Sheet Builder',
    module: 'Exams & Assessment',
    category: 'Exams & Date Sheets',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Create institutional exam terms (Midterm, Final, Annual), schedule date sheets, and print admit cards.',
    riskLevel: 'HIGH',
    restrictionReason: 'Institutional examination schedules are configured by Exam Controllers.',
  },
  {
    id: 'teacher.question_bank.generate',
    code: 'question_bank.generate',
    label: 'Generate Exam Papers & AI Question Bank',
    module: 'Exams & Assessment',
    category: 'Exams & Date Sheets',
    action: 'create',
    defaultScope: 'ASSIGNED',
    description: 'Author MCQ/Subjective questions, generate differentiated question papers, and export answer keys.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Faculty members generate exam papers for assigned subjects.',
  },
  {
    id: 'student.exams.view',
    code: 'exams.view.own',
    label: 'View Exam Date Sheets & Admit Slips',
    module: 'Exams & Assessment',
    category: 'Exams & Date Sheets',
    action: 'view',
    defaultScope: 'OWN',
    description: 'Check official examination dates, room allocations, syllabus coverage, and admit card numbers.',
    riskLevel: 'LOW',
    restrictionReason: 'Enrolled students view their upcoming exam schedules.',
  },
  {
    id: 'parent.children.exams.view',
    code: 'exams.view.children',
    label: 'View Children Exam Schedules',
    module: 'Exams & Assessment',
    category: 'Exams & Date Sheets',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'Inspect upcoming date sheets and exam room numbers for linked children.',
    riskLevel: 'LOW',
    restrictionReason: 'Read-only exam schedule for children.',
  },
  {
    id: 'student.quiz.take',
    code: 'quiz.take',
    label: 'Attempt Digital Practice Quizzes',
    module: 'LMS & Quizzes',
    category: 'Exams & Date Sheets',
    action: 'submit',
    defaultScope: 'OWN',
    description: 'Participate in online self-evaluation quizzes with instant grading and explanation review.',
    riskLevel: 'LOW',
    restrictionReason: 'Self-assessment quiz engine for students.',
  },

  // Grades & Results
  {
    id: 'grade.manage_all',
    code: 'grades.manage_all',
    label: 'Master Gradebook & Official Report Cards',
    module: 'Grades & Report Cards',
    category: 'Grades & Results',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Configure institutional grading policies (GPA, Percentage bands), publish official results, and print term cards.',
    riskLevel: 'HIGH',
    restrictionReason: 'Publishing and overriding official gradebooks requires Super Admin authorization.',
  },
  {
    id: 'teacher.grades.enter',
    code: 'grades.enter.assigned',
    label: 'Enter Subject Assessment Marks',
    module: 'Grades & Report Cards',
    category: 'Grades & Results',
    action: 'mark',
    defaultScope: 'ASSIGNED',
    description: 'Input obtained marks, practical scores, homework weightages, and teacher remarks for assigned classes.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Only assigned subject teachers can enter preliminary marks before publication.',
  },
  {
    id: 'student.results.view',
    code: 'grades.view.own',
    label: 'View Personal Term Results & Marksheets',
    module: 'Grades & Report Cards',
    category: 'Grades & Results',
    action: 'view',
    defaultScope: 'OWN',
    description: 'Inspect official published term results, subject grades, GPA, class positions, and teacher remarks.',
    riskLevel: 'LOW',
    restrictionReason: 'Students have read-only access to their verified published marks.',
  },
  {
    id: 'parent.children.grades.view',
    code: 'grades.view.children',
    label: 'View Children Academic Progress & Report Cards',
    module: 'Grades & Report Cards',
    category: 'Grades & Results',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'Review detailed term-by-term performance analytics, subject rankings, and print official report cards.',
    riskLevel: 'LOW',
    restrictionReason: 'Parents have read-only access to their linked children results.',
  },

  // Finance & Fee Billing
  {
    id: 'finance.manage',
    code: 'finance.manage_all',
    label: 'Full Institutional Treasury & Fee Engine',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Configure fee structures, concessions, sibling discount rules, bank ledgers, and institutional balance sheets.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Institutional financial policy is restricted to Super Admin & Chief Financial Officers.',
  },
  {
    id: 'finance.vouchers.create',
    code: 'finance.vouchers.generate',
    label: 'Generate Monthly 3-Copy Fee Challans',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'create',
    defaultScope: 'FINANCIAL',
    description: 'Batch generate monthly 1Link/Kuickpay compliant bank fee vouchers with barcode identifiers.',
    riskLevel: 'HIGH',
    restrictionReason: 'Generating official billing vouchers is restricted to the Accounts Department.',
  },
  {
    id: 'finance.payments.record',
    code: 'finance.payments.record',
    label: 'Record Fee Payments & Issue Receipts',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'create',
    defaultScope: 'FINANCIAL',
    description: 'Process cash, cheque, and bank deposit payments, calculate late fee surcharges, and print receipts.',
    riskLevel: 'HIGH',
    restrictionReason: 'Collecting funds and updating ledger balances requires Accountant credentials.',
  },
  {
    id: 'finance.defaulters.sms',
    code: 'finance.defaulters.alert',
    label: 'Defaulters Tracking & SMS Notice Dispatch',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'manage',
    defaultScope: 'FINANCIAL',
    description: 'Filter overdue student accounts and dispatch automated payment reminder SMS to parents.',
    riskLevel: 'MEDIUM',
    restrictionReason: 'Fee collection operations are handled by the Accounts Office.',
  },
  {
    id: 'finance.expenses.create',
    code: 'finance.expenses.record',
    label: 'Record Campus Operational Expenses',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'create',
    defaultScope: 'FINANCIAL',
    description: 'Record double-entry expense vouchers for utilities, lab supplies, maintenance, and fleet fuel.',
    riskLevel: 'HIGH',
    restrictionReason: 'Disbursing campus funds requires authorized Accounting access.',
  },
  {
    id: 'finance.salaries.disburse',
    code: 'finance.salaries.payroll',
    label: 'Faculty Payroll & Salary Slips',
    module: 'Finance & Accounts',
    category: 'Finance & Fee Billing',
    action: 'disburse',
    defaultScope: 'FINANCIAL',
    description: 'Process monthly payroll with EOBI, tax deductions, and advance loan adjustments.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Payroll disbursement requires Accounts & Admin clearance.',
  },
  {
    id: 'parent.children.fees.view',
    code: 'finance.vouchers.view_children',
    label: 'View Fee Invoices & Download Challans',
    module: 'Fee Vouchers',
    category: 'Finance & Fee Billing',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'View unpaid fee vouchers, download 3-copy PDF challans, and inspect payment receipts for children.',
    riskLevel: 'LOW',
    restrictionReason: 'Parents can view and pay verified invoices for their children.',
  },
  {
    id: 'parent.children.payments.view',
    code: 'finance.payments.online_gateway',
    label: 'Pay Child Fee via Digital Gateway',
    module: 'Digital Payment',
    category: 'Finance & Fee Billing',
    action: 'submit',
    defaultScope: 'CHILDREN',
    description: 'Make instantaneous online payments via 1Link, Debit/Credit Card, Easypaisa, and JazzCash.',
    riskLevel: 'LOW',
    restrictionReason: 'Self-service digital payment for verified child vouchers.',
  },

  // Communications & Notices
  {
    id: 'audit.logs.view',
    code: 'communications.broadcast',
    label: 'School-Wide Broadcast & Circulars',
    module: 'Communications',
    category: 'Communications & Notices',
    action: 'create',
    defaultScope: 'ALL',
    description: 'Broadcast emergency school closures, holiday announcements, and event circulars via SMS/WhatsApp.',
    riskLevel: 'HIGH',
    restrictionReason: 'School-wide broadcasting is restricted to Central Administration.',
  },
  {
    id: 'student.announcements.view',
    code: 'notices.view.student',
    label: 'View Official Circulars & Notices',
    module: 'Notice Board',
    category: 'Communications & Notices',
    action: 'view',
    defaultScope: 'OWN',
    description: 'Read published campus notices, holiday schedules, examination guidelines, and sports circulars.',
    riskLevel: 'LOW',
    restrictionReason: 'Public campus notice board.',
  },
  {
    id: 'parent.announcements.view',
    code: 'notices.view.parent',
    label: 'View Parent Announcements & Circulars',
    module: 'Notice Board',
    category: 'Communications & Notices',
    action: 'view',
    defaultScope: 'CHILDREN',
    description: 'Access school-parent circulars, fee due date notices, PTM invitations, and calendar events.',
    riskLevel: 'LOW',
    restrictionReason: 'Parent circulars and announcements.',
  },
  {
    id: 'parent.helpdesk.create',
    code: 'helpdesk.ticket.create',
    label: 'Submit Parent Helpdesk Inquiries',
    module: 'Helpdesk',
    category: 'Communications & Notices',
    action: 'create',
    defaultScope: 'CHILDREN',
    description: 'Create direct support tickets for transport, fee disputes, or teacher appointment requests.',
    riskLevel: 'LOW',
    restrictionReason: 'Parent-to-administration communication channel.',
  },

  // Reports & Analytics
  {
    id: 'analytics.executive.view',
    code: 'analytics.executive',
    label: 'Executive BI Analytics & Board Metrics',
    module: 'Reports & BI',
    category: 'Reports & Analytics',
    action: 'view',
    defaultScope: 'ALL',
    description: 'View multi-campus enrollment growth, fee collection ratios, teacher retention, and predictive attrition.',
    riskLevel: 'HIGH',
    restrictionReason: 'Strategic BI analytics reserved for Central Executives.',
  },
  {
    id: 'finance.reports.view',
    code: 'reports.finance.view',
    label: 'Financial Statements & Audit Ledgers',
    module: 'Reports & BI',
    category: 'Reports & Analytics',
    action: 'export',
    defaultScope: 'FINANCIAL',
    description: 'Generate double-entry trial balances, profit & loss statements, fee recovery reconciliations, and tax reports.',
    riskLevel: 'HIGH',
    restrictionReason: 'Institutional financial ledgers restricted to Accounts.',
  },

  // System Administration & Security
  {
    id: 'user.manage',
    code: 'system.users.manage',
    label: 'User Accounts & Security Credentials',
    module: 'Security Administration',
    category: 'System Administration & Security',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Provision system user accounts, reset passwords, lock compromised sessions, and enforce 2FA authentication.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'User security provisioning is strictly restricted to Super Admin.',
  },
  {
    id: 'role.manage',
    code: 'system.roles.manage',
    label: 'Role Definitions & Privilege Assignment',
    module: 'Security Administration',
    category: 'System Administration & Security',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Define custom user roles, assign permission matrices, and enforce least-privilege policies.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Only Super Admin has authority to alter role hierarchies.',
  },
  {
    id: 'permission.manage',
    code: 'system.permissions.manage',
    label: 'Permission Matrix & RBAC Policy Engine',
    module: 'Security Administration',
    category: 'System Administration & Security',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Directly modify granular permission flags, override access levels, and review security violation alerts.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Security Policy Management is strictly restricted to Super Admin.',
  },
  {
    id: 'system.settings',
    code: 'system.settings.manage',
    label: 'Global Institutional Settings',
    module: 'System Settings',
    category: 'System Administration & Security',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Configure multi-campus branches, SMS carrier gateways, payment API credentials, and localization.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Institutional infrastructure configuration requires Super Admin access.',
  },
  {
    id: 'audit.logs.manage',
    code: 'system.audit.logs',
    label: 'Security Audit Trail & Forensic Logs',
    module: 'Security Administration',
    category: 'System Administration & Security',
    action: 'view',
    defaultScope: 'ALL',
    description: 'Inspect real-time security events, unauthorized RBAC escalation attempts, login histories, and IP traces.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Forensic audit inspection is restricted to Super Admin.',
  },
  {
    id: 'system.backup',
    code: 'system.database.backup',
    label: 'Database Disaster Recovery & Backups',
    module: 'System Settings',
    category: 'System Administration & Security',
    action: 'manage',
    defaultScope: 'ALL',
    description: 'Trigger encrypted database snapshots, export JSON backups, and verify disaster recovery protocols.',
    riskLevel: 'CRITICAL',
    restrictionReason: 'Disaster recovery and database exports require Super Admin credentials.',
  },
];

// DEFAULT BASELINE PERMISSION MAPS PER ROLE
const BASELINE_ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  // 1. STUDENT: Strictly self-service academic and personal learning only
  student: new Set<Permission>([
    'student.dashboard.view',
    'student.profile.view',
    'student.profile.edit',
    'student.password.change',
    'student.classes.view',
    'student.timetable.view',
    'student.assignments.view',
    'student.assignments.submit',
    'student.assignments.submissions.view',
    'student.exams.view',
    'student.results.view',
    'student.grades.view',
    'student.attendance.view',
    'student.materials.view',
    'student.materials.download',
    'student.notifications.view',
    'student.notifications.read',
    'student.announcements.view',
    'student.library.view',
    'student.library.borrow',
    'student.library.history',
    'student.messages.view',
    'student.messages.send',
    'student.bus_gps.view',
    'student.quiz.take',
  ]),

  // 2. PARENT: Strictly child-monitoring and verified fee payments only
  parent: new Set<Permission>([
    'parent.dashboard.view',
    'parent.profile.view',
    'parent.profile.edit',
    'parent.password.change',
    'parent.children.view',
    'parent.children.attendance.view',
    'parent.children.grades.view',
    'parent.children.results.view',
    'parent.children.assignments.view',
    'parent.children.exams.view',
    'parent.children.fees.view',
    'parent.children.payments.view',
    'parent.children.receipts.view',
    'parent.notifications.view',
    'parent.notifications.read',
    'parent.announcements.view',
    'parent.calendar.view',
    'parent.messages.view',
    'parent.messages.send',
    'parent.helpdesk.view',
    'parent.helpdesk.create',
    'parent.ptm.view',
    'parent.fee_calc.view',
    'parent.bus_gps.view',
  ]),

  // 3. TEACHER: Assigned academic, classroom, and lesson management only
  teacher: new Set<Permission>([
    'teacher.dashboard.view',
    'teacher.classes.view',
    'teacher.students.view',
    'teacher.attendance.view',
    'teacher.attendance.mark',
    'teacher.grades.view',
    'teacher.grades.enter',
    'teacher.exams.view',
    'teacher.exams.manage_marks',
    'teacher.assignments.create',
    'teacher.assignments.view',
    'teacher.assignments.grade',
    'teacher.materials.upload',
    'teacher.materials.delete',
    'teacher.leave.apply',
    'teacher.leave.view',
    'teacher.cpd.view',
    'teacher.question_bank.view',
    'teacher.question_bank.generate',
  ]),

  // 4. ACCOUNTANT: Fee management, challans, cash/bank ledgers, and expenses
  accountant: new Set<Permission>([
    'accountant.dashboard.view',
    'finance.vouchers.view',
    'finance.vouchers.create',
    'finance.vouchers.print',
    'finance.payments.record',
    'finance.defaulters.view',
    'finance.defaulters.sms',
    'finance.expenses.view',
    'finance.expenses.create',
    'finance.salaries.view',
    'finance.salaries.disburse',
    'finance.reports.view',
    'finance.procurement.view',
    'finance.pos.view',
    'finance.pos.transact',
  ]),

  // 5. CAMPUS ADMIN: Campus-wide academic & administrative authority
  campus_admin: new Set<Permission>([
    'admin.dashboard.view',
    'user.create',
    'user.edit',
    'teacher.manage',
    'parent.manage',
    'student.manage',
    'class.manage',
    'attendance.manage_all',
    'grade.manage_all',
    'exam.manage_all',
    'finance.vouchers.view',
    'finance.vouchers.create',
    'finance.vouchers.print',
    'finance.payments.record',
    'finance.defaulters.view',
    'finance.defaulters.sms',
    'finance.expenses.view',
    'finance.expenses.create',
    'finance.salaries.view',
    'finance.salaries.disburse',
    'finance.reports.view',
  ]),

  // 6. SUPER ADMIN: Supreme institutional privileges across all modules
  super_admin: new Set<Permission>(ALL_SYSTEM_PERMISSIONS.map((p) => p.id)),
};

// STORAGE KEY FOR SUPER ADMIN OVERRIDES
const RBAC_STORAGE_KEY = 'educators_rbac_role_overrides_v2';

/**
 * Load Custom Role Permissions from localStorage or return baseline
 */
function loadRolePermissions(): Record<UserRole, Set<Permission>> {
  try {
    const raw = localStorage.getItem(RBAC_STORAGE_KEY);
    if (raw) {
      const parsed: Record<string, string[]> = JSON.parse(raw);
      const result: Record<UserRole, Set<Permission>> = { ...BASELINE_ROLE_PERMISSIONS };
      for (const roleKey of Object.keys(parsed)) {
        if (roleKey in result) {
          result[roleKey as UserRole] = new Set<Permission>(parsed[roleKey] as Permission[]);
        }
      }
      return result;
    }
  } catch {}
  return BASELINE_ROLE_PERMISSIONS;
}

// Global in-memory state initialized from persistent storage
let dynamicRolePermissions: Record<UserRole, Set<Permission>> = loadRolePermissions();

function saveRolePermissions() {
  try {
    const serializable: Record<string, string[]> = {};
    for (const [role, permSet] of Object.entries(dynamicRolePermissions)) {
      serializable[role] = Array.from(permSet);
    }
    localStorage.setItem(RBAC_STORAGE_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.error('Failed to save dynamic RBAC permissions', e);
  }
}

// AUTHORITATIVE ALLOWED TABS / ROUTES FOR EACH ROLE (DEFAULT-DENY)
const TEACHER_ALLOWED_TABS = new Set<ActiveNavTab>([
  'teacher_portal',
  'dashboard',
  'daily_homework_diary',
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
  'permissions_access',
]);

const STUDENT_ALLOWED_TABS = new Set<ActiveNavTab>([
  'student_portal',
  'dashboard',
  'daily_homework_diary',
  'study_materials',
  'school_notice_board',
  'quiz',
  'library',
  'live_bus_gps_tracker',
  'permissions_access',
]);

const PARENT_ALLOWED_TABS = new Set<ActiveNavTab>([
  'parent_portal',
  'dashboard',
  'parent_helpdesk',
  'ptm_portal',
  'digital_payment_gateway',
  'family_fee_calculator',
  'school_notice_board',
  'live_bus_gps_tracker',
  'permissions_access',
]);

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
  'permissions_access',
]);

/**
 * Check if the given role is granted an explicit permission.
 * Implements Default-Deny: If not explicitly assigned, returns false.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'super_admin') {
    return true;
  }
  const permissions = dynamicRolePermissions[role];
  if (!permissions) {
    return false;
  }
  return permissions.has(permission);
}

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

/**
 * Get Resource Scope for a given user role
 */
export function getRoleScope(role: UserRole): { scope: PermissionScope; label: string; description: string } {
  switch (role) {
    case 'super_admin':
      return {
        scope: 'ALL',
        label: 'Global Multi-Campus (Institutional)',
        description: 'Unrestricted administrative access across all campuses, users, classes, and financial ledgers.',
      };
    case 'campus_admin':
      return {
        scope: 'ALL',
        label: 'Campus-Wide Master Scope',
        description: 'Administrative authority within designated campus branch.',
      };
    case 'teacher':
      return {
        scope: 'ASSIGNED',
        label: 'Assigned Classes & Subjects Only',
        description: 'Authorized only to view and manage assigned classes, enrolled students, homework diaries, and exam mark entry.',
      };
    case 'student':
      return {
        scope: 'OWN',
        label: 'Individual Student Account (Self)',
        description: 'Strict personal scope limited strictly to personal academic diary, learning vault, own exam results, and bus GPS.',
      };
    case 'parent':
      return {
        scope: 'CHILDREN',
        label: 'Verified Linked Children (Family)',
        description: 'Read-only access strictly restricted to verified child profiles, attendance alerts, exam report cards, and fee vouchers.',
      };
    case 'accountant':
      return {
        scope: 'FINANCIAL',
        label: 'Institutional Finance & Accounts Scope',
        description: 'Restricted strictly to fee vouchers, bank challan generation, cash/bank expenses, and staff payroll ledgers.',
      };
    default:
      return {
        scope: 'OWN',
        label: 'Restricted User Scope',
        description: 'Default minimal self-service access.',
      };
  }
}

export interface PermissionStatusItem extends PermissionDefinition {
  isGranted: boolean;
  effectiveScope: PermissionScope;
  statusLabel: 'Allowed' | 'Read Only' | 'Restricted';
  statusCode: 'ALLOWED' | 'READ_ONLY' | 'RESTRICTED';
}

export interface CategorizedPermissionGroup {
  category: PermissionCategory;
  totalCount: number;
  grantedCount: number;
  restrictedCount: number;
  items: PermissionStatusItem[];
}

export interface PermissionSummary {
  role: UserRole;
  roleDisplayName: string;
  accountStatus: string;
  totalGranted: number;
  totalRestricted: number;
  readOnlyCount: number;
  fullAccessCount: number;
  allowedModulesCount: number;
  restrictedModulesCount: number;
  scope: PermissionScope;
  scopeLabel: string;
  scopeDescription: string;
  accessibleResources: string[];
  restrictedModules: string[];
  keyCapabilities: { label: string; granted: boolean; risk: string }[];
  lastUpdated: string;
}

/**
 * Dynamically compute permission status for all definitions for a given role
 */
export function getDetailedPermissionsForRole(role: UserRole): PermissionStatusItem[] {
  const roleScopeInfo = getRoleScope(role);

  return ALL_SYSTEM_PERMISSIONS.map((def) => {
    const isGranted = hasPermission(role, def.id);

    let statusCode: 'ALLOWED' | 'READ_ONLY' | 'RESTRICTED' = 'RESTRICTED';
    let statusLabel: 'Allowed' | 'Read Only' | 'Restricted' = 'Restricted';

    if (isGranted) {
      if (def.action === 'view') {
        statusCode = 'READ_ONLY';
        statusLabel = 'Read Only';
      } else {
        statusCode = 'ALLOWED';
        statusLabel = 'Allowed';
      }
    }

    return {
      ...def,
      isGranted,
      effectiveScope: isGranted ? roleScopeInfo.scope : def.defaultScope,
      statusLabel,
      statusCode,
    };
  });
}

/**
 * Group permissions by category for a role with dynamic stats
 */
export function getCategorizedPermissions(role: UserRole): CategorizedPermissionGroup[] {
  const allItems = getDetailedPermissionsForRole(role);
  const categoryMap = new Map<PermissionCategory, PermissionStatusItem[]>();

  // Ensure all categories exist in predictable order
  const CATEGORY_ORDER: PermissionCategory[] = [
    'Dashboard & Navigation',
    'Students Management',
    'Teachers & Faculty',
    'Attendance Tracking',
    'Assignments & Homework',
    'Exams & Date Sheets',
    'Grades & Results',
    'Finance & Fee Billing',
    'Communications & Notices',
    'Reports & Analytics',
    'System Administration & Security',
  ];

  CATEGORY_ORDER.forEach((cat) => categoryMap.set(cat, []));

  allItems.forEach((item) => {
    const list = categoryMap.get(item.category) || [];
    list.push(item);
    categoryMap.set(item.category, list);
  });

  return CATEGORY_ORDER.map((category) => {
    const items = categoryMap.get(category) || [];
    const grantedCount = items.filter((i) => i.isGranted).length;
    const restrictedCount = items.length - grantedCount;

    return {
      category,
      totalCount: items.length,
      grantedCount,
      restrictedCount,
      items,
    };
  });
}

/**
 * Calculate dynamic permission summary metrics for user dashboard widget
 */
export function calculatePermissionSummary(
  role: UserRole,
  userAccount?: UserAccount | null
): PermissionSummary {
  const detailed = getDetailedPermissionsForRole(role);
  const categories = getCategorizedPermissions(role);
  const scopeInfo = getRoleScope(role);

  const totalGranted = detailed.filter((d) => d.isGranted).length;
  const totalRestricted = detailed.filter((d) => !d.isGranted).length;
  const readOnlyCount = detailed.filter((d) => d.isGranted && d.action === 'view').length;
  const fullAccessCount = detailed.filter((d) => d.isGranted && d.action !== 'view').length;

  const allowedModulesSet = new Set<string>();
  const restrictedModulesSet = new Set<string>();

  categories.forEach((cat) => {
    if (cat.grantedCount > 0) {
      allowedModulesSet.add(cat.category);
    }
    if (cat.restrictedCount > 0 && cat.grantedCount === 0) {
      restrictedModulesSet.add(cat.category);
    }
  });

  const accessibleResources: string[] = [];
  if (role === 'super_admin' || role === 'campus_admin') {
    accessibleResources.push('All Campus Branches', 'All Students & Faculty', 'Financial Ledgers & Banks', 'System Security & Backups');
  } else if (role === 'teacher') {
    accessibleResources.push('Assigned Class Rosters', 'Attendance Registers', 'Daily Homework Diaries', 'Exam Mark Entry');
  } else if (role === 'student') {
    accessibleResources.push('Personal Student Profile', 'Class Timetable', 'Homework Submissions', 'Study Vault & Practice Quizzes');
  } else if (role === 'parent') {
    accessibleResources.push('Linked Children Academic Profiles', 'Attendance Tracker', 'Fee Vouchers & 1Link Gateway', 'Parent Helpdesk');
  } else if (role === 'accountant') {
    accessibleResources.push('Fee Billing Vouchers', 'Defaulters Recovery', 'Expense Ledger', 'Staff Salaries');
  }

  // Key capabilities highlighting
  const keyCapabilities = [
    {
      label: 'Student Record Management',
      granted: hasPermission(role, 'student.manage') || hasPermission(role, 'student.create'),
      risk: 'HIGH',
    },
    {
      label: 'Daily Attendance Marking',
      granted: hasPermission(role, 'attendance.manage_all') || hasPermission(role, 'teacher.attendance.mark'),
      risk: 'MEDIUM',
    },
    {
      label: 'Homework Diary Authoring',
      granted: hasPermission(role, 'teacher.assignments.create'),
      risk: 'LOW',
    },
    {
      label: 'Official Gradebook & Marks Entry',
      granted: hasPermission(role, 'grade.manage_all') || hasPermission(role, 'teacher.grades.enter'),
      risk: 'HIGH',
    },
    {
      label: 'Fee Invoicing & Payment Collection',
      granted: hasPermission(role, 'finance.manage') || hasPermission(role, 'finance.payments.record'),
      risk: 'CRITICAL',
    },
    {
      label: 'Role & Security Administration',
      granted: hasPermission(role, 'role.manage') || hasPermission(role, 'permission.manage'),
      risk: 'CRITICAL',
    },
    {
      label: 'School-Wide Broadcast & Circulars',
      granted: hasPermission(role, 'audit.logs.view') || hasPermission(role, 'user.manage'),
      risk: 'HIGH',
    },
  ];

  return {
    role,
    roleDisplayName: role.replace('_', ' ').toUpperCase(),
    accountStatus: userAccount?.status || 'Active',
    totalGranted,
    totalRestricted,
    readOnlyCount,
    fullAccessCount,
    allowedModulesCount: allowedModulesSet.size,
    restrictedModulesCount: restrictedModulesSet.size,
    scope: scopeInfo.scope,
    scopeLabel: scopeInfo.label,
    scopeDescription: scopeInfo.description,
    accessibleResources,
    restrictedModules: Array.from(restrictedModulesSet),
    keyCapabilities,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

/**
 * Super Admin Management: Toggle a permission for a role with Audit Trail
 */
export function updateRolePermissionGrant(
  targetRole: UserRole,
  permissionId: Permission,
  grant: boolean,
  adminName: string = 'Super Admin'
): { success: boolean; message: string } {
  if (targetRole === 'super_admin') {
    return {
      success: false,
      message: 'Security Policy: Super Admin role permissions are immutable and require full spectrum authority.',
    };
  }

  if (!dynamicRolePermissions[targetRole]) {
    dynamicRolePermissions[targetRole] = new Set<Permission>();
  }

  const roleSet = dynamicRolePermissions[targetRole];
  if (grant) {
    roleSet.add(permissionId);
  } else {
    roleSet.delete(permissionId);
  }

  saveRolePermissions();

  authService.logAuditEvent(
    `RBAC_PERMISSION_${grant ? 'GRANTED' : 'REVOKED'}: Permission "${permissionId}" ${grant ? 'granted to' : 'revoked from'} role "${targetRole}"`,
    'SECURITY',
    grant ? 'WARNING' : 'INFO',
    'SUCCESS',
    adminName,
    'super_admin'
  );

  return {
    success: true,
    message: `Permission "${permissionId}" successfully ${grant ? 'granted to' : 'revoked from'} ${targetRole}.`,
  };
}

/**
 * Super Admin Management: Reset all roles to baseline security defaults
 */
export function resetAllPermissionsToBaseline(adminName: string = 'Super Admin'): void {
  dynamicRolePermissions = {
    student: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.student),
    parent: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.parent),
    teacher: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.teacher),
    accountant: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.accountant),
    campus_admin: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.campus_admin),
    super_admin: new Set<Permission>(BASELINE_ROLE_PERMISSIONS.super_admin),
  };

  saveRolePermissions();

  authService.logAuditEvent(
    'RBAC_BASELINE_RESET: All system roles reset to strict security baseline defaults',
    'SECURITY',
    'CRITICAL',
    'SUCCESS',
    adminName,
    'super_admin'
  );
}

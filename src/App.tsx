/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import {
  UserRole,
  ActiveNavTab,
  Student,
  FeeVoucher,
  StudentMarkEntry,
  ExpenseRecord,
  AdmissionInquiry,
  StudyMaterial,
  InventoryProduct,
  ClassInfo,
  CampusBranch,
  SystemUser,
  AuditLogEntry,
  AcademicSession,
  SecurityPolicyConfig,
  TimetablePeriod,
  TeacherSubstitution,
  SubjectAllotment,
  DailyDiary,
  LeaveRequest,
  LeaveBalance,
  SmsRecord,
  SmsTemplate,
  MobileNotificationRecord,
  WhatsAppRecord,
  TelegramRecord,
  EmailRecord,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_VOUCHERS,
  INITIAL_EXPENSES,
  INITIAL_MARKS,
  INITIAL_INQUIRIES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_INVENTORY,
  INITIAL_CLASSES,
  INITIAL_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_CAMPUSES,
  INITIAL_SYSTEM_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS,
  INITIAL_SECURITY_POLICY,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_SUBSTITUTIONS,
  INITIAL_DIARIES,
} from './data/mockData';

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    applicantName: 'Tariq Mahmood',
    role: 'Teacher',
    departmentOrClass: 'Mathematics Department',
    leaveType: 'Casual',
    startDate: '2026-09-22',
    endDate: '2026-09-24',
    totalDays: 3,
    reason: 'Family event in hometown (Lahore). Syllabus syllabus has been caught up.',
    status: 'Pending',
    appliedDate: '2026-09-18'
  },
  {
    id: 'leave-2',
    applicantName: 'Ayesha Bibi',
    role: 'Teacher',
    departmentOrClass: 'English Department',
    leaveType: 'Medical',
    startDate: '2026-09-19',
    endDate: '2026-09-20',
    totalDays: 2,
    reason: 'Severe migraine headache. Recommended rest by family physician.',
    status: 'Approved',
    appliedDate: '2026-09-18',
    approvedBy: 'Super Admin'
  },
  {
    id: 'leave-3',
    applicantName: 'Hamza Malik',
    role: 'Student',
    departmentOrClass: 'Class Ten-A',
    leaveType: 'Emergency',
    startDate: '2026-09-20',
    endDate: '2026-09-20',
    totalDays: 1,
    reason: 'Urgent household errand / parents out of town.',
    status: 'Rejected',
    appliedDate: '2026-09-19',
    rejectionReason: 'Emergency leave without a valid written letter from parent.'
  }
];

const INITIAL_LEAVE_BALANCES: LeaveBalance[] = [
  {
    id: 'bal-1',
    employeeName: 'Tariq Mahmood',
    role: 'Teacher',
    casual: 8,
    medical: 6,
    unpaid: 0,
    earned: 12,
    used: 4
  },
  {
    id: 'bal-2',
    employeeName: 'Ayesha Bibi',
    role: 'Teacher',
    casual: 10,
    medical: 4,
    unpaid: 1,
    earned: 15,
    used: 5
  },
  {
    id: 'bal-3',
    employeeName: 'Rana Naveed',
    role: 'Staff',
    casual: 12,
    medical: 8,
    unpaid: 0,
    earned: 10,
    used: 2
  }
];

// Initial Communication Logs
const INITIAL_SMS_RECORDS: SmsRecord[] = [
  {
    id: 'sms-101',
    sender: 'Super Admin',
    recipientType: 'Parent',
    recipientName: 'Muhammad Ali (Parent of Sarah Ali)',
    message: 'Dear Parent, fee voucher for Sept 2026 is due. Please clear before 10th to avoid late fee surcharge.',
    timestamp: '2026-09-18 09:12:44',
    status: 'Delivered',
    gatewayResponse: 'SMS_GATEWAY_SUCCESS: OK'
  },
  {
    id: 'sms-102',
    sender: 'Super Admin',
    recipientType: 'Staff',
    recipientName: 'Ayesha Khan (Teacher)',
    message: 'Respected Staff, the academic meeting is scheduled for 2:00 PM today in the conference room.',
    timestamp: '2026-09-19 11:30:15',
    status: 'Sent',
    gatewayResponse: 'SMS_GATEWAY_SUCCESS: OK'
  }
];

const INITIAL_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Daily Absent Notification',
    body: 'Dear Parent, student {student_name} was found ABSENT today without formal leave request. Please check with the school admin.',
    category: 'Attendance'
  },
  {
    id: 'tmpl-2',
    title: 'Monthly Fee Reminder',
    body: 'Dear Parent, tuition fee voucher of PKR {amount} is outstanding for this month. Kindly clear dues before the due date.',
    category: 'Fee Reminder'
  },
  {
    id: 'tmpl-3',
    title: 'Exam Result Announcement',
    body: 'Assalam-o-Alaikum, Exam results have been compiled. Please attend parent-teacher meeting on Saturday to collect report card.',
    category: 'Exam Result'
  }
];

const INITIAL_MOBILE_NOTIFICATIONS: MobileNotificationRecord[] = [
  {
    id: 'notif-101',
    recipientType: 'Parent',
    recipientName: 'All Registered Parents',
    title: 'Autumn Vacations Announcement',
    body: 'Dear parents, please note that school will remain closed from Oct 12th to Oct 16th for autumn break.',
    timestamp: '2026-09-15 14:05:00',
    status: 'Delivered'
  }
];

const INITIAL_WHATSAPP_RECORDS: WhatsAppRecord[] = [
  {
    id: 'wa-101',
    recipientType: 'Parent',
    recipientName: 'All Parents Class 10-A',
    message: 'Dear parents, the class test timetable has been updated. Please verify syllabus details in app.',
    timestamp: '2026-09-17 10:00:22',
    status: 'Read'
  }
];

const INITIAL_TELEGRAM_RECORDS: TelegramRecord[] = [
  {
    id: 'tg-101',
    recipientType: 'Staff',
    recipientName: 'All Teaching Staff',
    message: 'Reminder: Submit question papers for Term-I exams on the web portal by Friday.',
    timestamp: '2026-09-16 16:30:00',
    status: 'Sent'
  }
];

const INITIAL_EMAIL_RECORDS: EmailRecord[] = [
  {
    id: 'mail-101',
    recipientEmails: 'board@school.edu, principal@school.edu',
    subject: 'Monthly Institutional Audit Report - Aug 2026',
    body: 'Respected Sirs, Attached is the comprehensive expenditure and fee recovery ledger report for the month of August 2026.',
    timestamp: '2026-09-05 18:22:11',
    status: 'Sent',
    attachments: 'https://school-portal.com/reports/audit-aug-2026.pdf'
  }
];

import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import TeacherDashboard, { TeacherSectionTab } from './components/dashboards/TeacherDashboard';
import AccountantDashboard from './components/dashboards/AccountantDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import LoginScreen from './components/LoginScreen';
import TopHeader from './components/TopHeader';
import SidebarNavigation from './components/SidebarNavigation';
import QuickActionRibbon from './components/QuickActionRibbon';
import DashboardView from './components/DashboardView';
import AdmissionsView from './components/AdmissionsView';
import StudentManagementView from './components/StudentManagementView';
import IDCardPrintingView from './components/IDCardPrintingView';
import AttendanceView from './components/AttendanceView';
import FeeManagementView from './components/FeeManagementView';
import ExamManagementView from './components/ExamManagementView';
import TestManagementView from './components/TestManagementView';
import TeacherPortalView from './components/TeacherPortalView';
import ParentPortalView from './components/ParentPortalView';
import StudentPortalView from './components/StudentPortalView';
import AcademicOperationsView from './components/AcademicOperationsView';
import Phase1AdministrationView from './components/Phase1AdministrationView';
import PrintModal from './components/PrintModal';
import TimetableSubstitutionEngine from './components/TimetableSubstitutionEngine';
import ClassSubjectManagementView from './components/ClassSubjectManagementView';
import DailyDiaryHomeworkLmsView from './components/DailyDiaryHomeworkLmsView';
import DailyHomeworkDiaryView from './components/DailyHomeworkDiaryView';
import StudyMaterialsView from './components/StudyMaterialsView';
import LeaveManagementView from './components/LeaveManagementView';
import SmsManagementView from './components/SmsManagementView';
import MobileNotificationsView from './components/MobileNotificationsView';
import WhatsAppNotificationsView from './components/WhatsAppNotificationsView';
import TelegramNotificationsView from './components/TelegramNotificationsView';
import EmailAlertsView from './components/EmailAlertsView';
import PayrollManagementView from './components/PayrollManagementView';
import AccountsExpenseLedgerView from './components/AccountsExpenseLedgerView';
import CampusPosStoreView from './components/CampusPosStoreView';
import CertificatesSlipsView from './components/CertificatesSlipsView';
import CertificationsView from './components/CertificationsView';
import TransportManagementView from './components/TransportManagementView';
import CommunicationsHubView from './components/CommunicationsHubView';
import LibraryManagementView from './components/LibraryManagementView';
import VisitorGateSecurityView from './components/VisitorGateSecurityView';
import HostelBoardingView from './components/HostelBoardingView';
import ExecutiveAnalyticsBiView from './components/ExecutiveAnalyticsBiView';
import SportsHousesView from './components/SportsHousesView';
import InfirmaryHealthView from './components/InfirmaryHealthView';
import LabAssetsInventoryView from './components/LabAssetsInventoryView';
import ExamPaperGeneratorView from './components/ExamPaperGeneratorView';
import AdmissionMeritAssessmentView from './components/AdmissionMeritAssessmentView';
import TeacherCpdLessonPlanView from './components/TeacherCpdLessonPlanView';
import PtmSchedulerFeedbackView from './components/PtmSchedulerFeedbackView';
import AlumniUniversityPlacementView from './components/AlumniUniversityPlacementView';
import DigitalLmsQuizVaultView from './components/DigitalLmsQuizVaultView';
import SportsOlympiadTournamentView from './components/SportsOlympiadTournamentView';
import BudgetProcurementErpView from './components/BudgetProcurementErpView';
import ExecutiveBiCommandCenterView from './components/ExecutiveBiCommandCenterView';
import BroadcastGatewayView from './components/BroadcastGatewayView';
import ParentHelpdeskView from './components/ParentHelpdeskView';
import MasterTimetableEngineView from './components/MasterTimetableEngineView';
import FacilityFleetMaintenanceView from './components/FacilityFleetMaintenanceView';
import HostelCafeteriaInventoryView from './components/HostelCafeteriaInventoryView';
import AIQuestionBankEngineView from './components/AIQuestionBankEngineView';
import LocalizationPortalView from './components/LocalizationPortalView';
import { SettingsView } from './components/SettingsModuleSuite';
import {
  SchoolNoticeBoardView,
  ManageCampusesView,
  AdminRoleManagementView,
  SmsToFeeDefaulterView,
  BulkFeePaymentView,
  AdmitStudentFormView,
  FeeTypesHeadsView,
  FamilyFeeCalculatorView,
  ManageBiometricDevicesView,
  WebsiteManagementView,
} from './components/DashboardExtensionsSuite';
import SuperAdminControlCenterView from './components/SuperAdminControlCenterView';
import AccessDeniedView from './components/AccessDeniedView';
import DigitalPaymentGatewayView from './components/DigitalPaymentGatewayView';
import BiometricRfidSyncView from './components/BiometricRfidSyncView';
import AIAssessmentGradingEngineView from './components/AIAssessmentGradingEngineView';
import LiveBusGpsTrackerView from './components/LiveBusGpsTrackerView';
import MobilePushNotificationsEngineView from './components/MobilePushNotificationsEngineView';
import PublicWebsiteView from './components/PublicWebsiteView';
import { authService } from './services/authService';
import { isTabAllowedForRole, getDefaultTabForRole } from './services/rbacService';

export default function App() {
  // Authentication & Session State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState<'public' | 'login' | 'app'>('public');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin');
  const [selectedCampus, setSelectedCampus] = useState('Main Campus (Model Town)');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [teacherSectionTab, setTeacherSectionTab] = useState<TeacherSectionTab>('overview');

  // Verify Active Session on Mount
  useEffect(() => {
    const session = authService.getActiveSession();
    if (session) {
      setIsLoggedIn(true);
      setCurrentUserRole(session.user.role);
      setActiveTab(getDefaultTabForRole(session.user.role));
      setViewMode('app');
    }
  }, []);

  // Collapsible Sidebar & Mobile Drawer State with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('school_app_sidebar_collapsed');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Admission Subtab & Action State
  const [admissionsSubTab, setAdmissionsSubTab] = useState<'admit' | 'inquiries' | 'bulk' | 'requests'>('admit');
  const [admissionsAction, setAdmissionsAction] = useState<string | null>(null);

  // Student Subtab / Action State
  const [studentAction, setStudentAction] = useState<'info' | 'promotion' | 'birthday' | 'transfer' | null>(null);

  // Parent Subtab / Action State
  const [parentAction, setParentAction] = useState<'manage' | 'requests' | 'reports' | null>(null);

  // ID Card Subtab / Action State
  const [idCardAction, setIdCardAction] = useState<'student' | 'staff' | 'settings'>('student');

  // Homework Diary Action State
  const [diaryAction, setDiaryAction] = useState<'manage' | 'send_sms'>('manage');

  // Study Materials Action State
  const [studyMaterialsAction, setStudyMaterialsAction] = useState<'browse' | 'upload'>('browse');

  // Leave Management Action State
  const [leaveAction, setLeaveAction] = useState<'requests' | 'balances' | 'apply'>('requests');

  // Certifications Subtab / Action State
  const [certificationsAction, setCertificationsAction] = useState<'printing' | 'template' | 'student' | 'staff'>('printing');

  // Classes Subtab / Action State
  const [classAction, setClassAction] = useState<'classes' | 'sections' | null>(null);

  // Attendance Subtab / Action State
  const [attendanceAction, setAttendanceAction] = useState<'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report' | null>(null);

  // Timetable Action State
  const [timetableAction, setTimetableAction] = useState<'add' | 'manage' | null>(null);

  // Fee / Accounting Action State
  const [feeAction, setFeeAction] = useState<
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
    | null
  >(null);

  // Exam Action State
  const [examAction, setExamAction] = useState<
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
    | null
  >(null);

  const handleSelectExamAction = (action: any) => {
    setActiveTab('exams');
    setExamAction(action);
  };

  // Test Action State
  const [testAction, setTestAction] = useState<
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
    | null
  >(null);

  const handleSelectTestAction = (action: any) => {
    setActiveTab('tests');
    setTestAction(action);
  };

  const handleSelectAdmissionSubTab = (
    subTab: 'admit' | 'inquiries' | 'bulk' | 'requests',
    action?: string
  ) => {
    setActiveTab('admissions');
    setAdmissionsSubTab(subTab);
    if (action) {
      setAdmissionsAction(action);
    } else {
      setAdmissionsAction(null);
    }
  };

  const handleSelectStudentAction = (action: 'info' | 'promotion' | 'birthday' | 'transfer') => {
    setActiveTab('students');
    setStudentAction(action);
  };

  const handleSelectParentAction = (action: 'manage' | 'requests' | 'reports') => {
    setActiveTab('parents');
    setParentAction(action);
  };

  const handleSelectIdCardAction = (action: 'student' | 'staff' | 'settings') => {
    setActiveTab('id_cards');
    setIdCardAction(action);
  };

  const handleSelectClassAction = (action: 'classes' | 'sections') => {
    setActiveTab('classes');
    setClassAction(action);
  };

  const handleSelectAttendanceAction = (action: 'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report') => {
    setActiveTab('attendance');
    setAttendanceAction(action);
  };

  const handleSelectTimetableAction = (action: 'add' | 'manage') => {
    setActiveTab('timetable');
    setTimetableAction(action);
  };

  const handleSelectFeeAction = (
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
  ) => {
    setActiveTab('fee_vouchers');
    setFeeAction(action);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('school_app_sidebar_collapsed', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save sidebar state to localStorage', err);
      }
      return next;
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Keyboard shortcut (Ctrl+B or Cmd+B) to collapse/expand sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Application Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));
        }
      },
      (error) => {
        console.warn('Firestore students snapshot sync warning:', error);
      }
    );
    return unsub;
  }, []);
  
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [vouchers, setVouchers] = useState<FeeVoucher[]>(INITIAL_VOUCHERS);
  const [classes, setClasses] = useState<ClassInfo[]>(INITIAL_CLASSES);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [marks, setMarks] = useState<StudentMarkEntry[]>(INITIAL_MARKS);
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(INITIAL_INQUIRIES);
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [inventory, setInventory] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);

  // Leave Management States
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(INITIAL_LEAVE_BALANCES);

  // Communications & Notifications Hub States
  const [smsHistory, setSmsHistory] = useState<SmsRecord[]>(INITIAL_SMS_RECORDS);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(INITIAL_SMS_TEMPLATES);
  const [mobileNotificationHistory, setMobileNotificationHistory] = useState<MobileNotificationRecord[]>(INITIAL_MOBILE_NOTIFICATIONS);
  const [whatsappHistory, setWhatsappHistory] = useState<WhatsAppRecord[]>(INITIAL_WHATSAPP_RECORDS);
  const [telegramHistory, setTelegramHistory] = useState<TelegramRecord[]>(INITIAL_TELEGRAM_RECORDS);
  const [emailHistory, setEmailHistory] = useState<EmailRecord[]>(INITIAL_EMAIL_RECORDS);

  const [smsAction, setSmsAction] = useState<'parents' | 'students' | 'staff' | 'specific' | 'templates' | 'history'>('parents');
  const [mobileAction, setMobileAction] = useState<'parents' | 'staff' | 'students' | 'history'>('parents');
  const [whatsappAction, setWhatsappAction] = useState<'parents' | 'staff' | 'history'>('parents');
  const [telegramAction, setTelegramAction] = useState<'parents' | 'staff' | 'history'>('parents');
  const [emailAction, setEmailAction] = useState<'specific' | 'history'>('specific');

  // Phase 4 Academic Operations, Timetable & Substitution State
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(INITIAL_TIMETABLE);
  const [substitutions, setSubstitutions] = useState<TeacherSubstitution[]>(INITIAL_SUBSTITUTIONS);
  const [subjects, setSubjects] = useState<SubjectAllotment[]>(INITIAL_SUBJECTS);
  const [diaryList, setDiaryList] = useState<DailyDiary[]>(INITIAL_DIARIES);

  // Phase 1 Multi-Campus Architecture, RBAC & Cybersecurity State
  const [campuses, setCampuses] = useState<CampusBranch[]>(INITIAL_CAMPUSES);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(INITIAL_SYSTEM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [sessions, setSessions] = useState<AcademicSession[]>(INITIAL_SESSIONS);
  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicyConfig>(INITIAL_SECURITY_POLICY);

  // Print Modal State
  const [printModalConfig, setPrintModalConfig] = useState<{
    isOpen: boolean;
    type:
      | 'fee_voucher'
      | 'id_card'
      | 'admit_card'
      | 'report_card'
      | 'transfer_certificate'
      | 'character_certificate'
      | 'bonafide_certificate'
      | 'merit_certificate'
      | 'datesheet'
      | 'visitor_pass'
      | 'student_gate_pass'
      | 'hostel_outing_pass'
      | 'book_barcode_label'
      | 'house_merit_certificate'
      | 'medical_fitness_certificate'
      | 'lab_asset_tag'
      | 'formal_exam_paper'
      | 'admission_offer_letter'
      | 'teacher_cpd_certificate'
      | 'ptm_evaluation_slip'
      | 'alumni_recommendation_letter'
      | 'lesson_plan_dossier'
      | 'career_counseling_dossier'
      | 'sports_winner_certificate'
      | 'procurement_purchase_order'
      | 'executive_audit_report'
      | 'lms_course_completion_certificate'
      | 'helpdesk_grievance_dossier'
      | 'master_class_timetable'
      | 'facility_work_order'
      | 'fleet_vehicle_dossier'
      | 'hostel_room_dossier'
      | 'mess_menu_card'
      | 'cafeteria_barcode_tag'
      | 'exam_paper_document'
      | 'question_item_card'
      | 'localized_portal_dossier';
    data: any;
  }>({
    isOpen: false,
    type: 'fee_voucher',
    data: null,
  });

  // Current logged in user object derived from active auth session
  const activeSession = authService.getActiveSession();
  const currentUser = activeSession
    ? activeSession.userProfile
    : INITIAL_USERS.find((u) => u.role === currentUserRole) || INITIAL_USERS[0];

  // Actions
  const handleLoginSuccess = (role: UserRole, email: string) => {
    const session = authService.getActiveSession();
    const effectiveRole = session ? session.user.role : role;
    setCurrentUserRole(effectiveRole);
    setIsLoggedIn(true);
    setActiveTab(getDefaultTabForRole(effectiveRole));
    setViewMode('app');
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setViewMode('public');
  };

  const handleAddCampus = (campus: Omit<CampusBranch, 'id' | 'studentCount' | 'staffCount'>) => {
    const newCampus: CampusBranch = {
      ...campus,
      id: `campus-${Date.now()}`,
      studentCount: 0,
      staffCount: 0,
    };
    setCampuses((prev) => [...prev, newCampus]);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `ADD_CAMPUS_BRANCH: ${newCampus.name} (${newCampus.city})`,
      category: 'SYSTEM',
      severity: 'INFO',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddUser = (user: Omit<SystemUser, 'id' | 'lastLogin'>) => {
    const newUser: SystemUser = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Never',
    };
    setSystemUsers((prev) => [...prev, newUser]);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `PROVISION_USER: ${newUser.fullName} (${newUser.username}) [${newUser.role}]`,
      category: 'SECURITY',
      severity: 'INFO',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleUpdateSecurityPolicy = (newPolicy: SecurityPolicyConfig) => {
    setSecurityPolicy(newPolicy);
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUserRole,
      action: `UPDATE_SECURITY_POLICY: 2FA=${newPolicy.require2FA ? 'Enforced' : 'Optional'}, Session=${newPolicy.sessionTimeoutMinutes}m`,
      category: 'SECURITY',
      severity: 'WARNING',
      status: 'SUCCESS',
      ipAddress: '192.168.10.4',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const created: Student = {
      ...newStudent,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [created, ...prev]);

    // Also auto-generate 1st fee voucher for the new student!
    const newVoucher: FeeVoucher = {
      id: `vch-${Date.now()}`,
      voucherNo: `VCH-2024-${String(vouchers.length + 1).padStart(4, '0')}`,
      studentId: created.id,
      studentName: created.name,
      fatherName: created.fatherName,
      studentCode: created.studentCode,
      className: created.className,
      section: created.section,
      month: 'October 2024',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2024-10-10',
      feeHeads: [
        { head: 'Tuition Fee', amount: created.monthlyFee },
        { head: 'Admission Registration Fee', amount: 5000 },
      ],
      totalAmount: created.monthlyFee + 5000,
      lateFee: 200,
      discount: 0,
      netPayable: created.monthlyFee + 5000,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
    };
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  const handleBatchAddStudents = (newStudentsList: Omit<Student, 'id'>[]) => {
    const createdList: Student[] = newStudentsList.map((s, idx) => ({
      ...s,
      id: `std-${Date.now()}-${idx}`,
    }));
    setStudents((prev) => [...createdList, ...prev]);

    // Also auto-generate initial vouchers for the batch
    const newVouchers: FeeVoucher[] = createdList.map((created, idx) => ({
      id: `vch-${Date.now()}-${idx}`,
      voucherNo: `VCH-2024-${String(vouchers.length + 1 + idx).padStart(4, '0')}`,
      studentId: created.id,
      studentName: created.name,
      fatherName: created.fatherName,
      studentCode: created.studentCode,
      className: created.className,
      section: created.section,
      month: 'October 2024',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '2024-10-10',
      feeHeads: [
        { head: 'Tuition Fee', amount: created.monthlyFee },
        { head: 'Admission Registration Fee', amount: 5000 },
      ],
      totalAmount: created.monthlyFee + 5000,
      lateFee: 200,
      discount: 0,
      netPayable: created.monthlyFee + 5000,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
    }));
    setVouchers((prev) => [...newVouchers, ...prev]);
  };

  const handleAddInquiry = (inq: Omit<AdmissionInquiry, 'id'>) => {
    setInquiries((prev) => [{ ...inq, id: `inq-${Date.now()}` }, ...prev]);
  };

  const handleAddExpense = (exp: Omit<ExpenseRecord, 'id'>) => {
    setExpenses((prev) => [
      {
        ...exp,
        id: `exp-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleRecordFeePayment = (voucherId: string, amount: number) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId
          ? { ...v, paymentStatus: 'Paid', paidAmount: amount, paymentDate: new Date().toISOString().split('T')[0] }
          : v
      )
    );
  };

  const handleSearchStudent = (query: string) => {
    if (query.trim().length > 0) {
      setActiveTab('students');
    }
  };

  // If user is logged out, render public website or login screen
  if (!isLoggedIn) {
    if (viewMode === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onReturnToPublicSite={() => setViewMode('public')}
        />
      );
    }

    return (
      <PublicWebsiteView
        onOpenLogin={() => setViewMode('login')}
      />
    );
  }

  const unpaidCount = vouchers.filter((v) => v.paymentStatus === 'Unpaid').length;
  const unreadComplaints = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div id="school-management-system" className="h-screen h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#f4f6f9] font-sans text-slate-800">
      {/* 1. Global Navigation Top Header */}
      <TopHeader
        currentUser={currentUser}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        onSearchStudent={handleSearchStudent}
        onRoleSwitch={(role: UserRole) => {
          setCurrentUserRole(role);
          setActiveTab(getDefaultTabForRole(role));
        }}
        onLogout={handleLogout}
        onQuickAction={(action) => {
          if (action === 'admit') setActiveTab('admissions');
          else if (action === 'attendance') setActiveTab('attendance');
          else if (action === 'fee') setActiveTab('fee_vouchers');
          else if (action === 'exams') setActiveTab('exams');
        }}
        unreadComplaintsCount={unreadComplaints}
        unreadMessagesCount={3}
        onToggleMobileSidebar={toggleMobileSidebar}
      />

      {/* 2. Rapid Quick Action Ribbon */}
      <QuickActionRibbon
        userRole={currentUserRole}
        onSelectTab={setActiveTab}
        onQuickAdmissionModal={() => setActiveTab('admissions')}
        onRefreshData={() => alert('System data synchronized with campus server.')}
      />

      {/* 3. Main Body Container with Isolated Sidebar and Main Stage Viewport */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative w-full">
        {/* Stationary / Collapsible Navigation Sidebar & Mobile Drawer */}
        <SidebarNavigation
          currentUserRole={currentUserRole}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onSelectDiaryAction={setDiaryAction}
          onSelectStudyMaterialsAction={setStudyMaterialsAction}
          onSelectLeaveAction={setLeaveAction}
          onSelectSmsAction={setSmsAction}
          onSelectMobileAction={setMobileAction}
          onSelectWhatsappAction={setWhatsappAction}
          onSelectTelegramAction={setTelegramAction}
          onSelectEmailAction={setEmailAction}
          onSelectCertificationsAction={setCertificationsAction}
          onSelectAdmissionSubTab={handleSelectAdmissionSubTab}
          onSelectStudentAction={handleSelectStudentAction}
          onSelectParentAction={handleSelectParentAction}
          onSelectIdCardAction={handleSelectIdCardAction}
          onSelectClassAction={handleSelectClassAction}
          onSelectAttendanceAction={handleSelectAttendanceAction}
          onSelectTimetableAction={handleSelectTimetableAction}
          onSelectFeeAction={handleSelectFeeAction}
          onSelectExamAction={handleSelectExamAction}
          onSelectTestAction={handleSelectTestAction}
          onSelectTeacherDashboardAction={(action) => {
            setTeacherSectionTab(action);
            setActiveTab('teacher_portal');
          }}
          complaintsCount={unreadComplaints}
          unpaidFeesCount={unpaidCount}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          userName={currentUser.name}
          userRole={currentUser.designation || 'Administrator'}
        />

        {/* Dynamic Center Work Stage with Independent Vertical Scroll */}
        <main
          id="main-stage-viewport"
          className="flex-1 h-full overflow-y-auto p-3 sm:p-5 max-w-[1600px] w-full mx-auto custom-scrollbar"
        >
          {/* Strict Role Guard (RBAC Layer) */}
          {!isTabAllowedForRole(currentUserRole, activeTab) ? (
            <AccessDeniedView
              userRole={currentUserRole}
              attemptedTab={activeTab}
              onNavigateHome={setActiveTab}
            />
          ) : (
            <>
              {/* View Tab 1: Role-Based Dashboard */}
              {activeTab === 'dashboard' && (
            <>
              {(currentUserRole === 'super_admin' || currentUserRole === 'campus_admin') && (
                <SuperAdminDashboard
                  students={students}
                  staff={staff}
                  vouchers={vouchers}
                  classes={classes}
                  expenses={expenses}
                  campuses={campuses}
                  selectedCampus={selectedCampus}
                  onSelectCampus={setSelectedCampus}
                  sessions={sessions}
                  notices={notices}
                  onNavigate={setActiveTab}
                  onAdmitClick={() => setActiveTab('admissions')}
                  onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
                  onPrintIdCard={(std) => setPrintModalConfig({ isOpen: true, type: 'id_card', data: std })}
                />
              )}
              {currentUserRole === 'accountant' && (
                <AccountantDashboard
                  vouchers={vouchers}
                  expenses={expenses}
                  students={students}
                  onNavigate={setActiveTab}
                  onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
                />
              )}
              {currentUserRole === 'teacher' && (
                <TeacherDashboard
                  students={students}
                  staff={staff}
                  classes={classes}
                  notices={notices}
                  diaries={diaryList}
                  materials={materials}
                  timetable={timetable}
                  marks={marks}
                  initialTab={teacherSectionTab}
                  onNavigate={setActiveTab}
                  onSelectDiaryAction={setDiaryAction}
                  onSelectAttendanceAction={setAttendanceAction}
                  onSelectExamAction={setExamAction}
                  onPrintMarkSheet={(data) =>
                    setPrintModalConfig({
                      isOpen: true,
                      type: 'report_card',
                      data,
                    })
                  }
                  onPrintAdmitCard={(data) =>
                    setPrintModalConfig({
                      isOpen: true,
                      type: 'admit_card',
                      data,
                    })
                  }
                />
              )}
              {currentUserRole === 'parent' && (
                <ParentDashboard
                  students={students}
                  vouchers={vouchers}
                  notices={notices}
                  diaries={diaryList}
                  marks={marks}
                  onNavigate={setActiveTab}
                  onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
                />
              )}
              {currentUserRole === 'student' && (
                <StudentDashboard
                  student={students[0]}
                  students={students}
                  diaries={diaryList}
                  materials={materials}
                  marks={marks}
                  notices={notices}
                  timetable={timetable}
                  onNavigate={setActiveTab}
                />
              )}
            </>
          )}

          {/* Dashboard Extensions: School Notice Board */}
          {activeTab === 'school_notice_board' && (
            <SchoolNoticeBoardView
              initialNotices={notices}
              onAddNotice={(n) => setNotices((prev) => [n, ...prev])}
              onDeleteNotice={(id) => setNotices((prev) => prev.filter((notice) => notice.id !== id))}
            />
          )}

          {/* Dashboard Extensions: Manage Campuses */}
          {activeTab === 'manage_campuses' && (
            <ManageCampusesView
              initialCampuses={campuses}
              onAddCampus={(c) => setCampuses((prev) => [...prev, c])}
            />
          )}

          {/* Dashboard Extensions: Admin Role Management & Super Admin Control Center */}
          {(activeTab === 'admin_roles' || activeTab === 'super_admin_control_center') && (
            <SuperAdminControlCenterView
              onNavigate={setActiveTab}
              onSimulateRole={(r) => {
                setCurrentUserRole(r);
                if (r === 'teacher') setActiveTab('teacher_portal');
                else if (r === 'parent') setActiveTab('parent_portal');
                else if (r === 'student') setActiveTab('dashboard');
                else if (r === 'accountant') setActiveTab('dashboard');
                else setActiveTab('dashboard');
              }}
            />
          )}

          {/* Dashboard Extensions: SMS Defaulters */}
          {activeTab === 'sms_defaulters' && (
            <SmsToFeeDefaulterView
              students={students}
            />
          )}

          {/* Dashboard Extensions: Bulk Fee Payment */}
          {activeTab === 'bulk_fee_payment' && (
            <BulkFeePaymentView />
          )}

          {/* Dashboard Extensions: Admit Student Form */}
          {activeTab === 'admit_student_form' && (
            <AdmitStudentFormView
              onAdmitSubmit={(std) => {
                handleAddStudent(std);
                setActiveTab('students');
              }}
            />
          )}

          {/* Dashboard Extensions: Fee Types / Heads */}
          {activeTab === 'fee_types_heads' && (
            <FeeTypesHeadsView />
          )}

          {/* Dashboard Extensions: Family Fee Calculator */}
          {activeTab === 'family_fee_calculator' && (
            <FamilyFeeCalculatorView />
          )}

          {/* Dashboard Extensions: Manage Biometric Devices */}
          {activeTab === 'manage_biometric_devices' && (
            <ManageBiometricDevicesView />
          )}

          {/* Dashboard Extensions: Website Management */}
          {activeTab === 'website_management' && (
            <WebsiteManagementView
              initialClasses={classes}
            />
          )}

          {/* Digital Payment Gateway */}
          {activeTab === 'digital_payment_gateway' && (
            <DigitalPaymentGatewayView
              students={students}
              vouchers={vouchers}
              onUpdateVouchers={setVouchers}
            />
          )}

          {/* Biometric & RFID Turnstile Sync */}
          {activeTab === 'biometric_rfid_sync' && (
            <BiometricRfidSyncView
              students={students}
              staff={staff}
            />
          )}

          {/* AI Exam Grader & Question Paper Studio */}
          {activeTab === 'ai_exam_grader' && (
            <AIAssessmentGradingEngineView
              students={students}
              classes={classes}
              marks={marks}
            />
          )}

          {/* Live Bus GPS Tracker */}
          {activeTab === 'live_bus_gps_tracker' && (
            <LiveBusGpsTrackerView
              students={students}
            />
          )}

          {/* Mobile Push Notifications Engine */}
          {activeTab === 'mobile_push_engine' && (
            <MobilePushNotificationsEngineView
              classes={classes}
            />
          )}

          {/* Settings Module */}
          {activeTab.startsWith('settings') && (
            <SettingsView
              initialSubTab={
                activeTab === 'settings_sms'
                  ? 'sms'
                  : activeTab === 'settings_email'
                  ? 'email'
                  : activeTab === 'settings_payment'
                  ? 'payment'
                  : activeTab === 'settings_whatsapp'
                  ? 'whatsapp'
                  : activeTab === 'settings_telegram'
                  ? 'telegram'
                  : activeTab === 'settings_automations'
                  ? 'automations'
                  : 'general'
              }
            />
          )}

          {/* View Tab 2: Admissions Module */}
          {activeTab === 'admissions' && (
            <AdmissionsView
              students={students}
              inquiries={inquiries}
              initialSubTab={admissionsSubTab}
              initialAction={admissionsAction}
              onAddStudent={handleAddStudent}
              onAddInquiry={handleAddInquiry}
              onBatchAddStudents={handleBatchAddStudents}
              onPrintForm={(std) => setPrintModalConfig({ isOpen: true, type: 'transfer_certificate', data: std })}
            />
          )}

          {/* View Tab 3: Students Management */}
          {activeTab === 'students' && (
            <StudentManagementView
              students={students}
              vouchers={vouchers}
              classes={classes}
              initialAction={studentAction}
              onUpdateStudents={setStudents}
              onPrintIdCard={(std) => setPrintModalConfig({ isOpen: true, type: 'id_card', data: std })}
              onPrintCertificate={(std, type) =>
                setPrintModalConfig({ isOpen: true, type: 'transfer_certificate', data: std })
              }
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
            />
          )}

          {/* ID Card Printing Studio */}
          {activeTab === 'id_cards' && (
            <IDCardPrintingView
              students={students}
              staff={staff}
              initialAction={idCardAction}
              onPrintSingleCard={(data, type) =>
                setPrintModalConfig({ isOpen: true, type: 'id_card', data })
              }
            />
          )}

          {/* Daily Homework Diary Hub (Super Admin submenu) */}
          {activeTab === 'daily_homework_diary' && (
            <DailyHomeworkDiaryView
              diaryList={diaryList}
              students={students}
              classes={classes}
              onAddDiary={(entry) => setDiaryList((prev) => [entry, ...prev])}
              onUpdateDiary={setDiaryList}
              initialAction={diaryAction}
            />
          )}

          {/* Study Materials Hub (Super Admin submenu) */}
          {activeTab === 'study_materials' && (
            <StudyMaterialsView
              materials={materials}
              classes={classes}
              onAddMaterial={(mat) =>
                setMaterials((prev) => [{ ...mat, id: `mat-${Date.now()}` }, ...prev])
              }
              onDeleteMaterial={(id) =>
                setMaterials((prev) => prev.filter((m) => m.id !== id))
              }
              initialAction={studyMaterialsAction}
            />
          )}

          {/* Leave Management Hub (Super Admin submenu) */}
          {activeTab === 'leave_management' && (
            <LeaveManagementView
              leaveRequests={leaveRequests}
              leaveBalances={leaveBalances}
              onAddLeaveRequest={(newReq) => setLeaveRequests((prev) => [newReq, ...prev])}
              onUpdateLeaveStatus={(id, status, comment, approver) => {
                setLeaveRequests((prev) =>
                  prev.map((r) =>
                    r.id === id
                      ? { ...r, status, approvedBy: approver || 'Admin', rejectionReason: status === 'Rejected' ? comment : undefined }
                      : r
                  )
                );
              }}
              onAdjustBalance={(id, field, val) => {
                setLeaveBalances((prev) =>
                  prev.map((b) => {
                    if (b.id === id) {
                      const currentVal = b[field] || 0;
                      const nextVal = Math.max(0, currentVal + val);
                      return { ...b, [field]: nextVal };
                    }
                    return b;
                  })
                );
              }}
              initialAction={leaveAction}
            />
          )}

          {/* SMS Management (Carrier gateway) */}
          {activeTab === 'sms_management' && (
            <SmsManagementView
              smsHistory={smsHistory}
              smsTemplates={smsTemplates}
              onSendSms={(rec) => setSmsHistory((prev) => [rec, ...prev])}
              onAddTemplate={(tmpl) => setSmsTemplates((prev) => [tmpl, ...prev])}
              onDeleteTemplate={(id) => setSmsTemplates((prev) => prev.filter((t) => t.id !== id))}
              initialAction={smsAction}
            />
          )}

          {/* Mobile App Notifications */}
          {activeTab === 'mobile_notifications' && (
            <MobileNotificationsView
              notificationHistory={mobileNotificationHistory}
              onSendNotification={(rec) => setMobileNotificationHistory((prev) => [rec, ...prev])}
              initialAction={mobileAction}
            />
          )}

          {/* WhatsApp Notifications */}
          {activeTab === 'whatsapp_notifications' && (
            <WhatsAppNotificationsView
              whatsappHistory={whatsappHistory}
              onSendMessage={(rec) => setWhatsappHistory((prev) => [rec, ...prev])}
              initialAction={whatsappAction}
            />
          )}

          {/* Telegram Notifications */}
          {activeTab === 'telegram_notifications' && (
            <TelegramNotificationsView
              telegramHistory={telegramHistory}
              onSendMessage={(rec) => setTelegramHistory((prev) => [rec, ...prev])}
              initialAction={telegramAction}
            />
          )}

          {/* Email Alerts */}
          {activeTab === 'email_alerts' && (
            <EmailAlertsView
              emailHistory={emailHistory}
              onSendEmail={(rec) => setEmailHistory((prev) => [rec, ...prev])}
              initialAction={emailAction}
            />
          )}

          {/* Main Certifications Hub */}
          {activeTab === 'certifications_hub' && (
            <CertificationsView
              students={students}
              staff={staff}
              initialAction={certificationsAction}
            />
          )}

          {/* Phase 6 View 1: Official Institutional Certificates, SLC & Verification Hub */}
          {activeTab === 'certifications' && (
            <CertificatesSlipsView
              students={students}
              onOpenBatchIdModal={() => setActiveTab('id_cards')}
            />
          )}

          {/* View Tab 4: Attendance Management */}
          {activeTab === 'attendance' && (
            <AttendanceView students={students} staff={staff} initialAction={attendanceAction} />
          )}

          {/* View Tab 5: Fee Billing, 3-Copy Bank Challans & Defaulters Recovery */}
          {(activeTab === 'fee_vouchers' || activeTab === 'accounting') && (
            <FeeManagementView
              vouchers={vouchers}
              students={students}
              initialAction={feeAction}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
              onRecordPayment={handleRecordFeePayment}
              onAddVouchers={(newV) => setVouchers((prev) => [...newV, ...prev])}
            />
          )}

          {/* View Tab 6: Staff Management, Salaries, Loans & EOBI Payroll */}
          {(activeTab === 'salaries' || activeTab === 'staff') && (
            <PayrollManagementView
              staff={staff}
              onDisburseSalary={(slipId, method) => {
                // salary disburse record
              }}
            />
          )}

          {/* View Tab 7: Double-Entry Accounts, Cash/Bank Ledger & Expenses */}
          {activeTab === 'expenses' && (
            <AccountsExpenseLedgerView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              monthlyFeeCollection={vouchers.filter((v) => v.paymentStatus === 'Paid').reduce((s, v) => s + v.netPayable, 0)}
              monthlyPayrollCost={485000}
            />
          )}

          {/* View Tab 8: Campus POS Store & Warehouse Inventory */}
          {(activeTab === 'inventory' || (activeTab as any) === 'stock') && (
            <CampusPosStoreView
              students={students}
              inventory={inventory}
              onUpdateInventory={setInventory}
            />
          )}

          {/* View Tab 6: Examinations & Marks */}
          {activeTab === 'exams' && (
            <ExamManagementView
              marks={marks}
              activeAction={examAction}
              onPrintReportCard={(entry) =>
                setPrintModalConfig({ isOpen: true, type: 'report_card', data: entry })
              }
              onPrintAdmitCard={(entry) =>
                setPrintModalConfig({ isOpen: true, type: 'admit_card', data: entry })
              }
              onUpdateMarks={(id, obtained) => {
                setMarks((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, totalObtained: obtained } : m))
                );
              }}
            />
          )}

          {/* View Tab: Test Management */}
          {activeTab === 'tests' && (
            <TestManagementView
              activeAction={testAction}
            />
          )}

          {/* View Tab 7: Teacher Dashboard & Virtual Classes */}
          {activeTab === 'teacher_portal' && (
            <TeacherPortalView
              students={students}
              materials={materials}
              staff={staff}
              classes={classes}
              notices={notices}
              diaries={diaryList}
              timetable={timetable}
              marks={marks}
              initialTab={teacherSectionTab}
              onUploadMaterial={(mat) =>
                setMaterials((prev) => [{ ...mat, id: `mat-${Date.now()}` }, ...prev])
              }
              onNavigateTab={setActiveTab}
              onPrintMarkSheet={(data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'report_card',
                  data,
                })
              }
              onPrintAdmitCard={(data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'admit_card',
                  data,
                })
              }
            />
          )}

          {/* View Tab 8: Parent Access Portal & Accounts */}
          {(activeTab === 'parent_portal' || activeTab === 'parents') && (
            <ParentPortalView
              students={students}
              vouchers={vouchers}
              initialAction={parentAction}
              onPrintVoucher={(v) => setPrintModalConfig({ isOpen: true, type: 'fee_voucher', data: v })}
            />
          )}

          {/* Phase 4 View 1: Class, Section, Subject Allotment & Workload Quota Matrix */}
          {(activeTab === 'classes' || activeTab === 'subjects') && (
            <ClassSubjectManagementView
              classes={classes}
              subjects={subjects}
              staff={staff}
              initialAction={classAction}
              onUpdateClasses={setClasses}
              onUpdateSubjects={setSubjects}
            />
          )}

          {/* Phase 4 View 2: Academic Timetable Routine & Automated Teacher Substitution Engine */}
          {activeTab === 'timetable' && (
            <TimetableSubstitutionEngine
              timetable={timetable}
              substitutions={substitutions}
              staff={staff}
              classes={classes}
              subjects={subjects}
              initialAction={timetableAction}
              onUpdateTimetable={setTimetable}
              onAddSubstitution={(sub) => setSubstitutions((prev) => [sub, ...prev])}
            />
          )}

          {/* Phase 4 View 3: Daily Homework Diary, Parent Broadcast & Virtual Classroom LMS */}
          {(activeTab === 'diary' || activeTab === 'lms' || activeTab === 'online_classes') && (
            <DailyDiaryHomeworkLmsView
              diaryList={diaryList}
              studyMaterials={materials}
              students={students}
              classes={classes}
              onAddDiary={(entry) => setDiaryList((prev) => [entry, ...prev])}
              onAddMaterial={(mat) => setMaterials((prev) => [mat, ...prev])}
            />
          )}

          {/* Phase 6 View 2: Omni-Channel Communications, Masked SMS & Parent Helpdesk */}
          {activeTab === 'communications' && (
            <CommunicationsHubView students={students} />
          )}

          {/* Phase 6 View 3: Official Verification Registry & Instant Certificate Generator */}
          {(activeTab === 'certificates' || activeTab === 'certifications') && (
            <CertificatesSlipsView
              students={students}
              onPrintCertificate={(certType, data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: certType,
                  data,
                })
              }
            />
          )}

          {/* Phase 6 View 4: Transport Fleet, Route Telematics & Van Operations */}
          {activeTab === 'transport' && (
            <TransportManagementView
              students={students}
              onAddExpense={handleAddExpense}
            />
          )}

          {/* Phase 7 View 1: Library Catalog, OPAC & Circulation Management */}
          {activeTab === 'library' && (
            <LibraryManagementView
              students={students}
              onPrintBookLabel={(book) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'book_barcode_label',
                  data: book,
                })
              }
            />
          )}

          {/* Phase 7 View 2: Visitor Gate Passes, Vehicle Tags & Emergency Early Leaves */}
          {activeTab === 'gate_security' && (
            <VisitorGateSecurityView
              students={students}
              onPrintVisitorPass={(pass) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'visitor_pass',
                  data: pass,
                })
              }
              onPrintStudentGatePass={(pass) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'student_gate_pass',
                  data: pass,
                })
              }
            />
          )}

          {/* Phase 7 View 3: Hostel & Boarding Suite with 7-Day Mess Schedule */}
          {activeTab === 'hostel' && (
            <HostelBoardingView
              students={students}
              onPrintHostelPass={(leave) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'hostel_outing_pass',
                  data: leave,
                })
              }
            />
          )}

          {/* Phase 7 View 4: Executive BI Analytics, Alumni Directory & Audit Compliance */}
          {(activeTab === 'analytics' || activeTab === 'alumni') && (
            <ExecutiveAnalyticsBiView
              students={students}
            />
          )}

          {/* Phase 8 View 1: Inter-House Championship, Sports Olympiad & Co-Curricular Clubs */}
          {activeTab === 'sports_houses' && (
            <SportsHousesView
              students={students}
              onPrintHouseCertificate={(cert: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'house_merit_certificate',
                  data: cert,
                })
              }
            />
          )}

          {/* Phase 8 View 2: Infirmary, Clinic OPD & Student Medical Profiles */}
          {activeTab === 'infirmary' && (
            <InfirmaryHealthView
              students={students}
              onPrintMedicalCertificate={(profile: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'medical_fitness_certificate',
                  data: profile,
                })
              }
            />
          )}

          {/* Phase 8 View 3: Science & IT Labs Equipment, Maintenance & Chemical Hazard Registry */}
          {activeTab === 'lab_assets' && (
            <LabAssetsInventoryView
              onPrintAssetTag={(asset: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'lab_asset_tag',
                  data: asset,
                })
              }
            />
          )}

          {/* Phase 8 View 4: AI Question Paper Generator & Bloom's Taxonomy Question Bank */}
          {activeTab === 'question_paper' && (
            <ExamPaperGeneratorView
              onPrintExamPaper={(paper: any) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'formal_exam_paper',
                  data: paper,
                })
              }
            />
          )}

          {/* Phase 9 View 1: Entrance Assessment, Quota Allocation & Merit Ranking Engine */}
          {activeTab === 'admission_merit' && (
            <AdmissionMeritAssessmentView
              onPrintAdmissionOffer={(candidate) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'admission_offer_letter',
                  data: candidate,
                })
              }
            />
          )}

          {/* Phase 9 View 2: Faculty Continuous Professional Development (CPD) & Weekly Lesson Plan Matrix */}
          {activeTab === 'teacher_cpd' && (
            <TeacherCpdLessonPlanView
              staffList={staff}
              onPrintCpdCertificate={(record) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'teacher_cpd_certificate',
                  data: record,
                })
              }
            />
          )}

          {/* Phase 9 View 3: Parent-Teacher Meeting (PTM) Portal & 360° Student Feedback Dossier */}
          {activeTab === 'ptm_portal' && (
            <PtmSchedulerFeedbackView
              students={students}
              onPrintPtmSlip={(feedback) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'ptm_evaluation_slip',
                  data: feedback,
                })
              }
            />
          )}

          {/* Phase 9 View 4: Alumni Network Directorate, University Placements & Career Counseling */}
          {activeTab === 'career_alumni' && (
            <AlumniUniversityPlacementView
              onPrintRecommendationLetter={(alumni) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'alumni_recommendation_letter',
                  data: alumni,
                })
              }
            />
          )}

          {/* Phase 10 View 1: Digital LMS Vault, E-Learning Video Hub & SLO Quiz Engine */}
          {(activeTab === 'lms_vault' || activeTab === 'quiz') && (
            <DigitalLmsQuizVaultView
              onPrintCompletionCertificate={(sub) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'lms_course_completion_certificate',
                  data: sub,
                })
              }
            />
          )}

          {/* Phase 10 View 2: Annual Sports Gala, House Championship & National Olympiad Hub */}
          {activeTab === 'sports_olympiad' && (
            <SportsOlympiadTournamentView
              onPrintSportsCertificate={(ev) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'sports_winner_certificate',
                  data: ev,
                })
              }
            />
          )}

          {/* Phase 10 View 3: School Capex/Opex Budgeting, PR/PO & Vendor Procurement ERP */}
          {activeTab === 'budget_procurement' && (
            <BudgetProcurementErpView
              onPrintPurchaseOrder={(pr) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'procurement_purchase_order',
                  data: pr,
                })
              }
            />
          )}

          {/* Phase 10 View 4: Executive BI Command Center, Campus 360° Health & AI Risk Predictor */}
          {activeTab === 'executive_bi' && (
            <ExecutiveBiCommandCenterView
              onPrintAuditReport={(metric) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'executive_audit_report',
                  data: metric,
                })
              }
            />
          )}

          {/* Phase 11 View 1: Multi-Channel Broadcast & WhatsApp/SMS Gateway Engine */}
          {activeTab === 'broadcast_gateway' && (
            <BroadcastGatewayView />
          )}

          {/* Phase 11 View 2: Parent-School Helpdesk & SLA Ticket Redressal Center */}
          {activeTab === 'parent_helpdesk' && (
            <ParentHelpdeskView
              onPrintTicketSummary={(ticket) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'helpdesk_grievance_dossier',
                  data: ticket,
                })
              }
            />
          )}

          {/* Phase 12: Master Timetable Scheduler & Smart Substitution Engine */}
          {activeTab === 'master_timetable_engine' && (
            <MasterTimetableEngineView
              onPrintTimetable={(timetable) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'master_class_timetable',
                  data: timetable,
                })
              }
            />
          )}

          {/* Phase 13: Campus Facility Maintenance, Fleet GPS Logs & Solar Telemetry */}
          {activeTab === 'facility_fleet_maintenance' && (
            <FacilityFleetMaintenanceView
              onPrintWorkOrder={(wo) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'facility_work_order',
                  data: wo,
                })
              }
              onPrintFleetLog={(fleet) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'fleet_vehicle_dossier',
                  data: fleet,
                })
              }
            />
          )}

          {/* Phase 14: Boarding Hostel Allotment, Mess Nutrition & Cafeteria POS Inventory */}
          {activeTab === 'hostel_cafeteria_inventory' && (
            <HostelCafeteriaInventoryView
              onPrintHostelDossier={(room) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'hostel_room_dossier',
                  data: room,
                })
              }
              onPrintMessMenu={(menu) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'mess_menu_card',
                  data: menu,
                })
              }
              onPrintInventoryTag={(item) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'cafeteria_barcode_tag',
                  data: item,
                })
              }
            />
          )}

          {/* Phase 16: Automated AI Question Bank, SNC Paper Blueprint & Exam Paper Generator */}
          {activeTab === 'ai_question_bank_engine' && (
            <AIQuestionBankEngineView
              onPrintExamPaper={(paper) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'exam_paper_document',
                  data: paper,
                })
              }
              onPrintQuestionItem={(item) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'question_item_card',
                  data: item,
                })
              }
            />
          )}

          {/* Phase 17: Multi-Language Parent & Teacher Portal Localization */}
          {activeTab === 'localization_portal' && (
            <LocalizationPortalView
              onPrintLocalizationDossier={(data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'localized_portal_dossier',
                  data,
                })
              }
            />
          )}

          {/* View Tab 13: Phase 1 Multi-Campus Architecture, RBAC & Cybersecurity Administration */}
          {activeTab === 'settings' && (
            <Phase1AdministrationView
              campuses={campuses}
              users={systemUsers}
              auditLogs={auditLogs}
              sessions={sessions}
              securityPolicy={securityPolicy}
              selectedCampus={selectedCampus}
              onSelectCampus={setSelectedCampus}
              onAddCampus={handleAddCampus}
              onAddUser={handleAddUser}
              onUpdateSecurityPolicy={handleUpdateSecurityPolicy}
            />
          )}

          {/* View Tab 14: Student Portal */}
          {activeTab === 'student_portal' && (
            <StudentPortalView
              student={students[0]}
              students={students}
              diaries={diaryList}
              materials={materials}
              marks={marks}
              notices={notices}
              timetable={timetable}
              vouchers={vouchers}
              onPrintReportCard={(data) =>
                setPrintModalConfig({
                  isOpen: true,
                  type: 'report_card',
                  data,
                })
              }
            />
          )}
            </>
          )}
        </main>
      </div>

      {/* Printable Modal (Fee Vouchers, ID Cards, Admit Cards, Report Cards, SLC) */}
      {printModalConfig.isOpen && (
        <PrintModal
          type={printModalConfig.type}
          data={printModalConfig.data}
          onClose={() => setPrintModalConfig({ isOpen: false, type: 'fee_voucher', data: null })}
        />
      )}
    </div>
  );
}

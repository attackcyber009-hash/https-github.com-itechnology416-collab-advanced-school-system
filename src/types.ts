export type UserRole = 'super_admin' | 'campus_admin' | 'teacher' | 'accountant' | 'parent' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  campus: string;
  phone?: string;
  designation?: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g. "STD-2024-001"
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  dob: string;
  className: string;
  section: string;
  rollNo: string;
  admissionDate: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: 'Active' | 'Transferred' | 'Passed Out' | 'Inactive';
  monthlyFee: number;
  discountPercentage?: number;
  concessionType?: string;
  fullName?: string;
  avatarUrl: string;
  emergencyContact: string;
  bloodGroup: string;
  // Phase 3 Student Dossier & Sibling extensions
  bFormOrCnic?: string;
  fatherCnic?: string;
  fatherOccupation?: string;
  motherName?: string;
  guardianPhone?: string;
  authorizedPickup?: string;
  allergies?: string;
  medicalConditions?: string;
  previousSchool?: string;
  siblingCodes?: string[];
  house?: string;
  campusCode?: string;
  attendanceRate?: number;
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  role: UserRole;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatarUrl: string;
  subjectsAssigned?: string[];
}

export interface ClassInfo {
  id: string;
  name: string; // e.g. "Class One", "Class Two", "ICS Part 1"
  className?: string; // Added for backward compatibility/usage
  campusName?: string; // Added for backward compatibility/usage
  classTeacher?: string; // Added for backward compatibility/usage
  numericLevel: number;
  sections: {
    name: string;
    strength: number;
    roomNo: string;
    classTeacher: string;
  }[];
  monthlyTuition: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  targetType: 'student' | 'staff';
  targetId: string;
  name: string;
  className?: string;
  section?: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'Late';
  checkInTime?: string;
  method: 'Manual' | 'Biometric' | 'Barcode' | 'Voice';
}

export interface FeeVoucher {
  id: string;
  voucherNo: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  studentCode: string;
  className: string;
  section: string;
  month: string; // e.g. "September 2024"
  issueDate: string;
  dueDate: string;
  feeHeads: {
    head: string;
    amount: number;
  }[];
  totalAmount: number;
  lateFee: number;
  discount: number;
  netPayable: number;
  paidAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  paymentDate?: string;
  paymentMethod?: 'Bank' | 'Cash' | 'Online Wallet' | 'Direct';
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'Utilities' | 'Maintenance' | 'Lab Supplies' | 'Stationery' | 'Events' | 'Staff Welfare' | 'Transport Fuel' | 'Staff Salaries';
  amount: number;
  date: string;
  paidTo: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque';
  receiptNo: string;
  notes?: string;
  expenseTitle?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Direct Deposit';
  recipient?: string;
  approvedBy?: string;
}

export interface ExamTerm {
  id: string;
  title: string; // e.g. "First Term 2024", "Final Term 2024"
  startDate: string;
  endDate: string;
  academicYear: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

export interface StudentMarkEntry {
  id: string;
  examTermId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  section: string;
  subjectMarks: {
    subject: string;
    totalMarks: number;
    obtainedMarks: number;
    grade: string;
  }[];
  totalMax: number;
  totalObtained: number;
  percentage: number;
  overallGrade: string;
  position?: number;
  teacherRemarks: string;
}

// Grading Policy & Criteria Types
export interface GradeBand {
  id: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpaPoint: number;
  descriptor: string;
  remarksTemplate: string;
}

export interface AssessmentWeightageComponent {
  id: string;
  name: string;
  weightPercentage: number;
  maxMarks: number;
  minPassingMarks: number;
  isMandatoryToPass: boolean;
  category: 'Written' | 'Practical' | 'Classwork' | 'Homework' | 'Attendance' | 'Behavior';
}

export interface SubjectGradingPolicy {
  id: string;
  termId: string;
  termName: string;
  academicYear: string;
  className: string;
  subjectName: string;
  totalSubjectMarks: number;
  overallPassingPercentage: number;
  components: AssessmentWeightageComponent[];
  gradeBands: GradeBand[];
  attendanceThresholdPercent: number;
  maxGraceMarks: number;
  allowRetakeExam: boolean;
  separatePracticalPassing: boolean;
  notesOrInstructions?: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface DailyDiary {
  id: string;
  date: string;
  className: string;
  section: string;
  subject: string;
  teacherName: string;
  homeworkContent: string;
  submissionDate: string;
  smsBroadcasted: boolean;
  pageNo?: string;
  estimatedMinutes?: number;
  priority?: 'High' | 'Normal' | 'Revision';
}

// Phase 4 Academic Operations, Timetable & Substitution Types
export interface TimetablePeriod {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number; // 1 to 8, or 0 for Assembly
  periodName: string; // e.g. "Period 1", "Recess", "Assembly"
  startTime: string; // e.g. "08:15 AM"
  endTime: string; // e.g. "09:00 AM"
  className: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  roomNo: string;
  isBreak?: boolean;
}

export interface TeacherSubstitution {
  id: string;
  date: string;
  absentTeacherId: string;
  absentTeacherName: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  periodNumber: number;
  timeSlot: string;
  className: string;
  section: string;
  subject: string;
  roomNo: string;
  reason: string;
  status: 'Assigned' | 'Completed' | 'Notified';
  assignedBy?: string;
}

export interface SubjectAllotment {
  id: string;
  subjectCode: string;
  name: string;
  className: string;
  teacherId: string;
  teacherName: string;
  periodsPerWeek: number;
  textbook: string;
  type: 'Core' | 'Elective' | 'Co-Curricular';
  totalMarks: number;
}

export interface HomeworkSubmission {
  id: string;
  diaryId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  status: 'Submitted' | 'Pending' | 'Checked' | 'Late';
  marksOrGrade?: string;
  remarks?: string;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  department: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';
  hoursWorked?: number;
  lateMinutes?: number;
  remarks?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  className: string;
  subject: string;
  teacherName: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO';
  fileSize: string;
  uploadDate: string;
  downloadUrl?: string;
  description: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetAudience: 'All' | 'Parents' | 'Students' | 'Staff';
  author: string;
  pinned: boolean;
}

export interface ParentComplaint {
  id: string;
  ticketNo: string;
  parentName: string;
  studentName: string;
  className: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  reply?: string;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: 'Uniform' | 'Books' | 'Stationery' | 'Accessories';
  unitPrice: number;
  stockQty: number;
  reorderLevel: number;
}

export interface AdmissionInquiry {
  id: string;
  inquiryNo: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  intendedClass: string;
  date: string;
  status: 'New' | 'Contacted' | 'Test Scheduled' | 'Admitted' | 'Rejected';
  notes: string;
  assignedStaff?: string;
  followUpDate?: string;
  assessmentDate?: string;
  assessmentScore?: number;
}

export interface CampusBranch {
  id: string;
  // Old/Existing fields (kept for backward compatibility)
  code?: string;
  name?: string;
  city?: string;
  principal?: string;
  phone?: string;
  email?: string;
  address?: string;
  bankTitle?: string;
  bankAccount?: string;
  studentCount?: number;
  staffCount?: number;
  status?: 'Active' | 'Under Setup';
  // New fields (added as optional)
  campusCode?: string;
  campusName?: string;
  principalName?: string;
  contactNo?: string;
  teacherCount?: number;
  feeRecoveryRate?: number;
  ptmSatisfactionIndex?: number;
  teacherAttendanceRate?: number;
  biseBoardPassRate?: number;
  studentRetentionRate?: number;
  studentAttendanceRate?: number;
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  campusName: string;
  status: 'Active' | 'Locked' | 'Suspended' | 'Inactive' | 'Pending';
  lastLogin: string;
  twoFactorEnabled: boolean;
  phone: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  user: string;
  role: UserRole;
  action: string;
  category: 'AUTH' | 'FINANCE' | 'ACADEMIC' | 'SYSTEM' | 'SECURITY';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'SUCCESS' | 'FAILED';
}

export interface AcademicSession {
  id: string;
  sessionName: string; // e.g. "2024-2025"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Active' | 'Archived' | 'Upcoming';
}

export interface SecurityPolicyConfig {
  sessionTimeoutMinutes: number;
  require2FA: boolean;
  passwordMinLength: number;
  requireSpecialChar: boolean;
  maxLoginAttempts: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
}

export type ActiveNavTab =
  | 'dashboard'
  | 'daily_homework_diary'
  | 'study_materials'
  | 'leave_management'
  | 'sms_management'
  | 'mobile_notifications'
  | 'whatsapp_notifications'
  | 'telegram_notifications'
  | 'email_alerts'
  | 'certifications_hub'
  | 'admissions'
  | 'students'
  | 'parents'
  | 'staff'
  | 'id_cards'
  | 'classes'
  | 'subjects'
  | 'attendance'
  | 'online_classes'
  | 'timetable'
  | 'fee_vouchers'
  | 'accounting'
  | 'expenses'
  | 'salaries'
  | 'inventory'
  | 'exams'
  | 'tests'
  | 'certifications'
  | 'certificates'
  | 'diary'
  | 'lms'
  | 'communications'
  | 'transport'
  | 'library'
  | 'gate_security'
  | 'hostel'
  | 'alumni'
  | 'analytics'
  | 'sports_houses'
  | 'infirmary'
  | 'lab_assets'
  | 'question_paper'
  | 'quiz'
  | 'admission_merit'
  | 'teacher_cpd'
  | 'ptm_portal'
  | 'career_alumni'
  | 'lms_vault'
  | 'sports_olympiad'
  | 'budget_procurement'
  | 'executive_bi'
  | 'broadcast_gateway'
  | 'parent_helpdesk'
  | 'master_timetable_engine'
  | 'facility_fleet_maintenance'
  | 'hostel_cafeteria_inventory'
  | 'ai_question_bank_engine'
  | 'localization_portal'
  | 'settings'
  | 'settings_general'
  | 'settings_sms'
  | 'settings_email'
  | 'settings_payment'
  | 'settings_whatsapp'
  | 'settings_telegram'
  | 'settings_automations'
  | 'teacher_portal'
  | 'parent_portal'
  | 'student_portal'
  | 'school_notice_board'
  | 'manage_campuses'
  | 'admin_roles'
  | 'super_admin_control_center'
  | 'sms_defaulters'
  | 'bulk_fee_payment'
  | 'admit_student_form'
  | 'fee_types_heads'
  | 'family_fee_calculator'
  | 'manage_biometric_devices'
  | 'website_management'
  | 'digital_payment_gateway'
  | 'biometric_rfid_sync'
  | 'ai_exam_grader'
  | 'live_bus_gps_tracker'
  | 'mobile_push_engine'
  | 'permissions_access';

// Phase 5 Financial Operations, Fee Engine, Payroll & POS Store Types
export interface SalarySlip {
  id: string;
  slipNo: string;
  staffId: string;
  staffName: string;
  designation: string;
  department: string;
  month: string; // e.g. "September 2024"
  basicSalary: number;
  allowances: { name: string; amount: number }[];
  totalAllowances: number;
  grossSalary: number;
  deductions: { name: string; amount: number }[];
  taxDeduction: number;
  eobiDeduction: number;
  absentDeduction: number;
  loanDeduction: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending' | 'On Hold';
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque';
  bankName?: string;
  accountNo?: string;
  disbursementDate?: string;
}

export interface StaffLoanRecord {
  id: string;
  loanCode: string;
  staffId: string;
  staffName: string;
  designation: string;
  loanAmount: number;
  purpose: string;
  requestDate: string;
  approvedDate: string;
  monthlyDeduction: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'Active' | 'Closed' | 'Pending Approval';
}

export interface BankAccountLedger {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Current Account' | 'Savings / PLS' | 'Petty Cash Safe' | 'Digital Gateway';
  balance: number;
  branchCode: string;
  iban: string;
}

export interface PosTransaction {
  id: string;
  invoiceNo: string;
  date: string;
  customerType: 'Student' | 'Walk-in' | 'Staff';
  studentId?: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
  subTotal: number;
  discount: number;
  tax: number;
  netTotal: number;
  tenderedAmount: number;
  changeAmount: number;
  paymentMode: 'Cash' | 'Card' | 'Easypaisa' | 'JazzCash';
}

export interface FeeConcessionPolicy {
  id: string;
  name: string;
  category: 'Sibling' | 'Kinship' | 'Teacher Child' | 'Merit' | 'Zakat / Welfare' | 'Orphan';
  discountPercentage: number;
  description: string;
  activeBeneficiariesCount: number;
}

export interface InstallmentPlan {
  id: string;
  voucherId: string;
  studentId: string;
  studentName: string;
  className: string;
  totalFee: number;
  numberOfInstallments: number;
  installments: {
    installmentNo: number;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    paidDate?: string;
  }[];
}

// ==========================================
// PHASE 6: EXAMINATIONS, CERTIFICATES, TRANSPORT & OMNI-CHANNEL COMMUNICATIONS
// ==========================================

export interface ExamDatesheetItem {
  id: string;
  examTerm: string;
  className: string;
  subject: string;
  paperDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  roomNo: string;
  invigilatorName: string;
  instructions?: string;
}

export interface OfficialCertificate {
  id: string;
  serialNo: string; // e.g. "TE/LHR/SLC/2024/0082"
  certificateType: 'Leaving (SLC)' | 'Character' | 'Bonafide / Enrollment' | 'Merit / Honor' | 'Sports & Co-Curricular';
  studentId: string;
  studentName: string;
  fatherName: string;
  bFormNo: string;
  dob: string;
  className: string;
  section: string;
  rollNo: string;
  admissionDate: string;
  leavingDate: string;
  reasonForLeaving: string;
  generalConduct: string;
  duesCleared: boolean;
  issueDate: string;
  verificationCode: string;
  issuedBy: string;
  status: 'Issued' | 'Draft' | 'Revoked';
  remarks?: string;
}

export interface TransportVehicle {
  id: string;
  vehicleNo: string; // e.g. "LEG-4821"
  model: string; // e.g. "Toyota Hiace Commuter 2022"
  vehicleType: 'Hiace Van' | 'Coaster' | 'School Bus' | 'Carry Bolan';
  seatingCapacity: number;
  occupiedSeats: number;
  driverName: string;
  driverPhone: string;
  driverCnic: string;
  driverLicenseNo: string;
  fitnessExpiryDate: string;
  insuranceValidTill: string;
  fuelType: 'Diesel' | 'Petrol' | 'CNG';
  trackerStatus: 'Online / Moving' | 'Idling' | 'Stationary' | 'Offline';
  speedKmH: number;
  currentLocationName: string;
}

export interface TransportRouteStop {
  id: string;
  stopName: string;
  morningPickupTime: string;
  afternoonDropTime: string;
  studentsCount: number;
}

export interface TransportRoute {
  id: string;
  routeCode: string; // e.g. "RT-01"
  routeName: string; // e.g. "DHA Phase 1 to 6 Express"
  vehicleId: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  monthlyFare: number;
  totalStudentsEnrolled: number;
  stops: TransportRouteStop[];
  status: 'Active' | 'Under Maintenance';
}

export interface StudentTransportEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  className: string;
  rollNo: string;
  routeId: string;
  routeName: string;
  stopName: string;
  monthlyFare: number;
  parentPhone: string;
  pickupTime: string;
  dropTime: string;
  status: 'Active' | 'Suspended';
}

export interface VehicleFuelExpenseLog {
  id: string;
  vehicleId: string;
  vehicleNo: string;
  date: string;
  fuelType: 'Diesel' | 'Petrol' | 'CNG';
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerKm: number;
  fuelStation: string;
  driverName: string;
}

export interface SmsBroadcastLog {
  id: string;
  maskId: string; // e.g. "EDUCATORS"
  campaignTitle: string;
  messageBody: string;
  messageBodyUrdu?: string;
  targetAudience: 'All Parents' | 'Class-wise' | 'Fee Defaulters' | 'Absent Today' | 'Staff Only';
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  costPkr: number;
  sentAt: string;
  status: 'Delivered' | 'In Progress' | 'Failed';
}

export interface NoticeCircular {
  id: string;
  circularNo: string; // e.g. "TE-LHR-CIR-2024/09"
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  category: 'Academic & Exams' | 'Holiday & Gazette' | 'Fee & Finance' | 'Weather & Smog Advisory' | 'Sports & Events';
  urgency: 'Normal' | 'High' | 'Urgent / Alert';
  targetAudience: 'All' | 'Parents' | 'Teachers' | 'Students';
  publishDate: string;
  signedBy: string;
  isPinned: boolean;
  attachedFile?: string;
}

export interface ParentComplaintTicket {
  id: string;
  ticketNo: string; // e.g. "CMP-2024-104"
  studentId?: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  className: string;
  category: 'Academic & Teacher Conduct' | 'Fee & Accounts' | 'Transport & Van Safety' | 'Discipline & Bullying' | 'Campus Hygiene & Facilities';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Escalated to Principal';
  createdAt: string;
  resolvedAt?: string;
  assignedTo: string;
  resolutionSummary?: string;
}

// ============================================================================
// PHASE 7: LIBRARY, GATE SECURITY, HOSTEL, ALUMNI & BI ANALYTICS INTERFACES
// ============================================================================

export interface BookCatalogItem {
  id: string;
  isbn: string; // e.g. "978-0199068212"
  accessionNo: string; // e.g. "LIB-2024-0412"
  title: string;
  titleUrdu?: string;
  author: string;
  publisher: string;
  edition: string;
  category: 'Science & Tech' | 'Islamic Studies' | 'Literature & Fiction' | 'Mathematics' | 'Pakistan Studies & History' | 'General Knowledge & Encyclopedias' | 'Course Textbooks';
  language: 'English' | 'Urdu' | 'Arabic';
  shelfLocation: string; // e.g. "Rack B3 - Shelf 2"
  totalCopies: number;
  availableCopies: number;
  pricePkr: number;
  eBookPdfUrl?: string;
  barcode: string;
  status: 'Available' | 'Low Stock' | 'Checked Out' | 'Reference Only';
}

export interface BookIssueReturnRecord {
  id: string;
  issueCode: string; // e.g. "ISS-8921"
  bookId: string;
  bookTitle: string;
  accessionNo: string;
  borrowerType: 'Student' | 'Staff';
  borrowerId: string;
  borrowerName: string;
  classNameOrDept: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  finePerDayPkr: number;
  finePaidPkr: number;
  conditionOnReturn?: 'Good' | 'Minor Damage' | 'Lost / Damaged';
  status: 'Issued' | 'Returned' | 'Overdue' | 'Lost';
  issuedBy: string;
}

export interface VisitorGatePass {
  id: string;
  passNo: string; // e.g. "GP-2024-0891"
  visitorName: string;
  cnicNo: string; // e.g. "35202-8819201-3"
  contactNo: string;
  visitorType: 'Parent / Guardian' | 'Vendor / Contractor' | 'Official / Inspector' | 'Guest';
  purposeOfVisit: string;
  personToMeet: string; // e.g. "Principal Tariq Mahmood"
  department: string;
  studentRollNo?: string;
  studentName?: string;
  entryTime: string;
  exitTime?: string;
  vehicleNo?: string;
  badgeNumber: string;
  securityOfficer: string;
  securityCheckPassed: boolean;
  status: 'Inside Campus' | 'Checked Out' | 'Flagged / Denied Entry';
  remarks?: string;
}

export interface EmergencyStudentGatePass {
  id: string;
  passNo: string; // e.g. "EGP-2024-042"
  studentId: string;
  studentName: string;
  className: string;
  rollNo: string;
  parentGuardianName: string;
  guardianCnic: string;
  guardianPhone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Authorized Driver';
  reasonForLeave: string;
  issueTime: string;
  approvedByTeacher: string;
  approvedByPrincipal: string;
  parentConsentVerified: boolean;
  securityGateCleared: boolean;
  status: 'Approved & Exited' | 'Pending Approval' | 'Cancelled';
}

export interface HostelRoomBed {
  id: string;
  wingName: 'Allama Iqbal Wing (Boys)' | 'Quaid-e-Azam Wing (Boys Senior)' | 'Fatima Jinnah Wing (Girls)';
  roomNo: string; // e.g. "Room 204"
  floor: 'Ground Floor' | '1st Floor' | '2nd Floor';
  roomType: '2-Bed Sharing' | '4-Bed Standard' | 'Dormitory (6-Bed)';
  bedNo: string; // e.g. "Bed-A"
  isOccupied: boolean;
  studentId?: string;
  studentName?: string;
  className?: string;
  monthlyHostelFee: number;
  wardenName: string;
  wardenPhone: string;
  amenities: string[];
}

export interface HostelOutingLeavePass {
  id: string;
  leaveCode: string; // e.g. "HLP-2024-098"
  studentId: string;
  studentName: string;
  roomNo: string;
  wingName: string;
  leaveType: 'Weekend Home Outing' | 'Medical / Emergency' | 'Day Market Pass' | 'Family Function';
  departureDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  destinationAddress: string;
  parentContactVerified: boolean;
  wardenSignoff: string;
  status: 'Active Outing' | 'Returned on Time' | 'Overdue Return' | 'Rejected';
}

export interface HostelMessDayMenu {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  eveningTea: string;
  dinner: string;
  specialDietNote?: string;
}

export interface AlumniRecord {
  id: string;
  alumniRegNo: string; // e.g. "ALM-2020-041"
  name: string;
  fatherName: string;
  matricYear: string; // e.g. "2020"
  matricBoardPercentage: number;
  className: string;
  higherInstitution: string; // e.g. "NUST Islamabad" | "LUMS" | "King Edward Medical University" | "UET Lahore"
  degreeProgram: string; // e.g. "BS Computer Science" | "MBBS" | "BBA" | "Mechanical Engineering"
  currentOccupation: string; // e.g. "Software Engineer at Systems Ltd" | "House Officer" | "Tech Founder"
  cityCountry: string; // e.g. "Lahore, Pakistan" | "London, UK"
  contactEmail: string;
  phoneNo: string;
  linkedinProfile?: string;
  achievements: string;
  isVerifiedAlumni: boolean;
  willingToMentor: boolean;
}

export interface CampusAuditComplianceMetric {
  id: string;
  category: 'Academic Quality' | 'Infrastructure & Safety' | 'Regulatory & PEF Compliance' | 'Financial Health' | 'Staff Professional Development';
  metricName: string;
  benchmarkStandard: string;
  currentScore: number; // 0 - 100%
  targetScore: number;
  status: 'Fully Compliant' | 'Good Standing' | 'Requires Attention' | 'Non-Compliant';
  verifiedBy: string;
  lastAuditDate: string;
}

// ==========================================
// PHASE 8: HOUSES & SPORTS, INFIRMARY, LAB ASSETS & AI QUESTION PAPER GENERATOR
// ==========================================

export type HouseColor = 'emerald' | 'blue' | 'amber' | 'rose';

export interface HouseRecord {
  id: string;
  code: 'JINNAH' | 'IQBAL' | 'SIR_SYED' | 'LIAQUAT';
  name: string; // e.g. "Jinnah House (Eagles)"
  color: HouseColor;
  motto: string;
  mottoUrdu: string;
  houseMasterTeacher: string;
  houseMistressTeacher: string;
  boyCaptain: string;
  girlCaptain: string;
  totalPoints: number;
  trophiesWon: number;
  rank: number;
  bannerBg: string;
}

export interface HousePointLog {
  id: string;
  houseCode: 'JINNAH' | 'IQBAL' | 'SIR_SYED' | 'LIAQUAT';
  activityCategory: 'Sports & Athletics' | 'Academics & Quizzes' | 'Debates & Declamation' | 'Discipline & Assembly' | 'STEM & Robotics' | 'Arts & Calligraphy';
  title: string;
  pointsAwarded: number;
  awardedToStudent?: string;
  awardedBy: string;
  date: string;
  notes: string;
}

export interface SportsTournamentFixture {
  id: string;
  sportName: 'Cricket' | 'Football' | 'Badminton' | 'Athletics & Relay' | 'Table Tennis' | 'Tug of War' | 'Chess';
  tournamentTitle: string; // e.g. "Annual Champions Trophy 2024"
  round: 'Quarter Final' | 'Semi Final' | 'Final' | 'League Stage';
  teamA: string; // House name or Class section
  teamB: string;
  date: string;
  timeSlot: string;
  venueGround: string;
  scoreOrResult: string;
  winnerTeam?: string;
  manOfTheMatchOrMVP?: string;
  status: 'Scheduled' | 'Live / In Progress' | 'Completed' | 'Postponed';
}

export interface CoCurricularClub {
  id: string;
  clubName: string;
  mentorTeacher: string;
  studentPresident: string;
  category: 'Literary & Debates' | 'STEM & AI Innovation' | 'Fine Arts & Calligraphy' | 'Environment & Green Club' | 'Islamic Society & Qiraat';
  membersCount: number;
  meetingDay: string;
  upcomingEvent: string;
  achievements: string;
}

export interface StudentMedicalProfile {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyRescueMeds?: string;
  emergencyDoctorName: string;
  emergencyDoctorPhone: string;
  vaccinationStatus: {
    polio: boolean;
    mmr: boolean;
    typhoid: boolean;
    tetanus: boolean;
    covid19: boolean;
  };
  lastCheckupDate: string;
  doctorNotes?: string;
}

export interface ClinicOpdVisit {
  id: string;
  visitNo: string; // e.g. "OPD-2024-0312"
  patientType: 'Student' | 'Staff';
  patientId: string;
  patientName: string;
  classNameOrDesignation: string;
  visitDate: string;
  visitTime: string;
  symptomsChiefComplaint: string; // e.g. "High Grade Fever (102°F) & Shivering"
  vitals: {
    tempFahrenheit: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    pulseBpm: number;
    spo2?: number;
  };
  diagnosis: string;
  treatmentDispensed: string[]; // e.g. ["Paracetamol 500mg (1 Tab)", "ORS Solution", "Cold Sponge"]
  doctorOrNurseName: string;
  restBedAssigned?: string; // e.g. "Infirmary Bed 02"
  parentNotified: boolean;
  disposition: 'Sent Back to Class' | 'Resting in Infirmary' | 'Referred to Hospital' | 'Sent Home with Guardian';
}

export interface ScienceLabAsset {
  id: string;
  assetCode: string; // e.g. "LAB-PHY-042"
  labType: 'Physics Lab' | 'Chemistry Lab' | 'Biology Lab' | 'Computer & Robotics Lab';
  itemName: string;
  specification: string;
  category: 'Precision Instrument' | 'Glassware' | 'Chemical Reagent' | 'Specimen / Model' | 'IT Hardware' | 'Robotics / Microcontroller';
  totalQuantity: number;
  workingQuantity: number;
  underRepairQuantity: number;
  rackCabinetLocation: string; // e.g. "Cabinet B - Shelf 2"
  purchaseDate: string;
  unitCostPkr: number;
  calibrationDueDate?: string;
  safetyHazardLevel: 'Safe' | 'Moderate' | 'Corrosive / Hazardous';
  status: 'Operational' | 'Requires Calibration' | 'Depleted Reagent' | 'Damaged';
  inChargeStaff: string;
}

export interface LabMaintenanceLog {
  id: string;
  assetId: string;
  assetName: string;
  labType: string;
  date: string;
  maintenanceType: 'Routine Calibration' | 'Glassware Replenishment' | 'OS / Software Patch' | 'Safety Eyewash Inspection';
  technicianName: string;
  costPkr: number;
  nextScheduledDate: string;
  status: 'Completed' | 'Pending Parts';
}

export interface QuestionBankItem {
  id: string;
  subject: string; // e.g. "Physics", "Mathematics", "Computer Science", "Biology", "Urdu", "English", "Islamiat"
  gradeLevel: string; // e.g. "Class 9", "Class 10 (Matric)", "Class 8"
  chapterNumber: number;
  chapterTitle: string;
  questionType: 'MCQ' | 'Short Question' | 'Long / Analytical' | 'Numerical Problem' | 'Diagram / Practical';
  bloomsLevel: 'Knowledge' | 'Understanding' | 'Application' | 'Analysis & Synthesis';
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  marks: number;
  questionText: string;
  questionTextUrdu?: string;
  options?: string[]; // for MCQs (4 choices)
  correctOptionIndex?: number;
  modelAnswerOrRubric: string;
  boardReferenceYear?: string; // e.g. "BISE Lahore 2023 Group 1"
}

export interface GeneratedExamPaper {
  id: string;
  paperCode: string; // e.g. "EXAM-2024-PHY9-FINAL"
  examTitle?: string; // e.g. "Final Examination 2024 - Physics (Class 9)"
  paperTitle?: string; // e.g. "Class 10 Physics Mid-Term Examination 2024"
  subject: string;
  className?: string;
  gradeClass?: string;
  termExamName?: 'Mid-Term Examination 2024' | 'Annual Final Assessment' | 'Send-Up Mock Test';
  totalMarks: number;
  allowedTimeMinutes?: number;
  durationMinutes?: number;
  instructions?: string[];
  sections?: {
    sectionName: string; // e.g. "Section A: Objective (MCQs)", "Section B: Short Questions"
    sectionMarks: number;
    instructions: string;
    questions: {
      questionNo: number;
      text: string;
      textUrdu?: string;
      options?: string[];
      marks: number;
      chapter: string;
      blooms: string;
    }[];
  }[];
  questions?: AIQuestionItem[];
  markingSchemeRubric?: string;
  preparedBy?: string;
  approvedByHead?: string;
  createdDate?: string;
  generatedAt?: string;
  status?: 'Draft' | 'Approved by HOD' | 'Sent to Printing Press';
}

// =========================================================================
// PHASE 9: ADMISSION ENTRANCE MERIT ENGINE, FACULTY CPD, PTM & CAREER ALUMNI
// =========================================================================

export interface AdmissionAssessmentCandidate {
  id: string;
  applicationNo: string; // e.g. "ADM-2024-890"
  candidateName: string;
  fatherName: string;
  fatherCnic: string;
  contactPhone: string;
  intendedClass: string; // e.g. "Class 9 (Pre-Medical)", "Class 1"
  gender: 'Male' | 'Female';
  testDate: string;
  quotaCategory: 'Open Merit' | 'Sibling Quota' | 'Staff Ward' | 'Hafiz-e-Quran' | 'Sports & Co-Curricular';
  writtenMarks: {
    english: number; // Max 25
    mathematics: number; // Max 25
    urdu: number; // Max 25
    science: number; // Max 25
    totalWritten: number; // Max 100
  };
  interviewMarks: {
    oralCommunication: number; // Max 10
    generalKnowledge: number; // Max 10
    islamicEthicsOrRecitation: number; // Max 10
    totalInterview: number; // Max 30
  };
  hafizBonusMarks?: number; // 20 marks if Hafiz-e-Quran verified
  aggregateScore: number; // Out of 130 (or 150) -> scaled %
  aggregatePercentage: number;
  meritRank?: number;
  status: 'Selected (Merit List 1)' | 'Waiting List' | 'Under Review' | 'Fee Paid & Enrolled' | 'Disqualified';
  assignedCampus: string;
  feeChallanIssued?: boolean;
  remarks?: string;
}

export interface TeacherCpdTraining {
  id: string;
  trainingCode: string; // e.g. "CPD-2024-SNC-01"
  moduleTitle: string;
  category: 'Single National Curriculum (SNC)' | 'STEM & AI in Classroom' | 'Bloom Taxonomy & Assessment' | 'Classroom Management & Inclusion' | 'Early Childhood Education (ECE)';
  trainerName: string;
  accreditedBy: 'Beaconhouse Staff Development Center' | 'Punjab Education Foundation' | 'British Council';
  durationHours: number;
  date: string;
  venueOrPlatform: string;
  enrolledStaffIds: string[];
  status: 'Upcoming' | 'In Progress' | 'Completed';
  learningOutcomes: string[];
  passingScorePercentage: number;
}

export interface LessonPlanSubmission {
  id: string;
  planCode: string; // e.g. "LP-MTH-9-W3"
  teacherId: string;
  teacherName: string;
  subject: string;
  className: string;
  weekNumber: number;
  dateRange: string;
  topicTitle: string;
  sloGoals: string; // Student Learning Outcomes
  pedagogyMethod: 'Inquiry-Based Learning' | 'Direct Instruction & Whiteboard' | 'Flipped Classroom & Video' | 'Group Collaboration & Lab';
  resourcesRequired: string[];
  assessmentStrategy: string;
  homeworkAssigned: string;
  status: 'Approved by Vice Principal' | 'Revision Requested' | 'Submitted for Review';
  reviewerFeedback?: string;
  submittedDate: string;
}

export interface TeacherClassroomAudit {
  id: string;
  auditCode: string;
  teacherId: string;
  teacherName: string;
  observerName: string; // e.g. "Prof. Tariq Mahmood (Principal)"
  className: string;
  subject: string;
  date: string;
  scores: {
    lessonPacing: number; // 1 to 5
    studentEngagement: number; // 1 to 5
    conceptClarity: number; // 1 to 5
    whiteboardAndAvUsage: number; // 1 to 5
    classroomDiscipline: number; // 1 to 5
  };
  totalScoreOutOf25: number;
  ratingGrade: 'Outstanding (A*)' | 'Very Good (A)' | 'Satisfactory (B)' | 'Needs Coaching (C)';
  observerStrengths: string;
  areasForDevelopment: string;
  followUpDate?: string;
}

export interface PtmSessionSchedule {
  id: string;
  sessionTitle: string; // e.g. "Mid-Term PTM September 2024"
  termName: string;
  ptmDate: string;
  startTime: string;
  endTime: string;
  targetClasses: string[];
  venue: string;
  slotDurationMinutes: number;
  totalSlots: number;
  bookedSlots: number;
  status: 'Open for Booking' | 'Slots Finalized' | 'Completed';
}

export interface PtmStudentFeedback {
  id: string;
  ptmSessionId: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: string;
  parentName: string;
  parentContact: string;
  teacherName: string;
  bookedTimeSlot: string;
  academicProgressRating: 'Excellent' | 'On Track' | 'Needs Attention' | 'Critical Support';
  behavioralConductRating: 'Exemplary' | 'Disciplined' | 'Restless / Talkative' | 'Disruptive';
  attendanceComment: string;
  teacherNotes: string;
  parentRequests: string;
  actionPlan: string;
  status: 'Attended & Signed' | 'Scheduled' | 'Parent Absent';
}

export interface AlumniPlacementRecord {
  id: string;
  alumniCode: string; // e.g. "ALM-2022-049"
  name: string;
  passingBatch: string; // e.g. "Matric Batch 2022", "FSc Batch 2023"
  programCompleted: 'Matric (Science)' | 'Matric (Computer)' | 'FSc (Pre-Medical)' | 'FSc (Pre-Engineering)' | 'ICS';
  boardRollNo: string;
  boardMarks: string; // e.g. "1048/1100 (95.3%)"
  bisePositionOrDistinction?: string;
  currentUniversityOrInstitution: string; // e.g. "NUST Islamabad", "King Edward Medical University", "FAST-NUCES Lahore", "LUMS", "PMA Kakul"
  degreeProgram: string; // e.g. "BS Software Engineering", "MBBS", "BSc Electrical Eng", "BBA"
  scholarshipOrMerit: string; // e.g. "100% PEEF Merit Scholarship", "HEC Indigenous Scholarship"
  currentDesignationOrStatus: string; // e.g. "Software Engineer @ Arbisoft", "House Officer @ Mayo Hospital", "Undergraduate Student"
  linkedinOrContact: string;
  willingToMentor: boolean;
  avatarUrl: string;
}

export interface CareerCounselingAppointment {
  id: string;
  appointmentNo: string;
  studentId: string;
  studentName: string;
  className: string;
  counselorName: string;
  date: string;
  timeSlot: string;
  aptitudeCategory: 'Engineering & Computing' | 'Medical & Biological Sciences' | 'Business & Chartered Accountancy (CA)' | 'Armed Forces & Civil Services' | 'Arts, Law & Social Sciences';
  recommendedUniversities: string[];
  sessionSummary: string;
  actionItemsForStudent: string[];
  status: 'Scheduled' | 'Completed' | 'Follow-up Required';
}

// ============================================================================
// PHASE 10: ADVANCED INSTITUTIONAL ANALYTICS, DIGITAL LMS & QUIZ ENGINE,
// SPORTS & OLYMPIAD CHAMPIONSHIPS, AND SCHOOL BUDGETING & PROCUREMENT ERP
// ============================================================================

export interface LmsCourseModule {
  id: string;
  courseCode: string; // e.g. "SNC-PHY-9"
  subject: string; // "Physics", "Computer Science", "Mathematics", "Urdu Literature"
  targetClass: string; // "Class 9 (Science)", "Class 10 (Science)", "Class 8"
  title: string;
  sncSloCode: string; // e.g. "SLO-PHY-9.2.1"
  instructorName: string;
  description: string;
  videoDurationMinutes: number;
  videoUrl?: string;
  pdfLectureNotesUrl?: string;
  learningOutcomes: string[];
  totalQuizzes: number;
  enrolledStudentsCount: number;
  completionRate: number;
  status: 'Active' | 'Draft' | 'Archived';
}

export interface LmsQuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sloReference: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface LmsQuizSubmission {
  id: string;
  moduleId: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  submissionDate: string;
  status: 'Passed' | 'Retake Required';
  feedbackNotes: string;
}

export interface SportsOlympiadEvent {
  id: string;
  eventCode: string; // e.g. "SPO-2024-ATH01", "OLY-2024-IKMC"
  title: string;
  category: 'Athletics & Track' | 'Team Sports (Cricket/Football)' | 'Indoor Sports (Badminton/Table Tennis)' | 'Academic Olympiad (IKMC/IKSC)' | 'Islamic & Literary Contests';
  competitionLevel: 'Intra-Campus Gala' | 'Inter-Campus Beaconhouse Championship' | 'National / International Olympiad';
  date: string;
  venue: string;
  ageCategory: 'Under-12 (Primary)' | 'Under-15 (Middle)' | 'Under-18 (Senior / Matric)';
  participatingHousesOrSchools: string[];
  goldWinner: { name: string; houseOrSchool: string; scoreOrRecord: string };
  silverWinner: { name: string; houseOrSchool: string; scoreOrRecord: string };
  bronzeWinner: { name: string; houseOrSchool: string; scoreOrRecord: string };
  status: 'Scheduled' | 'In Progress' | 'Concluded';
  officialJudge: string;
}

export interface HouseSportsMedalStanding {
  houseName: 'Jinnah House' | 'Iqbal House' | 'Sir Syed House' | 'Fatima Jinnah House';
  color: string;
  gold: number;
  silver: number;
  bronze: number;
  totalPoints: number;
  rank: number;
}

export interface InstitutionalBudgetPlan {
  fiscalYear: string; // e.g. "FY 2024-2025", "FY 2025-2026"
  campusName: string;
  totalRevenueForecast: number;
  totalExpenditureBudget: number;
  projectedSurplusDeficit: number;
  capexAllocation: number;
  opexAllocation: number;
  contingencyReserve: number;
  status: 'Draft' | 'Submitted to Board' | 'Approved by CEO' | 'Active Execution';
  revenueHeads: { headName: string; budgetedAmount: number; actualRealized: number }[];
  expenditureHeads: { headName: string; category: 'Salary & HR' | 'Campus Utilities' | 'Academic & Lab' | 'Transport & Fleet' | 'Marketing & Signage' | 'Facility Maintenance'; budgetedAmount: number; actualSpent: number }[];
}

export interface ProcurementRequisition {
  id: string;
  prNumber: string; // e.g. "PR-2024-089"
  department: 'Science Labs' | 'IT & Robotics' | 'General Store & Stationery' | 'Estate & Maintenance' | 'Sports Directorate';
  requestedBy: string;
  requestDate: string;
  requiredBeforeDate: string;
  purpose: string;
  estimatedCost: number;
  priority: 'Urgent' | 'High' | 'Routine';
  itemsList: { itemName: string; specification: string; quantity: number; unit: string; estimatedUnitCost: number }[];
  quotations: {
    vendorName: string;
    quotedTotal: number;
    deliveryDays: number;
    warrantyTerms: string;
    isRecommended: boolean;
  }[];
  poNumber?: string;
  approvalStatus: 'Pending Review' | 'Approved by Principal' | 'PO Issued' | 'Delivered & Inspected' | 'Rejected';
  approverComments?: string;
}

export interface CampusBiMetric {
  campusCode: string;
  campusName: string;
  totalStudents: number;
  studentRetentionRate: number; // e.g. 96.4%
  biseBoardPassRate: number; // e.g. 98.2%
  feeRecoveryRate: number; // e.g. 94.8%
  teacherAttendanceRate: number; // e.g. 97.5%
  studentAttendanceRate: number; // e.g. 93.8%
  ptmSatisfactionIndex: number; // e.g. 4.8 / 5.0
  overallQualityScore: number; // e.g. 94.5 / 100
  gradeCategory: 'A+ (Exemplary)' | 'A (Standard Compliant)' | 'B (Needs Improvement)';
}

export interface PredictiveRiskStudent {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: string;
  parentPhone: string;
  riskCategory: 'High Academic Failure Risk' | 'Attendance / Dropout Risk' | 'Chronic Fee Default Risk' | 'Critical Behavioral Watch';
  riskScore: number; // 0 to 100
  keyTriggers: string[];
  recentMidtermPercentage: number;
  attendancePercentage: number;
  unpaidMonths: number;
  assignedInterventionMentor: string;
  suggestedActionPlan: string;
  interventionStatus: 'Alert Raised' | 'Parent Called' | 'Remedial Classes Assigned' | 'Resolved';
}

// Phase 11: Real-Time Multi-Channel Communication, WhatsApp/SMS Gateway & Parent Helpdesk
export interface BroadcastCampaign {
  id: string;
  campaignTitle: string;
  channel: 'SMS' | 'WhatsApp' | 'Voice IVR Call' | 'Multi-Channel Omnichannel';
  audienceGroup: 'All School Parents' | 'Fee Defaulters (>1 Month)' | 'Class 9 & 10 Board Students' | 'Absentee Roll Today' | 'Teaching Staff' | 'Hostel Boarders';
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  readCount?: number;
  language: 'English' | 'Urdu (Nastaliq)' | 'Bilingual (Urdu + English)';
  messageBodyEnglish: string;
  messageBodyUrdu: string;
  voiceScriptAudioSeconds?: number;
  status: 'Draft' | 'Queued' | 'Dispatched & Delivered' | 'Scheduled';
  scheduledTime?: string;
  dispatchedAt?: string;
  gatewayProvider: 'Telenor Connect API' | 'Jazz Corporate SMS' | 'WhatsApp Cloud Business API' | 'Zong Bulk IVR';
  tags: string[];
}

export interface AutomatedTriggerRule {
  id: string;
  eventTrigger: 'Daily Student Unexcused Absence (08:30 AM)' | 'Fee Voucher Overdue Fine Warning (Day 11)' | 'Emergency Weather / Smog Holiday Alert' | 'Exam Date Sheet Published' | 'Gate Visitor Checked-In Alert';
  channel: 'WhatsApp' | 'SMS' | 'WhatsApp + SMS' | 'Voice Call Alert';
  isEnabled: boolean;
  targetAudience: string;
  templatePreview: string;
  lastTriggeredCount: number;
  lastTriggeredTime: string;
}

export interface ParentHelpdeskTicket {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentRollNo: string;
  className: string;
  parentName: string;
  parentPhone: string;
  category: 'Transport & Van Delay' | 'Fee Challan & Concession Query' | 'Academic & Homework Support' | 'Hostel & Food Service' | 'Discipline & Bullying Report' | 'Medical & Leave Request';
  priority: 'Urgent (4hr SLA)' | 'High (24hr SLA)' | 'Normal (48hr SLA)';
  subject: string;
  description: string;
  assignedOfficer: string;
  assignedDepartment: 'Transport Wing' | 'Accounts & Billing' | 'Academic Coordinator' | 'Hostel Warden' | 'Principal Office';
  status: 'Open / Acknowledged' | 'Under Investigation' | 'Resolved' | 'Closed by Parent';
  createdAt: string;
  slaDeadline: string;
  messages: {
    senderRole: 'Parent' | 'School Officer' | 'Principal';
    senderName: string;
    timestamp: string;
    text: string;
  }[];
  resolutionNotes?: string;
}

// Phase 12: Advanced Master Timetable, Automated Clash Resolver, Substitution Matrix & Bell Schedules
export interface TimetablePeriodSlot {
  periodNumber: number; // 0 for Zero period, 1 to 8
  periodLabel: string; // e.g. "Zero Period (Remedial)", "Period 1", "Period 2", "Break / Recess", "Period 5 (Friday Prayer)"
  startTime: string; // e.g. "07:30 AM"
  endTime: string; // e.g. "08:15 AM"
  isBreakOrPrayer?: boolean;
}

export interface ClassWeeklyTimetable {
  className: string; // e.g. "Class 9-A (Science)"
  section: string;
  roomNumber: string;
  classTeacher: string;
  days: {
    dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    periods: {
      periodNumber: number;
      subjectName: string;
      subjectCode: string;
      teacherName: string;
      roomOrLab: string;
      isClash?: boolean;
    }[];
  }[];
}

export interface TeacherDailySubstitution {
  id: string;
  date: string;
  absentTeacherName: string;
  absentTeacherSubject: string;
  leaveReason: 'Medical Leave' | 'Casual Leave' | 'Official BISE Duty' | 'Training / Workshop';
  affectedPeriods: {
    periodNumber: number;
    className: string;
    subject: string;
    assignedSubstituteTeacher: string;
    substituteSubjectSpecialty: string;
    substituteStatus: 'Auto-Assigned' | 'Confirmed via SMS' | 'Completed';
    notificationSent: boolean;
  }[];
}

export interface BellScheduleConfiguration {
  id: string;
  scheduleName: 'Standard Regular Schedule' | 'Winter Revised Timing (Smog Compliant)' | 'Friday Early Dismissal & Jummah' | 'Ramadan Shortened Schedule';
  assemblyTime: string;
  totalPeriods: number;
  periodDurationMinutes: number;
  recessDurationMinutes: number;
  dismissalTime: string;
  isActive: boolean;
  zeroPeriodEnabled: boolean;
  zeroPeriodDetails?: string;
}

// Phase 13: Campus Facility Maintenance, Fleet GPS Logs, Energy Telemetry & Work Order Dispatcher
export interface CampusFacilityWorkOrder {
  id: string;
  workOrderNumber: string; // e.g. "WO-2024-089"
  category: 'HVAC & Air Conditioning' | 'Electrical & Genset' | 'Plumbing & Water Filtration' | 'Civil & Furniture' | 'IT & Smart Board';
  location: string; // e.g. "Main Auditorium / Senior Science Wing"
  reportedBy: string; // e.g. "Sir Tariq Jamil (Physics Lead)"
  reportedAt: string;
  priority: 'Critical (Safety / Exam Impact)' | 'High Priority' | 'Standard Preventive';
  status: 'Reported / Queued' | 'Work in Progress' | 'Inspection Completed' | 'Resolved & Closed';
  assignedTechnician: string;
  estimatedCostPkr: number;
  actualCostPkr?: number;
  problemSummary: string;
  resolutionNotes?: string;
  materialsUsed?: string[];
}

export interface SchoolFleetVehicleLog {
  id: string;
  vehicleNumber: string; // e.g. "LEA-2021-9844"
  vehicleType: 'Coaster 30-Seater' | 'HiAce Van 15-Seater' | 'Mini-Bus 22-Seater';
  routeAssigned: string; // e.g. "Route #04 (DHA Phase 5 to Model Town Campus)"
  driverName: string;
  driverPhone: string;
  currentOdometerKm: number;
  lastServiceDate: string;
  nextServiceDueKm: number;
  fuelEfficiencyKmPerLiter: number;
  monthlyFuelBudgetPkr: number;
  monthlyFuelConsumedPkr: number;
  fitnessCertificateExpiry: string;
  gpsTrackingStatus: 'Online (Engine Running)' | 'Idling at Campus' | 'In Transit';
  currentGpsSpeedKmh: number;
  safetyRating: 'Grade A (Zero Speed Violations)' | 'Grade B' | 'Warning (Over-speeding Alert)';
}

export interface CampusEnergySolarTelemetry {
  timestamp: string;
  solarGenerationKw: number; // e.g. 45.2 kW
  gridImportKw: number; // e.g. 12.0 kW
  dieselGensetFuelLiters: number;
  netMeteringUnitsExported: number;
  dailyCarbonOffsetKg: number;
  gridPowerStatus: 'WAPDA/LESCO Normal' | 'Load-shedding (Solar + Hybrid Inverter Active)' | 'Genset Running';
}

// Phase 14: Boarding Hostel Allotment, Mess Nutrition Planner & Cafeteria POS Inventory
export interface HostelRoomBedAllotment {
  id: string;
  roomNumber: string; // e.g. "Jinnah Hall - Room 304"
  wingName: 'Jinnah Boys Boarding Wing' | 'Iqbal Senior Boarding Wing' | 'Fatima Jinnah Girls Wing';
  capacityBeds: number;
  occupiedBeds: number;
  bedIdentifiers: string[]; // e.g. ["304-A (Window)", "304-B (Study Desk Side)"]
  assignedStudentNames: string[];
  wardenName: string; // e.g. "Major (R) Shafqat Ali"
  monthlyHostelFeePkr: number;
  airConditioningStatus: 'Central AC Operating' | 'Standby Cooler' | 'Off-season Maintenance';
  roomInspectionGrade: 'Grade A (Pristine Cleanliness)' | 'Grade B' | 'Notice Issued (Messy Desk)';
}

export interface MessWeeklyNutritionMenu {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  mealType: 'Breakfast' | 'Lunch & Prep Snack' | 'Dinner & Night Milk';
  dishItems: string; // e.g. "Chicken Biryani + Mint Raita + Fresh Seasonal Salad + Gulab Jamun"
  caloricContentKcal: number;
  dietaryTags: ('Halal Certified' | 'High Protein' | 'Lactose Free Option' | 'Nut Free')[];
  chefInCharge: string;
  studentSatisfactionRating: number; // e.g. 4.8 / 5.0
  specialOccasionNote?: string;
}

export interface CafeteriaInventoryItem {
  id: string;
  itemCode: string; // e.g. "POS-TUCK-012"
  itemName: string; // e.g. "Nestle Pure Life 500ml Bottle"
  category: 'Beverages & Juices' | 'Fresh Bakery & Snacks' | 'Stationery & Notebooks' | 'Dairy & Health Drinks';
  unitPricePkr: number;
  currentStockQty: number;
  reorderThresholdQty: number;
  supplierName: string;
  dailySalesQty: number;
  monthlyRevenuePkr: number;
  halalSafetyCertified: boolean;
}

// Phase 16: Automated AI Question Bank, SNC Paper Blueprint & Exam Paper Generator
export interface AIQuestionItem {
  id: string;
  questionCode: string; // e.g. "SNC-PHY10-Q014"
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Computer Science' | 'English Literature' | 'Pakistan Studies';
  gradeClass: 'Class 9' | 'Class 10' | 'Class 11 (FSc / A-Level)' | 'Class 12';
  chapterTopic: string; // e.g. "Chapter 3: Dynamics & Newton's Laws"
  cognitiveDomain: 'Knowledge & Recall (30%)' | 'Understanding & Application (50%)' | 'Analytical & Problem Solving (20%)';
  questionType: 'Multiple Choice MCQ' | 'Short Answer Question (SAQ)' | 'Long Analytical / Numerical';
  questionText: string;
  mcqOptions?: string[]; // 4 options for MCQ
  correctAnswer: string;
  marks: number;
  sloRefCode: string; // e.g. "SNC-SLO-PHY-10.3.2"
  difficultyLevel: 'Easy' | 'Medium' | 'Challenging';
}

export interface LeaveRequest {
  id: string;
  applicantName: string;
  role: 'Student' | 'Teacher' | 'Admin' | 'Staff';
  departmentOrClass: string;
  leaveType: 'Casual' | 'Medical' | 'Maternity' | 'Sabbatical' | 'Emergency' | 'Unpaid';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  attachments?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  id: string;
  employeeName: string;
  role: 'Teacher' | 'Admin' | 'Staff';
  casual: number;
  medical: number;
  unpaid: number;
  earned: number;
  used: number;
}

// Communication Interfaces
export interface SmsRecord {
  id: string;
  sender: string;
  recipientType: 'Parent' | 'Student' | 'Staff' | 'Specific Number';
  recipientName: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Failed';
  gatewayResponse?: string;
}

export interface SmsTemplate {
  id: string;
  title: string;
  body: string;
  category: 'Attendance' | 'Fee Reminder' | 'Exam Result' | 'General' | 'Emergency';
}

export interface MobileNotificationRecord {
  id: string;
  recipientType: 'Parent' | 'Staff' | 'Student';
  recipientName: string;
  title: string;
  body: string;
  timestamp: string;
  status: 'Delivered' | 'Failed' | 'Read';
}

export interface WhatsAppRecord {
  id: string;
  recipientType: 'Parent' | 'Staff';
  recipientName: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
}

export interface TelegramRecord {
  id: string;
  recipientType: 'Parent' | 'Staff';
  recipientName: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Failed';
}

export interface EmailRecord {
  id: string;
  recipientEmails: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'Sent' | 'Opened' | 'Failed';
  attachments?: string;
}









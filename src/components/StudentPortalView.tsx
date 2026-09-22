import { useState } from 'react';
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
  Search,
  Upload,
  BookMarked,
  Layers,
  Key,
  Calendar,
  AlertCircle,
  Eye,
  Printer,
  Sparkles,
  MessageSquare,
  FileSpreadsheet,
  Check,
  Send,
} from 'lucide-react';
import {
  Student,
  DailyDiary,
  StudyMaterial,
  StudentMarkEntry,
  NoticeItem,
  TimetablePeriod,
  FeeVoucher,
} from '../types';
import { downloadFile } from '../utils/fileUtils';
import BackToDashboard from './BackToDashboard';

interface StudentPortalViewProps {
  student?: Student;
  students?: Student[];
  diaries?: DailyDiary[];
  materials?: StudyMaterial[];
  marks?: StudentMarkEntry[];
  notices?: NoticeItem[];
  timetable?: TimetablePeriod[];
  vouchers?: FeeVoucher[];
  onPrintReportCard?: (markEntry: StudentMarkEntry) => void;
}

export default function StudentPortalView({
  student,
  students = [],
  diaries = [],
  materials = [],
  marks = [],
  notices = [],
  timetable = [],
  onPrintReportCard,
}: StudentPortalViewProps) {
  const activeStudent = student || students[0] || {
    id: 'std-1',
    studentCode: 'EDU-2024-001',
    name: 'Hamza Tariq',
    fatherName: 'Mian Tariq Mehmood',
    gender: 'Male',
    dob: '2016-04-12',
    className: 'Class One',
    section: 'A',
    rollNo: '01',
    admissionDate: '2024-01-10',
    parentPhone: '+92 300 1234567',
    parentEmail: 'tariq.mehmood@gmail.com',
    address: 'House 42-B, Sector F, DHA Phase 5, Lahore',
    status: 'Active',
    monthlyFee: 3500,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    emergencyContact: '+92 321 9876543',
    bloodGroup: 'B+',
    bFormOrCnic: '35202-8889900-1',
    attendanceRate: 94.2,
  };

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'classes' | 'timetable' | 'assignments' | 'exams' | 'materials' | 'library' | 'profile'
  >('overview');

  // Homework submission state
  const [selectedDiary, setSelectedDiary] = useState<DailyDiary | null>(null);
  const [submissionFile, setSubmissionFile] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [submittedDiaries, setSubmittedDiaries] = useState<Record<string, { date: string; file: string; notes: string }>>({
    'dia-1': { date: '2026-09-20 04:30 PM', file: 'math_exercise_4_hamza.pdf', notes: 'Completed all 10 word problems.' },
  });
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Search & Filters
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState('All');
  const [librarySearch, setLibrarySearch] = useState('');

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [renewalsRequested, setRenewalsRequested] = useState<Record<string, boolean>>({});

  const studentDiaries = activeStudent
    ? diaries.filter((d) => d.className === activeStudent.className || !d.className)
    : diaries;

  const studentMaterials = activeStudent
    ? materials.filter((m) => m.className === activeStudent.className || !m.className)
    : materials;

  const studentMarks = activeStudent
    ? marks.filter((m) => m.studentId === activeStudent.id || m.studentName === activeStudent.name)
    : marks;

  const defaultTimetable: TimetablePeriod[] = timetable.length > 0 ? timetable : [
    { id: 'tt-1', day: 'Monday', periodNumber: 1, periodName: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', subject: 'English Language', className: activeStudent.className, section: 'A', roomNo: 'Room 101', teacherId: 'st-1', teacherName: 'Ms. Ayesha Siddiqa' },
    { id: 'tt-2', day: 'Monday', periodNumber: 2, periodName: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', subject: 'Mathematics', className: activeStudent.className, section: 'A', roomNo: 'Room 102', teacherId: 'st-2', teacherName: 'Sir Tariq Mehmood' },
    { id: 'tt-3', day: 'Monday', periodNumber: 3, periodName: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', subject: 'General Science', className: activeStudent.className, section: 'A', roomNo: 'Room 103', teacherId: 'st-3', teacherName: 'Ms. Zainab Bibi' },
    { id: 'tt-4', day: 'Monday', periodNumber: 4, periodName: 'Period 4', startTime: '10:45 AM', endTime: '11:30 AM', subject: 'Computer Studies', className: activeStudent.className, section: 'A', roomNo: 'Lab 2', teacherId: 'st-4', teacherName: 'Sir Farhan Ali' },
    { id: 'tt-5', day: 'Monday', periodNumber: 5, periodName: 'Period 5', startTime: '11:30 AM', endTime: '12:15 PM', subject: 'Urdu Adab', className: activeStudent.className, section: 'A', roomNo: 'Room 101', teacherId: 'st-5', teacherName: 'Madam Shazia' },
    { id: 'tt-6', day: 'Monday', periodNumber: 6, periodName: 'Period 6', startTime: '12:15 PM', endTime: '01:00 PM', subject: 'Islamiat', className: activeStudent.className, section: 'A', roomNo: 'Room 101', teacherId: 'st-6', teacherName: 'Qari Abdul Rehman' },
  ];

  // Subject List
  const subjects = [
    { code: 'ENG-101', name: 'English Language & Literature', teacher: 'Ms. Ayesha Siddiqa', room: 'Room 101', progress: 68, color: 'border-blue-500 text-blue-700 bg-blue-50' },
    { code: 'MTH-102', name: 'Mathematics & Mental Math', teacher: 'Sir Tariq Mehmood', room: 'Room 102', progress: 75, color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
    { code: 'SCI-103', name: 'General Science & Discovery', teacher: 'Ms. Zainab Bibi', room: 'Room 103', progress: 60, color: 'border-amber-500 text-amber-700 bg-amber-50' },
    { code: 'CMP-104', name: 'Computer Studies & Coding', teacher: 'Sir Farhan Ali', room: 'Computer Lab 2', progress: 82, color: 'border-purple-500 text-purple-700 bg-purple-50' },
    { code: 'URD-105', name: 'Urdu Language & Nazm', teacher: 'Madam Shazia', room: 'Room 101', progress: 70, color: 'border-rose-500 text-rose-700 bg-rose-50' },
    { code: 'ISL-106', name: 'Islamiat & Moral Ethics', teacher: 'Qari Abdul Rehman', room: 'Room 101', progress: 85, color: 'border-teal-500 text-teal-700 bg-teal-50' },
  ];

  // Borrowed Library Books
  const [borrowedBooks] = useState([
    { id: 'BK-01', title: 'Oxford Reading Tree: Stage 3 Stories', author: 'Roderick Hunt', issueDate: '2026-09-12', dueDate: '2026-09-26', status: 'Borrowed', cover: '📖' },
    { id: 'BK-02', title: 'Young Scientists: Space & Planets Encyclopedia', author: 'National Geographic Kids', issueDate: '2026-09-15', dueDate: '2026-09-29', status: 'Borrowed', cover: '🪐' },
    { id: 'BK-03', title: 'Illustrated Junior Dictionary', author: 'Oxford University Press', issueDate: '2026-08-20', dueDate: '2026-09-03', status: 'Returned', cover: '📚' },
  ]);

  const handleOpenSubmitModal = (diary: DailyDiary) => {
    setSelectedDiary(diary);
    setSubmissionFile('');
    setSubmissionNotes('');
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiary) return;
    setSubmittedDiaries((prev) => ({
      ...prev,
      [selectedDiary.id]: {
        date: new Date().toLocaleString(),
        file: submissionFile || 'assignment_upload.pdf',
        notes: submissionNotes || 'Completed and submitted online.',
      },
    }));
    setShowSubmitModal(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('New passwords do not match. Please re-enter.');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    }, 2500);
  };

  return (
    <div id="student-portal-center" className="space-y-4 text-slate-800">
      {/* Student Banner Header */}
      <div className="bg-gradient-to-r from-[#0d233a] via-[#12395d] to-[#1a5b8c] text-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={activeStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-400/20 text-sky-200 border border-sky-400/30 uppercase tracking-wider">
                  STUDENT LEARNING DESK
                </span>
                <span className="text-xs text-sky-200 font-mono font-semibold">ID: {activeStudent.studentCode}</span>
                <span className="text-xs text-sky-300">• Roll #{activeStudent.rollNo}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
                {activeStudent.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-sky-100 mt-0.5">
                <span>{activeStudent.className} - Section {activeStudent.section}</span>
                <span>•</span>
                <span>Father: {activeStudent.fatherName}</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">Attendance: {activeStudent.attendanceRate || 94.2}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-sky-500/30 text-xs">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-sky-300">Academic Year</div>
              <div className="font-extrabold text-white text-sm">2024-2025</div>
            </div>
            <div className="h-8 w-px bg-sky-500/30 mx-1" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Overall GPA</div>
              <div className="font-extrabold text-emerald-400 text-sm">3.85 / 4.0</div>
            </div>
          </div>
        </div>

        {/* Subtab Navigation Bar */}
        <div className="mt-5 pt-3 border-t border-sky-500/20 flex flex-wrap items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Learning Dashboard', icon: GraduationCap },
            { id: 'classes', label: 'My Classes & Subjects', icon: BookOpen },
            { id: 'timetable', label: 'Class Timetable', icon: Clock },
            { id: 'assignments', label: 'Homework & Assignments', icon: FileText },
            { id: 'exams', label: 'Exams & Results', icon: Award },
            { id: 'materials', label: 'Study Materials & LMS', icon: Layers },
            { id: 'library', label: 'Library Books', icon: BookMarked },
            { id: 'profile', label: 'Student Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`student-subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-sky-100 hover:bg-sky-800/50 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: LEARNING DASHBOARD OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Metrics Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">94.2%</div>
              <span className="text-[11px] text-emerald-600 font-medium">178 of 189 Days Present</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Homework</span>
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-600 mt-1">
                {studentDiaries.length - Object.keys(submittedDiaries).length > 0 ? studentDiaries.length - Object.keys(submittedDiaries).length : 0}
              </div>
              <span className="text-[11px] text-slate-500">Due within next 24 hours</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Upcoming Exams</span>
                <Award className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-xl font-black text-sky-700 mt-1">Mid-Term 2024</div>
              <span className="text-[11px] text-sky-600 font-medium">Starts in 14 Days</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Library Books</span>
                <BookMarked className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-black text-purple-700 mt-1">2 Active</div>
              <span className="text-[11px] text-slate-500">0 Overdue Fines</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's Schedule Timeline */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <h3 className="font-bold text-sm text-slate-800">Today's Class Schedule</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('timetable')}
                  className="text-xs text-sky-600 font-bold hover:underline"
                >
                  Full Timetable →
                </button>
              </div>

              <div className="space-y-2.5">
                {defaultTimetable.slice(0, 4).map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                      idx === 0
                        ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-400'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        <span>P{p.periodNumber}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {p.subject}
                          {idx === 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-bold animate-pulse">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{p.teacherName}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-600">{p.roomNo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-700">{p.startTime} - {p.endTime}</div>
                      <div className="text-[10px] text-slate-400">45 mins</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* School Circulars & Notices */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-800">School Notices &amp; News</h3>
                </div>

                <div className="space-y-3 text-xs">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{notice.title}</span>
                        <span className="text-[10px] text-slate-400">{notice.date}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">Notices updated daily by Principal Office</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Back-to-Dashboard Header when in nested section */}
      {activeSubTab !== 'overview' && (
        <BackToDashboard
          role="student"
          pageTitle={
            activeSubTab === 'classes'
              ? 'My Classes & Subject Catalog'
              : activeSubTab === 'timetable'
              ? 'Weekly Timetable & Schedule'
              : activeSubTab === 'assignments'
              ? 'Daily Homework & Assignment Submissions'
              : activeSubTab === 'exams'
              ? 'Examination Results & Progress Report'
              : activeSubTab === 'materials'
              ? 'Digital LMS & Study Repository'
              : activeSubTab === 'library'
              ? 'Library Books & Circulation'
              : activeSubTab === 'profile'
              ? 'Student Academic Profile & Bio'
              : 'Student Learning Workspace'
          }
          category="Scholar Workspace"
          customAction={() => setActiveSubTab('overview')}
          onNavigateDashboard={() => {}}
        />
      )}

      {/* SUBTAB 2: MY CLASSES & SUBJECTS */}
      {activeSubTab === 'classes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="font-extrabold text-sm text-slate-800 mb-1">Enrolled Subjects &amp; Faculty</h3>
            <p className="text-xs text-slate-500 mb-4">
              Academic course catalog, teacher assignments, and syllabus completion rate for {activeStudent.className}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <div key={sub.code} className={`p-4 rounded-xl border-2 ${sub.color} shadow-2xs space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-current shadow-2xs">
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold">{sub.room}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{sub.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">Instructor: <strong>{sub.teacher}</strong></p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Syllabus Covered</span>
                      <span className="font-bold text-slate-900">{sub.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${sub.progress}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('materials')}
                      className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Study Notes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('assignments')}
                      className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Homework</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TIMETABLE */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Weekly Academic Timetable</h3>
                <p className="text-xs text-slate-500">Official institutional class routine for {activeStudent.className} - Sec {activeStudent.section}</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <th className="p-3">Period</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Monday</th>
                    <th className="p-3">Tuesday</th>
                    <th className="p-3">Wednesday</th>
                    <th className="p-3">Thursday</th>
                    <th className="p-3">Friday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {defaultTimetable.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800 bg-slate-50/50">Period {p.periodNumber}</td>
                      <td className="p-3 font-mono text-slate-500">{p.startTime} - {p.endTime}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.subject}</div>
                        <div className="text-[10px] text-slate-400">{p.teacherName} • {p.roomNo}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.subject}</div>
                        <div className="text-[10px] text-slate-400">{p.teacherName} • {p.roomNo}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.subject}</div>
                        <div className="text-[10px] text-slate-400">{p.teacherName} • {p.roomNo}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.subject}</div>
                        <div className="text-[10px] text-slate-400">{p.teacherName} • {p.roomNo}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.subject}</div>
                        <div className="text-[10px] text-slate-400">{p.teacherName} • {p.roomNo}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: HOMEWORK & ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Daily Homework Diary &amp; Submissions</h3>
                <p className="text-xs text-slate-500">Track assigned tasks, upload homework files, and view teacher feedback.</p>
              </div>
            </div>

            <div className="space-y-3">
              {studentDiaries.map((diary) => {
                const isSubmitted = !!submittedDiaries[diary.id];
                const submissionData = submittedDiaries[diary.id];

                return (
                  <div
                    key={diary.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-xs">
                          {diary.subject}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          Assigned by: {diary.teacherName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">Date: {diary.date}</span>
                        <span className="font-bold text-rose-600">Due: {diary.submissionDate}</span>
                        {isSubmitted ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                      {diary.homeworkContent}
                      {diary.pageNo && (
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          Reference: Book Page No. {diary.pageNo}
                        </div>
                      )}
                    </div>

                    {isSubmitted && submissionData && (
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-bold text-emerald-900">Submitted File: </span>
                            <span className="font-mono text-emerald-800">{submissionData.file}</span>
                            <span className="text-[10px] text-emerald-600 ml-2">({submissionData.date})</span>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-medium italic">Remarks: Approved by Teacher (Score: 10/10)</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenSubmitModal(diary)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition ${
                          isSubmitted
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            : 'bg-[#002147] hover:bg-[#003366] text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSubmitted ? 'Resubmit Homework' : 'Submit Homework Online'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: EXAMS & RESULTS */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Examination Results &amp; Academic Dossier</h3>
                <p className="text-xs text-slate-500">Official term examinations mark sheet, percentage, and teacher evaluation.</p>
              </div>
              {studentMarks.length > 0 && (
                <button
                  type="button"
                  onClick={() => onPrintReportCard && onPrintReportCard(studentMarks[0])}
                  className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Report Card</span>
                </button>
              )}
            </div>

            {studentMarks.length > 0 ? (
              <div className="space-y-4">
                {studentMarks.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">ANNUAL ASSESSMENT</span>
                        <h4 className="font-extrabold text-base text-slate-900">{entry.examTermId || 'First Term Examination 2024'}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                          <div className="text-slate-400 text-[10px]">Total Obtained</div>
                          <div className="font-mono font-black text-slate-800 text-sm">
                            {entry.totalObtained} / {entry.totalMax} ({entry.percentage}%)
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-black text-sm">
                          Grade {entry.overallGrade}
                        </div>
                        {entry.position && (
                          <div className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs">
                            Position: #{entry.position}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-200/70 text-slate-700 text-[10px] uppercase">
                            <th className="p-2.5">Subject</th>
                            <th className="p-2.5">Total Marks</th>
                            <th className="p-2.5">Obtained Marks</th>
                            <th className="p-2.5">Grade</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {entry.subjectMarks.map((sm, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-800">{sm.subject}</td>
                              <td className="p-2.5 font-mono text-slate-600">{sm.totalMarks}</td>
                              <td className="p-2.5 font-mono font-bold text-slate-900">{sm.obtainedMarks}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-800">
                                  {sm.grade}
                                </span>
                              </td>
                              <td className="p-2.5">
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Passed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700">Class Teacher's Remarks: </span>
                      <span className="text-slate-600 italic">{entry.teacherRemarks || 'Excellent academic consistency and active participation in science projects.'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <div className="font-bold text-slate-700">No Published Examination Records</div>
                <p className="text-xs text-slate-500 mt-1">Mid-term and final examination results will be published here upon administrative approval.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 6: STUDY MATERIALS & LMS */}
      {activeSubTab === 'materials' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Digital LMS &amp; Study Materials Vault</h3>
                <p className="text-xs text-slate-500">Download lecture slides, revision worksheets, and chapter notes uploaded by faculty.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Search materials..."
                    className="px-3 py-1.5 pl-8 text-xs border rounded-lg outline-none w-48"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>

                <select
                  value={materialSubjectFilter}
                  onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border rounded-lg outline-none bg-white font-medium"
                >
                  <option value="All">All Subjects</option>
                  <option value="English">English</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Science">General Science</option>
                  <option value="Computer Studies">Computer Studies</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentMaterials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                      {mat.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.fileType || 'PDF Document'}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">{mat.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{mat.description || 'Supplementary reading and practice questions.'}</p>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Uploaded: {mat.uploadDate || '2026-09-18'}</span>
                    <span>By: {mat.teacherName || 'Faculty'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const content = `THE EDUCATORS CAMPUS DIGITAL LEARNING RESOURCE\n\nTitle: ${mat.title}\nSubject: ${mat.subject}\nFaculty: ${mat.teacherName || 'Faculty'}\nUpload Date: ${mat.uploadDate || '2026-09-18'}\n\n=========================================\nSTUDY GUIDE & LESSON NOTES\n=========================================\n${mat.description || 'Supplementary reading and practice questions for campus review.'}\n\nOfficial Student Resource - The Educators Network.`;
                      downloadFile(content, `${mat.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`, 'text/plain;charset=utf-8');
                    }}
                    className="w-full py-1.5 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resource</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Campus Digital Library Hub</h3>
                <p className="text-xs text-slate-500">Track active book loans, return due dates, and browse the institutional reading collection.</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search book catalog..."
                  className="px-3 py-1.5 pl-8 text-xs border rounded-lg outline-none w-52"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div className="space-y-3">
              {borrowedBooks.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{b.cover}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                      <div className="text-[11px] text-slate-500">Author: {b.author} • Code: {b.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Issued: {b.issueDate} • Due: <strong>{b.dueDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Borrowed' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {b.status}
                    </span>
                    {b.status === 'Borrowed' && (
                      <div>
                        {renewalsRequested[b.id] ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ Renewal Requested
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRenewalsRequested((prev) => ({ ...prev, [b.id]: true }))}
                            className="text-[11px] text-sky-600 hover:underline font-bold cursor-pointer"
                          >
                            Request Renewal
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: STUDENT PROFILE & CREDENTIALS */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 border-b pb-2">Student Identity &amp; Enrollment Dossier</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Full Name</span>
                <span className="font-bold text-slate-800">{activeStudent.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Father's Name</span>
                <span className="font-bold text-slate-800">{activeStudent.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Student Code</span>
                <span className="font-mono font-bold text-slate-800">{activeStudent.studentCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Class &amp; Section</span>
                <span className="font-bold text-slate-800">{activeStudent.className} - {activeStudent.section}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Roll Number</span>
                <span className="font-mono font-bold text-slate-800">{activeStudent.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">B-Form / CNIC</span>
                <span className="font-mono font-bold text-slate-800">{activeStudent.bFormOrCnic || '35202-8889900-1'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Blood Group</span>
                <span className="font-bold text-rose-700">{activeStudent.bloodGroup || 'B+'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                <span className="font-bold text-slate-800">{activeStudent.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Emergency Contact</span>
                <span className="font-mono font-bold text-slate-800">{activeStudent.emergencyContact}</span>
              </div>
            </div>

            <div className="pt-2 border-t text-xs">
              <span className="text-slate-400 block text-[10px]">Registered Residential Address</span>
              <span className="font-medium text-slate-700">{activeStudent.address}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-800 border-b pb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-sky-600" />
              <span>Change Portal Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 border rounded outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded shadow transition cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT HOMEWORK MODAL */}
      {showSubmitModal && selectedDiary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Submit Homework Online</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                <div className="font-bold text-sky-900">{selectedDiary.subject} Homework</div>
                <div className="text-sky-700 mt-0.5">{selectedDiary.homeworkContent}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File / PDF / Image to Attach</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-600 font-medium block">Drag &amp; drop homework file here, or browse</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 15MB</span>
                  <input
                    type="file"
                    className="hidden"
                    id="homework-file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSubmissionFile(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="homework-file-upload"
                    className="inline-block mt-2 px-3 py-1 bg-sky-600 text-white rounded text-[11px] font-bold cursor-pointer hover:bg-sky-500"
                  >
                    Choose File
                  </label>
                  {submissionFile && (
                    <div className="mt-2 text-xs font-bold text-emerald-700 font-mono">
                      Selected: {submissionFile}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Notes / Remarks (Optional)</label>
                <textarea
                  rows={2}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. Completed all exercises, attached rough calculations."
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded-lg shadow transition"
                >
                  Confirm &amp; Dispatch Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

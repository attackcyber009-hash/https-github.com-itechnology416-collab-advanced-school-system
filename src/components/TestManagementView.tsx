import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  FileSpreadsheet,
  Printer,
  Medal,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Clock,
  UserCheck,
  Building,
  FileText,
  AlertCircle,
  BarChart3,
  Plus,
  Download,
  ShieldCheck,
  Sparkles,
  QrCode,
  MessageSquare,
  Send,
  Sliders,
  Check,
  ChevronRight,
  HelpCircle,
  PhoneCall,
  User,
  Trash,
  Edit2,
  Bookmark,
  BookOpen,
  CheckSquare,
  Trophy
} from 'lucide-react';

interface TestItem {
  id: string;
  name: string;
  className: string;
  section: string;
  subject: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  status: 'Completed' | 'Ongoing' | 'Scheduled';
  enrolledStudents: number;
}

interface TestStudentMark {
  id: string;
  rollNo: string;
  name: string;
  parentName: string;
  marksObtained: number;
  totalMarks: number;
  remarks: string;
  phone: string;
}

interface TestTimetableItem {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  room: string;
  invigilator: string;
}

interface TestSchedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Complete' | 'Pending';
  associatedTests: number;
}

interface TestManagementViewProps {
  activeAction?: string | null;
}

export default function TestManagementView({ activeAction }: TestManagementViewProps) {
  // Tabs requested by the user
  const [activeTab, setActiveTab] = useState<
    | 'tests_list'
    | 'marks_entry'
    | 'timetable_manage'
    | 'timetable_add'
    | 'schedules_manage'
    | 'schedules_add'
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
  >('tests_list');

  // Monitor parent action triggers from Sidebar
  useEffect(() => {
    if (activeAction) {
      setActiveTab(activeAction as any);
    }
  }, [activeAction]);

  // Dropdown states
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTest, setSelectedTest] = useState('test-1');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Test List Data & Modals
  const [tests, setTests] = useState<TestItem[]>([
    { id: 'test-1', name: 'Weekly Calculus Test', className: 'Class One', section: 'A', subject: 'Mathematics', date: '2026-09-15', totalMarks: 50, passingMarks: 20, status: 'Completed', enrolledStudents: 15 },
    { id: 'test-2', name: 'Monthly English Comprehension', className: 'Class One', section: 'A', subject: 'English', date: '2026-09-18', totalMarks: 100, passingMarks: 40, status: 'Completed', enrolledStudents: 15 },
    { id: 'test-3', name: 'Physics Unit 1 Mechanics', className: 'Class Two', section: 'B', subject: 'Physics', date: '2026-09-22', totalMarks: 75, passingMarks: 30, status: 'Scheduled', enrolledStudents: 18 },
    { id: 'test-4', name: 'Chemistry Periodic Table', className: 'Class One', section: 'A', subject: 'Chemistry', date: '2026-09-20', totalMarks: 50, passingMarks: 20, status: 'Ongoing', enrolledStudents: 15 },
    { id: 'test-5', name: 'Biology Genetics Fundamentals', className: 'Class Three', section: 'A', subject: 'Biology', date: '2026-09-25', totalMarks: 100, passingMarks: 40, status: 'Scheduled', enrolledStudents: 22 },
  ]);

  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [newTest, setNewTest] = useState<Partial<TestItem>>({
    name: '',
    className: 'Class One',
    section: 'A',
    subject: 'Mathematics',
    date: '2026-09-24',
    totalMarks: 50,
    passingMarks: 20,
    status: 'Scheduled',
    enrolledStudents: 15,
  });

  const handleAddTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTest.name) return;
    const item: TestItem = {
      id: `test-${Date.now()}`,
      name: newTest.name,
      className: newTest.className || 'Class One',
      section: newTest.section || 'A',
      subject: newTest.subject || 'Mathematics',
      date: newTest.date || '2026-09-24',
      totalMarks: Number(newTest.totalMarks) || 50,
      passingMarks: Number(newTest.passingMarks) || 20,
      status: newTest.status as any || 'Scheduled',
      enrolledStudents: Number(newTest.enrolledStudents) || 15,
    };
    setTests([item, ...tests]);
    setShowAddTestModal(false);
    setNewTest({
      name: '',
      className: 'Class One',
      section: 'A',
      subject: 'Mathematics',
      date: '2026-09-24',
      totalMarks: 50,
      passingMarks: 20,
      status: 'Scheduled',
      enrolledStudents: 15,
    });
  };

  // 2. Student Marks Entry Data
  const [studentMarks, setStudentMarks] = useState<TestStudentMark[]>([
    { id: 'smark-1', rollNo: '101', name: 'Aarav Sharma', parentName: 'Ramesh Sharma', marksObtained: 42, totalMarks: 50, remarks: 'Excellent Analytical Skill', phone: '+923001234567' },
    { id: 'smark-2', rollNo: '102', name: 'Zoya Fatima', parentName: 'Khurram Fatima', marksObtained: 47, totalMarks: 50, remarks: 'Top Performer, highly detail-oriented', phone: '+923009876543' },
    { id: 'smark-3', rollNo: '103', name: 'Vivaan Patel', parentName: 'Vijay Patel', marksObtained: 28, totalMarks: 50, remarks: 'Satisfactory, needs more speed practice', phone: '+923004561234' },
    { id: 'smark-4', rollNo: '104', name: 'Ananya Rao', parentName: 'Shekar Rao', marksObtained: 36, totalMarks: 50, remarks: 'Consistent improvement shown', phone: '+923015556666' },
    { id: 'smark-5', rollNo: '105', name: 'Kabir Singh', parentName: 'Harbhajan Singh', marksObtained: 18, totalMarks: 50, remarks: 'Below passing threshold, recommend remedial classes', phone: '+923027778888' },
    { id: 'smark-6', rollNo: '106', name: 'Diya Nair', parentName: 'Mohan Nair', marksObtained: 45, totalMarks: 50, remarks: 'Brilliant understanding of equations', phone: '+923039990000' },
  ]);

  const handleUpdateObtainedMarks = (id: string, value: number) => {
    setStudentMarks(prev => prev.map(m => {
      if (m.id === id) {
        const capped = Math.min(Math.max(0, value), m.totalMarks);
        return { ...m, marksObtained: capped };
      }
      return m;
    }));
  };

  const handleUpdateStudentRemarks = (id: string, text: string) => {
    setStudentMarks(prev => prev.map(m => m.id === id ? { ...m, remarks: text } : m));
  };

  // 3. Test Timetable Data
  const [timetables, setTimetables] = useState<TestTimetableItem[]>([
    { id: 'tt-1', subject: 'Mathematics Unit Test', date: '2026-09-24', time: '09:00 AM', duration: '1 Hour', totalMarks: 50, room: 'Examination Hall A', invigilator: 'Prof. Amjad Ali' },
    { id: 'tt-2', subject: 'English Grammar Quiz', date: '2026-09-25', time: '11:30 AM', duration: '45 Minutes', totalMarks: 30, room: 'Room 102', invigilator: 'Miss Saira Khan' },
    { id: 'tt-3', subject: 'Physics Practical Assessment', date: '2026-09-26', time: '10:00 AM', duration: '2 Hours', totalMarks: 100, room: 'Physics Lab 3', invigilator: 'Dr. Tariq Mahmood' },
    { id: 'tt-4', subject: 'Chemistry Atomic Structures', date: '2026-09-28', time: '08:30 AM', duration: '1 Hour', totalMarks: 50, room: 'Room 104', invigilator: 'Mr. Naveed Malik' },
  ]);

  const [newTimetable, setNewTimetable] = useState<Partial<TestTimetableItem>>({
    subject: '',
    date: '2026-09-28',
    time: '10:00 AM',
    duration: '1 Hour',
    totalMarks: 50,
    room: 'Room 105',
    invigilator: 'Miss Amina',
  });

  const handleAddTimetableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimetable.subject) return;
    const item: TestTimetableItem = {
      id: `tt-${Date.now()}`,
      subject: newTimetable.subject,
      date: newTimetable.date || '2026-09-28',
      time: newTimetable.time || '10:00 AM',
      duration: newTimetable.duration || '1 Hour',
      totalMarks: Number(newTimetable.totalMarks) || 50,
      room: newTimetable.room || 'Room 105',
      invigilator: newTimetable.invigilator || 'Staff Member',
    };
    setTimetables([...timetables, item]);
    setActiveTab('timetable_manage');
    setNewTimetable({
      subject: '',
      date: '2026-09-28',
      time: '10:00 AM',
      duration: '1 Hour',
      totalMarks: 50,
      room: 'Room 105',
      invigilator: 'Miss Amina',
    });
  };

  const handleRemoveTimetable = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  // 4. Test Schedules Data
  const [schedules, setSchedules] = useState<TestSchedule[]>([
    { id: 'sch-1', title: 'September Assessment Cycle', startDate: '2026-09-10', endDate: '2026-09-20', status: 'Ongoing', associatedTests: 5 },
    { id: 'sch-2', title: 'Monthly Quiz Block 2', startDate: '2026-10-05', endDate: '2026-10-10', status: 'Pending', associatedTests: 3 },
    { id: 'sch-3', title: 'Mid-Term Diagnostic Exams', startDate: '2026-08-15', endDate: '2026-08-22', status: 'Complete', associatedTests: 6 },
  ]);

  const [newSchedule, setNewSchedule] = useState<Partial<TestSchedule>>({
    title: '',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    status: 'Pending',
    associatedTests: 4,
  });

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.title) return;
    const item: TestSchedule = {
      id: `sch-${Date.now()}`,
      title: newSchedule.title,
      startDate: newSchedule.startDate || '2026-10-15',
      endDate: newSchedule.endDate || '2026-10-22',
      status: newSchedule.status as any || 'Pending',
      associatedTests: Number(newSchedule.associatedTests) || 3,
    };
    setSchedules([...schedules, item]);
    setActiveTab('schedules_manage');
    setNewSchedule({ title: '', startDate: '2026-10-15', endDate: '2026-10-22', status: 'Pending', associatedTests: 4 });
  };

  // 5. Assign Grade States
  const [testGrades, setTestGrades] = useState([
    { grade: 'A+', min: 90, comment: 'Exceptional Concept clarity' },
    { grade: 'A', min: 80, comment: 'Strong performance' },
    { grade: 'B', min: 70, comment: 'Good understanding' },
    { grade: 'C', min: 55, comment: 'Average effort' },
    { grade: 'D', min: 40, comment: 'Needs rigorous practice' },
    { grade: 'F', min: 0, comment: 'Failed / Unacceptable scores' },
  ]);

  const handleGradeThresholdChange = (index: number, val: number) => {
    setTestGrades(prev => {
      const updated = [...prev];
      updated[index].min = Math.min(Math.max(0, val), 100);
      return updated;
    });
  };

  // Combined weightage configuration
  const [test1Weight, setTest1Weight] = useState(30);
  const [test2Weight, setTest2Weight] = useState(30);
  const [test3Weight, setTest3Weight] = useState(40);

  // Helper helper to dynamically map student scores to grades
  const getGradeForMarks = (score: number, max: number = 50) => {
    const percentage = Math.round((score / max) * 100);
    const matched = testGrades.find(g => percentage >= g.min);
    return matched ? matched.grade : 'F';
  };

  // Quick preset feedback remarks
  const remarksPresets = [
    'Outstanding analytical performance.',
    'Highly diligent. Keeps excellent focus.',
    'Conceptually strong, but check calculations.',
    'Needs active review of mathematical formulas.',
    'Inconsistent submission. Support required.',
  ];

  // 6. Print and Reports Previews / Layout
  const [activeReceipt, setActiveReceipt] = useState<TestStudentMark | null>(null);
  const [selectedBulkStudents, setSelectedBulkStudents] = useState<string[]>(['101', '102', '103', '104', '105', '106']);

  // SMS Text Custom template
  const [smsTemplate, setSmsTemplate] = useState('Dear Parents, Student {student_name} scored {marks_obtained}/{total_marks} ({percentage}%) in the {test_name}. Grade achieved: {grade}. Comment: {remarks}.');
  const [smsDeliveryStatus, setSmsDeliveryStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [sentSMSCount, setSentSMSCount] = useState(0);

  const triggerSMSBroadcast = () => {
    setSmsDeliveryStatus('sending');
    setTimeout(() => {
      setSmsDeliveryStatus('success');
      setSentSMSCount(studentMarks.length);
    }, 1800);
  };

  // Filtered Students and Marks List
  const filteredStudentMarks = studentMarks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.rollNo.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div id="test-management-workspace" className="space-y-6">
      {/* Primary Header Section */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm tracking-wider uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>Academic Performance Core</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
            Test Management Console
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure unit tests, track scores, design timetables, assign custom grades, print roll cards, and broadcast SMS alerts.
          </p>
        </div>

        {/* Global Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Class One">Class One (Primary)</option>
              <option value="Class Two">Class Two (Elementary)</option>
              <option value="Class Three">Class Three (Senior)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject Area</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Navigation Tab Ribbon */}
      <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1 border border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'tests_list', label: 'Test list', icon: FileText },
          { id: 'marks_entry', label: 'Marks entry', icon: FileSpreadsheet },
          { id: 'timetable_manage', label: 'Test Timetable', icon: Calendar },
          { id: 'schedules_manage', label: 'Test Schedules', icon: Clock },
          { id: 'grade_particular', label: 'Assign Grade', icon: Sliders },
          { id: 'teacher_remarks', label: 'Remarks', icon: UserCheck },
          { id: 'tabulation_particular', label: 'Tabulations', icon: BarChart3 },
          { id: 'positions_particular', label: 'Position Holders', icon: Medal },
          { id: 'admit_cards_particular', label: 'Admit Cards', icon: QrCode },
          { id: 'sms_particular', label: 'Send SMS', icon: MessageSquare },
          { id: 'print_mark_sheets', label: 'Mark Sheets', icon: Printer },
          { id: 'test_reports', label: 'Diagnostic Reports', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || 
            (tab.id === 'timetable_manage' && activeTab === 'timetable_add') ||
            (tab.id === 'schedules_manage' && activeTab === 'schedules_add') ||
            (tab.id === 'grade_particular' && activeTab === 'grade_combined') ||
            (tab.id === 'tabulation_particular' && activeTab === 'tabulation_combined') ||
            (tab.id === 'positions_particular' && activeTab === 'positions_combined') ||
            (tab.id === 'admit_cards_particular' && activeTab === 'admit_cards_combined') ||
            (tab.id === 'sms_particular' && activeTab === 'sms_combined');

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Workspace Panel Content */}

      {/* 1. Test List Tab */}
      {activeTab === 'tests_list' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Assigned Campus Tests</h2>
              <p className="text-slate-500 text-xs mt-0.5">Showing registered unit assessments and diagnostic quizzes.</p>
            </div>
            <button
              onClick={() => setShowAddTestModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Test Record</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search tests by title or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="p-4">Test Title</th>
                  <th className="p-4">Academic Class</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Assessment Date</th>
                  <th className="p-4 text-center">Total Marks</th>
                  <th className="p-4 text-center">Passing Marks</th>
                  <th className="p-4">Active Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests
                  .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/75 text-slate-700">
                      <td className="p-4 font-bold text-indigo-600">{t.name}</td>
                      <td className="p-4">{t.className} (Sec {t.section})</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-medium">
                          {t.subject}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{t.date}</td>
                      <td className="p-4 text-center font-bold text-slate-800">{t.totalMarks}</td>
                      <td className="p-4 text-center text-rose-500 font-bold">{t.passingMarks}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          t.status === 'Ongoing' ? 'bg-amber-50 text-amber-700' :
                          'bg-sky-50 text-sky-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            setSelectedTest(t.id);
                            setActiveTab('marks_entry');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-[10.5px] rounded transition-all"
                        >
                          Award Marks
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Marks Entry Tab */}
      {activeTab === 'marks_entry' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Dynamic Subject Marks Award</h2>
              <p className="text-slate-500 text-xs mt-0.5">Editing: <span className="text-indigo-600 font-bold">Weekly Calculus Test</span> for {selectedClass} Section {selectedSection}.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Test Selector:</span>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none"
              >
                {tests.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-indigo-50 border-b border-indigo-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Target Subject</span>
              <span className="text-sm font-bold text-indigo-900">{selectedSubject}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Class Average</span>
              <span className="text-sm font-bold text-indigo-900">37.33 / 50 (74.6%)</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Passing Rate</span>
              <span className="text-sm font-bold text-emerald-600">83.3%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Evaluated Roster</span>
              <span className="text-sm font-bold text-indigo-900">{studentMarks.length} Students</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Father Name</th>
                  <th className="p-4 text-center">Marks Obtained (Max: 50)</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-center">Letter Grade</th>
                  <th className="p-4 text-center">Pass Status</th>
                  <th className="p-4">Teacher Remark Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMarks.map((m) => {
                  const percentage = Math.round((m.marksObtained / m.totalMarks) * 100);
                  const isPass = m.marksObtained >= 20; // Passing score is 20 out of 50
                  const grade = getGradeForMarks(m.marksObtained, 50);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{m.rollNo}</td>
                      <td className="p-4 font-semibold text-slate-900">{m.name}</td>
                      <td className="p-4 text-slate-500">{m.parentName}</td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={m.marksObtained}
                          min={0}
                          max={50}
                          onChange={(e) => handleUpdateObtainedMarks(m.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 text-center font-bold text-indigo-600 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-4 text-center font-bold text-slate-700">{percentage}%</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-sm font-bold">
                          {grade}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isPass ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isPass ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={m.remarks}
                          onChange={(e) => handleUpdateStudentRemarks(m.id, e.target.value)}
                          placeholder="Add progress assessment notes..."
                          className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Timetable Manage & Add Tabs */}
      {(activeTab === 'timetable_manage' || activeTab === 'timetable_add') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Sub Tab Switcher */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('timetable_manage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'timetable_manage' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Manage Test Timetable
            </button>
            <button
              onClick={() => setActiveTab('timetable_add')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'timetable_add' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Add New Timetable Slot
            </button>
          </div>

          {activeTab === 'timetable_manage' ? (
            <div className="p-0">
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-800">Master Test Timetable Sheet</h2>
                <p className="text-slate-500 text-xs mt-0.5">Assigned exam room slots and scheduled academic tests.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                      <th className="p-4">Subject & Block</th>
                      <th className="p-4">Test Date</th>
                      <th className="p-4">Start Time</th>
                      <th className="p-4">Allocated Duration</th>
                      <th className="p-4 text-center">Marks Weight</th>
                      <th className="p-4">Exam Room / Lab</th>
                      <th className="p-4">Assigned Supervisor</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {timetables.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 text-slate-700">
                        <td className="p-4 font-bold text-indigo-600">{item.subject}</td>
                        <td className="p-4 font-medium">{item.date}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {item.time}
                          </span>
                        </td>
                        <td className="p-4">{item.duration}</td>
                        <td className="p-4 text-center font-bold">{item.totalMarks}</td>
                        <td className="p-4 font-medium text-slate-800">{item.room}</td>
                        <td className="p-4 text-slate-600">{item.invigilator}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRemoveTimetable(item.id)}
                            className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded transition"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Add Timetable Schedule Slot</h2>
              <p className="text-slate-500 text-xs mb-5">Plan dates, time windows, rooms, and supervisors to avoid schedule conflicts.</p>

              <form onSubmit={handleAddTimetableSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Subject / Test Title *</label>
                  <input
                    type="text"
                    required
                    value={newTimetable.subject}
                    onChange={(e) => setNewTimetable({ ...newTimetable, subject: e.target.value })}
                    placeholder="e.g. Mathematics Calculus Assessment"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Schedule Date *</label>
                    <input
                      type="date"
                      required
                      value={newTimetable.date}
                      onChange={(e) => setNewTimetable({ ...newTimetable, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Starting Time Slot *</label>
                    <input
                      type="text"
                      required
                      value={newTimetable.time}
                      onChange={(e) => setNewTimetable({ ...newTimetable, time: e.target.value })}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Duration *</label>
                    <input
                      type="text"
                      required
                      value={newTimetable.duration}
                      onChange={(e) => setNewTimetable({ ...newTimetable, duration: e.target.value })}
                      placeholder="e.g. 1.5 Hours"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total Marks *</label>
                    <input
                      type="number"
                      required
                      value={newTimetable.totalMarks}
                      onChange={(e) => setNewTimetable({ ...newTimetable, totalMarks: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Allotted Hall / Room *</label>
                    <input
                      type="text"
                      required
                      value={newTimetable.room}
                      onChange={(e) => setNewTimetable({ ...newTimetable, room: e.target.value })}
                      placeholder="e.g. Examination Room 204"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Invigilator *</label>
                  <input
                    type="text"
                    required
                    value={newTimetable.invigilator}
                    onChange={(e) => setNewTimetable({ ...newTimetable, invigilator: e.target.value })}
                    placeholder="e.g. Dr. Rashid Khan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Publish Schedule Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('timetable_manage')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 4. Test Schedules Manage & Add Tabs */}
      {(activeTab === 'schedules_manage' || activeTab === 'schedules_add') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('schedules_manage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'schedules_manage' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Manage Test Schedules
            </button>
            <button
              onClick={() => setActiveTab('schedules_add')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'schedules_add' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Create Assessment Schedules
            </button>
          </div>

          {activeTab === 'schedules_manage' ? (
            <div className="p-0">
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-800">Unified Assessment Cycles</h2>
                <p className="text-slate-500 text-xs mt-0.5">Monitor broader assessment blocks and operational stages.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                      <th className="p-4">Schedule Cycle Name</th>
                      <th className="p-4">Timeline Start</th>
                      <th className="p-4">Timeline End</th>
                      <th className="p-4 text-center">Linked Tests</th>
                      <th className="p-4">Cycle Status</th>
                      <th className="p-4 text-right">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedules.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 text-slate-700">
                        <td className="p-4 font-bold text-indigo-600">{item.title}</td>
                        <td className="p-4">{item.startDate}</td>
                        <td className="p-4">{item.endDate}</td>
                        <td className="p-4 text-center font-semibold text-slate-800">{item.associatedTests} Tests</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' :
                            item.status === 'Ongoing' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-[11px] text-slate-500 italic">Synchronized with LMS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Create Assessment Cycle</h2>
              <p className="text-slate-500 text-xs mb-5">Create a master timeline span to bind sequential subject assessments.</p>

              <form onSubmit={handleAddScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Cycle Name / Description *</label>
                  <input
                    type="text"
                    required
                    value={newSchedule.title}
                    onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                    placeholder="e.g. October Assessment Cycle"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newSchedule.startDate}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={newSchedule.endDate}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cycle Status *</label>
                    <select
                      value={newSchedule.status}
                      onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Estimated Test Block Count *</label>
                    <input
                      type="number"
                      required
                      value={newSchedule.associatedTests}
                      onChange={(e) => setNewSchedule({ ...newSchedule, associatedTests: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Establish Schedule Cycle
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('schedules_manage')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 5. Assign Grade Tabs */}
      {(activeTab === 'grade_particular' || activeTab === 'grade_combined') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('grade_particular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'grade_particular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Particular Test
            </button>
            <button
              onClick={() => setActiveTab('grade_combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'grade_combined' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Combined Result
            </button>
          </div>

          {activeTab === 'grade_particular' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Test Grading Matrix Thresholds</h2>
              <p className="text-slate-500 text-xs mb-6">Modify percentage brackets to dynamically recalculate letter grades for all campus tests.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Interactive Sliders */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Configure Brackets</h3>
                  {testGrades.map((rule, idx) => (
                    <div key={rule.grade} className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-900">Grade Letter: {rule.grade}</span>
                        <span className="font-bold text-slate-600">Minimum Score Threshold: {rule.min}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={rule.min}
                        onChange={(e) => handleGradeThresholdChange(idx, Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <span className="block text-[10.5px] text-slate-500 italic">{rule.comment}</span>
                    </div>
                  ))}
                </div>

                {/* Live Real-time Simulation */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Live Recalculation Check</h3>
                  <p className="text-xs text-slate-500 mb-4">Below is the current dynamic grades preview mapping for current class students:</p>
                  
                  <div className="space-y-2.5">
                    {studentMarks.slice(0, 5).map((m) => {
                      const calculatedGrade = getGradeForMarks(m.marksObtained, 50);
                      const percentage = Math.round((m.marksObtained / 50) * 100);
                      return (
                        <div key={m.id} className="bg-white p-3 rounded-lg border border-slate-150 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{m.name}</span>
                            <span className="block text-[10.5px] text-slate-400 font-medium">Score: {m.marksObtained}/50 ({percentage}%)</span>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs">
                            {calculatedGrade}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Saving Bracket Configuration
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Combined Performance Weights</h2>
              <p className="text-slate-500 text-xs mb-6">Assign weights to separate test blocks to compile a final cumulative grade.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700">Test Block 1: Unit Assessments</h3>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Weightage Allocation:</span>
                    <span className="text-indigo-600 font-bold">{test1Weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={test1Weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTest1Weight(val);
                      // Adjust others to equal 100
                      const diff = 100 - val;
                      setTest2Weight(Math.round(diff * 0.45));
                      setTest3Weight(Math.round(diff * 0.55));
                    }}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10.5px] text-slate-500">Weekly quizzes, short testing assignments, and speed reviews.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700">Test Block 2: Monthly Assessements</h3>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Weightage Allocation:</span>
                    <span className="text-indigo-600 font-bold">{test2Weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={test2Weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTest2Weight(val);
                      const diff = 100 - val;
                      setTest1Weight(Math.round(diff * 0.45));
                      setTest3Weight(Math.round(diff * 0.55));
                    }}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10.5px] text-slate-500">Structured syllabus chapters, vocabulary reviews, and chemistry tables.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700">Test Block 3: Diagnostic Term</h3>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Weightage Allocation:</span>
                    <span className="text-indigo-600 font-bold">{test3Weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={test3Weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTest3Weight(val);
                      const diff = 100 - val;
                      setTest1Weight(Math.round(diff * 0.45));
                      setTest2Weight(Math.round(diff * 0.55));
                    }}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10.5px] text-slate-500">Final major term test evaluation covering comprehensive books.</p>
                </div>
              </div>

              {/* Combined validation status */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-6 flex items-center justify-between max-w-4xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div className="text-xs text-indigo-950">
                    <span className="font-bold">Total Weight Distribution Status: </span>
                    <span>{test1Weight} + {test2Weight} + {test3Weight} = 100% (Properly Calibrated)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Combined grade rules applied and student databases re-synchronized.')}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg cursor-pointer transition-all"
                >
                  Recalculate Academic Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Teacher Remarks Tab */}
      {activeTab === 'teacher_remarks' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Assigned Qualitative Comments</h2>
            <p className="text-slate-500 text-xs mt-0.5">Edit qualitative assessments and record growth remarks for report cards.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="p-4 w-16">Roll No</th>
                  <th className="p-4 w-48">Student Name</th>
                  <th className="p-4 w-32">Obtained Marks</th>
                  <th className="p-4 w-32">Letter Grade</th>
                  <th className="p-4">Custom Report Remarks</th>
                  <th className="p-4 text-right">Quick Presets Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMarks.map((m) => {
                  const grade = getGradeForMarks(m.marksObtained, 50);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 text-slate-700">
                      <td className="p-4 font-bold">{m.rollNo}</td>
                      <td className="p-4 font-semibold text-indigo-600">{m.name}</td>
                      <td className="p-4 font-bold">{m.marksObtained} / 50</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                          {grade}
                        </span>
                      </td>
                      <td className="p-4">
                        <textarea
                          rows={2}
                          value={m.remarks}
                          onChange={(e) => handleUpdateStudentRemarks(m.id, e.target.value)}
                          placeholder="Type personal progress remarks..."
                          className="w-full px-2.5 py-1 bg-white border border-slate-200 text-xs rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-wrap gap-1 justify-end max-w-sm ml-auto">
                          {remarksPresets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => handleUpdateStudentRemarks(m.id, preset)}
                              className="px-2 py-0.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded font-medium text-[9px] whitespace-nowrap transition-all"
                            >
                              {preset.split(' ')[0]}...
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tabulation Sheet Tabs */}
      {(activeTab === 'tabulation_particular' || activeTab === 'tabulation_combined') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('tabulation_particular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tabulation_particular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Particular Test
            </button>
            <button
              onClick={() => setActiveTab('tabulation_combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tabulation_combined' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Combined Result
            </button>
          </div>

          <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'tabulation_particular' ? 'Test Tabulation Sheet' : 'Cumulative Unified Tabulation Sheet'}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {activeTab === 'tabulation_particular' 
                  ? `Detailed master sheet roster of student achievement for ${selectedSubject}.`
                  : 'Combined annual summary weighing all scheduled test cycle results.'}
              </p>
            </div>
            <button
              onClick={() => alert('Tabulation broadsheet downloaded as excel spreadsheet.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export BroadSheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Math Test</th>
                  <th className="p-4">English Test</th>
                  <th className="p-4">Physics Test</th>
                  <th className="p-4">Chemistry Test</th>
                  <th className="p-4 text-center">Grand Total</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-center">Grade</th>
                  <th className="p-4">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Dynamically order students for a ranking presentation */}
                {[...studentMarks]
                  .sort((a, b) => b.marksObtained - a.marksObtained)
                  .map((m, idx) => {
                    const mathVal = m.marksObtained;
                    const engVal = Math.round(mathVal * 0.95);
                    const physVal = Math.round(mathVal * 0.9);
                    const chemVal = Math.round(mathVal * 1.02);

                    const grandTotal = mathVal + engVal + physVal + chemVal;
                    const maxMarksTotal = 250;
                    const percentage = Math.round((grandTotal / maxMarksTotal) * 100);
                    const finalGrade = getGradeForMarks(grandTotal, maxMarksTotal);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 text-slate-700">
                        <td className="p-4 font-bold text-slate-400">#{idx + 1}</td>
                        <td className="p-4 font-medium">{m.rollNo}</td>
                        <td className="p-4 font-bold text-slate-900">{m.name}</td>
                        <td className="p-4 font-semibold text-slate-700">{mathVal}/50</td>
                        <td className="p-4 text-slate-600">{engVal}/50</td>
                        <td className="p-4 text-slate-600">{physVal}/50</td>
                        <td className="p-4 text-slate-600">{chemVal}/50</td>
                        <td className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/25">{grandTotal} / {maxMarksTotal}</td>
                        <td className="p-4 text-center font-bold text-slate-800">{percentage}%</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 rounded font-bold">{finalGrade}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded font-bold text-[10px] ${
                            percentage >= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {percentage >= 50 ? 'Promoted' : 'Probation'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Position Holder Tabs */}
      {(activeTab === 'positions_particular' || activeTab === 'positions_combined') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('positions_particular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'positions_particular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Particular Test
            </button>
            <button
              onClick={() => setActiveTab('positions_combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'positions_combined' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Combined Exam
            </button>
          </div>

          <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
              {activeTab === 'positions_particular' ? 'Test Position Champions' : 'Academic Session Honor Roll'}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Celebrating scholastic achievements of students who scored top ranks.</p>

            {/* Visual Podiums Display */}
            <div className="mt-8 flex flex-col md:flex-row items-end justify-center gap-6 max-w-2xl mx-auto pt-6 pb-2">
              {/* Silver (Rank 2) */}
              <div className="w-full md:w-44 flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-300 shadow-xs mb-2">
                  <Medal className="w-7 h-7 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">Aarav Sharma</span>
                <span className="text-[11px] text-slate-400">Roll No: 101</span>
                <div className="w-full bg-slate-200 text-slate-700 font-bold text-xs py-5 rounded-t-lg shadow-sm border-t border-slate-300 mt-2">
                  <div className="text-xl">2nd</div>
                  <div>84.0% Score</div>
                </div>
              </div>

              {/* Gold (Rank 1) */}
              <div className="w-full md:w-48 flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-300 shadow-md mb-2 animate-bounce">
                  <Trophy className="w-9 h-9 text-amber-500 animate-pulse" />
                </div>
                <span className="text-base font-extrabold text-slate-900">Zoya Fatima</span>
                <span className="text-[11px] text-slate-400">Roll No: 102</span>
                <div className="w-full bg-indigo-600 text-white font-extrabold text-sm py-8 rounded-t-lg shadow-md border-t border-indigo-400 mt-2">
                  <div className="text-2xl">★ 1st ★</div>
                  <div>94.0% Score</div>
                </div>
              </div>

              {/* Bronze (Rank 3) */}
              <div className="w-full md:w-44 flex flex-col items-center">
                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center border border-orange-200 shadow-xs mb-2">
                  <Medal className="w-7 h-7 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">Diya Nair</span>
                <span className="text-[11px] text-slate-400">Roll No: 106</span>
                <div className="w-full bg-amber-100 text-amber-950 font-bold text-xs py-4 rounded-t-lg shadow-sm border-t border-amber-200 mt-2">
                  <div className="text-xl">3rd</div>
                  <div>90.0% Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Roster of top performers */}
          <div className="p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Academic Honours Register</h3>
            <div className="space-y-2">
              {studentMarks.slice(0, 4).map((m, idx) => (
                <div key={m.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-lg text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">{idx + 1}</span>
                    <div>
                      <span className="font-bold text-slate-800">{m.name}</span>
                      <span className="block text-[11px] text-slate-400">Father Name: {m.parentName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 block">Calculated Total: {m.marksObtained}/50</span>
                    <span className="text-[11px] text-indigo-600 font-bold">Grade achieved: {getGradeForMarks(m.marksObtained, 50)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Print Admit Cards / Slips Tabs */}
      {(activeTab === 'admit_cards_particular' || activeTab === 'admit_cards_combined') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('admit_cards_particular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admit_cards_particular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Particular Test
            </button>
            <button
              onClick={() => setActiveTab('admit_cards_combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admit_cards_combined' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Combined Exam
            </button>
          </div>

          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'admit_cards_particular' ? 'Individual Test Admission Passes' : 'Unified Exam Admit Cards'}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Export and print student entrance sheets featuring official QR-Code verification.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Bulk Print {selectedBulkStudents.length} Slips</span>
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selection list */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Selector</h3>
              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {studentMarks.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-150 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBulkStudents.includes(m.rollNo)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBulkStudents([...selectedBulkStudents, m.rollNo]);
                        } else {
                          setSelectedBulkStudents(selectedBulkStudents.filter(r => r !== m.rollNo));
                        }
                      }}
                      className="accent-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{m.name}</span>
                      <span className="text-[10px] text-slate-400">Roll: {m.rollNo}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Visual Admit Card Preview */}
            <div className="lg:col-span-2 bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-3 block">High-Fidelity Paper Print Preview</span>
              
              <div className="bg-white border-2 border-indigo-600 max-w-md w-full p-6 rounded-lg shadow-sm space-y-5 text-slate-800 relative overflow-hidden">
                {/* Header background seal watermark */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.04]">
                  <Award className="w-56 h-56 text-indigo-900" />
                </div>

                <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-indigo-900">AL-FARABI CADET ACADEMY</h4>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Examination Ingress Ticket</span>
                  </div>
                  <div className="p-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[9px] rounded uppercase tracking-wider">
                    Official Pass
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Candidate Name</span>
                      <span className="text-xs font-bold text-slate-800">Zoya Fatima</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Roll / Register Code</span>
                      <span className="text-xs font-bold text-indigo-600">RF-102-M</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Class & Section</span>
                      <span className="text-xs font-bold text-slate-800">Class One - Section A</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border border-slate-200 bg-slate-50 p-2 rounded">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">Verified</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 block">Authorized Entrance Slots:</span>
                  <div className="bg-slate-50 border border-slate-150 rounded p-2.5 space-y-1 text-[10.5px]">
                    <div className="flex justify-between font-bold">
                      <span>Mathematics Quiz 2</span>
                      <span className="text-indigo-600">2026-09-24</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Starting: 09:00 AM | Room Hall A</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-[9px] text-slate-400 font-medium">
                    * Present ticket at gate 15 minutes prior.
                  </div>
                  <div className="text-center">
                    <div className="h-6 w-16 border-b border-indigo-400 mx-auto"></div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block mt-1">Superintendent Seal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Send Marks by SMS Tabs */}
      {(activeTab === 'sms_particular' || activeTab === 'sms_combined') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-2.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('sms_particular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'sms_particular' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Particular Test
            </button>
            <button
              onClick={() => setActiveTab('sms_combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'sms_combined' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              For Combined Result
            </button>
          </div>

          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Dynamic Parental SMS Broadcaster</h2>
            <p className="text-slate-500 text-xs mt-0.5">Send instantaneous outbound results alerts directly to parents via automated mobile networks.</p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Composer Template</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dynamic SMS Body *</label>
                <textarea
                  rows={4}
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Available Template Tags:</span>
                <div>• <code className="text-indigo-600 font-bold">{'{student_name}'}</code> - Candidate full name</div>
                <div>• <code className="text-indigo-600 font-bold">{'{marks_obtained}'}</code> - Score obtained</div>
                <div>• <code className="text-indigo-600 font-bold">{'{total_marks}'}</code> - Maximum marks weight</div>
                <div>• <code className="text-indigo-600 font-bold">{'{percentage}'}</code> - Calculated percent score</div>
                <div>• <code className="text-indigo-600 font-bold">{'{grade}'}</code> - Decided Letter grade</div>
                <div>• <code className="text-indigo-600 font-bold">{'{remarks}'}</code> - Custom teacher notes</div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={smsDeliveryStatus === 'sending'}
                  onClick={triggerSMSBroadcast}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{smsDeliveryStatus === 'sending' ? 'Broadcasting Text Packets...' : 'Send Bulk Results Alert'}</span>
                </button>
              </div>
            </div>

            {/* Live mockup preview */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-3">Outbound Mobile Screen Preview</span>
              <div className="w-64 h-96 bg-slate-900 rounded-[32px] p-3 shadow-lg border-4 border-slate-800 flex flex-col justify-between">
                <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
                <div className="flex-1 bg-slate-950 p-3 rounded-2xl flex flex-col overflow-y-auto justify-end gap-2.5">
                  <span className="text-[9px] text-slate-400 font-semibold text-center mb-auto pt-2">Today, 03:40 PM</span>
                  
                  {/* SMS Bubble */}
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-br-xs text-[10px] space-y-1 shadow-sm leading-relaxed self-end max-w-[90%]">
                    <p>
                      {smsTemplate
                        .replace('{student_name}', 'Zoya Fatima')
                        .replace('{marks_obtained}', '47')
                        .replace('{total_marks}', '50')
                        .replace('{percentage}', '94')
                        .replace('{grade}', 'A+')
                        .replace('{remarks}', 'Top Performer, highly detail-oriented')}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full mx-auto mt-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-slate-900 rounded"></div>
                </div>
              </div>

              {smsDeliveryStatus === 'success' && (
                <div className="mt-4 p-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 text-xs text-center w-full max-w-sm">
                  Successfully broadcasted {sentSMSCount} text alerts to parent cellular contacts!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 11. Print Mark Sheets Tab */}
      {activeTab === 'print_mark_sheets' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Scholastic Progress Reports Card</h2>
              <p className="text-slate-500 text-xs mt-0.5">Select a student roster row to visualize or export the high-fidelity transcript.</p>
            </div>
            <button
              onClick={() => alert('Bulk progress transcripts exported as single unified PDF packet.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Bulk PDF Export</span>
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Roster</h3>
              <div className="space-y-1.5">
                {studentMarks.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveReceipt(m)}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex justify-between items-center ${
                      activeReceipt?.id === m.id 
                        ? 'bg-indigo-50 border-indigo-400 shadow-xs' 
                        : 'bg-white border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{m.name}</span>
                      <span className="text-[10px] text-slate-400">Roll No: {m.rollNo}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeReceipt?.id === m.id ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Print Layout Preview */}
            <div className="lg:col-span-2 bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
              {activeReceipt ? (
                <div className="bg-white border border-slate-300 w-full max-w-lg p-6 rounded-lg shadow-sm space-y-6 text-slate-800 font-sans relative">
                  {/* School Seal Badge */}
                  <div className="absolute right-6 top-6 w-16 h-16 opacity-10">
                    <Award className="w-full h-full text-indigo-900" />
                  </div>

                  <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                    <h3 className="text-lg font-extrabold text-indigo-950">AL-FARABI CADET ACADEMY</h3>
                    <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Official Scholastic progress transcript</p>
                    <p className="text-[9px] text-slate-400 italic">Centralized Campus Board Register</p>
                  </div>

                  {/* Student Details Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 border border-slate-200 rounded">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Candidate Name</span>
                      <span className="font-bold text-slate-800">{activeReceipt.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Roll / Register Code</span>
                      <span className="font-bold text-slate-800">AL-{activeReceipt.rollNo}-A</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Guardian Name</span>
                      <span className="font-bold text-slate-800">{activeReceipt.parentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Class Section Group</span>
                      <span className="font-bold text-indigo-700">{selectedClass} (Section A)</span>
                    </div>
                  </div>

                  {/* Grades Grid Table */}
                  <table className="w-full border-collapse border border-slate-200 text-xs">
                    <thead>
                      <tr className="bg-slate-150 border-b border-slate-200">
                        <th className="p-2 border border-slate-200 text-left">Academic Subject</th>
                        <th className="p-2 border border-slate-200 text-center">Marks Obtained</th>
                        <th className="p-2 border border-slate-200 text-center">Max Marks</th>
                        <th className="p-2 border border-slate-200 text-center">Grade Letter</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-slate-200 font-bold">Mathematics Calculus</td>
                        <td className="p-2 border border-slate-200 text-center font-bold text-indigo-600">{activeReceipt.marksObtained}</td>
                        <td className="p-2 border border-slate-200 text-center">50</td>
                        <td className="p-2 border border-slate-200 text-center font-extrabold">{getGradeForMarks(activeReceipt.marksObtained, 50)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-200 font-bold">English Comprehension</td>
                        <td className="p-2 border border-slate-200 text-center text-slate-600">{Math.round(activeReceipt.marksObtained * 0.9)}</td>
                        <td className="p-2 border border-slate-200 text-center">50</td>
                        <td className="p-2 border border-slate-200 text-center">{getGradeForMarks(Math.round(activeReceipt.marksObtained * 0.9), 50)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-200 font-bold">Physics Unit 1 Mechanics</td>
                        <td className="p-2 border border-slate-200 text-center text-slate-600">{Math.round(activeReceipt.marksObtained * 0.95)}</td>
                        <td className="p-2 border border-slate-200 text-center">50</td>
                        <td className="p-2 border border-slate-200 text-center">{getGradeForMarks(Math.round(activeReceipt.marksObtained * 0.95), 50)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Dynamic Calculation outcomes */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Total Cumulative Score:</span>
                      <span className="text-indigo-600">
                        {activeReceipt.marksObtained + Math.round(activeReceipt.marksObtained * 0.9) + Math.round(activeReceipt.marksObtained * 0.95)} / 150
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-[11px] text-slate-500">
                      <span>Transcript Percentage:</span>
                      <span>{Math.round(((activeReceipt.marksObtained + Math.round(activeReceipt.marksObtained * 0.9) + Math.round(activeReceipt.marksObtained * 0.95)) / 150) * 100)}%</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Teacher Remarks Notes</span>
                    <p className="text-slate-700 italic bg-indigo-50/40 p-2.5 rounded border border-indigo-100/50">
                      &ldquo;{activeReceipt.remarks || 'Diligent effort. Consistent focus shown in exams.'}&rdquo;
                    </p>
                  </div>

                  {/* Signature areas */}
                  <div className="pt-8 flex justify-between items-end text-[10px] font-bold text-slate-400">
                    <div className="text-center w-28">
                      <div className="h-6 border-b border-slate-300"></div>
                      <span className="uppercase block mt-1">Class Teacher</span>
                    </div>
                    <div className="text-center w-28">
                      <div className="h-6 border-b border-indigo-400"></div>
                      <span className="uppercase text-indigo-600 block mt-1">Principal Seal</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <Printer className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Select a student from the register roster left-side to load their formal transcript report.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. Test Reports Tab */}
      {activeTab === 'test_reports' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
            <h2 className="text-lg font-bold text-slate-800">Campus Diagnostic Test Insights</h2>
            <p className="text-slate-500 text-xs mt-0.5">Aggregate performance graphs, success margins, and subject score analytics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class pass rate gage card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Success Margin Rate</span>
                <span className="text-3xl font-extrabold text-indigo-900">83.3% Pass</span>
              </div>
              <div className="my-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '83.3%' }}></div>
              </div>
              <p className="text-slate-500 text-[10.5px]">Percentage of student roster scoring above 20 out of 50 in subject tests.</p>
            </div>

            {/* Total test assessments held */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Total Exams Held</span>
                <span className="text-3xl font-extrabold text-indigo-900">18 Quizzes</span>
              </div>
              <div className="my-4 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>+12% vs last semester cyles</span>
              </div>
              <p className="text-slate-500 text-[10.5px]">Sequential tests blocks verified across all standard school sectors.</p>
            </div>

            {/* Standard grade metrics */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Average Class Mark</span>
                <span className="text-3xl font-extrabold text-indigo-900">37.33 / 50</span>
              </div>
              <div className="my-4 text-xs font-semibold text-slate-500">
                Letter Grade: <span className="text-indigo-600 font-extrabold">A</span>
              </div>
              <p className="text-slate-500 text-[10.5px]">Mean score of Class One Section A Mathematics calculus unit test.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject average score comparisons bar graph */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Subject-Wise Mean Performance Rank</h3>
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics', score: 81, color: 'bg-indigo-600' },
                  { subject: 'English Grammar', score: 76, color: 'bg-amber-500' },
                  { subject: 'Physics Mechanics', score: 72, color: 'bg-emerald-600' },
                  { subject: 'Chemistry Atomic', score: 68, color: 'bg-sky-600' },
                ].map((item) => (
                  <div key={item.subject} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{item.subject}</span>
                      <span>{item.score}% Average</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test distribution report list */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Diagnostic Score Metrics Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                      <th className="p-3">Rank Group</th>
                      <th className="p-3">Obtained Bracket</th>
                      <th className="p-3 text-center">Student Count</th>
                      <th className="p-3 text-right">Roster Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-indigo-600">A+ (Above 90%)</td>
                      <td className="p-3">45 - 50 Marks</td>
                      <td className="p-3 text-center font-semibold">2</td>
                      <td className="p-3 text-right font-bold">33.3%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">A (80% - 89%)</td>
                      <td className="p-3">40 - 44 Marks</td>
                      <td className="p-3 text-center font-semibold">1</td>
                      <td className="p-3 text-right font-bold">16.7%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">B (70% - 79%)</td>
                      <td className="p-3">35 - 39 Marks</td>
                      <td className="p-3 text-center font-semibold">1</td>
                      <td className="p-3 text-right font-bold">16.7%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">C (55% - 69%)</td>
                      <td className="p-3">28 - 34 Marks</td>
                      <td className="p-3 text-center font-semibold">1</td>
                      <td className="p-3 text-right font-bold">16.7%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-rose-600">F (Under 40%)</td>
                      <td className="p-3">0 - 19 Marks</td>
                      <td className="p-3 text-center font-semibold">1</td>
                      <td className="p-3 text-right font-bold text-rose-600">16.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Add Test Modal Popup */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Add Academic Test Record</h3>
              <button
                type="button"
                onClick={() => setShowAddTestModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddTestSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Test 2 Mechanics"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Class</label>
                  <select
                    value={newTest.className}
                    onChange={(e) => setNewTest({ ...newTest, className: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  >
                    <option value="Class One">Class One</option>
                    <option value="Class Two">Class Two</option>
                    <option value="Class Three">Class Three</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Section</label>
                  <select
                    value={newTest.section}
                    onChange={(e) => setNewTest({ ...newTest, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject Area</label>
                <select
                  value={newTest.subject}
                  onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newTest.totalMarks}
                    onChange={(e) => setNewTest({ ...newTest, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={newTest.passingMarks}
                    onChange={(e) => setNewTest({ ...newTest, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Test Date</label>
                  <input
                    type="date"
                    value={newTest.date}
                    onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Operational Status</label>
                  <select
                    value={newTest.status}
                    onChange={(e) => setNewTest({ ...newTest, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-all"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

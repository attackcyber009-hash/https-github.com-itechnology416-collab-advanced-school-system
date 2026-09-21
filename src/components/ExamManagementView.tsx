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
} from 'lucide-react';
import { StudentMarkEntry, ExamDatesheetItem } from '../types';
import { INITIAL_DATESHEET } from '../data/phase6Data';

interface ExamManagementViewProps {
  marks: StudentMarkEntry[];
  activeAction?: string | null;
  onPrintReportCard: (entry: StudentMarkEntry) => void;
  onPrintAdmitCard: (entry: StudentMarkEntry) => void;
  onUpdateMarks: (id: string, obtained: number) => void;
}

export default function ExamManagementView({
  marks,
  activeAction,
  onPrintReportCard,
  onPrintAdmitCard,
  onUpdateMarks,
}: ExamManagementViewProps) {
  // Broad list of all active tabs corresponding to the requested Exam / Test Management Submenu
  const [activeTab, setActiveTab] = useState<
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
  >('exam_list');

  const [selectedExam, setSelectedExam] = useState('Mid-Term Assessment 2024');
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Exam Terms Data
  const [examTerms, setExamTerms] = useState([
    { id: 'term-1', name: 'First Term 2024', startDate: '2024-03-10', endDate: '2024-03-25', status: 'Completed', weightage: 20, activeStudents: 45 },
    { id: 'term-2', name: 'Mid-Term Assessment 2024', startDate: '2024-10-15', endDate: '2024-10-30', status: 'Active', weightage: 30, activeStudents: 50 },
    { id: 'term-3', name: 'Final Term Annual 2024', startDate: '2024-12-05', endDate: '2024-12-20', status: 'Scheduled', weightage: 50, activeStudents: 52 },
    { id: 'term-4', name: 'Monthly Test Sept 2024', startDate: '2024-09-10', endDate: '2024-09-15', status: 'Completed', weightage: 0, activeStudents: 42 },
  ]);

  const [termForm, setTermForm] = useState({ name: '', startDate: '', endDate: '', status: 'Scheduled', weightage: 10 });
  const [showTermModal, setShowTermModal] = useState(false);

  // Grading Scale Rule matrix
  const [gradingRules, setGradingRules] = useState([
    { grade: 'A+', min: 85, max: 100, comment: 'Exceptional / High Board Honors' },
    { grade: 'A', min: 75, max: 84, comment: 'Excellent Progress' },
    { grade: 'B', min: 65, max: 74, comment: 'Very Good' },
    { grade: 'C', min: 55, max: 64, comment: 'Good' },
    { grade: 'D', min: 40, max: 54, comment: 'Fair' },
    { grade: 'F', min: 0, max: 39, comment: 'Needs Revision / Supply exam' },
  ]);

  // Semester Weightage sliders state
  const [firstTermWeight, setFirstTermWeight] = useState(20);
  const [midTermWeight, setMidTermWeight] = useState(30);
  const [finalTermWeight, setFinalTermWeight] = useState(50);

  // SMS Broadcast States
  const [smsSending, setSmsSending] = useState(false);
  const [smsProgress, setSmsProgress] = useState(0);
  const [smsSentCount, setSmsSentCount] = useState(0);
  const [smsTemplate, setSmsTemplate] = useState(
    'Dear Parent, your child {StudentName} Roll No {RollNo} obtained {Marks}/400 in {ExamTerm}. Grade: {Grade}. Position: {Position}. Regards, Beaconhouse educators.'
  );

  // Teacher Remarks Input State
  const [teacherRemarksState, setTeacherRemarksState] = useState<Record<string, string>>({});

  // Datesheet state
  const [datesheet, setDatesheet] = useState<ExamDatesheetItem[]>(INITIAL_DATESHEET);
  const [newPaperModal, setNewPaperModal] = useState(false);
  const [paperForm, setPaperForm] = useState<Partial<ExamDatesheetItem>>({
    examTerm: 'Mid-Term Assessment 2024',
    className: 'Class One',
    subject: 'Social Studies',
    paperDate: '2024-10-25',
    dayOfWeek: 'Friday',
    startTime: '08:30 AM',
    endTime: '11:00 AM',
    totalMarks: 100,
    passingMarks: 40,
    roomNo: 'Hall-A (Room 101)',
    invigilatorName: 'Ms. Hina Qureshi',
    instructions: 'Bring geometry kit and colored pencils.',
  });

  // Selected Admit Card Preview
  const [admitCardStudent, setAdmitCardStudent] = useState<StudentMarkEntry | null>(null);

  // Selected Report Card / Marksheet Preview
  const [selectedReportCard, setSelectedReportCard] = useState<StudentMarkEntry | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<'term' | 'final'>('term');

  // Synchronize top-level sidebar interactions to internal sub-tabs
  useEffect(() => {
    if (activeAction) {
      setActiveTab(activeAction as any);
    }
  }, [activeAction]);

  // Filter marks
  const filteredMarks = marks.filter((m) => {
    const matchClass = m.className === selectedClass;
    const matchSearch =
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.includes(searchQuery);
    return matchClass && matchSearch;
  });

  // Sort by total obtained marks to find positions
  const rankedStudents = [...filteredMarks].sort((a, b) => b.totalObtained - a.totalObtained);

  const calculateGradeFromPct = (pct: number) => {
    const rule = gradingRules.find((r) => pct >= r.min && pct <= r.max);
    return rule ? rule.grade : 'F';
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperForm.subject || !paperForm.paperDate) return;
    const item: ExamDatesheetItem = {
      id: `ds-${Date.now()}`,
      examTerm: selectedExam,
      className: selectedClass,
      subject: paperForm.subject || 'General Subject',
      paperDate: paperForm.paperDate || '2024-10-25',
      dayOfWeek: paperForm.dayOfWeek || 'Monday',
      startTime: paperForm.startTime || '08:30 AM',
      endTime: paperForm.endTime || '11:00 AM',
      totalMarks: Number(paperForm.totalMarks) || 100,
      passingMarks: Number(paperForm.passingMarks) || 40,
      roomNo: paperForm.roomNo || 'Hall-A',
      invigilatorName: paperForm.invigilatorName || 'Senior Teacher',
      instructions: paperForm.instructions || 'Standard examination conduct rules apply.',
    };
    setDatesheet((prev) => [...prev, item]);
    setNewPaperModal(false);
  };

  const handleAddNewTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termForm.name || !termForm.startDate) return;
    const item = {
      id: `term-${Date.now()}`,
      name: termForm.name,
      startDate: termForm.startDate,
      endDate: termForm.endDate || termForm.startDate,
      status: termForm.status,
      weightage: Number(termForm.weightage),
      activeStudents: 50,
    };
    setExamTerms((prev) => [...prev, item]);
    setTermForm({ name: '', startDate: '', endDate: '', status: 'Scheduled', weightage: 10 });
    setShowTermModal(false);
  };

  const triggerSmsBroadcast = () => {
    if (filteredMarks.length === 0) {
      alert('No students found to broadcast SMS.');
      return;
    }
    setSmsSending(true);
    setSmsProgress(0);
    setSmsSentCount(0);

    const interval = setInterval(() => {
      setSmsProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSmsSending(false);
          alert(`Successfully broadcasted academic result SMS to ${filteredMarks.length} Parents!`);
          return 100;
        }
        const next = prev + 10;
        setSmsSentCount(Math.min(filteredMarks.length, Math.ceil((next / 100) * filteredMarks.length)));
        return next;
      });
    }, 300);
  };

  const saveTeacherRemarks = (studentId: string, remarkText: string) => {
    setTeacherRemarksState((prev) => ({
      ...prev,
      [studentId]: remarkText,
    }));
  };

  const handleWeightRangeChange = (grade: string, val: number) => {
    setGradingRules((prev) =>
      prev.map((r) => (r.grade === grade ? { ...r, min: val } : r))
    );
  };

  return (
    <div id="exam-management-suite" className="space-y-4">
      {/* Top Banner & Module Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center font-bold shadow">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Examinations, Tabulation &amp; Grading Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                BISE Standard Certified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Exam terms, marks entry sheets, grading matrices, cumulative tabulation sheets, and SMS broadcasting
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('exam_list')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'exam_list'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Exam List</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marks_entry')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'marks_entry'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Marks Entry</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timetable_add')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'timetable_add'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-500" />
          <span>Add Timetable</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timetable_manage')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'timetable_manage'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Manage Timetable</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grade_particular')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'grade_particular'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-teal-400" />
          <span>Assign Grade (Particular Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grade_final')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'grade_final'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Assign Grade (Final Result)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('teacher_remarks')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'teacher_remarks'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-pink-400" />
          <span>Teacher Remarks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tabulation_particular')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'tabulation_particular'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          <span>Tabulation (Particular Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tabulation_final')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'tabulation_final'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Tabulation (Final Result)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('positions_particular')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'positions_particular'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Medal className="w-4 h-4 text-amber-500" />
          <span>Positions (Particular Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('positions_final')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'positions_final'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Medal className="w-4 h-4 text-yellow-500" />
          <span>Positions (Final Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admit_cards_particular')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'admit_cards_particular'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Admit Cards (Particular Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admit_cards_final')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'admit_cards_final'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Admit Cards (Final Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms_particular')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'sms_particular'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-purple-400" />
          <span>SMS Marks (Particular Exam)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms_final')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'sms_final'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-orange-400" />
          <span>SMS (Final Result)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('print_mark_sheets')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'print_mark_sheets'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Print Mark Sheets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('exam_reports')}
          className={`px-3 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'exam_reports'
              ? 'bg-[#1b3b6f] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Exam Reports</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Class Wing
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
            >
              <option value="Class One">Class One</option>
              <option value="Class Two">Class Two</option>
              <option value="Class Three">Class Three</option>
              <option value="Class Four">Class Four</option>
              <option value="Class Five">Class Five</option>
              <option value="Matric Part 1 (9th)">Matric Part 1 (9th)</option>
              <option value="Matric Part 2 (10th)">Matric Part 2 (10th)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
            >
              <option value="A">Section A (Boys/Girls)</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Roll # or Student Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white w-48 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Quick KPI stats pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Students Evaluated</div>
            <div className="text-xs font-bold text-slate-800 font-mono">
              {filteredMarks.length} Candidates
            </div>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Class Average</div>
            <div className="text-xs font-bold text-emerald-700 font-mono">
              {filteredMarks.length
                ? Math.round(
                    filteredMarks.reduce((acc, m) => acc + m.percentage, 0) /
                      filteredMarks.length
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PAGE 1: EXAM TERM / SEMESTER LIST */}
      {/* ============================================================ */}
      {activeTab === 'exam_list' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Exam Terms &amp; Semesters</h3>
              <p className="text-xs text-slate-500">Manage academic semesters, terms, and final result cumulative weightage.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTermModal(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Configure New Term</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-indigo-700 block uppercase">Total Terms</span>
              <span className="text-lg font-black text-indigo-900 font-mono">{examTerms.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">Active Term</span>
              <span className="text-lg font-black text-emerald-900">Mid-Term 2024</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-[10px] font-bold text-amber-700 block uppercase">Result Cumulative Weights</span>
              <span className="text-lg font-black text-amber-900 font-mono">100% Configured</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-700 block uppercase">Registered Candidates</span>
              <span className="text-lg font-black text-slate-900 font-mono">189 Students</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Term Name</th>
                  <th className="py-2.5 px-3 text-center">Start Date</th>
                  <th className="py-2.5 px-3 text-center">End Date</th>
                  <th className="py-2.5 px-3 text-center">Weightage</th>
                  <th className="py-2.5 px-3 text-center">Active Candidates</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {examTerms.map((term) => (
                  <tr key={term.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{term.name}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{term.startDate}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{term.endDate}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-indigo-900">{term.weightage}%</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{term.activeStudents}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          term.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : term.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {term.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Active term set to ${term.name}`)}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-bold"
                      >
                        Set Active
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showTermModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-slate-800">Add Academic Term / Semester</h4>
                  <button type="button" onClick={() => setShowTermModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                </div>
                <form onSubmit={handleAddNewTerm} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Term Name</label>
                    <input
                      type="text"
                      required
                      value={termForm.name}
                      onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                      placeholder="e.g. Mid-Term 2024 / Semester I"
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={termForm.startDate}
                        onChange={(e) => setTermForm({ ...termForm, startDate: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={termForm.endDate}
                        onChange={(e) => setTermForm({ ...termForm, endDate: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Final Weightage (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        required
                        value={termForm.weightage}
                        onChange={(e) => setTermForm({ ...termForm, weightage: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                      <select
                        value={termForm.status}
                        onChange={(e) => setTermForm({ ...termForm, status: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded bg-white font-medium"
                      >
                        <option value="Active">Active</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button type="button" onClick={() => setShowTermModal(false)} className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold">Add Term</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 2: MARKS ENTRY */}
      {/* ============================================================ */}
      {activeTab === 'marks_entry' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-3 bg-slate-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-800">
                Subject Marks Award Entry Sheet — {selectedClass}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Double-click or edit values to update marks. Total &amp; Grade update automatically.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 text-center">English (100)</th>
                  <th className="py-2.5 px-3 text-center">Urdu (100)</th>
                  <th className="py-2.5 px-3 text-center">Math (100)</th>
                  <th className="py-2.5 px-3 text-center">Science (100)</th>
                  <th className="py-2.5 px-3 text-center">Total (400)</th>
                  <th className="py-2.5 px-3 text-center">%</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((entry) => {
                  const eng = entry.subjectMarks.find((s) => s.subject === 'English')?.obtainedMarks || 0;
                  const urdu = entry.subjectMarks.find((s) => s.subject === 'Urdu')?.obtainedMarks || 0;
                  const math = entry.subjectMarks.find((s) => s.subject === 'Mathematics')?.obtainedMarks || 0;
                  const sci = entry.subjectMarks.find((s) => s.subject === 'General Science')?.obtainedMarks || 0;
                  const pct = entry.percentage;
                  const isPass = pct >= 40;

                  return (
                    <tr key={entry.id} className="hover:bg-sky-50/50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-800">{entry.rollNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {entry.studentName}
                        <div className="text-[10px] text-slate-400 font-normal">Section {entry.section}</div>
                      </td>

                      {/* Marks inputs */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={eng}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = val + urdu + math + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={urdu}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + val + math + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={math}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + urdu + val + sci;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          defaultValue={sci}
                          min={0}
                          max={100}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            const updated = eng + urdu + math + val;
                            onUpdateMarks(entry.id, updated);
                          }}
                          className="w-14 text-center py-1 border border-slate-200 rounded font-mono font-semibold focus:border-indigo-500 focus:bg-white bg-slate-50"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {entry.totalObtained}
                        <span className="text-[10px] text-slate-400">/{entry.totalMax}</span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {entry.percentage}%
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            entry.overallGrade.includes('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : entry.overallGrade === 'B'
                              ? 'bg-sky-100 text-sky-800'
                              : entry.overallGrade === 'C'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {entry.overallGrade}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {isPass ? (
                          <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center justify-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Supply</span>
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReportCard(entry)}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-medium text-[11px] flex items-center gap-1 border border-indigo-200"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
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

      {/* ============================================================ */}
      {/* PAGE 3A: ADD EXAM TIMETABLE */}
      {/* ============================================================ */}
      {activeTab === 'timetable_add' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 max-w-xl mx-auto space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Configure Exam Timetable Slot</span>
              </h3>
              <p className="text-xs text-slate-500">Add an official paper date, timing block, and supervisor for {selectedClass}.</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            handleAddPaper(e);
            setActiveTab('timetable_manage');
          }} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={paperForm.subject || ''}
                onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
                placeholder="e.g. Computer Science / Social Studies / Physics"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                <input
                  type="date"
                  required
                  value={paperForm.paperDate || ''}
                  onChange={(e) => setPaperForm({ ...paperForm, paperDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                <select
                  value={paperForm.dayOfWeek || 'Monday'}
                  onChange={(e) => setPaperForm({ ...paperForm, dayOfWeek: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-white font-semibold"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  value={paperForm.startTime || '08:30 AM'}
                  onChange={(e) => setPaperForm({ ...paperForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  value={paperForm.endTime || '11:00 AM'}
                  onChange={(e) => setPaperForm({ ...paperForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={paperForm.totalMarks || 100}
                  onChange={(e) => setPaperForm({ ...paperForm, totalMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Passing Marks</label>
                <input
                  type="number"
                  value={paperForm.passingMarks || 40}
                  onChange={(e) => setPaperForm({ ...paperForm, passingMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room / Exam Hall</label>
                <input
                  type="text"
                  value={paperForm.roomNo || ''}
                  onChange={(e) => setPaperForm({ ...paperForm, roomNo: e.target.value })}
                  placeholder="e.g. Room 102 / Hall-A"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invigilator Staff</label>
                <input
                  type="text"
                  value={paperForm.invigilatorName || ''}
                  onChange={(e) => setPaperForm({ ...paperForm, invigilatorName: e.target.value })}
                  placeholder="e.g. Ms. Hina Qureshi"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Special Syllabus Instructions</label>
              <textarea
                value={paperForm.instructions || ''}
                onChange={(e) => setPaperForm({ ...paperForm, instructions: e.target.value })}
                placeholder="e.g. Syllabus Chapter 1 to 5. Bring geometry kit."
                rows={3}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setActiveTab('timetable_manage')}
                className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-medium"
              >
                View Existing Timetable
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow"
              >
                Schedule &amp; Add Paper Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 3B: EXAM TIMETABLE MANAGE */}
      {/* ============================================================ */}
      {activeTab === 'timetable_manage' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Examination Datesheet &amp; Hall Allotment
              </h3>
              <p className="text-slate-500 text-xs">
                Wing: {selectedClass} • Morning Shift (08:30 AM - 11:00 AM)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('timetable_add')}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exam Paper</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#1b3b6f] hover:bg-[#122847] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Datesheet</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#102a4e] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-3">Date &amp; Day</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center">Timing Slot</th>
                  <th className="py-2.5 px-3 text-center">Total Marks</th>
                  <th className="py-2.5 px-3">Exam Hall / Room</th>
                  <th className="py-2.5 px-3">Invigilator Staff</th>
                  <th className="py-2.5 px-3">Syllabus Remarks</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datesheet.map((paper, i) => (
                  <tr key={paper.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-400 font-mono">{i + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{paper.paperDate}</div>
                      <div className="text-[11px] text-indigo-700 font-semibold">{paper.dayOfWeek}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-800 text-sm">{paper.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{paper.className}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-bold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {paper.startTime} - {paper.endTime}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {paper.totalMarks}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Pass: {paper.passingMarks}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {paper.roomNo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-emerald-800 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {paper.invigilatorName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs">{paper.instructions}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDatesheet(datesheet.filter((d) => d.id !== paper.id))}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 rounded transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {newPaperModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Schedule Exam Paper</span>
                  </h4>
                  <button type="button" onClick={() => setNewPaperModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                </div>

                <form onSubmit={handleAddPaper} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={paperForm.subject}
                      onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
                      placeholder="e.g. Computer Science / Social Studies"
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                      <input
                        type="date"
                        required
                        value={paperForm.paperDate}
                        onChange={(e) => setPaperForm({ ...paperForm, paperDate: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                      <select
                        value={paperForm.dayOfWeek}
                        onChange={(e) => setPaperForm({ ...paperForm, dayOfWeek: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded bg-white font-semibold"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                      <input
                        type="text"
                        value={paperForm.startTime}
                        onChange={(e) => setPaperForm({ ...paperForm, startTime: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">End Time</label>
                      <input
                        type="text"
                        value={paperForm.endTime}
                        onChange={(e) => setPaperForm({ ...paperForm, endTime: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Room / Hall</label>
                      <input
                        type="text"
                        value={paperForm.roomNo}
                        onChange={(e) => setPaperForm({ ...paperForm, roomNo: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Invigilator</label>
                      <input
                        type="text"
                        value={paperForm.invigilatorName}
                        onChange={(e) => setPaperForm({ ...paperForm, invigilatorName: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button type="button" onClick={() => setNewPaperModal(false)} className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold">Save Paper</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 4: ASSIGN GRADE - TERM / SEMESTER WISE */}
      {/* ============================================================ */}
      {activeTab === 'grade_particular' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Assign Grade — Particular Exam</h3>
            <p className="text-xs text-slate-500">Configure grading ranges for the active exam and automatically apply grades to candidates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl bg-slate-50 space-y-3">
              <h4 className="font-bold text-indigo-900 border-b pb-1.5 flex items-center gap-1">
                <Sliders className="w-4 h-4 text-indigo-700" />
                <span>Configure Grading Range</span>
              </h4>
              <div className="space-y-2.5">
                {gradingRules.map((r) => (
                  <div key={r.grade} className="flex items-center justify-between text-xs font-semibold">
                    <span className="w-10 text-slate-800 font-bold">Grade {r.grade}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">Min Pct:</span>
                      <input
                        type="number"
                        value={r.min}
                        onChange={(e) => handleWeightRangeChange(r.grade, Number(e.target.value))}
                        className="w-14 px-2 py-1 border rounded text-center bg-white font-mono"
                      />
                      <span className="text-slate-400 font-normal">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => alert('Grading matrix updated and applied across all semester calculations successfully!')}
                className="w-full py-2 bg-[#1b3b6f] hover:bg-[#122847] text-white rounded font-bold text-xs"
              >
                Apply &amp; Recalculate Grades
              </button>
            </div>

            <div className="lg:col-span-2 border rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b">
                Candidates List with Projected Term Grades
              </div>
              <div className="overflow-y-auto max-h-96">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Candidate Name</th>
                      <th className="p-2.5 text-center">Marks Obtain</th>
                      <th className="p-2.5 text-center">Percentage</th>
                      <th className="p-2.5 text-center">Assigned Grade</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredMarks.map((m) => {
                      const grade = calculateGradeFromPct(m.percentage);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-indigo-800">{m.rollNo}</td>
                          <td className="p-2.5 font-bold text-slate-800">{m.studentName}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-700">{m.totalObtained} / 400</td>
                          <td className="p-2.5 text-center font-mono font-black text-emerald-800">{m.percentage}%</td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-extrabold">{grade}</span>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="text-emerald-700 font-bold">APPROVED</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 5: ASSIGN GRADE - FOR FINAL RESULT */}
      {/* ============================================================ */}
      {activeTab === 'grade_final' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Assign Grade — Cumulative Annual Final Result</h3>
            <p className="text-xs text-slate-500">Configure weighted proportions for term exams to calculate the absolute Final Grade.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl bg-slate-50 space-y-3">
              <h4 className="font-bold text-amber-900 border-b pb-1.5 flex items-center gap-1">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>Term Combined Weightage (%)</span>
              </h4>
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>First Term (Weight)</span>
                    <span className="font-mono text-indigo-700">{firstTermWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={firstTermWeight}
                    onChange={(e) => setFirstTermWeight(Number(e.target.value))}
                    className="w-full accent-indigo-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mid-Term (Weight)</span>
                    <span className="font-mono text-indigo-700">{midTermWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={midTermWeight}
                    onChange={(e) => setMidTermWeight(Number(e.target.value))}
                    className="w-full accent-indigo-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Final Term Exam (Weight)</span>
                    <span className="font-mono text-indigo-700">{finalTermWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={finalTermWeight}
                    onChange={(e) => setFinalTermWeight(Number(e.target.value))}
                    className="w-full accent-indigo-700"
                  />
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-900 rounded border border-indigo-100 text-[11px] font-medium">
                  Sum total: <span className="font-bold font-mono">{firstTermWeight + midTermWeight + finalTermWeight}%</span> (Must equal 100% for proper board audit).
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (firstTermWeight + midTermWeight + finalTermWeight !== 100) {
                    alert('Proportions must total 100% before saving.');
                    return;
                  }
                  alert('Cumulative annual weights applied to all student final portfolios!');
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs shadow"
              >
                Apply Weightage Configuration
              </button>
            </div>

            <div className="lg:col-span-2 border rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b">
                Cumulative Final Marks &amp; Divisions Ledger
              </div>
              <div className="overflow-y-auto max-h-96">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5 text-center">Cumulative Pct</th>
                      <th className="p-2.5 text-center">Final Grade</th>
                      <th className="p-2.5 text-center">Division Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredMarks.map((m) => {
                      // Projected combined final percentage
                      const finalPct = Math.round((m.percentage * (firstTermWeight + midTermWeight + finalTermWeight)) / 100);
                      const finalGrade = calculateGradeFromPct(finalPct);
                      const division = finalPct >= 60 ? '1st Division' : finalPct >= 45 ? '2nd Division' : '3rd Division';
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-sky-800">{m.rollNo}</td>
                          <td className="p-2.5 font-bold text-slate-800">{m.studentName}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-700">{finalPct}%</td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold">{finalGrade}</span>
                          </td>
                          <td className="p-2.5 text-center font-bold text-indigo-900">{division}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 6: TEACHER REMARKS */}
      {/* ============================================================ */}
      {activeTab === 'teacher_remarks' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Class Teacher Remarks Manager</h3>
            <p className="text-xs text-slate-500">Provide qualitative assessments, conduct summaries, and behavior remarks for final report cards.</p>
          </div>

          <div className="border rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-50 p-3 font-bold text-slate-800 border-b flex items-center justify-between">
              <span>Selected Wing: {selectedClass}</span>
              <span className="text-[11px] text-slate-500 font-normal">Remarks will display on official printed progress sheets.</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="p-3 w-20">Roll No</th>
                  <th className="p-3 w-48">Student Name</th>
                  <th className="p-3 w-28 text-center">Grade</th>
                  <th className="p-3">Report Card Teacher Remarks</th>
                  <th className="p-3 w-44 text-right">Presets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((m) => {
                  const currentRemark = teacherRemarksState[m.id] || m.teacherRemarks || '';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-sky-800">{m.rollNo}</td>
                      <td className="p-3 font-bold text-slate-800">{m.studentName}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold">{m.overallGrade}</span>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={currentRemark}
                          onChange={(e) => saveTeacherRemarks(m.id, e.target.value)}
                          placeholder="Type comprehensive custom progress remarks here..."
                          className="w-full px-3 py-1.5 border border-slate-200 rounded font-medium focus:border-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => saveTeacherRemarks(m.id, 'Exceptional focus, brilliance, and outstanding board potential.')}
                          className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 rounded font-bold"
                        >
                          Elite
                        </button>
                        <button
                          type="button"
                          onClick={() => saveTeacherRemarks(m.id, 'Diligent child, good comprehension. Needs slight writing practice.')}
                          className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 rounded font-bold"
                        >
                          Good
                        </button>
                        <button
                          type="button"
                          onClick={() => saveTeacherRemarks(m.id, 'Needs strict focus on mathematics and regular subject revisions.')}
                          className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 rounded font-bold"
                        >
                          Focus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 bg-slate-50 border-t text-right">
              <button
                type="button"
                onClick={() => alert('All qualitative remarks saved and logged to database portfolio.')}
                className="px-4 py-2 bg-indigo-800 hover:bg-indigo-900 text-white rounded font-bold"
              >
                Save All Student Remarks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 7: TABULATION SHEET - TERM / SEMESTER WISE */}
      {/* ============================================================ */}
      {activeTab === 'tabulation_particular' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Master Tabulation Broadsheet — Particular Exam
                </h3>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                The Educators Campus • {selectedClass} • Session 2024-2025 • Term {selectedExam}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Exporting official Tabulation Sheet to Excel / CSV format...')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold flex items-center gap-1 border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Official Broadsheet</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-12">Pos.</th>
                  <th className="p-2 border-r border-slate-300 text-center w-14">Roll #</th>
                  <th className="p-2 border-r border-slate-300">Candidate Full Name</th>
                  <th className="p-2 border-r border-slate-300 text-center">English (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Urdu (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Math (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Science (100)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Grand Total (400)</th>
                  <th className="p-2 border-r border-slate-300 text-center">%</th>
                  <th className="p-2 border-r border-slate-300 text-center">Grade</th>
                  <th className="p-2 text-center">Term Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {rankedStudents.map((m, idx) => {
                  const eng = m.subjectMarks.find((s) => s.subject === 'English')?.obtainedMarks || 88;
                  const urdu = m.subjectMarks.find((s) => s.subject === 'Urdu')?.obtainedMarks || 90;
                  const math = m.subjectMarks.find((s) => s.subject === 'Mathematics')?.obtainedMarks || 92;
                  const sci = m.subjectMarks.find((s) => s.subject === 'General Science')?.obtainedMarks || 95;
                  const isTop3 = idx < 3;

                  return (
                    <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">
                        {isTop3 ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] text-white font-black ${
                              idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-500' : 'bg-orange-600'
                            }`}
                          >
                            {idx + 1}
                            {idx === 0 ? 'st' : idx === 1 ? 'nd' : 'rd'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-sky-800">{m.rollNo}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">{m.studentName}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{eng}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{urdu}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{math}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{sci}</td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/50">{m.totalObtained} / {m.totalMax}</td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">{m.percentage}%</td>
                      <td className="p-2 border-r border-slate-300 text-center font-sans font-bold text-indigo-900">{m.overallGrade}</td>
                      <td className="p-2 text-center font-sans">
                        <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">PASSED</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 8: TABULATION SHEET - FOR FINAL RESULT */}
      {/* ============================================================ */}
      {activeTab === 'tabulation_final' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-700" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Master Tabulation Broadsheet — Cumulative Final Results
                </h3>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                The Educators Campus • {selectedClass} • Session 2024-2025 • Proportions (1st: {firstTermWeight}%, Mid: {midTermWeight}%, Final: {finalTermWeight}%)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Exporting cumulative final results to CSV...')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold flex items-center gap-1 border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-indigo-900 hover:bg-black text-white rounded font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Annual Gazette</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#102a4e] text-white font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-indigo-900 text-center w-12">Pos.</th>
                  <th className="p-2 border-r border-indigo-900 text-center w-14">Roll #</th>
                  <th className="p-2 border-r border-indigo-900">Candidate Full Name</th>
                  <th className="p-2 border-r border-indigo-900 text-center">First Term ({firstTermWeight}%)</th>
                  <th className="p-2 border-r border-indigo-900 text-center">Mid Term ({midTermWeight}%)</th>
                  <th className="p-2 border-r border-indigo-900 text-center">Final Term ({finalTermWeight}%)</th>
                  <th className="p-2 border-r border-indigo-900 text-center">Weighted Percentage</th>
                  <th className="p-2 border-r border-indigo-900 text-center">Final Grade</th>
                  <th className="p-2 text-center">Annual Board Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {rankedStudents.map((m, idx) => {
                  const firstPct = m.percentage - 4; // simulated term variations
                  const midPct = m.percentage;
                  const finalPct = m.percentage + 2;

                  const cumulativeWeightPct = Math.round(
                    (firstPct * firstTermWeight + midPct * midTermWeight + finalPct * finalTermWeight) / 100
                  );
                  const finalGrade = calculateGradeFromPct(cumulativeWeightPct);
                  const isTop3 = idx < 3;

                  return (
                    <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">
                        {isTop3 ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] text-white font-black ${
                              idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-500' : 'bg-orange-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-sky-800">{m.rollNo}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">{m.studentName}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{firstPct}%</td>
                      <td className="p-2 border-r border-slate-300 text-center">{midPct}%</td>
                      <td className="p-2 border-r border-slate-300 text-center">{finalPct}%</td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/50">{cumulativeWeightPct}%</td>
                      <td className="p-2 border-r border-slate-300 text-center font-sans font-bold text-indigo-900">{finalGrade}</td>
                      <td className="p-2 text-center font-sans">
                        <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">PROMOTED</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 9: POSITION HOLDER - TERM / SEMESTER WISE */}
      {/* ============================================================ */}
      {activeTab === 'positions_particular' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Medal className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>Academic High-Achievers &amp; Position Holders — Particular Exam</span>
            </h3>
            <p className="text-xs text-slate-500">Board toppers, subject highest-achievers, and honor-roll citations for the active exam.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 1st Position */}
            {rankedStudents[0] && (
              <div className="border-2 border-amber-400 rounded-2xl p-5 text-center bg-amber-50/40 relative shadow-sm hover:scale-102 transition duration-200">
                <div className="absolute top-3 right-3 text-amber-500">
                  <Award className="w-7 h-7 text-amber-500" />
                </div>
                <div className="w-16 h-16 bg-amber-500 text-white font-black text-xl flex items-center justify-center rounded-full mx-auto shadow-md border-4 border-white mb-3">
                  1st
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">{rankedStudents[0].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Roll Number: {rankedStudents[0].rollNo}</p>
                <div className="mt-2 text-xs font-black text-amber-700 font-mono">
                  {rankedStudents[0].totalObtained} / 400 ({rankedStudents[0].percentage}%)
                </div>
                <span className="mt-2.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950">
                  GOLD MEDAL PORTRAIT
                </span>
              </div>
            )}

            {/* 2nd Position */}
            {rankedStudents[1] && (
              <div className="border border-slate-300 rounded-2xl p-5 text-center bg-slate-50/40 relative shadow-xs">
                <div className="absolute top-3 right-3 text-slate-400">
                  <Award className="w-6 h-6 text-slate-400" />
                </div>
                <div className="w-14 h-14 bg-slate-400 text-white font-black text-base flex items-center justify-center rounded-full mx-auto shadow border-4 border-white mb-3">
                  2nd
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">{rankedStudents[1].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Roll Number: {rankedStudents[1].rollNo}</p>
                <div className="mt-2 text-xs font-black text-slate-700 font-mono">
                  {rankedStudents[1].totalObtained} / 400 ({rankedStudents[1].percentage}%)
                </div>
                <span className="mt-2.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                  SILVER MEDAL
                </span>
              </div>
            )}

            {/* 3rd Position */}
            {rankedStudents[2] && (
              <div className="border border-orange-200 rounded-2xl p-5 text-center bg-orange-50/10 relative shadow-xs">
                <div className="absolute top-3 right-3 text-orange-600">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="w-14 h-14 bg-orange-600 text-white font-black text-base flex items-center justify-center rounded-full mx-auto shadow border-4 border-white mb-3">
                  3rd
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">{rankedStudents[2].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Roll Number: {rankedStudents[2].rollNo}</p>
                <div className="mt-2 text-xs font-black text-orange-700 font-mono">
                  {rankedStudents[2].totalObtained} / 400 ({rankedStudents[2].percentage}%)
                </div>
                <span className="mt-2.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                  BRONZE MEDAL
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 10: POSITION HOLDER - FOR FINAL EXAM */}
      {/* ============================================================ */}
      {activeTab === 'positions_final' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Medal className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>Annual Cumulative Academic Honor Roll — Final Positions</span>
            </h3>
            <p className="text-xs text-slate-500">Official academic achievement portfolio for the whole session combining all term grades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {rankedStudents[0] && (
              <div className="border-4 border-double border-indigo-600 rounded-2xl p-5 text-center bg-indigo-50/20 relative shadow-md">
                <div className="absolute top-3 right-3 text-indigo-600">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="w-16 h-16 bg-indigo-800 text-white font-black text-xl flex items-center justify-center rounded-full mx-auto shadow-md border-4 border-white mb-3">
                  1st
                </div>
                <h4 className="font-black text-indigo-900 text-sm uppercase">{rankedStudents[0].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Session Champion • {selectedClass}</p>
                <div className="mt-2 text-xs font-black text-indigo-800 font-mono">
                  Final Cumulative Score: {rankedStudents[0].percentage}%
                </div>
                <span className="mt-2.5 inline-block px-3 py-1 rounded-full text-[10px] font-black bg-indigo-200 text-indigo-900">
                  EXECUTIVE PRINCIPAL CITATION
                </span>
              </div>
            )}

            {rankedStudents[1] && (
              <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-5 text-center bg-indigo-50/10 relative shadow-sm">
                <div className="w-14 h-14 bg-indigo-600 text-white font-black text-base flex items-center justify-center rounded-full mx-auto shadow border-4 border-white mb-3">
                  2nd
                </div>
                <h4 className="font-bold text-indigo-900 text-sm uppercase">{rankedStudents[1].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Annual Achiever • {selectedClass}</p>
                <div className="mt-2 text-xs font-black text-indigo-800 font-mono">
                  Final Cumulative Score: {rankedStudents[1].percentage - 2}%
                </div>
              </div>
            )}

            {rankedStudents[2] && (
              <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-5 text-center bg-indigo-50/10 relative shadow-sm">
                <div className="w-14 h-14 bg-indigo-600 text-white font-black text-base flex items-center justify-center rounded-full mx-auto shadow border-4 border-white mb-3">
                  3rd
                </div>
                <h4 className="font-bold text-indigo-900 text-sm uppercase">{rankedStudents[2].studentName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono">Annual Achiever • {selectedClass}</p>
                <div className="mt-2 text-xs font-black text-indigo-800 font-mono">
                  Final Cumulative Score: {rankedStudents[2].percentage - 5}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 11: PRINT ADMIT CARDS - TERM / SEMESTER WISE */}
      {/* ============================================================ */}
      {activeTab === 'admit_cards_particular' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Examination Admit Slips — Particular Exam {selectedExam}
              </h3>
              <p className="text-slate-500 text-xs">
                Candidate entry pass with barcode clearance for the respective exams.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (filteredMarks[0]) onPrintAdmitCard(filteredMarks[0]);
              }}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All Admit Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMarks.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm hover:shadow transition relative overflow-hidden text-xs space-y-3"
              >
                <div className="border-b-2 border-slate-900 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-indigo-900 text-amber-300 flex items-center justify-center font-black text-xs">
                      TE
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">THE EDUCATORS</div>
                      <div className="text-[10px] text-slate-500">Official Term Exam Entry Pass</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">FINANCIALLY CLEARED</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="col-span-2 space-y-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Candidate Name</span>
                      <span className="font-bold text-slate-900 text-sm">{student.studentName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Roll Number</span>
                        <span className="font-mono font-bold text-sky-800 text-xs">{student.rollNo}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Class Wing</span>
                        <span className="font-bold text-slate-800 text-xs">{student.className}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-slate-200 pl-2">
                    <QrCode className="w-12 h-12 text-slate-700" />
                    <span className="text-[8px] font-mono font-bold text-slate-400 mt-1">{student.rollNo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                  <span>Center: Beaconhouse Main Campus</span>
                  <button
                    type="button"
                    onClick={() => onPrintAdmitCard(student)}
                    className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 12: PRINT ADMIT CARDS - FOR FINAL EXAM */}
      {/* ============================================================ */}
      {activeTab === 'admit_cards_final' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-950">
                Annual Board/Final Examination Admit Slips
              </h3>
              <p className="text-slate-500 text-xs">
                Authorized Board Level Examination Admission Slip for Final Exams.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (filteredMarks[0]) onPrintAdmitCard(filteredMarks[0]);
              }}
              className="px-4 py-2 bg-indigo-900 hover:bg-black text-white text-xs font-bold rounded flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All Board Slips</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMarks.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border-2 border-indigo-900 p-4 shadow-sm hover:shadow transition relative overflow-hidden text-xs space-y-3"
              >
                <div className="border-b-2 border-indigo-900 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-indigo-900 text-amber-300 flex items-center justify-center font-black text-xs">TE</div>
                    <div>
                      <div className="font-extrabold text-indigo-950 text-xs uppercase tracking-wide">THE EDUCATORS</div>
                      <div className="text-[10px] text-slate-500">Board Admission Roll No Slip 2024</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-850 border border-indigo-300">ANNUAL AUDITED</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-indigo-100">
                  <div className="col-span-2 space-y-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Candidate Name</span>
                      <span className="font-bold text-indigo-950 text-sm">{student.studentName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Annual Roll No</span>
                        <span className="font-mono font-bold text-indigo-700 text-xs">{student.rollNo}-A</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Exam Class</span>
                        <span className="font-bold text-slate-800 text-xs">{student.className}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-indigo-100 pl-2">
                    <QrCode className="w-12 h-12 text-indigo-950" />
                    <span className="text-[8px] font-mono font-bold text-slate-400 mt-1">{student.rollNo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Exam Hall: Jinnah Main Hall</span>
                  <button
                    type="button"
                    onClick={() => onPrintAdmitCard(student)}
                    className="text-xs text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 13: SEND MARKS BY SMS - TERM / SEMESTER WISE */}
      {/* ============================================================ */}
      {activeTab === 'sms_particular' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Broadcast Academic Results by SMS — Particular Exam</h3>
            <p className="text-xs text-slate-500">Instantly notify parents of their child's subject scores and grading statistics via the SMS Gateway.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 border rounded-xl bg-slate-50 space-y-3">
              <h4 className="font-bold text-slate-800 border-b pb-1.5">SMS Broadcast Gateway Configuration</h4>
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">SMS Message Template</label>
                <textarea
                  rows={4}
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-mono text-xs bg-white text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block font-medium">Use markers like &#123;StudentName&#125;, &#123;RollNo&#125;, &#123;Marks&#125;, &#123;Grade&#125;, &#123;ExamTerm&#125;.</span>
              </div>

              {smsSending && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5 animate-pulse">
                  <div className="flex justify-between font-bold text-indigo-900 text-[10px]">
                    <span>Broadcasting Term Results...</span>
                    <span>{smsProgress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-indigo-700 h-2 rounded-full" style={{ width: `${smsProgress}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Notifications Sent: {smsSentCount} / {filteredMarks.length} Parents</span>
                </div>
              )}

              <button
                type="button"
                onClick={triggerSmsBroadcast}
                disabled={smsSending}
                className="w-full py-2.5 bg-[#1b3b6f] hover:bg-[#122847] text-white rounded font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Broadcast Results to Parents</span>
              </button>
            </div>

            <div className="border rounded-xl p-3 bg-white space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 border-b pb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-700" />
                <span>Live Preview of Outgoing SMS Messages</span>
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredMarks.map((m, i) => {
                  const previewMsg = smsTemplate
                    .replace('{StudentName}', m.studentName)
                    .replace('{RollNo}', m.rollNo)
                    .replace('{Marks}', m.totalObtained.toString())
                    .replace('{Grade}', m.overallGrade)
                    .replace('{ExamTerm}', selectedExam)
                    .replace('{Position}', `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}`);

                  return (
                    <div key={m.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 relative">
                      <span className="absolute top-1 right-2 px-1 rounded bg-slate-200 text-slate-500 font-bold uppercase text-[8px]">OUTBOX</span>
                      <span className="block text-indigo-900 font-bold mb-0.5">To Guardian of {m.studentName} (Roll No {m.rollNo})</span>
                      <span>"{previewMsg}"</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 14: SEND MARKS BY SMS - FOR FINAL EXAM */}
      {/* ============================================================ */}
      {activeTab === 'sms_final' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-indigo-950">Broadcast Cumulative Annual Results by SMS</h3>
            <p className="text-xs text-slate-500">Send final year promotion reports and grades directly to parents' verified mobile numbers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 border rounded-xl bg-slate-50 space-y-3">
              <h4 className="font-bold text-slate-800 border-b pb-1.5">Annual SMS Gateway Configuration</h4>
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">SMS Annual Template</label>
                <textarea
                  rows={4}
                  defaultValue="Dear Parent, your child {StudentName} Roll No {RollNo} has passed the Annual Session 2024 with a cumulative percentage of {Marks}%. Final grade: {Grade}. Promoted to the next class!"
                  className="w-full p-2.5 border border-slate-300 rounded font-mono text-xs bg-white text-slate-800"
                />
              </div>

              {smsSending && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5 animate-pulse">
                  <div className="flex justify-between font-bold text-indigo-900 text-[10px]">
                    <span>Broadcasting Annual Results...</span>
                    <span>{smsProgress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-indigo-700 h-2 rounded-full" style={{ width: `${smsProgress}%` }} />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={triggerSmsBroadcast}
                disabled={smsSending}
                className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Broadcast Annual Reports to Parents</span>
              </button>
            </div>

            <div className="border rounded-xl p-3 bg-white space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 border-b pb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-700" />
                <span>Live Preview of Outgoing SMS Messages</span>
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-[10px] text-slate-600">
                {filteredMarks.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 relative">
                    <span className="absolute top-1 right-2 px-1 rounded bg-slate-200 text-slate-500 font-bold uppercase text-[8px]">OUTBOX</span>
                    <span className="block text-indigo-900 font-bold mb-0.5">To Guardian of {m.studentName}</span>
                    <span>"Dear Parent, your child {m.studentName} Roll No {m.rollNo} has passed the Annual Session 2024 with a cumulative percentage of {m.percentage}%. Final grade: {m.overallGrade}. Promoted to next class!"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 15: UNIFIED PRINT MARK SHEETS (TERM-WISE & FINAL RESULT) */}
      {/* ============================================================ */}
      {activeTab === 'print_mark_sheets' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Student Progress Report Card &amp; Mark Sheets
              </h3>
              <p className="text-slate-500 text-xs">
                Inspect and print progress cards. Toggle between a single Exam Term or Cumulative Final Result.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-md shadow-xs bg-slate-100 p-1 mr-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedReportType('term')}
                  className={`px-3 py-1 rounded-md transition font-bold ${
                    selectedReportType === 'term' ? 'bg-white text-[#1b3b6f] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Term Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReportType('final')}
                  className={`px-3 py-1 rounded-md transition font-bold ${
                    selectedReportType === 'final' ? 'bg-white text-[#1b3b6f] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cumulative Final
                </button>
              </div>

              <select
                value={selectedReportCard?.id || filteredMarks[0]?.id || ''}
                onChange={(e) => {
                  const target = filteredMarks.find((m) => m.id === e.target.value);
                  if (target) setSelectedReportCard(target);
                }}
                className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-xs bg-white text-slate-800"
              >
                {filteredMarks.map((m) => (
                  <option key={m.id} value={m.id}>
                    Roll #{m.rollNo} — {m.studentName} ({m.overallGrade})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const target = selectedReportCard || filteredMarks[0];
                  if (target) onPrintReportCard(target);
                }}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Sheet</span>
              </button>
            </div>
          </div>

          {/* Report Card Document Preview Container */}
          {(() => {
            const student = selectedReportCard || filteredMarks[0];
            if (!student) {
              return (
                <div className="bg-white rounded-lg p-8 text-center text-slate-500">
                  No student result data found for this class.
                </div>
              );
            }

            if (selectedReportType === 'term') {
              return (
                <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-md max-w-4xl mx-auto space-y-5 text-xs text-slate-800">
                  {/* School Header */}
                  <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-base shadow">TE</div>
                      <div>
                        <h2 className="font-black text-lg text-slate-900 tracking-wide uppercase">THE EDUCATORS</h2>
                        <div className="text-[11px] text-slate-600 font-semibold font-bold">A Project of Beaconhouse • Main Campus Lahore</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black uppercase text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">TERM PROGRESS MARK SHEET</div>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">{selectedExam}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                      <span className="font-bold text-slate-900 text-sm">{student.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll Number</span>
                      <span className="font-mono font-bold text-sky-800 text-sm">{student.rollNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Class &amp; Section</span>
                      <span className="font-bold text-slate-800">{student.className} (Sec {student.section})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Academic Session</span>
                      <span className="font-mono font-bold text-slate-800">2024 - 2025</span>
                    </div>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#0c1e38] text-white font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3 text-center">Max Marks</th>
                          <th className="py-2.5 px-3 text-center">Pass Marks</th>
                          <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                          <th className="py-2.5 px-3 text-center">Grade</th>
                          <th className="py-2.5 px-3">Subject Teacher Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {student.subjectMarks.map((sub) => (
                          <tr key={sub.subject} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-800">{sub.subject}</td>
                            <td className="py-2 px-3 text-center font-mono text-slate-600">{sub.totalMarks}</td>
                            <td className="py-2 px-3 text-center font-mono text-slate-500">40</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{sub.obtainedMarks}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-900">{sub.grade}</td>
                            <td className="py-2 px-3 text-slate-600 text-[11px]">
                              {sub.obtainedMarks >= 85
                                ? 'Excellent understanding & analytical skills.'
                                : sub.obtainedMarks >= 70
                                ? 'Good progress. Needs practice in subjective essays.'
                                : 'Satisfactory. Regular revision recommended.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                        <tr>
                          <td className="py-2.5 px-3 uppercase font-bold">Grand Total</td>
                          <td className="py-2.5 px-3 text-center font-mono">{student.totalMax}</td>
                          <td className="py-2.5 px-3 text-center font-mono">160</td>
                          <td className="py-2.5 px-3 text-center font-mono font-extrabold text-indigo-950 text-sm">{student.totalObtained}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-800 text-sm">{student.overallGrade}</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-900">Percentage: {student.percentage}%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-[11px] font-bold">
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Class Incharge</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Controller of Examinations</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Executive Principal Seal</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-md max-w-4xl mx-auto space-y-5 text-xs text-slate-800">
                  {/* School Header */}
                  <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center font-black text-base shadow">TE</div>
                      <div>
                        <h2 className="font-black text-lg text-slate-900 tracking-wide uppercase">THE EDUCATORS</h2>
                        <div className="text-[11px] text-slate-600 font-semibold font-bold">Annual Cumulative Examination Transcript</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black uppercase text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">BOARD CUMULATIVE TRANSCRIPT</div>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">Academic Session 2024 - 2025</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                      <span className="font-bold text-indigo-950 text-sm">{student.studentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll Number</span>
                      <span className="font-mono font-bold text-indigo-700 text-sm">{student.rollNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Class &amp; Section</span>
                      <span className="font-bold text-slate-800">{student.className} (Sec {student.section})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Promotion Board</span>
                      <span className="font-mono font-bold text-slate-800">PASSED AND PROMOTED</span>
                    </div>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#102a4e] text-white font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3 text-center">First Term (20%)</th>
                          <th className="py-2.5 px-3 text-center">Mid Term (30%)</th>
                          <th className="py-2.5 px-3 text-center">Final Term (50%)</th>
                          <th className="py-2.5 px-3 text-center">Cumulative (100%)</th>
                          <th className="py-2.5 px-3 text-center">Assigned Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {student.subjectMarks.map((sub) => {
                          const obtainedVal = sub.obtainedMarks;
                          return (
                            <tr key={sub.subject} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-bold text-slate-800">{sub.subject}</td>
                              <td className="py-2 px-3 text-center font-mono text-slate-600">{obtainedVal - 5} / 100</td>
                              <td className="py-2 px-3 text-center font-mono text-slate-600">{obtainedVal} / 100</td>
                              <td className="py-2 px-3 text-center font-mono text-slate-600">{obtainedVal + 3} / 100</td>
                              <td className="py-2 px-3 text-center font-mono font-bold text-emerald-900 bg-emerald-50/20">{obtainedVal + 1} / 100</td>
                              <td className="py-2 px-3 text-center font-bold text-indigo-900">{sub.grade}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                        <tr>
                          <td className="py-2.5 px-3 uppercase">Grand Total Portfolio</td>
                          <td className="py-2.5 px-3 text-center font-mono">78%</td>
                          <td className="py-2.5 px-3 text-center font-mono">82%</td>
                          <td className="py-2.5 px-3 text-center font-mono font-extrabold">85%</td>
                          <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-900 text-sm">{student.percentage}%</td>
                          <td className="py-2.5 px-3 text-center text-emerald-800 text-sm">{student.overallGrade}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-[11px] font-bold">
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Class Incharge</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Controller of Examinations</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-slate-700 mx-auto mb-1" />
                      <span className="font-bold text-slate-800 block">Executive Principal Seal</span>
                    </div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE 16: ANALYTICAL EXAM REPORTS & PERFORMANCE GRAPHS */}
      {/* ============================================================ */}
      {activeTab === 'exam_reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-indigo-950">Campus-Wide Academic Reports &amp; Statistical Audits</h3>
              <p className="text-xs text-slate-500">Distribution analysis, class performance diagnostics, and pass rate summaries for {selectedClass}.</p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#1b3b6f] hover:bg-slate-900 text-white rounded font-bold text-xs flex items-center gap-1 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Subject Averages */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Subject Wise Average Pass Rate</span>
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Mathematics', avg: 84, color: 'bg-emerald-600' },
                  { name: 'English Literature', avg: 79, color: 'bg-indigo-600' },
                  { name: 'General Sciences', avg: 82, color: 'bg-teal-600' },
                  { name: 'Urdu & Grammar', avg: 89, color: 'bg-purple-600' },
                  { name: 'Social Studies & Pak Affairs', avg: 76, color: 'bg-amber-600' },
                ].map((sub) => (
                  <div key={sub.name} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700 text-[10px]">
                      <span>{sub.name}</span>
                      <span className="font-mono text-indigo-900">{sub.avg}% Class Avg</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${sub.color} h-2 rounded-full`} style={{ width: `${sub.avg}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Cohorts */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Grade Distribution Statistics</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { grade: 'A+ Elite', count: 14, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { grade: 'A Standard', count: 11, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
                  { grade: 'B Satisfactory', count: 7, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                  { grade: 'C Average', count: 3, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  { grade: 'D Passing', count: 1, color: 'text-orange-700 bg-orange-50 border-orange-200' },
                  { grade: 'F Failed', count: 0, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                ].map((coh) => (
                  <div key={coh.grade} className={`p-2.5 rounded-lg border text-center font-bold ${coh.color}`}>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{coh.grade}</div>
                    <div className="text-lg font-black font-mono mt-0.5">{coh.count}</div>
                    <div className="text-[9px] text-slate-400 font-normal">Students</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Insights &amp; Board Recommendations</span>
              </h4>
              <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-600 font-medium">
                <div className="p-2.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-2">
                  <div className="font-black text-xs">💡</div>
                  <div>
                    <span className="font-bold">Mathematics Outperformance:</span> Student cohort demonstrated a 4.2% increase in math scores compared to last term.
                  </div>
                </div>
                <div className="p-2.5 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-start gap-2">
                  <div className="font-black text-xs">📊</div>
                  <div>
                    <span className="font-bold">Attendance Correlation:</span> Top 10% high scorers have an overall attendance rate exceeding 96.4%.
                  </div>
                </div>
                <div className="p-2.5 rounded bg-rose-50 text-rose-900 border border-rose-200 flex items-start gap-2">
                  <div className="font-black text-xs">⚠️</div>
                  <div>
                    <span className="font-bold">Subject Focus Areas:</span> General Sciences subjective written essays remain the primary source of mark deficits. Recommend weekly mock essays.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Printable Broad Class Summary Sheet */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs text-slate-800 space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 uppercase">OFFICIAL EXECUTIVE CAMPUS EXAM REPORT</h4>
                <p className="text-[10px] text-slate-500 font-mono">ID: EXAM-REPT-2024-09B • The Educators Beaconhouse Network</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] tracking-wider">BOARD COMPLIANT</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border">
                <span className="text-[10px] text-slate-500 uppercase block">Registered Candidates</span>
                <span className="text-base font-black font-mono text-indigo-950">36 Candidates</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border">
                <span className="text-[10px] text-slate-500 uppercase block">Overall Pass Percentage</span>
                <span className="text-base font-black font-mono text-emerald-800">100% Pass Rate</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border">
                <span className="text-[10px] text-slate-500 uppercase block">Highest Class GPA</span>
                <span className="text-base font-black font-mono text-amber-600">A+ Honor Roll</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border">
                <span className="text-[10px] text-slate-500 uppercase block">Average Subject Score</span>
                <span className="text-base font-black font-mono text-slate-800">82.3 / 100</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  CreditCard,
  Send,
  Printer,
  Edit3,
  Search,
  Plus,
  Clock,
  Sparkles,
  Trophy,
  Medal,
  Save,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { Student, StudentMarkEntry, ExamTerm, ClassInfo } from '../../../types';

interface TeacherExamManagementProps {
  students: Student[];
  classes: ClassInfo[];
  marks: StudentMarkEntry[];
  initialSubTab?: ExamSubTab | string;
  onUpdateMarks?: (id: string, obtained: number) => void;
  onPrintReportCard?: (entry: StudentMarkEntry) => void;
  onPrintMarkSheet?: (entry: any) => void;
  onPrintAdmitCard?: (entry: any) => void;
  onOpenGradingPolicy?: () => void;
}

type ExamSubTab =
  | 'terms_list'
  | 'marks_entry'
  | 'exam_timetable'
  | 'assign_grade'
  | 'teacher_remarks'
  | 'tabulation_sheet'
  | 'position_holders'
  | 'admit_cards'
  | 'send_sms'
  | 'mark_sheets';

type ScopeMode = 'term_wise' | 'final_result';

export default function TeacherExamManagement({
  students,
  classes,
  marks,
  initialSubTab,
  onUpdateMarks,
  onPrintReportCard,
  onPrintMarkSheet,
  onPrintAdmitCard,
  onOpenGradingPolicy,
}: TeacherExamManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<ExamSubTab>(
    (initialSubTab as ExamSubTab) || 'marks_entry'
  );
  const [scopeMode, setScopeMode] = useState<ScopeMode>('term_wise');
  const [selectedTerm, setSelectedTerm] = useState<string>('trm-2');
  const [selectedClass, setSelectedClass] = useState<string>('Class One');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Terms state
  const [terms, setTerms] = useState<ExamTerm[]>([
    {
      id: 'trm-1',
      title: 'Mid Term Examination 2024',
      startDate: '2024-10-15',
      endDate: '2024-10-25',
      academicYear: '2024-2025',
      status: 'Upcoming',
    },
    {
      id: 'trm-2',
      title: 'First Term Assessment 2024',
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      academicYear: '2024-2025',
      status: 'Completed',
    },
    {
      id: 'trm-3',
      title: 'Second Term Assessment 2025',
      startDate: '2025-01-15',
      endDate: '2025-01-25',
      academicYear: '2024-2025',
      status: 'Upcoming',
    },
    {
      id: 'trm-4',
      title: 'Annual Final Examination 2025',
      startDate: '2025-04-10',
      endDate: '2025-04-25',
      academicYear: '2024-2025',
      status: 'Upcoming',
    },
  ]);

  // Timetable entries state
  const [examDateSheet, setExamDateSheet] = useState([
    { id: 'ds-1', date: '2024-10-15', day: 'Tuesday', time: '08:30 AM - 11:30 AM', subject: 'English Grammar & Composition', room: 'Exam Hall A', invigilator: 'Ms. Ayesha Siddiqa' },
    { id: 'ds-2', date: '2024-10-17', day: 'Thursday', time: '08:30 AM - 11:30 AM', subject: 'Mathematics (Core)', room: 'Exam Hall A', invigilator: 'Prof. Tariq Mahmood' },
    { id: 'ds-3', date: '2024-10-20', day: 'Sunday', time: '08:30 AM - 11:30 AM', subject: 'General Science & Viva', room: 'Exam Hall B', invigilator: 'Dr. Saima Khan' },
    { id: 'ds-4', date: '2024-10-22', day: 'Tuesday', time: '08:30 AM - 11:30 AM', subject: 'Urdu Adab & Insha', room: 'Exam Hall A', invigilator: 'Mrs. Rabia Noor' },
    { id: 'ds-5', date: '2024-10-24', day: 'Thursday', time: '08:30 AM - 10:30 AM', subject: 'Islamiat / Ethics', room: 'Exam Hall B', invigilator: 'Qari Abdul Rehman' },
  ]);

  // Local editable marks state
  const [localMarks, setLocalMarks] = useState<Record<string, { theory: number; practical: number; remarks: string }>>(() => {
    const init: Record<string, { theory: number; practical: number; remarks: string }> = {};
    students.forEach((s, idx) => {
      init[s.id] = {
        theory: 65 + (idx * 5) % 30,
        practical: 20 + (idx * 2) % 6,
        remarks: idx === 0 ? 'Exceptional academic excellence, attentive and disciplined in class.' : 'Good consistency, keep practicing problem sets.',
      };
    });
    return init;
  });

  // SMS status state
  const [smsSentLogs, setSmsSentLogs] = useState<string[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Selected student for single preview
  const [previewStudentId, setPreviewStudentId] = useState<string>(students[0]?.id || 'std-1');

  // Helper grading formula
  const calculateGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A+', gpa: '4.0', status: 'Passed', remark: 'Exceptional' };
    if (pct >= 80) return { grade: 'A', gpa: '3.7', status: 'Passed', remark: 'Excellent' };
    if (pct >= 70) return { grade: 'B', gpa: '3.0', status: 'Passed', remark: 'Very Good' };
    if (pct >= 60) return { grade: 'C', gpa: '2.0', status: 'Passed', remark: 'Good' };
    if (pct >= 50) return { grade: 'D', gpa: '1.0', status: 'Passed', remark: 'Fair' };
    if (pct >= 40) return { grade: 'E', gpa: '0.5', status: 'Passed', remark: 'Satisfactory' };
    return { grade: 'F', gpa: '0.0', status: 'Failed', remark: 'Needs Improvement' };
  };

  const filteredClassStudents = students.filter(
    (s) => s.className === selectedClass && (selectedSection === 'All' || s.section === selectedSection)
  );

  // Broadsheet data computation
  const broadsheetData = filteredClassStudents.map((std, idx) => {
    const data = localMarks[std.id] || { theory: 70, practical: 20, remarks: 'Very Good' };
    const totalObtained = data.theory + data.practical;
    const maxMarks = 100;
    const percentage = Number(((totalObtained / maxMarks) * 100).toFixed(1));
    const gradeInfo = calculateGrade(percentage);

    return {
      student: std,
      math: totalObtained,
      english: Math.min(100, Math.max(45, totalObtained - 5 + ((idx * 7) % 15))),
      urdu: Math.min(100, Math.max(50, totalObtained - 2 + ((idx * 3) % 10))),
      science: Math.min(100, Math.max(48, totalObtained + 3 - ((idx * 4) % 12))),
      islamiat: Math.min(50, Math.max(30, Math.round(totalObtained / 2))),
      remarks: data.remarks,
    };
  }).map((item) => {
    const grandTotal = item.math + item.english + item.urdu + item.science + item.islamiat;
    const grandMax = 450;
    const grandPercentage = Number(((grandTotal / grandMax) * 100).toFixed(1));
    const finalGrade = calculateGrade(grandPercentage);
    return {
      ...item,
      grandTotal,
      grandMax,
      grandPercentage,
      finalGrade,
    };
  }).sort((a, b) => b.grandTotal - a.grandTotal);

  // Add rank positions
  const rankedList = broadsheetData.map((item, idx) => ({
    ...item,
    position: idx + 1,
  }));

  const handleSaveMarks = () => {
    setSaveSuccessMsg(`Marks and assessment remarks successfully saved for ${selectedClass} (${selectedSubject})!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleBroadcastSms = () => {
    const termTitle = terms.find((t) => t.id === selectedTerm)?.title || 'Term Examination';
    const logs = rankedList.map(
      (item) =>
        `SMS Sent to ${item.student.parentPhone || '+92 300 0000000'} for ${item.student.name} (Roll: ${item.student.rollNo}): Scored ${item.grandTotal}/${item.grandMax} (${item.grandPercentage}%), Grade: ${item.finalGrade.grade}, Position: #${item.position}. Delivered.`
    );
    setSmsSentLogs(logs);
  };

  return (
    <div id="teacher-exam-management-suite" className="space-y-4">
      {/* Top Banner & Sub-Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Faculty Examination &amp; Remarks Management
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Administer marks entry, tabulation broadsheets, grading criteria, position holders, admit slips, and parent SMS broadcasts.
            </p>
          </div>

          {/* Scope Selector: Term Wise vs Final Result */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setScopeMode('term_wise')}
              className={`px-3 py-1.5 rounded-md transition ${
                scopeMode === 'term_wise'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Term / Semester Wise
            </button>
            <button
              type="button"
              onClick={() => setScopeMode('final_result')}
              className={`px-3 py-1.5 rounded-md transition ${
                scopeMode === 'final_result'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Final Result / Exam
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 custom-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('terms_list')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'terms_list'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Exam Terms List</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('marks_entry')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'marks_entry'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Marks Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('exam_timetable')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'exam_timetable'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Exam Timetable</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('assign_grade')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'assign_grade'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assign Grade</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('teacher_remarks')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'teacher_remarks'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Teacher Remarks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tabulation_sheet')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'tabulation_sheet'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tabulation Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('position_holders')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'position_holders'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Position Holder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('admit_cards')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'admit_cards'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Print Admit Cards / Slips</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('send_sms')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'send_sms'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Marks by SMS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('mark_sheets')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 ${
              activeSubTab === 'mark_sheets'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Mark Sheets</span>
          </button>

          {onOpenGradingPolicy && (
            <button
              type="button"
              onClick={onOpenGradingPolicy}
              className="px-3 py-1.5 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-[#002147] border border-sky-300 ml-auto cursor-pointer"
              title="Configure term-specific grade distributions and criteria for subjects"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
              <span>Grading Policy Editor &rarr;</span>
            </button>
          )}
        </div>

        {/* Global Filter Toolbar for Class, Section, Term */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3 mt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Exam Term / Assessment</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700 outline-none"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700 outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="All">All Sections</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700 outline-none"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="General Science">General Science</option>
              <option value="Islamiat">Islamiat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. EXAM TERM / SEMESTER LIST */}
      {activeSubTab === 'terms_list' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Academic Examination Terms &amp; Semesters</h4>
              <p className="text-xs text-slate-500">Configure institutional exam cycles, start and closing deadlines.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('New Exam Term creator launched.')}
              className="px-3 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exam Term</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {terms.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {t.academicYear}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'Active'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h5 className="font-bold text-slate-800 text-sm">{t.title}</h5>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.startDate} to {t.endDate}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">Passing: 40% • 5 Core Subjects</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTerm(t.id);
                      setActiveSubTab('marks_entry');
                    }}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    Enter Marks &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MARKS ENTRY */}
      {activeSubTab === 'marks_entry' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {selectedClass} ({selectedSection}) • {selectedSubject} Marks Ledger
              </h4>
              <p className="text-[11px] text-slate-500">
                Theory Max: 75 Marks • Practical/Oral Max: 25 Marks • Total Max: 100 Marks
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveMarks}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Commit Marks</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3 text-center">Theory (75)</th>
                  <th className="py-2.5 px-3 text-center">Practical (25)</th>
                  <th className="py-2.5 px-3 text-center">Total (100)</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClassStudents.map((std) => {
                  const data = localMarks[std.id] || { theory: 60, practical: 20, remarks: '' };
                  const total = data.theory + data.practical;
                  const pct = (total / 100) * 100;
                  const gradeObj = calculateGrade(pct);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">#{std.rollNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{std.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{std.fatherName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={75}
                          value={data.theory}
                          onChange={(e) => {
                            const val = Math.min(75, Math.max(0, Number(e.target.value) || 0));
                            setLocalMarks((prev) => ({
                              ...prev,
                              [std.id]: { ...(prev[std.id] || { practical: 20, remarks: '' }), theory: val },
                            }));
                          }}
                          className="w-16 p-1 border rounded text-center font-bold bg-white text-slate-800 text-xs outline-none focus:border-sky-500"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={25}
                          value={data.practical}
                          onChange={(e) => {
                            const val = Math.min(25, Math.max(0, Number(e.target.value) || 0));
                            setLocalMarks((prev) => ({
                              ...prev,
                              [std.id]: { ...(prev[std.id] || { theory: 60, remarks: '' }), practical: val },
                            }));
                          }}
                          className="w-16 p-1 border rounded text-center font-bold bg-white text-slate-800 text-xs outline-none focus:border-sky-500"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-slate-800">
                        {total}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded font-black text-xs bg-sky-50 text-sky-700 border border-sky-200">
                          {gradeObj.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            total >= 40
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {total >= 40 ? 'Passed' : 'Failed'}
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

      {/* 3. EXAM TIMETABLE */}
      {activeSubTab === 'exam_timetable' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Class Examination Date Sheet &amp; Timetable</h4>
              <p className="text-xs text-slate-500">Official schedule with exam halls and invigilator faculty allotments.</p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Date Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Day</th>
                  <th className="py-2 px-3">Timing</th>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3">Exam Center / Hall</th>
                  <th className="py-2 px-3">Invigilator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examDateSheet.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{ds.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">{ds.day}</td>
                    <td className="py-2.5 px-3 font-mono text-sky-700">{ds.time}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{ds.subject}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium text-slate-700">
                        {ds.room}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{ds.invigilator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ASSIGN GRADE (Term/Semester Wise & For Final Result) */}
      {activeSubTab === 'assign_grade' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Assign Grade Criteria ({scopeMode === 'term_wise' ? 'Term / Semester Wise' : 'For Final Annual Result'})
              </h4>
              <p className="text-xs text-slate-500">Institutional 7-tier scale with Grade Points &amp; remarks thresholds.</p>
            </div>
            <button
              type="button"
              onClick={() => alert(`Grade policy synchronized for ${scopeMode === 'term_wise' ? 'current term' : 'final annual result'}!`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Grading Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { grade: 'A+', range: '90% - 100%', gpa: '4.0', title: 'Exceptional Distinction', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-800' },
              { grade: 'A', range: '80% - 89.9%', gpa: '3.7', title: 'Excellent Mastery', color: 'border-sky-300 bg-sky-50/50 text-sky-800' },
              { grade: 'B', range: '70% - 79.9%', gpa: '3.0', title: 'Very Good Progress', color: 'border-indigo-300 bg-indigo-50/50 text-indigo-800' },
              { grade: 'C', range: '60% - 69.9%', gpa: '2.0', title: 'Good Standard', color: 'border-amber-300 bg-amber-50/50 text-amber-800' },
              { grade: 'D', range: '50% - 59.9%', gpa: '1.0', title: 'Satisfactory', color: 'border-orange-300 bg-orange-50/50 text-orange-800' },
              { grade: 'E', range: '40% - 49.9%', gpa: '0.5', title: 'Passing Benchmark', color: 'border-slate-300 bg-slate-50/50 text-slate-800' },
              { grade: 'F', range: 'Below 40%', gpa: '0.0', title: 'Unsatisfactory / Fail', color: 'border-rose-300 bg-rose-50/50 text-rose-800' },
            ].map((g) => (
              <div key={g.grade} className={`p-3 rounded-xl border ${g.color} space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black">{g.grade}</span>
                  <span className="text-xs font-mono font-bold">GPA {g.gpa}</span>
                </div>
                <div className="text-xs font-bold">{g.range}</div>
                <div className="text-[11px] opacity-80">{g.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TEACHER REMARKS (Term/Semester Wise & For Final Result) */}
      {activeSubTab === 'teacher_remarks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Teacher Remarks Entry ({scopeMode === 'term_wise' ? 'Term Wise' : 'For Final Result'})
              </h4>
              <p className="text-[11px] text-slate-500">
                Provide qualitative evaluation on academic aptitude, behavior, homework adherence, and focus.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveMarks}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save All Remarks</span>
            </button>
          </div>

          <div className="p-3 bg-amber-50/50 border-b border-amber-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-amber-900">Quick Preset Suggestions:</span>
            {[
              'Exceptional academic grasp & discipline.',
              'Very good effort, keep practicing mathematics.',
              'Satisfactory performance; needs active class participation.',
              'High potential, recommend regular homework completion.',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  // Apply to first student
                  if (filteredClassStudents[0]) {
                    setLocalMarks((prev) => ({
                      ...prev,
                      [filteredClassStudents[0].id]: {
                        ...(prev[filteredClassStudents[0].id] || { theory: 60, practical: 20, remarks: '' }),
                        remarks: preset,
                      },
                    }));
                  }
                }}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[11px] text-amber-800 font-medium"
              >
                + "{preset.slice(0, 25)}..."
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {filteredClassStudents.map((std) => {
              const currentRemarks = localMarks[std.id]?.remarks || 'Consistent academic performance.';
              return (
                <div key={std.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="sm:w-1/3">
                    <div className="font-bold text-slate-800 text-xs">{std.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Roll #{std.rollNo} • {std.fatherName}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentRemarks}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocalMarks((prev) => ({
                          ...prev,
                          [std.id]: {
                            ...(prev[std.id] || { theory: 60, practical: 20, remarks: '' }),
                            remarks: val,
                          },
                        }));
                      }}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-sky-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TABULATION SHEET (Term/Semester Wise & For Final Result) */}
      {activeSubTab === 'tabulation_sheet' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Official Tabulation Broadsheet ({scopeMode === 'term_wise' ? 'Term Wise' : 'Final Annual Result'})
              </h4>
              <p className="text-[11px] text-slate-500">
                Consolidated multi-subject master sheet with percentages, grades, class ranking, and remarks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tabulation Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-2">Rank</th>
                  <th className="py-2.5 px-2">Roll #</th>
                  <th className="py-2.5 px-2">Student Name</th>
                  <th className="py-2.5 px-2 text-center">Math (100)</th>
                  <th className="py-2.5 px-2 text-center">Eng (100)</th>
                  <th className="py-2.5 px-2 text-center">Urdu (100)</th>
                  <th className="py-2.5 px-2 text-center">Sci (100)</th>
                  <th className="py-2.5 px-2 text-center">Isl (50)</th>
                  <th className="py-2.5 px-2 text-center">Grand Total (450)</th>
                  <th className="py-2.5 px-2 text-center">%</th>
                  <th className="py-2.5 px-2 text-center">Grade</th>
                  <th className="py-2.5 px-2">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankedList.map((row) => (
                  <tr key={row.student.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-2 font-bold text-slate-700">#{row.position}</td>
                    <td className="py-2 px-2 font-mono font-bold text-slate-600">{row.student.rollNo}</td>
                    <td className="py-2 px-2 font-bold text-slate-800">{row.student.name}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.math}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.english}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.urdu}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.science}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.islamiat}</td>
                    <td className="py-2 px-2 text-center font-mono font-black text-slate-900">{row.grandTotal}</td>
                    <td className="py-2 px-2 text-center font-bold text-sky-700">{row.grandPercentage}%</td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                        {row.finalGrade.grade}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-[11px] text-slate-600 truncate max-w-[150px]">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. POSITION HOLDER (Term/Semester Wise & For Final Exam) */}
      {activeSubTab === 'position_holders' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Academic Position Holders ({scopeMode === 'term_wise' ? 'Term / Semester Wise' : 'For Final Annual Exam'})
              </h4>
              <p className="text-xs text-slate-500">Top 3 rank honors and merit distinction recipients.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Merit Certificates compiled and prepared for print!')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Generate Merit Certificates</span>
            </button>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankedList.slice(0, 3).map((item, idx) => {
              const medals = [
                { badge: '1st Position', bg: 'bg-amber-50 border-amber-300 text-amber-900', icon: '🥇' },
                { badge: '2nd Position', bg: 'bg-slate-100 border-slate-300 text-slate-800', icon: '🥈' },
                { badge: '3rd Position', bg: 'bg-orange-50 border-orange-300 text-orange-900', icon: '🥉' },
              ][idx];

              return (
                <div key={item.student.id} className={`p-4 rounded-xl border ${medals.bg} space-y-2 text-center`}>
                  <div className="text-3xl">{medals.icon}</div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black bg-white shadow-2xs border">
                    {medals.badge}
                  </span>
                  <h5 className="font-black text-slate-900 text-base mt-1">{item.student.name}</h5>
                  <div className="text-xs text-slate-600 font-mono">Roll #{item.student.rollNo} • {item.student.className}</div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-around text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Score</div>
                      <div className="font-black text-slate-800">{item.grandTotal} / {item.grandMax}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Percentage</div>
                      <div className="font-black text-emerald-700">{item.grandPercentage}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Grade</div>
                      <div className="font-black text-sky-700">{item.finalGrade.grade}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. PRINT ADMIT CARDS / SLIPS */}
      {activeSubTab === 'admit_cards' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Examination Admit Slips &amp; Roll Number Slips ({scopeMode === 'term_wise' ? 'Term Wise' : 'For Final Exam'})
              </h4>
              <p className="text-xs text-slate-500">Print candidate examination hall entry vouchers with date sheet.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={previewStudentId}
                onChange={(e) => setPreviewStudentId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-700"
              >
                {filteredClassStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    Roll #{s.rollNo}: {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Admit Slip</span>
              </button>
            </div>
          </div>

          {/* Printable Admit Card Preview */}
          {(() => {
            const currentStd = students.find((s) => s.id === previewStudentId) || students[0];
            return (
              <div className="border-2 border-slate-800 rounded-xl p-5 max-w-2xl mx-auto bg-white shadow-md text-xs space-y-3">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-800 pb-2">
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900">
                    THE EDUCATORS SCHOOL &amp; COLLEGE
                  </h3>
                  <div className="text-[11px] font-bold text-slate-600">
                    Official Examination Admit Card • Session 2024–2025
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {scopeMode === 'term_wise' ? 'First Term Assessment 2024' : 'Final Annual Examination 2025'}
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-200">
                  <div className="space-y-1">
                    <div><strong>Candidate Name:</strong> {currentStd?.name}</div>
                    <div><strong>Father's Name:</strong> {currentStd?.fatherName}</div>
                    <div><strong>Class &amp; Section:</strong> {currentStd?.className} - {currentStd?.section}</div>
                    <div><strong>Roll Number:</strong> <span className="font-mono font-bold text-slate-900 text-sm">#{currentStd?.rollNo}</span></div>
                    <div><strong>Center:</strong> Main Campus Examination Hall A</div>
                  </div>
                  <div className="w-20 h-24 border-2 border-dashed border-slate-400 rounded flex flex-col items-center justify-center text-[10px] text-slate-400">
                    Photo Stamp
                  </div>
                </div>

                {/* Exam Schedule */}
                <div>
                  <div className="font-bold text-slate-800 mb-1">Schedule of Papers:</div>
                  <table className="w-full text-left border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-1.5 border">Date</th>
                        <th className="p-1.5 border">Time</th>
                        <th className="p-1.5 border">Subject</th>
                        <th className="p-1.5 border">Sign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examDateSheet.map((ds) => (
                        <tr key={ds.id}>
                          <td className="p-1.5 border font-mono">{ds.date}</td>
                          <td className="p-1.5 border font-mono">{ds.time}</td>
                          <td className="p-1.5 border font-bold">{ds.subject}</td>
                          <td className="p-1.5 border"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="pt-6 flex justify-between text-center font-bold text-[11px] border-t border-slate-200">
                  <div>
                    <div className="w-32 border-b border-slate-800 mb-1"></div>
                    <span>Candidate Signature</span>
                  </div>
                  <div>
                    <div className="w-32 border-b border-slate-800 mb-1"></div>
                    <span>Controller of Examinations</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 9. SEND MARKS BY SMS */}
      {activeSubTab === 'send_sms' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Send Exam Marks via Parent SMS ({scopeMode === 'term_wise' ? 'Term Wise' : 'For Final Exam'})
              </h4>
              <p className="text-xs text-slate-500">Instant SMS dispatch to registered parental mobile numbers.</p>
            </div>
            <button
              type="button"
              onClick={handleBroadcastSms}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Marks SMS to All Parents</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
            <span className="font-bold text-slate-700">SMS Notification Message Preview:</span>
            <p className="font-mono text-slate-600 bg-white p-2.5 rounded border border-slate-200">
              "Assalam-o-Alaikum! Student: Hamza Aslam (Roll: 101) result for First Term Assessment: Scored 416/450 (92.4%), Grade: A+, Position: #1. Controller of Exams, The Educators."
            </p>
          </div>

          {smsSentLogs.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-800">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SMS Dispatch Log ({smsSentLogs.length} messages sent):</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-[11px]">
                {smsSentLogs.map((log, idx) => (
                  <div key={idx} className="p-1 bg-white/70 rounded">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. PRINT MARK SHEETS */}
      {activeSubTab === 'mark_sheets' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Detailed Mark Certificate (DMC) / Report Card ({scopeMode === 'term_wise' ? 'Term Wise' : 'For Final Exam'})
              </h4>
              <p className="text-xs text-slate-500">Official academic transcripts with teacher remarks and grades.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={previewStudentId}
                onChange={(e) => setPreviewStudentId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-700"
              >
                {filteredClassStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    Roll #{s.rollNo}: {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Mark Sheet</span>
              </button>
            </div>
          </div>

          {/* Mark Sheet Preview */}
          {(() => {
            const currentStd = students.find((s) => s.id === previewStudentId) || students[0];
            const currentRecord = rankedList.find((r) => r.student.id === previewStudentId) || rankedList[0];

            return (
              <div className="border-4 border-double border-slate-800 rounded-xl p-6 max-w-2xl mx-auto bg-white shadow-md text-xs space-y-4">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-800 pb-3">
                  <div className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    THE EDUCATORS SCHOOL &amp; COLLEGE
                  </div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-0.5">
                    Progress Report &amp; Detailed Mark Certificate
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Academic Year 2024–2025 • {scopeMode === 'term_wise' ? 'First Term Assessment' : 'Final Annual Examination'}
                  </div>
                </div>

                {/* Student Credentials */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div><strong>Student Name:</strong> {currentStd?.name}</div>
                  <div><strong>Roll Number:</strong> #{currentStd?.rollNo}</div>
                  <div><strong>Father's Name:</strong> {currentStd?.fatherName}</div>
                  <div><strong>Class &amp; Section:</strong> {currentStd?.className} - {currentStd?.section}</div>
                </div>

                {/* Marks Breakdown Table */}
                <table className="w-full text-left border border-slate-300 text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 border">Subject</th>
                      <th className="p-2 border text-center">Max Marks</th>
                      <th className="p-2 border text-center">Obtained Marks</th>
                      <th className="p-2 border text-center">Grade</th>
                      <th className="p-2 border text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 border font-bold">Mathematics</td>
                      <td className="p-2 border text-center">100</td>
                      <td className="p-2 border text-center font-mono font-bold">{currentRecord?.math || 94}</td>
                      <td className="p-2 border text-center">A+</td>
                      <td className="p-2 border text-center text-emerald-700 font-bold">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold">English Grammar</td>
                      <td className="p-2 border text-center">100</td>
                      <td className="p-2 border text-center font-mono font-bold">{currentRecord?.english || 88}</td>
                      <td className="p-2 border text-center">A</td>
                      <td className="p-2 border text-center text-emerald-700 font-bold">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold">Urdu Adab</td>
                      <td className="p-2 border text-center">100</td>
                      <td className="p-2 border text-center font-mono font-bold">{currentRecord?.urdu || 91}</td>
                      <td className="p-2 border text-center">A+</td>
                      <td className="p-2 border text-center text-emerald-700 font-bold">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold">General Science</td>
                      <td className="p-2 border text-center">100</td>
                      <td className="p-2 border text-center font-mono font-bold">{currentRecord?.science || 95}</td>
                      <td className="p-2 border text-center">A+</td>
                      <td className="p-2 border text-center text-emerald-700 font-bold">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold">Islamiat</td>
                      <td className="p-2 border text-center">50</td>
                      <td className="p-2 border text-center font-mono font-bold">{currentRecord?.islamiat || 48}</td>
                      <td className="p-2 border text-center">A+</td>
                      <td className="p-2 border text-center text-emerald-700 font-bold">Pass</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td className="p-2 border">Grand Total</td>
                      <td className="p-2 border text-center">450</td>
                      <td className="p-2 border text-center font-mono text-sm">{currentRecord?.grandTotal || 416}</td>
                      <td className="p-2 border text-center text-sky-700">{currentRecord?.finalGrade.grade || 'A+'}</td>
                      <td className="p-2 border text-center text-emerald-700">Passed</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Aggregate Summary */}
                <div className="grid grid-cols-3 gap-2 text-center p-2 bg-slate-50 rounded border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Percentage</span>
                    <div className="font-black text-slate-800 text-sm">{currentRecord?.grandPercentage || 92.4}%</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Class Position</span>
                    <div className="font-black text-amber-600 text-sm">#{currentRecord?.position || 1}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Attendance</span>
                    <div className="font-black text-emerald-600 text-sm">96.8%</div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="p-2.5 border rounded bg-slate-50/50">
                  <strong>Faculty Remarks:</strong> {currentRecord?.remarks || 'Exceptional student performance.'}
                </div>

                {/* Signatures */}
                <div className="pt-8 flex justify-between text-center font-bold text-[11px]">
                  <div>
                    <div className="w-28 border-b border-slate-800 mb-1"></div>
                    <span>Class Teacher</span>
                  </div>
                  <div>
                    <div className="w-28 border-b border-slate-800 mb-1"></div>
                    <span>Controller of Exams</span>
                  </div>
                  <div>
                    <div className="w-28 border-b border-slate-800 mb-1"></div>
                    <span>Campus Principal</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

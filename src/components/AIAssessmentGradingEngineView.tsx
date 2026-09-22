import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Award,
  Sliders,
  Eye,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { Student, ClassInfo, StudentMarkEntry } from '../types';
import { downloadFile, exportToCsv } from '../utils/fileUtils';

interface AIAssessmentGradingEngineViewProps {
  students: Student[];
  classes: ClassInfo[];
  marks?: StudentMarkEntry[];
  onSaveMarks?: (newMark: StudentMarkEntry) => void;
}

export default function AIAssessmentGradingEngineView({
  students,
  classes,
  marks = [],
  onSaveMarks,
}: AIAssessmentGradingEngineViewProps) {
  const [activeTab, setActiveTab] = useState<'ocr_scanner' | 'paper_generator' | 'results_log'>('ocr_scanner');

  // OCR Bubble Sheet state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class 9');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);

  // Mock Recognized Questions from OCR
  const [scannedQuestions, setScannedQuestions] = useState([
    { qNo: 1, marked: 'B', correct: 'B', isCorrect: true, confidence: 99.4 },
    { qNo: 2, marked: 'A', correct: 'A', isCorrect: true, confidence: 98.8 },
    { qNo: 3, marked: 'C', correct: 'D', isCorrect: false, confidence: 96.2 },
    { qNo: 4, marked: 'A', correct: 'A', isCorrect: true, confidence: 99.1 },
    { qNo: 5, marked: 'D', correct: 'D', isCorrect: true, confidence: 97.5 },
    { qNo: 6, marked: 'B', correct: 'B', isCorrect: true, confidence: 98.9 },
    { qNo: 7, marked: 'C', correct: 'C', isCorrect: true, confidence: 99.0 },
    { qNo: 8, marked: 'A', correct: 'B', isCorrect: false, confidence: 94.7 },
    { qNo: 9, marked: 'C', correct: 'C', isCorrect: true, confidence: 98.6 },
    { qNo: 10, marked: 'D', correct: 'D', isCorrect: true, confidence: 99.3 },
    { qNo: 11, marked: 'B', correct: 'B', isCorrect: true, confidence: 98.4 },
    { qNo: 12, marked: 'A', correct: 'A', isCorrect: true, confidence: 99.2 },
    { qNo: 13, marked: 'C', correct: 'C', isCorrect: true, confidence: 97.8 },
    { qNo: 14, marked: 'B', correct: 'D', isCorrect: false, confidence: 95.1 },
    { qNo: 15, marked: 'A', correct: 'A', isCorrect: true, confidence: 99.6 },
  ]);

  // Paper Generator state
  const [genBoard, setGenBoard] = useState<'FBISE' | 'Cambridge' | 'Punjab' | 'Sindh' | 'Edexcel'>('FBISE');
  const [genClass, setGenClass] = useState('Class 9');
  const [genSubject, setGenSubject] = useState('Physics');
  const [genTopic, setGenTopic] = useState('Kinematics, Dynamics & Circular Motion');
  const [genDifficulty, setGenDifficulty] = useState<'Standard' | 'Challenging' | 'Past Paper Style'>('Past Paper Style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavedToMarksheet, setIsSavedToMarksheet] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<any>({
    title: 'FIRST TERM SUMMATIVE EXAMINATION 2026',
    board: 'Federal Board of Intermediate and Secondary Education (FBISE)',
    subject: 'PHYSICS (SSC-I)',
    timeAllowed: '2 Hours 30 Minutes',
    maxMarks: 75,
    sectionA: [
      { qNo: 1, text: 'The number of base units in SI system is:', options: ['3', '5', '7', '9'], answer: 'C (7)' },
      { qNo: 2, text: 'A scalar quantity has:', options: ['Magnitude only', 'Direction only', 'Both magnitude and direction', 'None'], answer: 'A (Magnitude only)' },
      { qNo: 3, text: 'The rate of change of momentum is equal to:', options: ['Torque', 'Applied Force', 'Velocity', 'Impulse'], answer: 'B (Applied Force)' },
      { qNo: 4, text: 'Value of g at the center of Earth is:', options: ['9.8 m/s²', 'Zero', 'Infinite', '4.9 m/s²'], answer: 'B (Zero)' },
      { qNo: 5, text: 'Work done is maximum when the angle between Force and Displacement is:', options: ['0°', '90°', '180°', '45°'], answer: 'A (0°)' },
    ],
    sectionB: [
      { qNo: 1, text: 'Differentiate between scalar and vector quantities with two practical examples each.', marks: 4 },
      { qNo: 2, text: 'State Newton’s Second Law of Motion and derive the mathematical expression F = ma.', marks: 4 },
      { qNo: 3, text: 'A car starts from rest with acceleration of 0.5 m/s². Find its speed when it has traveled 100m.', marks: 4 },
      { qNo: 4, text: 'Explain why rolling friction is much less than sliding friction with microscopic contact diagram.', marks: 4 },
      { qNo: 5, text: 'Define centripetal force and derive its formula in terms of mass, velocity and radius.', marks: 4 },
    ],
    sectionC: [
      { qNo: 1, text: '(a) Define Law of Conservation of Momentum and prove it using two colliding bodies. (5 Marks)\n(b) A body of mass 5 kg moves with a velocity of 10 m/s. Calculate its kinetic energy. (4 Marks)', marks: 9 },
      { qNo: 2, text: '(a) State and explain Law of Gravitation. How mass of earth is calculated using this law? (5 Marks)\n(b) What are artificial satellites and how are their orbital speeds calculated? (4 Marks)', marks: 9 },
    ],
  });

  const correctCount = scannedQuestions.filter((q) => q.isCorrect).length;
  const totalQuestions = scannedQuestions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1200);
  };

  const handleGeneratePaper = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-400 text-purple-950 uppercase tracking-wide">
                AI Assessment Suite
              </span>
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded border border-white/20 text-purple-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                OCR Bubble Sheet Scanner &bull; Multi-Board Exam Paper Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Exam Grader &amp; Question Paper Studio
            </h1>
            <p className="text-purple-100 text-xs mt-1 max-w-2xl">
              Instant automated optical grading of answer sheets with AI paper generation formatted for FBISE, Cambridge, Punjab, and Sindh curriculum boards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('ocr_scanner')}
              className="px-3.5 py-2 bg-purple-500 hover:bg-purple-400 text-purple-950 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Bubble Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paper_generator')}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Generate Paper</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <div className="flex gap-2">
          {[
            { id: 'ocr_scanner', label: 'OCR Bubble Sheet Scanner', icon: Camera },
            { id: 'paper_generator', label: 'Board Exam Paper Generator', icon: FileText },
            { id: 'results_log', label: 'Grading History & Marks Sync', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OCR BUBBLE SHEET SCANNER */}
      {activeTab === 'ocr_scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Upload & Configuration */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Sheet Ingestion &amp; Student Mapping</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudent(students.find((s) => s.id === e.target.value) || null)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentCode}) - {s.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 rounded-xl p-5 text-center transition cursor-pointer">
                <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">Upload Answer Sheet Photo or PDF</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Supports high-res PNG, JPG, or PDF scan</p>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Processing Neural OCR...' : 'Run Optical Recognition'}</span>
                </button>
              </div>
            </div>

            {/* Score Metric Card */}
            {scanCompleted && (
              <div className="p-4 bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300 font-bold uppercase tracking-wide">Auto-Score Result</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-bold">
                    Grade: {scorePercentage >= 80 ? 'A+' : scorePercentage >= 70 ? 'A' : 'B'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-purple-200">
                    {correctCount} <span className="text-sm font-normal text-slate-300">/ {totalQuestions} Marks</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400">{scorePercentage}%</div>
                </div>
                <div className="text-[11px] text-slate-300 pt-1 border-t border-white/10 flex justify-between">
                  <span>Student: {selectedStudent?.name}</span>
                  <span>Subject: {selectedSubject}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Question Breakdown & Answers */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Visual Bubble Matrix &amp; Answer Key Verification</h3>
                <p className="text-xs text-slate-500">Optical alignment verification against correct key.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onSaveMarks && selectedStudent) {
                    const grade = scorePercentage >= 80 ? 'A+' : scorePercentage >= 70 ? 'A' : scorePercentage >= 60 ? 'B' : 'C';
                    onSaveMarks({
                      id: `mk-${Date.now()}`,
                      examTermId: 'term-1',
                      studentId: selectedStudent.id,
                      studentName: selectedStudent.name,
                      rollNo: selectedStudent.rollNo,
                      className: selectedStudent.className,
                      section: selectedStudent.section || 'A',
                      subjectMarks: [
                        {
                          subject: selectedSubject,
                          totalMarks: totalQuestions,
                          obtainedMarks: correctCount,
                          grade,
                        },
                      ],
                      totalMax: totalQuestions,
                      totalObtained: correctCount,
                      percentage: scorePercentage,
                      overallGrade: grade,
                      teacherRemarks: 'Graded via Neural OCR Optical Bubble Scanner',
                    });
                  }
                  setIsSavedToMarksheet(true);
                  setTimeout(() => setIsSavedToMarksheet(false), 4000);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSavedToMarksheet ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSavedToMarksheet ? '✓ Saved to Marksheet Dossier' : 'Save to Student Marksheet'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {scannedQuestions.map((q) => (
                <div
                  key={q.qNo}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    q.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-rose-200 bg-rose-50/50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-800">Q{q.qNo}</div>
                    <div className="text-[11px] text-slate-500">
                      Marked: <strong className="font-mono text-slate-800">{q.marked}</strong> | Key: <strong className="font-mono text-slate-800">{q.correct}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        q.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                      }`}
                    >
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{q.confidence}% conf</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOARD EXAM PAPER GENERATOR */}
      {activeTab === 'paper_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Generator Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Curriculum Board Parameters</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Examination Board</label>
                <select
                  value={genBoard}
                  onChange={(e) => setGenBoard(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="FBISE">FBISE (Federal Board Islamabad)</option>
                  <option value="Cambridge">Cambridge (CAIE O-Level / IGCSE)</option>
                  <option value="Punjab">Punjab Board (BISE Lahore / Rawalpindi)</option>
                  <option value="Sindh">Sindh Board (BSEK Karachi)</option>
                  <option value="Edexcel">Edexcel International</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={genClass}
                    onChange={(e) => setGenClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Class 8">Class 8 (Middle)</option>
                    <option value="Class 9">Class 9 (SSC-I / O1)</option>
                    <option value="Class 10">Class 10 (SSC-II / O2)</option>
                    <option value="Class 11">Class 11 (HSSC-I / A1)</option>
                    <option value="Class 12">Class 12 (HSSC-II / A2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapters / Syllabus Topic</label>
                <textarea
                  rows={2}
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Level</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Standard">Standard School Summative</option>
                  <option value="Past Paper Style">Past 10-Years Board Exam Pattern</option>
                  <option value="Challenging">High-Order Bloom's Analytical (O-Level Style)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGeneratePaper}
                disabled={isGenerating}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Synthesizing Question Paper...' : 'Generate Official Exam Paper'}</span>
              </button>
            </div>
          </div>

          {/* Generated Paper Preview */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                  {genBoard} Format
                </span>
                <span className="text-xs font-bold text-slate-800">{genSubject} - {genClass}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Paper</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const paperText = `THE EDUCATORS SCHOOL SYSTEM\n${generatedPaper.board}\n${generatedPaper.title}\nSubject: ${generatedPaper.subject} | Grade: ${genClass}\nTime: ${generatedPaper.timeAllowed} | Max Marks: ${generatedPaper.maxMarks}\n\n=========================================\nSECTION A: MULTIPLE CHOICE QUESTIONS (MCQs)\n=========================================\n` +
                      (generatedPaper.sectionA || []).map((q: any) => `Q${q.qNo}. ${q.text}\n   Options: ${q.options.join('  |  ')}\n   Key: ${q.answer}`).join('\n\n') +
                      `\n\n=========================================\nSECTION B: CONSTRUCTED RESPONSE QUESTIONS\n=========================================\n` +
                      `1. State Newton's Second Law of Motion and derive F = ma. (5 Marks)\n2. Differentiate between mass and weight with SI units. (4 Marks)\n3. Explain centripetal acceleration and give daily life examples. (4 Marks)\n\nPrepared by Faculty AI Assessment Engine - The Educators Network.`;
                    downloadFile(paperText, `${genSubject}_${genClass}_ExamPaper.txt`, 'text/plain;charset=utf-8');
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Paper File</span>
                </button>
              </div>
            </div>

            {/* Paper Document Layout */}
            <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-lg space-y-6 text-xs text-slate-800 font-serif">
              {/* Paper Header */}
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-sans">
                  THE EDUCATORS SCHOOL SYSTEM
                </h2>
                <div className="text-xs font-bold text-slate-700">{generatedPaper.title}</div>
                <div className="text-[11px] text-slate-600">{generatedPaper.board}</div>
                <div className="flex justify-between text-[11px] font-sans font-bold pt-2">
                  <span>Subject: {generatedPaper.subject}</span>
                  <span>Time Allowed: {generatedPaper.timeAllowed}</span>
                  <span>Max Marks: {generatedPaper.maxMarks}</span>
                </div>
              </div>

              {/* Section A: MCQs */}
              <div className="space-y-3">
                <div className="font-sans font-bold text-xs uppercase bg-slate-200/80 p-1.5 px-2 rounded">
                  SECTION &ndash; A (Marks 15) &bull; Multiple Choice Questions
                </div>
                <div className="space-y-2.5 font-sans text-xs">
                  {generatedPaper.sectionA.map((q: any) => (
                    <div key={q.qNo} className="space-y-1">
                      <div className="font-medium text-slate-900">
                        <strong>Q{q.qNo}.</strong> {q.text}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-4 text-[11px] text-slate-700">
                        {q.options.map((opt: string, i: number) => (
                          <div key={i}>
                            <span className="font-bold">({String.fromCharCode(65 + i)})</span> {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Short Questions */}
              <div className="space-y-3">
                <div className="font-sans font-bold text-xs uppercase bg-slate-200/80 p-1.5 px-2 rounded">
                  SECTION &ndash; B (Marks 36) &bull; Short Answer Questions (Attempt any Nine)
                </div>
                <div className="space-y-2 font-sans text-xs">
                  {generatedPaper.sectionB.map((q: any) => (
                    <div key={q.qNo} className="flex justify-between items-start">
                      <div className="pr-4">
                        <strong>Q{q.qNo}.</strong> {q.text}
                      </div>
                      <span className="font-bold shrink-0 text-slate-600">({q.marks} Marks)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Long Questions */}
              <div className="space-y-3">
                <div className="font-sans font-bold text-xs uppercase bg-slate-200/80 p-1.5 px-2 rounded">
                  SECTION &ndash; C (Marks 24) &bull; Detailed / Descriptive Questions
                </div>
                <div className="space-y-3 font-sans text-xs">
                  {generatedPaper.sectionC.map((q: any) => (
                    <div key={q.qNo} className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Question No. {q.qNo + 2}:</span>
                        <span>({q.marks} Marks)</span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 leading-relaxed pl-2">{q.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESULTS LOG */}
      {activeTab === 'results_log' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Auto-Graded Examination Dossier Log</h3>
            <button
              type="button"
              onClick={() => {
                const rows = students.slice(0, 10).map((std, idx) => {
                  const obt = 65 + (idx * 3) % 25;
                  const pct = Math.round((obt / 75) * 100);
                  return {
                    'Student Name': std.name,
                    'Roll No': std.rollNo || `RN-0${idx + 1}`,
                    'Class': std.className,
                    'Subject': 'Physics',
                    'Obtained Marks': obt,
                    'Total Marks': 75,
                    'Percentage': `${pct}%`,
                    'Grade': pct >= 80 ? 'A+' : pct >= 70 ? 'A' : 'B',
                    'Status': 'Synced to Marksheet',
                  };
                });
                exportToCsv(rows, 'exam_tabulation_sheet');
              }}
              className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold cursor-pointer"
            >
              Export Tabulation Sheet (.CSV)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Class &amp; Subject</th>
                  <th className="py-2.5 px-3">Obtained / Max</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 6).map((std, idx) => {
                  const obt = 65 + (idx * 3) % 25;
                  const pct = Math.round((obt / 75) * 100);
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{std.name}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-600">{std.rollNo || `RN-0${idx + 1}`}</td>
                      <td className="py-2.5 px-3 text-slate-600">{std.className} &bull; Physics</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{obt} / 75</td>
                      <td className="py-2.5 px-3 font-bold text-purple-700">{pct}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          {pct >= 80 ? 'A+' : pct >= 70 ? 'A' : 'B'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Synced to Marksheet
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
    </div>
  );
}

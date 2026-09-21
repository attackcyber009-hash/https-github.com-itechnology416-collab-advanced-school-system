import React, { useState } from 'react';
import {
  Video,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  HelpCircle,
  Plus,
  Search,
  Award,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
  XCircle,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { LmsCourseModule, LmsQuizQuestion, LmsQuizSubmission } from '../types';
import {
  INITIAL_LMS_MODULES,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_QUIZ_SUBMISSIONS,
} from '../data/phase10Data';

interface DigitalLmsQuizVaultViewProps {
  onPrintCompletionCertificate?: (submission: LmsQuizSubmission) => void;
}

export default function DigitalLmsQuizVaultView({
  onPrintCompletionCertificate,
}: DigitalLmsQuizVaultViewProps) {
  const [activeTab, setActiveTab] = useState<'modules' | 'interactive_quiz' | 'submissions'>(
    'modules'
  );
  const [modules, setModules] = useState<LmsCourseModule[]>(INITIAL_LMS_MODULES);
  const [submissions, setSubmissions] = useState<LmsQuizSubmission[]>(INITIAL_QUIZ_SUBMISSIONS);
  const [questions, setQuestions] = useState<LmsQuizQuestion[]>(INITIAL_QUIZ_QUESTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState<LmsCourseModule | null>(null);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);

  // Interactive Quiz Engine State
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [studentTakerName, setStudentTakerName] = useState('Hamza Aslam');

  // Form State for New Module
  const [moduleForm, setModuleForm] = useState({
    title: '',
    subject: 'Physics',
    targetClass: 'Class 9 (Science)',
    sncSloCode: 'SLO-PHY-9.3.2',
    instructorName: 'Sir Tariq Jamil',
    description: '',
    videoDurationMinutes: 30,
    outcome1: '',
    outcome2: '',
  });

  const filteredModules = modules.filter((m) => {
    const matchesSubject = selectedSubjectFilter === 'All' || m.subject === selectedSubjectFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sncSloCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    const newMod: LmsCourseModule = {
      id: `lms-mod-${Date.now()}`,
      courseCode: `SNC-${moduleForm.subject.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      subject: moduleForm.subject,
      targetClass: moduleForm.targetClass,
      title: moduleForm.title,
      sncSloCode: moduleForm.sncSloCode,
      instructorName: moduleForm.instructorName,
      description: moduleForm.description || 'Single National Curriculum accredited video lecture module with notes.',
      videoDurationMinutes: Number(moduleForm.videoDurationMinutes),
      videoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      pdfLectureNotesUrl: '/docs/lecture_notes_sample.pdf',
      learningOutcomes: [
        moduleForm.outcome1 || 'Master theoretical and conceptual Single National Curriculum SLO benchmarks',
        moduleForm.outcome2 || 'Apply analytical problem solving techniques',
      ],
      totalQuizzes: 5,
      enrolledStudentsCount: 45,
      completionRate: 75,
      status: 'Active',
    };

    setModules([newMod, ...modules]);
    setShowAddModuleModal(false);
    alert(`LMS Video Module "${newMod.title}" successfully published!`);
  };

  const handleAnswerSelect = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers({ ...userAnswers, [questionIdx]: optionIdx });
  };

  const handleFinishQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const newSub: LmsQuizSubmission = {
      id: `qsub-${Date.now()}`,
      moduleId: 'lms-mod-01',
      courseCode: 'SNC-PHY-901',
      studentId: `std-${Date.now()}`,
      studentName: studentTakerName,
      className: 'Class 9 (Science)',
      rollNo: '01',
      totalQuestions: questions.length,
      correctAnswers: score,
      percentage,
      submissionDate: new Date().toISOString().split('T')[0],
      status: percentage >= 60 ? 'Passed' : 'Retake Required',
      feedbackNotes:
        percentage >= 60
          ? 'Passed with competency in SLO-based kinematics and problem solving.'
          : 'Needs remedial review on graphical kinematics calculus.',
    };

    setSubmissions([newSub, ...submissions]);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setSelectedQuizIndex(0);
  };

  return (
    <div id="digital-lms-vault" className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-400/20 rounded-lg text-blue-300 border border-blue-400/30">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Digital LMS Vault, E-Learning Video Hub &amp; SLO Quiz Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-400 text-slate-900">
              Phase 10
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Single National Curriculum (SNC) mapped video modules, digital PDF lecture notes, interactive objective SLO quiz grader, and instant course completion accreditation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModuleModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload E-Learning Module</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Video Modules
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">{modules.length} Modules</div>
            <div className="text-[10px] text-blue-700 font-semibold">SNC SLO Aligned</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Learners
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {modules.reduce((acc, m) => acc + m.enrolledStudentsCount, 0)} Students
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">85.6% Avg Completion</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SLO Quiz Bank
            </div>
            <div className="text-xl font-black text-indigo-700 mt-0.5">
              {questions.length + 32} Items
            </div>
            <div className="text-[10px] text-indigo-600 font-medium">Instant AI Grading</div>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Course Pass Rate
            </div>
            <div className="text-xl font-black text-teal-700 mt-0.5">91.4%</div>
            <div className="text-[10px] text-teal-600 font-medium">Accredited Submissions</div>
          </div>
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'modules'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>SNC E-Learning Modules &amp; Video Lectures</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('interactive_quiz')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'interactive_quiz'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interactive SLO Quiz Engine &amp; Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'submissions'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quiz Submissions &amp; Course Certifications</span>
        </button>
      </div>

      {/* TAB 1: MODULES DIRECTORY */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Filter Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search course title, SLO code, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[10px]">
                      {mod.courseCode} • {mod.targetClass}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-mono font-semibold text-[10px]">
                      {mod.sncSloCode}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{mod.title}</h4>
                  <div className="text-slate-500 text-[11px]">Instructor: <strong>{mod.instructorName}</strong></div>

                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-lg border text-[11px] space-y-1">
                    <strong className="text-slate-700">Target Learning Outcomes (SLO):</strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {mod.learningOutcomes.map((slo, i) => (
                        <li key={i}>{slo}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {mod.videoDurationMinutes} Mins Video • {mod.totalQuizzes} Quizzes
                    </span>
                    <span className="font-bold text-emerald-700">
                      {mod.enrolledStudentsCount} Learners ({mod.completionRate}% Done)
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedModuleForVideo(mod)}
                      className="px-3 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 text-blue-300" />
                      <span>Watch Lecture &amp; Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE QUIZ ENGINE */}
      {activeTab === 'interactive_quiz' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-5 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Single National Curriculum (SNC) Objective Diagnostic Quiz
              </h3>
              <p className="text-slate-500 text-xs">
                Real-time multiple-choice question simulator with SLO explanation feedback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Student Taker:</span>
              <input
                type="text"
                value={studentTakerName}
                onChange={(e) => setStudentTakerName(e.target.value)}
                className="px-2.5 py-1 border rounded font-semibold text-slate-900"
              />
            </div>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="font-bold text-blue-900">
                  Question {selectedQuizIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 bg-blue-200/60 text-blue-900 rounded font-mono font-bold text-[10px]">
                  SLO Ref: {questions[selectedQuizIndex].sloReference} • Difficulty:{' '}
                  {questions[selectedQuizIndex].difficulty}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  {questions[selectedQuizIndex].questionText}
                </h4>

                <div className="space-y-2">
                  {questions[selectedQuizIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[selectedQuizIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleAnswerSelect(selectedQuizIndex, optIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  disabled={selectedQuizIndex === 0}
                  onClick={() => setSelectedQuizIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 border rounded-lg font-bold text-slate-600 disabled:opacity-40"
                >
                  Previous Question
                </button>

                {selectedQuizIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedQuizIndex((prev) => Math.min(questions.length - 1, prev + 1))
                    }
                    className="px-4 py-1.5 bg-[#002147] text-white rounded-lg font-bold"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    Submit &amp; Grade Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-emerald-950">
                Quiz Evaluation Completed for {studentTakerName}!
              </h4>

              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-xs bg-white p-3 rounded-lg border">
                <div>
                  <div className="text-slate-500 text-[10px]">Total Questions</div>
                  <div className="font-bold text-slate-900">{questions.length}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Correct Answers</div>
                  <div className="font-bold text-emerald-700">
                    {
                      questions.filter((q, i) => userAnswers[i] === q.correctOptionIndex).length
                    }
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Percentage</div>
                  <div className="font-black text-blue-900">
                    {Math.round(
                      (questions.filter((q, i) => userAnswers[i] === q.correctOptionIndex).length /
                        questions.length) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold"
                >
                  Take Another Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('submissions')}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold"
                >
                  View All Submissions Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBMISSIONS LEDGER */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">
              Student E-Learning Quiz Submissions &amp; Course Completion Records
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Course Code</th>
                  <th className="p-2.5">Class &amp; Roll</th>
                  <th className="p-2.5">Score / Total</th>
                  <th className="p-2.5">Percentage</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="p-2.5 font-mono text-blue-700">{sub.courseCode}</td>
                    <td className="p-2.5 text-slate-600">{sub.className} ({sub.rollNo})</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      {sub.correctAnswers} / {sub.totalQuestions}
                    </td>
                    <td className="p-2.5 font-black text-slate-900">{sub.percentage}%</td>
                    <td className="p-2.5 text-slate-500">{sub.submissionDate}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'Passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {sub.status === 'Passed' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onPrintCompletionCertificate) {
                              onPrintCompletionCertificate(sub);
                            } else {
                              alert(`Printing Digital Certificate for ${sub.studentName}`);
                            }
                          }}
                          className="px-2.5 py-1 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3" />
                          <span>E-Certificate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: VIDEO PREVIEW */}
      {selectedModuleForVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedModuleForVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModuleForVideo(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center text-white">
              <img
                src={selectedModuleForVideo.videoUrl}
                alt={selectedModuleForVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
                <span className="bg-slate-900/80 px-3 py-1 rounded-full text-[11px] font-bold">
                  {selectedModuleForVideo.videoDurationMinutes} Minutes HD Stream
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Course Overview &amp; SLO Target</div>
              <p className="text-slate-600 leading-relaxed">{selectedModuleForVideo.description}</p>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
                <div>
                  <strong className="text-blue-950 block">Official Lecture PDF Handout</strong>
                  <span className="text-blue-800 text-[10px]">SNC Punjab Curriculum Textbook Exercises Included</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading PDF: ${selectedModuleForVideo.pdfLectureNotesUrl}`)}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedModuleForVideo(null)}
                className="px-4 py-2 border rounded-lg font-bold text-slate-600"
              >
                Close Lecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MODULE */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">Publish E-Learning Module</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModuleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddModule} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electromagnetism &amp; Faraday's Induction Laws"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={moduleForm.subject}
                    onChange={(e) => setModuleForm({ ...moduleForm, subject: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <input
                    type="text"
                    required
                    value={moduleForm.targetClass}
                    onChange={(e) => setModuleForm({ ...moduleForm, targetClass: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Single National Curriculum SLO Code</label>
                  <input
                    type="text"
                    required
                    value={moduleForm.sncSloCode}
                    onChange={(e) => setModuleForm({ ...moduleForm, sncSloCode: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Video Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={moduleForm.videoDurationMinutes}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, videoDurationMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description &amp; Syllabus Overview</label>
                <textarea
                  rows={2}
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Detailed breakdown of conceptual theory..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Publish Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

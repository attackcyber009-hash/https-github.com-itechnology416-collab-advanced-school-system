import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Layers,
  Printer,
  Edit3,
  Sliders,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  QuestionBankItem,
  GeneratedExamPaper,
} from '../types';
import {
  INITIAL_QUESTION_BANK,
  INITIAL_GENERATED_EXAM_PAPER,
} from '../data/phase8Data';

interface ExamPaperGeneratorViewProps {
  onPrintExamPaper?: (paper: GeneratedExamPaper) => void;
}

export default function ExamPaperGeneratorView({
  onPrintExamPaper,
}: ExamPaperGeneratorViewProps) {
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(INITIAL_QUESTION_BANK);
  const [currentPaper, setCurrentPaper] = useState<GeneratedExamPaper>(INITIAL_GENERATED_EXAM_PAPER);

  const [activeTab, setActiveTab] = useState<'paper_preview' | 'question_bank' | 'paper_builder'>('paper_preview');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 9');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // Paper Builder Config State
  const [builderConfig, setBuilderConfig] = useState({
    subject: 'Physics',
    className: 'Class 9 (Science Section)',
    termTitle: 'Annual Terminal Examination 2024',
    totalMarks: 60,
    timeMinutes: 120,
    mcqCount: 12,
    shortCount: 8,
    longCount: 2,
    knowledgePercent: 40,
    understandingPercent: 40,
    applicationPercent: 20,
    includeUrduText: true,
  });

  // Filtered Question Bank
  const filteredQuestions = questionBank.filter((q) => {
    const matchesSub = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'All' || q.gradeLevel.includes(selectedGrade);
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.questionTextUrdu && q.questionTextUrdu.includes(searchQuery)) ||
      q.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesGrade && matchesSearch;
  });

  // Question Form State
  const [questionForm, setQuestionForm] = useState<{
    subject: string;
    gradeLevel: string;
    chapterNumber: number;
    chapterTitle: string;
    questionType: any;
    bloomsLevel: any;
    difficulty: any;
    marks: number;
    questionText: string;
    questionTextUrdu: string;
    options: string[];
    correctOptionIndex: number;
    rubric: string;
    boardReference: string;
  }>({
    subject: 'Physics',
    gradeLevel: 'Class 9',
    chapterNumber: 2,
    chapterTitle: 'Kinematics (حرکیات)',
    questionType: 'Short Question',
    bloomsLevel: 'Understanding',
    difficulty: 'Medium',
    marks: 2,
    questionText: 'Define Uniform Velocity and state its unit in SI system.',
    questionTextUrdu: 'یکساں ویلوسیٹی کی تعریف کریں اور ایس آئی یونٹ تحریر کریں۔',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    rubric: 'Definition: If a body covers equal displacement in equal intervals of time (1 Mark), Unit: m/s (1 Mark).',
    boardReference: 'BISE Lahore 2023',
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: QuestionBankItem = {
      id: `qb-${Date.now()}`,
      subject: questionForm.subject,
      gradeLevel: questionForm.gradeLevel,
      chapterNumber: Number(questionForm.chapterNumber),
      chapterTitle: questionForm.chapterTitle,
      questionType: questionForm.questionType,
      bloomsLevel: questionForm.bloomsLevel,
      difficulty: questionForm.difficulty,
      marks: Number(questionForm.marks),
      questionText: questionForm.questionText,
      questionTextUrdu: questionForm.questionTextUrdu || undefined,
      options: questionForm.questionType === 'MCQ' ? questionForm.options : undefined,
      correctOptionIndex: questionForm.questionType === 'MCQ' ? questionForm.correctOptionIndex : undefined,
      modelAnswerOrRubric: questionForm.rubric,
      boardReferenceYear: questionForm.boardReference || undefined,
    };

    setQuestionBank([newQ, ...questionBank]);
    setShowAddQuestionModal(false);
    alert(`Added Question to Bank: ${newQ.questionType} (${newQ.subject})`);
  };

  const handleGeneratePaper = () => {
    // Generate fresh structured paper aligned with PCTB/FBISE layout
    const generated: GeneratedExamPaper = {
      id: `exp-${Date.now()}`,
      paperCode: `TE-EXAM-2024-${builderConfig.subject.substring(0, 3).toUpperCase()}${builderConfig.className.includes('9') ? '9' : '10'}`,
      examTitle: `${builderConfig.termTitle} - ${builderConfig.subject} (${builderConfig.className})`,
      subject: builderConfig.subject,
      className: builderConfig.className,
      totalMarks: Number(builderConfig.totalMarks),
      allowedTimeMinutes: Number(builderConfig.timeMinutes),
      instructions: [
        'Write your Roll Number clearly on both Objective & Subjective sheets.',
        'Use of blue / black ballpoint is mandatory. Use of correction fluid is forbidden.',
        'Bubble sheet circles must be shaded completely for Section A (MCQs).',
        'Proper mathematical steps, units, and labeled diagrams carry dedicated marks.',
      ],
      sections: [
        {
          sectionName: `SECTION A: OBJECTIVE (MCQs) - ${builderConfig.mcqCount} Marks`,
          sectionMarks: builderConfig.mcqCount,
          instructions: 'Fill the correct circle on the bubble sheet. Cutting or overwriting will be treated as incorrect.',
          questions: [
            {
              questionNo: 1,
              text: 'Which one of the following is the SI unit of thermodynamic temperature?',
              textUrdu: builderConfig.includeUrduText ? 'درج ذیل میں سے کون سا تھرموڈائنامک درجہ حرارت کا ایس آئی یونٹ ہے؟' : undefined,
              options: ['Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)', 'Joule (J)'],
              marks: 1,
              chapter: 'Ch 1: Measurements',
              blooms: 'Knowledge',
            },
            {
              questionNo: 2,
              text: 'The least count of standard Vernier Calipers is:',
              textUrdu: builderConfig.includeUrduText ? 'معیاری ورنئیر کیلیپرز کا لیسٹ کاؤنٹ کتنا ہوتا ہے؟' : undefined,
              options: ['0.1 mm', '0.01 mm', '0.001 cm', '1 cm'],
              marks: 1,
              chapter: 'Ch 1: Measurements',
              blooms: 'Understanding',
            },
            {
              questionNo: 3,
              text: 'Rate of change of momentum of a body is equal to applied:',
              textUrdu: builderConfig.includeUrduText ? 'کسی جسم کے مومینٹم میں تبدیلی کی شرح کس کے برابر ہوتی ہے؟' : undefined,
              options: ['Torque', 'Force', 'Velocity', 'Acceleration'],
              marks: 1,
              chapter: 'Ch 3: Dynamics',
              blooms: 'Knowledge',
            },
            {
              questionNo: 4,
              text: 'Value of gravitational acceleration g at the surface of Earth is approximately:',
              textUrdu: builderConfig.includeUrduText ? 'زمین کی سطح پر جی (g) کی قیمت کتنی ہوتی ہے؟' : undefined,
              options: ['9.8 m/s²', '10 m/s', '9.8 N', '1.6 m/s²'],
              marks: 1,
              chapter: 'Ch 5: Gravitation',
              blooms: 'Understanding',
            },
          ],
        },
        {
          sectionName: `SECTION B: SHORT QUESTIONS - ${builderConfig.shortCount * 2} Marks`,
          sectionMarks: builderConfig.shortCount * 2,
          instructions: `Attempt any 5 questions from the following. Each question carries 2 marks.`,
          questions: [
            {
              questionNo: 5,
              text: 'Differentiate between Distance and Displacement with their standard units.',
              textUrdu: builderConfig.includeUrduText ? 'فاصلہ اور ہٹاؤ (ڈسپلسمینٹ) میں فرق واضح کریں۔' : undefined,
              marks: 2,
              chapter: 'Ch 2: Kinematics',
              blooms: 'Understanding',
            },
            {
              questionNo: 6,
              text: 'State Newton’s First Law of Motion and define Inertia.',
              textUrdu: builderConfig.includeUrduText ? 'نیوٹن کا حرکت کا پہلا قانون بیان کریں اور انرشیا کی تعریف کریں۔' : undefined,
              marks: 2,
              chapter: 'Ch 3: Dynamics',
              blooms: 'Knowledge',
            },
            {
              questionNo: 7,
              text: 'Define Centripetal Force and write its mathematical equation in terms of mass, radius and speed.',
              textUrdu: builderConfig.includeUrduText ? 'سینٹری پیٹل فورس کی تعریف اور مساوات لکھیں۔' : undefined,
              marks: 2,
              chapter: 'Ch 3: Dynamics',
              blooms: 'Application',
            },
            {
              questionNo: 8,
              text: 'What is meant by Center of Gravity? Give two practical examples.',
              textUrdu: builderConfig.includeUrduText ? 'سینٹر آف گریویٹی سے کیا مراد ہے؟ دو مثالیں دیں۔' : undefined,
              marks: 2,
              chapter: 'Ch 4: Turning Effect of Forces',
              blooms: 'Understanding',
            },
          ],
        },
        {
          sectionName: `SECTION C: LONG & NUMERICAL QUESTIONS - 18 Marks`,
          sectionMarks: 18,
          instructions: 'Attempt any 2 long questions. Each question carries 9 marks [Theory 5 marks + Numerical 4 marks].',
          questions: [
            {
              questionNo: 9,
              text: '(a) Derive the Second Equation of Motion S = vit + 1/2 at² using speed-time graph. (b) A car moves with uniform velocity of 36 km/h for 10s. Find total distance travelled.',
              textUrdu: builderConfig.includeUrduText ? '(الف) حرکت کی دوسری مساوات S = vit + 1/2 at² بذریعہ گراف ثابت کریں۔ (ب) ایک گاڑی 36 کلومیٹر فی گھنٹہ کی رفتار سے 10 سیکنڈ تک چلتی ہے، کل فاصلہ معلوم کریں۔' : undefined,
              marks: 9,
              chapter: 'Ch 2: Kinematics',
              blooms: 'Analysis & Synthesis',
            },
            {
              questionNo: 10,
              text: '(a) Explain Newton’s Law of Universal Gravitation and calculate mass of earth. (b) A stone of mass 100g is dropped from a height of 20m. Find its kinetic energy just before hitting ground.',
              textUrdu: builderConfig.includeUrduText ? '(الف) نیوٹن کا قانونِ کششِ ثقل بیان کریں اور زمین کا ماس معلوم کریں۔ (ب) 100 گرام کا پتھر 20 میٹر اونچائی سے گرایا جاتا ہے، زمین سے ٹکرانے سے پہلے کائنیٹک انرجی معلوم کریں۔' : undefined,
              marks: 9,
              chapter: 'Ch 5 & 6',
              blooms: 'Application',
            },
          ],
        },
      ],
      preparedBy: 'Department Examination Board (The Educators)',
      approvedByHead: 'Prof. Tariq Mahmood (Principal)',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setCurrentPaper(generated);
    setActiveTab('paper_preview');
    alert(`Automated Exam Paper Generated: ${generated.examTitle}`);
  };

  return (
    <div id="exam-paper-generator-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-violet-400/20 rounded-lg text-violet-300 border border-violet-400/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              PCTB &amp; FBISE Exam Paper Generator &amp; Question Bank
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-400 text-slate-900">
              Phase 8
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Bloom's Taxonomy aligned paper synthesis (Knowledge 40%, Understanding 40%, Application 20%), bilingual Urdu/English typography, marking rubrics, and formal printable question papers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddQuestionModal(true)}
            className="px-3.5 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question to Bank</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Verified Question Bank
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">
              {questionBank.length} Items
            </div>
            <div className="text-[10px] text-slate-400">MCQs, Shorts, Longs</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Curriculum Standard
            </div>
            <div className="text-base font-black text-violet-700 mt-0.5">PCTB / BISE &amp; FBISE</div>
            <div className="text-[10px] text-violet-600 font-semibold">SLO &amp; Bloom's Matrix</div>
          </div>
          <div className="p-2.5 bg-violet-50 text-violet-700 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Exam Paper
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {currentPaper.totalMarks} Marks
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              Time: {currentPaper.allowedTimeMinutes} Mins
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Bilingual Support
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">English + اردو</div>
            <div className="text-[10px] text-amber-600 font-medium">Nastaliq Script Enabled</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('paper_preview')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'paper_preview'
              ? 'border-violet-700 text-violet-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paper Preview &amp; Print</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paper_builder')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'paper_builder'
              ? 'border-violet-700 text-violet-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>1-Click Balanced Paper Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('question_bank')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'question_bank'
              ? 'border-violet-700 text-violet-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Question Bank Registry ({questionBank.length})</span>
        </button>
      </div>

      {/* TAB 1: FORMAL PAPER PREVIEW */}
      {activeTab === 'paper_preview' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-6 shadow-xs font-sans">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-violet-800">
                Paper Code: {currentPaper.paperCode}
              </div>
              <h2 className="text-base font-black text-slate-900">{currentPaper.examTitle}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onPrintExamPaper) {
                    onPrintExamPaper(currentPaper);
                  } else {
                    window.print();
                  }
                }}
                className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Examination Paper</span>
              </button>
            </div>
          </div>

          {/* Paper Content Styled as Real Board Paper */}
          <div className="max-w-4xl mx-auto p-8 bg-white border-2 border-slate-800 rounded-xl space-y-6 shadow-sm">
            {/* Header with Bismillah */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
              <div className="text-lg font-serif font-bold text-slate-800">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div className="text-xl font-black text-[#002147] tracking-wider uppercase">
                THE EDUCATORS (A PROJECT OF BEACONHOUSE)
              </div>
              <div className="text-sm font-bold text-slate-700 uppercase">
                {currentPaper.examTitle}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 text-xs font-bold text-slate-800 border-t border-slate-300">
                <div>Class: {currentPaper.className}</div>
                <div>Subject: {currentPaper.subject}</div>
                <div>Total Marks: {currentPaper.totalMarks}</div>
                <div>Time Allowed: {currentPaper.allowedTimeMinutes} Mins</div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-700">
                <div>
                  <strong>Student Name:</strong> ____________________________
                </div>
                <div>
                  <strong>Roll No:</strong> ______________
                </div>
                <div>
                  <strong>Section:</strong> _________
                </div>
              </div>
            </div>

            {/* General Instructions */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                General Instructions for Candidates:
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                {currentPaper.instructions?.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* Paper Sections */}
            {currentPaper.sections?.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-4 pt-3 border-t border-slate-300">
                <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded border border-slate-300">
                  <h3 className="font-black text-slate-900 text-xs tracking-wider uppercase">
                    {sec.sectionName}
                  </h3>
                  <span className="font-mono font-bold text-xs text-[#002147]">
                    [Marks: {sec.sectionMarks}]
                  </span>
                </div>

                <div className="text-xs text-slate-600 italic pl-1">
                  <strong>Note:</strong> {sec.instructions}
                </div>

                <div className="space-y-3 pl-1">
                  {sec.questions.map((q) => (
                    <div key={q.questionNo} className="space-y-1.5 text-xs text-slate-800">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-2">
                          <span className="font-bold font-mono">Q{q.questionNo}.</span>
                          <div>
                            <p className="font-medium text-slate-900 leading-relaxed">{q.text}</p>
                            {q.textUrdu && (
                              <p className="text-slate-700 font-serif font-medium text-sm mt-0.5 text-right dir-rtl leading-relaxed">
                                {q.textUrdu}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-700 shrink-0">
                          ({q.marks})
                        </span>
                      </div>

                      {/* Options for MCQs */}
                      {q.options && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-6 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const letters = ['A', 'B', 'C', 'D'];
                            return (
                              <div
                                key={oIdx}
                                className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                              >
                                <span className="font-bold font-mono text-[#002147]">
                                  ({letters[oIdx]})
                                </span>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer Signatures */}
            <div className="pt-6 border-t-2 border-slate-800 flex justify-between items-center text-xs text-slate-800 font-bold">
              <div>Prepared By: {currentPaper.preparedBy}</div>
              <div>Approved By: {currentPaper.approvedByHead}</div>
              <div>Controller of Examinations</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 1-CLICK BALANCED PAPER BUILDER */}
      {activeTab === 'paper_builder' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Automated SLO &amp; Bloom's Taxonomy Balanced Paper Engine
            </h3>
            <p className="text-xs text-slate-500">
              Configure parameters to instantly synthesize a standard Punjab / Federal Board examination paper matching your exact chapter weightage and difficulty distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-[#002147] uppercase text-[11px] tracking-wider">
                Exam Metadata &amp; Timings
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={builderConfig.subject}
                  onChange={(e) => setBuilderConfig({ ...builderConfig, subject: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Physics">Physics (طبیعیات)</option>
                  <option value="Mathematics">Mathematics (ریاضی)</option>
                  <option value="Chemistry">Chemistry (کیمیا)</option>
                  <option value="Biology">Biology (حیاتیات)</option>
                  <option value="Computer Science">Computer Science (کمپیوٹر)</option>
                  <option value="English">English</option>
                  <option value="Urdu">Urdu (اردو لازمی)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                <select
                  value={builderConfig.className}
                  onChange={(e) => setBuilderConfig({ ...builderConfig, className: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Class 9 (Science Section)">Class 9 (Science Section)</option>
                  <option value="Class 10 (Matric Section)">Class 10 (Matric Section)</option>
                  <option value="Class 8 (Middle)">Class 8 (Middle)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <select
                    value={builderConfig.totalMarks}
                    onChange={(e) =>
                      setBuilderConfig({ ...builderConfig, totalMarks: Number(e.target.value) })
                    }
                    className="w-full p-2 border rounded-lg bg-white font-mono font-bold"
                  >
                    <option value={50}>50 Marks (Terminal)</option>
                    <option value={60}>60 Marks (Board Spec)</option>
                    <option value={75}>75 Marks (Matric Science)</option>
                    <option value={100}>100 Marks (Full Paper)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time (Minutes)</label>
                  <input
                    type="number"
                    value={builderConfig.timeMinutes}
                    onChange={(e) =>
                      setBuilderConfig({ ...builderConfig, timeMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="includeUrdu"
                  checked={builderConfig.includeUrduText}
                  onChange={(e) =>
                    setBuilderConfig({ ...builderConfig, includeUrduText: e.target.checked })
                  }
                  className="rounded text-violet-600"
                />
                <label htmlFor="includeUrdu" className="font-bold text-slate-700">
                  Include Bilingual Nastaliq Urdu Translation
                </label>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-[#002147] uppercase text-[11px] tracking-wider">
                Bloom's Taxonomy &amp; Question Ratio
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Knowledge (یادداشت):</span>
                    <span className="font-mono font-bold">{builderConfig.knowledgePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={60}
                    value={builderConfig.knowledgePercent}
                    onChange={(e) =>
                      setBuilderConfig({
                        ...builderConfig,
                        knowledgePercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-violet-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Understanding (فہم و ادراک):</span>
                    <span className="font-mono font-bold">{builderConfig.understandingPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={60}
                    value={builderConfig.understandingPercent}
                    onChange={(e) =>
                      setBuilderConfig({
                        ...builderConfig,
                        understandingPercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Application &amp; Numerical (اطلاق):</span>
                    <span className="font-mono font-bold">{builderConfig.applicationPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    value={builderConfig.applicationPercent}
                    onChange={(e) =>
                      setBuilderConfig({
                        ...builderConfig,
                        applicationPercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleGeneratePaper}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-700 to-[#002147] hover:from-violet-800 hover:to-[#0b3366] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Synthesize &amp; Compile Balanced Exam Paper</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION BANK REGISTRY */}
      {activeTab === 'question_bank' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap gap-1.5 font-bold">
              {['All', 'Physics', 'Mathematics', 'Computer Science', 'Biology'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    selectedSubject === sub
                      ? 'bg-violet-800 text-white border-violet-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search question text or chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-800 rounded font-bold text-[10px]">
                      {q.subject} • {q.gradeLevel}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-semibold text-[10px]">
                      {q.questionType} ({q.marks} Marks)
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[10px]">
                      Bloom: {q.bloomsLevel}
                    </span>
                  </div>
                  {q.boardReferenceYear && (
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      🏛️ {q.boardReferenceYear}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-500">{q.chapterTitle}</div>

                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 text-sm">{q.questionText}</p>
                  {q.questionTextUrdu && (
                    <p className="text-slate-700 font-serif text-sm dir-rtl text-right font-medium">
                      {q.questionTextUrdu}
                    </p>
                  )}
                </div>

                {q.options && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded border text-xs ${
                          q.correctOptionIndex === idx
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}) {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                  <strong>Marking Scheme / Model Answer:</strong> {q.modelAnswerOrRubric}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD QUESTION */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-700" />
                <h3 className="font-bold text-slate-900 text-base">Add Question to Institutional Bank</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={questionForm.subject}
                    onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Level</label>
                  <select
                    value={questionForm.gradeLevel}
                    onChange={(e) => setQuestionForm({ ...questionForm, gradeLevel: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10 (Matric)">Class 10 (Matric)</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Name &amp; No. *</label>
                <input
                  type="text"
                  required
                  value={questionForm.chapterTitle}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, chapterTitle: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Type</label>
                  <select
                    value={questionForm.questionType}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, questionType: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Question">Short Question</option>
                    <option value="Long / Analytical">Long / Analytical</option>
                    <option value="Numerical Problem">Numerical Problem</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bloom's Level</label>
                  <select
                    value={questionForm.bloomsLevel}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, bloomsLevel: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Knowledge">Knowledge</option>
                    <option value="Understanding">Understanding</option>
                    <option value="Application">Application</option>
                    <option value="Analysis & Synthesis">Analysis &amp; Synthesis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={questionForm.marks}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, marks: Number(e.target.value) })
                    }
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={questionForm.questionText}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, questionText: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Text in Urdu (اردو ترجمہ)
                </label>
                <textarea
                  rows={2}
                  value={questionForm.questionTextUrdu}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, questionTextUrdu: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg font-serif text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marking Rubric / Model Answer</label>
                <textarea
                  rows={2}
                  value={questionForm.rubric}
                  onChange={(e) => setQuestionForm({ ...questionForm, rubric: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save to Question Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

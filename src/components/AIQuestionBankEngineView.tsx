import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Printer,
  Plus,
  Search,
  Layers,
  Award,
  Zap,
  Sliders,
  ShieldCheck,
  BrainCircuit,
  FileCheck,
} from 'lucide-react';
import { AIQuestionItem, GeneratedExamPaper } from '../types';
import { INITIAL_AI_QUESTIONS, INITIAL_GENERATED_EXAM_PAPERS } from '../data/phase16Data';

interface AIQuestionBankEngineViewProps {
  onPrintExamPaper?: (paper: GeneratedExamPaper) => void;
  onPrintQuestionItem?: (item: AIQuestionItem) => void;
}

export default function AIQuestionBankEngineView({
  onPrintExamPaper,
  onPrintQuestionItem,
}: AIQuestionBankEngineViewProps) {
  const [activeTab, setActiveTab] = useState<'question_bank' | 'paper_generator' | 'generated_papers'>('question_bank');

  const [questions, setQuestions] = useState<AIQuestionItem[]>(INITIAL_AI_QUESTIONS);
  const [examPapers, setExamPapers] = useState<GeneratedExamPaper[]>(INITIAL_GENERATED_EXAM_PAPERS);

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  // New Question Form State
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [subject, setSubject] = useState<AIQuestionItem['subject']>('Physics');
  const [gradeClass, setGradeClass] = useState<AIQuestionItem['gradeClass']>('Class 10');
  const [chapterTopic, setChapterTopic] = useState('');
  const [cognitiveDomain, setCognitiveDomain] = useState<AIQuestionItem['cognitiveDomain']>('Understanding & Application (50%)');
  const [questionType, setQuestionType] = useState<AIQuestionItem['questionType']>('Short Answer Question (SAQ)');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(4);
  const [sloRefCode, setSloRefCode] = useState('SNC-SLO-PHY-10.3.1');
  const [difficultyLevel, setDifficultyLevel] = useState<AIQuestionItem['difficultyLevel']>('Medium');

  // Generator State
  const [genSubject, setGenSubject] = useState('Physics');
  const [genGrade, setGenGrade] = useState('Class 10');
  const [genTerm, setGenTerm] = useState<GeneratedExamPaper['termExamName']>('Mid-Term Examination 2024');
  const [genMarks, setGenMarks] = useState(75);
  const [genDuration, setGenDuration] = useState(120);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !correctAnswer) return;

    const newQ: AIQuestionItem = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      questionCode: `SNC-${subject.slice(0, 3).toUpperCase()}${gradeClass.split(' ')[1] || '10'}-Q${Math.floor(100 + Math.random() * 900)}`,
      subject,
      gradeClass,
      chapterTopic: chapterTopic || 'General Syllabus Domain',
      cognitiveDomain,
      questionType,
      questionText,
      correctAnswer,
      marks: Number(marks),
      sloRefCode,
      difficultyLevel,
    };

    setQuestions([newQ, ...questions]);
    setIsAddingQuestion(false);
    setQuestionText('');
    setCorrectAnswer('');
    setChapterTopic('');
  };

  const handleGenerateExamPaper = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Auto pick matching questions
      const selectedQs = questions.filter(
        (q) => q.subject === genSubject && q.gradeClass === genGrade
      );

      const finalQs = selectedQs.length > 0 ? selectedQs : questions.slice(0, 3);

      const newPaper: GeneratedExamPaper = {
        id: `EP-${Date.now().toString().slice(-4)}`,
        paperCode: `EXAM-${new Date().getFullYear()}-${genSubject.slice(0, 3).toUpperCase()}${genGrade.split(' ')[1] || '10'}-AUTO`,
        paperTitle: `${genGrade} ${genSubject} ${genTerm} (SNC AI Blueprint)`,
        subject: genSubject,
        gradeClass: genGrade,
        termExamName: genTerm,
        totalMarks: genMarks,
        durationMinutes: genDuration,
        generatedAt: 'Today, Just now',
        status: 'Approved by HOD',
        questions: finalQs,
        markingSchemeRubric: `SNC Standard Rubric: Knowledge (30%), Application (50%), Problem Solving (20%). Step-wise marks allocated for equations, diagrams & final numerical units.`,
      };

      setExamPapers([newPaper, ...examPapers]);
      setIsGenerating(false);
      setActiveTab('generated_papers');
    }, 1200);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapterTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sloRefCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSubject = subjectFilter === 'ALL' || q.subject === subjectFilter;
    const matchGrade = gradeFilter === 'ALL' || q.gradeClass === gradeFilter;

    return matchSearch && matchSubject && matchGrade;
  });

  return (
    <div id="ai-question-bank-view" className="space-y-4 text-xs">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#002147] to-indigo-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-300 border border-purple-500/30">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              AI Question Bank, SNC Paper Blueprint &amp; Exam Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-400 text-slate-950">
              Phase 16
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Single National Curriculum (SNC) Student Learning Outcome (SLO) taxonomy, cognitive domain balancing (30/50/20 rule) &amp; 1-click exam paper dispatcher.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingQuestion(!isAddingQuestion)}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingQuestion ? 'Close Form' : 'Add Question Item'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('question_bank')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'question_bank'
              ? 'border-purple-600 text-purple-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>SNC Question Repository ({questions.length} Items)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paper_generator')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'paper_generator'
              ? 'border-purple-600 text-purple-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>1-Click AI Exam Blueprint Generator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('generated_papers')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'generated_papers'
              ? 'border-purple-600 text-purple-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Generated Exam Papers ({examPapers.length})</span>
        </button>
      </div>

      {/* TAB 1: QUESTION REPOSITORY */}
      {activeTab === 'question_bank' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          {isAddingQuestion && (
            <form onSubmit={handleAddQuestion} className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
              <div className="font-bold text-purple-950 text-sm">Add New SNC Question to Master Repository:</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Pakistan Studies">Pakistan Studies</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Grade Class *</label>
                  <select
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11 (FSc / A-Level)">Class 11 (FSc / A-Level)</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Cognitive Domain Blueprint *</label>
                  <select
                    value={cognitiveDomain}
                    onChange={(e) => setCognitiveDomain(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Knowledge & Recall (30%)">Knowledge &amp; Recall (30%)</option>
                    <option value="Understanding & Application (50%)">Understanding &amp; Application (50%)</option>
                    <option value="Analytical & Problem Solving (20%)">Analytical &amp; Problem Solving (20%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Question Type</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Multiple Choice MCQ">Multiple Choice MCQ</option>
                    <option value="Short Answer Question (SAQ)">Short Answer Question (SAQ)</option>
                    <option value="Long Analytical / Numerical">Long Analytical / Numerical</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Marks Allocated</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">SNC SLO Code Ref</label>
                  <input
                    type="text"
                    value={sloRefCode}
                    onChange={(e) => setSloRefCode(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Chapter / Topic Description</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3: Dynamics & Momentum"
                  value={chapterTopic}
                  onChange={(e) => setChapterTopic(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Type clear question statement..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Correct Answer / Model Solution *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide model solution or correct MCQ option..."
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-1.5 border rounded font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-purple-700 text-white rounded font-bold hover:bg-purple-800"
                >
                  Save Question Item
                </button>
              </div>
            </form>
          )}

          {/* Search & Filter */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search question code, text or SLO code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-1.5 border rounded bg-white text-xs font-semibold"
              >
                <option value="ALL">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="p-1.5 border rounded bg-white text-xs font-semibold"
              >
                <option value="ALL">All Grades</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11 (FSc / A-Level)">Class 11</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded text-[11px] border border-purple-200">
                      {q.questionCode}
                    </span>
                    <span className="font-bold text-slate-800">{q.subject} • {q.gradeClass}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600 font-medium">{q.chapterTopic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold rounded text-[10px]">
                      {q.marks} Marks
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">
                      {q.cognitiveDomain}
                    </span>
                  </div>
                </div>

                <div className="font-semibold text-slate-900 text-xs bg-slate-50/70 p-3 rounded border">
                  {q.questionText}
                </div>

                {q.mcqOptions && q.mcqOptions.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] pl-2">
                    {q.mcqOptions.map((opt, i) => (
                      <div key={i} className="text-slate-700 font-medium">
                        ({String.fromCharCode(65 + i)}) {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-950">
                  <strong>Model Solution:</strong> {q.correctAnswer}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t">
                  <span>SLO Ref: <strong className="text-purple-900">{q.sloRefCode}</strong></span>
                  <div className="flex items-center gap-2">
                    <span>Difficulty: <strong>{q.difficultyLevel}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onPrintQuestionItem) onPrintQuestionItem(q);
                        else alert(`Printing Question Item Card for ${q.questionCode}`);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[10px] inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Card</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 1-CLICK AI EXAM PAPER GENERATOR */}
      {activeTab === 'paper_generator' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Single National Curriculum (SNC) Cognitive Blueprint Paper Assembler
            </h3>
            <p className="text-slate-500 text-[11px]">
              Automatically generates balanced question papers obeying the 30% Recall, 50% Application, and 20% Analytical ratio with solution rubrics.
            </p>
          </div>

          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-4">
            <div className="font-bold text-purple-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Configure Examination Blueprint Parameters:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block">Target Subject *</label>
                <select
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  className="w-full p-2 border rounded bg-white font-semibold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Target Grade *</label>
                <select
                  value={genGrade}
                  onChange={(e) => setGenGrade(e.target.value)}
                  className="w-full p-2 border rounded bg-white font-semibold"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 11 (FSc / A-Level)">Class 11 (FSc)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Examination Term</label>
                <select
                  value={genTerm}
                  onChange={(e) => setGenTerm(e.target.value as any)}
                  className="w-full p-2 border rounded bg-white font-semibold"
                >
                  <option value="Mid-Term Examination 2024">Mid-Term Examination 2024</option>
                  <option value="Annual Final Assessment">Annual Final Assessment</option>
                  <option value="Send-Up Mock Test">Send-Up Mock Test</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Total Paper Marks</label>
                <input
                  type="number"
                  value={genMarks}
                  onChange={(e) => setGenMarks(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Duration (Minutes)</label>
                <input
                  type="number"
                  value={genDuration}
                  onChange={(e) => setGenDuration(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateExamPaper}
                  disabled={isGenerating}
                  className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold flex items-center justify-center gap-2 shadow transition"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>{isGenerating ? 'Synthesizing Blueprint...' : 'Assemble AI Exam Paper'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GENERATED EXAM PAPERS */}
      {activeTab === 'generated_papers' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Approved Examination Papers &amp; Marking Rubrics
            </h3>
            <p className="text-slate-500 text-[11px]">
              Ready for high-security campus printing or digital distribution.
            </p>
          </div>

          <div className="space-y-4">
            {examPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono font-bold text-purple-900 text-sm">{paper.paperCode}</div>
                    <div className="font-bold text-slate-900 text-base">{paper.paperTitle}</div>
                    <div className="text-[11px] text-slate-500">{paper.termExamName} • {paper.generatedAt}</div>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                    {paper.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded border text-[11px] space-y-1">
                  <div className="font-bold text-slate-800">Asssembled Questions ({paper.questions?.length || 0} Items):</div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {paper.questions?.map((q, idx) => (
                      <li key={idx}>
                        <strong className="text-purple-900">{q.questionCode}:</strong> {q.questionText.slice(0, 80)}... ({q.marks} Marks)
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded border border-purple-200 text-[11px] text-purple-950">
                  <strong>Evaluation Marking Rubric:</strong> {paper.markingSchemeRubric}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-[11px] text-slate-600">
                    Total Marks: <strong>{paper.totalMarks}</strong> | Duration: <strong>{paper.durationMinutes} Mins</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintExamPaper) onPrintExamPaper(paper);
                      else alert(`Printing Official Exam Paper & Marking Scheme for ${paper.paperCode}`);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px] flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Exam Paper &amp; Rubric</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

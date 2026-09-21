import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Scale,
  Percent,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Calculator,
  Save,
  Printer,
  Copy,
  Info,
  Award,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import {
  ClassInfo,
  ExamTerm,
  GradeBand,
  AssessmentWeightageComponent,
  SubjectGradingPolicy,
} from '../../../types';

interface TeacherGradingPolicyEditorProps {
  classes: ClassInfo[];
  terms?: ExamTerm[];
  onPolicySaved?: (policy: SubjectGradingPolicy) => void;
}

// Default standard grade bands
const DEFAULT_GRADE_BANDS: GradeBand[] = [
  {
    id: 'gb-1',
    grade: 'A+',
    minPercentage: 90,
    maxPercentage: 100,
    gpaPoint: 4.0,
    descriptor: 'Exceptional Distinction',
    remarksTemplate: 'Exemplary conceptual grasp and outstanding analytical accuracy.',
  },
  {
    id: 'gb-2',
    grade: 'A',
    minPercentage: 80,
    maxPercentage: 89,
    gpaPoint: 3.7,
    descriptor: 'Excellent Mastery',
    remarksTemplate: 'Consistently strong academic performance with commendable depth.',
  },
  {
    id: 'gb-3',
    grade: 'B',
    minPercentage: 70,
    maxPercentage: 79,
    gpaPoint: 3.0,
    descriptor: 'Very Good / Above Average',
    remarksTemplate: 'Demonstrates solid understanding with regular participation.',
  },
  {
    id: 'gb-4',
    grade: 'C',
    minPercentage: 60,
    maxPercentage: 69,
    gpaPoint: 2.5,
    descriptor: 'Good / Average',
    remarksTemplate: 'Meets expected benchmarks; focused revision recommended.',
  },
  {
    id: 'gb-5',
    grade: 'D',
    minPercentage: 50,
    maxPercentage: 59,
    gpaPoint: 2.0,
    descriptor: 'Satisfactory / Pass',
    remarksTemplate: 'Attained minimum required learning competencies.',
  },
  {
    id: 'gb-6',
    grade: 'E',
    minPercentage: 40,
    maxPercentage: 49,
    gpaPoint: 1.0,
    descriptor: 'Marginal Pass / Probation',
    remarksTemplate: 'Borderline performance; targeted remedial tutoring required.',
  },
  {
    id: 'gb-7',
    grade: 'F',
    minPercentage: 0,
    maxPercentage: 39,
    gpaPoint: 0.0,
    descriptor: 'Unsatisfactory / Fail',
    remarksTemplate: 'Did not attain requisite learning outcomes; mandatory re-examination.',
  },
];

// Default standard components
const DEFAULT_COMPONENTS: AssessmentWeightageComponent[] = [
  {
    id: 'comp-1',
    name: 'Term Written / Theory Exam',
    weightPercentage: 50,
    maxMarks: 100,
    minPassingMarks: 40,
    isMandatoryToPass: true,
    category: 'Written',
  },
  {
    id: 'comp-2',
    name: 'Practical / Lab & Viva Voce',
    weightPercentage: 20,
    maxMarks: 50,
    minPassingMarks: 20,
    isMandatoryToPass: true,
    category: 'Practical',
  },
  {
    id: 'comp-3',
    name: 'Monthly Unit Tests & Quizzes',
    weightPercentage: 15,
    maxMarks: 50,
    minPassingMarks: 18,
    isMandatoryToPass: false,
    category: 'Classwork',
  },
  {
    id: 'comp-4',
    name: 'Daily Homework & Notebooks',
    weightPercentage: 10,
    maxMarks: 25,
    minPassingMarks: 10,
    isMandatoryToPass: false,
    category: 'Homework',
  },
  {
    id: 'comp-5',
    name: 'Class Attendance & Conduct',
    weightPercentage: 5,
    maxMarks: 10,
    minPassingMarks: 5,
    isMandatoryToPass: false,
    category: 'Attendance',
  },
];

// Initial mock policies stored in local state
const INITIAL_POLICIES: SubjectGradingPolicy[] = [
  {
    id: 'pol-1',
    termId: 'trm-1',
    termName: 'First Term Examination 2024–2025',
    academicYear: '2024–2025',
    className: 'Class One',
    subjectName: 'Mathematics',
    totalSubjectMarks: 100,
    overallPassingPercentage: 40,
    components: DEFAULT_COMPONENTS,
    gradeBands: DEFAULT_GRADE_BANDS,
    attendanceThresholdPercent: 75,
    maxGraceMarks: 3,
    allowRetakeExam: true,
    separatePracticalPassing: true,
    notesOrInstructions:
      'Students must clear both written theory and practical notebook with at least 40% separately. Calculators prohibited in Section A.',
    lastUpdated: '2024-09-18 14:35',
    updatedBy: 'Mrs. Ayesha Siddiqa (Senior Math Faculty)',
  },
  {
    id: 'pol-2',
    termId: 'trm-2',
    termName: 'Midterm Examination 2024–2025',
    academicYear: '2024–2025',
    className: 'Class One',
    subjectName: 'English Language',
    totalSubjectMarks: 100,
    overallPassingPercentage: 40,
    components: [
      {
        id: 'comp-eng-1',
        name: 'Literature & Grammar Written Exam',
        weightPercentage: 55,
        maxMarks: 100,
        minPassingMarks: 40,
        isMandatoryToPass: true,
        category: 'Written',
      },
      {
        id: 'comp-eng-2',
        name: 'Oral Reading & Phonetics Viva',
        weightPercentage: 15,
        maxMarks: 30,
        minPassingMarks: 12,
        isMandatoryToPass: false,
        category: 'Practical',
      },
      {
        id: 'comp-eng-3',
        name: 'Creative Writing & Spelling Tests',
        weightPercentage: 15,
        maxMarks: 40,
        minPassingMarks: 15,
        isMandatoryToPass: false,
        category: 'Classwork',
      },
      {
        id: 'comp-eng-4',
        name: 'Handwriting & Homework Diary',
        weightPercentage: 10,
        maxMarks: 20,
        minPassingMarks: 8,
        isMandatoryToPass: false,
        category: 'Homework',
      },
      {
        id: 'comp-eng-5',
        name: 'Attendance & Active Participation',
        weightPercentage: 5,
        maxMarks: 10,
        minPassingMarks: 4,
        isMandatoryToPass: false,
        category: 'Attendance',
      },
    ],
    gradeBands: DEFAULT_GRADE_BANDS,
    attendanceThresholdPercent: 75,
    maxGraceMarks: 3,
    allowRetakeExam: true,
    separatePracticalPassing: false,
    notesOrInstructions:
      'Handwriting assessment accounts for 5 marks in Section C. Reading comprehension is strictly timed.',
    lastUpdated: '2024-09-19 11:10',
    updatedBy: 'Mrs. Ayesha Siddiqa',
  },
];

const STANDARD_PRESETS = [
  {
    name: 'General School Board (50/20/15/10/5)',
    description: '50% Written, 20% Practical/Viva, 15% Monthly Tests, 10% Homework, 5% Attendance',
    components: DEFAULT_COMPONENTS,
  },
  {
    name: 'Primary Continuous Assessment (40/30/30)',
    description: '40% Term Exam, 30% Monthly Classwork/Quizzes, 30% Homework & Projects',
    components: [
      {
        id: 'p-1',
        name: 'Term Summative Assessment',
        weightPercentage: 40,
        maxMarks: 50,
        minPassingMarks: 20,
        isMandatoryToPass: true,
        category: 'Written' as const,
      },
      {
        id: 'p-2',
        name: 'Monthly Formative Class Quizzes',
        weightPercentage: 30,
        maxMarks: 50,
        minPassingMarks: 18,
        isMandatoryToPass: false,
        category: 'Classwork' as const,
      },
      {
        id: 'p-3',
        name: 'Continuous Homework & Project Portfolios',
        weightPercentage: 30,
        maxMarks: 50,
        minPassingMarks: 18,
        isMandatoryToPass: false,
        category: 'Homework' as const,
      },
    ],
  },
  {
    name: 'STEM & Lab Science Standard (40/30/20/10)',
    description: '40% Theory Exam, 30% Lab Experiments & Journal, 20% Quizzes, 10% STEM Project',
    components: [
      {
        id: 'stem-1',
        name: 'Summative Written Theory Paper',
        weightPercentage: 40,
        maxMarks: 75,
        minPassingMarks: 30,
        isMandatoryToPass: true,
        category: 'Written' as const,
      },
      {
        id: 'stem-2',
        name: 'Laboratory Experimentation & Journal',
        weightPercentage: 30,
        maxMarks: 50,
        minPassingMarks: 20,
        isMandatoryToPass: true,
        category: 'Practical' as const,
      },
      {
        id: 'stem-3',
        name: 'Unit Conceptual Tests',
        weightPercentage: 20,
        maxMarks: 40,
        minPassingMarks: 16,
        isMandatoryToPass: false,
        category: 'Classwork' as const,
      },
      {
        id: 'stem-4',
        name: 'Term Science Model / Project',
        weightPercentage: 10,
        maxMarks: 25,
        minPassingMarks: 10,
        isMandatoryToPass: false,
        category: 'Homework' as const,
      },
    ],
  },
  {
    name: 'O-Level / Cambridge Style (70/20/10)',
    description: '70% Final Written Papers, 20% Mock / Midterm Exams, 10% Coursework Portfolio',
    components: [
      {
        id: 'olevel-1',
        name: 'Final Written Exam Papers (P1 & P2)',
        weightPercentage: 70,
        maxMarks: 100,
        minPassingMarks: 40,
        isMandatoryToPass: true,
        category: 'Written' as const,
      },
      {
        id: 'olevel-2',
        name: 'Midterm & Mock Examinations',
        weightPercentage: 20,
        maxMarks: 100,
        minPassingMarks: 40,
        isMandatoryToPass: false,
        category: 'Classwork' as const,
      },
      {
        id: 'olevel-3',
        name: 'Internal Assessed Coursework',
        weightPercentage: 10,
        maxMarks: 50,
        minPassingMarks: 20,
        isMandatoryToPass: false,
        category: 'Homework' as const,
      },
    ],
  },
];

export default function TeacherGradingPolicyEditor({
  classes,
  terms = [
    {
      id: 'trm-1',
      title: 'First Term Examination 2024–2025',
      startDate: '2024-09-10',
      endDate: '2024-09-25',
      academicYear: '2024–2025',
      status: 'Active',
    },
    {
      id: 'trm-2',
      title: 'Midterm Examination 2024–2025',
      startDate: '2024-12-01',
      endDate: '2024-12-15',
      academicYear: '2024–2025',
      status: 'Upcoming',
    },
    {
      id: 'trm-3',
      title: 'Final Term Examination 2024–2025',
      startDate: '2025-03-05',
      endDate: '2025-03-20',
      academicYear: '2024–2025',
      status: 'Upcoming',
    },
  ],
  onPolicySaved,
}: TeacherGradingPolicyEditorProps) {
  // Navigation & context selection
  const [selectedTermId, setSelectedTermId] = useState<string>('trm-1');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class One');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Policy storage
  const [policies, setPolicies] = useState<SubjectGradingPolicy[]>(INITIAL_POLICIES);

  // Active policy under edit
  const currentTerm = terms.find((t) => t.id === selectedTermId) || terms[0];

  const existingPolicy = policies.find(
    (p) =>
      p.termId === selectedTermId &&
      p.className === selectedClass &&
      p.subjectName === selectedSubject
  );

  // Editor working state
  const [components, setComponents] = useState<AssessmentWeightageComponent[]>(
    existingPolicy?.components || DEFAULT_COMPONENTS
  );
  const [gradeBands, setGradeBands] = useState<GradeBand[]>(
    existingPolicy?.gradeBands || DEFAULT_GRADE_BANDS
  );
  const [overallPassPercent, setOverallPassPercent] = useState<number>(
    existingPolicy?.overallPassingPercentage ?? 40
  );
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(
    existingPolicy?.attendanceThresholdPercent ?? 75
  );
  const [maxGraceMarks, setMaxGraceMarks] = useState<number>(existingPolicy?.maxGraceMarks ?? 3);
  const [separatePractical, setSeparatePractical] = useState<boolean>(
    existingPolicy?.separatePracticalPassing ?? true
  );
  const [allowRetake, setAllowRetake] = useState<boolean>(
    existingPolicy?.allowRetakeExam ?? true
  );
  const [policyNotes, setPolicyNotes] = useState<string>(
    existingPolicy?.notesOrInstructions ||
      'Students must clear both written theory and practical notebook with at least 40% separately. Calculators prohibited in Section A.'
  );

  // Toast / notification feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [sourceTermToCopy, setSourceTermToCopy] = useState<string>('trm-1');
  const [showAddCompModal, setShowAddCompModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompWeight, setNewCompWeight] = useState(10);
  const [newCompMaxMarks, setNewCompMaxMarks] = useState(25);
  const [newCompMinPass, setNewCompMinPass] = useState(10);
  const [newCompCategory, setNewCompCategory] = useState<AssessmentWeightageComponent['category']>('Classwork');
  const [newCompMandatory, setNewCompMandatory] = useState(false);

  // Interactive Live Simulator state
  const [simulatorScores, setSimulatorScores] = useState<Record<string, number>>({});

  // Whenever user selects another term/class/subject, refresh editor state from existing or defaults
  const handleSwitchContext = (termId: string, className: string, subject: string) => {
    setSelectedTermId(termId);
    setSelectedClass(className);
    setSelectedSubject(subject);

    const match = policies.find(
      (p) => p.termId === termId && p.className === className && p.subjectName === subject
    );

    if (match) {
      setComponents(match.components);
      setGradeBands(match.gradeBands);
      setOverallPassPercent(match.overallPassingPercentage);
      setAttendanceThreshold(match.attendanceThresholdPercent);
      setMaxGraceMarks(match.maxGraceMarks);
      setSeparatePractical(match.separatePracticalPassing);
      setAllowRetake(match.allowRetakeExam);
      setPolicyNotes(match.notesOrInstructions || '');
    } else {
      // Load standard defaults
      setComponents(DEFAULT_COMPONENTS);
      setGradeBands(DEFAULT_GRADE_BANDS);
      setOverallPassPercent(40);
      setAttendanceThreshold(75);
      setMaxGraceMarks(3);
      setSeparatePractical(true);
      setAllowRetake(true);
      setPolicyNotes('Standard institutional criteria applied. Adjust as appropriate for this subject.');
    }
  };

  // Weightage calculation
  const totalWeight = components.reduce((sum, c) => sum + Number(c.weightPercentage || 0), 0);
  const isWeightValid = totalWeight === 100;

  // Component manipulation
  const handleUpdateComponent = (
    id: string,
    field: keyof AssessmentWeightageComponent,
    value: any
  ) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length <= 1) {
      alert('At least one assessment component is required in a grading policy.');
      return;
    }
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) {
      alert('Please enter component name');
      return;
    }
    const created: AssessmentWeightageComponent = {
      id: `comp-${Date.now()}`,
      name: newCompName.trim(),
      weightPercentage: Number(newCompWeight),
      maxMarks: Number(newCompMaxMarks),
      minPassingMarks: Number(newCompMinPass),
      category: newCompCategory,
      isMandatoryToPass: newCompMandatory,
    };
    setComponents((prev) => [...prev, created]);
    setNewCompName('');
    setShowAddCompModal(false);
  };

  // Grade band manipulation
  const handleUpdateGradeBand = (id: string, field: keyof GradeBand, value: any) => {
    setGradeBands((prev) =>
      prev.map((gb) => (gb.id === id ? { ...gb, [field]: value } : gb))
    );
  };

  // Apply Preset
  const handleLoadPreset = (presetComponents: AssessmentWeightageComponent[]) => {
    setComponents(presetComponents);
    setSaveSuccessMsg('Preset template loaded successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Copy Policy from another Term
  const handleCopyFromTerm = () => {
    const source = policies.find(
      (p) =>
        p.termId === sourceTermToCopy &&
        p.className === selectedClass &&
        p.subjectName === selectedSubject
    );
    if (source) {
      setComponents(source.components);
      setGradeBands(source.gradeBands);
      setOverallPassPercent(source.overallPassingPercentage);
      setAttendanceThreshold(source.attendanceThresholdPercent);
      setMaxGraceMarks(source.maxGraceMarks);
      setSeparatePractical(source.separatePracticalPassing);
      setAllowRetake(source.allowRetakeExam);
      setPolicyNotes(source.notesOrInstructions || '');
      setSaveSuccessMsg(`Policy replicated from ${source.termName}!`);
    } else {
      // If none found for that exact subject, take default components
      setComponents(DEFAULT_COMPONENTS);
      setSaveSuccessMsg('Loaded standard default policy for term.');
    }
    setCopyModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Apply to all subjects in current class
  const handleApplyToAllSubjects = () => {
    const subjectOptions = [
      'Mathematics',
      'English Language',
      'General Science',
      'Computer Studies',
      'Urdu Adab',
      'Islamic Studies',
      'Social Studies',
    ];

    const updated = [...policies];
    subjectOptions.forEach((subj) => {
      const idx = updated.findIndex(
        (p) =>
          p.termId === selectedTermId &&
          p.className === selectedClass &&
          p.subjectName === subj
      );
      const newPol: SubjectGradingPolicy = {
        id: idx >= 0 ? updated[idx].id : `pol-${Date.now()}-${subj}`,
        termId: selectedTermId,
        termName: currentTerm?.title || selectedTermId,
        academicYear: currentTerm?.academicYear || '2024–2025',
        className: selectedClass,
        subjectName: subj,
        totalSubjectMarks: 100,
        overallPassingPercentage: overallPassPercent,
        components,
        gradeBands,
        attendanceThresholdPercent: attendanceThreshold,
        maxGraceMarks,
        allowRetakeExam: allowRetake,
        separatePracticalPassing: separatePractical,
        notesOrInstructions: policyNotes,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedBy: 'Lead Subject Teacher',
      };
      if (idx >= 0) {
        updated[idx] = newPol;
      } else {
        updated.push(newPol);
      }
    });

    setPolicies(updated);
    setSaveSuccessMsg(`Grading policy synchronized across ALL subjects in ${selectedClass}!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Save active policy
  const handleSavePolicy = () => {
    if (!isWeightValid) {
      alert(`Assessment weightages must sum to exactly 100%. Current total is ${totalWeight}%. Please adjust.`);
      return;
    }

    const newPolicyRecord: SubjectGradingPolicy = {
      id: existingPolicy ? existingPolicy.id : `pol-${Date.now()}`,
      termId: selectedTermId,
      termName: currentTerm?.title || selectedTermId,
      academicYear: currentTerm?.academicYear || '2024–2025',
      className: selectedClass,
      subjectName: selectedSubject,
      totalSubjectMarks: 100,
      overallPassingPercentage: overallPassPercent,
      components,
      gradeBands,
      attendanceThresholdPercent: attendanceThreshold,
      maxGraceMarks,
      allowRetakeExam: allowRetake,
      separatePracticalPassing: separatePractical,
      notesOrInstructions: policyNotes,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Mrs. Ayesha Siddiqa (Authorized Teacher)',
    };

    const existsIndex = policies.findIndex(
      (p) =>
        p.termId === selectedTermId &&
        p.className === selectedClass &&
        p.subjectName === selectedSubject
    );

    let updatedPolicies: SubjectGradingPolicy[];
    if (existsIndex >= 0) {
      updatedPolicies = [...policies];
      updatedPolicies[existsIndex] = newPolicyRecord;
    } else {
      updatedPolicies = [newPolicyRecord, ...policies];
    }

    setPolicies(updatedPolicies);
    if (onPolicySaved) {
      onPolicySaved(newPolicyRecord);
    }

    setSaveSuccessMsg(
      `Grading policy for ${selectedSubject} (${selectedClass} - ${currentTerm?.title}) saved and published!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Simulator calculations
  const calculateSimulatedResult = () => {
    let totalWeightedScore = 0;
    let failedMandatoryComponent = false;

    components.forEach((c) => {
      const enteredScore = simulatorScores[c.id] ?? (c.maxMarks * 0.75);
      const ratio = c.maxMarks > 0 ? enteredScore / c.maxMarks : 0;
      const componentWeighted = ratio * c.weightPercentage;
      totalWeightedScore += componentWeighted;

      if (c.isMandatoryToPass && enteredScore < c.minPassingMarks) {
        failedMandatoryComponent = true;
      }
    });

    const roundedPercent = Math.min(100, Math.max(0, Math.round(totalWeightedScore * 10) / 10));

    // Find grade band
    const matchedBand =
      gradeBands.find(
        (gb) => roundedPercent >= gb.minPercentage && roundedPercent <= gb.maxPercentage
      ) || gradeBands[gradeBands.length - 1];

    const isPassed =
      roundedPercent >= overallPassPercent && !failedMandatoryComponent;

    return {
      percentage: roundedPercent,
      grade: matchedBand ? matchedBand.grade : 'F',
      gpa: matchedBand ? matchedBand.gpaPoint : 0.0,
      descriptor: matchedBand ? matchedBand.descriptor : 'Unsatisfactory',
      remarks: matchedBand ? matchedBand.remarksTemplate : '',
      isPassed,
      failedMandatoryComponent,
    };
  };

  const simResult = calculateSimulatedResult();

  const handlePrint = () => {
    window.print();
  };

  const subjectOptions = [
    'Mathematics',
    'English Language',
    'General Science',
    'Computer Studies',
    'Urdu Adab',
    'Islamic Studies',
    'Social Studies',
  ];

  return (
    <div id="grading-policy-editor-suite" className="space-y-6">
      {/* 1. Header Toolbar & Context Scope Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-50 rounded-xl text-sky-700">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Grading Policy &amp; Assessment Criteria Editor</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Active &amp; Official
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define term-specific grade distributions, component weightage breakdowns, and passing thresholds for subjects.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCopyModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy From Term</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToAllSubjects}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              title="Apply this exact assessment structure to English, Science, Urdu, and all other subjects in this class"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Apply to All Subjects in {selectedClass}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Policy Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleSavePolicy}
              className="px-4 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Policy</span>
            </button>
          </div>
        </div>

        {/* Term, Class & Subject Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Academic Term / Semester
            </label>
            <div className="relative">
              <select
                value={selectedTermId}
                onChange={(e) =>
                  handleSwitchContext(e.target.value, selectedClass, selectedSubject)
                }
                className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
              >
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.academicYear}) - {t.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Target Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) =>
                handleSwitchContext(selectedTermId, e.target.value, selectedSubject)
              }
              className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) =>
                handleSwitchContext(selectedTermId, selectedClass, e.target.value)
              }
              className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
            >
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Context metadata status bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Currently Editing:</span>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
              {currentTerm?.title}
            </span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800">{selectedClass}</span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800">{selectedSubject}</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Last modified:{' '}
            <span className="text-slate-600 font-semibold">
              {existingPolicy?.lastUpdated || 'Initial Institutional Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Assessment Component Weightage Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600" />
              <span>Assessment Component Weightage Breakdown</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the exact percentage allocated to theory, practical, monthly tests, homework, and attendance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Presets dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Load Institutional Preset</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Weightage Model
                </div>
                {STANDARD_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(preset.components)}
                    className="w-full text-left p-2 rounded-lg hover:bg-sky-50 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 text-xs">{preset.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCompModal(true)}
              className="px-3 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Component</span>
            </button>
          </div>
        </div>

        {/* Real-time Weightage Total Meter */}
        <div
          className={`p-4 rounded-xl border transition ${
            isWeightValid
              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
              : 'bg-rose-50/70 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              {isWeightValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                Total Assessment Weight:{' '}
                <strong className="text-sm">{totalWeight}%</strong> / 100%
              </span>
            </div>
            <span className="text-xs font-bold">
              {isWeightValid
                ? 'Balanced 100% Distribution (Valid)'
                : totalWeight < 100
                ? `${100 - totalWeight}% Unallocated (Requires Adjustment)`
                : `${totalWeight - 100}% Exceeded Over 100% (Requires Adjustment)`}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            {components.map((c, i) => {
              const colors = [
                'bg-sky-500',
                'bg-indigo-500',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-purple-500',
                'bg-rose-500',
              ];
              const color = colors[i % colors.length];
              return (
                <div
                  key={c.id}
                  style={{ width: `${Math.max(0, c.weightPercentage)}%` }}
                  className={`h-full ${color} transition-all duration-300`}
                  title={`${c.name}: ${c.weightPercentage}%`}
                />
              );
            })}
          </div>

          {/* Component legend pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-200/60 text-[11px]">
            {components.map((c, i) => {
              const dots = [
                'bg-sky-500',
                'bg-indigo-500',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-purple-500',
                'bg-rose-500',
              ];
              return (
                <div key={c.id} className="flex items-center gap-1.5 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                  <span className={`w-2 h-2 rounded-full ${dots[i % dots.length]}`} />
                  <span>{c.name}: <strong>{c.weightPercentage}%</strong></span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Components Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Assessment Component</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 w-44">Weight Percentage (%)</th>
                <th className="py-2.5 px-3 w-28">Max Raw Marks</th>
                <th className="py-2.5 px-3 w-28">Min Pass Marks</th>
                <th className="py-2.5 px-3 text-center">Must Pass Independently</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {components.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => handleUpdateComponent(c.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </td>

                  <td className="py-2.5 px-3">
                    <select
                      value={c.category}
                      onChange={(e) =>
                        handleUpdateComponent(c.id, 'category', e.target.value)
                      }
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="Written">Written</option>
                      <option value="Practical">Practical</option>
                      <option value="Classwork">Classwork</option>
                      <option value="Homework">Homework</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Behavior">Behavior</option>
                    </select>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={c.weightPercentage}
                        onChange={(e) =>
                          handleUpdateComponent(
                            c.id,
                            'weightPercentage',
                            Number(e.target.value)
                          )
                        }
                        className="w-20 accent-sky-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={c.weightPercentage}
                          onChange={(e) =>
                            handleUpdateComponent(
                              c.id,
                              'weightPercentage',
                              Number(e.target.value)
                            )
                          }
                          className="w-14 px-2 py-1 text-xs text-center font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="1"
                      value={c.maxMarks}
                      onChange={(e) =>
                        handleUpdateComponent(c.id, 'maxMarks', Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                    />
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      max={c.maxMarks}
                      value={c.minPassingMarks}
                      onChange={(e) =>
                        handleUpdateComponent(
                          c.id,
                          'minPassingMarks',
                          Number(e.target.value)
                        )
                      }
                      className="w-20 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={c.isMandatoryToPass}
                      onChange={(e) =>
                        handleUpdateComponent(c.id, 'isMandatoryToPass', e.target.checked)
                      }
                      className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                      title="If checked, student fails the overall subject if this component score is below minimum pass marks"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Delete Component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Grade Bands & Scale Criteria */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Grade Distribution Scale &amp; Cutoff Boundaries</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Define minimum and maximum score percentages for each letter grade, associated GPA points, and standardized report card remarks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setGradeBands(DEFAULT_GRADE_BANDS)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Standard Scale</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3 w-16">Grade</th>
                <th className="py-2.5 px-3 w-28">Min %</th>
                <th className="py-2.5 px-3 w-28">Max %</th>
                <th className="py-2.5 px-3 w-20">GPA Point</th>
                <th className="py-2.5 px-3 w-48">Achievement Descriptor</th>
                <th className="py-2.5 px-3">Standard Teacher Remarks Template</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gradeBands.map((gb) => (
                <tr key={gb.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-black text-sm">
                    <span
                      className={`px-2 py-0.5 rounded font-mono ${
                        gb.grade === 'A+' || gb.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : gb.grade === 'B' || gb.grade === 'C'
                          ? 'bg-sky-100 text-sky-800'
                          : gb.grade === 'D' || gb.grade === 'E'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {gb.grade}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gb.minPercentage}
                        onChange={(e) =>
                          handleUpdateGradeBand(gb.id, 'minPercentage', Number(e.target.value))
                        }
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gb.maxPercentage}
                        onChange={(e) =>
                          handleUpdateGradeBand(gb.id, 'maxPercentage', Number(e.target.value))
                        }
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4.0"
                      value={gb.gpaPoint}
                      onChange={(e) =>
                        handleUpdateGradeBand(gb.id, 'gpaPoint', Number(e.target.value))
                      }
                      className="w-14 px-2 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded-lg outline-none"
                    />
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={gb.descriptor}
                      onChange={(e) =>
                        handleUpdateGradeBand(gb.id, 'descriptor', e.target.value)
                      }
                      className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-300 rounded-lg outline-none"
                    />
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={gb.remarksTemplate}
                      onChange={(e) =>
                        handleUpdateGradeBand(gb.id, 'remarksTemplate', e.target.value)
                      }
                      className="w-full px-2 py-1 text-xs text-slate-700 border border-slate-300 rounded-lg outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Subject-Specific Evaluation Criteria & Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Academic Passing Criteria &amp; Rules</span>
          </h4>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Overall Minimum Passing Percentage
                </span>
                <span className="text-[11px] text-slate-500">
                  Minimum weighted score to earn credit in {selectedSubject}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="33"
                  max="60"
                  value={overallPassPercent}
                  onChange={(e) => setOverallPassPercent(Number(e.target.value))}
                  className="w-16 px-2 py-1 font-bold font-mono text-xs border border-slate-300 rounded-lg text-center"
                />
                <span className="font-bold text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Minimum Attendance Eligibility Threshold
                </span>
                <span className="text-[11px] text-slate-500">
                  Required class attendance to sit in term examinations
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  className="w-16 px-2 py-1 font-bold font-mono text-xs border border-slate-300 rounded-lg text-center"
                />
                <span className="font-bold text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Maximum Allowable Grace Marks
                </span>
                <span className="text-[11px] text-slate-500">
                  Discretionary marks for borderline pass students (requires admin approval)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={maxGraceMarks}
                  onChange={(e) => setMaxGraceMarks(Number(e.target.value))}
                  className="w-16 px-2 py-1 font-bold font-mono text-xs border border-slate-300 rounded-lg text-center"
                />
                <span className="font-bold text-slate-500">marks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={separatePractical}
                  onChange={(e) => setSeparatePractical(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                />
                <span className="font-bold text-slate-800">
                  Enforce Separate Passing for Written Theory and Practical / Lab
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowRetake}
                  onChange={(e) => setAllowRetake(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                />
                <span className="font-bold text-slate-800">
                  Permit Retake / Improvement Examination for Failing Students
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Syllabus / Teacher Directives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Subject Directives, Rubrics &amp; Exam Instructions</span>
          </h4>

          <div className="text-xs text-slate-500">
            Document special grading rubrics, disallowed materials, neatness scoring guidelines, or oral examination instructions for this term.
          </div>

          <textarea
            rows={5}
            value={policyNotes}
            onChange={(e) => setPolicyNotes(e.target.value)}
            placeholder="Write guidelines, e.g. Step marks allocation for math problems, handwriting deduction criteria, negative marking rules..."
            className="w-full flex-1 p-3 text-xs text-slate-800 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans"
          />
        </div>
      </div>

      {/* 5. Live Interactive Score Simulator & Grade Calculator */}
      <div className="bg-gradient-to-br from-slate-900 to-[#002147] text-white rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calculator className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>Interactive Grading Simulator &amp; Live Calculator</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Verification Tool
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                Test your current policy live by inputting hypothetical student raw scores to simulate final percentages, letter grades, and passing verdicts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Component Input Sliders */}
          <div className="lg:col-span-2 space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">
              Simulated Student Raw Scores
            </div>

            <div className="space-y-3">
              {components.map((c) => {
                const currentScore = simulatorScores[c.id] ?? Math.round(c.maxMarks * 0.78);
                const pct = c.maxMarks > 0 ? Math.round((currentScore / c.maxMarks) * 100) : 0;
                const isPassingComponent = currentScore >= c.minPassingMarks;

                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {c.name} ({c.weightPercentage}% weight)
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isPassingComponent
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isPassingComponent ? 'Pass' : 'Below Min Pass'}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {currentScore} / {c.maxMarks} ({pct}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={c.maxMarks}
                        step="1"
                        value={currentScore}
                        onChange={(e) =>
                          setSimulatorScores({
                            ...simulatorScores,
                            [c.id]: Number(e.target.value),
                          })
                        }
                        className="flex-1 accent-sky-400 cursor-pointer h-2 bg-white/20 rounded-lg"
                      />
                      <input
                        type="number"
                        min="0"
                        max={c.maxMarks}
                        value={currentScore}
                        onChange={(e) =>
                          setSimulatorScores({
                            ...simulatorScores,
                            [c.id]: Math.min(c.maxMarks, Math.max(0, Number(e.target.value))),
                          })
                        }
                        className="w-16 px-2 py-0.5 bg-white/10 border border-white/20 rounded text-center text-xs font-mono font-bold text-white outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Computed Outcome Card */}
          <div className="bg-white/10 p-5 rounded-xl border border-white/15 space-y-4">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Simulated Grade Outcome
            </div>

            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-3xl font-black text-white font-mono">
                  {simResult.percentage}%
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Final Weighted Score</div>
              </div>

              <div className="text-right">
                <div
                  className={`text-2xl font-black font-mono px-3 py-1 rounded-xl ${
                    simResult.grade.startsWith('A')
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : simResult.grade.startsWith('B') || simResult.grade.startsWith('C')
                      ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                      : 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                  }`}
                >
                  {simResult.grade}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-mono">
                  GPA: {simResult.gpa.toFixed(1)} / 4.0
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Evaluation Result:</span>
                <span
                  className={`font-black px-2 py-0.5 rounded text-[11px] ${
                    simResult.isPassed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {simResult.isPassed ? 'PASSED SUBJECT' : 'FAILED / REMEDIAL'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Descriptor:</span>
                <span className="font-bold text-white">{simResult.descriptor}</span>
              </div>

              {simResult.failedMandatoryComponent && (
                <div className="p-2 bg-rose-500/20 border border-rose-500/30 rounded text-[11px] text-rose-200">
                  <strong>Policy Violation:</strong> Student scored below minimum passing threshold in a mandatory component.
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">Generated Remarks:</span>
                <p className="text-xs text-slate-100 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                  "{simResult.remarks}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Assessment Component */}
      {showAddCompModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Add Custom Assessment Component</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCompModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddComponent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oral Quranic Recitation / Science Fair Project / Surprise Quiz"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCompWeight}
                    onChange={(e) => setNewCompWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCompCategory}
                    onChange={(e) => setNewCompCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Written">Written</option>
                    <option value="Practical">Practical</option>
                    <option value="Classwork">Classwork</option>
                    <option value="Homework">Homework</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Behavior">Behavior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Max Raw Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCompMaxMarks}
                    onChange={(e) => setNewCompMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Min Passing Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={newCompMaxMarks}
                    value={newCompMinPass}
                    onChange={(e) => setNewCompMinPass(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newCompMandatory}
                    onChange={(e) => setNewCompMandatory(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 border-slate-300"
                  />
                  <span>Mandatory to pass (independent failing condition)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCompModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white font-bold rounded-lg shadow"
                >
                  Add Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Copy Policy from Another Term */}
      {copyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Copy className="w-4 h-4 text-sky-600" />
                <span>Replicate Grading Policy From Term</span>
              </h4>
              <button
                type="button"
                onClick={() => setCopyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Choose the source academic term to import weightage distributions and grade criteria into{' '}
                <strong>{currentTerm?.title}</strong> for{' '}
                <strong>
                  {selectedClass} - {selectedSubject}
                </strong>
                :
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Term</label>
                <select
                  value={sourceTermToCopy}
                  onChange={(e) => setSourceTermToCopy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                >
                  {terms
                    .filter((t) => t.id !== selectedTermId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.academicYear})
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                <strong>Note:</strong> Replicating will replace the active working weightages and criteria for this subject with the source term's configuration.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCopyModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCopyFromTerm}
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white font-bold rounded-lg shadow"
                >
                  Copy &amp; Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

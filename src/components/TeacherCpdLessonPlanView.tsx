import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  Printer,
  Search,
  Star,
  FileText,
  UserCheck,
  Send,
  AlertCircle,
  TrendingUp,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import {
  TeacherCpdTraining,
  LessonPlanSubmission,
  TeacherClassroomAudit,
  StaffMember,
} from '../types';
import {
  INITIAL_TEACHER_CPD_TRAININGS,
  INITIAL_LESSON_PLANS,
  INITIAL_CLASSROOM_AUDITS,
} from '../data/phase9Data';

interface TeacherCpdLessonPlanViewProps {
  staffList: StaffMember[];
  onPrintCpdCertificate?: (training: TeacherCpdTraining, staffName: string) => void;
  onPrintLessonPlan?: (plan: LessonPlanSubmission) => void;
}

export default function TeacherCpdLessonPlanView({
  staffList,
  onPrintCpdCertificate,
  onPrintLessonPlan,
}: TeacherCpdLessonPlanViewProps) {
  const [activeTab, setActiveTab] = useState<'cpd_trainings' | 'lesson_plans' | 'audits'>('cpd_trainings');
  const [trainings, setTrainings] = useState<TeacherCpdTraining[]>(INITIAL_TEACHER_CPD_TRAININGS);
  const [lessonPlans, setLessonPlans] = useState<LessonPlanSubmission[]>(INITIAL_LESSON_PLANS);
  const [audits, setAudits] = useState<TeacherClassroomAudit[]>(INITIAL_CLASSROOM_AUDITS);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lesson Plan Form State
  const [planForm, setPlanForm] = useState({
    teacherName: 'Sir Tariq Jamil',
    subject: 'Physics',
    className: 'Class 9 (Science)',
    weekNumber: 5,
    topicTitle: '',
    sloGoals: '',
    pedagogyMethod: 'Direct Instruction & Whiteboard' as any,
    resourcesRequired: 'PCTB Textbook, Smart Screen, Scientific Graph Sheets',
    assessmentStrategy: 'Exit Ticket Quiz & Whiteboard problem solving',
    homeworkAssigned: '',
  });

  // Classroom Audit Form State
  const [auditForm, setAuditForm] = useState({
    teacherName: 'Madam Shahida Parveen',
    observerName: 'Prof. Tariq Mahmood (Principal)',
    className: 'Class 9',
    subject: 'Mathematics',
    pacing: 5,
    engagement: 4,
    clarity: 5,
    avUsage: 4,
    discipline: 5,
    strengths: '',
    areasForDevelopment: '',
  });

  const handleAddLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: LessonPlanSubmission = {
      id: `lp-${Date.now()}`,
      planCode: `LP-${planForm.subject.slice(0, 3).toUpperCase()}-9-W${planForm.weekNumber}`,
      teacherId: 'emp-2',
      teacherName: planForm.teacherName,
      subject: planForm.subject,
      className: planForm.className,
      weekNumber: Number(planForm.weekNumber),
      dateRange: 'Upcoming Week',
      topicTitle: planForm.topicTitle,
      sloGoals: planForm.sloGoals,
      pedagogyMethod: planForm.pedagogyMethod,
      resourcesRequired: planForm.resourcesRequired.split(',').map((s) => s.trim()),
      assessmentStrategy: planForm.assessmentStrategy,
      homeworkAssigned: planForm.homeworkAssigned,
      status: 'Submitted for Review',
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setLessonPlans([newPlan, ...lessonPlans]);
    setShowPlanModal(false);
    alert(`Lesson Plan '${newPlan.topicTitle}' submitted for Vice Principal review!`);
  };

  const handleApprovePlan = (id: string) => {
    setLessonPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Approved by Vice Principal',
              reviewerFeedback: 'Formally approved. Aligned with SNC benchmark.',
            }
          : p
      )
    );
  };

  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      Number(auditForm.pacing) +
      Number(auditForm.engagement) +
      Number(auditForm.clarity) +
      Number(auditForm.avUsage) +
      Number(auditForm.discipline);

    let rating: any = 'Satisfactory (B)';
    if (total >= 23) rating = 'Outstanding (A*)';
    else if (total >= 19) rating = 'Very Good (A)';
    else if (total < 15) rating = 'Needs Coaching (C)';

    const newAudit: TeacherClassroomAudit = {
      id: `aud-${Date.now()}`,
      auditCode: `AUD-2024-${Math.floor(100 + Math.random() * 900)}`,
      teacherId: 'emp-1',
      teacherName: auditForm.teacherName,
      observerName: auditForm.observerName,
      className: auditForm.className,
      subject: auditForm.subject,
      date: new Date().toISOString().split('T')[0],
      scores: {
        lessonPacing: Number(auditForm.pacing),
        studentEngagement: Number(auditForm.engagement),
        conceptClarity: Number(auditForm.clarity),
        whiteboardAndAvUsage: Number(auditForm.avUsage),
        classroomDiscipline: Number(auditForm.discipline),
      },
      totalScoreOutOf25: total,
      ratingGrade: rating,
      observerStrengths: auditForm.strengths || 'Clear instructional delivery and structured board work.',
      areasForDevelopment: auditForm.areasForDevelopment || 'Encourage quiet students to participate.',
      followUpDate: '2024-11-30',
    };

    setAudits([newAudit, ...audits]);
    setShowAuditModal(false);
    alert(`Classroom observation audit saved. Rating: ${rating}`);
  };

  return (
    <div id="teacher-cpd-suite" className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-400/20 rounded-lg text-indigo-300 border border-indigo-400/30">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Faculty CPD, Lesson Planning &amp; Academic Quality Assurance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-400 text-slate-900">
              Phase 9
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Single National Curriculum (SNC) faculty development workshops, SLO-aligned lesson plan repository with VP digital approvals, and 5-dimensional classroom walkthrough quality audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPlanModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Lesson Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAuditModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Star className="w-4 h-4" />
            <span>Log Classroom Audit</span>
          </button>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              CPD Training Hours
            </div>
            <div className="text-xl font-black text-indigo-900 mt-0.5">36 Hours</div>
            <div className="text-[10px] text-indigo-600 font-medium">Accredited Modules</div>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Approved Lesson Plans
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {lessonPlans.filter((p) => p.status.includes('Approved')).length} Plans
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">SLO &amp; Bloom Aligned</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Class Audits Logged
            </div>
            <div className="text-xl font-black text-blue-700 mt-0.5">
              {audits.length} Audits
            </div>
            <div className="text-[10px] text-blue-600 font-medium">Avg Score: 23/25</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Faculty
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5">28 Educators</div>
            <div className="text-[10px] text-teal-600 font-medium">100% Certified</div>
          </div>
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('cpd_trainings')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'cpd_trainings'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>SNC &amp; Faculty CPD Modules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lesson_plans')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'lesson_plans'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Weekly Lesson Plan Repository</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audits')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'audits'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Classroom Observation Walkthrough Audits</span>
        </button>
      </div>

      {/* TAB 1: CPD MODULES */}
      {activeTab === 'cpd_trainings' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Continuous Professional Development (CPD) Calendar
              </h3>
              <p className="text-slate-500">
                Accredited by Beaconhouse Staff Development Center &amp; Punjab Education Foundation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainings.map((tr) => (
              <div
                key={tr.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                      {tr.trainingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tr.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tr.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{tr.moduleTitle}</h4>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div>
                      <strong>Lead Trainer:</strong> {tr.trainerName}
                    </div>
                    <div>
                      <strong>Accreditation:</strong> {tr.accreditedBy}
                    </div>
                    <div>
                      <strong>Duration:</strong> {tr.durationHours} Hours • <strong>Venue:</strong> {tr.venueOrPlatform}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-200">
                    <div className="font-bold text-slate-700 text-[10px] uppercase">
                      Core Learning Outcomes:
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {tr.learningOutcomes.map((lo, i) => (
                        <li key={i} className="line-clamp-1">
                          {lo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">
                    Enrolled: <strong>{tr.enrolledStaffIds.length} Teachers</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintCpdCertificate) {
                        onPrintCpdCertificate(tr, 'Sir Tariq Jamil');
                      } else {
                        alert(`Generating CPD Certificate for ${tr.moduleTitle}`);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LESSON PLANS */}
      {activeTab === 'lesson_plans' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Single National Curriculum (SNC) Weekly Lesson Plan Dossier
              </h3>
              <p className="text-slate-500">
                Coordinated with textbook learning outcomes, pedagogical strategy, and homework.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPlanModal(true)}
              className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-bold"
            >
              + Create New Weekly Lesson Plan
            </button>
          </div>

          <div className="space-y-3">
            {lessonPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:shadow-xs transition"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                        {plan.planCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{plan.topicTitle}</h4>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Subject: <strong>{plan.subject}</strong> • {plan.className} • Week {plan.weekNumber} ({plan.dateRange}) • Teacher:{' '}
                      <strong>{plan.teacherName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        plan.status.includes('Approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {plan.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (onPrintLessonPlan) {
                          onPrintLessonPlan(plan);
                        } else {
                          alert(`Printing Lesson Plan: ${plan.planCode}`);
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    {!plan.status.includes('Approved') && (
                      <button
                        type="button"
                        onClick={() => handleApprovePlan(plan.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                      >
                        Approve (VP)
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-[11px]">
                  <div>
                    <strong className="block text-slate-700 mb-0.5">Student Learning Outcomes (SLOs):</strong>
                    <p className="text-slate-600">{plan.sloGoals}</p>
                  </div>
                  <div>
                    <strong className="block text-slate-700 mb-0.5">Pedagogical Method &amp; Tools:</strong>
                    <p className="text-slate-600">
                      {plan.pedagogyMethod} • Tools: {plan.resourcesRequired.join(', ')}
                    </p>
                  </div>
                  <div>
                    <strong className="block text-slate-700 mb-0.5">Assessment &amp; Homework:</strong>
                    <p className="text-slate-600">
                      <strong>Check:</strong> {plan.assessmentStrategy}
                      <br />
                      <strong>HW:</strong> {plan.homeworkAssigned}
                    </p>
                  </div>
                </div>

                {plan.reviewerFeedback && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <strong>VP Review:</strong> {plan.reviewerFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLASSROOM AUDITS */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Academic Quality Assurance - Classroom Walkthrough Audits
              </h3>
              <p className="text-slate-500">
                Principal &amp; Coordinator walkthrough scoring on 5 key pedagogical indices (Max 25).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuditModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs"
            >
              + Record Classroom Observation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audits.map((aud) => (
              <div
                key={aud.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{aud.teacherName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {aud.subject} • {aud.className} • Observed by: <strong>{aud.observerName}</strong>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-full font-bold text-[10px]">
                    {aud.ratingGrade} ({aud.totalScoreOutOf25}/25)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 bg-slate-50 rounded border">
                    <div className="text-slate-500">Pacing</div>
                    <div className="font-bold text-slate-800">{aud.scores.lessonPacing}/5</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border">
                    <div className="text-slate-500">Engagement</div>
                    <div className="font-bold text-slate-800">{aud.scores.studentEngagement}/5</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border">
                    <div className="text-slate-500">Clarity</div>
                    <div className="font-bold text-slate-800">{aud.scores.conceptClarity}/5</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border">
                    <div className="text-slate-500">Board/AV</div>
                    <div className="font-bold text-slate-800">{aud.scores.whiteboardAndAvUsage}/5</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border">
                    <div className="text-slate-500">Discipline</div>
                    <div className="font-bold text-slate-800">{aud.scores.classroomDiscipline}/5</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                    <strong>Observer Strengths:</strong> {aud.observerStrengths}
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                    <strong>Areas for Development:</strong> {aud.areasForDevelopment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE LESSON PLAN */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-slate-900 text-base">Weekly Lesson Plan Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLessonPlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={planForm.teacherName}
                    onChange={(e) => setPlanForm({ ...planForm, teacherName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={planForm.subject}
                    onChange={(e) => setPlanForm({ ...planForm, subject: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class &amp; Section</label>
                  <input
                    type="text"
                    required
                    value={planForm.className}
                    onChange={(e) => setPlanForm({ ...planForm, className: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Week Number</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={planForm.weekNumber}
                    onChange={(e) => setPlanForm({ ...planForm, weekNumber: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Newton’s Second Law of Motion & Momentum (F = ma)"
                  value={planForm.topicTitle}
                  onChange={(e) => setPlanForm({ ...planForm, topicTitle: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student Learning Outcomes (SLO Goals) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Derive F = ma and explain momentum conservation in collisions."
                  value={planForm.sloGoals}
                  onChange={(e) => setPlanForm({ ...planForm, sloGoals: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pedagogical Method</label>
                <select
                  value={planForm.pedagogyMethod}
                  onChange={(e) => setPlanForm({ ...planForm, pedagogyMethod: e.target.value as any })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Direct Instruction & Whiteboard">Direct Instruction &amp; Whiteboard</option>
                  <option value="Inquiry-Based Learning">Inquiry-Based Learning</option>
                  <option value="Flipped Classroom & Video">Flipped Classroom &amp; Video</option>
                  <option value="Group Collaboration & Lab">Group Collaboration &amp; Lab</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resources Required</label>
                <input
                  type="text"
                  value={planForm.resourcesRequired}
                  onChange={(e) => setPlanForm({ ...planForm, resourcesRequired: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Exercise 3.2 Numericals 1 & 3 in homework register."
                  value={planForm.homeworkAssigned}
                  onChange={(e) => setPlanForm({ ...planForm, homeworkAssigned: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Submit Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG CLASSROOM AUDIT */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-slate-900 text-base">Classroom Observation Audit Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAudit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher Observed</label>
                  <input
                    type="text"
                    required
                    value={auditForm.teacherName}
                    onChange={(e) => setAuditForm({ ...auditForm, teacherName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observer Name</label>
                  <input
                    type="text"
                    required
                    value={auditForm.observerName}
                    onChange={(e) => setAuditForm({ ...auditForm, observerName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    required
                    value={auditForm.className}
                    onChange={(e) => setAuditForm({ ...auditForm, className: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={auditForm.subject}
                    onChange={(e) => setAuditForm({ ...auditForm, subject: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  5-Dimensional Observation Rubric (1 to 5 Stars)
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Pacing</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={auditForm.pacing}
                      onChange={(e) => setAuditForm({ ...auditForm, pacing: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Engagement</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={auditForm.engagement}
                      onChange={(e) =>
                        setAuditForm({ ...auditForm, engagement: Number(e.target.value) })
                      }
                      className="w-full p-1.5 border rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Clarity</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={auditForm.clarity}
                      onChange={(e) => setAuditForm({ ...auditForm, clarity: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Board/AV</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={auditForm.avUsage}
                      onChange={(e) => setAuditForm({ ...auditForm, avUsage: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Discipline</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={auditForm.discipline}
                      onChange={(e) =>
                        setAuditForm({ ...auditForm, discipline: Number(e.target.value) })
                      }
                      className="w-full p-1.5 border rounded bg-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observer Strengths</label>
                <input
                  type="text"
                  placeholder="e.g. Crisp explanation and excellent whiteboard organization."
                  value={auditForm.strengths}
                  onChange={(e) => setAuditForm({ ...auditForm, strengths: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Areas for Development / Coaching
                </label>
                <input
                  type="text"
                  placeholder="e.g. Give more wait time after asking analytical questions."
                  value={auditForm.areasForDevelopment}
                  onChange={(e) => setAuditForm({ ...auditForm, areasForDevelopment: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Classroom Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

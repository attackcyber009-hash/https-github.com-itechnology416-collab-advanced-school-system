import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Plus,
  Printer,
  Sliders,
  Sparkles,
  BookOpen,
  DollarSign,
  AlertCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AdmissionAssessmentCandidate } from '../types';
import { INITIAL_ADMISSION_CANDIDATES } from '../data/phase9Data';

interface AdmissionMeritAssessmentViewProps {
  onPrintAdmissionOffer?: (candidate: AdmissionAssessmentCandidate) => void;
}

export default function AdmissionMeritAssessmentView({
  onPrintAdmissionOffer,
}: AdmissionMeritAssessmentViewProps) {
  const [candidates, setCandidates] = useState<AdmissionAssessmentCandidate[]>(
    INITIAL_ADMISSION_CANDIDATES
  );
  const [activeTab, setActiveTab] = useState<'merit_list' | 'scoring_desk' | 'quota_matrix'>('merit_list');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [selectedQuotaFilter, setSelectedQuotaFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Merit cutoff slider state
  const [meritCutoffPercent, setMeritCutoffPercent] = useState<number>(75);

  // New Candidate Form State
  const [formData, setFormData] = useState({
    candidateName: '',
    fatherName: '',
    fatherCnic: '',
    contactPhone: '',
    intendedClass: 'Class 9 (Science - Pre-Medical)',
    gender: 'Male' as 'Male' | 'Female',
    quotaCategory: 'Open Merit' as any,
    english: 20,
    mathematics: 20,
    urdu: 20,
    science: 20,
    oralCommunication: 8,
    generalKnowledge: 8,
    islamicEthicsOrRecitation: 8,
    isHafiz: false,
    assignedCampus: 'Main Campus (Gulberg III)',
    remarks: '',
  });

  const filteredCandidates = candidates.filter((c) => {
    const matchesClass = selectedClassFilter === 'All' || c.intendedClass.includes(selectedClassFilter);
    const matchesQuota = selectedQuotaFilter === 'All' || c.quotaCategory === selectedQuotaFilter;
    const matchesSearch =
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesQuota && matchesSearch;
  });

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const totalWritten =
      Number(formData.english) +
      Number(formData.mathematics) +
      Number(formData.urdu) +
      Number(formData.science);
    const totalInterview =
      Number(formData.oralCommunication) +
      Number(formData.generalKnowledge) +
      Number(formData.islamicEthicsOrRecitation);
    const hafizBonus = formData.isHafiz ? 20 : 0;
    const aggregate = totalWritten + totalInterview + hafizBonus;
    const percentage = Number(((aggregate / 150) * 100).toFixed(1));

    const newCandidate: AdmissionAssessmentCandidate = {
      id: `adm-${Date.now()}`,
      applicationNo: `ADM-2024-${Math.floor(100 + Math.random() * 900)}`,
      candidateName: formData.candidateName,
      fatherName: formData.fatherName,
      fatherCnic: formData.fatherCnic,
      contactPhone: formData.contactPhone,
      intendedClass: formData.intendedClass,
      gender: formData.gender,
      testDate: new Date().toISOString().split('T')[0],
      quotaCategory: formData.quotaCategory,
      writtenMarks: {
        english: Number(formData.english),
        mathematics: Number(formData.mathematics),
        urdu: Number(formData.urdu),
        science: Number(formData.science),
        totalWritten,
      },
      interviewMarks: {
        oralCommunication: Number(formData.oralCommunication),
        generalKnowledge: Number(formData.generalKnowledge),
        islamicEthicsOrRecitation: Number(formData.islamicEthicsOrRecitation),
        totalInterview,
      },
      hafizBonusMarks: hafizBonus > 0 ? hafizBonus : undefined,
      aggregateScore: aggregate,
      aggregatePercentage: percentage,
      status: percentage >= meritCutoffPercent ? 'Selected (Merit List 1)' : 'Waiting List',
      assignedCampus: formData.assignedCampus,
      feeChallanIssued: percentage >= meritCutoffPercent,
      remarks: formData.remarks || 'Standard entrance assessment completed.',
    };

    const updated = [...candidates, newCandidate].sort(
      (a, b) => b.aggregatePercentage - a.aggregatePercentage
    );
    // Recalculate ranks
    const ranked = updated.map((cand, idx) => ({
      ...cand,
      meritRank: idx + 1,
    }));

    setCandidates(ranked);
    setShowAddModal(false);
    alert(`Candidate ${newCandidate.candidateName} evaluated! Merit Score: ${percentage}%`);
  };

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const selectedCount = candidates.filter(
    (c) => c.status === 'Selected (Merit List 1)' || c.status === 'Fee Paid & Enrolled'
  ).length;
  const waitingCount = candidates.filter((c) => c.status === 'Waiting List').length;
  const enrolledCount = candidates.filter((c) => c.status === 'Fee Paid & Enrolled').length;

  return (
    <div id="admission-merit-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-400/20 rounded-lg text-teal-300 border border-teal-400/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Online Admission Entrance Assessment &amp; Merit Allocation Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-400 text-slate-900">
              Phase 9
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            4-Subject written entrance testing (English, Math, Urdu, Science), oral interview rubrics, Hafiz-e-Quran 20-mark bonus integration, automated quota merit ranking, and official provisional admission letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Score New Candidate</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Tested Candidates
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">
              {candidates.length} Applicants
            </div>
            <div className="text-[10px] text-teal-700 font-semibold">Session 2024-2025</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Selected on Merit
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {selectedCount} Candidates
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">Cutoff: {meritCutoffPercent}%</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Enrolled
            </div>
            <div className="text-xl font-black text-teal-700 mt-0.5">
              {enrolledCount} Enrolled
            </div>
            <div className="text-[10px] text-teal-600 font-medium">Fee Paid &amp; Verified</div>
          </div>
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Waiting List Queue
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {waitingCount} Pending
            </div>
            <div className="text-[10px] text-amber-600 font-medium">Merit List 2 Pipeline</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('merit_list')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'merit_list'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Official Merit List &amp; Ranking Roster</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scoring_desk')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'scoring_desk'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Subject Scoring &amp; Interview Rubric Desk</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quota_matrix')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'quota_matrix'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Seat Quota &amp; Policy Matrix</span>
        </button>
      </div>

      {/* TAB 1: MERIT LIST & SELECTION ROSTER */}
      {activeTab === 'merit_list' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700">Filter Class:</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Classes</option>
                <option value="Class 9">Class 9 (All Tracks)</option>
                <option value="Pre-Medical">Pre-Medical</option>
                <option value="ICS">Computer Science (ICS)</option>
                <option value="Pre-Engineering">Pre-Engineering</option>
                <option value="Class 1">Class 1</option>
              </select>

              <span className="font-bold text-slate-700 ml-2">Quota:</span>
              <select
                value={selectedQuotaFilter}
                onChange={(e) => setSelectedQuotaFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Quotas</option>
                <option value="Open Merit">Open Merit</option>
                <option value="Hafiz-e-Quran">Hafiz-e-Quran</option>
                <option value="Sibling Quota">Sibling Quota</option>
                <option value="Staff Ward">Staff Ward</option>
                <option value="Sports & Co-Curricular">Sports &amp; Co-Curricular</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border">
                <span className="font-bold text-slate-700">Merit Cutoff:</span>
                <span className="font-mono font-bold text-teal-800">{meritCutoffPercent}%</span>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={meritCutoffPercent}
                  onChange={(e) => setMeritCutoffPercent(Number(e.target.value))}
                  className="w-24 accent-teal-600"
                />
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate, app no, father..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">App No &amp; Candidate</th>
                  <th className="p-3">Intended Class &amp; Quota</th>
                  <th className="p-3 text-center">Written (100)</th>
                  <th className="p-3 text-center">Interview (30)</th>
                  <th className="p-3 text-center">Bonus</th>
                  <th className="p-3 text-center">Aggregate %</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-black text-slate-900">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          cand.meritRank === 1
                            ? 'bg-amber-100 text-amber-800 font-black'
                            : cand.meritRank === 2
                            ? 'bg-slate-200 text-slate-800'
                            : cand.meritRank === 3
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cand.meritRank}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{cand.candidateName}</div>
                      <div className="text-[11px] text-slate-500">
                        S/D of {cand.fatherName} • <span className="font-mono">{cand.applicationNo}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{cand.intendedClass}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {cand.quotaCategory}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {cand.writtenMarks.totalWritten}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {cand.interviewMarks.totalInterview}
                    </td>
                    <td className="p-3 text-center">
                      {cand.hafizBonusMarks ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          +20 (Hafiz)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-mono font-black text-sm text-teal-800">
                        {cand.aggregatePercentage}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {cand.aggregateScore}/150
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cand.status === 'Selected (Merit List 1)'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cand.status === 'Fee Paid & Enrolled'
                            ? 'bg-teal-100 text-teal-800'
                            : cand.status === 'Waiting List'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cand.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (onPrintAdmissionOffer) {
                              onPrintAdmissionOffer(cand);
                            } else {
                              alert(`Printing Admission Offer for ${cand.candidateName}`);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                          title="Print Admission Offer Letter"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Offer Letter</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(
                              cand.id,
                              cand.status === 'Fee Paid & Enrolled'
                                ? 'Selected (Merit List 1)'
                                : 'Fee Paid & Enrolled'
                            )
                          }
                          className="px-2 py-1.5 border border-slate-300 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          {cand.status === 'Fee Paid & Enrolled' ? 'Revert' : 'Mark Enrolled'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECT SCORING & INTERVIEW RUBRIC DESK */}
      {activeTab === 'scoring_desk' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Subject-Wise Written Scoring &amp; Interview Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Detailed evaluation in 4 written subjects plus 3 oral dimensions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-xs"
            >
              + Evaluate New Applicant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{cand.candidateName}</div>
                    <div className="text-slate-500 text-[11px]">
                      App No: <span className="font-mono font-bold">{cand.applicationNo}</span> • {cand.intendedClass}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold text-[10px]">
                    Rank #{cand.meritRank} ({cand.aggregatePercentage}%)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Written Exam Breakdown (Max 25 Each)
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">English</div>
                      <div className="font-mono font-black text-slate-900">{cand.writtenMarks.english}/25</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Mathematics</div>
                      <div className="font-mono font-black text-slate-900">{cand.writtenMarks.mathematics}/25</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Urdu</div>
                      <div className="font-mono font-black text-slate-900">{cand.writtenMarks.urdu}/25</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Science</div>
                      <div className="font-mono font-black text-slate-900">{cand.writtenMarks.science}/25</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Oral Interview &amp; Ethics Rubric (Max 10 Each)
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Communication</div>
                      <div className="font-mono font-black text-slate-900">{cand.interviewMarks.oralCommunication}/10</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">General Knowledge</div>
                      <div className="font-mono font-black text-slate-900">{cand.interviewMarks.generalKnowledge}/10</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Islamic Ethics / Nazra</div>
                      <div className="font-mono font-black text-slate-900">{cand.interviewMarks.islamicEthicsOrRecitation}/10</div>
                    </div>
                  </div>
                </div>

                {cand.remarks && (
                  <div className="p-2 bg-teal-50 rounded border border-teal-200 text-teal-900 text-[11px]">
                    <strong>Evaluator Notes:</strong> {cand.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SEAT QUOTA & POLICY MATRIX */}
      {activeTab === 'quota_matrix' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Institutional Quota &amp; Concession Seat Reservation Policy
            </h3>
            <p className="text-slate-500">
              Prescribed allocations aligned with Beaconhouse / The Educators National Admission Guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>1. Open Merit Quota</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">70% Seats</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Allocated strictly on combined written test (100) and interview (30) aggregate percentage without background preference.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>2. Sibling Concession Quota</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono">15% Seats</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Reserved for real brothers/sisters of currently enrolled active students. Automatic 20% tuition fee waiver linked.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>3. Staff Ward Quota</span>
                <span className="px-2 py-0.5 bg-violet-100 text-violet-800 rounded font-mono">5% Seats</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Eligible for children of permanent academic and administrative staff with 50% tuition discount.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>4. Hafiz-e-Quran Merit Quota</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono">+20 Bonus Marks</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Verified certificate from Wafaq-ul-Madaris gives an automatic 20-mark aggregate bonus towards secondary admission.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>5. Sports &amp; Distinction Quota</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-mono">5% Seats</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                For district/provincial level athletes, debaters, and national science olympiad distinction holders.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>6. Need-Based Financial Aid</span>
                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-mono">Discretionary</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Assessed by Campus Board of Trustees upon submission of verified electricity bills and income certificates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCORE NEW CANDIDATE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Entrance Assessment Scoring Form
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Syed Zayd Ali"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Syed Mansoor Ali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father CNIC *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherCnic}
                    onChange={(e) => setFormData({ ...formData, fatherCnic: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                    placeholder="35202-xxxxxxx-x"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                    placeholder="0300-xxxxxxx"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intended Class</label>
                  <select
                    value={formData.intendedClass}
                    onChange={(e) => setFormData({ ...formData, intendedClass: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Class 9 (Science - Pre-Medical)">Class 9 (Science - Pre-Medical)</option>
                    <option value="Class 9 (Science - Pre-Engineering)">Class 9 (Science - Pre-Engineering)</option>
                    <option value="Class 9 (Computer Science - ICS)">Class 9 (Computer Science - ICS)</option>
                    <option value="Class 10 (Matric Section)">Class 10 (Matric Section)</option>
                    <option value="Class 8 (Middle Section)">Class 8 (Middle Section)</option>
                    <option value="Class 1 (Junior Section)">Class 1 (Junior Section)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quota Category</label>
                  <select
                    value={formData.quotaCategory}
                    onChange={(e) => setFormData({ ...formData, quotaCategory: e.target.value as any })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Open Merit">Open Merit</option>
                    <option value="Sibling Quota">Sibling Quota (20% Disc)</option>
                    <option value="Staff Ward">Staff Ward (50% Disc)</option>
                    <option value="Hafiz-e-Quran">Hafiz-e-Quran (+20 Bonus)</option>
                    <option value="Sports & Co-Curricular">Sports &amp; Co-Curricular</option>
                  </select>
                </div>
              </div>

              {/* Written Scores */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  Written Entrance Test Marks (Max 25 per subject)
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">English</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formData.english}
                      onChange={(e) => setFormData({ ...formData, english: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Math</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formData.mathematics}
                      onChange={(e) => setFormData({ ...formData, mathematics: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Urdu</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formData.urdu}
                      onChange={(e) => setFormData({ ...formData, urdu: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Science</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formData.science}
                      onChange={(e) => setFormData({ ...formData, science: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Interview Scores */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  Oral Interview &amp; Ethics Rubric (Max 10 per dimension)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Communication</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.oralCommunication}
                      onChange={(e) =>
                        setFormData({ ...formData, oralCommunication: Number(e.target.value) })
                      }
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">General Knowledge</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.generalKnowledge}
                      onChange={(e) =>
                        setFormData({ ...formData, generalKnowledge: Number(e.target.value) })
                      }
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Islamic Ethics</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.islamicEthicsOrRecitation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          islamicEthicsOrRecitation: Number(e.target.value),
                        })
                      }
                      className="w-full p-1.5 border rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHafizCheck"
                  checked={formData.isHafiz}
                  onChange={(e) => setFormData({ ...formData, isHafiz: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <label htmlFor="isHafizCheck" className="font-bold text-slate-700">
                  Candidate is Hafiz-e-Quran (Add 20 Bonus Points to Aggregate)
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluator Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Confident speaker with strong arithmetic reasoning."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Calculate Merit &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

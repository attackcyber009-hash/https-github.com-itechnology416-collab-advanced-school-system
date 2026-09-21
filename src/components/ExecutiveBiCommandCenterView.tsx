import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Users,
  Printer,
  Sparkles,
  Award,
  CheckCircle,
  PhoneCall,
  Search,
  BookOpen,
  DollarSign,
  Activity,
} from 'lucide-react';
import { CampusBiMetric, PredictiveRiskStudent } from '../types';
import {
  INITIAL_CAMPUS_BI_METRICS,
  INITIAL_PREDICTIVE_RISK_STUDENTS,
} from '../data/phase10Data';

interface ExecutiveBiCommandCenterViewProps {
  onPrintAuditReport?: (metric: CampusBiMetric) => void;
}

export default function ExecutiveBiCommandCenterView({
  onPrintAuditReport,
}: ExecutiveBiCommandCenterViewProps) {
  const [activeTab, setActiveTab] = useState<'health_index' | 'predictive_risk' | 'inter_branch'>(
    'health_index'
  );
  const [metrics, setMetrics] = useState<CampusBiMetric[]>(INITIAL_CAMPUS_BI_METRICS);
  const [riskStudents, setRiskStudents] = useState<PredictiveRiskStudent[]>(
    INITIAL_PREDICTIVE_RISK_STUDENTS
  );
  const [selectedCampus, setSelectedCampus] = useState<CampusBiMetric>(INITIAL_CAMPUS_BI_METRICS[0]);
  const [searchRiskQuery, setSearchRiskQuery] = useState('');

  const filteredRiskStudents = riskStudents.filter((std) => {
    return (
      std.studentName.toLowerCase().includes(searchRiskQuery.toLowerCase()) ||
      std.className.toLowerCase().includes(searchRiskQuery.toLowerCase()) ||
      std.riskCategory.toLowerCase().includes(searchRiskQuery.toLowerCase()) ||
      std.assignedInterventionMentor.toLowerCase().includes(searchRiskQuery.toLowerCase())
    );
  });

  const handleUpdateIntervention = (id: string, newStatus: PredictiveRiskStudent['interventionStatus']) => {
    setRiskStudents(
      riskStudents.map((std) => (std.id === id ? { ...std, interventionStatus: newStatus } : std))
    );
  };

  return (
    <div id="executive-bi-center" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-400/20 rounded-lg text-indigo-300 border border-indigo-400/30">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Executive BI Command Center, Campus 360° Health &amp; AI Risk Predictor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-400 text-slate-900">
              Phase 10
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Institutional quality index for Principals &amp; Central Directorate, inter-branch benchmarking, predictive student failure &amp; dropout prevention engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onPrintAuditReport) {
                onPrintAuditReport(selectedCampus);
              } else {
                alert(`Generating Institutional Quality Audit Dossier for ${selectedCampus.campusName}`);
              }
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Campus Quality Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Campus Composite Index Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-indigo-900 text-white rounded-xl flex flex-col items-center justify-center font-black">
            <span className="text-lg leading-tight">{selectedCampus.overallQualityScore}</span>
            <span className="text-[9px] text-indigo-200 uppercase font-mono">/ 100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">{selectedCampus.campusName}</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {selectedCampus.gradeCategory}
              </span>
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              Enrolment: <strong>{selectedCampus.totalStudents} Students</strong> • Board Pass Rate:{' '}
              <strong className="text-emerald-700">{selectedCampus.biseBoardPassRate}%</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Select Campus Branch:</span>
          <select
            value={selectedCampus.campusCode}
            onChange={(e) => {
              const found = metrics.find((m) => m.campusCode === e.target.value);
              if (found) setSelectedCampus(found);
            }}
            className="p-2 border rounded-lg bg-white text-xs font-semibold"
          >
            {metrics.map((m) => (
              <option key={m.campusCode} value={m.campusCode}>
                {m.campusName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('health_index')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'health_index'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Campus 360° Health Dimensions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('predictive_risk')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'predictive_risk'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Predictive Academic &amp; Dropout Risk Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inter_branch')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'inter_branch'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Inter-Branch Benchmarking Matrix</span>
        </button>
      </div>

      {/* TAB 1: 360 HEALTH DIMENSIONS */}
      {activeTab === 'health_index' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-5 shadow-xs text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">BISE Board Pass Rate</span>
                <span className="font-black text-emerald-700 text-sm">
                  {selectedCampus.biseBoardPassRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${selectedCampus.biseBoardPassRate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Benchmark: 95.0% Minimum (Matric/FSc)</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Fee Recovery Realization</span>
                <span className="font-black text-blue-800 text-sm">
                  {selectedCampus.feeRecoveryRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${selectedCampus.feeRecoveryRate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Benchmark: 92.0% Monthly Collection</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">PTM Satisfaction Index</span>
                <span className="font-black text-indigo-700 text-sm">
                  {selectedCampus.ptmSatisfactionIndex} / 5.0
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(selectedCampus.ptmSatisfactionIndex / 5) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Parent feedback survey across 874 slips</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Faculty Attendance Ratio</span>
                <span className="font-black text-teal-700 text-sm">
                  {selectedCampus.teacherAttendanceRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${selectedCampus.teacherAttendanceRate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Biometric daily logs &amp; substitutions</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Student Enrolment Retention</span>
                <span className="font-black text-amber-700 text-sm">
                  {selectedCampus.studentRetentionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{ width: `${selectedCampus.studentRetentionRate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Year-over-year cohort persistence</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Student Daily Attendance</span>
                <span className="font-black text-purple-700 text-sm">
                  {selectedCampus.studentAttendanceRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${selectedCampus.studentAttendanceRate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">Daily RFID &amp; Roll Call tracking</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTIVE RISK ENGINE */}
      {activeTab === 'predictive_risk' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                AI Early Warning &amp; Attrition Intervention Registry
              </h3>
              <p className="text-slate-500 text-[11px]">
                Identifies students exhibiting failure indicators across attendance, midterm marks, or fee default.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, risk trigger, mentor..."
                value={searchRiskQuery}
                onChange={(e) => setSearchRiskQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRiskStudents.map((std) => (
              <div
                key={std.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-black flex items-center justify-center text-sm border border-rose-200">
                      {std.riskScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{std.studentName}</h4>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                          {std.riskCategory}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Class: <strong>{std.className}</strong> (Roll #{std.rollNo}) • Parent:{' '}
                        <strong>{std.parentPhone}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600">Intervention:</span>
                    <select
                      value={std.interventionStatus}
                      onChange={(e) =>
                        handleUpdateIntervention(
                          std.id,
                          e.target.value as PredictiveRiskStudent['interventionStatus']
                        )
                      }
                      className="p-1 border rounded bg-white font-semibold text-slate-800"
                    >
                      <option value="Alert Raised">Alert Raised</option>
                      <option value="Parent Called">Parent Called</option>
                      <option value="Remedial Classes Assigned">Remedial Classes Assigned</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Triggers & Action Plan */}
                <div className="p-3 bg-white rounded-lg border text-[11px] space-y-1.5">
                  <div className="font-bold text-slate-800">Identified Triggers:</div>
                  <ul className="list-disc list-inside text-rose-700 space-y-0.5">
                    {std.keyTriggers.map((trig, i) => (
                      <li key={i}>{trig}</li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t text-slate-700">
                    <strong className="text-slate-900">Assigned Mentor &amp; Action Plan:</strong>{' '}
                    {std.assignedInterventionMentor} — {std.suggestedActionPlan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTER-BRANCH BENCHMARKING */}
      {activeTab === 'inter_branch' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            Central Network Quality Audit &amp; Campus Rankings
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="p-2.5">Campus Name</th>
                  <th className="p-2.5">Enrolment</th>
                  <th className="p-2.5">Board Pass Rate</th>
                  <th className="p-2.5">Fee Recovery</th>
                  <th className="p-2.5">Student Att.</th>
                  <th className="p-2.5">PTM Score</th>
                  <th className="p-2.5">Overall Quality Index</th>
                  <th className="p-2.5 text-right">Audit Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((m) => (
                  <tr key={m.campusCode} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{m.campusName}</td>
                    <td className="p-2.5 text-slate-700">{m.totalStudents}</td>
                    <td className="p-2.5 font-semibold text-emerald-700">{m.biseBoardPassRate}%</td>
                    <td className="p-2.5 font-medium text-blue-700">{m.feeRecoveryRate}%</td>
                    <td className="p-2.5 text-slate-600">{m.studentAttendanceRate}%</td>
                    <td className="p-2.5 font-bold text-indigo-700">{m.ptmSatisfactionIndex}/5</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-indigo-100 text-indigo-950">
                        {m.overallQualityScore}/100 ({m.gradeCategory})
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrintAuditReport) {
                            onPrintAuditReport(m);
                          } else {
                            alert(`Printing Quality Audit Report for ${m.campusName}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[10px] flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Audit PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

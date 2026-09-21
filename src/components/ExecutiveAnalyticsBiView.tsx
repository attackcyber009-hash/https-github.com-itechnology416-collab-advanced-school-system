import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  GraduationCap,
  ShieldCheck,
  Building2,
  PieChart,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AlumniRecord, CampusAuditComplianceMetric, Student } from '../types';
import { INITIAL_ALUMNI, INITIAL_AUDIT_METRICS } from '../data/phase7Data';

interface ExecutiveAnalyticsBiViewProps {
  students: Student[];
  monthlyRevenue?: number;
  monthlyExpenses?: number;
}

export default function ExecutiveAnalyticsBiView({
  students,
  monthlyRevenue = 2850000,
  monthlyExpenses = 1920000,
}: ExecutiveAnalyticsBiViewProps) {
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(INITIAL_ALUMNI);
  const [auditMetrics, setAuditMetrics] = useState<CampusAuditComplianceMetric[]>(
    INITIAL_AUDIT_METRICS
  );

  const [activeTab, setActiveTab] = useState<'bi_cockpit' | 'alumni' | 'compliance' | 'academics'>(
    'bi_cockpit'
  );
  const [alumniSearch, setAlumniSearch] = useState('');
  const [showAddAlumniModal, setShowAddAlumniModal] = useState(false);

  // New Alumni Form State
  const [newAlumni, setNewAlumni] = useState<Partial<AlumniRecord>>({
    name: '',
    fatherName: '',
    matricYear: '2023',
    matricBoardPercentage: 92.5,
    className: 'Class Ten (Matric Science)',
    higherInstitution: 'LUMS / NUST',
    degreeProgram: 'BS Computer Science',
    currentOccupation: 'Undergraduate Scholar',
    cityCountry: 'Lahore, Pakistan',
    contactEmail: '',
    phoneNo: '',
    achievements: 'High Academic Merit & Co-Curricular Distinction',
    isVerifiedAlumni: true,
    willingToMentor: true,
  });

  // Calculations
  const netSurplus = monthlyRevenue - monthlyExpenses;
  const surplusMargin = ((netSurplus / monthlyRevenue) * 100).toFixed(1);
  const feeRealizationRate = 94.8;
  const biseMatricPassRate = 98.6;
  const overallComplianceScore = Math.round(
    auditMetrics.reduce((acc, m) => acc + m.currentScore, 0) / auditMetrics.length
  );

  const filteredAlumni = alumniList.filter(
    (a) =>
      a.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
      a.higherInstitution.toLowerCase().includes(alumniSearch.toLowerCase()) ||
      a.currentOccupation.toLowerCase().includes(alumniSearch.toLowerCase()) ||
      a.matricYear.includes(alumniSearch)
  );

  const handleRegisterAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumni.name || !newAlumni.higherInstitution) {
      alert('Alumni Name and Higher Institution are required');
      return;
    }

    const reg: AlumniRecord = {
      id: `alm-${Date.now()}`,
      alumniRegNo: `ALM-${newAlumni.matricYear}-${String(alumniList.length + 101).padStart(3, '0')}`,
      name: newAlumni.name || '',
      fatherName: newAlumni.fatherName || 'Guardian',
      matricYear: newAlumni.matricYear || '2023',
      matricBoardPercentage: Number(newAlumni.matricBoardPercentage) || 90.0,
      className: newAlumni.className || 'Class Ten',
      higherInstitution: newAlumni.higherInstitution || '',
      degreeProgram: newAlumni.degreeProgram || 'Bachelor of Science',
      currentOccupation: newAlumni.currentOccupation || 'Student',
      cityCountry: newAlumni.cityCountry || 'Pakistan',
      contactEmail: newAlumni.contactEmail || 'alumni@theeducators.edu',
      phoneNo: newAlumni.phoneNo || '0300-0000000',
      achievements: newAlumni.achievements || 'Distinguished Alumnus',
      isVerifiedAlumni: true,
      willingToMentor: !!newAlumni.willingToMentor,
    };

    setAlumniList([reg, ...alumniList]);
    setShowAddAlumniModal(false);
    alert(`Alumnus ${reg.name} successfully inducted into the Institutional Hall of Fame!`);
  };

  return (
    <div id="executive-bi-analytics-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-[#0b3366] to-[#144782] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Executive BI Intelligence, Regulatory Compliance &amp; Alumni Network
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 7
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Financial feasibility &amp; yield projections, BISE Board academic performance benchmarks, PEF regulatory compliance audits, and verified Alumni Hall of Fame.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddAlumniModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Induct Graduate Alumnus</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Net Monthly Surplus
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              PKR {(netSurplus / 1000).toFixed(0)}k
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">{surplusMargin}% Operating Margin</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              BISE Matric Pass Rate
            </div>
            <div className="text-xl font-black text-blue-700 mt-0.5">{biseMatricPassRate}%</div>
            <div className="text-[10px] text-blue-600 font-medium">84% A+ &amp; A Grades</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Regulatory Compliance
            </div>
            <div className="text-xl font-black text-purple-700 mt-0.5">{overallComplianceScore}%</div>
            <div className="text-[10px] text-purple-600 font-semibold">PEF &amp; Civil Defence Pass</div>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Alumni Mentors
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{alumniList.length} Inducted</div>
            <div className="text-[10px] text-slate-500">LUMS, NUST, KEMU Scholars</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('bi_cockpit')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'bi_cockpit'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive BI Cockpit &amp; Yield Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alumni')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'alumni'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Alumni Directory &amp; University Placement ({alumniList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'compliance'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>PEF &amp; Board Audit Compliance Matrix</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE BI COCKPIT */}
      {activeTab === 'bi_cockpit' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Performance Ledger */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Institutional Revenue &amp; Cost Breakdown (Monthly)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500">PKR Currency</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-semibold text-emerald-900">Total Monthly Revenue Inflow</span>
                  <span className="font-mono font-bold text-emerald-800">
                    PKR {monthlyRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5 pl-2">
                  <div className="flex justify-between text-slate-600">
                    <span>• Tuition &amp; Term Fees Realized</span>
                    <span className="font-mono">PKR 2,450,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>• Transport Van Fare Collections</span>
                    <span className="font-mono">PKR 260,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>• Boarding &amp; Hostel Inflows</span>
                    <span className="font-mono">PKR 140,000</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="font-semibold text-rose-900">Total Operating Expenses</span>
                  <span className="font-mono font-bold text-rose-800">
                    PKR {monthlyExpenses.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5 pl-2">
                  <div className="flex justify-between text-slate-600">
                    <span>• Faculty &amp; Staff Payroll</span>
                    <span className="font-mono">PKR 1,280,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>• Campus Utilities (Electricity, Gas, Generator Fuel)</span>
                    <span className="font-mono">PKR 340,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>• Fleet Fuel &amp; Transport Maintenance</span>
                    <span className="font-mono">PKR 180,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>• Mess Groceries &amp; Store Procurement</span>
                    <span className="font-mono">PKR 120,000</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between font-bold text-slate-900 text-sm">
                  <span>Net Institutional Operating Surplus</span>
                  <span className="text-emerald-700 font-mono">
                    PKR {netSurplus.toLocaleString()} ({surplusMargin}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Growth & Capacity Health */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Campus Infrastructure &amp; Operational Ratios</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">100% HEALTHY</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Student-Teacher Ratio (Benchmark: &lt; 25:1)</span>
                    <strong className="text-blue-700 font-mono">18:1 (Optimal)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Classroom Seat Capacity Utilization</span>
                    <strong className="text-emerald-700 font-mono">82% Occupancy</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Monthly Fee Collection Realization</span>
                    <strong className="text-purple-700 font-mono">{feeRealizationRate}% Cleared</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${feeRealizationRate}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Faculty Attendance &amp; Lesson Delivery Punctuality</span>
                    <strong className="text-amber-700 font-mono">97.2%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '97.2%' }} />
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                  💡 <strong>Executive Recommendation:</strong> Financial metrics indicate robust liquidity buffer. Class capacity allows onboarding of 18 additional students across senior sections without hiring supplementary faculty.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALUMNI DIRECTORY */}
      {activeTab === 'alumni' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Alumni by Name, University (LUMS, NUST, KEMU), Occupation, Matric Batch..."
                value={alumniSearch}
                onChange={(e) => setAlumniSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlumni.map((alm) => (
              <div
                key={alm.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {alm.alumniRegNo}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {alm.willingToMentor && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Student Mentor</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                        Class of {alm.matricYear}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{alm.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      {alm.degreeProgram} • <strong className="text-[#002147]">{alm.higherInstitution}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{alm.currentOccupation}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      📍 {alm.cityCountry} • Matric Board: <strong className="text-emerald-700">{alm.matricBoardPercentage}%</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">
                    "{alm.achievements}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{alm.contactEmail}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert(`Initiating mentorship connection with ${alm.name} (${alm.higherInstitution})`)
                    }
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[10px] flex items-center gap-1"
                  >
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REGULATORY COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Regulatory Standards &amp; PEF Directorate Accreditation
              </h3>
              <p className="text-xs text-slate-500">
                Official statutory audits by Punjab School Education Department, Civil Defence, and Grant Thornton.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
              Overall Status: Grade A+ Accredited
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Compliance Category</th>
                  <th className="p-3">Standard / Metric Name</th>
                  <th className="p-3">Benchmark Requirement</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3">Auditing Authority</th>
                  <th className="p-3">Last Verified</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {auditMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-slate-800">{m.category}</td>
                    <td className="p-3 font-bold text-slate-900">{m.metricName}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{m.benchmarkStandard}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-700">
                      {m.currentScore}%
                    </td>
                    <td className="p-3 text-slate-700">{m.verifiedBy}</td>
                    <td className="p-3 font-mono text-slate-500">{m.lastAuditDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{m.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INDUCT ALUMNI MODAL */}
      {showAddAlumniModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002147]" />
                <h3 className="font-bold text-slate-900 text-base">Induct Graduate into Alumni Network</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAlumniModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterAlumni} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Usman Tariq"
                    value={newAlumni.name}
                    onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#002147]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matric / Grad Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2020"
                    value={newAlumni.matricYear}
                    onChange={(e) => setNewAlumni({ ...newAlumni, matricYear: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Higher Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUMS / NUST / KEMU"
                    value={newAlumni.higherInstitution}
                    onChange={(e) => setNewAlumni({ ...newAlumni, higherInstitution: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    placeholder="e.g. BS Computer Science"
                    value={newAlumni.degreeProgram}
                    onChange={(e) => setNewAlumni({ ...newAlumni, degreeProgram: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Occupation / Employer</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer at Systems Ltd"
                    value={newAlumni.currentOccupation}
                    onChange={(e) => setNewAlumni({ ...newAlumni, currentOccupation: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Pakistan"
                    value={newAlumni.cityCountry}
                    onChange={(e) => setNewAlumni({ ...newAlumni, cityCountry: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={newAlumni.contactEmail}
                    onChange={(e) => setNewAlumni({ ...newAlumni, contactEmail: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone No</label>
                  <input
                    type="text"
                    placeholder="0300-xxxxxxx"
                    value={newAlumni.phoneNo}
                    onChange={(e) => setNewAlumni({ ...newAlumni, phoneNo: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Achievements &amp; Honors</label>
                <textarea
                  rows={2}
                  placeholder="e.g. BISE Board Position Holder, Dean's Honor Roll..."
                  value={newAlumni.achievements}
                  onChange={(e) => setNewAlumni({ ...newAlumni, achievements: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mentorCheck"
                  checked={newAlumni.willingToMentor}
                  onChange={(e) => setNewAlumni({ ...newAlumni, willingToMentor: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="mentorCheck" className="text-slate-700 font-medium cursor-pointer">
                  Available as a Career Mentor for current school students
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddAlumniModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold shadow-sm"
                >
                  Induct Alumnus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

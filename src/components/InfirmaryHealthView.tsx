import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  Phone,
  Pill,
  BedDouble,
  CheckCircle2,
  Printer,
  Sparkles,
  Info,
  Thermometer,
} from 'lucide-react';
import {
  StudentMedicalProfile,
  ClinicOpdVisit,
  Student,
} from '../types';
import {
  INITIAL_STUDENT_MEDICAL_PROFILES,
  INITIAL_CLINIC_VISITS,
} from '../data/phase8Data';

interface InfirmaryHealthViewProps {
  students: Student[];
  onPrintMedicalCertificate?: (data: any) => void;
}

export default function InfirmaryHealthView({
  students,
  onPrintMedicalCertificate,
}: InfirmaryHealthViewProps) {
  const [profiles, setProfiles] = useState<StudentMedicalProfile[]>(INITIAL_STUDENT_MEDICAL_PROFILES);
  const [visits, setVisits] = useState<ClinicOpdVisit[]>(INITIAL_CLINIC_VISITS);

  const [activeTab, setActiveTab] = useState<'opd' | 'profiles' | 'emergency_alerts'>('opd');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<StudentMedicalProfile | null>(null);
  const [healthNotice, setHealthNotice] = useState<string | null>(null);

  // New Visit Form State
  const [visitForm, setVisitForm] = useState<{
    patientType: 'Student' | 'Staff';
    patientName: string;
    className: string;
    symptoms: string;
    temp: number;
    bpSystolic: number;
    bpDiastolic: number;
    pulse: number;
    spo2: number;
    diagnosis: string;
    treatment: string;
    doctorName: string;
    bedAssigned: string;
    disposition: any;
    parentNotified: boolean;
  }>({
    patientType: 'Student',
    patientName: students[0]?.name || 'Hamza Aslam',
    className: 'Class One (Sec A)',
    symptoms: 'Sudden stomach ache & nausea after lunch',
    temp: 99.2,
    bpSystolic: 110,
    bpDiastolic: 70,
    pulse: 88,
    spo2: 99,
    diagnosis: 'Mild acute gastritis / food discomfort',
    treatment: 'Tablet Antacid chewable, ORS solution 250ml',
    doctorName: 'Sister Rehana Kausar (Staff Nurse)',
    bedAssigned: 'Infirmary Bed 02',
    disposition: 'Resting in Infirmary',
    parentNotified: true,
  });

  // Filtered lists
  const filteredVisits = visits.filter(
    (v) =>
      v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.visitNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = profiles.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emergencyAlertCases = profiles.filter(
    (p) =>
      (p.allergies.length > 0 && !p.allergies.includes('None known')) ||
      (p.chronicConditions.length > 0 && !p.chronicConditions.includes('None'))
  );

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit: ClinicOpdVisit = {
      id: `opd-${Date.now()}`,
      visitNo: `OPD-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      patientType: visitForm.patientType,
      patientId: `std-${Math.floor(100 + Math.random() * 900)}`,
      patientName: visitForm.patientName,
      classNameOrDesignation: visitForm.className,
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symptomsChiefComplaint: visitForm.symptoms,
      vitals: {
        tempFahrenheit: Number(visitForm.temp),
        bpSystolic: Number(visitForm.bpSystolic) || undefined,
        bpDiastolic: Number(visitForm.bpDiastolic) || undefined,
        pulseBpm: Number(visitForm.pulse),
        spo2: Number(visitForm.spo2) || undefined,
      },
      diagnosis: visitForm.diagnosis,
      treatmentDispensed: visitForm.treatment.split(',').map((t) => t.trim()),
      doctorOrNurseName: visitForm.doctorName,
      restBedAssigned: visitForm.bedAssigned || undefined,
      parentNotified: visitForm.parentNotified,
      disposition: visitForm.disposition,
    };

    setVisits([newVisit, ...visits]);
    setShowNewVisitModal(false);
    setHealthNotice(`OPD Visit Logged: ${newVisit.visitNo} for ${newVisit.patientName}`);
    setTimeout(() => setHealthNotice(null), 4500);
  };

  return (
    <div id="infirmary-health-suite" className="space-y-4">
      {healthNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>✓ {healthNotice}</span>
          <button type="button" onClick={() => setHealthNotice(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-400/20 rounded-lg text-emerald-300 border border-emerald-400/30">
              <HeartPulse className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Campus Infirmary, Medical Clinic &amp; Student Health Registry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-900">
              Phase 8
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Live dispensary logs, student BMI dossiers, severe allergy alerts (peanut, penicillin), emergency inhaler protocols, and certified medical fitness slips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewVisitModal(true)}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log OPD Patient Visit</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Today’s OPD Consultations
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">{visits.length} Treated</div>
            <div className="text-[10px] text-emerald-600 font-medium">100% First Aid Cleared</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Severe Allergy / Asthma Alerts
            </div>
            <div className="text-xl font-black text-rose-600 mt-0.5">{emergencyAlertCases.length} Critical</div>
            <div className="text-[10px] text-rose-500 font-semibold">Inhalers &amp; EpiPens Stored</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Vaccination Compliance
            </div>
            <div className="text-xl font-black text-blue-700 mt-0.5">99.4% Verified</div>
            <div className="text-[10px] text-blue-600 font-medium">Polio, MMR &amp; Typhoid</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Infirmary Beds Available
            </div>
            <div className="text-xl font-black text-purple-700 mt-0.5">3 of 4 Ready</div>
            <div className="text-[10px] text-purple-600 font-semibold">1 Student Resting</div>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('opd')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'opd'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Daily Clinic OPD Visits ({visits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profiles')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'profiles'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Health Dossiers ({profiles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency_alerts')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'emergency_alerts'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Severe Medical &amp; Allergy Flags ({emergencyAlertCases.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-2 border-x border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, OPD slip, blood group, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* TAB 1: DAILY CLINIC OPD VISITS */}
      {activeTab === 'opd' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Visit Code</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Class / Role</th>
                  <th className="p-3">Symptoms &amp; Complaint</th>
                  <th className="p-3">Vitals</th>
                  <th className="p-3">Diagnosis &amp; Meds</th>
                  <th className="p-3">Status / Disposition</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-emerald-800">{v.visitNo}</td>
                    <td className="p-3 font-bold text-slate-900">{v.patientName}</td>
                    <td className="p-3 text-slate-600 font-medium">{v.classNameOrDesignation}</td>
                    <td className="p-3 text-slate-800 max-w-xs">{v.symptomsChiefComplaint}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-700 space-y-0.5">
                      <div>Temp: <strong>{v.vitals.tempFahrenheit}°F</strong></div>
                      <div>Pulse: <strong>{v.vitals.pulseBpm} bpm</strong></div>
                      {v.vitals.bpSystolic && (
                        <div>BP: <strong>{v.vitals.bpSystolic}/{v.vitals.bpDiastolic}</strong></div>
                      )}
                    </td>
                    <td className="p-3 text-xs space-y-1">
                      <div className="font-semibold text-[#002147]">{v.diagnosis}</div>
                      <div className="flex flex-wrap gap-1">
                        {v.treatmentDispensed.map((med, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium"
                          >
                            💊 {med}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.disposition === 'Sent Back to Class'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.disposition === 'Resting in Infirmary'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.disposition}
                      </span>
                      {v.parentNotified && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">
                          ✓ Parent Notified
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrintMedicalCertificate) {
                            onPrintMedicalCertificate({
                              studentName: v.patientName,
                              className: v.classNameOrDesignation,
                              visitNo: v.visitNo,
                              diagnosis: v.diagnosis,
                              vitals: v.vitals,
                              treatment: v.treatmentDispensed.join(', '),
                              doctorName: v.doctorOrNurseName,
                              date: v.visitDate,
                            });
                          } else {
                            window.print();
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[10px] inline-flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT HEALTH DOSSIERS */}
      {activeTab === 'profiles' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[#002147] text-sm">{p.studentName}</h4>
                    <div className="text-xs text-slate-500 font-medium">
                      {p.className} • Roll No: {p.rollNo}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-black text-xs">
                    Blood: {p.bloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Height</div>
                    <div className="font-mono font-bold text-slate-800">{p.heightCm} cm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Weight</div>
                    <div className="font-mono font-bold text-slate-800">{p.weightKg} kg</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">BMI</div>
                    <div className="font-mono font-bold text-emerald-700">{p.bmi} (Normal)</div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-700">Allergies:</span>
                    {p.allergies.map((a, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-bold text-[10px]"
                      >
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>

                  {p.emergencyRescueMeds && (
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Emergency Protocol:</strong> {p.emergencyRescueMeds}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                    <span className="font-bold text-slate-600">Vaccines:</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      ✓ Polio
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      ✓ MMR
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      ✓ Typhoid
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      ✓ Tetanus
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Emergency Doctor: <strong>{p.emergencyDoctorName}</strong> ({p.emergencyDoctorPhone})
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintMedicalCertificate) {
                        onPrintMedicalCertificate({
                          studentName: p.studentName,
                          className: p.className,
                          bloodGroup: p.bloodGroup,
                          bmi: p.bmi,
                          heightCm: p.heightCm,
                          weightKg: p.weightKg,
                          allergies: p.allergies.join(', '),
                          doctorNotes: p.doctorNotes || 'Physically fit and vaccinated.',
                          date: p.lastCheckupDate,
                          doctorName: p.emergencyDoctorName,
                        });
                      }
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Issue Fitness Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY ALERTS */}
      {activeTab === 'emergency_alerts' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong>Campus Medical Alert Notice:</strong> The following students carry high-risk medical conditions (asthma, severe drug/food allergies). School physical education faculty, cafeteria supervisors, and class teachers must maintain strict observation.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyAlertCases.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-rose-950 text-sm">{p.studentName}</h4>
                    <div className="text-xs text-slate-600">
                      {p.className} • Roll No: {p.rollNo}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-700 text-white rounded font-bold text-xs">
                    Blood: {p.bloodGroup}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-rose-900 font-bold">
                    ⚠️ Severe Allergies: {p.allergies.join(', ')}
                  </div>
                  <div className="text-slate-800">
                    <strong>Chronic Diagnosis:</strong> {p.chronicConditions.join(', ')}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-rose-800 text-[11px] font-medium">
                    🚨 <strong>Rescue Protocol:</strong> {p.emergencyRescueMeds}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-1 border-t border-rose-200 flex justify-between items-center">
                  <span>Contact: {p.emergencyDoctorPhone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHealthNotice(`Emergency Protocol sent via SMS to Class Incharge for ${p.studentName}`);
                      setTimeout(() => setHealthNotice(null), 4500);
                    }}
                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                  >
                    Send SMS Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW OPD VISIT */}
      {showNewVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Log Campus Clinic OPD Visit</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVisitModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Type</label>
                  <select
                    value={visitForm.patientType}
                    onChange={(e) =>
                      setVisitForm({ ...visitForm, patientType: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Staff">Faculty / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={visitForm.patientName}
                    onChange={(e) => setVisitForm({ ...visitForm, patientName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class / Designation</label>
                <input
                  type="text"
                  value={visitForm.className}
                  onChange={(e) => setVisitForm({ ...visitForm, className: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Symptoms / Complaint *</label>
                <input
                  type="text"
                  required
                  value={visitForm.symptoms}
                  onChange={(e) => setVisitForm({ ...visitForm, symptoms: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Vitals */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  Clinical Vitals
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={visitForm.temp}
                      onChange={(e) => setVisitForm({ ...visitForm, temp: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">BP (Sys/Dia)</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={`${visitForm.bpSystolic}/${visitForm.bpDiastolic}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('/');
                        setVisitForm({
                          ...visitForm,
                          bpSystolic: Number(parts[0]) || 120,
                          bpDiastolic: Number(parts[1]) || 80,
                        });
                      }}
                      className="w-full p-1.5 border rounded bg-white text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={visitForm.pulse}
                      onChange={(e) => setVisitForm({ ...visitForm, pulse: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">SpO2 (%)</label>
                    <input
                      type="number"
                      value={visitForm.spo2}
                      onChange={(e) => setVisitForm({ ...visitForm, spo2: Number(e.target.value) })}
                      className="w-full p-1.5 border rounded bg-white text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={visitForm.diagnosis}
                  onChange={(e) => setVisitForm({ ...visitForm, diagnosis: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medications / First Aid (comma separated)</label>
                <input
                  type="text"
                  value={visitForm.treatment}
                  onChange={(e) => setVisitForm({ ...visitForm, treatment: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disposition</label>
                  <select
                    value={visitForm.disposition}
                    onChange={(e) => setVisitForm({ ...visitForm, disposition: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Sent Back to Class">Sent Back to Class</option>
                    <option value="Resting in Infirmary">Resting in Infirmary</option>
                    <option value="Sent Home with Guardian">Sent Home with Guardian</option>
                    <option value="Referred to Hospital">Referred to Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attending Nurse/Doctor</label>
                  <input
                    type="text"
                    value={visitForm.doctorName}
                    onChange={(e) => setVisitForm({ ...visitForm, doctorName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notifyParent"
                  checked={visitForm.parentNotified}
                  onChange={(e) =>
                    setVisitForm({ ...visitForm, parentNotified: e.target.checked })
                  }
                  className="rounded text-emerald-600"
                />
                <label htmlFor="notifyParent" className="font-bold text-slate-700">
                  Send Instant SMS Notification to Registered Parent Phone
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewVisitModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save OPD Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

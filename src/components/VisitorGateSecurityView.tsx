import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Plus,
  Printer,
  Clock,
  Car,
  IdCard,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileCheck,
  BadgeCheck,
  DoorOpen,
  Eye,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { VisitorGatePass, EmergencyStudentGatePass, Student } from '../types';
import { INITIAL_VISITOR_PASSES, INITIAL_EARLY_LEAVE_PASSES } from '../data/phase7Data';

interface VisitorGateSecurityViewProps {
  students: Student[];
  onPrintVisitorPass?: (pass: VisitorGatePass) => void;
  onPrintStudentGatePass?: (pass: EmergencyStudentGatePass) => void;
}

export default function VisitorGateSecurityView({
  students,
  onPrintVisitorPass,
  onPrintStudentGatePass,
}: VisitorGateSecurityViewProps) {
  const [visitorPasses, setVisitorPasses] = useState<VisitorGatePass[]>(INITIAL_VISITOR_PASSES);
  const [earlyLeavePasses, setEarlyLeavePasses] = useState<EmergencyStudentGatePass[]>(
    INITIAL_EARLY_LEAVE_PASSES
  );

  const [activeTab, setActiveTab] = useState<'visitors' | 'early_leave' | 'vehicles' | 'policy'>(
    'visitors'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [securityLevel, setSecurityLevel] = useState<'Normal' | 'Heightened' | 'High Alert'>('Normal');

  // Modal States
  const [showNewVisitorModal, setShowNewVisitorModal] = useState(false);
  const [showStudentPassModal, setShowStudentPassModal] = useState(false);

  // New Visitor Form State
  const [newVisitor, setNewVisitor] = useState<Partial<VisitorGatePass>>({
    visitorName: '',
    cnicNo: '',
    contactNo: '',
    visitorType: 'Parent / Guardian',
    purposeOfVisit: 'Parent Teacher Consultation',
    personToMeet: 'Class Teacher',
    department: 'Academic Wing',
    vehicleNo: '',
    badgeNumber: `VIS-${Math.floor(10 + Math.random() * 90)}`,
    securityOfficer: 'Subedar (R) Muhammad Rafiq',
  });

  // Student Emergency Leave Form State
  const [studentLeaveForm, setStudentLeaveForm] = useState({
    studentId: students[0]?.id || '',
    parentGuardianName: '',
    guardianCnic: '',
    guardianPhone: '',
    relationship: 'Father' as 'Father' | 'Mother' | 'Guardian' | 'Authorized Driver',
    reasonForLeave: 'Medical Appointment / Illness',
    approvedByTeacher: 'Class Incharge',
    approvedByPrincipal: 'Prof. Tariq Mahmood (Principal)',
  });

  // Stats
  const activeInsideCampus = visitorPasses.filter((v) => v.status === 'Inside Campus').length;
  const todayCheckedOut = visitorPasses.filter((v) => v.status === 'Checked Out').length;
  const earlyLeavesToday = earlyLeavePasses.length;

  const filteredVisitors = visitorPasses.filter(
    (v) =>
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cnicNo.includes(searchTerm) ||
      v.passNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.personToMeet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.vehicleNo && v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.visitorName || !newVisitor.cnicNo) {
      alert('Visitor Name and CNIC Number are mandatory');
      return;
    }

    const created: VisitorGatePass = {
      id: `vp-${Date.now()}`,
      passNo: `GP-2024-${String(visitorPasses.length + 944).padStart(4, '0')}`,
      visitorName: newVisitor.visitorName || '',
      cnicNo: newVisitor.cnicNo || '',
      contactNo: newVisitor.contactNo || '0300-0000000',
      visitorType: (newVisitor.visitorType as any) || 'Parent / Guardian',
      purposeOfVisit: newVisitor.purposeOfVisit || 'Official Visit',
      personToMeet: newVisitor.personToMeet || 'Campus Principal',
      department: newVisitor.department || 'Administration',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicleNo: newVisitor.vehicleNo || undefined,
      badgeNumber: newVisitor.badgeNumber || 'VIS-99',
      securityOfficer: newVisitor.securityOfficer || 'Subedar (R) Muhammad Rafiq',
      securityCheckPassed: true,
      status: 'Inside Campus',
    };

    setVisitorPasses([created, ...visitorPasses]);
    setShowNewVisitorModal(false);
    alert(`Gate Pass #${created.passNo} issued to ${created.visitorName}. Badge: ${created.badgeNumber}`);
  };

  const handleCheckOutVisitor = (id: string) => {
    const exitTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitorPasses(
      visitorPasses.map((v) =>
        v.id === id
          ? {
              ...v,
              exitTime: exitTimeStr,
              status: 'Checked Out',
            }
          : v
      )
    );
    alert(`Visitor checked out successfully at ${exitTimeStr}. Badge recovered.`);
  };

  const handleCreateEarlyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStd = students.find((s) => s.id === studentLeaveForm.studentId) || students[0];

    const pass: EmergencyStudentGatePass = {
      id: `egp-${Date.now()}`,
      passNo: `EGP-2024-${String(earlyLeavePasses.length + 43).padStart(3, '0')}`,
      studentId: selectedStd.id,
      studentName: selectedStd.name,
      className: selectedStd.className,
      rollNo: selectedStd.rollNo,
      parentGuardianName: studentLeaveForm.parentGuardianName || selectedStd.fatherName,
      guardianCnic: studentLeaveForm.guardianCnic || '35202-0000000-0',
      guardianPhone: studentLeaveForm.guardianPhone || selectedStd.emergencyContact,
      relationship: studentLeaveForm.relationship,
      reasonForLeave: studentLeaveForm.reasonForLeave,
      issueTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approvedByTeacher: studentLeaveForm.approvedByTeacher,
      approvedByPrincipal: studentLeaveForm.approvedByPrincipal,
      parentConsentVerified: true,
      securityGateCleared: true,
      status: 'Approved & Exited',
    };

    setEarlyLeavePasses([pass, ...earlyLeavePasses]);
    setShowStudentPassModal(false);
    alert(`Emergency Gate Pass #${pass.passNo} approved for student ${pass.studentName}`);
  };

  return (
    <div id="visitor-gate-security-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#132338] to-[#1c385a] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Campus Security &amp; Visitor Gate Pass Directorate
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950">
              Phase 7
            </span>
          </div>
          <p className="text-slate-300 text-xs max-w-2xl">
            NADRA CNIC visitor credentialing, emergency student early-leave gate passes, vehicle tag verification, and security guard shifts.
          </p>
        </div>

        {/* Security Readiness Level Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Alert Level:</span>
            <select
              value={securityLevel}
              onChange={(e) => setSecurityLevel(e.target.value as any)}
              className={`font-bold rounded px-2 py-0.5 text-xs focus:outline-none ${
                securityLevel === 'Normal'
                  ? 'bg-emerald-600 text-white'
                  : securityLevel === 'Heightened'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              <option value="Normal">Level 1: Normal Routine</option>
              <option value="Heightened">Level 2: Heightened Vigilance</option>
              <option value="High Alert">Level 3: High Security Lockdown</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowNewVisitorModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Visitor Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStudentPassModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Student Early Leave Pass</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inside Campus
            </div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{activeInsideCampus}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Active Visitor Badges</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <DoorOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Checked Out
            </div>
            <div className="text-xl font-black text-slate-700 mt-0.5">{todayCheckedOut}</div>
            <div className="text-[10px] text-slate-400">Completed Visits Today</div>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Student Early Exits
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{earlyLeavesToday}</div>
            <div className="text-[10px] text-amber-700 font-semibold">Parent Verified Passes</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <IdCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Gate Incharge
            </div>
            <div className="text-xs font-black text-[#002147] mt-1 truncate max-w-[130px]">
              Subedar (R) M. Rafiq
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Main Gate 1 • Shift A</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('visitors')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'visitors'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Visitor Gate Passes ({visitorPasses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('early_leave')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'early_leave'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Emergency Student Leave Passes ({earlyLeavePasses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'vehicles'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle License Tag Log</span>
        </button>
      </div>

      {/* TAB 1: VISITOR GATE PASSES */}
      {activeTab === 'visitors' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Visitor Name, CNIC, Pass #, Official Person to Meet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Pass No &amp; Badge</th>
                  <th className="p-3">Visitor Credentials</th>
                  <th className="p-3">Visitor Category</th>
                  <th className="p-3">Purpose &amp; Official to Meet</th>
                  <th className="p-3">Entry / Exit Time</th>
                  <th className="p-3">Vehicle Reg</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredVisitors.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">
                      <div className="text-[#002147]">{pass.passNo}</div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
                        {pass.badgeNumber}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{pass.visitorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        CNIC: {pass.cnicNo} • Ph: {pass.contactNo}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-medium text-[11px]">
                        {pass.visitorType}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-800">{pass.personToMeet}</div>
                      <div className="text-[10px] text-slate-500 max-w-xs truncate">
                        {pass.purposeOfVisit}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-slate-600">
                      <div>In: <strong className="text-emerald-700">{pass.entryTime}</strong></div>
                      <div>Out: {pass.exitTime ? <strong className="text-slate-800">{pass.exitTime}</strong> : '—'}</div>
                    </td>

                    <td className="p-3 font-mono text-slate-700">
                      {pass.vehicleNo ? (
                        <span className="px-2 py-0.5 bg-slate-100 border rounded text-[10px] font-bold">
                          {pass.vehicleNo}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">On Foot</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                          pass.status === 'Inside Campus'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pass.status === 'Inside Campus'
                              ? 'bg-emerald-600 animate-ping'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>{pass.status}</span>
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pass.status === 'Inside Campus' && (
                          <button
                            type="button"
                            onClick={() => handleCheckOutVisitor(pass.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs transition"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Check Out</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (onPrintVisitorPass) {
                              onPrintVisitorPass(pass);
                            } else {
                              alert(`Printing Official Gate Pass Receipt #${pass.passNo} for ${pass.visitorName}`);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                          title="Print Visitor Pass Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
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

      {/* TAB 2: EMERGENCY STUDENT EARLY LEAVE PASSES */}
      {activeTab === 'early_leave' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-amber-600" />
              <span>Student Emergency Early Departure Verification Registry</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Strict NADRA CNIC &amp; Principal Signoff Verification Mandated
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Gate Pass #</th>
                  <th className="p-3">Student Details</th>
                  <th className="p-3">Authorized Guardian</th>
                  <th className="p-3">Reason for Early Leave</th>
                  <th className="p-3">Departure Time</th>
                  <th className="p-3">Approvals</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {earlyLeavePasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-[#002147]">{pass.passNo}</td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{pass.studentName}</div>
                      <div className="text-[10px] text-slate-500">
                        {pass.className} • Roll #{pass.rollNo}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-900">
                        {pass.parentGuardianName} ({pass.relationship})
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        CNIC: {pass.guardianCnic} • Ph: {pass.guardianPhone}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-700 max-w-xs">{pass.reasonForLeave}</div>
                    </td>

                    <td className="p-3 font-mono text-amber-700 font-bold">{pass.issueTime}</td>

                    <td className="p-3 text-[11px] text-slate-600">
                      <div>Teacher: {pass.approvedByTeacher}</div>
                      <div>Principal: {pass.approvedByPrincipal}</div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pass.status === 'Approved & Exited'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pass.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrintStudentGatePass) {
                            onPrintStudentGatePass(pass);
                          } else {
                            alert(`Printing Emergency Student Gate Pass #${pass.passNo} for ${pass.studentName}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px] flex items-center gap-1 ml-auto shadow-xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VEHICLE TAGS */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-sky-600" />
              <span>Registered Authorized Vehicles &amp; Drop-off Placards</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ANPR Camera Automatic Number Plate Recognition Link Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>School Van #1 (Hiace)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                  PERMIT OK
                </span>
              </div>
              <div className="font-mono text-sm font-black text-[#002147]">LEG-4821</div>
              <div className="text-[11px] text-slate-500">Driver: Muhammad Ramzan (0300-8819283)</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Principal Official Car</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                  STAFF VIP
                </span>
              </div>
              <div className="font-mono text-sm font-black text-[#002147]">LEA-2041</div>
              <div className="text-[11px] text-slate-500">Designation: Campus Principal &amp; Admin Head</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>School Coaster #2</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                  PERMIT OK
                </span>
              </div>
              <div className="font-mono text-sm font-black text-[#002147]">LXZ-9012</div>
              <div className="text-[11px] text-slate-500">Driver: Muhammad Siddique (0321-7788990)</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NEW VISITOR PASS */}
      {showNewVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <IdCard className="w-5 h-5 text-[#002147]" />
                <h3 className="font-bold text-slate-900 text-base">Issue Official Visitor Gate Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVisitorModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Aslam"
                    value={newVisitor.visitorName}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#002147]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NADRA CNIC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="35202-xxxxxxx-x"
                    value={newVisitor.cnicNo}
                    onChange={(e) => setNewVisitor({ ...newVisitor, cnicNo: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-1 focus:ring-[#002147]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Mobile No</label>
                  <input
                    type="text"
                    placeholder="0300-xxxxxxx"
                    value={newVisitor.contactNo}
                    onChange={(e) => setNewVisitor({ ...newVisitor, contactNo: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visitor Category</label>
                  <select
                    value={newVisitor.visitorType}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, visitorType: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Official / Inspector">Official / Inspector (PEF / BISE)</option>
                    <option value="Vendor / Contractor">Vendor / Contractor</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official / Person to Meet</label>
                  <input
                    type="text"
                    placeholder="e.g. Campus Principal"
                    value={newVisitor.personToMeet}
                    onChange={(e) => setNewVisitor({ ...newVisitor, personToMeet: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Reg (If any)</label>
                  <input
                    type="text"
                    placeholder="e.g. LEA-2041 (Leave blank if on foot)"
                    value={newVisitor.vehicleNo}
                    onChange={(e) => setNewVisitor({ ...newVisitor, vehicleNo: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <textarea
                  rows={2}
                  placeholder="Detail the agenda for campus entry..."
                  value={newVisitor.purposeOfVisit}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purposeOfVisit: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewVisitorModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold shadow-sm"
                >
                  Authorize &amp; Print Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STUDENT EMERGENCY LEAVE PASS */}
      {showStudentPassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Issue Emergency Student Early-Leave Gate Pass
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentPassModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEarlyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={studentLeaveForm.studentId}
                  onChange={(e) =>
                    setStudentLeaveForm({ ...studentLeaveForm, studentId: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.name} ({s.className} - Sec {s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Authorized Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Aslam"
                    value={studentLeaveForm.parentGuardianName}
                    onChange={(e) =>
                      setStudentLeaveForm({
                        ...studentLeaveForm,
                        parentGuardianName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={studentLeaveForm.relationship}
                    onChange={(e) =>
                      setStudentLeaveForm({
                        ...studentLeaveForm,
                        relationship: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Authorized Driver">Authorized Driver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian CNIC No</label>
                  <input
                    type="text"
                    placeholder="35202-xxxxxxx-x"
                    value={studentLeaveForm.guardianCnic}
                    onChange={(e) =>
                      setStudentLeaveForm({ ...studentLeaveForm, guardianCnic: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Phone No</label>
                  <input
                    type="text"
                    placeholder="0300-xxxxxxx"
                    value={studentLeaveForm.guardianPhone}
                    onChange={(e) =>
                      setStudentLeaveForm({ ...studentLeaveForm, guardianPhone: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Early Leave *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. High fever / Medical consultation / Family emergency..."
                  value={studentLeaveForm.reasonForLeave}
                  onChange={(e) =>
                    setStudentLeaveForm({ ...studentLeaveForm, reasonForLeave: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowStudentPassModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold shadow-sm"
                >
                  Approve &amp; Generate Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

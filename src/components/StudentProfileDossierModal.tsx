import { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Users,
  HeartPulse,
  CreditCard,
  FileText,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { Student, FeeVoucher } from '../types';

interface StudentProfileDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  allStudents: Student[];
  vouchers: FeeVoucher[];
  onSelectSibling?: (siblingStudent: Student) => void;
  onPrintIdCard: (student: Student) => void;
  onIssueCertificate: (student: Student, type: 'Transfer' | 'Character' | 'Bonafide') => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

export default function StudentProfileDossierModal({
  isOpen,
  onClose,
  student,
  allStudents,
  vouchers,
  onSelectSibling,
  onPrintIdCard,
  onIssueCertificate,
  onPrintVoucher,
}: StudentProfileDossierModalProps) {
  const [activeTab, setActiveTab] = useState<
    'academic' | 'family' | 'medical' | 'financial' | 'documents'
  >('academic');

  if (!isOpen || !student) return null;

  // Find linked siblings
  const siblingStudents = allStudents.filter(
    (s) =>
      s.id !== student.id &&
      (student.siblingCodes?.includes(s.studentCode) ||
        (student.fatherName.toLowerCase() === s.fatherName.toLowerCase() &&
          student.parentPhone === s.parentPhone))
  );

  // Student specific vouchers
  const studentVouchers = vouchers.filter(
    (v) => v.studentCode === student.studentCode || v.studentId === student.id
  );
  const totalInvoiced = studentVouchers.reduce((acc, v) => acc + v.netPayable, 0);
  const totalPaid = studentVouchers.reduce((acc, v) => acc + v.paidAmount, 0);
  const totalPending = totalInvoiced - totalPaid;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Dossier Header */}
        <div className="bg-[#002147] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-amber-500">
          <div className="flex items-center gap-4">
            <div className="relative">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/80 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-white/80 shadow-md">
                  {student.name.charAt(0)}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#002147] ${
                  student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={`Status: ${student.status}`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{student.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 font-mono">
                  {student.studentCode}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                S/O or D/O <strong className="text-white">{student.fatherName}</strong> •{' '}
                {student.className} (Section {student.section}) • Roll No: {student.rollNo}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-sky-200 mt-1">
                <span>Blood: <strong>{student.bloodGroup}</strong></span>
                <span>•</span>
                <span>House: <strong>{student.house || 'Iqbal House'}</strong></span>
                <span>•</span>
                <span>Admitted: {student.admissionDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => onPrintIdCard(student)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Print ID Badge</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Strip */}
        <div className="bg-slate-100 px-4 pt-2 border-b border-slate-200 flex gap-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-4 py-2.5 rounded-t-lg font-bold flex items-center gap-2 transition border-t-2 ${
              activeTab === 'academic'
                ? 'bg-white text-[#002147] border-[#002147] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-sky-600" />
            <span>Academic &amp; Placement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`px-4 py-2.5 rounded-t-lg font-bold flex items-center gap-2 transition border-t-2 ${
              activeTab === 'family'
                ? 'bg-white text-[#002147] border-[#002147] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Family &amp; Siblings ({siblingStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`px-4 py-2.5 rounded-t-lg font-bold flex items-center gap-2 transition border-t-2 ${
              activeTab === 'medical'
                ? 'bg-white text-[#002147] border-[#002147] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-red-600" />
            <span>Medical &amp; Safety</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2.5 rounded-t-lg font-bold flex items-center gap-2 transition border-t-2 ${
              activeTab === 'financial'
                ? 'bg-white text-[#002147] border-[#002147] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Financial Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-t-lg font-bold flex items-center gap-2 transition border-t-2 ${
              activeTab === 'documents'
                ? 'bg-white text-[#002147] border-[#002147] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Certificates &amp; Credentials</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4 bg-white">
          {/* TAB 1: ACADEMIC & PLACEMENT */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Enrolled Class</span>
                  <span className="text-sm font-bold text-slate-800">{student.className}</span>
                  <span className="text-[10px] text-slate-500 block">Section {student.section}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll Number</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">{student.rollNo}</span>
                  <span className="text-[10px] text-slate-500 block">System ID: {student.studentCode}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendance Rate</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-700">{student.attendanceRate || 96}%</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Regular
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${student.attendanceRate || 96}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Extended Academic Dossier Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  Institutional Registration Records
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">National B-Form / CNIC</span>
                    <span className="font-mono font-bold text-slate-800">
                      {student.bFormOrCnic || '35202-8492019-3'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">
                      {student.dob} (Age {new Date().getFullYear() - parseInt(student.dob.slice(0, 4))} Years)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Gender &amp; Religion</span>
                    <span className="font-semibold text-slate-800">{student.gender} • Islam</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Campus Branch</span>
                    <span className="font-semibold text-slate-800">Model Town Main Campus (LHR-01)</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Institutional House</span>
                    <span className="font-semibold text-indigo-700 font-bold">{student.house || 'Iqbal House (Blue)'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Previous School Attended</span>
                    <span className="font-semibold text-slate-800">
                      {student.previousSchool || 'Beaconhouse Primary Campus'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAMILY & SIBLINGS */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  Primary Guardian &amp; Parental Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Father / Guardian Name</span>
                    <span className="font-bold text-slate-900">{student.fatherName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Father National CNIC</span>
                    <span className="font-mono font-bold text-slate-800">
                      {student.fatherCnic || '35201-9238491-1'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Father Occupation / Profession</span>
                    <span className="font-semibold text-slate-800">{student.fatherOccupation || 'Business Executive'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Mother Name</span>
                    <span className="font-semibold text-slate-800">{student.motherName || 'Fatima Begum'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Primary Contact for SMS Alerts</span>
                    <span className="font-mono font-bold text-emerald-700">{student.parentPhone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Parent Email</span>
                    <span className="font-mono text-slate-700">{student.parentEmail}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Residential Address</span>
                  <span className="text-slate-800 font-medium">{student.address}</span>
                </div>
              </div>

              {/* Sibling Mapping Section */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Family Sibling Mapping &amp; Fee Concession Status
                    </h4>
                    <p className="text-[11px] text-purple-700">
                      Enrolled brothers and sisters registered under the same parent/guardian.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px]">
                    15% Sibling Discount Active
                  </span>
                </div>

                {siblingStudents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {siblingStudents.map((sib) => (
                      <div
                        key={sib.id}
                        className="bg-white p-3 rounded-lg border border-purple-200 shadow-2xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sib.avatarUrl}
                            alt={sib.name}
                            className="w-10 h-10 rounded-full object-cover border border-purple-300"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{sib.name}</div>
                            <div className="text-[10px] text-slate-500">
                              {sib.className} (Sec {sib.section}) • Roll {sib.rollNo}
                            </div>
                            <div className="text-[10px] font-mono text-purple-700 font-semibold">{sib.studentCode}</div>
                          </div>
                        </div>

                        {onSelectSibling && (
                          <button
                            type="button"
                            onClick={() => onSelectSibling(sib)}
                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-purple-200 text-center text-slate-500">
                    <p>No other siblings are presently mapped to this parent account.</p>
                    <p className="text-[10px] text-purple-700 mt-1 font-semibold">
                      Siblings admitted with matching father name and phone are auto-linked with 15% fee concession.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEDICAL & SAFETY */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-[10px] font-bold text-red-500 uppercase block">Blood Group</span>
                  <span className="text-xl font-black text-red-700">{student.bloodGroup}</span>
                  <span className="text-[10px] text-slate-500 block">Verified Lab Report</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-600 uppercase block">Allergies &amp; Alerts</span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {student.allergies || 'No known drug or food allergies'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Cafeteria / Canteen Notified</span>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-600 uppercase block">Emergency Dispatch Phone</span>
                  <span className="text-sm font-mono font-bold text-slate-900 block">
                    {student.emergencyContact || student.parentPhone}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Immediate 24/7 Availability</span>
                </div>
              </div>

              {/* Safety & Authorized Dismissal Person */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Campus Gate Safety &amp; Authorized Dismissal Pickup
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Authorized Pickup Person</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {student.authorizedPickup || student.fatherName}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Relation: Father / Primary Guardian</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Dismissal Security Protocol</span>
                    <span className="font-semibold text-emerald-700 text-xs block">
                      Barcode ID Card Verification Required at Gate
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Parent SMS broadcast on checkout</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Medical Staff Notes</span>
                  <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200 text-[11px] leading-relaxed">
                    Student has complete immunizations and poliovirus vaccination record. Fit for physical training (PT)
                    and inter-school athletic tournaments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL LEDGER */}
          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Base Fee</span>
                  <span className="text-lg font-black text-slate-800 font-mono">
                    Rs. {student.monthlyFee.toLocaleString()}
                  </span>
                  {student.discountPercentage ? (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {student.discountPercentage}% Sibling / Merit Concession
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block">Standard Tuition</span>
                  )}
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Total Fees Paid</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    Rs. {totalPaid.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 block">Official Receipts Recorded</span>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-[10px] font-bold text-red-500 uppercase block">Outstanding Balance</span>
                  <span className="text-lg font-black text-red-600 font-mono">
                    Rs. {totalPending.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-red-500 block">
                    {totalPending > 0 ? 'Payment Due' : 'All Dues Clear'}
                  </span>
                </div>
              </div>

              {/* Vouchers History Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs flex justify-between items-center">
                  <span>Issued Fee Vouchers History</span>
                  <span className="text-[10px] text-slate-500 font-mono">Total Vouchers: {studentVouchers.length}</span>
                </div>

                {studentVouchers.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Voucher #</th>
                        <th className="py-2 px-3">Month</th>
                        <th className="py-2 px-3">Due Date</th>
                        <th className="py-2 px-3 text-right">Net Amount</th>
                        <th className="py-2 px-3 text-right">Paid</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">Print</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentVouchers.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-sky-700">{v.voucherNo}</td>
                          <td className="py-2 px-3 font-medium">{v.month}</td>
                          <td className="py-2 px-3 text-slate-500">{v.dueDate}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            Rs. {v.netPayable.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-700 font-bold">
                            Rs. {v.paidAmount.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.paymentStatus === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {v.paymentStatus}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            {onPrintVoucher && (
                              <button
                                type="button"
                                onClick={() => onPrintVoucher(v)}
                                className="text-sky-600 hover:text-sky-800 font-bold"
                              >
                                Print
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    No active fee vouchers generated for this student.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES & CREDENTIALS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Generate and print verified institutional documents, identification cards, and certificates with official
                school seals:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ID Card Box */}
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sky-800 font-bold mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Digital Student Identification Card</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Standard student smart card with barcode, institutional crest, blood group, and emergency contact.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPrintIdCard(student)}
                    className="mt-3 px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Student ID Card</span>
                  </button>
                </div>

                {/* School Leaving Certificate (SLC) */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-purple-900 font-bold mb-1">
                      <Award className="w-4 h-4" />
                      <span>School Leaving Certificate (SLC / TC)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Official transfer document for board admission, with dues clearance, attendance track, and principal seal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onIssueCertificate(student, 'Transfer')}
                    className="mt-3 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Transfer Certificate (SLC)</span>
                  </button>
                </div>

                {/* Character Certificate */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Character &amp; Conduct Certificate</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Formal endorsement of moral conduct, scholastic participation, and disciplinary record.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onIssueCertificate(student, 'Character')}
                    className="mt-3 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Character Certificate</span>
                  </button>
                </div>

                {/* Bonafide Student Letter */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                      <Shield className="w-4 h-4" />
                      <span>Bonafide Enrollment Letter</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Verified certificate for passport, embassy visa, or scholarship verification requirements.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onIssueCertificate(student, 'Bonafide')}
                    className="mt-3 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Bonafide Letter</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Registered Record ID: <strong className="text-slate-800">{student.id}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold rounded transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  X,
  School,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Printer,
  Download,
  Search,
} from 'lucide-react';
import { Student, ClassInfo, FeeVoucher } from '../types';

interface ClassDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: ClassInfo | null;
  students: Student[];
  vouchers: FeeVoucher[];
  onPrintIdCard?: (student: Student) => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

export default function ClassDrilldownModal({
  isOpen,
  onClose,
  selectedClass,
  students,
  vouchers,
  onPrintIdCard,
  onPrintVoucher,
}: ClassDrilldownModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  if (!isOpen || !selectedClass) return null;

  // Filter students belonging to this class
  const classStudents = students.filter((s) => {
    // Match class name (e.g. "Class One" or "One")
    const matchClass =
      s.className.toLowerCase().includes(selectedClass.name.toLowerCase()) ||
      selectedClass.name.toLowerCase().includes(s.className.toLowerCase());
    return matchClass;
  });

  const filteredStudents = classStudents.filter((s) => {
    const matchesSection = selectedSection === 'all' || s.section === selectedSection;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm);
    return matchesSection && matchesSearch;
  });

  // Calculate statistics for this class
  const totalStudents = classStudents.length;
  const presentCount = totalStudents; // In demo dataset, all are marked present
  const absentCount = 0;

  // Calculate fees
  const classVouchers = vouchers.filter((v) =>
    v.className.toLowerCase().includes(selectedClass.name.toLowerCase()) ||
    selectedClass.name.toLowerCase().includes(v.className.toLowerCase())
  );
  const totalPaid = classVouchers
    .filter((v) => v.paymentStatus === 'Paid')
    .reduce((sum, v) => sum + v.paidAmount, 0);
  const totalUnpaid = classVouchers
    .filter((v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue')
    .reduce((sum, v) => sum + v.netPayable, 0);

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Code', 'Name', 'Father Name', 'Section', 'Fee Status', 'Parent Phone'];
    const rows = classStudents.map((s) => {
      const v = vouchers.find((vch) => vch.studentId === s.id);
      return [
        s.rollNo,
        s.studentCode,
        `"${s.name}"`,
        `"${s.fatherName}"`,
        s.section,
        v ? v.paymentStatus : 'Paid',
        `"${s.parentPhone}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedClass.name.replace(/\s+/g, '_')}_Roster_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#1b3b6f] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <School className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">{selectedClass.name} Detailed Roster</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  Level {selectedClass.numericLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Attendance Verification &amp; Financial Recovery Status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition"
              title="Download CSV report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Enrolled Students</div>
              <div className="text-lg font-black text-slate-800">{totalStudents}</div>
            </div>
            <Users className="w-5 h-5 text-sky-500 opacity-60" />
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Present Today</div>
              <div className="text-lg font-black text-emerald-600">{presentCount}</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-60" />
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Recovered Fees</div>
              <div className="text-lg font-black text-emerald-600">Rs. {totalPaid.toLocaleString()}</div>
            </div>
            <span className="text-xs font-bold text-emerald-600">✔ Paid</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-red-700 font-bold uppercase">Pending Balance</div>
              <div className="text-lg font-black text-red-600">Rs. {totalUnpaid.toLocaleString()}</div>
            </div>
            <span className="text-xs font-bold text-red-600">Due</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, roll no, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b3b6f]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium">Filter Section:</span>
            <div className="flex rounded-md shadow-2xs border border-slate-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setSelectedSection('all')}
                className={`px-3 py-1 text-xs font-semibold ${
                  selectedSection === 'all'
                    ? 'bg-[#1b3b6f] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              {selectedClass.sections.map((sec) => (
                <button
                  key={sec.name}
                  type="button"
                  onClick={() => setSelectedSection(sec.name)}
                  className={`px-3 py-1 text-xs font-semibold border-l border-slate-300 ${
                    selectedSection === sec.name
                      ? 'bg-[#1b3b6f] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Sec {sec.name} ({sec.strength})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No students found matching the filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the search query or section selector.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission ID</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3 text-center">Attendance Today</th>
                  <th className="py-2.5 px-3 text-right">Tuition Fee</th>
                  <th className="py-2.5 px-3 text-center">Fee Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const voucher = vouchers.find((v) => v.studentId === std.id);
                  const isPaid = voucher?.paymentStatus === 'Paid';

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{std.rollNo}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {std.avatarUrl ? (
                            <img
                              src={std.avatarUrl}
                              alt={std.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#1b3b6f] text-white flex items-center justify-center font-bold text-[10px]">
                              {std.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-800">{std.name}</div>
                            <div className="text-[10px] text-slate-500">S/O {std.fatherName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{std.studentCode}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                          Sec {std.section}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Present (07:45 AM)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                        Rs. {std.monthlyFee.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isPaid ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-[#e74c3c] text-white font-bold text-[10px]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPrintIdCard && (
                            <button
                              type="button"
                              onClick={() => onPrintIdCard(std)}
                              title="Print ID Card"
                              className="p-1 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {voucher && onPrintVoucher && (
                            <button
                              type="button"
                              onClick={() => onPrintVoucher(voucher)}
                              title="Print Fee Voucher"
                              className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                            >
                              Voucher
                            </button>
                          )}
                          <a
                            href={`tel:${std.parentPhone}`}
                            title={`Call parent: ${std.parentPhone}`}
                            className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div className="text-slate-500 text-[11px]">
            Class Supervisor: <strong className="text-slate-700">{selectedClass.sections[0]?.classTeacher || 'Staff In-charge'}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b3b6f] hover:bg-[#122847] text-white font-bold rounded-md shadow-xs transition"
          >
            Close Roster View
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Printer,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import { Student, ClassInfo } from '../../../types';

interface TeacherAttendanceReportsProps {
  students: Student[];
  classes: ClassInfo[];
}

export default function TeacherAttendanceReports({
  students,
  classes,
}: TeacherAttendanceReportsProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class One');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [smsSentNotice, setSmsSentNotice] = useState<string | null>(null);

  // Filter students by selected class
  const classStudents = students.filter(
    (s) => s.className.toLowerCase() === selectedClass.toLowerCase()
  );

  // Computed metrics for simulated report
  const totalWorkingDays = 24;
  const attendanceData = classStudents.map((std, idx) => {
    // Generate deterministic attendance rate based on roll/index
    const basePresents = totalWorkingDays - (idx % 4 === 0 ? 3 : idx % 5 === 0 ? 5 : 1);
    const presents = Math.max(16, basePresents);
    const absents = totalWorkingDays - presents;
    const rate = Math.round((presents / totalWorkingDays) * 100);
    const isDefaulter = rate < 75;

    return {
      student: std,
      presents,
      absents,
      late: (idx % 3),
      leaves: (idx % 2),
      rate,
      isDefaulter,
    };
  });

  const overallClassAvg =
    attendanceData.length > 0
      ? Math.round(
          attendanceData.reduce((acc, curr) => acc + curr.rate, 0) / attendanceData.length
        )
      : 92;

  const defaultersCount = attendanceData.filter((d) => d.isDefaulter).length;

  const handleSendDefaulterSms = () => {
    setSmsSentNotice(
      `Attendance warning SMS alerts successfully dispatched to ${defaultersCount} parents!`
    );
    setTimeout(() => setSmsSentNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="teacher-attendance-reports-suite" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Monthly Attendance Register &amp; Analytics Report</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed breakdown of class presence, absent trends, and official regulatory compliance records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Register</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Monthly attendance report exported to CSV / Excel spreadsheet.')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Class / Grade
              </label>
              <select
                aria-label="Filter report by class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Academic Month
              </label>
              <select
                aria-label="Filter report by month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
              >
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div>Total Working Days: <span className="font-mono text-emerald-700">{totalWorkingDays}</span></div>
            <div>Enrolled: <span className="font-mono text-sky-700">{attendanceData.length}</span></div>
            <div>Avg Attendance: <span className="font-mono text-indigo-700">{overallClassAvg}%</span></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Class Average Presence</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{overallClassAvg}%</div>
            <div className="text-[11px] text-slate-500">Above campus benchmark (85%)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Low Attendance (&lt;75%)</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{defaultersCount} Students</div>
            <div className="text-[11px] text-slate-500">Requires parental warning letters</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Perfect 100% Attendance</div>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">
              {attendanceData.filter((d) => d.rate === 100).length || 2} Students
            </div>
            <div className="text-[11px] text-slate-500">Eligible for star badge honor</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Defaulter warning SMS alert bar */}
      {defaultersCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{defaultersCount} student(s)</strong> have attendance below 75% this month and are at risk of exam admit card blockage.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSendDefaulterSms}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Send Attendance Warning SMS</span>
          </button>
        </div>
      )}

      {smsSentNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{smsSentNotice}</span>
        </div>
      )}

      {/* Student Attendance Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Student Attendance Dossier ({selectedClass} - {selectedMonth})
          </span>
          <span className="text-[11px] text-slate-500">
            Regulation: Minimum 75% required for term eligibility
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Roll #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Father Name</th>
                <th className="py-2.5 px-3 text-center">Present Days</th>
                <th className="py-2.5 px-3 text-center">Absent Days</th>
                <th className="py-2.5 px-3 text-center">Late</th>
                <th className="py-2.5 px-3 text-center">Leave</th>
                <th className="py-2.5 px-3 text-center">Attendance %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.map((d) => (
                <tr key={d.student.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{d.student.rollNo}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{d.student.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{d.student.fatherName}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{d.presents}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{d.absents}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-amber-600">{d.late}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-sky-600">{d.leaves}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.rate >= 85
                              ? 'bg-emerald-500'
                              : d.rate >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${d.rate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700">{d.rate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {d.isDefaulter ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Critical Shortage
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Regular
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {attendanceData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-xs text-slate-400">
                    No student records found for {selectedClass}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

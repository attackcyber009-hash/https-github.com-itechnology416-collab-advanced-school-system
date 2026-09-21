import { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Send,
  Save,
  Printer,
  Calendar,
  AlertCircle,
  FileCheck,
  Filter,
} from 'lucide-react';
import { Student, ClassInfo } from '../../../types';

interface TeacherAttendanceManageProps {
  students: Student[];
  classes: ClassInfo[];
}

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  remarks: string;
}

export default function TeacherAttendanceManage({
  students,
  classes,
}: TeacherAttendanceManageProps) {
  const [selectedClass, setSelectedClass] = useState<string>('Class One');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Full Day');
  const [autoSendSms, setAutoSendSms] = useState<boolean>(true);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Filter students for this class & section
  const classStudents = students.filter(
    (s) => s.className === selectedClass && (selectedSection === 'All' || s.section === selectedSection)
  );

  // Local state for attendance records
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach((s, idx) => {
      // Default most to Present, sample one absent/late
      initial[s.id] = {
        status: idx === 1 ? 'Absent' : idx === 3 ? 'Late' : 'Present',
        remarks: idx === 1 ? 'Viral fever reported by parent' : '',
      };
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'Present', remarks: '' }),
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = {
          ...(next[s.id] || { remarks: '' }),
          status,
        };
      });
      return next;
    });
  };

  // Stats calculation
  const total = classStudents.length;
  const presentCount = classStudents.filter((s) => (attendanceMap[s.id]?.status || 'Present') === 'Present').length;
  const absentCount = classStudents.filter((s) => attendanceMap[s.id]?.status === 'Absent').length;
  const lateCount = classStudents.filter((s) => attendanceMap[s.id]?.status === 'Late').length;
  const leaveCount = classStudents.filter((s) => attendanceMap[s.id]?.status === 'Leave').length;
  const attendanceRate = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';

  const handleSaveAttendance = () => {
    const absentStudents = classStudents
      .filter((s) => attendanceMap[s.id]?.status === 'Absent')
      .map((s) => s.name);

    let message = `Daily Attendance saved for ${selectedClass} (${selectedSection}) on ${attendanceDate}! ${presentCount}/${total} students marked Present (${attendanceRate}% attendance).`;
    if (autoSendSms && absentStudents.length > 0) {
      message += ` SMS notification automatically queued to parents of ${absentStudents.length} absent students.`;
    }
    setSavedSuccessMessage(message);
    setTimeout(() => setSavedSuccessMessage(null), 6000);
  };

  const handlePrintAttendanceSheet = () => {
    window.print();
  };

  return (
    <div id="teacher-attendance-manage" className="space-y-4">
      {/* Configuration & Selection Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Daily Class Attendance Register
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Take official roll call, mark present/absent/late status, record medical leaves, and dispatch instant parent SMS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintAttendanceSheet}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Register Sheet</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Submit Attendance</span>
            </button>
          </div>
        </div>

        {/* Form controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Attendance Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Period / Mode</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none"
            >
              <option value="Full Day">Full Day Morning Assembly</option>
              <option value="Period 1">Period 1 (08:00 - 08:45 AM)</option>
              <option value="Period 2">Period 2 (08:45 - 09:30 AM)</option>
              <option value="Period 3">Period 3 (09:30 - 10:15 AM)</option>
              <option value="Period 4">Period 4 (10:45 - 11:30 AM)</option>
            </select>
          </div>
        </div>

        {/* Quick batch actions & SMS option */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600">Quick Roll Call:</span>
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-bold transition"
            >
              ✓ Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-bold transition"
            >
              ✗ Mark All Absent
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSendSms}
              onChange={(e) => setAutoSendSms(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>Send automated SMS to absent students' parents immediately</span>
          </label>
        </div>
      </div>

      {/* Success notification banner */}
      {savedSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{savedSuccessMessage}</span>
        </div>
      )}

      {/* Attendance KPI Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-500">Enrolled</div>
          <div className="text-xl font-black text-slate-800 mt-0.5">{total}</div>
          <div className="text-[10px] text-slate-400">Total in class</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-emerald-600">Present</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{presentCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{attendanceRate}% presence</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-rose-600">Absent</div>
          <div className="text-xl font-black text-rose-600 mt-0.5">{absentCount}</div>
          <div className="text-[10px] text-rose-500">Unexcused absence</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-amber-600">Late Arrival</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">{lateCount}</div>
          <div className="text-[10px] text-amber-500">Arrived post assembly</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-sky-600">Authorized Leave</div>
          <div className="text-xl font-black text-sky-600 mt-0.5">{leaveCount}</div>
          <div className="text-[10px] text-sky-500">Medical / Casual</div>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {selectedClass} ({selectedSection}) Student Attendance Roll Call
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Date: {attendanceDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">Roll #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Father Name</th>
                <th className="py-2.5 px-3 text-center">Status Action</th>
                <th className="py-2.5 px-3">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((std) => {
                const currentStatus = attendanceMap[std.id]?.status || 'Present';
                const currentRemarks = attendanceMap[std.id]?.remarks || '';

                return (
                  <tr
                    key={std.id}
                    className={`transition ${
                      currentStatus === 'Absent'
                        ? 'bg-rose-50/30'
                        : currentStatus === 'Late'
                        ? 'bg-amber-50/30'
                        : currentStatus === 'Leave'
                        ? 'bg-sky-50/30'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                      #{std.rollNo}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={std.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{std.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {std.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {std.fatherName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Present')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          <span>P</span>
                          <span className="hidden sm:inline text-[10px]">Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Absent')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          <span>A</span>
                          <span className="hidden sm:inline text-[10px]">Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Late')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            currentStatus === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          <span>L</span>
                          <span className="hidden sm:inline text-[10px]">Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Leave')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            currentStatus === 'Leave'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700'
                          }`}
                        >
                          <span>LV</span>
                          <span className="hidden sm:inline text-[10px]">Leave</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. sick leave)..."
                        value={currentRemarks}
                        onChange={(e) => handleRemarksChange(std.id, e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:bg-white focus:border-sky-400 outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
              {classStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No students registered in {selectedClass} ({selectedSection}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Recorded {classStudents.length} student attendance entries for {attendanceDate}
          </div>
          <button
            type="button"
            onClick={handleSaveAttendance}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance Register</span>
          </button>
        </div>
      </div>
    </div>
  );
}

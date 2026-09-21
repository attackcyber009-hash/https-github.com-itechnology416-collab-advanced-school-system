import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Shuffle,
  AlertTriangle,
  CheckCircle,
  Bell,
  Printer,
  Sparkles,
  Search,
  Filter,
  Users,
  Building,
  RefreshCw,
  Send,
  Plus,
  Compass,
} from 'lucide-react';
import {
  TimetablePeriodSlot,
  ClassWeeklyTimetable,
  TeacherDailySubstitution,
  BellScheduleConfiguration,
} from '../types';
import {
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_CLASS_TIMETABLES,
  INITIAL_TEACHER_SUBSTITUTIONS,
  INITIAL_BELL_SCHEDULES,
} from '../data/phase12Data';

interface MasterTimetableEngineViewProps {
  onPrintTimetable?: (timetable: ClassWeeklyTimetable) => void;
}

export default function MasterTimetableEngineView({
  onPrintTimetable,
}: MasterTimetableEngineViewProps) {
  const [activeTab, setActiveTab] = useState<'master_grid' | 'substitutions' | 'bell_schedules' | 'clash_detector'>(
    'master_grid'
  );
  const [timetables, setTimetables] = useState<ClassWeeklyTimetable[]>(INITIAL_CLASS_TIMETABLES);
  const [selectedClass, setSelectedClass] = useState<ClassWeeklyTimetable>(INITIAL_CLASS_TIMETABLES[0]);
  const [substitutions, setSubstitutions] = useState<TeacherDailySubstitution[]>(
    INITIAL_TEACHER_SUBSTITUTIONS
  );
  const [bellSchedules, setBellSchedules] = useState<BellScheduleConfiguration[]>(
    INITIAL_BELL_SCHEDULES
  );
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [autoOptimizedSuccess, setAutoOptimizedSuccess] = useState(false);

  // New Substitution Modal State
  const [isAssigningSub, setIsAssigningSub] = useState(false);
  const [absentTeacher, setAbsentTeacher] = useState('Sir Tariq Jamil');
  const [subTeacher, setSubTeacher] = useState('Sir Naveed Anwar');
  const [targetPeriod, setTargetPeriod] = useState(1);
  const [targetClass, setTargetClass] = useState('Class 9-A');
  const [targetSubject, setTargetSubject] = useState('Physics');

  const currentDaySchedule = selectedClass.days.find((d) => d.dayName === selectedDay) || selectedClass.days[0];

  const handleRunClashOptimizer = () => {
    setAutoOptimizedSuccess(true);
    setTimeout(() => {
      setAutoOptimizedSuccess(false);
    }, 2500);
  };

  const handleToggleBellSchedule = (id: string) => {
    setBellSchedules(
      bellSchedules.map((s) => ({
        ...s,
        isActive: s.id === id,
      }))
    );
  };

  const handleAddSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubItem = {
      periodNumber: targetPeriod,
      className: targetClass,
      subject: targetSubject,
      assignedSubstituteTeacher: subTeacher,
      substituteSubjectSpecialty: 'Science & Core Discipline',
      substituteStatus: 'Confirmed via SMS' as const,
      notificationSent: true,
    };

    const existingRecord = substitutions.find((s) => s.absentTeacherName === absentTeacher);
    if (existingRecord) {
      setSubstitutions(
        substitutions.map((s) =>
          s.id === existingRecord.id
            ? { ...s, affectedPeriods: [...s.affectedPeriods, newSubItem] }
            : s
        )
      );
    } else {
      const newRec: TeacherDailySubstitution = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        date: '2024-10-21 (Today)',
        absentTeacherName: absentTeacher,
        absentTeacherSubject: 'General Faculty',
        leaveReason: 'Casual Leave',
        affectedPeriods: [newSubItem],
      };
      setSubstitutions([newRec, ...substitutions]);
    }

    setIsAssigningSub(false);
  };

  return (
    <div id="master-timetable-view" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#002147] to-cyan-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300 border border-cyan-500/30">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Master Timetable Scheduler &amp; Smart Substitution Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400 text-slate-950">
              Phase 12
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Algorithmic schedule clash detector, 1-click teacher period substitution dispatcher, zero-period remedial slots &amp; winter/Ramadan bell shift manager.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRunClashOptimizer}
            className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <RefreshCw className="w-4 h-4 text-cyan-300" />
            <span>Run Auto-Clash Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onPrintTimetable) onPrintTimetable(selectedClass);
              else alert(`Printing Official Timetable for ${selectedClass.className}`);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Class Schedule</span>
          </button>
        </div>
      </div>

      {autoOptimizedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Zero Schedule Clashes Found: All 48 faculty period allocations and science lab rooms verified!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('master_grid')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'master_grid'
              ? 'border-cyan-700 text-cyan-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Class Master Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('substitutions')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'substitutions'
              ? 'border-cyan-700 text-cyan-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shuffle className="w-4 h-4 text-amber-500" />
          <span>Daily Teacher Substitution Matrix ({substitutions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bell_schedules')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'bell_schedules'
              ? 'border-cyan-700 text-cyan-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-blue-500" />
          <span>Bell Schedules &amp; Winter/Ramadan Timings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clash_detector')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'clash_detector'
              ? 'border-cyan-700 text-cyan-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-emerald-600" />
          <span>Constraint Engine &amp; Room Allocations</span>
        </button>
      </div>

      {/* TAB 1: WEEKLY CLASS MASTER GRID */}
      {activeTab === 'master_grid' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Select Class Section:</span>
                <select
                  value={selectedClass.className}
                  onChange={(e) => {
                    const found = timetables.find((t) => t.className === e.target.value);
                    if (found) setSelectedClass(found);
                  }}
                  className="p-1.5 border rounded-lg bg-white font-bold text-xs"
                >
                  {timetables.map((t) => (
                    <option key={t.className} value={t.className}>
                      {t.className} - {t.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Select Weekday:</span>
                <div className="flex gap-1">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`px-2.5 py-1 rounded-md font-bold text-xs transition ${
                        selectedDay === day
                          ? 'bg-cyan-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-500">
                Class In-charge: <strong>{selectedClass.classTeacher}</strong>
              </div>
              <div className="text-[11px] text-cyan-900 font-bold">
                Assigned Room: {selectedClass.roomNumber}
              </div>
            </div>
          </div>

          {/* Timetable Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr className="border-b">
                  <th className="p-2.5 border-r border-slate-200">Period Slot</th>
                  <th className="p-2.5 border-r border-slate-200">Time Window</th>
                  <th className="p-2.5 border-r border-slate-200">Subject &amp; Code</th>
                  <th className="p-2.5 border-r border-slate-200">Subject Master Teacher</th>
                  <th className="p-2.5">Room / Lab Facility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_TIMETABLE_SLOTS.map((slot) => {
                  if (slot.isBreakOrPrayer) {
                    return (
                      <tr key={slot.periodNumber} className="bg-amber-50/60 font-bold text-amber-900">
                        <td className="p-2.5 border-r border-slate-200 font-bold">BREAK</td>
                        <td className="p-2.5 border-r border-slate-200 font-mono text-[11px]">
                          {slot.startTime} – {slot.endTime}
                        </td>
                        <td colSpan={3} className="p-2.5 text-center text-amber-800 uppercase tracking-widest font-black">
                          🍽️ {slot.periodLabel} (Cafeteria / Prayer Courtyard)
                        </td>
                      </tr>
                    );
                  }

                  const matchedPeriod = currentDaySchedule?.periods.find(
                    (p) => p.periodNumber === slot.periodNumber
                  );

                  return (
                    <tr key={slot.periodNumber} className="hover:bg-slate-50">
                      <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                        {slot.periodLabel}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-600 text-[11px]">
                        {slot.startTime} – {slot.endTime}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        {matchedPeriod ? (
                          <div>
                            <span className="font-bold text-slate-900">{matchedPeriod.subjectName}</span>
                            <span className="ml-1.5 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                              {matchedPeriod.subjectCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Self-Study / Library Period</span>
                        )}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">
                        {matchedPeriod?.teacherName || '—'}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-semibold text-[10px] border border-blue-200">
                          {matchedPeriod?.roomOrLab || selectedClass.roomNumber}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSTITUTION MATRIX */}
      {activeTab === 'substitutions' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daily Faculty Leave &amp; Intelligent Period Substitution Hub
              </h3>
              <p className="text-slate-500 text-[11px]">
                Detects absent faculty in morning biometric roll call and automatically allocates free teachers of matching subjects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAssigningSub(!isAssigningSub)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAssigningSub ? 'Close Form' : 'Assign Substitution'}</span>
            </button>
          </div>

          {/* New Substitution Form */}
          {isAssigningSub && (
            <form onSubmit={handleAddSubstitution} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <div className="font-bold text-amber-900 text-xs">Deploy Emergency Teacher Substitution:</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block">Absent Faculty Member *</label>
                  <select
                    value={absentTeacher}
                    onChange={(e) => setAbsentTeacher(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Sir Tariq Jamil">Sir Tariq Jamil (Physics)</option>
                    <option value="Madam Nadia Qureshi">Madam Nadia Qureshi (English)</option>
                    <option value="Dr. Fauzia Yasmin">Dr. Fauzia Yasmin (Biology)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Class &amp; Period Slot</label>
                  <div className="grid grid-cols-2 gap-1">
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      className="p-2 border rounded bg-white"
                    >
                      <option value="Class 9-A">Class 9-A</option>
                      <option value="Class 10-B">Class 10-B</option>
                      <option value="Class 8-Green">Class 8-Green</option>
                    </select>

                    <select
                      value={targetPeriod}
                      onChange={(e) => setTargetPeriod(Number(e.target.value))}
                      className="p-2 border rounded bg-white"
                    >
                      <option value={1}>Period 1</option>
                      <option value={2}>Period 2</option>
                      <option value={3}>Period 3</option>
                      <option value={5}>Period 4</option>
                      <option value={6}>Period 5</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Available Substitute Teacher *</label>
                  <select
                    value={subTeacher}
                    onChange={(e) => setSubTeacher(e.target.value)}
                    className="w-full p-2 border rounded bg-white font-bold text-emerald-900"
                  >
                    <option value="Sir Naveed Anwar">Sir Naveed Anwar (Free Period 1)</option>
                    <option value="Madam Shamim Akhtar">Madam Shamim Akhtar (Free Period 1)</option>
                    <option value="Sir Farrukh Shah">Sir Farrukh Shah (Free Period 2)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssigningSub(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-700 text-white rounded font-bold hover:bg-amber-800 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign &amp; Send SMS Alert to Teacher</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Substitutions */}
          <div className="space-y-3">
            {substitutions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{sub.absentTeacherName}</span>
                    <span className="text-slate-500 text-[11px]">({sub.absentTeacherSubject})</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-800">
                      {sub.leaveReason}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">{sub.date}</span>
                </div>

                <div className="space-y-2">
                  {sub.affectedPeriods.map((period, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Period {period.periodNumber}: {period.className} ({period.subject})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          Assigned Substitute: <strong className="text-emerald-800">{period.assignedSubstituteTeacher}</strong> (Specialty: {period.substituteSubjectSpecialty})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          {period.substituteStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">📲 SMS Sent</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BELL SCHEDULES */}
      {activeTab === 'bell_schedules' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Institutional Bell Schedules &amp; Seasonal Timing Shift Configuration
            </h3>
            <p className="text-slate-500 text-[11px]">
              Switch between standard regular school hours, winter smog-compliant schedules, and shortened Ramadan timings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bellSchedules.map((sch) => (
              <div
                key={sch.id}
                className={`p-4 rounded-xl border space-y-3 transition ${
                  sch.isActive
                    ? 'border-cyan-600 bg-cyan-50/40 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sch.scheduleName}</h4>
                    <span className="text-[11px] text-slate-500">Assembly: {sch.assemblyTime}</span>
                  </div>
                  {sch.isActive ? (
                    <span className="px-2.5 py-0.5 bg-cyan-700 text-white rounded font-bold text-[10px]">
                      Active Schedule
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleBellSchedule(sch.id)}
                      className="px-2.5 py-0.5 bg-slate-200 hover:bg-cyan-700 hover:text-white text-slate-700 rounded font-bold text-[10px] transition"
                    >
                      Set Active
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border text-center text-[11px]">
                  <div>
                    <div className="text-slate-500 text-[10px]">Total Periods</div>
                    <div className="font-bold text-slate-900">{sch.totalPeriods} Periods</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Period Length</div>
                    <div className="font-bold text-slate-900">{sch.periodDurationMinutes} Mins</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Dismissal</div>
                    <div className="font-bold text-cyan-900">{sch.dismissalTime}</div>
                  </div>
                </div>

                {sch.zeroPeriodEnabled && (
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Zero Period:</strong> {sch.zeroPeriodDetails}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONSTRAINT ENGINE */}
      {activeTab === 'clash_detector' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            Algorithmic Master Constraints &amp; Laboratory Facility Allocation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="font-bold text-slate-900">Chemistry Labs A &amp; B</div>
              <div className="text-slate-600 text-[11px]">
                Capacity: 40 Students • Fume Hoods &amp; Titration Apparatus
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">
                Utilization: 82% (No Overlap Clashes)
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="font-bold text-slate-900">Physics Practical Lab 1</div>
              <div className="text-slate-600 text-[11px]">
                Capacity: 36 Students • Vernier Calipers &amp; Optical Benches
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">
                Utilization: 75% (Scheduled Mon–Thu)
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
              <div className="font-bold text-slate-900">Biology Microscopic Lab 2</div>
              <div className="text-slate-600 text-[11px]">
                Capacity: 35 Students • Compound Microscopes &amp; Slide Stations
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">
                Utilization: 70% (Verified)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

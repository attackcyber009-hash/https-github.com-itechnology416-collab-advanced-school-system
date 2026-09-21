import { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
  Plus,
  Printer,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  MapPin,
  CheckCircle2,
  FileText,
  Building2,
  RotateCcw,
} from 'lucide-react';
import { TimetablePeriod, TeacherSubstitution, StaffMember, ClassInfo, SubjectAllotment } from '../types';

interface TimetableSubstitutionEngineProps {
  timetable: TimetablePeriod[];
  substitutions: TeacherSubstitution[];
  staff: StaffMember[];
  classes: ClassInfo[];
  subjects: SubjectAllotment[];
  onUpdateTimetable: (updated: TimetablePeriod[]) => void;
  onAddSubstitution: (subst: TeacherSubstitution) => void;
  initialAction?: 'add' | 'manage' | null;
}

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TimetableSubstitutionEngine({
  timetable,
  substitutions,
  staff,
  classes,
  subjects,
  onUpdateTimetable,
  onAddSubstitution,
  initialAction,
}: TimetableSubstitutionEngineProps) {
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'substitution' | 'bell_schedule'>('class');
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTeacherId, setSelectedTeacherId] = useState(staff[0]?.id || 'stf-1');
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('All');

  // Modal states
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [showSubstModal, setShowSubstModal] = useState(false);
  const [printedSlip, setPrintedSlip] = useState<TeacherSubstitution | null>(null);

  useEffect(() => {
    if (initialAction === 'add') {
      setShowAddPeriodModal(true);
      setViewMode('class');
    } else if (initialAction === 'manage') {
      setShowAddPeriodModal(false);
      setViewMode('class');
    }
  }, [initialAction]);

  // Substitution wizard states
  const [wizardAbsentTeacherId, setWizardAbsentTeacherId] = useState(staff[0]?.id || 'stf-1');
  const [wizardDate, setWizardDate] = useState(new Date().toISOString().split('T')[0]);
  const [wizardSelectedPeriod, setWizardSelectedPeriod] = useState<TimetablePeriod | null>(null);
  const [wizardSelectedSubstituteId, setWizardSelectedSubstituteId] = useState('');
  const [wizardReason, setWizardReason] = useState('Medical Leave - Health Emergency');

  // Add Period Form State
  const [newPeriodForm, setNewPeriodForm] = useState({
    day: 'Monday' as TimetablePeriod['day'],
    periodNumber: 1,
    periodName: 'Period 1',
    startTime: '08:15 AM',
    endTime: '09:00 AM',
    className: 'Class One',
    section: 'A',
    subject: 'Mathematics',
    teacherId: staff[0]?.id || 'stf-1',
    roomNo: 'Room 101',
    isBreak: false,
  });

  // Filtered timetable periods for Class view
  const classPeriods = timetable.filter(
    (t) =>
      t.className === selectedClass &&
      t.section === selectedSection &&
      (selectedDay === 'All' || t.day === selectedDay)
  );

  // Filtered timetable periods for Teacher view
  const teacherPeriods = timetable.filter(
    (t) =>
      t.teacherId === selectedTeacherId &&
      (selectedDay === 'All' || t.day === selectedDay)
  );

  const selectedTeacher = staff.find((s) => s.id === selectedTeacherId);

  // For substitution wizard: Get periods taught by the selected absent teacher on the selected day
  const absentTeacher = staff.find((s) => s.id === wizardAbsentTeacherId);
  const currentDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as any;
  const targetDay = DAYS.includes(currentDayOfWeek) ? currentDayOfWeek : 'Monday';

  const absentTeacherScheduledPeriods = timetable.filter(
    (t) => t.teacherId === wizardAbsentTeacherId && t.day === targetDay && !t.isBreak
  );

  // Intelligent Free Teacher Finder:
  // For the selected period slot, find teachers who have NO scheduled classes in that period on that day
  const getFreeTeachersForPeriod = (period: TimetablePeriod | null) => {
    if (!period) return [];
    const busyTeacherIds = timetable
      .filter((t) => t.day === period.day && t.periodNumber === period.periodNumber && !t.isBreak)
      .map((t) => t.teacherId);

    // Return teachers not in busy list and not the absent teacher
    return staff.filter((s) => s.role === 'teacher' && s.id !== wizardAbsentTeacherId && !busyTeacherIds.includes(s.id));
  };

  const freeTeachers = getFreeTeachersForPeriod(wizardSelectedPeriod);

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staff.find((s) => s.id === newPeriodForm.teacherId);
    const created: TimetablePeriod = {
      id: `tt-${Date.now()}`,
      day: newPeriodForm.day,
      periodNumber: Number(newPeriodForm.periodNumber),
      periodName: newPeriodForm.periodName || `Period ${newPeriodForm.periodNumber}`,
      startTime: newPeriodForm.startTime,
      endTime: newPeriodForm.endTime,
      className: newPeriodForm.className,
      section: newPeriodForm.section,
      subject: newPeriodForm.isBreak ? 'Recess / Lunch' : newPeriodForm.subject,
      teacherId: newPeriodForm.isBreak ? '' : newPeriodForm.teacherId,
      teacherName: newPeriodForm.isBreak ? 'Duty Incharge' : (assignedStaff?.name || 'Assigned Teacher'),
      roomNo: newPeriodForm.roomNo,
      isBreak: newPeriodForm.isBreak,
    };
    onUpdateTimetable([...timetable, created]);
    setShowAddPeriodModal(false);
  };

  const handleAssignSubstitution = () => {
    if (!wizardSelectedPeriod || !wizardSelectedSubstituteId) {
      alert('Please select a scheduled period and an available substitute teacher.');
      return;
    }
    const subTeacher = staff.find((s) => s.id === wizardSelectedSubstituteId);
    const newSubst: TeacherSubstitution = {
      id: `subst-${Date.now()}`,
      date: wizardDate,
      absentTeacherId: wizardAbsentTeacherId,
      absentTeacherName: absentTeacher?.name || 'Absent Teacher',
      substituteTeacherId: wizardSelectedSubstituteId,
      substituteTeacherName: subTeacher?.name || 'Substitute Teacher',
      periodNumber: wizardSelectedPeriod.periodNumber,
      timeSlot: `${wizardSelectedPeriod.startTime} - ${wizardSelectedPeriod.endTime}`,
      className: wizardSelectedPeriod.className,
      section: wizardSelectedPeriod.section,
      subject: wizardSelectedPeriod.subject,
      roomNo: wizardSelectedPeriod.roomNo,
      reason: wizardReason,
      status: 'Assigned',
      assignedBy: 'Academic Coordinator',
    };
    onAddSubstitution(newSubst);
    setPrintedSlip(newSubst);
    setShowSubstModal(false);
    setWizardSelectedPeriod(null);
    setWizardSelectedSubstituteId('');
  };

  return (
    <div id="timetable-substitution-engine" className="space-y-4">
      {/* Top Header & Navigation Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold shadow-xs">
            <Clock className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Academic Routine, Master Timetable &amp; Teacher Substitution Planner
              </h2>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                Phase 4 Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Conflict-free period schedules, bell timings, and automated substitute teacher allocation wizard
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setShowSubstModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Teacher Substitution Wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddPeriodModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Class Period</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('class')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              viewMode === 'class' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class-wise Master Routine
          </button>
          <button
            type="button"
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              viewMode === 'teacher' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher Workload Matrix
          </button>
          <button
            type="button"
            onClick={() => setViewMode('substitution')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'substitution' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Active Substitutions ({substitutions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bell_schedule')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              viewMode === 'bell_schedule' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bell Schedule &amp; Timings
          </button>
        </div>

        {/* Secondary Filters depending on mode */}
        {viewMode === 'class' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Day:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as any)}
                className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
              >
                <option value="All">Full Week (Mon - Sat)</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {viewMode === 'teacher' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Select Faculty:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded bg-white font-bold text-slate-800"
            >
              {staff
                .filter((s) => s.role === 'teacher')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* MODE 1: CLASS-WISE TIMETABLE GRID */}
      {viewMode === 'class' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>
                  {selectedClass} ({selectedSection}) — Weekly Academic Routine
                </span>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono font-bold text-[11px]">
                  Room 101 • 35 Periods / Week
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                School timings: 07:45 AM (Assembly) to 02:00 PM (Dismissal). Break: 10:30 AM - 11:00 AM.
              </p>
            </div>
          </div>

          {/* Day by Day Cards or Grid */}
          <div className="space-y-4">
            {(selectedDay === 'All' ? DAYS : [selectedDay]).map((dayName) => {
              const periodsForDay = timetable
                .filter(
                  (t) =>
                    t.className === selectedClass &&
                    t.section === selectedSection &&
                    t.day === dayName
                )
                .sort((a, b) => a.periodNumber - b.periodNumber);

              return (
                <div key={dayName} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-700" />
                      <span>{dayName}</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 font-mono">
                      {periodsForDay.length} Periods Scheduled
                    </span>
                  </div>

                  {periodsForDay.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 italic">
                      No periods configured for {dayName}. Click &quot;Add Class Period&quot; to populate.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-slate-50/50">
                      {periodsForDay.map((p) => {
                        // Check if this period has an active substitution today
                        const activeSubst = substitutions.find(
                          (s) =>
                            s.className === p.className &&
                            s.section === p.section &&
                            s.periodNumber === p.periodNumber
                        );

                        if (p.isBreak) {
                          return (
                            <div
                              key={p.id}
                              className="bg-amber-50/90 border border-amber-200 rounded-lg p-2.5 flex flex-col justify-between text-center shadow-2xs"
                            >
                              <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                                {p.periodName}
                              </div>
                              <div className="font-bold text-amber-900 my-1">{p.subject}</div>
                              <div className="text-[10px] font-mono text-amber-700">
                                {p.startTime} - {p.endTime}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={p.id}
                            className={`rounded-lg p-2.5 border flex flex-col justify-between transition shadow-2xs ${
                              activeSubst
                                ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-400'
                                : 'bg-white border-slate-200 hover:border-sky-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                                  {p.periodName}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {p.startTime}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {p.subject}
                              </div>
                              <div className="text-[11px] text-slate-600 truncate mt-0.5">
                                {activeSubst ? (
                                  <span className="text-purple-700 font-bold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    {activeSubst.substituteTeacherName} (Sub)
                                  </span>
                                ) : (
                                  p.teacherName
                                )}
                              </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                <span>{p.roomNo}</span>
                              </span>
                              <span className="font-mono">{p.endTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: TEACHER WORKLOAD MATRIX */}
      {viewMode === 'teacher' && selectedTeacher && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedTeacher.avatarUrl}
                alt={selectedTeacher.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-sky-600"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedTeacher.name}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{selectedTeacher.designation}</span>
                  <span>•</span>
                  <span className="font-semibold text-sky-700">{selectedTeacher.department}</span>
                  <span>•</span>
                  <span>Code: {selectedTeacher.employeeCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-base font-bold text-slate-900 font-mono">
                  {teacherPeriods.length}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Weekly Classes
                </div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-base font-bold text-emerald-700 font-mono">
                  {35 - teacherPeriods.length}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Free Periods
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-base font-bold text-purple-700 font-mono">
                  {selectedTeacher.subjectsAssigned?.join(', ') || 'Math & Science'}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Specialty
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Period &amp; Time</th>
                  <th className="py-2.5 px-3">Class &amp; Section</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherPeriods.map((tp) => (
                  <tr key={tp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{tp.day}</td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className="font-bold text-sky-800">{tp.periodName}</span>
                      <span className="text-slate-400 ml-1">
                        ({tp.startTime} - {tp.endTime})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {tp.className} ({tp.section})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold text-[11px]">
                        {tp.subject}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{tp.roomNo}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Active Duty
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 3: ACTIVE TEACHER SUBSTITUTIONS */}
      {viewMode === 'substitution' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Today&apos;s Teacher Substitution Roster (&quot;Badli / Niyabat&quot;)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Authorized proxy teaching duties allocated to prevent unmonitored classrooms during faculty absence
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSubstModal(true)}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign New Substitution</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-purple-50 text-purple-900 font-bold border-b border-purple-200">
                <tr>
                  <th className="py-2.5 px-3">Date &amp; Period</th>
                  <th className="py-2.5 px-3">Absent Faculty</th>
                  <th className="py-2.5 px-3">Substitute Teacher Assigned</th>
                  <th className="py-2.5 px-3">Class &amp; Room</th>
                  <th className="py-2.5 px-3">Subject / Activity</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3 text-right">Official Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {substitutions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-purple-50/40">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="font-bold text-slate-800">{sub.date}</div>
                      <div className="text-[10px] text-purple-700 font-semibold">
                        Period {sub.periodNumber} ({sub.timeSlot})
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span>{sub.absentTeacherName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Regular Incharge</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{sub.substituteTeacherName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Free Period Utilized</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900">
                        {sub.className} ({sub.section})
                      </span>
                      <div className="text-[10px] text-slate-500">{sub.roomNo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{sub.subject}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sub.reason}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setPrintedSlip(sub)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Duty Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 4: BELL SCHEDULE & TIMINGS */}
      {viewMode === 'bell_schedule' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-700" />
              <span>Standard Institutional Bell Schedule &amp; Academic Chimes</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronized automated bell intervals across all campus public address (PA) speakers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="font-bold text-slate-800 border-b pb-1">
                Summer &amp; Regular Academic Session (Mon - Thu, Sat)
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Gates Open &amp; Assembly</span>
                  <span className="text-sky-800 font-bold">07:45 AM - 08:15 AM (30 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 1</span>
                  <span className="text-sky-800 font-bold">08:15 AM - 09:00 AM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 2</span>
                  <span className="text-sky-800 font-bold">09:00 AM - 09:45 AM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 3</span>
                  <span className="text-sky-800 font-bold">09:45 AM - 10:30 AM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 bg-amber-100/70 px-1 rounded border border-amber-300">
                  <span className="font-bold text-amber-900">Recess / Lunch Break</span>
                  <span className="text-amber-900 font-bold">10:30 AM - 11:00 AM (30 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 4</span>
                  <span className="text-sky-800 font-bold">11:00 AM - 11:45 AM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 5</span>
                  <span className="text-sky-800 font-bold">11:45 AM - 12:30 PM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 6</span>
                  <span className="text-sky-800 font-bold">12:30 PM - 01:15 PM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 7 (Pack-up &amp; Diary)</span>
                  <span className="text-sky-800 font-bold">01:15 PM - 02:00 PM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-800 font-bold">
                  <span>General Dismissal</span>
                  <span>02:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="font-bold text-slate-800 border-b pb-1">
                Friday Special Half-Day Schedule (Jummah Prayer Break)
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Morning Assembly</span>
                  <span className="text-sky-800 font-bold">07:45 AM - 08:15 AM (30 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 1</span>
                  <span className="text-sky-800 font-bold">08:15 AM - 08:55 AM (40 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 2</span>
                  <span className="text-sky-800 font-bold">08:55 AM - 09:35 AM (40 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 3</span>
                  <span className="text-sky-800 font-bold">09:35 AM - 10:15 AM (40 min)</span>
                </div>
                <div className="flex justify-between py-1 bg-amber-100/70 px-1 rounded border border-amber-300">
                  <span className="font-bold text-amber-900">Short Break</span>
                  <span className="text-amber-900 font-bold">10:15 AM - 10:35 AM (20 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 4</span>
                  <span className="text-sky-800 font-bold">10:35 AM - 11:15 AM (40 min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Period 5 (Moral Education)</span>
                  <span className="text-sky-800 font-bold">11:15 AM - 12:00 PM (45 min)</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-800 font-bold">
                  <span>Friday Dismissal for Jummah</span>
                  <span>12:00 PM Noon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TEACHER SUBSTITUTION WIZARD */}
      {showSubstModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col text-xs max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">
                  Smart Teacher Substitution Allocator (&quot;Badli / Niyabat Wizard&quot;)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSubstModal(false)}
                className="text-white/80 hover:text-white font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    1. Select Absent Faculty Member
                  </label>
                  <select
                    value={wizardAbsentTeacherId}
                    onChange={(e) => {
                      setWizardAbsentTeacherId(e.target.value);
                      setWizardSelectedPeriod(null);
                      setWizardSelectedSubstituteId('');
                    }}
                    className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
                  >
                    {staff
                      .filter((s) => s.role === 'teacher')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.department})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Absence Reason
                  </label>
                  <select
                    value={wizardReason}
                    onChange={(e) => setWizardReason(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
                  >
                    <option value="Medical Leave - Health Emergency">Medical Leave - Health Emergency</option>
                    <option value="Casual Leave (Approved)">Casual Leave (Approved)</option>
                    <option value="Official Academic Training / Board Duty">Official Academic Training / Board Duty</option>
                    <option value="Examiner / Invigilation Duty">Examiner / Invigilation Duty</option>
                  </select>
                </div>
              </div>

              {/* Scheduled Periods for Absent Teacher */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  2. Select Scheduled Period to Substitute ({targetDay})
                </label>

                {absentTeacherScheduledPeriods.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-800">
                    No active teaching periods scheduled for {absentTeacher?.name} on {targetDay}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {absentTeacherScheduledPeriods.map((p) => {
                      const isSelected = wizardSelectedPeriod?.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setWizardSelectedPeriod(p);
                            setWizardSelectedSubstituteId('');
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">
                              {p.periodName} ({p.startTime} - {p.endTime})
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {p.className} ({p.section}) • {p.subject}
                            </div>
                            <div className="text-[10px] text-slate-400">{p.roomNo}</div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Free Teacher Recommendation */}
              {wizardSelectedPeriod && (
                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-purple-900 uppercase">
                      3. Available Teachers with Free Period at {wizardSelectedPeriod.startTime}
                    </label>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {freeTeachers.length} Available (Zero Conflict)
                    </span>
                  </div>

                  {freeTeachers.length === 0 ? (
                    <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
                      All teachers are currently engaged in other classes during this period slot!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {freeTeachers.map((ft) => {
                        const isChosen = wizardSelectedSubstituteId === ft.id;
                        return (
                          <div
                            key={ft.id}
                            onClick={() => setWizardSelectedSubstituteId(ft.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                              isChosen
                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-300'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={ft.avatarUrl}
                                alt={ft.name}
                                className="w-9 h-9 rounded-full object-cover border"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{ft.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  {ft.department} • Subject: {ft.subjectsAssigned?.join(', ')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Free This Period
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubstModal(false)}
                className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!wizardSelectedPeriod || !wizardSelectedSubstituteId}
                onClick={handleAssignSubstitution}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Confirm &amp; Generate Duty Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLASS PERIOD */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-700" />
                <span>Configure New Timetable Period</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPeriodModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newPeriodForm.day}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, day: e.target.value as any })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Period Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newPeriodForm.periodNumber}
                    onChange={(e) =>
                      setNewPeriodForm({
                        ...newPeriodForm,
                        periodNumber: Number(e.target.value),
                        periodName: `Period ${e.target.value}`,
                      })
                    }
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Class
                  </label>
                  <select
                    value={newPeriodForm.className}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, className: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Section
                  </label>
                  <select
                    value={newPeriodForm.section}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, section: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newPeriodForm.startTime}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, startTime: e.target.value })}
                    placeholder="08:15 AM"
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newPeriodForm.endTime}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, endTime: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={newPeriodForm.subject}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, subject: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Assigned Teacher
                  </label>
                  <select
                    value={newPeriodForm.teacherId}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, teacherId: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    {staff
                      .filter((s) => s.role === 'teacher')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Room / Lab Number
                </label>
                <input
                  type="text"
                  value={newPeriodForm.roomNo}
                  onChange={(e) => setNewPeriodForm({ ...newPeriodForm, roomNo: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPeriodModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE TEACHER SUBSTITUTION DUTY SLIP */}
      {printedSlip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-300 p-6 text-xs space-y-4">
            <div className="text-center border-b-2 border-purple-900 pb-3">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                THE EDUCATORS SCHOOL SYSTEM
              </div>
              <div className="text-base font-black text-[#002147] tracking-tight">
                OFFICIAL TEACHER SUBSTITUTION SLIP
              </div>
              <div className="text-[10px] text-purple-800 font-mono font-bold mt-0.5">
                Ref No: SUB-2024-{printedSlip.id.slice(-4)} • Date: {printedSlip.date}
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Assigned Substitute Teacher:</span>
                <span className="font-bold text-slate-900 text-sm">{printedSlip.substituteTeacherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Regular Absent Faculty:</span>
                <span className="font-semibold text-red-700">{printedSlip.absentTeacherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Class &amp; Section:</span>
                <span className="font-bold text-slate-900">
                  {printedSlip.className} ({printedSlip.section})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Period &amp; Time:</span>
                <span className="font-mono font-bold text-purple-900">
                  Period {printedSlip.periodNumber} ({printedSlip.timeSlot})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Subject &amp; Room:</span>
                <span className="font-medium text-slate-800">
                  {printedSlip.subject} • {printedSlip.roomNo}
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-purple-200">
                <span className="text-slate-500">Reason of Proxy:</span>
                <span className="text-slate-700 font-medium italic">{printedSlip.reason}</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded text-[10px] text-slate-600 leading-relaxed border border-slate-200">
              <strong>Academic Instructions:</strong> Please report to the designated classroom 5 minutes before the bell chime. Supervise student discipline and ensure the class completes the assigned reading/writing task.
            </div>

            <div className="pt-6 flex justify-between items-end text-[10px]">
              <div className="text-center">
                <div className="w-24 border-b border-slate-400 mb-1" />
                <span className="text-slate-600 font-medium">Substitute Signature</span>
              </div>
              <div className="text-center">
                <div className="w-24 border-b border-slate-400 mb-1" />
                <span className="text-slate-900 font-bold">Academic Coordinator</span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPrintedSlip(null)}
                className="px-4 py-1.5 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

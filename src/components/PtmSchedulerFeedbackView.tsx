import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  Search,
  MessageSquare,
  Sparkles,
  AlertCircle,
  FileCheck,
  TrendingUp,
  HeartHandshake,
  User,
} from 'lucide-react';
import { PtmSessionSchedule, PtmStudentFeedback, Student } from '../types';
import { INITIAL_PTM_SESSIONS, INITIAL_PTM_FEEDBACK } from '../data/phase9Data';

interface PtmSchedulerFeedbackViewProps {
  students: Student[];
  onPrintPtmSlip?: (feedback: PtmStudentFeedback) => void;
}

export default function PtmSchedulerFeedbackView({
  students,
  onPrintPtmSlip,
}: PtmSchedulerFeedbackViewProps) {
  const [activeTab, setActiveTab] = useState<'feedback_roster' | 'sessions' | 'action_plans'>('feedback_roster');
  const [sessions, setSessions] = useState<PtmSessionSchedule[]>(INITIAL_PTM_SESSIONS);
  const [feedbacks, setFeedbacks] = useState<PtmStudentFeedback[]>(INITIAL_PTM_FEEDBACK);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgressFilter, setSelectedProgressFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [ptmNotice, setPtmNotice] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    studentName: 'Hamza Aslam',
    className: 'Class One (A)',
    rollNo: '01',
    parentName: 'Muhammad Aslam',
    parentContact: '0300-1234567',
    teacherName: 'Mrs. Saima Noor',
    bookedTimeSlot: '10:30 AM - 10:45 AM',
    academicProgressRating: 'Excellent' as any,
    behavioralConductRating: 'Exemplary' as any,
    attendanceComment: '95% Attendance (Regular & Punctual)',
    teacherNotes: '',
    parentRequests: '',
    actionPlan: '',
  });

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesProgress =
      selectedProgressFilter === 'All' || f.academicProgressRating === selectedProgressFilter;
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgress && matchesSearch;
  });

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback: PtmStudentFeedback = {
      id: `ptm-f-${Date.now()}`,
      ptmSessionId: 'ptm-01',
      studentId: `std-${Date.now()}`,
      studentName: formState.studentName,
      className: formState.className,
      rollNo: formState.rollNo,
      parentName: formState.parentName,
      parentContact: formState.parentContact,
      teacherName: formState.teacherName,
      bookedTimeSlot: formState.bookedTimeSlot,
      academicProgressRating: formState.academicProgressRating,
      behavioralConductRating: formState.behavioralConductRating,
      attendanceComment: formState.attendanceComment,
      teacherNotes: formState.teacherNotes || 'Student shows consistent effort in core subjects.',
      parentRequests: formState.parentRequests || 'Parent expressed satisfaction with homework diary.',
      actionPlan: formState.actionPlan || 'Continue weekly revision and positive encouragement.',
      status: 'Attended & Signed',
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setShowAddModal(false);
    setPtmNotice(`PTM Assessment Dossier saved for ${newFeedback.studentName}!`);
    setTimeout(() => setPtmNotice(null), 4500);
  };

  return (
    <div id="ptm-scheduler-suite" className="space-y-4">
      {ptmNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>✓ {ptmNotice}</span>
          <button type="button" onClick={() => setPtmNotice(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-400/20 rounded-lg text-emerald-300 border border-emerald-400/30">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Parent-Teacher Meeting (PTM) Portal &amp; 360° Student Feedback
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-900">
              Phase 9
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Slot scheduling, behavioral and academic evaluation rubrics, parent counseling action plans, and official printable PTM evaluation slips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record PTM Evaluation</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total PTM Slots
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">270 Slots</div>
            <div className="text-[10px] text-emerald-700 font-semibold">15 Min Intervals</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Slots Booked
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">177 Booked</div>
            <div className="text-[10px] text-emerald-600 font-medium">65.5% Parent Turnout</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Excellent Conduct
            </div>
            <div className="text-xl font-black text-teal-700 mt-0.5">
              {feedbacks.filter((f) => f.behavioralConductRating === 'Exemplary').length + 18} Exemplary
            </div>
            <div className="text-[10px] text-teal-600 font-medium">Discipline Index</div>
          </div>
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Action Plans Active
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {feedbacks.length} Plans
            </div>
            <div className="text-[10px] text-amber-600 font-medium">Parent Co-Signed</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('feedback_roster')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'feedback_roster'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student PTM Feedback &amp; Evaluation Roster</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'sessions'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Campus PTM Session Calendar &amp; Slot Roster</span>
        </button>
      </div>

      {/* TAB 1: FEEDBACK ROSTER */}
      {activeTab === 'feedback_roster' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Academic Progress:</span>
              <select
                value={selectedProgressFilter}
                onChange={(e) => setSelectedProgressFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Ratings</option>
                <option value="Excellent">Excellent</option>
                <option value="On Track">On Track</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, parent, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeedbacks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:shadow-xs transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.studentName}</h4>
                    <div className="text-slate-500 text-[11px]">
                      {item.className} • Roll No: {item.rollNo} • Parent: <strong>{item.parentName}</strong> ({item.parentContact})
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.academicProgressRating === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.academicProgressRating === 'On Track'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.academicProgressRating}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Slot: {item.bookedTimeSlot}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg text-[11px]">
                  <div>
                    <strong className="text-slate-700">Teacher's Academic Review:</strong>
                    <p className="text-slate-600">{item.teacherNotes}</p>
                  </div>
                  <div>
                    <strong className="text-slate-700">Parent Requests &amp; Feedback:</strong>
                    <p className="text-slate-600">{item.parentRequests}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                    <strong>Agreed Action Plan:</strong> {item.actionPlan}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500">
                    Conduct: <strong>{item.behavioralConductRating}</strong> • {item.attendanceComment}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintPtmSlip) {
                        onPrintPtmSlip(item);
                      } else {
                        window.print();
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PTM Evaluation Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Campus Parent-Teacher Meeting Calendars</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((ses) => (
              <div
                key={ses.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{ses.sessionTitle}</h4>
                    <div className="text-slate-500 text-[11px]">{ses.termName}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {ses.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <strong>Date:</strong> {ses.ptmDate}
                  </div>
                  <div>
                    <strong>Timings:</strong> {ses.startTime} - {ses.endTime}
                  </div>
                  <div>
                    <strong>Venue:</strong> {ses.venue}
                  </div>
                  <div>
                    <strong>Slot Duration:</strong> {ses.slotDurationMinutes} Minutes
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">
                      Booked: <strong>{ses.bookedSlots}</strong> of {ses.totalSlots} Slots
                    </span>
                    <span className="font-bold text-emerald-700">
                      {Math.round((ses.bookedSlots / ses.totalSlots) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(ses.bookedSlots / ses.totalSlots) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD PTM EVALUATION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">Record PTM Evaluation</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={formState.studentName}
                    onChange={(e) => setFormState({ ...formState, studentName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class &amp; Section</label>
                  <input
                    type="text"
                    required
                    value={formState.className}
                    onChange={(e) => setFormState({ ...formState, className: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={formState.parentName}
                    onChange={(e) => setFormState({ ...formState, parentName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher Incharge</label>
                  <input
                    type="text"
                    required
                    value={formState.teacherName}
                    onChange={(e) => setFormState({ ...formState, teacherName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Progress</label>
                  <select
                    value={formState.academicProgressRating}
                    onChange={(e) =>
                      setFormState({ ...formState, academicProgressRating: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="On Track">On Track</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Critical Support">Critical Support</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Behavioral Conduct</label>
                  <select
                    value={formState.behavioralConductRating}
                    onChange={(e) =>
                      setFormState({ ...formState, behavioralConductRating: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Disciplined">Disciplined</option>
                    <option value="Restless / Talkative">Restless / Talkative</option>
                    <option value="Disruptive">Disruptive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher's Observations *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Excellent arithmetic thinking; needs regular spelling practice."
                  value={formState.teacherNotes}
                  onChange={(e) => setFormState({ ...formState, teacherNotes: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Concerns / Inquiries</label>
                <input
                  type="text"
                  placeholder="e.g. Requested additional Urdu homework worksheets."
                  value={formState.parentRequests}
                  onChange={(e) => setFormState({ ...formState, parentRequests: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mutual Agreed Action Plan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15-minute daily reading routine and weekly diary signature."
                  value={formState.actionPlan}
                  onChange={(e) => setFormState({ ...formState, actionPlan: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save PTM Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

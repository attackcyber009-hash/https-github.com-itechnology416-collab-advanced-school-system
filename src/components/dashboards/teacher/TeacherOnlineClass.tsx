import { useState } from 'react';
import {
  Video,
  Users,
  Clock,
  Calendar,
  ExternalLink,
  Plus,
  Play,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  Radio,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Student, ClassInfo } from '../../../types';

interface TeacherOnlineClassProps {
  classes: ClassInfo[];
  students: Student[];
}

interface OnlineSession {
  id: string;
  title: string;
  className: string;
  subject: string;
  platform: 'Jitsi' | 'Zoom' | 'Google Meet';
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  date: string;
  time: string;
  status: 'Live' | 'Scheduled' | 'Completed';
  durationMins: number;
}

export default function TeacherOnlineClass({ classes, students }: TeacherOnlineClassProps) {
  const [activeTab, setActiveTab] = useState<'live_sessions' | 'attendance_reports'>('live_sessions');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeLiveMeetingUrl, setActiveLiveMeetingUrl] = useState<string | null>(null);

  // Scheduled / Active Sessions
  const [sessions, setSessions] = useState<OnlineSession[]>([
    {
      id: 'sess-1',
      title: 'Interactive Mathematics Problem Solving: Fractions & Decimals',
      className: 'Class One',
      subject: 'Mathematics',
      platform: 'Jitsi',
      meetingUrl: 'https://meet.jit.si/TheEducators-Class1-Math-Revision',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 10:45 AM',
      status: 'Live',
      durationMins: 45,
    },
    {
      id: 'sess-2',
      title: 'English Phonetics & Creative Storytelling Lab',
      className: 'Class One',
      subject: 'English',
      platform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      date: new Date().toISOString().split('T')[0],
      time: '11:30 AM - 12:15 PM',
      status: 'Scheduled',
      durationMins: 45,
    },
    {
      id: 'sess-3',
      title: 'General Science Solar System 3D Virtual Tour',
      className: 'Class Two',
      subject: 'General Science',
      platform: 'Zoom',
      meetingUrl: 'https://zoom.us/j/9876543210',
      meetingId: '987 654 3210',
      passcode: 'Edu2024',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      time: '09:00 AM - 09:45 AM',
      status: 'Completed',
      durationMins: 45,
    },
  ]);

  // Form to schedule session
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('Class One');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newPlatform, setNewPlatform] = useState<'Jitsi' | 'Zoom' | 'Google Meet'>('Jitsi');
  const [newTime, setNewTime] = useState('11:00 AM - 11:45 AM');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Online class attendance logs (for Attendance Reports tab)
  const [selectedReportSession, setSelectedReportSession] = useState<string>('sess-1');

  const attendanceLogs = students.slice(0, 10).map((std, idx) => ({
    student: std,
    joinTime: `10:0${(idx * 2) % 6} AM`,
    leaveTime: '10:45 AM',
    duration: idx === 1 ? '18 mins' : idx === 4 ? '32 mins' : '45 mins',
    status: idx === 1 ? 'Dropped Early' : idx === 4 ? 'Joined Late' : 'Full Attendance',
    attendanceRate: idx === 1 ? '40%' : idx === 4 ? '71%' : '100%',
  }));

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter session title.');
      return;
    }

    const autoUrl =
      newPlatform === 'Jitsi'
        ? `https://meet.jit.si/TheEducators-${newClass.replace(/\s+/g, '')}-${newSubject.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`
        : newCustomUrl || (newPlatform === 'Zoom' ? 'https://zoom.us/j/8492049182' : 'https://meet.google.com/new');

    const newSess: OnlineSession = {
      id: `sess-${Date.now()}`,
      title: newTitle,
      className: newClass,
      subject: newSubject,
      platform: newPlatform,
      meetingUrl: autoUrl,
      meetingId: newPlatform === 'Zoom' ? '849 204 9182' : undefined,
      passcode: newPlatform === 'Zoom' ? 'Pass123' : undefined,
      date: new Date().toISOString().split('T')[0],
      time: newTime,
      status: 'Scheduled',
      durationMins: 45,
    };

    setSessions([newSess, ...sessions]);
    setNewTitle('');
    setNewCustomUrl('');
    setCreateSuccess(`Online class "${newTitle}" created successfully on ${newPlatform}!`);
    setTimeout(() => setCreateSuccess(null), 4000);
  };

  return (
    <div id="teacher-online-class-suite" className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Online Classroom (Jitsi, Zoom, Google Meet) &amp; Attendance Reports
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Launch instant video classrooms with zero installs, distribute join invites, and audit automated student attendance duration.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('live_sessions')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'live_sessions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classroom &amp; Live Meetings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance_reports')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'attendance_reports'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Online Attendance Reports
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE SESSIONS & LAUNCHER */}
      {activeTab === 'live_sessions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Create / Schedule Session (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Schedule / Launch Online Class</span>
            </div>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lecture Topic / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4 Fractions Concept &amp; Practice"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="General Science">General Science</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                    <option value="Jitsi">Jitsi Meet (Instant Free)</option>
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Google Meet">Google Meet / Room</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Timing</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM - 10:45 AM"
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                  />
                </div>
              </div>

              {newPlatform !== 'Jitsi' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meeting Join URL ({newPlatform})
                  </label>
                  <input
                    type="url"
                    placeholder={newPlatform === 'Zoom' ? 'https://zoom.us/j/...' : 'https://meet.google.com/...'}
                    value={newCustomUrl}
                    onChange={(e) => setNewCustomUrl(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Create &amp; Notify Students</span>
              </button>
            </form>
          </div>

          {/* Active & Scheduled Sessions List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Embedded Live Video Frame if active */}
            {activeLiveMeetingUrl && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl p-3 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-xs font-bold text-rose-400 uppercase">Live Broadcast Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveLiveMeetingUrl(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                  >
                    Minimize
                  </button>
                </div>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                  <iframe
                    src={activeLiveMeetingUrl}
                    title="Live Virtual Classroom"
                    allow="camera; microphone; fullscreen; display-capture"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-rose-600" />
                  <span>Scheduled &amp; Active Online Sessions ({sessions.length})</span>
                </div>
              </div>

              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sess.status === 'Live'
                              ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-200'
                              : sess.status === 'Scheduled'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          ● {sess.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#002147] text-white">
                          {sess.className}
                        </span>
                        <span className="font-bold text-indigo-700">{sess.subject}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{sess.time}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm">{sess.title}</h4>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-bold text-slate-700">Platform: {sess.platform}</span>
                        {sess.meetingId && <span>• ID: {sess.meetingId}</span>}
                        {sess.passcode && <span>• Pass: {sess.passcode}</span>}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(sess.meetingUrl)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded-md transition flex items-center gap-1"
                        >
                          {copiedLink === sess.meetingUrl ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Invite</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (sess.platform === 'Jitsi') {
                              setActiveLiveMeetingUrl(sess.meetingUrl);
                            } else {
                              window.open(sess.meetingUrl, '_blank');
                            }
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md transition flex items-center gap-1 shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Join Classroom</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE REPORTS */}
      {activeTab === 'attendance_reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Online Classroom Attendance Audit &amp; Duration Reports
              </h4>
              <p className="text-xs text-slate-500">
                Automated logs of student participation duration, connection drop-offs, and presence ratings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedReportSession}
                onChange={(e) => setSelectedReportSession(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-700"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title.slice(0, 35)}... ({s.date})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Attendance Report</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Total Joined</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{attendanceLogs.length} Students</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="text-emerald-700 text-[10px] uppercase font-bold">Full Attendance</div>
              <div className="text-lg font-black text-emerald-700 mt-0.5">
                {attendanceLogs.filter((l) => l.status === 'Full Attendance').length} Students
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <div className="text-amber-700 text-[10px] uppercase font-bold">Late Joiners</div>
              <div className="text-lg font-black text-amber-700 mt-0.5">
                {attendanceLogs.filter((l) => l.status === 'Joined Late').length} Students
              </div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
              <div className="text-rose-700 text-[10px] uppercase font-bold">Dropped Early</div>
              <div className="text-lg font-black text-rose-700 mt-0.5">
                {attendanceLogs.filter((l) => l.status === 'Dropped Early').length} Students
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 font-mono">Join Time</th>
                  <th className="py-2.5 px-3 font-mono">Leave Time</th>
                  <th className="py-2.5 px-3 font-mono">Attended Duration</th>
                  <th className="py-2.5 px-3 text-center">Participation %</th>
                  <th className="py-2.5 px-3 text-center">Connection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceLogs.map((log) => (
                  <tr key={log.student.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">#{log.student.rollNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{log.student.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{log.joinTime}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{log.leaveTime}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{log.duration}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-700">{log.attendanceRate}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'Full Attendance'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Joined Late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

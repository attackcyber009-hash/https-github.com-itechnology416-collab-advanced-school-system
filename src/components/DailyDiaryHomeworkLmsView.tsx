import { useState, useRef } from 'react';
import {
  BookOpen,
  Calendar,
  Send,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Download,
  Search,
  MessageSquare,
  Sparkles,
  Share2,
  Users,
  Camera,
  Mic,
  Hand,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';
import { DailyDiary, StudyMaterial, Student, ClassInfo, HomeworkSubmission } from '../types';

interface DailyDiaryHomeworkLmsViewProps {
  diaryList: DailyDiary[];
  studyMaterials: StudyMaterial[];
  students: Student[];
  classes: ClassInfo[];
  onAddDiary: (entry: DailyDiary) => void;
  onAddMaterial: (material: StudyMaterial) => void;
}

export default function DailyDiaryHomeworkLmsView({
  diaryList,
  studyMaterials,
  students,
  classes,
  onAddDiary,
  onAddMaterial,
}: DailyDiaryHomeworkLmsViewProps) {
  const [activeTab, setActiveTab] = useState<'diary' | 'submissions' | 'virtual_class' | 'materials'>('diary');
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal states
  const [showAddDiaryModal, setShowAddDiaryModal] = useState(false);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [activeSubmissionDiary, setActiveSubmissionDiary] = useState<DailyDiary | null>(null);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState(false);

  // Homework Submissions state: diaryId -> studentId -> { status, marks, remarks }
  const [submissionsState, setSubmissionsState] = useState<Record<string, Record<string, { status: 'Submitted' | 'Pending' | 'Checked' | 'Late'; remarks: string }>>>({
    'dia-1': {
      'std-1': { status: 'Checked', remarks: 'Neat handwriting, full score' },
      'std-2': { status: 'Pending', remarks: 'Was absent' },
      'std-3': { status: 'Submitted', remarks: 'Awaiting grading' },
      'std-4': { status: 'Checked', remarks: 'Good attempt' },
    },
  });

  // Virtual class room state
  const [isClassLive, setIsClassLive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [raisedHands, setRaisedHands] = useState<string[]>(['Muhammad Hamza']);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Prof. Tariq Mahmood', text: 'Welcome to today’s online problem solving session! Please turn to Chapter 4.', time: '10:02 AM' },
    { sender: 'Syeda Fatima', text: 'Sir, is exercise 4.2 question 5 included in homework?', time: '10:04 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Add Diary Form State
  const [newDiaryForm, setNewDiaryForm] = useState({
    subject: 'Mathematics',
    teacherName: 'Prof. Tariq Mahmood',
    homeworkContent: 'Complete exercise 4.2 questions 1 through 8 in neat notebook.',
    submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pageNo: 'Pages 45 - 46',
    estimatedMinutes: 30,
    priority: 'Normal' as DailyDiary['priority'],
    smsBroadcasted: false,
  });

  // Add Material Form State
  const [newMaterialForm, setNewMaterialForm] = useState({
    title: 'Grade 1 Urdu Grammatical Sentence Structure Worksheets',
    subject: 'Urdu',
    teacherName: 'Ms. Hina Batool',
    fileType: 'PDF' as StudyMaterial['fileType'],
    fileSize: '3.1 MB',
    description: 'Comprehensive guided activities for noun, verb, and basic punctuation.',
  });

  // Materials filter
  const [materialSearch, setMaterialSearch] = useState('');

  // Filtered diary entries
  const filteredDiary = diaryList.filter(
    (d) => d.className === selectedClass && (selectedDate ? d.date === selectedDate : true)
  );

  const filteredStudents = students.filter((s) => s.className === selectedClass);

  const handleCreateDiary = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DailyDiary = {
      id: `dia-${Date.now()}`,
      date: selectedDate,
      className: selectedClass,
      section: selectedSection,
      subject: newDiaryForm.subject,
      teacherName: newDiaryForm.teacherName,
      homeworkContent: newDiaryForm.homeworkContent,
      submissionDate: newDiaryForm.submissionDate,
      pageNo: newDiaryForm.pageNo,
      estimatedMinutes: Number(newDiaryForm.estimatedMinutes),
      priority: newDiaryForm.priority,
      smsBroadcasted: newDiaryForm.smsBroadcasted,
    };
    onAddDiary(created);
    setShowAddDiaryModal(false);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: newMaterialForm.title,
      className: selectedClass,
      subject: newMaterialForm.subject,
      teacherName: newMaterialForm.teacherName,
      fileType: newMaterialForm.fileType,
      fileSize: newMaterialForm.fileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      description: newMaterialForm.description,
    };
    onAddMaterial(created);
    setShowUploadMaterialModal(false);
  };

  const handleBroadcastDiary = () => {
    setBroadcastSuccessNotice(true);
    setTimeout(() => {
      setBroadcastSuccessNotice(false);
    }, 4000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: 'Academic Coordinator',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const updateStudentSubmission = (diaryId: string, studentId: string, status: 'Submitted' | 'Pending' | 'Checked' | 'Late') => {
    setSubmissionsState((prev) => {
      const diarySubs = prev[diaryId] || {};
      const current = diarySubs[studentId] || { status: 'Pending', remarks: '' };
      return {
        ...prev,
        [diaryId]: {
          ...diarySubs,
          [studentId]: {
            ...current,
            status,
          },
        },
      };
    });
  };

  return (
    <div id="daily-diary-homework-lms-view" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Daily Homework Diary, Parent Broadcast &amp; Virtual LMS
              </h2>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                Phase 4 Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Subject-wise homework tasks, WhatsApp broadcasts, student submission checks, and live virtual classroom
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={handleBroadcastDiary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Diary to Parents</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddDiaryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Assign Homework</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Diary Slip</span>
          </button>
        </div>
      </div>

      {broadcastSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Daily Homework Diary successfully broadcasted to {filteredStudents.length} parents via WhatsApp and SMS Gateway!
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold">Delivery Rate: 100%</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diary' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Daily Homework Diary ({filteredDiary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('virtual_class')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'virtual_class' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Virtual Classroom (LMS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'materials' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Digital Library &amp; Notes ({studyMaterials.length})</span>
          </button>
        </div>

        {/* Filter Controls */}
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
            <span className="text-slate-500 font-bold">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: DAILY HOMEWORK DIARY CARDS */}
      {activeTab === 'diary' && (
        <div className="space-y-3 text-xs">
          {filteredDiary.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-400">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600">No homework assigned for this date yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click &quot;Assign Homework&quot; to add subject tasks for {selectedClass}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDiary.map((item) => {
                const subCount = Object.keys(submissionsState[item.id] || {}).length;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>{item.subject}</span>
                            <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded font-mono">
                              {item.className}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 mt-0.5">
                            Teacher: {item.teacherName}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                          Due: {item.submissionDate}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <div className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                          {item.homeworkContent}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="font-semibold text-slate-700">
                            Book Reference: {item.pageNo || 'Notebook Work'}
                          </span>
                          <span className="font-mono text-indigo-700 font-bold">
                            ~{item.estimatedMinutes || 30} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Submissions: <strong className="text-slate-800">{subCount} Logged</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveSubmissionDiary(item)}
                        className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold text-[10px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Track Submissions</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VIRTUAL CLASSROOM (LMS) */}
      {activeTab === 'virtual_class' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-700" />
                <span>The Educators Virtual Classroom &amp; Interactive Lecture Hall</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                WebRTC interactive video, digital whiteboard simulation, hand-raise queue, and student participation roster
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 ${
                  isClassLive ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isClassLive ? 'bg-red-600' : 'bg-slate-400'}`} />
                <span>{isClassLive ? 'LIVE BROADCASTING' : 'STANDBY'}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsClassLive(!isClassLive)}
                className={`px-3.5 py-1.5 rounded font-bold transition text-xs cursor-pointer shadow-xs ${
                  isClassLive
                    ? 'bg-red-700 hover:bg-red-800 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isClassLive ? 'End Lecture' : 'Start Live Lecture'}
              </button>
            </div>
          </div>

          {/* Virtual Class Main Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Whiteboard / Video Area (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-slate-900 rounded-xl aspect-video relative overflow-hidden flex flex-col justify-between p-4 text-white shadow-md">
                {/* Top overlay */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full text-[11px]">
                    <span className="font-bold text-amber-300">Grade 1 Mathematics</span>
                    <span>•</span>
                    <span className="text-slate-300">Chapter 4: Geometry &amp; Shapes</span>
                  </div>

                  <span className="bg-red-600/80 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                    REC 00:24:18
                  </span>
                </div>

                {/* Center Content: Interactive Teacher Canvas */}
                <div className="text-center my-auto space-y-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-700/80 border-2 border-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
                    👨‍🏫
                  </div>
                  <div className="font-bold text-sm">Prof. Tariq Mahmood (Senior Faculty)</div>
                  <div className="text-[11px] text-indigo-200">
                    Live whiteboard streaming to 24 connected students
                  </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-xs p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2 rounded-full cursor-pointer transition ${
                        isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`p-2 rounded-full cursor-pointer transition ${
                        isCameraOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24 Connected</span>
                  </div>
                </div>
              </div>

              {/* Hand-Raise Notification Bar */}
              {raisedHands.length > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Hand className="w-4 h-4 text-amber-600 animate-bounce" />
                    <span>Student Hand Raised: {raisedHands.join(', ')} wants to ask a question!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRaisedHands([])}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] cursor-pointer"
                  >
                    Permit Mic
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Chat & Participant Feed (1 col) */}
            <div className="border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between h-80 lg:h-auto overflow-hidden">
              <div className="p-2.5 bg-slate-100 border-b font-bold text-slate-800 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Class Discussion Stream</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
              </div>

              <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-indigo-900">{msg.sender}</span>
                      <span className="text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 leading-snug">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="p-2 border-t bg-white flex gap-1.5">
                <input
                  type="text"
                  placeholder="Type a message or answer..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL LIBRARY & NOTES */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Centralized Curriculum Notes, Past Papers &amp; Video Lectures</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Institutional study materials repository accessible to students and faculty
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="pl-7 pr-3 py-1 border border-slate-300 rounded text-xs outline-none focus:ring-1 focus:ring-sky-500 w-44"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              </div>

              <button
                type="button"
                onClick={() => setShowUploadMaterialModal(true)}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Material</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studyMaterials
              .filter(
                (m) =>
                  m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
                  m.subject.toLowerCase().includes(materialSearch.toLowerCase())
              )
              .map((mat) => (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                          mat.fileType === 'PDF'
                            ? 'bg-red-100 text-red-800'
                            : mat.fileType === 'VIDEO'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {mat.fileType} • {mat.fileSize}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{mat.uploadDate}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{mat.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{mat.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">{mat.teacherName}</span>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading "${mat.title}" (${mat.fileSize})...`)}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-700 flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3 h-3 text-sky-700" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD HOMEWORK DIARY */}
      {showAddDiaryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>Assign Daily Homework Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDiaryModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDiary} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={newDiaryForm.subject}
                    onChange={(e) => setNewDiaryForm({ ...newDiaryForm, subject: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="General Science">General Science</option>
                    <option value="Islamiat">Islamiat</option>
                    <option value="Computer & AI">Computer &amp; AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    value={newDiaryForm.submissionDate}
                    onChange={(e) => setNewDiaryForm({ ...newDiaryForm, submissionDate: e.target.value })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Homework Task &amp; Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDiaryForm.homeworkContent}
                  onChange={(e) => setNewDiaryForm({ ...newDiaryForm, homeworkContent: e.target.value })}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                  placeholder="Describe homework task, exercise numbers, and questions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Textbook / Page Reference
                  </label>
                  <input
                    type="text"
                    value={newDiaryForm.pageNo}
                    onChange={(e) => setNewDiaryForm({ ...newDiaryForm, pageNo: e.target.value })}
                    placeholder="Page 45 - 46, Ex 4.2"
                    className="w-full p-2 border rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Estimated Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={newDiaryForm.estimatedMinutes}
                    onChange={(e) => setNewDiaryForm({ ...newDiaryForm, estimatedMinutes: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDiaryModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Save &amp; Add to Diary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TRACK SUBMISSIONS */}
      {activeSubmissionDiary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col text-xs max-h-[90vh]">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Student Homework Submissions — {activeSubmissionDiary.subject}
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Task: {activeSubmissionDiary.homeworkContent}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubmissionDiary(null)}
                className="text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b">
                  <tr>
                    <th className="py-2 px-3">Roll #</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3 text-center">Submission Status</th>
                    <th className="py-2 px-3 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => {
                    const currentStatus =
                      submissionsState[activeSubmissionDiary.id]?.[std.id]?.status || 'Pending';

                    return (
                      <tr key={std.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-sky-800">{std.rollNo}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{std.name}</td>
                        <td className="py-2 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                            {(['Submitted', 'Checked', 'Late', 'Pending'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => updateStudentSubmission(activeSubmissionDiary.id, std.id, st)}
                                className={`px-2 py-0.5 rounded font-bold text-[10px] transition cursor-pointer ${
                                  currentStatus === st
                                    ? st === 'Checked'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'Submitted'
                                      ? 'bg-sky-600 text-white'
                                      : st === 'Late'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-red-600 text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500 text-[11px]">
                          {submissionsState[activeSubmissionDiary.id]?.[std.id]?.remarks || 'Checked OK'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSubmissionDiary(null)}
                className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold transition cursor-pointer"
              >
                Close Submissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD STUDY MATERIAL */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Upload Study Material / Past Paper</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadMaterialModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Document / Lecture Title
                </label>
                <input
                  type="text"
                  required
                  value={newMaterialForm.title}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={newMaterialForm.subject}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, subject: e.target.value })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="General Science">General Science</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    File Type
                  </label>
                  <select
                    value={newMaterialForm.fileType}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileType: e.target.value as any })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video Lecture</option>
                    <option value="DOCX">Word Document</option>
                    <option value="PPTX">PowerPoint Slides</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Description &amp; Topics Covered
                </label>
                <textarea
                  rows={2}
                  value={newMaterialForm.description}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, description: e.target.value })}
                  className="w-full p-2 border rounded font-medium"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadMaterialModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

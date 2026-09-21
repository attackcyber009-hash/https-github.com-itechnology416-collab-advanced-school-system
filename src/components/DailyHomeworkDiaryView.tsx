import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Send,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Search,
  MessageSquare,
  Sparkles,
  Users,
  Check,
  Smartphone,
  CheckCheck,
  AlertCircle,
  FileText,
  Clock,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { DailyDiary, Student, ClassInfo } from '../types';

interface DailyHomeworkDiaryViewProps {
  diaryList: DailyDiary[];
  students: Student[];
  classes: ClassInfo[];
  onAddDiary: (entry: DailyDiary) => void;
  onUpdateDiary?: (updatedList: DailyDiary[]) => void;
  initialAction?: 'manage' | 'send_sms';
}

interface SMSHistoryRecord {
  id: string;
  timestamp: string;
  className: string;
  subject: string;
  message: string;
  recipientsCount: number;
  status: 'Sent' | 'Delivered' | 'Failed';
  deliveryRate: string;
}

export default function DailyHomeworkDiaryView({
  diaryList,
  students,
  classes,
  onAddDiary,
  onUpdateDiary,
  initialAction = 'manage'
}: DailyHomeworkDiaryViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'manage' | 'send_sms'>(initialAction);

  // Sync action from sidebar
  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Manage locally copies for dynamic state update (add, edit, delete)
  const [localDiaries, setLocalDiaries] = useState<DailyDiary[]>(diaryList);

  useEffect(() => {
    setLocalDiaries(diaryList);
  }, [diaryList]);

  // Navigation Filters
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class One');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Create & Edit Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDiary, setEditingDiary] = useState<DailyDiary | null>(null);

  // Track Submissions Modal State
  const [activeTrackingDiary, setActiveTrackingDiary] = useState<DailyDiary | null>(null);
  const [submissionsState, setSubmissionsState] = useState<Record<string, Record<string, { status: 'Checked' | 'Submitted' | 'Late' | 'Pending'; remarks: string }>>>({
    'dia-1': {
      'std-1': { status: 'Checked', remarks: 'Beautifully written.' },
      'std-2': { status: 'Submitted', remarks: 'Pending verification' }
    }
  });

  // Diary Entry Form state (reused for Create & Edit)
  const [diaryForm, setDiaryForm] = useState({
    subject: 'Mathematics',
    teacherName: 'Prof. Tariq Mahmood',
    homeworkContent: 'Solve exercises of Chapter 4, Questions 1 to 5 in homework copy.',
    submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pageNo: 'Pages 54-55',
    estimatedMinutes: 45,
    priority: 'Normal' as DailyDiary['priority']
  });

  // SMS Broadcast States
  const [selectedSMSDiary, setSelectedSMSDiary] = useState<DailyDiary | null>(null);
  const [smsTemplate, setSmsTemplate] = useState(
    'Dear Parent, homework of {subject} for {class} on {date} is: "{homework_content}". Kindly ensure completion by {due_date}. Regards, THE EDUCATORS.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [activeBroadcastStudent, setActiveBroadcastStudent] = useState<string>('');
  const [showBroadcastNotice, setShowBroadcastNotice] = useState(false);

  // Default initial SMS outbox history log
  const [smsHistory, setSmsHistory] = useState<SMSHistoryRecord[]>([
    {
      id: 'sms-1',
      timestamp: '2026-09-19 14:12',
      className: 'Class One',
      subject: 'Mathematics',
      message: 'Dear Parent, homework of Mathematics for Class One is: Solve exercises of Chapter 4, Questions 1 to 5. Regards, THE EDUCATORS.',
      recipientsCount: 24,
      status: 'Delivered',
      deliveryRate: '100%'
    },
    {
      id: 'sms-2',
      timestamp: '2026-09-18 13:45',
      className: 'Class One',
      subject: 'English',
      message: 'Dear Parent, English diary: Write 5 sentences about My Hobby on the workbook page 12. Regards, THE EDUCATORS.',
      recipientsCount: 24,
      status: 'Delivered',
      deliveryRate: '100%'
    }
  ]);

  // Set selected SMS Diary to first found entry if none selected
  useEffect(() => {
    const classDiaries = localDiaries.filter((d) => d.className === selectedClass && d.date === selectedDate);
    if (classDiaries.length > 0 && !selectedSMSDiary) {
      setSelectedSMSDiary(classDiaries[0]);
    }
  }, [localDiaries, selectedClass, selectedDate, selectedSMSDiary]);

  // Get filtered list for management
  const filteredDiariesForManage = localDiaries.filter(
    (d) => d.className === selectedClass && d.section === selectedSection && d.date === selectedDate
  );

  const filteredStudents = students.filter((s) => s.className === selectedClass);

  // Add Diary
  const handleAddDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DailyDiary = {
      id: `dia-${Date.now()}`,
      date: selectedDate,
      className: selectedClass,
      section: selectedSection,
      subject: diaryForm.subject,
      teacherName: diaryForm.teacherName,
      homeworkContent: diaryForm.homeworkContent,
      submissionDate: diaryForm.submissionDate,
      smsBroadcasted: false,
      pageNo: diaryForm.pageNo,
      estimatedMinutes: Number(diaryForm.estimatedMinutes),
      priority: diaryForm.priority
    };

    onAddDiary(newEntry);
    const updated = [newEntry, ...localDiaries];
    setLocalDiaries(updated);
    if (onUpdateDiary) onUpdateDiary(updated);
    setShowAddModal(false);
    alert('Daily Homework Diary entry added successfully!');
  };

  // Open Edit Modal
  const openEditModal = (diary: DailyDiary) => {
    setEditingDiary(diary);
    setDiaryForm({
      subject: diary.subject,
      teacherName: diary.teacherName,
      homeworkContent: diary.homeworkContent,
      submissionDate: diary.submissionDate,
      pageNo: diary.pageNo || '',
      estimatedMinutes: diary.estimatedMinutes || 30,
      priority: diary.priority || 'Normal'
    });
    setShowAddModal(true);
  };

  // Save Edit
  const handleEditDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiary) return;

    const updated = localDiaries.map((d) => {
      if (d.id === editingDiary.id) {
        return {
          ...d,
          subject: diaryForm.subject,
          teacherName: diaryForm.teacherName,
          homeworkContent: diaryForm.homeworkContent,
          submissionDate: diaryForm.submissionDate,
          pageNo: diaryForm.pageNo,
          estimatedMinutes: Number(diaryForm.estimatedMinutes),
          priority: diaryForm.priority
        };
      }
      return d;
    });

    setLocalDiaries(updated);
    if (onUpdateDiary) onUpdateDiary(updated);
    setShowAddModal(false);
    setEditingDiary(null);
    alert('Daily Homework Diary entry updated successfully!');
  };

  // Delete Diary
  const handleDeleteDiary = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return;
    const updated = localDiaries.filter((d) => d.id !== id);
    setLocalDiaries(updated);
    if (onUpdateDiary) onUpdateDiary(updated);
    if (selectedSMSDiary?.id === id) {
      setSelectedSMSDiary(updated[0] || null);
    }
    alert('Diary entry deleted successfully.');
  };

  // Track Student Submission change
  const handleUpdateSubmissionStatus = (diaryId: string, studentId: string, status: 'Checked' | 'Submitted' | 'Late' | 'Pending') => {
    setSubmissionsState((prev) => {
      const diarySubs = prev[diaryId] || {};
      const current = diarySubs[studentId] || { remarks: '' };
      return {
        ...prev,
        [diaryId]: {
          ...diarySubs,
          [studentId]: {
            ...current,
            status
          }
        }
      };
    });
  };

  const handleUpdateRemarks = (diaryId: string, studentId: string, remarks: string) => {
    setSubmissionsState((prev) => {
      const diarySubs = prev[diaryId] || {};
      const current = diarySubs[studentId] || { status: 'Pending' };
      return {
        ...prev,
        [diaryId]: {
          ...diarySubs,
          [studentId]: {
            ...current,
            remarks
          }
        }
      };
    });
  };

  // Generate dynamic SMS Preview text
  const getSmsPreviewText = () => {
    if (!selectedSMSDiary) return 'No homework diary selected for preview.';
    return smsTemplate
      .replace(/{subject}/g, selectedSMSDiary.subject)
      .replace(/{class}/g, selectedSMSDiary.className)
      .replace(/{date}/g, selectedSMSDiary.date)
      .replace(/{homework_content}/g, selectedSMSDiary.homeworkContent)
      .replace(/{due_date}/g, selectedSMSDiary.submissionDate);
  };

  // Trigger Live SMS Broadcast Simulation
  const handleTriggerBroadcast = () => {
    if (!selectedSMSDiary) {
      alert('Please select a homework diary entry to broadcast first.');
      return;
    }
    if (filteredStudents.length === 0) {
      alert(`There are no students in ${selectedClass} to receive this broadcast.`);
      return;
    }

    setIsBroadcasting(true);
    setBroadcastProgress(0);
    let index = 0;

    const interval = setInterval(() => {
      if (index < filteredStudents.length) {
        setActiveBroadcastStudent(filteredStudents[index].name);
        setBroadcastProgress(Math.round(((index + 1) / filteredStudents.length) * 100));
        index++;
      } else {
        clearInterval(interval);
        setIsBroadcasting(false);
        setShowBroadcastNotice(true);

        // Add to history
        const newHistoryRecord: SMSHistoryRecord = {
          id: `sms-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          className: selectedClass,
          subject: selectedSMSDiary.subject,
          message: getSmsPreviewText(),
          recipientsCount: filteredStudents.length,
          status: 'Delivered',
          deliveryRate: '100%'
        };
        setSmsHistory([newHistoryRecord, ...smsHistory]);

        // Mark as SMS broadcasted in local state list
        setLocalDiaries((prev) =>
          prev.map((d) => (d.id === selectedSMSDiary.id ? { ...d, smsBroadcasted: true } : d))
        );

        setTimeout(() => {
          setShowBroadcastNotice(false);
        }, 5000);
      }
    }, 450); // Fast but realistic stepping speed
  };

  return (
    <div id="homework-diary-management-hub" className="space-y-5">
      {/* Upper Module Info Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-indigo-900/10 text-[#002147] flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Daily Homework Diary Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#002147] text-amber-300 border border-amber-500/20">
                LMS &amp; Broadcast Gateway
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Create, review, and organize homework tasks for classes, track student submission logs, and broadcast diaries to parent mobile channels via SMS.
            </p>
          </div>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingDiary(null);
              setDiaryForm({
                subject: 'Mathematics',
                teacherName: 'Prof. Tariq Mahmood',
                homeworkContent: '',
                submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                pageNo: '',
                estimatedMinutes: 45,
                priority: 'Normal'
              });
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create Diary Entry</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('manage')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'manage'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Add and Manage Diaries</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('send_sms')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'send_sms'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Send Diary via SMS</span>
        </button>
      </div>

      {/* Broadcast Success Notice */}
      {showBroadcastNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>
              Diary Broadcast completed successfully! Sent {filteredStudents.length} SMS messages to the parents of {selectedClass}.
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-950 font-black px-2 py-0.5 rounded border border-emerald-300">
            SMS Success Rate: 100%
          </span>
        </div>
      )}

      {/* Inner Workspaces */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {/* ========================================== */}
          {/* SUBTAB 1: ADD & MANAGE DIARIES              */}
          {/* ========================================== */}
          {activeSubTab === 'manage' && (
            <div className="space-y-4">
              {/* Filter controls row */}
              <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">Target Class:</span>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedSMSDiary(null); // Clear active SMS diary selection to update
                      }}
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
                      className="px-2.5 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">Date:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSMSDiary(null);
                      }}
                      className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Found:{' '}
                    <strong className="text-slate-800 font-black">{filteredDiariesForManage.length} tasks</strong>
                  </span>
                </div>
              </div>

              {/* Diary lists / Grid */}
              {filteredDiariesForManage.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700 text-sm">No Homework Diaries logged on this date</p>
                    <p className="text-xs text-slate-500">
                      There are no daily records for {selectedClass} (Section {selectedSection}) on {selectedDate}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDiary(null);
                      setDiaryForm({
                        subject: 'Mathematics',
                        teacherName: 'Prof. Tariq Mahmood',
                        homeworkContent: '',
                        submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        pageNo: '',
                        estimatedMinutes: 45,
                        priority: 'Normal'
                      });
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-[#002147] text-white rounded font-bold text-xs hover:bg-slate-900 transition cursor-pointer"
                  >
                    Add First Homework Task
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDiariesForManage.map((diary) => (
                    <div
                      key={diary.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden text-xs"
                    >
                      <div>
                        {/* Subject head */}
                        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="font-bold text-sm tracking-wide block">{diary.subject}</span>
                            <span className="text-[10px] text-slate-300 font-medium font-mono">
                              By: {diary.teacherName}
                            </span>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              diary.priority === 'High' ? 'bg-red-500 text-white' : diary.priority === 'Revision' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-200'
                            }`}>
                              {diary.priority || 'Normal'}
                            </span>
                            <div className="text-[9px] text-slate-300 font-mono">Due: {diary.submissionDate}</div>
                          </div>
                        </div>

                        {/* Homework content */}
                        <div className="p-4 space-y-3">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 font-medium leading-relaxed italic">
                            "{diary.homeworkContent}"
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                            <div>
                              <span className="font-bold text-slate-700">Ref: </span>
                              <span>{diary.pageNo || 'Not specified'}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-700">Duration: </span>
                              <span>~{diary.estimatedMinutes || 30} mins</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action controls */}
                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Submission count check */}
                        <button
                          type="button"
                          onClick={() => setActiveTrackingDiary(diary)}
                          className="px-2.5 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                          <span>Submission Log</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(diary)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 border text-slate-700 rounded transition cursor-pointer"
                            title="Edit Diary"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiary(diary.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded transition cursor-pointer"
                            title="Delete Diary"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SUBTAB 2: SEND DIARY VIA SMS               */}
          {/* ========================================== */}
          {activeSubTab === 'send_sms' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-xs">
              {/* Left Configuration Panel (7 Columns) */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                  <div className="border-b pb-2 flex items-center gap-1.5 text-slate-800">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold">SMS Broadcast Dispatcher</h3>
                  </div>

                  {/* Class and Diary Entry selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSMSDiary(null);
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Diary Entry</label>
                      <select
                        value={selectedSMSDiary?.id || ''}
                        onChange={(e) => {
                          const found = localDiaries.find((d) => d.id === e.target.value);
                          setSelectedSMSDiary(found || null);
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        <option value="">-- Choose Assigned Homework Task --</option>
                        {localDiaries
                          .filter((d) => d.className === selectedClass && d.date === selectedDate)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.subject} ({d.priority || 'Normal'}) - {d.homeworkContent.substring(0, 30)}...
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Template customizer */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700">SMS Message Template</label>
                      <span className="text-[10px] text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Unicode SMS
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      value={smsTemplate}
                      onChange={(e) => setSmsTemplate(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-800 leading-relaxed text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Type SMS message format here..."
                    />

                    {/* Short placeholders inserter */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Click to insert placeholder tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { tag: '{subject}', label: 'Subject' },
                          { tag: '{class}', label: 'Class Name' },
                          { tag: '{date}', label: 'Diary Date' },
                          { tag: '{homework_content}', label: 'Homework Task' },
                          { tag: '{due_date}', label: 'Submission Due' }
                        ].map((btn) => (
                          <button
                            key={btn.tag}
                            type="button"
                            onClick={() => setSmsTemplate(smsTemplate + ' ' + btn.tag)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border text-slate-700 rounded font-mono font-bold text-[10px] transition cursor-pointer"
                          >
                            {btn.tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recipients and triggers */}
                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Users className="w-4 h-4 text-indigo-700" />
                        <span>Parents Directory list:</span>
                      </span>
                      <span className="text-[#002147] font-black">
                        {filteredStudents.length} Parents Registered
                      </span>
                    </div>

                    {/* Sending progress status */}
                    {isBroadcasting && (
                      <div className="space-y-2 p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg animate-pulse">
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-700" />
                            <span>Broadcasting to: {activeBroadcastStudent}'s parent...</span>
                          </span>
                          <span className="font-mono">{broadcastProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#002147] h-2 transition-all duration-300"
                            style={{ width: `${broadcastProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Trigger btn */}
                    <button
                      type="button"
                      disabled={isBroadcasting || !selectedSMSDiary}
                      onClick={handleTriggerBroadcast}
                      className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                        !selectedSMSDiary
                          ? 'bg-slate-100 border text-slate-400 cursor-not-allowed'
                          : isBroadcasting
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>
                        {isBroadcasting
                          ? 'Transmitting SMS Signals...'
                          : `Broadcast SMS to ${filteredStudents.length} Parents`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* SMS Outbox Logs List */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="border-b pb-2">
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>SMS Gateway Transmission logs</span>
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-50 font-bold text-slate-700 border-b">
                        <tr>
                          <th className="py-2 px-3">Date / Time</th>
                          <th className="py-2 px-3">Recipient Class</th>
                          <th className="py-2 px-3">Subject</th>
                          <th className="py-2 px-3">Message Content Preview</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {smsHistory.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-mono text-slate-500">{log.timestamp}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{log.className}</td>
                            <td className="py-2 px-3 text-indigo-900 font-semibold">{log.subject}</td>
                            <td className="py-2 px-3 text-slate-600 font-medium max-w-[200px] truncate" title={log.message}>
                              {log.message}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-[9px]">
                                Delivered ({log.recipientsCount})
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Phone Simulation Preview (5 Columns) */}
              <div className="xl:col-span-5">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                  <div className="border-b pb-2 flex items-center gap-1.5 text-slate-800">
                    <Smartphone className="w-4 h-4 text-[#002147]" />
                    <h3 className="font-bold">Real-Time Smartphone Preview</h3>
                  </div>

                  {/* Phone frame simulation container */}
                  <div className="bg-slate-900 rounded-[30px] p-4.5 max-w-[280px] mx-auto border-[6px] border-slate-800 shadow-xl relative">
                    {/* Top Speaker ear piece */}
                    <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-1 bg-slate-700 rounded-full" />
                    </div>

                    {/* Simulated Screen */}
                    <div className="bg-slate-100 rounded-2xl p-3 min-h-[360px] flex flex-col justify-between text-[11px] text-slate-800 font-sans">
                      {/* Carrier header bar */}
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold border-b pb-1.5 mb-2">
                        <span>THE EDUCATORS SMS</span>
                        <span>100% 🔋</span>
                      </div>

                      {/* Chat message bubbles */}
                      <div className="space-y-3 flex-1 flex flex-col justify-end">
                        <div className="text-[9px] text-slate-400 text-center font-semibold uppercase tracking-wider mb-2">
                          Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {/* Standard Message Bubble */}
                        <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none p-3 max-w-[90%] self-end shadow-xs relative leading-relaxed text-[11px]">
                          {getSmsPreviewText()}
                          {/* Triangle indicator */}
                          <div className="absolute top-0 -right-1.5 w-0 h-0 border-t-[8px] border-t-emerald-600 border-r-[8px] border-r-transparent" />
                        </div>

                        <div className="text-[9px] text-slate-400 text-right font-bold pr-1 font-mono">
                          Delivered ✓✓
                        </div>
                      </div>

                      {/* Keyboard simulator bar */}
                      <div className="bg-white rounded-full p-2 mt-4 flex items-center justify-between border text-[9px] text-slate-400">
                        <span>Text Message...</span>
                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>

                    {/* Phone home indicator bar */}
                    <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto mt-3" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: ADD & EDIT HOMEWORK DIARY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#002147]" />
                <span>{editingDiary ? 'Modify Daily Homework Task' : 'Assign Daily Homework Task'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingDiary ? handleEditDiarySubmit : handleAddDiarySubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Academic Subject
                  </label>
                  <select
                    value={diaryForm.subject}
                    onChange={(e) => setDiaryForm({ ...diaryForm, subject: e.target.value })}
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
                    Due Date of Submission
                  </label>
                  <input
                    type="date"
                    value={diaryForm.submissionDate}
                    onChange={(e) => setDiaryForm({ ...diaryForm, submissionDate: e.target.value })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Homework content, pages &amp; notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={diaryForm.homeworkContent}
                  onChange={(e) => setDiaryForm({ ...diaryForm, homeworkContent: e.target.value })}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                  placeholder="Type actual instructions assigned for students..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Book Reference
                  </label>
                  <input
                    type="text"
                    value={diaryForm.pageNo}
                    onChange={(e) => setDiaryForm({ ...diaryForm, pageNo: e.target.value })}
                    placeholder="Page 45, Ex 4.2"
                    className="w-full p-2 border rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Est. Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={diaryForm.estimatedMinutes}
                    onChange={(e) => setDiaryForm({ ...diaryForm, estimatedMinutes: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Task Priority
                  </label>
                  <select
                    value={diaryForm.priority}
                    onChange={(e) => setDiaryForm({ ...diaryForm, priority: e.target.value as any })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Test/Quiz Prep)</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-slate-950 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  {editingDiary ? 'Save Changes' : 'Publish Diary Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAILED SUBMISSION TRACKING LOGS */}
      {activeTrackingDiary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col text-xs max-h-[85vh]">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Diary Submissions Register — {activeTrackingDiary.subject}
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Task: {activeTrackingDiary.homeworkContent}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrackingDiary(null)}
                className="text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Roll #</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3 text-center">Submission Status</th>
                    <th className="py-2 px-3">Teacher Audit Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => {
                    const submission =
                      submissionsState[activeTrackingDiary.id]?.[std.id] || { status: 'Pending', remarks: '' };

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-sky-800">{std.rollNo}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{std.name}</td>
                        <td className="py-2 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded border">
                            {(['Checked', 'Submitted', 'Late', 'Pending'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateSubmissionStatus(activeTrackingDiary.id, std.id, st)}
                                className={`px-2 py-0.5 rounded font-bold text-[9px] transition cursor-pointer ${
                                  submission.status === st
                                    ? st === 'Checked'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'Submitted'
                                      ? 'bg-sky-600 text-white'
                                      : st === 'Late'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-red-600 text-white'
                                    : 'text-slate-600 hover:text-slate-950'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={submission.remarks}
                            onChange={(e) => handleUpdateRemarks(activeTrackingDiary.id, std.id, e.target.value)}
                            placeholder="Type remarks (e.g. Neat handwriting, incomplete)"
                            className="w-full px-2 py-1 border rounded bg-white text-xs text-slate-800 font-medium"
                          />
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
                onClick={() => setActiveTrackingDiary(null)}
                className="px-4 py-1.5 bg-[#002147] hover:bg-slate-900 text-white rounded font-bold transition"
              >
                Save &amp; Close Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

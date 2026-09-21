import { useState } from 'react';
import {
  GraduationCap,
  Video,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  UploadCloud,
  Send,
  Users,
} from 'lucide-react';
import { Student, StudyMaterial } from '../types';

interface TeacherPortalViewProps {
  students: Student[];
  materials: StudyMaterial[];
  onUploadMaterial: (material: Omit<StudyMaterial, 'id'>) => void;
  onNavigateTab: (tab: any) => void;
}

export default function TeacherPortalView({
  students,
  materials,
  onUploadMaterial,
  onNavigateTab,
}: TeacherPortalViewProps) {
  const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split('T')[0]);
  const [diaryClass, setDiaryClass] = useState('Class One');
  const [diaryText, setDiaryText] = useState('Math: Complete Exercises 4.1 Questions 1 to 5. Learn times tables of 8.');
  const [diarySubject, setDiarySubject] = useState('Mathematics');

  // Live class launch state
  const [onlineMeetingLink, setOnlineMeetingLink] = useState('https://meet.google.com/edu-cls1-mat');

  const handlePostDiary = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Daily Homework Diary published for ${diaryClass} (${diarySubject})! Notification pushed to parent mobile portal.`);
  };

  return (
    <div id="teacher-portal-module" className="space-y-4">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-[#1b3b6f] to-indigo-900 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Mrs. Ayesha Siddiqa"
            className="w-16 h-16 rounded-full border-2 border-amber-300 object-cover"
          />
          <div>
            <div className="text-amber-300 font-bold uppercase text-[11px] tracking-wider">
              FACULTY MEMBER • MATHEMATICS DEPARTMENT
            </div>
            <h2 className="text-xl font-black">Mrs. Ayesha Siddiqa, M.Sc.</h2>
            <div className="text-sky-200 text-xs mt-0.5">
              Assigned Classes: Class One (Sec A), Class Two (Sec A) • Total Students: 34
            </div>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab('attendance')}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Daily Attendance</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('examinations')}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Enter Exam Marks</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Daily Homework & Diary Planner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Publish Daily Homework Diary (Digital Student Diary)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Date: {diaryDate}</span>
            </div>

            <form onSubmit={handlePostDiary} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={diaryClass}
                    onChange={(e) => setDiaryClass(e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="Class One">Class One (Sec A)</option>
                    <option value="Class Two">Class Two (Sec A)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={diarySubject}
                    onChange={(e) => setDiarySubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="General Science">General Science</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homework Instructions / Diary Notes</label>
                <textarea
                  rows={3}
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  className="w-full p-2.5 border rounded focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1b3b6f] hover:bg-[#142c52] text-white font-bold rounded flex items-center gap-1.5 shadow transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Diary to Parents</span>
                </button>
              </div>
            </form>
          </div>

          {/* Uploaded Study Materials for My Classes */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>My Uploaded Lesson Notes &amp; Syllabi</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUploadMaterial({
                    title: 'Class 1 Math Term 2 Revision Notes',
                    className: 'Class One',
                    subject: 'Mathematics',
                    fileType: 'PDF',
                    fileSize: '2.4 MB',
                    uploadDate: new Date().toISOString().split('T')[0],
                    teacherName: 'Mrs. Ayesha Siddiqa',
                    description: 'Term 2 revision package',
                  })
                }
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1 text-[11px]"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New PDF</span>
              </button>
            </div>

            <div className="divide-y">
              {materials.map((mat) => (
                <div key={mat.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{mat.title}</div>
                    <div className="text-[10px] text-slate-500">
                      {mat.className} • {mat.subject} • {mat.fileSize} • Uploaded: {mat.uploadDate}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading "${mat.title}"...`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Online Classroom & Schedule */}
        <div className="space-y-4 text-xs">
          {/* Online Virtual Class Launcher */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm border-b pb-2">
              <Video className="w-4 h-4" />
              <span>Live Virtual Classroom (Zoom / Meet)</span>
            </div>

            <p className="text-slate-600">
              Launch instant hybrid / remote live video lecture for enrolled students:
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Live Meeting Room URL</label>
              <input
                type="text"
                value={onlineMeetingLink}
                onChange={(e) => setOnlineMeetingLink(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono text-[11px]"
              />
            </div>

            <button
              type="button"
              onClick={() => alert(`Launching live video classroom at: ${onlineMeetingLink}! Students notified.`)}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Live Class Now</span>
            </button>
          </div>

          {/* Today's Teaching Schedule */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Today's Lecture Schedule</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded border-l-4 border-emerald-500">
                <div className="font-bold text-slate-800">Period 1: 08:00 AM - 08:45 AM</div>
                <div className="text-slate-600">Class One (Sec A) • Mathematics</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border-l-4 border-sky-500">
                <div className="font-bold text-slate-800">Period 3: 09:30 AM - 10:15 AM</div>
                <div className="text-slate-600">Class Two (Sec A) • Mathematics</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border-l-4 border-amber-500">
                <div className="font-bold text-slate-800">Period 5: 11:30 AM - 12:15 PM</div>
                <div className="text-slate-600">Class One (Sec B) • General Science</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  BookOpen,
  UploadCloud,
  FileText,
  Send,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileCode,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import { DailyDiary, StudyMaterial, ClassInfo, Student } from '../../../types';

interface TeacherStudyMaterialsDiariesProps {
  classes: ClassInfo[];
  students?: Student[];
  diaries?: DailyDiary[];
  materials?: StudyMaterial[];
  initialDiaries?: DailyDiary[];
  initialMaterials?: StudyMaterial[];
}

export default function TeacherStudyMaterialsDiaries({
  classes,
  students = [],
  diaries,
  materials,
  initialDiaries = [],
  initialMaterials = [],
}: TeacherStudyMaterialsDiariesProps) {
  const resolvedDiaries = diaries || initialDiaries;
  const resolvedMaterials = materials || initialMaterials;
  const [activeTab, setActiveTab] = useState<'diaries' | 'materials'>('diaries');

  // Homework diary state
  const [diaryList, setDiaryList] = useState<DailyDiary[]>(
    resolvedDiaries.length > 0
      ? resolvedDiaries
      : [
          {
            id: 'd-1',
            date: new Date().toISOString().split('T')[0],
            className: 'Class One',
            section: 'A',
            subject: 'Mathematics',
            teacherName: 'Mrs. Ayesha Siddiqa',
            homeworkContent: 'Complete Exercise 4.2 Questions 1 to 8 in notebook. Memorize times table of 7.',
            submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            smsBroadcasted: true,
            pageNo: 'Pages 45-48',
            estimatedMinutes: 30,
            priority: 'Normal',
          },
          {
            id: 'd-2',
            date: new Date().toISOString().split('T')[0],
            className: 'Class One',
            section: 'A',
            subject: 'English Grammar',
            teacherName: 'Mrs. Ayesha Siddiqa',
            homeworkContent: 'Read Chapter 3 "The Brave Little Kite". Write 10 difficult words with Urdu meanings in English workbook.',
            submissionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            smsBroadcasted: true,
            pageNo: 'Page 22',
            estimatedMinutes: 25,
            priority: 'Revision',
          },
        ]
  );

  // New Diary Form fields
  const [diaryClass, setDiaryClass] = useState('Class One');
  const [diarySection, setDiarySection] = useState('A');
  const [diarySubject, setDiarySubject] = useState('Mathematics');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryPages, setDiaryPages] = useState('');
  const [diaryEstimatedMins, setDiaryEstimatedMins] = useState(30);
  const [submissionDate, setSubmissionDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [broadcastSms, setBroadcastSms] = useState(true);
  const [diarySuccess, setDiarySuccess] = useState<string | null>(null);

  // Study Materials state
  const [materialList, setMaterialList] = useState<StudyMaterial[]>(
    resolvedMaterials.length > 0
      ? resolvedMaterials
      : [
          {
            id: 'mat-1',
            title: 'Class 1 Math Term 2 Revision Notes & Formula Sheet',
            className: 'Class One',
            subject: 'Mathematics',
            teacherName: 'Mrs. Ayesha Siddiqa',
            fileType: 'PDF',
            fileSize: '2.4 MB',
            uploadDate: '2024-09-15',
            description: 'Comprehensive chapter summaries, worked examples, and mental math tricks.',
          },
          {
            id: 'mat-2',
            title: 'English Phonetics & Vocabulary Video Lecture Notes',
            className: 'Class One',
            subject: 'English',
            teacherName: 'Mrs. Ayesha Siddiqa',
            fileType: 'PDF',
            fileSize: '1.8 MB',
            uploadDate: '2024-09-17',
            description: 'Vowels, blends, and sight words vocabulary deck with illustrative diagrams.',
          },
          {
            id: 'mat-3',
            title: 'General Science Term 1 Solved Worksheets & Diagrams',
            className: 'Class Two',
            subject: 'General Science',
            teacherName: 'Mrs. Ayesha Siddiqa',
            fileType: 'DOCX',
            fileSize: '3.1 MB',
            uploadDate: '2024-09-18',
            description: 'Plants, animals, and solar system worksheet exercises with answer keys.',
          },
        ]
  );

  // New Material form fields
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialClass, setMaterialClass] = useState('Class One');
  const [materialSubject, setMaterialSubject] = useState('Mathematics');
  const [materialType, setMaterialType] = useState<'PDF' | 'DOCX' | 'PPTX' | 'VIDEO'>('PDF');
  const [materialDesc, setMaterialDesc] = useState('');
  const [materialSuccess, setMaterialSuccess] = useState<string | null>(null);

  const handleCreateDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryContent.trim()) {
      alert('Please enter homework content.');
      return;
    }

    const newDiary: DailyDiary = {
      id: `d-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      className: diaryClass,
      section: diarySection,
      subject: diarySubject,
      teacherName: 'Faculty Member',
      homeworkContent: diaryContent,
      submissionDate,
      smsBroadcasted: broadcastSms,
      pageNo: diaryPages || 'Chapter End',
      estimatedMinutes: diaryEstimatedMins,
      priority: 'Normal',
    };

    setDiaryList([newDiary, ...diaryList]);
    setDiaryContent('');
    setDiaryPages('');
    setDiarySuccess(`Daily Diary published for ${diaryClass} (${diarySubject})! Notification pushed to parents.`);
    setTimeout(() => setDiarySuccess(null), 4000);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) {
      alert('Please enter material title.');
      return;
    }

    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: materialTitle,
      className: materialClass,
      subject: materialSubject,
      teacherName: 'Faculty Member',
      fileType: materialType,
      fileSize: '2.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      description: materialDesc || 'Curriculum notes and lecture reference guide.',
    };

    setMaterialList([newMat, ...materialList]);
    setMaterialTitle('');
    setMaterialDesc('');
    setMaterialSuccess(`Study material "${materialTitle}" uploaded and shared with students!`);
    setTimeout(() => setMaterialSuccess(null), 4000);
  };

  return (
    <div id="teacher-materials-diaries-suite" className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Study Materials - Lectures &amp; Daily Homework Diaries
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish daily homework diaries, assign exercises, upload PDF lecture handouts, and distribute revision syllabi.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('diaries')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'diaries'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Homework Diaries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'materials'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Materials &amp; Lectures
            </button>
          </div>
        </div>
      </div>

      {/* DIARIES TAB */}
      {activeTab === 'diaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Post Diary Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Broadcast Daily Homework Diary</span>
            </div>

            {diarySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{diarySuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateDiary} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={diaryClass}
                    onChange={(e) => setDiaryClass(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={diarySection}
                    onChange={(e) => setDiarySection(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="All">All Sections</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={diarySubject}
                    onChange={(e) => setDiarySubject(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Grammar">English Grammar</option>
                    <option value="General Science">General Science</option>
                    <option value="Urdu Adab">Urdu Adab</option>
                    <option value="Islamiat">Islamiat</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 font-medium text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Book Pages / Chapter</label>
                  <input
                    type="text"
                    placeholder="e.g. Page 54-56"
                    value={diaryPages}
                    onChange={(e) => setDiaryPages(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Completion (Mins)</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={diaryEstimatedMins}
                    onChange={(e) => setDiaryEstimatedMins(Number(e.target.value) || 30)}
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homework Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Detail the questions, exercises, or reading requirements..."
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:bg-white focus:border-sky-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastSms}
                  onChange={(e) => setBroadcastSms(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <span>Broadcast SMS notification to registered parent mobile numbers</span>
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Homework Diary</span>
              </button>
            </form>
          </div>

          {/* Published Homework Diaries List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Recent Class Homework Diaries ({diaryList.length})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Real-time Parent Sync</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {diaryList.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#002147] text-white">
                        {d.className} ({d.section})
                      </span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {d.subject}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Posted: {d.date}</span>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/70">
                    {d.homeworkContent}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-3">
                      <span>Pages: <strong>{d.pageNo || 'N/A'}</strong></span>
                      <span>Time: <strong>{d.estimatedMinutes || 30} mins</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Due: {d.submissionDate}</span>
                      </span>
                    </div>
                    {d.smsBroadcasted && (
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        ✓ SMS Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDY MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Upload Material Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Upload Lecture Handouts &amp; Syllabi</span>
            </div>

            {materialSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{materialSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document / Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. Class 1 Math Term 2 Revision Notes"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={materialClass}
                    onChange={(e) => setMaterialClass(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
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
                    value={materialSubject}
                    onChange={(e) => setMaterialSubject(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="General Science">General Science</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Islamiat">Islamiat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Type Format</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700 outline-none"
                >
                  <option value="PDF">PDF Lecture Notes</option>
                  <option value="DOCX">Word Document / Worksheet</option>
                  <option value="PPTX">PowerPoint Slides</option>
                  <option value="VIDEO">Video Lecture URL Link</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus / Chapter Description</label>
                <textarea
                  rows={3}
                  placeholder="Key concepts covered, learning goals, or exam focus..."
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload &amp; Distribute Material</span>
              </button>
            </form>
          </div>

          {/* Uploaded Materials Repository (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Uploaded Study Repository ({materialList.length} items)</span>
              </div>
            </div>

            <div className="space-y-3">
              {materialList.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {m.fileType}
                        </span>
                        <span className="font-bold text-slate-800 text-sm leading-tight">{m.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.className} • {m.subject} • {m.fileSize} • Uploaded on {m.uploadDate}
                      </div>
                      <p className="text-slate-600 text-[11px] pt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading "${m.title}" package...`)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

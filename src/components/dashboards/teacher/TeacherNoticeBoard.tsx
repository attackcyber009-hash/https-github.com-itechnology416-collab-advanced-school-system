import { useState } from 'react';
import {
  Bell,
  Pin,
  Calendar,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Tag,
  AlertTriangle,
  Megaphone,
  X,
} from 'lucide-react';
import { NoticeItem, ClassInfo } from '../../../types';

interface TeacherNoticeBoardProps {
  notices: NoticeItem[];
  classes: ClassInfo[];
}

export default function TeacherNoticeBoard({
  notices: initialNotices,
  classes,
}: TeacherNoticeBoardProps) {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Notice form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAudience, setNewAudience] = useState<'All' | 'Staff' | 'Students' | 'Parents'>('Staff');
  const [newPriority, setNewPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [isPinned, setIsPinned] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchCat =
      selectedCategory === 'All' ||
      n.targetAudience === selectedCategory ||
      (selectedCategory === 'Pinned' && n.pinned);
    const term = searchTerm.toLowerCase();
    const matchSearch =
      n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out notice title and content.');
      return;
    }

    const created: NoticeItem = {
      id: `not-${Date.now()}`,
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      targetAudience: newAudience,
      priority: newPriority,
      pinned: isPinned,
      author: 'Faculty Member',
    };

    setNotices([created, ...notices]);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
    setPostSuccess(`Notice "${newTitle}" posted on the school board!`);
    setTimeout(() => setPostSuccess(null), 4000);
  };

  return (
    <div id="teacher-notice-board-suite" className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-600" />
              <span>School Notice Board &amp; Faculty Circulars</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official institutional circulars, academic notices, syllabus datesheets, and staff memos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Class / Faculty Notice</span>
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars, exams, events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            {['All', 'Pinned', 'Staff', 'Students', 'Parents'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#002147] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat === 'Pinned' && '📌 '}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success banner */}
      {postSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{postSuccess}</span>
        </div>
      )}

      {/* Notice Cards Feed */}
      <div className="space-y-3">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition space-y-2.5 ${
              n.pinned
                ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {n.pinned && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>PINNED CIRCULAR</span>
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      n.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : n.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {n.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    Audience: {n.targetAudience}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{n.title}</h4>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                <Calendar className="w-3 h-3" />
                <span>{n.date}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-2">
              {n.content}
            </p>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Published by: <strong>{n.author || 'Principal Office'}</strong></span>
              <span className="text-sky-600 font-medium">Internal Institutional Memo</span>
            </div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
            No notices found matching "{searchTerm}".
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Post School / Class Circular</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Term 2 Examination Timetable Release & Syllabus Guidelines"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="Staff">Faculty / Staff Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="All">All School Members</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content / Instructions</label>
                <textarea
                  rows={4}
                  placeholder="Write detailed announcements, guidelines, dates, room allocations, or academic directives..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pin-notice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="pin-notice" className="font-bold text-slate-700 cursor-pointer">
                  Pin to top of school board
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-[#0b3866] text-white font-bold rounded-lg shadow"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

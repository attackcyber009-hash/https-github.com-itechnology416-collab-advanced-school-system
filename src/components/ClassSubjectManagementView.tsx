import { useState, useEffect } from 'react';
import {
  Layers,
  BookOpen,
  Plus,
  Users,
  Building2,
  GraduationCap,
  Edit2,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  BookMarked,
  Award,
  Clock,
  Printer,
} from 'lucide-react';
import { ClassInfo, SubjectAllotment, StaffMember } from '../types';

interface ClassSubjectManagementViewProps {
  classes: ClassInfo[];
  subjects: SubjectAllotment[];
  staff: StaffMember[];
  initialAction?: 'classes' | 'sections' | null;
  onUpdateClasses: (classes: ClassInfo[]) => void;
  onUpdateSubjects: (subjects: SubjectAllotment[]) => void;
}

export default function ClassSubjectManagementView({
  classes,
  subjects,
  staff,
  initialAction,
  onUpdateClasses,
  onUpdateSubjects,
}: ClassSubjectManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'workload'>('classes');

  useEffect(() => {
    if (initialAction === 'classes') {
      setActiveTab('classes');
    } else if (initialAction === 'sections') {
      setActiveTab('classes');
      if (classes.length > 0) {
        setTargetClassForSection(classes[0]);
        setShowAddSectionModal(true);
      }
    }
  }, [initialAction, classes]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  // Modal States
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [targetClassForSection, setTargetClassForSection] = useState<ClassInfo | null>(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Edit Subject Form State
  const [editingSubject, setEditingSubject] = useState<SubjectAllotment | null>(null);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);

  // Add Class Form
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    numericLevel: 6,
    monthlyTuition: 9000,
    sectionName: 'A',
    roomNo: 'Room 601',
    classTeacher: staff[0]?.name || 'Ms. Ayesha Siddiqa',
  });

  // Add Section Form
  const [newSectionForm, setNewSectionForm] = useState({
    name: 'B',
    roomNo: 'Room 102',
    classTeacher: staff[1]?.name || 'Prof. Tariq Mahmood',
  });

  // Add Subject Form
  const [newSubjectForm, setNewSubjectForm] = useState({
    subjectCode: 'PHY-201',
    name: 'Physics',
    className: 'Class One',
    teacherId: staff[0]?.id || 'stf-1',
    periodsPerWeek: 5,
    textbook: 'National Book Foundation Physics',
    type: 'Core' as SubjectAllotment['type'],
    totalMarks: 100,
  });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.name) return;
    const created: ClassInfo = {
      id: `cls-${Date.now()}`,
      name: newClassForm.name,
      numericLevel: Number(newClassForm.numericLevel),
      monthlyTuition: Number(newClassForm.monthlyTuition),
      sections: [
        {
          name: newClassForm.sectionName,
          strength: 0,
          roomNo: newClassForm.roomNo,
          classTeacher: newClassForm.classTeacher,
        },
      ],
    };
    onUpdateClasses([...classes, created]);
    setShowAddClassModal(false);
    setNewClassForm({
      name: '',
      numericLevel: 6,
      monthlyTuition: 9000,
      sectionName: 'A',
      roomNo: 'Room 601',
      classTeacher: staff[0]?.name || 'Ms. Ayesha Siddiqa',
    });
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClassForSection) return;
    const updated = classes.map((c) => {
      if (c.id === targetClassForSection.id) {
        return {
          ...c,
          sections: [
            ...c.sections,
            {
              name: newSectionForm.name,
              strength: 0,
              roomNo: newSectionForm.roomNo,
              classTeacher: newSectionForm.classTeacher,
            },
          ],
        };
      }
      return c;
    });
    onUpdateClasses(updated);
    setShowAddSectionModal(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staff.find((s) => s.id === newSubjectForm.teacherId);
    const created: SubjectAllotment = {
      id: `sub-${Date.now()}`,
      subjectCode: newSubjectForm.subjectCode,
      name: newSubjectForm.name,
      className: newSubjectForm.className,
      teacherId: newSubjectForm.teacherId,
      teacherName: assignedStaff?.name || 'Assigned Teacher',
      periodsPerWeek: Number(newSubjectForm.periodsPerWeek),
      textbook: newSubjectForm.textbook,
      type: newSubjectForm.type,
      totalMarks: Number(newSubjectForm.totalMarks),
    };
    onUpdateSubjects([...subjects, created]);
    setShowAddSubjectModal(false);
  };

  const handleOpenEditSubject = (subject: SubjectAllotment) => {
    setEditingSubject({ ...subject });
    setShowEditSubjectModal(true);
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    const assignedStaff = staff.find((s) => s.id === editingSubject.teacherId);
    const updatedSubject: SubjectAllotment = {
      ...editingSubject,
      teacherName: assignedStaff?.name || editingSubject.teacherName,
    };
    const updatedSubjects = subjects.map((s) => (s.id === editingSubject.id ? updatedSubject : s));
    onUpdateSubjects(updatedSubjects);
    setShowEditSubjectModal(false);
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the subject "${name}"? This action cannot be undone.`)) {
      const updated = subjects.filter((s) => s.id !== id);
      onUpdateSubjects(updated);
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'All' || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div id="class-subject-management-view" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Academic Classes, Sections &amp; Subject Allotment Hub
              </h2>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                Phase 4 Operations
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Grade levels, section capacities, class mentor assignments, syllabus textbooks, and faculty workload quotas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setShowAddClassModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Class Grade</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddSubjectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Allot New Subject</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'classes' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Classes &amp; Sections ({classes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subjects' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Subjects &amp; Textbooks ({subjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workload')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workload' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Faculty Workload Quota</span>
          </button>
        </div>

        {activeTab === 'subjects' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subject or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1 border border-slate-300 rounded text-xs outline-none focus:ring-1 focus:ring-sky-500 w-44"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-700 text-xs"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: CLASSES & SECTIONS */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const totalStudents = cls.sections.reduce((acc, s) => acc + s.strength, 0);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 to-[#002147] text-white flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold flex items-center gap-2">
                        <span>{cls.name}</span>
                        <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded font-mono">
                          Grade {cls.numericLevel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                        Tuition: Rs. {cls.monthlyTuition.toLocaleString()} / mo
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white/10 rounded-full font-mono font-bold text-xs">
                      {cls.sections.length} Sec
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500 border-b pb-1.5 text-[11px] font-bold uppercase">
                      <span>Section Details</span>
                      <span>Enrolled / Capacity</span>
                    </div>

                    {cls.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                              {sec.name}
                            </span>
                            <span>{sec.roomNo}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Class Mentor: <strong className="text-slate-700">{sec.classTeacher}</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {sec.strength} / 30
                          </span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (sec.strength / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">
                    Total Strength: <strong className="text-slate-900">{totalStudents} Students</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetClassForSection(cls);
                      setShowAddSectionModal(true);
                    }}
                    className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SUBJECTS & TEXTBOOKS */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Subject Code &amp; Title</th>
                  <th className="py-2.5 px-3">Target Grade</th>
                  <th className="py-2.5 px-3">Prescribed Textbook &amp; Publisher</th>
                  <th className="py-2.5 px-3">Assigned Faculty</th>
                  <th className="py-2.5 px-3 text-center">Periods / Wk</th>
                  <th className="py-2.5 px-3 text-center">Total Marks</th>
                  <th className="py-2.5 px-3 text-center">Classification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{sub.name}</div>
                      <span className="font-mono text-[10px] text-sky-800 font-bold">
                        {sub.subjectCode}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 font-bold text-[11px]">
                        {sub.className}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-700">
                      <div className="font-medium flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{sub.textbook}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {sub.teacherName}
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {sub.periodsPerWeek}
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-800">
                      {sub.totalMarks}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          sub.type === 'Core'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.type === 'Elective'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.type}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSubject(sub)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded border border-amber-200 transition flex items-center gap-1 text-[11px] cursor-pointer"
                          title="Update Subject"
                        >
                          <Edit2 className="w-3 h-3 text-amber-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(sub.id, sub.name)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded border border-rose-200 transition flex items-center gap-1 text-[11px] cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY WORKLOAD QUOTA */}
      {activeTab === 'workload' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-700" />
                <span>Teaching Faculty Workload &amp; Period Distribution Matrix</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Institutional target: 28 to 32 periods per week per full-time teacher (Max: 35)
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Workload Audit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {staff
              .filter((s) => s.role === 'teacher')
              .map((t) => {
                const assignedSubs = subjects.filter((sub) => sub.teacherId === t.id);
                const totalPeriods = assignedSubs.reduce((acc, sub) => acc + sub.periodsPerWeek, 0);
                const loadPercent = Math.min(100, Math.round((totalPeriods / 35) * 100));

                return (
                  <div key={t.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatarUrl}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-sky-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500">{t.department}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600 font-semibold">Weekly Load:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {totalPeriods} / 35 Periods ({loadPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            loadPercent > 90 ? 'bg-red-500' : loadPercent > 70 ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                      <span className="text-slate-500 font-semibold">Allotted Courses:</span>
                      <div className="flex flex-wrap gap-1">
                        {assignedSubs.map((s) => (
                          <span
                            key={s.id}
                            className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 text-[10px]"
                          >
                            {s.name} ({s.periodsPerWeek}p)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CLASS GRADE */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-700" />
                <span>Create New Academic Class</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Class Name (e.g. Class Six, O-Levels Part 1)
                </label>
                <input
                  type="text"
                  required
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                  placeholder="Class Six"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Numeric Grade Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={newClassForm.numericLevel}
                    onChange={(e) => setNewClassForm({ ...newClassForm, numericLevel: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Monthly Tuition (PKR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newClassForm.monthlyTuition}
                    onChange={(e) => setNewClassForm({ ...newClassForm, monthlyTuition: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Initial Section Code
                  </label>
                  <input
                    type="text"
                    value={newClassForm.sectionName}
                    onChange={(e) => setNewClassForm({ ...newClassForm, sectionName: e.target.value })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={newClassForm.roomNo}
                    onChange={(e) => setNewClassForm({ ...newClassForm, roomNo: e.target.value })}
                    className="w-full p-2 border rounded font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Class Mentor / Incharge Teacher
                </label>
                <select
                  value={newClassForm.classTeacher}
                  onChange={(e) => setNewClassForm({ ...newClassForm, classTeacher: e.target.value })}
                  className="w-full p-2 border rounded font-semibold bg-white"
                >
                  {staff
                    .filter((s) => s.role === 'teacher')
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.department})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SECTION */}
      {showAddSectionModal && targetClassForSection && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                Add Section to {targetClassForSection.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSection} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Section Name (e.g. B, C, Rose, Lily)
                </label>
                <input
                  type="text"
                  required
                  value={newSectionForm.name}
                  onChange={(e) => setNewSectionForm({ ...newSectionForm, name: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Classroom Number
                </label>
                <input
                  type="text"
                  value={newSectionForm.roomNo}
                  onChange={(e) => setNewSectionForm({ ...newSectionForm, roomNo: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Assigned Class Teacher
                </label>
                <select
                  value={newSectionForm.classTeacher}
                  onChange={(e) => setNewSectionForm({ ...newSectionForm, classTeacher: e.target.value })}
                  className="w-full p-2 border rounded font-semibold bg-white"
                >
                  {staff
                    .filter((s) => s.role === 'teacher')
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ALLOT NEW SUBJECT */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>Allot Subject &amp; Textbook</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubjectForm.subjectCode}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, subjectCode: e.target.value })}
                    className="w-full p-2 border rounded font-mono font-semibold"
                    placeholder="BIO-201"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubjectForm.name}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, name: e.target.value })}
                    className="w-full p-2 border rounded font-semibold"
                    placeholder="Biology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Class
                  </label>
                  <select
                    value={newSubjectForm.className}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, className: e.target.value })}
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
                    Assigned Teacher
                  </label>
                  <select
                    value={newSubjectForm.teacherId}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, teacherId: e.target.value })}
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
                  Prescribed Textbook &amp; Publisher
                </label>
                <input
                  type="text"
                  value={newSubjectForm.textbook}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, textbook: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                  placeholder="Oxford New Syllabus Biology Book 1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Periods/Wk
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubjectForm.periodsPerWeek}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, periodsPerWeek: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={newSubjectForm.totalMarks}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, totalMarks: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Type
                  </label>
                  <select
                    value={newSubjectForm.type}
                    onChange={(e) => setNewSubjectForm({ ...newSubjectForm, type: e.target.value as any })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Allot Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT / UPDATE SUBJECT */}
      {showEditSubjectModal && editingSubject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-600" />
                <span>Update Subject Allotment</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditSubjectModal(false);
                  setEditingSubject(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubject} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSubject.subjectCode}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subjectCode: e.target.value })}
                    className="w-full p-2 border rounded font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    className="w-full p-2 border rounded font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Class
                  </label>
                  <select
                    value={editingSubject.className}
                    onChange={(e) => setEditingSubject({ ...editingSubject, className: e.target.value })}
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
                    Assigned Teacher
                  </label>
                  <select
                    value={editingSubject.teacherId}
                    onChange={(e) => setEditingSubject({ ...editingSubject, teacherId: e.target.value })}
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
                  Prescribed Textbook &amp; Publisher
                </label>
                <input
                  type="text"
                  value={editingSubject.textbook}
                  onChange={(e) => setEditingSubject({ ...editingSubject, textbook: e.target.value })}
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Periods/Wk
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingSubject.periodsPerWeek}
                    onChange={(e) => setEditingSubject({ ...editingSubject, periodsPerWeek: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={editingSubject.totalMarks}
                    onChange={(e) => setEditingSubject({ ...editingSubject, totalMarks: Number(e.target.value) })}
                    className="w-full p-2 border rounded font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Type
                  </label>
                  <select
                    value={editingSubject.type}
                    onChange={(e) => setEditingSubject({ ...editingSubject, type: e.target.value as any })}
                    className="w-full p-2 border rounded font-semibold bg-white"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSubjectModal(false);
                    setEditingSubject(null);
                  }}
                  className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold transition cursor-pointer shadow-xs"
                >
                  Save Subject Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

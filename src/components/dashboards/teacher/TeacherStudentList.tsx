import { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Filter,
  Eye,
  FileText,
  CheckCircle,
  GraduationCap,
  X,
  Printer,
  Download,
} from 'lucide-react';
import { Student, ClassInfo } from '../../../types';

interface TeacherStudentListProps {
  students: Student[];
  classes: ClassInfo[];
  onSelectStudentAction?: (action?: any) => void;
  onNavigateToMarks?: (studentId: string) => void;
  onNavigateToAttendance?: (className: string) => void;
}

export default function TeacherStudentList({
  students,
  classes,
  onNavigateToMarks,
  onNavigateToAttendance,
}: TeacherStudentListProps) {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'All' || s.className === selectedClass;
    const matchSection = selectedSection === 'All' || s.section === selectedSection;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(term) ||
      s.rollNo.toLowerCase().includes(term) ||
      (s.studentCode && s.studentCode.toLowerCase().includes(term)) ||
      s.fatherName.toLowerCase().includes(term) ||
      (s.parentPhone && s.parentPhone.toLowerCase().includes(term));
    return matchClass && matchSection && matchSearch;
  });

  const totalEnrolled = filteredStudents.length;
  const maleCount = filteredStudents.filter((s) => s.gender === 'Male').length;
  const femaleCount = filteredStudents.filter((s) => s.gender === 'Female').length;

  return (
    <div id="teacher-student-list-section" className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Assigned Class Students Directory
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
                {totalEnrolled} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse enrolled students in your assigned sections, verify emergency contacts, and inspect academic profiles.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition ${
                  viewMode === 'table' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md transition ${
                  viewMode === 'cards' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Grid Cards
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll #, father, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              aria-label="Class filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              aria-label="Section filter"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Male: <strong className="text-slate-800">{maleCount}</strong></span>
            <span>•</span>
            <span>Female: <strong className="text-slate-800">{femaleCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class &amp; Sec</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3">Parent Contact</th>
                  <th className="py-2.5 px-3">B-Form / CNIC</th>
                  <th className="py-2.5 px-3">Blood Group</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                      #{std.rollNo}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={std.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{std.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {std.studentCode || 'STD-2024'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {std.className} - {std.section}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {std.fatherName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-slate-600">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{std.parentPhone || '+92 300 1234567'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {std.bFormOrCnic || '35201-XXXXXXX-X'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        {std.bloodGroup || 'B+'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForProfile(std)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onNavigateToMarks && (
                          <button
                            type="button"
                            onClick={() => onNavigateToMarks(std.id)}
                            className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                            title="Enter / View Exam Marks"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-xs text-slate-400">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={std.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={std.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-sky-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{std.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Roll #{std.rollNo} • {std.studentCode}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {std.className} (Sec {std.section})
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                  {std.bloodGroup || 'B+'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Father:</span>
                  <span className="font-semibold text-slate-700">{std.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Phone:</span>
                  <a href={`tel:${std.parentPhone}`} className="font-mono text-sky-600 hover:underline">
                    {std.parentPhone || '+92 300 1234567'}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">B-Form:</span>
                  <span className="font-mono text-slate-600">{std.bFormOrCnic || '35201-1234567-1'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForProfile(std)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition text-center"
                >
                  View Profile
                </button>
                {onNavigateToMarks && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMarks(std.id)}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition text-center"
                  >
                    Enter Marks
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Profile Quick Modal */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-[#002147] to-[#1b3b6f] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={selectedStudentForProfile.name}
                  className="w-12 h-12 rounded-full border-2 border-amber-300 object-cover"
                />
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">
                    {selectedStudentForProfile.name}
                  </h3>
                  <p className="text-xs text-sky-200 font-mono">
                    Roll #{selectedStudentForProfile.rollNo} • Code: {selectedStudentForProfile.studentCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForProfile(null)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Class &amp; Section</span>
                  <div className="font-bold text-slate-800">{selectedStudentForProfile.className} - {selectedStudentForProfile.section}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Gender</span>
                  <div className="font-bold text-slate-800">{selectedStudentForProfile.gender}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</span>
                  <div className="font-bold text-red-600">{selectedStudentForProfile.bloodGroup || 'B+'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                  <div className="font-bold text-emerald-600">Active Enrolled</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Father's Name:</span>
                  <span className="font-bold text-slate-800">{selectedStudentForProfile.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parent Mobile:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedStudentForProfile.parentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Phone:</span>
                  <span className="font-mono text-slate-700">{selectedStudentForProfile.emergencyContact || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">B-Form / CNIC:</span>
                  <span className="font-mono text-slate-700">{selectedStudentForProfile.bFormOrCnic || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Residential Address:</span>
                  <span className="text-slate-700 text-right max-w-[200px] truncate">{selectedStudentForProfile.address || 'Lahore'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Calling parent at: ${selectedStudentForProfile.parentPhone}`);
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Parent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForProfile(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

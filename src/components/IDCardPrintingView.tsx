import { useState, useEffect } from 'react';
import {
  CreditCard,
  Printer,
  Settings,
  UserCheck,
  Briefcase,
  Filter,
  CheckSquare,
  Square,
  Search,
  Eye,
  Sliders,
  ShieldCheck,
  QrCode,
  Image as ImageIcon,
  RotateCw,
} from 'lucide-react';
import { Student, StaffMember } from '../types';

interface IDCardPrintingViewProps {
  students: Student[];
  staff: StaffMember[];
  initialAction?: 'student' | 'staff' | 'settings' | null;
  onPrintSingleCard?: (data: any, type: 'id_card' | 'staff_id') => void;
}

export default function IDCardPrintingView({
  students,
  staff,
  initialAction = 'student',
  onPrintSingleCard,
}: IDCardPrintingViewProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'staff' | 'settings'>('student');

  useEffect(() => {
    if (initialAction) {
      setActiveTab(initialAction);
    }
  }, [initialAction]);

  // Student Card State
  const [selectedClass, setSelectedClass] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(students.map((s) => s.id));
  const [showStudentBack, setShowStudentBack] = useState(false);

  // Staff Card State
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(staff.map((s) => s.id));
  const [showStaffBack, setShowStaffBack] = useState(false);

  // Settings State
  const [cardSettings, setCardSettings] = useState({
    institutionName: 'AL-HUDA ISLAMIC PUBLIC HIGH SCHOOL',
    campusBranch: 'MAIN EXECUTIVE CAMPUS, LAHORE',
    themeColor: 'bg-[#002147]',
    accentColor: 'text-amber-400',
    emergencyPhone: '+92 42 35881122 / 0300-1234567',
    showQrCode: true,
    showBarcode: true,
    showPrincipalSignature: true,
    cardLayout: 'CR80 Standard PVC (85.6mm x 54mm)',
    expiryDate: '31 March 2027',
  });

  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'All' || s.className === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.includes(studentSearch);
    return matchClass && matchSearch;
  });

  const filteredStaff = staff.filter((stf) => {
    const matchDept = selectedDepartment === 'All' || stf.department.includes(selectedDepartment);
    const matchSearch =
      stf.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      stf.employeeCode.toLowerCase().includes(staffSearch.toLowerCase()) ||
      stf.designation.toLowerCase().includes(staffSearch.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleToggleSelectAllStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectAllStaff = () => {
    if (selectedStaffIds.length === filteredStaff.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff.map((stf) => stf.id));
    }
  };

  const printableStudents = students.filter((s) => selectedStudentIds.includes(s.id));
  const printableStaff = staff.filter((stf) => selectedStaffIds.includes(stf.id));

  return (
    <div id="id-card-printing-module" className="space-y-4 text-xs">
      {/* Module Header & Tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-cyan-100 rounded-lg text-cyan-900 font-bold">
            <CreditCard className="w-5 h-5 text-cyan-700" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800">
              Identity Card Printing Studio &amp; PVC Tag Engine
            </h2>
            <p className="text-[11px] text-slate-500">
              Batch generation of student PVC tags, staff identity credentials, and card layout customizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold no-print">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Print Student Cards</span>
            <span className="px-1.5 py-0.2 bg-cyan-500 text-white rounded-full text-[10px] font-bold">
              {printableStudents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Print Staff Cards</span>
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
              {printableStaff.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ID Card Settings</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PRINT STUDENT CARDS */}
      {activeTab === 'student' && (
        <div className="space-y-4">
          {/* Controls Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-700">Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-0.5 font-semibold text-xs outline-none"
                >
                  <option value="All">All Classes ({students.length})</option>
                  <option value="Class Prep">Class Prep</option>
                  <option value="Class One">Class One</option>
                  <option value="Class Two">Class Two</option>
                  <option value="Class Three">Class Three</option>
                  <option value="Class Four">Class Four</option>
                  <option value="Class Five">Class Five</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search student code, name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-2.5 py-1 border border-slate-300 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="button"
                onClick={handleToggleSelectAllStudents}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold transition"
              >
                {selectedStudentIds.length === filteredStudents.length ? (
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-600" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Select All ({filteredStudents.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStudentBack(!showStudentBack)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded flex items-center gap-1 transition"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-700" />
                <span>{showStudentBack ? 'Show Front Side' : 'Show Reverse Side'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All Selected ({printableStudents.length})</span>
              </button>
            </div>
          </div>

          {/* Cards Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {printableStudents.map((std) => (
              <div
                key={std.id}
                className="bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden relative group transition hover:border-cyan-600"
              >
                {/* Individual Select Checkbox */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudentIds.includes(std.id)) {
                      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== std.id));
                    } else {
                      setSelectedStudentIds([...selectedStudentIds, std.id]);
                    }
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/90 p-1 rounded shadow text-cyan-700 hover:scale-110 transition no-print"
                >
                  {selectedStudentIds.includes(std.id) ? (
                    <CheckSquare className="w-4 h-4 text-cyan-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {!showStudentBack ? (
                  /* FRONT SIDE */
                  <div className="flex flex-col h-full text-center">
                    {/* Header Strip */}
                    <div className="bg-[#002147] text-white p-2.5 space-y-0.5 border-b-2 border-amber-400">
                      <div className="font-extrabold text-[10px] uppercase tracking-wider text-amber-300">
                        {cardSettings.institutionName}
                      </div>
                      <div className="text-[9px] text-cyan-200 tracking-tight">
                        STUDENT IDENTITY CARD
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col items-center justify-between">
                      <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden shadow-xs bg-slate-100 flex items-center justify-center my-1">
                        <img
                          src={std.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                          alt={std.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-black text-sm text-slate-900 leading-tight">{std.name}</h4>
                        <div className="text-[11px] font-bold text-cyan-900">
                          Class: {std.className} ({std.section})
                        </div>
                      </div>

                      <div className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] space-y-0.5 text-left font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Student Code:</span>
                          <span className="font-bold text-slate-900">{std.studentCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Roll Number:</span>
                          <span className="font-bold text-slate-900">{std.rollNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Father Name:</span>
                          <span className="font-bold text-slate-900 truncate max-w-[110px]">{std.fatherName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Blood Group:</span>
                          <span className="font-bold text-rose-600">{std.bloodGroup || 'O+'}</span>
                        </div>
                      </div>

                      {/* Barcode & Signature */}
                      <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                        <span className="tracking-widest">||| |||| |||||</span>
                        <span className="font-sans italic font-semibold text-slate-600">Principal Sign</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* REVERSE SIDE */
                  <div className="p-4 bg-slate-900 text-white flex flex-col justify-between h-full space-y-3">
                    <div className="border-b border-slate-700 pb-2">
                      <div className="text-[10px] font-bold text-amber-400 uppercase">Emergency Contact Info</div>
                      <p className="text-[10px] text-slate-300 mt-1">{std.address || '54-C, Model Town, Lahore'}</p>
                    </div>

                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Parent Phone:</span>
                        <span className="text-emerald-400 font-bold">{std.parentPhone}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Helpline:</span>
                        <span className="text-amber-300 font-bold">{cardSettings.emergencyPhone}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Valid Thru:</span>
                        <span className="text-cyan-300 font-bold">{cardSettings.expiryDate}</span>
                      </div>
                    </div>

                    <div className="bg-white/10 p-2 rounded text-[9px] text-slate-300 text-center leading-tight">
                      If found, please return to AL-HUDA Islamic School Campus Office.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRINT STAFF CARDS */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {/* Controls Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-700">Department:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-0.5 font-semibold text-xs outline-none"
                >
                  <option value="All">All Departments ({staff.length})</option>
                  <option value="Academic">Academic Faculty</option>
                  <option value="Administration">Administration</option>
                  <option value="Accounts">Accounts &amp; Finance</option>
                  <option value="IT">IT &amp; Systems</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search staff code, designation..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="pl-8 pr-2.5 py-1 border border-slate-300 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={handleToggleSelectAllStaff}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold transition"
              >
                {selectedStaffIds.length === filteredStaff.length ? (
                  <CheckSquare className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Select All ({filteredStaff.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStaffBack(!showStaffBack)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded flex items-center gap-1 transition"
              >
                <RotateCw className="w-3.5 h-3.5 text-rose-700" />
                <span>{showStaffBack ? 'Show Front Side' : 'Show Reverse Side'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All Staff Cards ({printableStaff.length})</span>
              </button>
            </div>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {printableStaff.map((stf) => (
              <div
                key={stf.id}
                className="bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden relative group transition hover:border-rose-600"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStaffIds.includes(stf.id)) {
                      setSelectedStaffIds(selectedStaffIds.filter((id) => id !== stf.id));
                    } else {
                      setSelectedStaffIds([...selectedStaffIds, stf.id]);
                    }
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/90 p-1 rounded shadow text-rose-700 hover:scale-110 transition no-print"
                >
                  {selectedStaffIds.includes(stf.id) ? (
                    <CheckSquare className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {!showStaffBack ? (
                  /* FRONT STAFF CARD */
                  <div className="flex flex-col h-full text-center">
                    <div className="bg-rose-950 text-white p-2.5 space-y-0.5 border-b-2 border-amber-400">
                      <div className="font-extrabold text-[10px] uppercase tracking-wider text-amber-300">
                        {cardSettings.institutionName}
                      </div>
                      <div className="text-[9px] text-rose-200 tracking-tight font-bold">
                        FACULTY &amp; STAFF IDENTITY PASSPORT
                      </div>
                    </div>

                    <div className="p-3 space-y-2 flex-1 flex flex-col items-center justify-between">
                      <div className="w-20 h-20 rounded-full border-2 border-rose-600 overflow-hidden shadow-xs bg-slate-100 flex items-center justify-center my-1">
                        <img
                          src={stf.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={stf.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-black text-sm text-slate-900 leading-tight">{stf.name}</h4>
                        <div className="text-[11px] font-bold text-rose-800">
                          {stf.designation}
                        </div>
                      </div>

                      <div className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] space-y-0.5 text-left font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Employee Code:</span>
                          <span className="font-bold text-slate-900">{stf.employeeCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Department:</span>
                          <span className="font-bold text-slate-900">{stf.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contact:</span>
                          <span className="font-bold text-slate-900">{stf.phone}</span>
                        </div>
                      </div>

                      <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                        <span className="tracking-widest">||| |||| |||||</span>
                        <span className="font-sans italic font-semibold text-slate-600">Registrar Sign</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* REVERSE STAFF CARD */
                  <div className="p-4 bg-slate-900 text-white flex flex-col justify-between h-full space-y-3">
                    <div className="border-b border-slate-700 pb-2">
                      <div className="text-[10px] font-bold text-amber-400 uppercase">Authorized Official</div>
                      <p className="text-[10px] text-slate-300 mt-1">CNIC: 35202-8822191-3</p>
                    </div>

                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Emergency Helpline:</span>
                        <span className="text-emerald-400 font-bold">{cardSettings.emergencyPhone}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Security Access:</span>
                        <span className="text-amber-300 font-bold">ALL GATES AUTHORIZED</span>
                      </div>
                    </div>

                    <div className="bg-white/10 p-2 rounded text-[9px] text-slate-300 text-center leading-tight">
                      Property of Al-Huda Islamic High School. Return upon termination.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ID CARD SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-700" />
                <span>Identity Card Layout &amp; PVC Print Customizer</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure campus titles, header branding, barcode formats, and security signatures
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('ID Card Template Settings saved successfully!')}
              className="px-4 py-1.5 bg-[#002147] hover:bg-sky-950 text-white font-bold rounded shadow-2xs cursor-pointer"
            >
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Form Settings */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Institution Header Title</label>
                <input
                  type="text"
                  value={cardSettings.institutionName}
                  onChange={(e) => setCardSettings({ ...cardSettings, institutionName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-semibold outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campus Subtitle / Branch</label>
                <input
                  type="text"
                  value={cardSettings.campusBranch}
                  onChange={(e) => setCardSettings({ ...cardSettings, campusBranch: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Helpline Phone</label>
                <input
                  type="text"
                  value={cardSettings.emergencyPhone}
                  onChange={(e) => setCardSettings({ ...cardSettings, emergencyPhone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Expiry Date</label>
                <input
                  type="text"
                  value={cardSettings.expiryDate}
                  onChange={(e) => setCardSettings({ ...cardSettings, expiryDate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Layout Toggles */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 border-b pb-1 text-xs">Security Features &amp; Layout Grid</h4>

              <div className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Print Barcode on Front</span>
                <input
                  type="checkbox"
                  checked={cardSettings.showBarcode}
                  onChange={(e) => setCardSettings({ ...cardSettings, showBarcode: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Print Principal / Registrar Signature</span>
                <input
                  type="checkbox"
                  checked={cardSettings.showPrincipalSignature}
                  onChange={(e) => setCardSettings({ ...cardSettings, showPrincipalSignature: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Paper &amp; PVC Print Layout Grid</label>
                <select
                  value={cardSettings.cardLayout}
                  onChange={(e) => setCardSettings({ ...cardSettings, cardLayout: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-semibold outline-none"
                >
                  <option value="CR80 Standard PVC (85.6mm x 54mm)">CR80 Standard PVC Card (85.6mm x 54mm)</option>
                  <option value="A4 Heavy Sheet Grid (8 Cards per Page)">A4 Sheet Grid (8 Cards per Page)</option>
                  <option value="Laminated Paper Tag (Dual Sided)">Laminated Paper Tag (Dual Sided)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

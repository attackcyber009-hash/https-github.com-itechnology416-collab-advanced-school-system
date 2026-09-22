import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CreditCard,
  Cake,
  ArrowRightLeft,
  Award,
  Phone,
  Mail,
  Eye,
  CheckCircle2,
  Printer,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  UserCheck,
  Building2,
  HeartPulse,
  Edit,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { Student, FeeVoucher, ClassInfo } from '../types';
import { exportToCsv } from '../utils/fileUtils';
import StudentProfileDossierModal from './StudentProfileDossierModal';
import CertificateGeneratorModal from './CertificateGeneratorModal';
import StudentPromotionModal from './StudentPromotionModal';
import BatchIdCardPrintModal from './BatchIdCardPrintModal';

interface StudentManagementViewProps {
  students: Student[];
  vouchers?: FeeVoucher[];
  classes?: ClassInfo[];
  initialAction?: 'info' | 'promotion' | 'birthday' | 'transfer' | null;
  onUpdateStudents?: (updatedStudents: Student[]) => void;
  onPrintIdCard: (student: Student) => void;
  onPrintCertificate: (student: Student, type: 'Transfer' | 'Character' | 'Bonafide') => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

export default function StudentManagementView({
  students,
  vouchers = [],
  classes = [],
  initialAction = null,
  onUpdateStudents,
  onPrintIdCard,
  onPrintCertificate,
  onPrintVoucher,
}: StudentManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal States
  const [dossierStudent, setDossierStudent] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const [certTypeToIssue, setCertTypeToIssue] = useState<'Transfer' | 'Character' | 'Bonafide'>('Transfer');
  const [showBatchIdModal, setShowBatchIdModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [birthdaySent, setBirthdaySent] = useState<Record<string, boolean>>({});
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  const handleExportStudentsCsv = () => {
    const rows = filteredStudents.map((s) => ({
      'Student Code': s.studentCode,
      'Name': s.name,
      'Father Name': s.fatherName,
      'Class': s.className,
      'Section': s.section,
      'Roll No': s.rollNo,
      'Parent Phone': s.parentPhone,
      'Monthly Fee (PKR)': s.monthlyFee,
      'Discount %': s.discountPercentage || 0,
      'Blood Group': s.bloodGroup,
      'Status': s.status,
    }));
    exportToCsv(rows, `students_directory_${selectedClass.toLowerCase()}`);
  };

  const handleStartEdit = (std: Student) => {
    setEditingStudent(std);
    setEditForm({ ...std });
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !onUpdateStudents) return;
    const updated = students.map((s) => (s.id === editingStudent.id ? ({ ...s, ...editForm } as Student) : s));
    onUpdateStudents(updated);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (std: Student) => {
    if (!onUpdateStudents) return;
    const confirmed = window.confirm(`Are you sure you want to archive / delete student "${std.name}" (${std.studentCode})?`);
    if (confirmed) {
      onUpdateStudents(students.filter((s) => s.id !== std.id));
    }
  };

  const handleSendBirthdaySms = (studentKey: string) => {
    setBirthdaySent((prev) => ({ ...prev, [studentKey]: true }));
  };

  useEffect(() => {
    if (initialAction === 'promotion') {
      setShowPromotionModal(true);
    } else if (initialAction === 'birthday') {
      setShowBirthdayModal(true);
    } else if (initialAction === 'transfer') {
      setShowTransferModal(true);
    }
  }, [initialAction]);


  // Filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery);
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesGender = selectedGender === 'All' || s.gender === selectedGender;
    const matchesBlood = selectedBloodGroup === 'All' || s.bloodGroup === selectedBloodGroup;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    
    // Fee status check from vouchers if applicable
    let matchesFeeStatus = true;
    if (selectedFeeStatus !== 'All' && vouchers.length > 0) {
      const studentVouchers = vouchers.filter((v) => v.studentId === s.id || v.studentCode === s.studentCode);
      const hasUnpaid = studentVouchers.some((v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue');
      const hasPaid = studentVouchers.some((v) => v.paymentStatus === 'Paid');
      if (selectedFeeStatus === 'Unpaid Dues') matchesFeeStatus = hasUnpaid || studentVouchers.length === 0;
      else if (selectedFeeStatus === 'Paid') matchesFeeStatus = hasPaid && !hasUnpaid;
    }

    return (
      matchesSearch &&
      matchesClass &&
      matchesSection &&
      matchesGender &&
      matchesBlood &&
      matchesStatus &&
      matchesFeeStatus
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClass('All');
    setSelectedSection('All');
    setSelectedGender('All');
    setSelectedFeeStatus('All');
    setSelectedBloodGroup('All');
    setSelectedStatus('All');
  };

  const handleOpenCertificate = (student: Student, type: 'Transfer' | 'Character' | 'Bonafide') => {
    setCertificateStudent(student);
    setCertTypeToIssue(type);
  };

  const handleExecutePromotion = (
    updated: Student[],
    sourceClass: string,
    targetClass: string
  ) => {
    if (onUpdateStudents) {
      onUpdateStudents(updated);
    }
  };

  return (
    <div id="student-management-view" className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold shadow-xs">
            <GraduationCap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Student Directory &amp; Academic Dossier Hub
              </h2>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                Total: {students.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Profiles, sibling concessions, official certificates, and roll number sequencing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Bulk ID Card Printing */}
          <button
            type="button"
            onClick={() => setShowBatchIdModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition shadow-2xs cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
            <span>Batch ID Cards Grid</span>
          </button>

          {/* Student Promotion Sequencer */}
          <button
            type="button"
            onClick={() => setShowPromotionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition shadow-2xs cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Class Promotion Wizard</span>
          </button>

          {/* Birthday Calendar */}
          <button
            type="button"
            onClick={() => setShowBirthdayModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded font-semibold transition cursor-pointer"
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Birthday Calendar</span>
          </button>

          {/* Student Transfer & SLC Hub */}
          <button
            type="button"
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-200" />
            <span>Student Transfer &amp; SLC</span>
          </button>

          {/* Export CSV Roster */}
          <button
            type="button"
            onClick={handleExportStudentsCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded font-bold transition shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Strip - Advanced Multi-Attribute Filtering */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search student name, code (EDU-...), father name, or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-semibold">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Classes ({students.length})</option>
            <option value="Class One">Class One</option>
            <option value="Class Two">Class Two</option>
            <option value="Class Three">Class Three</option>
            <option value="Class Four">Class Four</option>
            <option value="Class Five">Class Five</option>
          </select>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-semibold">Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-semibold">Gender:</span>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male (Boys)</option>
            <option value="Female">Female (Girls)</option>
          </select>
        </div>

        {/* Fee Status Filter */}
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-slate-600 font-semibold">Fee:</span>
          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Fee Status</option>
            <option value="Paid">Fully Paid</option>
            <option value="Unpaid Dues">Has Unpaid Dues</option>
          </select>
        </div>

        {/* Blood Group Filter */}
        <div className="flex items-center gap-1.5">
          <HeartPulse className="w-3.5 h-3.5 text-red-500" />
          <span className="text-slate-600 font-semibold">Blood:</span>
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Blood</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="B-">B-</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-semibold">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Enrolled</option>
            <option value="Transferred">Transferred</option>
            <option value="Passed Out">Passed Out</option>
          </select>
        </div>

        {/* Active Results Badge & Reset Button */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
            Showing {filteredStudents.length} of {students.length}
          </span>
          {(searchQuery ||
            selectedClass !== 'All' ||
            selectedSection !== 'All' ||
            selectedGender !== 'All' ||
            selectedFeeStatus !== 'All' ||
            selectedBloodGroup !== 'All' ||
            selectedStatus !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 rounded transition text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Student Master Roster Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Student Details</th>
                <th className="py-2.5 px-3">Code / Roll</th>
                <th className="py-2.5 px-3">Class &amp; Section</th>
                <th className="py-2.5 px-3">Father &amp; Contact</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Monthly Tuition</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Dossier Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-sky-50/40 transition">
                  {/* Student Details */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={std.avatarUrl}
                        alt={std.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-300 shadow-2xs cursor-pointer hover:opacity-90"
                        onClick={() => setDossierStudent(std)}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div
                          className="font-bold text-slate-900 hover:text-sky-700 cursor-pointer"
                          onClick={() => setDossierStudent(std)}
                        >
                          {std.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>Blood: <strong className="text-red-700">{std.bloodGroup}</strong></span>
                          <span>•</span>
                          <span>{std.gender}</span>
                          {std.siblingCodes && std.siblingCodes.length > 0 && (
                            <span className="px-1 py-0.2 bg-purple-100 text-purple-800 rounded font-bold text-[9px]">
                              Sibling Mapped
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Code & Roll */}
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-sky-800">{std.studentCode}</span>
                    <div className="text-[10px] text-slate-500 font-mono">Roll: {std.rollNo}</div>
                  </td>

                  {/* Class & Section */}
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold text-[11px]">
                      {std.className}
                    </span>
                    <span className="ml-1 text-[11px] text-slate-600 font-medium">Sec {std.section}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{std.house || 'Iqbal House'}</div>
                  </td>

                  {/* Father & Phone */}
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{std.fatherName}</div>
                    <div className="font-mono text-slate-600 text-[11px]">{std.parentPhone}</div>
                  </td>

                  {/* Attendance */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-700">{std.attendanceRate || 96}%</span>
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${std.attendanceRate || 96}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Monthly Fee */}
                  <td className="py-2.5 px-3 font-mono">
                    <div className="font-bold text-slate-800">
                      Rs. {std.monthlyFee.toLocaleString()}
                    </div>
                    {std.discountPercentage ? (
                      <span className="text-[10px] text-purple-700 font-bold">
                        {std.discountPercentage}% Sibling Conc.
                      </span>
                    ) : null}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {std.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Dossier */}
                      <button
                        type="button"
                        onClick={() => setDossierStudent(std)}
                        title="View Full Student Dossier"
                        className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Print ID Card */}
                      <button
                        type="button"
                        onClick={() => onPrintIdCard(std)}
                        title="Print Student ID Badge"
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>

                      {/* Issue Certificate Modal */}
                      <button
                        type="button"
                        onClick={() => handleOpenCertificate(std, 'Transfer')}
                        title="Issue Institutional Certificate (SLC / Character / Bonafide)"
                        className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded transition cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                      </button>

                      {/* Edit Student Record */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(std)}
                        title="Edit Student Information"
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Archive / Delete Student */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(std)}
                        title="Archive / Remove Student"
                        className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Student Comprehensive Dossier Modal */}
      {dossierStudent && (
        <StudentProfileDossierModal
          isOpen={!!dossierStudent}
          onClose={() => setDossierStudent(null)}
          student={dossierStudent}
          allStudents={students}
          vouchers={vouchers}
          onSelectSibling={(sibling) => setDossierStudent(sibling)}
          onPrintIdCard={(std) => {
            onPrintIdCard(std);
          }}
          onIssueCertificate={(std, type) => {
            handleOpenCertificate(std, type);
          }}
          onPrintVoucher={onPrintVoucher}
        />
      )}

      {/* 2. Official Institutional Certificate Generator Modal */}
      {certificateStudent && (
        <CertificateGeneratorModal
          isOpen={!!certificateStudent}
          onClose={() => setCertificateStudent(null)}
          student={certificateStudent}
          certificateType={certTypeToIssue}
        />
      )}

      {/* 3. Class Promotion & Roll Number Sequencer Modal */}
      {showPromotionModal && (
        <StudentPromotionModal
          isOpen={showPromotionModal}
          onClose={() => setShowPromotionModal(false)}
          students={students}
          classes={classes}
          onExecutePromotion={handleExecutePromotion}
        />
      )}

      {/* 4. Batch Student ID Card Grid Modal */}
      {showBatchIdModal && (
        <BatchIdCardPrintModal
          isOpen={showBatchIdModal}
          onClose={() => setShowBatchIdModal(false)}
          students={students}
        />
      )}

      {/* 5. Birthday Calendar Modal */}
      {showBirthdayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-5 text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                <Cake className="w-4 h-4" />
                <span>Student Birthday Dispatch Calendar</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBirthdayModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Hamza Tariq</div>
                  <div className="text-[10px] text-slate-500">Class One (Sec A) • Birthday: Tomorrow</div>
                  <div className="text-[10px] font-mono text-pink-700 font-semibold">+92 300 9182736</div>
                </div>
                {birthdaySent['bday-1'] ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    SMS Dispatched
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendBirthdaySms('bday-1')}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded font-bold text-[10px] transition cursor-pointer shadow-2xs"
                  >
                    Send Birthday SMS
                  </button>
                )}
              </div>

              <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Fatima Zahra</div>
                  <div className="text-[10px] text-slate-500">Class Two (Sec A) • Birthday: In 3 Days</div>
                  <div className="text-[10px] font-mono text-pink-700 font-semibold">+92 300 1234568</div>
                </div>
                {birthdaySent['bday-2'] ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    SMS Dispatched
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendBirthdaySms('bday-2')}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded font-bold text-[10px] transition cursor-pointer shadow-2xs"
                  >
                    Send Birthday SMS
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Student Transfer & School Leaving Certificate (SLC) Clearance Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Student Transfer &amp; School Leaving Certificate (SLC) Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-300 hover:text-white font-bold cursor-pointer text-base"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-amber-900 flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Inter-Campus &amp; External Transfer Verification: </span>
                  <span>
                    Issuing a Transfer Certificate will mark the student record for clearance checks across Accounts, Library, and Campus Registrar.
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 font-bold p-2.5 text-slate-800 border-b flex justify-between items-center">
                  <span>Enrolled Students Available for Transfer / SLC</span>
                  <span className="text-[11px] font-mono text-slate-500">Showing {students.length} Enrolled</span>
                </div>
                <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
                  {students.slice(0, 6).map((std) => (
                    <div key={std.id} className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{std.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Code: {std.studentCode} | Class: {std.className} | Roll: {std.rollNo}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Fee Cleared
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                            Library Cleared
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenCertificate(std, 'Transfer');
                            setShowTransferModal(false);
                          }}
                          className="px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white font-bold rounded text-[11px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-amber-300" />
                          <span>Issue SLC Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold transition cursor-pointer"
              >
                Close Transfer Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Edit className="w-4 h-4 text-amber-300" />
                <span>Edit Student Record: {editingStudent.name} ({editingStudent.studentCode})</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-300 hover:text-white font-bold cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fatherName || ''}
                    onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    required
                    value={editForm.className || ''}
                    onChange={(e) => setEditForm({ ...editForm, className: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={editForm.section || ''}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    required
                    value={editForm.rollNo || ''}
                    onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.parentPhone || ''}
                    onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Tuition Fee (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editForm.monthlyFee ?? 4500}
                    onChange={(e) => setEditForm({ ...editForm, monthlyFee: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup || 'O+'}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment Status</label>
                  <select
                    value={editForm.status || 'Active'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="StruckOff">StruckOff</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

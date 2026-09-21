import { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Send,
  Printer,
  Users,
  Calendar,
  AlertCircle,
  Download,
  Upload,
  ArrowRight,
  Filter,
  Clock,
  Sparkles,
  Shield,
  HeartPulse,
} from 'lucide-react';
import { Student, AdmissionInquiry } from '../types';

interface AdmissionsViewProps {
  students: Student[];
  inquiries: AdmissionInquiry[];
  initialSubTab?: 'admit' | 'inquiries' | 'bulk' | 'requests';
  initialAction?: string | null;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onAddInquiry: (inquiry: Omit<AdmissionInquiry, 'id'>) => void;
  onUpdateInquiry?: (id: string, updates: Partial<AdmissionInquiry>) => void;
  onBatchAddStudents?: (students: Omit<Student, 'id'>[]) => void;
  onPrintForm: (student: Student) => void;
}

export default function AdmissionsView({
  students,
  inquiries,
  initialSubTab = 'admit',
  initialAction = null,
  onAddStudent,
  onAddInquiry,
  onUpdateInquiry,
  onBatchAddStudents,
  onPrintForm,
}: AdmissionsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'admit' | 'inquiries' | 'bulk' | 'requests'>(initialSubTab);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsMessageText, setSmsMessageText] = useState(
    'Dear Applicant/Parent, Greetings from The Educators! Your admission inquiry has been processed. Please visit campus for diagnostic assessment.'
  );

  // Sync initialSubTab when changed from sidebar
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialAction === 'sms') {
      setShowSmsModal(true);
    }
  }, [initialAction]);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [inquiryFilterStage, setInquiryFilterStage] = useState<string>('All');
  const [inquirySearch, setInquirySearch] = useState('');
  const [selectedInquiryForAction, setSelectedInquiryForAction] = useState<AdmissionInquiry | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [testNotes, setTestNotes] = useState('English & Mathematics diagnostic assessment');

  // Bulk CSV state
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [parsedBulkList, setParsedBulkList] = useState<Array<Omit<Student, 'id'>>>([]);
  const [bulkError, setBulkError] = useState('');

  // Sibling selection in Admission Form
  const [selectedSiblingId, setSelectedSiblingId] = useState('');

  // New Student Comprehensive Form State
  const [formData, setFormData] = useState({
    // Section 1: Student Identity
    name: '',
    fatherName: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '2016-01-01',
    bFormOrCnic: '',
    bloodGroup: 'B+',
    house: 'Iqbal House',
    religion: 'Islam',

    // Section 2: Academic Placement
    className: 'Class One',
    section: 'A',
    rollNo: '105',
    admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: '',

    // Section 3: Parental & Guardian Dossier
    fatherCnic: '',
    fatherOccupation: 'Business / Professional',
    motherName: '',
    parentPhone: '+92 300 ',
    secondaryPhone: '',
    parentEmail: '',
    address: '',

    // Section 4: Sibling & Financial
    monthlyFee: 6500,
    discountPercentage: 0,
    siblingStudentCode: '',

    // Section 5: Medical & Emergency Safety
    emergencyContact: '',
    authorizedPickup: '',
    allergies: '',
  });

  const [inquiryData, setInquiryData] = useState({
    studentName: '',
    parentName: '',
    phone: '+92 300 ',
    email: '',
    intendedClass: 'Class One',
    notes: '',
  });

  // Handle Sibling Auto-Discount calculation
  const handleSiblingSelect = (studentId: string) => {
    setSelectedSiblingId(studentId);
    if (!studentId) {
      setFormData((prev) => ({
        ...prev,
        discountPercentage: 0,
        siblingStudentCode: '',
      }));
      return;
    }

    const matched = students.find((s) => s.id === studentId);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        fatherName: prev.fatherName || matched.fatherName,
        parentPhone: prev.parentPhone.length > 8 ? prev.parentPhone : matched.parentPhone,
        address: prev.address || matched.address,
        discountPercentage: 15, // 15% institutional sibling discount
        siblingStudentCode: matched.studentCode,
      }));
    }
  };

  const handleSubmitAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `EDU-2024-00${students.length + 1}`;
    onAddStudent({
      studentCode: newCode,
      name: formData.name,
      fatherName: formData.fatherName,
      gender: formData.gender,
      dob: formData.dob,
      className: formData.className,
      section: formData.section,
      rollNo: formData.rollNo,
      admissionDate: formData.admissionDate,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail || `${formData.name.toLowerCase().replace(/\s+/g, '')}@parent.com`,
      address: formData.address || 'Campus Registered Address, Lahore',
      status: 'Active',
      monthlyFee: Number(formData.monthlyFee),
      discountPercentage: Number(formData.discountPercentage),
      emergencyContact: formData.emergencyContact || formData.parentPhone,
      bloodGroup: formData.bloodGroup,
      bFormOrCnic: formData.bFormOrCnic || '35202-0000000-0',
      fatherCnic: formData.fatherCnic || '35201-0000000-0',
      fatherOccupation: formData.fatherOccupation,
      motherName: formData.motherName,
      house: formData.house,
      previousSchool: formData.previousSchool,
      authorizedPickup: formData.authorizedPickup || formData.fatherName,
      allergies: formData.allergies,
      siblingCodes: formData.siblingStudentCode ? [formData.siblingStudentCode] : [],
      attendanceRate: 100,
      avatarUrl:
        formData.gender === 'Male'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 4500);

    // Reset Form
    setFormData({
      name: '',
      fatherName: '',
      gender: 'Male',
      dob: '2016-01-01',
      bFormOrCnic: '',
      bloodGroup: 'B+',
      house: 'Iqbal House',
      religion: 'Islam',
      className: 'Class One',
      section: 'A',
      rollNo: String(Number(formData.rollNo) + 1),
      admissionDate: new Date().toISOString().split('T')[0],
      previousSchool: '',
      fatherCnic: '',
      fatherOccupation: 'Business / Professional',
      motherName: '',
      parentPhone: '+92 300 ',
      secondaryPhone: '',
      parentEmail: '',
      address: '',
      monthlyFee: 6500,
      discountPercentage: 0,
      siblingStudentCode: '',
      emergencyContact: '',
      authorizedPickup: '',
      allergies: '',
    });
    setSelectedSiblingId('');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInquiry({
      inquiryNo: `INQ-2024-0${inquiries.length + 90}`,
      studentName: inquiryData.studentName,
      parentName: inquiryData.parentName,
      phone: inquiryData.phone,
      email: inquiryData.email,
      intendedClass: inquiryData.intendedClass,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      notes: inquiryData.notes,
    });
    alert(`Inquiry successfully registered for ${inquiryData.studentName}! SMS notification dispatched.`);
    setInquiryData({
      studentName: '',
      parentName: '',
      phone: '+92 300 ',
      email: '',
      intendedClass: 'Class One',
      notes: '',
    });
  };

  // Convert Inquiry to Admission
  const handleConvertInquiryToAdmission = (inq: AdmissionInquiry) => {
    setFormData((prev) => ({
      ...prev,
      name: inq.studentName,
      fatherName: inq.parentName,
      parentPhone: inq.phone,
      parentEmail: inq.email,
      className: inq.intendedClass,
    }));
    setActiveSubTab('admit');
  };

  // Bulk Demo Sample Generator
  const handleLoadSampleCsv = () => {
    const sample = `name,fatherName,gender,dob,className,section,rollNo,parentPhone,monthlyFee
Hamza Tariq,Tariq Mehmood,Male,2015-08-12,Class Two,A,110,+92 300 9182736,6500
Anaya Bilal,Bilal Hassan,Female,2016-04-20,Class One,A,111,+92 321 8273645,6500
Danyal Farhan,Farhan Qureshi,Male,2014-11-05,Class Three,A,112,+92 333 4567890,7000
Mahnoor Zahid,Zahid Iqbal,Female,2015-02-18,Class Two,B,113,+92 301 7891234,6500`;
    setBulkCsvText(sample);
    parseCsv(sample);
  };

  const parseCsv = (text: string) => {
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setParsedBulkList([]);
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const results: Array<Omit<Student, 'id'>> = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        if (cols.length >= 7) {
          const gender = cols[2] === 'Female' ? 'Female' : 'Male';
          results.push({
            studentCode: `EDU-2024-B0${i}`,
            name: cols[0],
            fatherName: cols[1],
            gender,
            dob: cols[3],
            className: cols[4],
            section: cols[5],
            rollNo: cols[6],
            parentPhone: cols[7] || '+92 300 0000000',
            parentEmail: `${cols[0].toLowerCase().replace(/\s+/g, '')}@student.edu.pk`,
            address: 'Campus Enrolled Student Address, Lahore',
            status: 'Active',
            monthlyFee: Number(cols[8]) || 6500,
            emergencyContact: cols[7] || '+92 300 0000000',
            bloodGroup: 'B+',
            admissionDate: new Date().toISOString().split('T')[0],
            attendanceRate: 100,
            avatarUrl:
              gender === 'Male'
                ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          });
        }
      }
      setParsedBulkList(results);
      setBulkError('');
    } catch (err: any) {
      setBulkError('Failed to parse CSV format. Please ensure valid comma-separated format.');
    }
  };

  const handleExecuteBulkAdmission = () => {
    if (parsedBulkList.length === 0) return;
    if (onBatchAddStudents) {
      onBatchAddStudents(parsedBulkList);
    } else {
      parsedBulkList.forEach((s) => onAddStudent(s));
    }
    alert(`Successfully enrolled ${parsedBulkList.length} students via bulk processor!`);
    setBulkCsvText('');
    setParsedBulkList([]);
    setActiveSubTab('admit');
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStage = inquiryFilterStage === 'All' || inq.status === inquiryFilterStage;
    const matchesSearch =
      inq.studentName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.parentName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.inquiryNo.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone.includes(inquirySearch);
    return matchesStage && matchesSearch;
  });

  return (
    <div id="admissions-module" className="space-y-4">
      {/* Top Bar with Navigation Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#002147] text-white flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Admissions &amp; Enrollment Pipeline
            </h2>
            <p className="text-[11px] text-slate-500">
              Official registration, multi-stage applicant inquiries, and bulk enrollment
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('admit')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeSubTab === 'admit'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admit Student
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('bulk')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeSubTab === 'bulk'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admit Bulk Student
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('requests')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Admission Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('inquiries')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'inquiries'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Admission Inquiries</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
              {inquiries.length}
            </span>
          </button>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Student admission successfully committed! Profile dossier created, monthly fee voucher queued, and parent SMS credentials dispatched.
          </span>
        </div>
      )}

      {/* SUB-TAB 1: OFFICIAL ADMISSION REGISTRATION FORM */}
      {activeSubTab === 'admit' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#002147] text-white px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Official Student Admission Registration Dossier
            </span>
            <span className="text-[11px] text-sky-200 font-mono">
              Auto-Allocated Code: EDU-2024-00{students.length + 1}
            </span>
          </div>

          <form onSubmit={handleSubmitAdmission} className="p-6 space-y-6 text-xs">
            {/* SECTION 1: STUDENT PERSONAL IDENTITY */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-800 font-bold">
                <Users className="w-4 h-4 text-sky-600" />
                <span>1. Student Identity &amp; Personal Particulars</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zeeshan Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National B-Form / CNIC</label>
                  <input
                    type="text"
                    placeholder="35202-0000000-0"
                    value={formData.bFormOrCnic}
                    onChange={(e) => setFormData({ ...formData, bFormOrCnic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institutional House</label>
                  <select
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="Iqbal House">Iqbal House (Blue)</option>
                    <option value="Jinnah House">Jinnah House (Green)</option>
                    <option value="Sir Syed House">Sir Syed House (Red)</option>
                    <option value="Liaquat House">Liaquat House (Yellow)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Religion</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Branch</label>
                  <input
                    type="text"
                    disabled
                    value="Model Town Main Campus"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded text-slate-600 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC PLACEMENT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-800 font-bold">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>2. Class Placement &amp; Previous Academic History</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrolled Class *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none font-bold"
                  >
                    <option value="Nursery">Nursery</option>
                    <option value="Prep">Prep</option>
                    <option value="Class One">Class One</option>
                    <option value="Class Two">Class Two</option>
                    <option value="Class Three">Class Three</option>
                    <option value="Class Four">Class Four</option>
                    <option value="Class Five">Class Five</option>
                    <option value="Class Six">Class Six</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block font-semibold text-slate-700 mb-1">Previous School &amp; Last Grade Passed</label>
                  <input
                    type="text"
                    placeholder="e.g. Beaconhouse Pre-School (Passed KG-II with Grade A)"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PARENT & GUARDIAN PARTICULARS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-800 font-bold">
                <Users className="w-4 h-4 text-purple-600" />
                <span>3. Parental &amp; Guardian Dossier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father National CNIC</label>
                  <input
                    type="text"
                    placeholder="35201-0000000-0"
                    value={formData.fatherCnic}
                    onChange={(e) => setFormData({ ...formData, fatherCnic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father Profession / Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer / Merchant"
                    value={formData.fatherOccupation}
                    onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fatima Begum"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Phone (For SMS Broadcasts) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    placeholder="parent@gmail.com"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Street &amp; City Address</label>
                <textarea
                  rows={2}
                  placeholder="Complete residential street, block, sector, town, and postal code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* SECTION 4: SIBLING MAPPING & FEE CONCESSION */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-900 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>4. Sibling Mapping &amp; Tuition Fee Concession</span>
                </div>
                {formData.discountPercentage > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px]">
                    {formData.discountPercentage}% Sibling Concession Applied
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 mb-1">Link Enrolled Sibling (Brother / Sister)</label>
                  <select
                    value={selectedSiblingId}
                    onChange={(e) => handleSiblingSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded bg-white font-medium"
                  >
                    <option value="">No Sibling (Standard Admission)</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentCode} • {s.className})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 mb-1">Monthly Tuition Fee (Rs.)</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-300 rounded bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 mb-1">Fee Concession / Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-300 rounded bg-white font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: MEDICAL SAFETY & EMERGENCY DISMISSAL */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-800 font-bold">
                <HeartPulse className="w-4 h-4 text-red-600" />
                <span>5. Medical Precautions &amp; Gate Dismissal Security</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Dispatch Contact</label>
                  <input
                    type="text"
                    placeholder="Emergency Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Dismissal / Pickup Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Father or Uncle (CNIC Verified)"
                    value={formData.authorizedPickup}
                    onChange={(e) => setFormData({ ...formData, authorizedPickup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Known Allergies / Medical Precautions</label>
                  <input
                    type="text"
                    placeholder="e.g. Dust allergy, Asthma, None"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Form Action Controls */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="reset"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded transition"
              >
                Reset Dossier
              </button>
              <button
                type="submit"
                id="submit-admission-btn"
                className="px-6 py-2.5 bg-[#002147] hover:bg-[#1b3b6f] text-white font-bold rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>Commit Student Admission</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: MULTI-STAGE ADMISSION INQUIRIES PIPELINE */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Quick Record Inquiry Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>Record New Applicant Inquiry</span>
            </h3>
            <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Applicant Student Name *"
                required
                value={inquiryData.studentName}
                onChange={(e) => setInquiryData({ ...inquiryData, studentName: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Father / Guardian Name *"
                required
                value={inquiryData.parentName}
                onChange={(e) => setInquiryData({ ...inquiryData, parentName: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="tel"
                placeholder="Parent Phone (for SMS Follow-up) *"
                required
                value={inquiryData.phone}
                onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded font-mono"
              />
              <select
                value={inquiryData.intendedClass}
                onChange={(e) => setInquiryData({ ...inquiryData, intendedClass: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="Class One">Class One</option>
                <option value="Class Two">Class Two</option>
                <option value="Class Three">Class Three</option>
                <option value="Class Four">Class Four</option>
                <option value="Class Five">Class Five</option>
              </select>
              <div className="sm:col-span-2 lg:col-span-3">
                <input
                  type="text"
                  placeholder="Notes / Previous School / Source of inquiry"
                  value={inquiryData.notes}
                  onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Inquiry &amp; SMS</span>
                </button>
              </div>
            </form>
          </div>

          {/* Inquiry Pipeline Stage Filter Strip */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['All', 'New', 'Contacted', 'Test Scheduled', 'Admitted', 'Rejected'] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setInquiryFilterStage(stage)}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    inquiryFilterStage === stage
                      ? 'bg-[#002147] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search applicant name, phone..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="pl-8 pr-3 py-1 border border-slate-300 rounded text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Inquiry #</th>
                    <th className="py-2.5 px-3">Applicant Name</th>
                    <th className="py-2.5 px-3">Father Name</th>
                    <th className="py-2.5 px-3">Intended Class</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Stage Status</th>
                    <th className="py-2.5 px-3 text-right">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{inq.inquiryNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{inq.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-700">{inq.parentName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[10px]">
                          {inq.intendedClass}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{inq.phone}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            inq.status === 'New'
                              ? 'bg-blue-100 text-blue-800'
                              : inq.status === 'Test Scheduled'
                              ? 'bg-amber-100 text-amber-800'
                              : inq.status === 'Admitted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Convert to Admission */}
                          <button
                            type="button"
                            onClick={() => handleConvertInquiryToAdmission(inq)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition cursor-pointer"
                            title="Convert into Admitted Student"
                          >
                            + Admit
                          </button>

                          {/* Direct WhatsApp follow-up link */}
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Dear%20Parent,%20Greetings%20from%20The%20Educators%20regarding%20${inq.studentName}'s%20admission.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold text-[10px] transition"
                            title="Direct WhatsApp Message"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BULK CSV ENROLLMENT WIZARD */}
      {activeSubTab === 'bulk' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Bulk Student Admission &amp; Roster CSV Importer</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Quickly register cohorts or classes into the institutional student database
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleCsv}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 4-Student Demo CSV</span>
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Paste Comma-Separated Values (CSV) or Edit Below:
            </label>
            <textarea
              rows={5}
              value={bulkCsvText}
              onChange={(e) => {
                setBulkCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder="name,fatherName,gender,dob,className,section,rollNo,parentPhone,monthlyFee"
              className="w-full font-mono text-[11px] p-3 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          {bulkError && <div className="text-red-600 font-medium">{bulkError}</div>}

          {parsedBulkList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">
                  Pre-Validation Preview ({parsedBulkList.length} Students Parsed)
                </h4>
                <button
                  type="button"
                  onClick={handleExecuteBulkAdmission}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Commit All {parsedBulkList.length} Students to Active Roster</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Father Name</th>
                      <th className="py-2 px-3">Gender</th>
                      <th className="py-2 px-3">Class &amp; Sec</th>
                      <th className="py-2 px-3">Roll No</th>
                      <th className="py-2 px-3">Parent Phone</th>
                      <th className="py-2 px-3 text-right">Fee (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedBulkList.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-800">{s.name}</td>
                        <td className="py-1.5 px-3 text-slate-600">{s.fatherName}</td>
                        <td className="py-1.5 px-3">{s.gender}</td>
                        <td className="py-1.5 px-3 font-semibold text-sky-800">
                          {s.className} (Sec {s.section})
                        </td>
                        <td className="py-1.5 px-3 font-mono">{s.rollNo}</td>
                        <td className="py-1.5 px-3 font-mono">{s.parentPhone}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold">
                          Rs. {s.monthlyFee.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      {/* SUB-TAB 4: ADMISSION REQUESTS (ONLINE APPLICATIONS) */}
      {activeSubTab === 'requests' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Online Admission Requests &amp; Portal Registrations</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Review and approve online admission applications submitted by prospective parents
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
              3 Pending Requests
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#002147] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Parent Name</th>
                  <th className="py-2.5 px-3">Applied Class</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Submission Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  {
                    id: 'REQ-2024-101',
                    name: 'Muhammad Ayan',
                    parent: 'Tariq Mehmood',
                    appliedClass: 'Class Prep',
                    phone: '+92 300 1234567',
                    date: '2026-09-18',
                  },
                  {
                    id: 'REQ-2024-102',
                    name: 'Fatima Noor',
                    parent: 'Kamran Akmal',
                    appliedClass: 'Class Four',
                    phone: '+92 321 9876543',
                    date: '2026-09-19',
                  },
                  {
                    id: 'REQ-2024-103',
                    name: 'Zayn Shah',
                    parent: 'Shahid Khan',
                    appliedClass: 'Class One',
                    phone: '+92 333 5551234',
                    date: '2026-09-20',
                  },
                ].map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{req.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{req.name}</td>
                    <td className="py-3 px-3 text-slate-600">{req.parent}</td>
                    <td className="py-3 px-3 font-semibold text-sky-800">{req.appliedClass}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{req.phone}</td>
                    <td className="py-3 px-3 text-slate-500">{req.date}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              name: req.name,
                              fatherName: req.parent,
                              parentPhone: req.phone,
                              className: req.appliedClass,
                            }));
                            setActiveSubTab('admit');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition cursor-pointer"
                        >
                          Approve &amp; Enroll
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Request ${req.id} sent to secondary review.`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition"
                        >
                          Details
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

      {/* SMS Broadcast Dialog for Inquiries */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Send className="w-4 h-4 text-amber-300" />
                <span>Send SMS Gateway Broadcast to Inquiries</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSmsModal(false)}
                className="text-slate-300 hover:text-white text-lg font-bold p-1 rounded"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Target Recipients: </span>
                  <span>{inquiries.length} Active Admission Inquiry contacts on campus list.</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  SMS Message Body (GSM Standard 160 Chars):
                </label>
                <textarea
                  rows={4}
                  value={smsMessageText}
                  onChange={(e) => setSmsMessageText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded font-sans outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>Character count: {smsMessageText.length}</span>
                  <span>Credits estimated: 1 SMS per lead</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`SMS broadcast successfully dispatched to ${inquiries.length} admission inquiry numbers via SMS Gateway!`);
                    setShowSmsModal(false);
                  }}
                  className="px-5 py-2 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dispatch SMS Gateway Broadcast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

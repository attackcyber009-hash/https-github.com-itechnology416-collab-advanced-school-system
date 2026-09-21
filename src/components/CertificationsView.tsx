import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Printer,
  FileCheck2,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  History,
  QrCode,
  Calendar,
  School,
  User,
  Briefcase,
  Layers,
  Sparkles,
  Settings,
  ShieldCheck,
  RotateCcw,
  FileSignature,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { Student, StaffMember } from '../types';

// Structured Certificate Interface
interface CertificateRecord {
  id: string;
  serialNo: string;
  category: 'student' | 'staff';
  recipientId: string;
  recipientName: string;
  subDetail: string; // e.g. Class Section or Designation/Department
  certificateType: string;
  bFormOrCode: string; // B-Form for student, Employee Code for staff
  dobOrJoining: string; // DOB for student, Joining Date for staff
  issueDate: string;
  leavingOrRelievingDate?: string;
  reasonOrCitation: string;
  conduct: string;
  remarks: string;
  duesCleared: boolean;
  verificationCode: string;
  issuedBy: string;
  status: 'Issued' | 'Pending' | 'Archived';
  // Template configurations saved specifically on this certificate
  templateStyle?: {
    primaryColor: string;
    borderStyle: string;
    fontFamily: string;
    sealStyle: string;
    signee1Name: string;
    signee1Title: string;
    signee2Name: string;
    signee2Title: string;
  };
}

// Initial robust certifications list (covering student and staff)
const INITIAL_CERTIFICATIONS: CertificateRecord[] = [
  {
    id: 'cert-std-1',
    serialNo: 'TE/LHR/STD-SLC/2026/0892',
    category: 'student',
    recipientId: 'std-001',
    recipientName: 'Muhammad Ali Raza',
    subDetail: 'Class One (Sec A) • Roll #01',
    certificateType: 'School Leaving Certificate (SLC)',
    bFormOrCode: '35202-8921821-3',
    dobOrJoining: '2016-04-12',
    issueDate: '2026-09-12',
    leavingOrRelievingDate: '2026-09-10',
    reasonOrCitation: 'Parent relocation to Islamabad / Transfer of residence',
    conduct: 'Exemplary, highly disciplined and moral conduct',
    remarks: 'He participated actively in school debates and junior cricket club.',
    duesCleared: true,
    verificationCode: 'VER-SLC-99281',
    issuedBy: 'Principal Prof. M. Usman Farooqi',
    status: 'Issued',
    templateStyle: {
      primaryColor: '#002147',
      borderStyle: 'border-double border-8 border-amber-900/30',
      fontFamily: 'font-serif',
      sealStyle: 'classic_gold',
      signee1Name: 'Mrs. Sabiha Naeem',
      signee1Title: 'Class Incharge',
      signee2Name: 'Prof. M. Usman Farooqi',
      signee2Title: 'Executive Principal'
    }
  },
  {
    id: 'cert-std-2',
    serialNo: 'TE/LHR/STD-CHR/2026/0145',
    category: 'student',
    recipientId: 'std-002',
    recipientName: 'Fatima Noor',
    subDetail: 'Class One (Sec A) • Roll #02',
    certificateType: 'Character Certificate',
    bFormOrCode: '35201-4491029-4',
    dobOrJoining: '2016-08-20',
    issueDate: '2026-09-15',
    reasonOrCitation: 'Outstanding civic sense, discipline and active social services contribution',
    conduct: 'Punctual, polite, exceptionally obedient and helpful',
    remarks: 'Maintained 98% attendance and received the Good Conduct Star Medal.',
    duesCleared: true,
    verificationCode: 'VER-CHR-88312',
    issuedBy: 'Principal Prof. M. Usman Farooqi',
    status: 'Issued',
    templateStyle: {
      primaryColor: '#0c4a6e',
      borderStyle: 'border-dashed border-4 border-sky-900/40',
      fontFamily: 'font-serif',
      sealStyle: 'blue_seal',
      signee1Name: 'Mrs. Sabiha Naeem',
      signee1Title: 'Class Incharge',
      signee2Name: 'Prof. M. Usman Farooqi',
      signee2Title: 'Executive Principal'
    }
  },
  {
    id: 'cert-stf-1',
    serialNo: 'TE/LHR/STF-EXP/2026/0411',
    category: 'staff',
    recipientId: 'stf-1',
    recipientName: 'Prof. Tariq Mahmood',
    subDetail: 'Senior Faculty • Science & Mathematics',
    certificateType: 'Experience & Relieving Certificate',
    bFormOrCode: 'EMP-001',
    dobOrJoining: '2021-08-01',
    issueDate: '2026-09-18',
    leavingOrRelievingDate: '2026-09-15',
    reasonOrCitation: 'Relieving on personal career advancement in higher research',
    conduct: 'Outstanding pedagogical expertise and highly professional devotion',
    remarks: 'Maintained a 100% passing board results ratio in Senior Level Physics and Mathematics.',
    duesCleared: true,
    verificationCode: 'VER-STF-11029',
    issuedBy: 'Principal Prof. M. Usman Farooqi',
    status: 'Issued',
    templateStyle: {
      primaryColor: '#065f46',
      borderStyle: 'border-solid border-8 border-emerald-900/25',
      fontFamily: 'font-serif',
      sealStyle: 'emerald_ribbon',
      signee1Name: 'Dr. Shahzad Amin',
      signee1Title: 'HR Director',
      signee2Name: 'Prof. M. Usman Farooqi',
      signee2Title: 'Executive Principal'
    }
  },
  {
    id: 'cert-stf-2',
    serialNo: 'TE/LHR/STF-APC/2026/0055',
    category: 'staff',
    recipientId: 'stf-2',
    recipientName: 'Ms. Ayesha Siddiqa',
    subDetail: 'English & Urdu Teacher • Languages & Arts',
    certificateType: 'Service Appreciation Certificate',
    bFormOrCode: 'EMP-002',
    dobOrJoining: '2022-03-15',
    issueDate: '2026-09-20',
    reasonOrCitation: 'Outstanding Teacher of the Year - Primary Section Literacy Development',
    conduct: 'Exceptional teaching creativity, patience and school event leadership',
    remarks: 'Successfully organized the Campus Literary Festival and modern Urdu drama competition.',
    duesCleared: true,
    verificationCode: 'VER-STF-33812',
    issuedBy: 'Principal Prof. M. Usman Farooqi',
    status: 'Issued',
    templateStyle: {
      primaryColor: '#78350f',
      borderStyle: 'border-double border-8 border-amber-950/40',
      fontFamily: 'font-serif',
      sealStyle: 'classic_gold',
      signee1Name: 'Dr. Shahzad Amin',
      signee1Title: 'HR Director',
      signee2Name: 'Prof. M. Usman Farooqi',
      signee2Title: 'Executive Principal'
    }
  }
];

interface CertificationsViewProps {
  students: Student[];
  staff: StaffMember[];
  initialAction?: 'printing' | 'template' | 'student' | 'staff';
}

export default function CertificationsView({
  students,
  staff,
  initialAction = 'printing'
}: CertificationsViewProps) {
  // Navigation tabs (synchronized from sidebar / top clicks)
  const [activeSubTab, setActiveSubTab] = useState<'printing' | 'template' | 'student' | 'staff'>(initialAction);

  // Sync with initialAction when prop changes
  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Certificates list
  const [issuedCertificates, setIssuedCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATIONS);

  // Search & Filter state for printing list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'student' | 'staff'>('all');
  const [filterType, setFilterType] = useState('All');

  // Currently selected certificate for preview / print inspector
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(INITIAL_CERTIFICATIONS[0]);

  // Global Template Config State
  const [templateDesign, setTemplateDesign] = useState({
    primaryColor: '#002147', // Deep Navy Blue
    borderStyle: 'border-double border-8 border-amber-900/30',
    fontFamily: 'font-serif',
    sealStyle: 'classic_gold',
    signee1Name: 'Mrs. Sabiha Naeem',
    signee1Title: 'Class Incharge',
    signee2Name: 'Prof. M. Usman Farooqi',
    signee2Title: 'Executive Principal',
    institutionName: 'THE EDUCATORS',
    campusDetail: 'A Project of Beaconhouse Group • Main Campus Lahore'
  });

  // Student Generator Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-001');
  const [studentCertType, setStudentCertType] = useState('School Leaving Certificate (SLC)');
  const [studentForm, setStudentForm] = useState({
    bFormNo: '35202-8921821-3',
    dob: '2016-04-12',
    leavingDate: new Date().toISOString().split('T')[0],
    admissionDate: '2022-03-15',
    reason: 'Parent transfer of residence / Relocation to another city',
    conduct: 'Exemplary, respectful, obedient and morally upright',
    remarks: 'Demonstrated deep academic curiosity and active participation in extra-curricular events.',
    duesCleared: true
  });

  // Staff Generator Form State
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || 'stf-1');
  const [staffCertType, setStaffCertType] = useState('Experience & Relieving Certificate');
  const [staffForm, setStaffForm] = useState({
    employeeCode: 'EMP-001',
    joiningDate: '2021-08-01',
    relievingDate: new Date().toISOString().split('T')[0],
    reason: 'Personal carrier advancement in higher educational research',
    conduct: 'Outstanding, innovative teaching ethics and highly reliable team dynamics',
    remarks: 'Maintained excellent academic results and took leadership of the Science Olympiad prep.',
    duesCleared: true
  });

  // Automatically load selected Student details on dropdown change
  useEffect(() => {
    const std = students.find((s) => s.id === selectedStudentId);
    if (std) {
      setStudentForm((prev) => ({
        ...prev,
        dob: std.dob || '2016-04-12',
        admissionDate: std.admissionDate || '2022-03-15'
      }));
    }
  }, [selectedStudentId, students]);

  // Automatically load selected Staff details on dropdown change
  useEffect(() => {
    const member = staff.find((st) => st.id === selectedStaffId);
    if (member) {
      setStaffForm((prev) => ({
        ...prev,
        employeeCode: member.employeeCode || 'EMP-001',
        joiningDate: member.joiningDate || '2021-08-01'
      }));
    }
  }, [selectedStaffId, staff]);

  // Handle student certificate generation
  const handleGenerateStudentCert = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === selectedStudentId) || students[0];
    if (!std) return;

    const shortType = studentCertType.includes('Leaving') ? 'SLC' : studentCertType.includes('Character') ? 'CHR' : 'BON';
    const serial = `TE/LHR/STD-${shortType}/2026/${String(issuedCertificates.length + 420).padStart(4, '0')}`;
    const verification = `VER-STD-${shortType}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRecord: CertificateRecord = {
      id: `cert-std-${Date.now()}`,
      serialNo: serial,
      category: 'student',
      recipientId: std.id,
      recipientName: std.name,
      subDetail: `${std.className} (Sec ${std.section}) • Roll #${std.rollNo}`,
      certificateType: studentCertType,
      bFormOrCode: studentForm.bFormNo,
      dobOrJoining: studentForm.dob,
      issueDate: new Date().toISOString().split('T')[0],
      leavingOrRelievingDate: studentCertType.includes('Leaving') ? studentForm.leavingDate : undefined,
      reasonOrCitation: studentForm.reason,
      conduct: studentForm.conduct,
      remarks: studentForm.remarks,
      duesCleared: studentForm.duesCleared,
      verificationCode: verification,
      issuedBy: templateDesign.signee2Name + ` (${templateDesign.signee2Title})`,
      status: 'Issued',
      templateStyle: { ...templateDesign }
    };

    setIssuedCertificates([newRecord, ...issuedCertificates]);
    setSelectedCert(newRecord);
    setActiveSubTab('printing');
    alert(`Successfully generated Student ${studentCertType}! Serial No: ${serial}`);
  };

  // Handle staff certificate generation
  const handleGenerateStaffCert = (e: React.FormEvent) => {
    e.preventDefault();
    const member = staff.find((s) => s.id === selectedStaffId) || staff[0];
    if (!member) return;

    const shortType = staffCertType.includes('Relieving') ? 'EXP' : staffCertType.includes('Appreciation') ? 'APC' : 'SRV';
    const serial = `TE/LHR/STF-${shortType}/2026/${String(issuedCertificates.length + 150).padStart(4, '0')}`;
    const verification = `VER-STF-${shortType}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRecord: CertificateRecord = {
      id: `cert-stf-${Date.now()}`,
      serialNo: serial,
      category: 'staff',
      recipientId: member.id,
      recipientName: member.name,
      subDetail: `${member.designation} • ${member.department}`,
      certificateType: staffCertType,
      bFormOrCode: staffForm.employeeCode,
      dobOrJoining: staffForm.joiningDate,
      issueDate: new Date().toISOString().split('T')[0],
      leavingOrRelievingDate: staffCertType.includes('Relieving') ? staffForm.relievingDate : undefined,
      reasonOrCitation: staffForm.reason,
      conduct: staffForm.conduct,
      remarks: staffForm.remarks,
      duesCleared: staffForm.duesCleared,
      verificationCode: verification,
      issuedBy: templateDesign.signee2Name + ` (${templateDesign.signee2Title})`,
      status: 'Issued',
      templateStyle: {
        primaryColor: templateDesign.primaryColor,
        borderStyle: templateDesign.borderStyle,
        fontFamily: templateDesign.fontFamily,
        sealStyle: templateDesign.sealStyle,
        signee1Name: 'Dr. Shahzad Amin',
        signee1Title: 'HR Director',
        signee2Name: templateDesign.signee2Name,
        signee2Title: templateDesign.signee2Title
      }
    };

    setIssuedCertificates([newRecord, ...issuedCertificates]);
    setSelectedCert(newRecord);
    setActiveSubTab('printing');
    alert(`Successfully generated Staff ${staffCertType}! Serial No: ${serial}`);
  };

  // Filter lists based on inputs
  const filteredCertificates = issuedCertificates.filter((cert) => {
    const matchesSearch =
      cert.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || cert.category === filterCategory;

    const matchesType =
      filterType === 'All' || cert.certificateType === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Trigger browser printing for currently inspected certificate
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div id="certifications-management-hub" className="space-y-5">
      {/* Upper Module Info Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-amber-900/10 text-amber-500 flex items-center justify-center font-bold shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Official Certifications &amp; Credentials Center
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                Real-Time QR Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage custom templates, student school leaving (SLC), staff experience transcripts, character certificates, and batch credential printouts.
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintCertificate}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Current Frame</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('printing')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'printing'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Certificate Printing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('template')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'template'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>Certificate Template Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('student')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'student'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4 text-sky-400" />
          <span>Student Certificate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('staff')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'staff'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-rose-400" />
          <span>Staff Certificate</span>
        </button>
      </div>

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
          {/* TAB 1: CERTIFICATE PRINTING               */}
          {/* ========================================== */}
          {activeSubTab === 'printing' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              {/* Left Column: Issued list selector */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <History className="w-4 h-4 text-[#002147]" />
                      <span>Issued Certificates Register</span>
                    </h3>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-mono text-slate-500">
                      Count: {filteredCertificates.length}
                    </span>
                  </div>

                  {/* Search and Category Filters */}
                  <div className="space-y-2 text-xs">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by name, serial, QR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-white text-slate-800 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Target Category</label>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value as any)}
                          className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                        >
                          <option value="all">All Recipients</option>
                          <option value="student">Students Only</option>
                          <option value="staff">Staff Members Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Specific Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                        >
                          <option value="All">All Formats</option>
                          <option value="School Leaving Certificate (SLC)">Leaving (SLC)</option>
                          <option value="Character Certificate">Character</option>
                          <option value="Bonafide Student Enrollment Verification">Bonafide</option>
                          <option value="Experience & Relieving Certificate">Staff Experience</option>
                          <option value="Service Appreciation Certificate">Staff Appreciation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable list items */}
                  <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
                    {filteredCertificates.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No certificates matching filters found.
                      </div>
                    ) : (
                      filteredCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          onClick={() => setSelectedCert(cert)}
                          className={`p-3 rounded-lg cursor-pointer transition flex items-center justify-between gap-3 ${
                            selectedCert?.id === cert.id
                              ? 'bg-amber-50/50 border border-amber-200 shadow-xs'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{cert.recipientName}</span>
                              <span className={`px-2 py-0.2 rounded font-black text-[8px] uppercase tracking-wider ${
                                cert.category === 'student' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                                {cert.category}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {cert.certificateType}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <span>Serial:</span>
                              <span className="text-slate-600 font-bold">{cert.serialNo}</span>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                            <div className="text-[9px] text-slate-400 font-mono">{cert.issueDate}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Live High Definition Inspector / Print Layout */}
              <div className="xl:col-span-7">
                {selectedCert ? (
                  <div className="space-y-4">
                    {/* Visual custom actions for current item */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Info className="w-4 h-4 text-sky-600" />
                        <span>Interactive preview. Use browser print settings to print high definition vector card.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrintCertificate}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Certificate</span>
                      </button>
                    </div>

                    {/* HD Frame Container */}
                    <div
                      id="hd-printable-certificate-frame"
                      className={`bg-[#fdfcfb] border-8 border-double border-amber-900/35 p-10 rounded-2xl shadow-md space-y-7 relative overflow-hidden text-slate-900 ${
                        selectedCert.templateStyle?.fontFamily || 'font-serif'
                      }`}
                    >
                      {/* Watermark Logo */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
                        <span className="text-8xl font-black tracking-widest text-slate-900 rotate-[-20deg]">
                          {templateDesign.institutionName}
                        </span>
                      </div>

                      {/* Header row */}
                      <div className="text-center space-y-1.5 border-b-2 border-amber-900/20 pb-4 relative z-10">
                        <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-indigo-950 to-amber-900 text-amber-300 flex items-center justify-center font-black text-xl shadow-sm border border-amber-400">
                          TE
                        </div>
                        <h1 className="text-2xl font-black tracking-widest text-[#002147] uppercase font-serif">
                          {templateDesign.institutionName}
                        </h1>
                        <p className="text-[11px] text-amber-900 font-bold tracking-wide uppercase">
                          {templateDesign.campusDetail}
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Govt. Registration: PEF-LHR-2018-8821 • Affiliated with BISE Punjab Board
                        </div>

                        {/* Title Ribbon */}
                        <div className="pt-2">
                          <span className="inline-block px-5 py-1 rounded bg-[#002147] text-amber-300 font-serif font-black text-xs uppercase tracking-widest border border-amber-400 shadow-sm">
                            {selectedCert.certificateType}
                          </span>
                        </div>
                      </div>

                      {/* Metadata bar */}
                      <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2 font-mono text-slate-600">
                        <div>
                          <span className="font-bold text-slate-800">Serial No: </span>
                          <span className="font-black text-sky-900">{selectedCert.serialNo}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">Date of Issue: </span>
                          <span>{selectedCert.issueDate}</span>
                        </div>
                      </div>

                      {/* Dynamic Content Wording */}
                      <div className="text-sm leading-relaxed text-slate-800 font-serif space-y-4 px-2">
                        {selectedCert.category === 'student' ? (
                          <p className="text-justify">
                            This is to certify that{' '}
                            <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 font-sans">
                              {selectedCert.recipientName}
                            </span>
                            , Son / Daughter of{' '}
                            <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 font-sans">
                              {selectedCert.subDetail.split('•')[0] || 'Tariq Mehmood Raza'}
                            </span>
                            , was a regular enrolled student in this institution, bearing registration number{' '}
                            <span className="font-bold font-mono text-sky-800">{selectedCert.bFormOrCode}</span>.
                            Their Date of Birth entered in the school admissions register is{' '}
                            <span className="font-bold font-mono">{selectedCert.dobOrJoining}</span>.
                          </p>
                        ) : (
                          <p className="text-justify">
                            This experience certificate is proudly presented to{' '}
                            <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 font-sans">
                              {selectedCert.recipientName}
                            </span>
                            , holding employee reference code{' '}
                            <span className="font-bold font-mono text-sky-800">{selectedCert.bFormOrCode}</span>,
                            who was engaged as{' '}
                            <span className="font-bold font-sans">{selectedCert.subDetail.split('•')[0]}</span> at our institution.
                            They joined the educational faculty on{' '}
                            <span className="font-bold font-mono">{selectedCert.dobOrJoining}</span>.
                          </p>
                        )}

                        {/* Extra Detail Row (relieving dates or citations) */}
                        <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 text-xs space-y-1.5 font-sans">
                          {selectedCert.leavingOrRelievingDate && (
                            <div>
                              <span className="font-bold text-slate-700">Relieving/Leaving Date: </span>
                              <span className="font-mono font-bold text-slate-900">{selectedCert.leavingOrRelievingDate}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-700">Reason / Official Citation: </span>
                            <span className="font-medium text-slate-900 italic">"{selectedCert.reasonOrCitation}"</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">General Conduct &amp; Efficiency: </span>
                            <span className="font-semibold text-emerald-900">{selectedCert.conduct}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Status of Accounts Dues: </span>
                            <span className="font-bold text-emerald-800">
                              {selectedCert.duesCleared ? 'Verified No-Dues Cleared' : 'Pending Verification'}
                            </span>
                          </div>
                        </div>

                        <p className="text-justify">
                          During their stay, they demonstrated high diligence and commitment. {selectedCert.remarks}
                        </p>

                        <p className="italic text-xs text-slate-500">
                          We pray for their continued growth, success, and prosperity in all future career progressions.
                        </p>
                      </div>

                      {/* Footer signatures & verification seals */}
                      <div className="pt-8 border-t-2 border-amber-900/15 grid grid-cols-3 gap-4 text-center text-xs">
                        {/* Interactive Verification QR Block */}
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <div className="p-1 bg-white rounded border border-slate-200 shadow-xs">
                            <QrCode className="w-11 h-11 text-slate-800" />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">
                            {selectedCert.verificationCode}
                          </span>
                        </div>

                        {/* Signee 1 */}
                        <div className="flex flex-col justify-end space-y-1">
                          <div className="w-24 border-b border-slate-800 mx-auto" />
                          <span className="font-bold text-slate-800 text-[10px] block">
                            {selectedCert.templateStyle?.signee1Name || templateDesign.signee1Name}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {selectedCert.templateStyle?.signee1Title || templateDesign.signee1Title}
                          </span>
                        </div>

                        {/* Signee 2 */}
                        <div className="flex flex-col justify-end space-y-1">
                          <div className="w-28 border-b-2 border-amber-900/30 mx-auto" />
                          <span className="font-black text-[#002147] text-[10.5px] block">
                            {selectedCert.templateStyle?.signee2Name || templateDesign.signee2Name}
                          </span>
                          <span className="text-[9px] font-bold text-amber-900 uppercase">
                            {selectedCert.templateStyle?.signee2Title || templateDesign.signee2Title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center text-slate-400 text-xs">
                    Please select a certificate record from the left side registry list to inspect.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: CERTIFICATE TEMPLATE BUILDER        */}
          {/* ========================================== */}
          {activeSubTab === 'template' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-xs">
              {/* Left Column: Template Options Editor */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                  <div className="border-b pb-2 flex items-center gap-1.5 text-slate-800">
                    <Settings className="w-4 h-4 text-[#002147]" />
                    <h3 className="font-bold">Credential Template Configurator</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Primary Color selection */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary Theme Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { name: 'Navy', hex: '#002147', bg: 'bg-[#002147]' },
                          { name: 'Emerald', hex: '#065f46', bg: 'bg-[#065f46]' },
                          { name: 'Crimson', hex: '#991b1b', bg: 'bg-[#991b1b]' },
                          { name: 'Amber', hex: '#78350f', bg: 'bg-[#78350f]' },
                          { name: 'Indigo', hex: '#3730a3', bg: 'bg-[#3730a3]' }
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setTemplateDesign({ ...templateDesign, primaryColor: c.hex })}
                            className={`p-2 rounded border flex flex-col items-center gap-1 transition ${
                              templateDesign.primaryColor === c.hex ? 'border-amber-500 bg-amber-50/20 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full ${c.bg}`} />
                            <span className="text-[9px] font-bold">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border Style */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Decorative Frame Border</label>
                      <select
                        value={templateDesign.borderStyle}
                        onChange={(e) => setTemplateDesign({ ...templateDesign, borderStyle: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        <option value="border-double border-8 border-amber-900/35">Double Classical Gold (Double border-8)</option>
                        <option value="border-dashed border-4 border-sky-900/40">Dashed Modern Sky Blue</option>
                        <option value="border-solid border-8 border-emerald-900/25">Solid Thick Emerald Green</option>
                        <option value="border-4 border-amber-950/40">Geometric Minimalist Dark Brown</option>
                      </select>
                    </div>

                    {/* Typographical scale / Family */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary Typography Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'font-serif', label: 'Classical Serif (Formal)' },
                          { key: 'font-sans', label: 'Modern Sans-Serif' },
                          { key: 'font-mono', label: 'Tech Monospace' }
                        ].map((f) => (
                          <button
                            key={f.key}
                            type="button"
                            onClick={() => setTemplateDesign({ ...templateDesign, fontFamily: f.key })}
                            className={`p-2 rounded border text-center font-bold ${
                              templateDesign.fontFamily === f.key ? 'border-amber-500 bg-amber-50/20 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={f.key}>{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hologram / Security seal style */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Verification Security Seal</label>
                      <select
                        value={templateDesign.sealStyle}
                        onChange={(e) => setTemplateDesign({ ...templateDesign, sealStyle: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        <option value="classic_gold">Standard Embossed Gold Seal</option>
                        <option value="emerald_ribbon">Emerald Security Star Medal</option>
                        <option value="blue_seal">BISE Punjab Affiliated Blue Ribbon</option>
                      </select>
                    </div>

                    {/* Institution Information Customization */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Institution Heading</label>
                      <input
                        type="text"
                        value={templateDesign.institutionName}
                        onChange={(e) => setTemplateDesign({ ...templateDesign, institutionName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-bold"
                      />
                    </div>

                    {/* Campus Sub-details */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Sub-header Details</label>
                      <input
                        type="text"
                        value={templateDesign.campusDetail}
                        onChange={(e) => setTemplateDesign({ ...templateDesign, campusDetail: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
                      />
                    </div>

                    {/* Signee Config */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Signee 1 Title (Left)</label>
                        <input
                          type="text"
                          value={templateDesign.signee1Title}
                          onChange={(e) => setTemplateDesign({ ...templateDesign, signee1Title: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Signee 1 Name (Left)</label>
                        <input
                          type="text"
                          value={templateDesign.signee1Name}
                          onChange={(e) => setTemplateDesign({ ...templateDesign, signee1Name: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Signee 2 Title (Right)</label>
                        <input
                          type="text"
                          value={templateDesign.signee2Title}
                          onChange={(e) => setTemplateDesign({ ...templateDesign, signee2Title: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Signee 2 Name (Right)</label>
                        <input
                          type="text"
                          value={templateDesign.signee2Name}
                          onChange={(e) => setTemplateDesign({ ...templateDesign, signee2Name: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setTemplateDesign({
                          primaryColor: '#002147',
                          borderStyle: 'border-double border-8 border-amber-900/30',
                          fontFamily: 'font-serif',
                          sealStyle: 'classic_gold',
                          signee1Name: 'Mrs. Sabiha Naeem',
                          signee1Title: 'Class Incharge',
                          signee2Name: 'Prof. M. Usman Farooqi',
                          signee2Title: 'Executive Principal',
                          institutionName: 'THE EDUCATORS',
                          campusDetail: 'A Project of Beaconhouse Group • Main Campus Lahore'
                        })
                      }
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center gap-1.5 border border-slate-300 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Design to Default</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Builder Preview Frame */}
              <div className="xl:col-span-7">
                <div className="space-y-4">
                  <div className="bg-slate-100 p-2.5 rounded-lg text-slate-700 font-bold text-[11px] flex items-center gap-1.5 border">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>Template Preview Sandbox: Real-time visual feedback based on your custom typography, branding, and frame styles.</span>
                  </div>

                  {/* Frame Visual Sandbox */}
                  <div
                    className={`bg-[#fcfaf7] p-8 rounded-2xl shadow-lg relative overflow-hidden text-slate-900 ${templateDesign.borderStyle} ${templateDesign.fontFamily}`}
                  >
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
                      <span className="text-7xl font-black tracking-widest text-slate-900 rotate-[-15deg]">
                        {templateDesign.institutionName}
                      </span>
                    </div>

                    {/* School Header */}
                    <div className="text-center space-y-1.5 border-b border-slate-200 pb-3">
                      <div className="w-12 h-12 mx-auto rounded-lg text-white flex items-center justify-center font-black text-lg border-2 border-amber-400" style={{ backgroundColor: templateDesign.primaryColor }}>
                        TE
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: templateDesign.primaryColor }}>
                        {templateDesign.institutionName}
                      </h2>
                      <p className="text-[10px] text-amber-900 uppercase tracking-widest font-bold">
                        {templateDesign.campusDetail}
                      </p>
                    </div>

                    {/* Ribbon */}
                    <div className="text-center py-4">
                      <span className="inline-block px-4 py-1 text-[11px] text-white font-bold rounded uppercase tracking-wider" style={{ backgroundColor: templateDesign.primaryColor }}>
                        ACADEMIC ACHIEVEMENT DIPLOMA PREVIEW
                      </span>
                    </div>

                    {/* Content text mock */}
                    <div className="space-y-3 leading-relaxed text-[13px] text-center max-w-xl mx-auto italic font-serif text-slate-700">
                      <p>
                        This is to solemnly acknowledge that <span className="font-bold text-slate-900 font-sans border-b pb-0.5 border-slate-400">[RECIPIENT NAME]</span> has successfully attained distinguished excellence in the academic curriculum program.
                      </p>
                      <p>
                        With general conduct found to be exemplary, diligent, and of superb character, they are awarded this certificate of appreciation on this <span className="font-bold">[ISSUE DATE]</span>.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-slate-200/50 grid grid-cols-3 gap-4 text-center text-[11px]">
                      {/* Seal badge mock */}
                      <div className="flex flex-col items-center justify-center">
                        {templateDesign.sealStyle === 'classic_gold' && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 border-2 border-yellow-300 shadow flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                            GOLD
                          </div>
                        )}
                        {templateDesign.sealStyle === 'emerald_ribbon' && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 border-2 border-emerald-400 shadow flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                            STAR
                          </div>
                        )}
                        {templateDesign.sealStyle === 'blue_seal' && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-800 border-2 border-sky-300 shadow flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                            BISE
                          </div>
                        )}
                        <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-widest">Seal type</span>
                      </div>

                      {/* Sign 1 */}
                      <div className="flex flex-col justify-end space-y-0.5">
                        <div className="w-20 border-b border-slate-400 mx-auto" />
                        <span className="font-bold text-slate-800 block text-[9.5px]">{templateDesign.signee1Name}</span>
                        <span className="text-[8.5px] text-slate-500">{templateDesign.signee1Title}</span>
                      </div>

                      {/* Sign 2 */}
                      <div className="flex flex-col justify-end space-y-0.5">
                        <div className="w-24 border-b border-slate-600 mx-auto" />
                        <span className="font-black text-slate-900 block text-[9.5px]" style={{ color: templateDesign.primaryColor }}>{templateDesign.signee2Name}</span>
                        <span className="text-[8.5px] text-amber-900 font-bold uppercase tracking-wider">{templateDesign.signee2Title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: STUDENT CERTIFICATE GENERATOR       */}
          {/* ========================================== */}
          {activeSubTab === 'student' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-xs">
              {/* Left Column: Generator Form inputs */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="border-b pb-2 flex items-center gap-1.5 text-slate-800">
                    <School className="w-4 h-4 text-sky-600" />
                    <h3 className="font-bold">Student Credential Issuing Form</h3>
                  </div>

                  <form onSubmit={handleGenerateStudentCert} className="space-y-3">
                    {/* Student Selection */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Active Student</label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-bold"
                      >
                        {students.map((std) => (
                          <option key={std.id} value={std.id}>
                            Roll #{std.rollNo} — {std.name} ({std.className})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Certificate Type */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Certificate Type Format</label>
                      <select
                        value={studentCertType}
                        onChange={(e) => setStudentCertType(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-semibold"
                      >
                        <option value="School Leaving Certificate (SLC)">School Leaving Certificate (SLC)</option>
                        <option value="Character Certificate">Moral Conduct &amp; Character Certificate</option>
                        <option value="Bonafide Student Enrollment Verification">Bonafide Student Enrollment Certificate</option>
                        <option value="Academic Distinction Honor Roll">Academic Distinction &amp; Honor Roll</option>
                      </select>
                    </div>

                    {/* B-Form Number */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Student B-Form No. / NADRA Child Registration</label>
                      <input
                        type="text"
                        value={studentForm.bFormNo}
                        onChange={(e) => setStudentForm({ ...studentForm, bFormNo: e.target.value })}
                        placeholder="35202-XXXXXXX-X"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800 font-bold"
                      />
                    </div>

                    {/* Dates block */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Admission Date</label>
                        <input
                          type="date"
                          value={studentForm.admissionDate}
                          onChange={(e) => setStudentForm({ ...studentForm, admissionDate: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                        />
                      </div>

                      {studentCertType.includes('Leaving') && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Leaving Date</label>
                          <input
                            type="date"
                            value={studentForm.leavingDate}
                            onChange={(e) => setStudentForm({ ...studentForm, leavingDate: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                          />
                        </div>
                      )}
                    </div>

                    {/* Reason / Citation */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Leaving Reason / Achievement Citation</label>
                      <textarea
                        rows={2}
                        value={studentForm.reason}
                        onChange={(e) => setStudentForm({ ...studentForm, reason: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    {/* Moral Conduct description */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Moral Conduct &amp; General Behavior</label>
                      <input
                        type="text"
                        value={studentForm.conduct}
                        onChange={(e) => setStudentForm({ ...studentForm, conduct: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    {/* Additional Remarks */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Executive Principal Remarks</label>
                      <textarea
                        rows={2}
                        value={studentForm.remarks}
                        onChange={(e) => setStudentForm({ ...studentForm, remarks: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-[11px]"
                      />
                    </div>

                    {/* Accounts Dues Clearance indicator */}
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <input
                        type="checkbox"
                        id="student-dues-checkbox"
                        checked={studentForm.duesCleared}
                        onChange={(e) => setStudentForm({ ...studentForm, duesCleared: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="student-dues-checkbox" className="text-[11px] font-bold text-emerald-900 cursor-pointer">
                        All library books, sports gear, and monthly fee accounts cleared (Audit Compliant)
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#002147] hover:bg-[#0a315e] text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Issue Official Student Certificate</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Mini Info Card & Tutorial */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>School Board Registration Standards &amp; Quality Audits</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-[#002147] text-[11px]">School Leaving (SLC)</div>
                      <p className="text-slate-500 leading-relaxed text-[10.5px]">
                        Generated in compliance with the Punjab Education Foundation and District Board authorities. Required during transfers between registered schools.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-[#002147] text-[11px]">Character Certificate</div>
                      <p className="text-slate-500 leading-relaxed text-[10.5px]">
                        Attests to moral demeanor and punctuality. Essential for board secondary wing admissions or college transitions.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg leading-relaxed text-[11px]">
                    <span className="font-bold">⚠️ Warning:</span> Issuing certificates creates a permanent digital stamp linked to the student B-Form register database. Always verify accounts clearance prior to issuing School Leaving documents.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: STAFF CERTIFICATE GENERATOR         */}
          {/* ========================================== */}
          {activeSubTab === 'staff' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-xs">
              {/* Left Column: Staff Generator Form */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="border-b pb-2 flex items-center gap-1.5 text-slate-800">
                    <Briefcase className="w-4 h-4 text-rose-500" />
                    <h3 className="font-bold">Staff Certificate Generator</h3>
                  </div>

                  <form onSubmit={handleGenerateStaffCert} className="space-y-3">
                    {/* Staff Selection */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Faculty / Staff Member</label>
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-bold"
                      >
                        {staff.map((st) => (
                          <option key={st.id} value={st.id}>
                            [{st.employeeCode}] {st.name} — {st.designation} ({st.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Staff Certificate Type */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Certificate Format Category</label>
                      <select
                        value={staffCertType}
                        onChange={(e) => setStaffCertType(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 font-semibold"
                      >
                        <option value="Experience & Relieving Certificate">Experience &amp; Relieving Certificate</option>
                        <option value="Service Appreciation Certificate">Service Appreciation Certificate</option>
                        <option value="CPD Pedagogical Milestone Diploma">CPD Pedagogical Milestone Diploma</option>
                      </select>
                    </div>

                    {/* Employee Code */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Unique Employee Code</label>
                      <input
                        type="text"
                        value={staffForm.employeeCode}
                        onChange={(e) => setStaffForm({ ...staffForm, employeeCode: e.target.value })}
                        placeholder="EMP-XXX"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                      />
                    </div>

                    {/* Dates block */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Joining Date</label>
                        <input
                          type="date"
                          value={staffForm.joiningDate}
                          onChange={(e) => setStaffForm({ ...staffForm, joiningDate: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                        />
                      </div>

                      {staffCertType.includes('Relieving') && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Relieving Date</label>
                          <input
                            type="date"
                            value={staffForm.relievingDate}
                            onChange={(e) => setStaffForm({ ...staffForm, relievingDate: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                          />
                        </div>
                      )}
                    </div>

                    {/* Accomplishments or Relieving Reason */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Teaching Accomplishments or Career Citation</label>
                      <textarea
                        rows={2}
                        value={staffForm.reason}
                        onChange={(e) => setStaffForm({ ...staffForm, reason: e.target.value })}
                        placeholder="e.g. Relieved on personal career advancement in research / Outstanding teacher of the month"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    {/* Conduct & Diligence */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Diligence, Conduct &amp; Team Ethics</label>
                      <input
                        type="text"
                        value={staffForm.conduct}
                        onChange={(e) => setStaffForm({ ...staffForm, conduct: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    {/* Additional Remarks */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Director HR / Board Remarks</label>
                      <textarea
                        rows={2}
                        value={staffForm.remarks}
                        onChange={(e) => setStaffForm({ ...staffForm, remarks: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 text-[11px]"
                      />
                    </div>

                    {/* Security clearance */}
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <input
                        type="checkbox"
                        id="staff-dues-checkbox"
                        checked={staffForm.duesCleared}
                        onChange={(e) => setStaffForm({ ...staffForm, duesCleared: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="staff-dues-checkbox" className="text-[11px] font-bold text-emerald-900 cursor-pointer">
                        All institutional assets, lab gear, and administrative liabilities cleared
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Issue Staff Certificate</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Board Compliance and Instructions */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b pb-2">
                    <FileSignature className="w-4 h-4 text-rose-600" />
                    <span>Faculty &amp; HR Experience Documentation Standards</span>
                  </h4>

                  <div className="space-y-3 leading-relaxed text-slate-600 text-[11px]">
                    <p>
                      Official experience transcripts provide legal verification of professional academic contributions. Our school network strictly logs experience credentials with unique serial references matching regional board registries.
                    </p>
                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 text-rose-950 font-medium">
                      <span className="font-bold">Pedagogical Record Compliance:</span> Relieving certificates must state subject specialties (e.g. Mathematics, Sciences) alongside board passing rates to assist in national/international placements.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

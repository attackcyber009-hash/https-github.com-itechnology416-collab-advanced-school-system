import { useState } from 'react';
import {
  Award,
  Printer,
  FileCheck2,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  QrCode,
  Calendar,
  School,
  User,
  Plus,
  History,
  Stamp,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Student, OfficialCertificate } from '../types';
import { INITIAL_CERTIFICATES } from '../data/phase6Data';

interface CertificatesSlipsViewProps {
  students: Student[];
  onOpenBatchIdModal?: () => void;
  onPrintCertificate?: (
    type:
      | 'transfer_certificate'
      | 'character_certificate'
      | 'bonafide_certificate'
      | 'merit_certificate',
    data: any
  ) => void;
}

export default function CertificatesSlipsView({
  students,
  onOpenBatchIdModal,
  onPrintCertificate,
}: CertificatesSlipsViewProps) {
  const [activeType, setActiveType] = useState<
    'Leaving (SLC)' | 'Character' | 'Bonafide / Enrollment' | 'Merit / Honor' | 'Sports & Co-Curricular' | 'registry'
  >('Leaving (SLC)');

  // Certificates store
  const [certificates, setCertificates] = useState<OfficialCertificate[]>(INITIAL_CERTIFICATES);

  // Selected student for generation
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-001');

  // Certificate Form state
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const [formState, setFormState] = useState({
    reasonForLeaving: 'Parent transfer of residence / Relocation to another city',
    generalConduct: 'Exemplary, respectful, obedient and morally upright',
    duesCleared: true,
    admissionDate: currentStudent?.admissionDate || '2022-03-15',
    leavingDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    bFormNo: '35202-8921821-3',
    remarks: 'Demonstrated keen academic curiosity and active participation in extracurricular events.',
    achievementTitle: 'First Position in Academic Session 2024-25',
  });

  // Registry Search & Filter
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryFilter, setRegistryFilter] = useState('All');

  // Currently displayed certificate in preview
  const [previewCert, setPreviewCert] = useState<OfficialCertificate | null>(INITIAL_CERTIFICATES[0]);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const prefix =
      activeType === 'Leaving (SLC)'
        ? 'SLC'
        : activeType === 'Character'
        ? 'CHR'
        : activeType === 'Bonafide / Enrollment'
        ? 'BON'
        : activeType === 'Merit / Honor'
        ? 'MRT'
        : 'SPT';

    const serial = `TE/LHR/${prefix}/2024/${String(certificates.length + 80).padStart(4, '0')}`;
    const verCode = `VER-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCert: OfficialCertificate = {
      id: `cert-${Date.now()}`,
      serialNo: serial,
      certificateType: activeType as OfficialCertificate['certificateType'],
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      fatherName: currentStudent.fatherName,
      bFormNo: formState.bFormNo,
      dob: currentStudent.dob,
      className: currentStudent.className,
      section: currentStudent.section,
      rollNo: currentStudent.rollNo,
      admissionDate: formState.admissionDate,
      leavingDate: formState.leavingDate,
      reasonForLeaving: formState.reasonForLeaving,
      generalConduct: formState.generalConduct,
      duesCleared: formState.duesCleared,
      issueDate: formState.issueDate,
      verificationCode: verCode,
      issuedBy: 'Prof. Muhammad Usman Farooqi (Executive Principal)',
      status: 'Issued',
      remarks: activeType === 'Merit / Honor' ? formState.achievementTitle : formState.remarks,
    };

    setCertificates([newCert, ...certificates]);
    setPreviewCert(newCert);
    alert(`Official ${activeType} certificate generated with Serial #${serial}!`);
  };

  const filteredRegistry = certificates.filter((c) => {
    const matchType = registryFilter === 'All' || c.certificateType === registryFilter;
    const matchSearch =
      c.studentName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      c.serialNo.toLowerCase().includes(registrySearch.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(registrySearch.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div id="certificates-slips-hub" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002147] text-amber-400 flex items-center justify-center font-bold shadow">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Official Institutional Certificates &amp; Verification Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Govt &amp; Board Recognized
              </span>
            </div>
            <p className="text-xs text-slate-500">
              School Leaving (SLC), Character, Bonafide Enrollment, Merit Awards &amp; Public Verification Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenBatchIdModal && (
            <button
              type="button"
              onClick={onOpenBatchIdModal}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 flex items-center gap-1.5 transition"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Student ID Cards</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#082a52] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Print Current Certificate</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveType('Leaving (SLC)')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'Leaving (SLC)'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4 text-amber-400" />
          <span>School Leaving (SLC)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('Character')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'Character'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Character Certificate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('Bonafide / Enrollment')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'Bonafide / Enrollment'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Bonafide / Enrollment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('Merit / Honor')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'Merit / Honor'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Merit &amp; Honor Roll</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('Sports & Co-Curricular')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'Sports & Co-Curricular'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Stamp className="w-4 h-4 text-teal-400" />
          <span>Sports &amp; Extracurricular</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('registry')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeType === 'registry'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4 text-purple-400" />
          <span>Issuance Registry &amp; Verification</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeType !== 'registry' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Form Controls (4 cols) */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-700" />
                  <h3 className="font-bold text-slate-800">
                    Candidate &amp; Issuance Parameters
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Type: {activeType}
                </span>
              </div>

              <form onSubmit={handleGenerateCertificate} className="space-y-3">
                {/* Student Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Enrolled Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const std = students.find((s) => s.id === e.target.value);
                      if (std) {
                        setFormState((prev) => ({
                          ...prev,
                          admissionDate: std.admissionDate || '2022-03-15',
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white font-semibold text-slate-800"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.className} - Roll #{st.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                {/* NADRA B-Form / CNIC */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student B-Form No. / NADRA Child Registration
                  </label>
                  <input
                    type="text"
                    value={formState.bFormNo}
                    onChange={(e) => setFormState({ ...formState, bFormNo: e.target.value })}
                    placeholder="35202-XXXXXXX-X"
                    className="w-full px-3 py-1.5 border rounded font-mono"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Admission Date</label>
                    <input
                      type="date"
                      value={formState.admissionDate}
                      onChange={(e) => setFormState({ ...formState, admissionDate: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date of Leaving / Issue</label>
                    <input
                      type="date"
                      value={formState.leavingDate}
                      onChange={(e) => setFormState({ ...formState, leavingDate: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>
                </div>

                {/* Reason for Leaving (SLC only) */}
                {activeType === 'Leaving (SLC)' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reason for Leaving</label>
                    <select
                      value={formState.reasonForLeaving}
                      onChange={(e) => setFormState({ ...formState, reasonForLeaving: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded bg-white text-slate-800"
                    >
                      <option value="Parent transfer of residence / Relocation to another city">
                        Parent transfer of residence / Relocation
                      </option>
                      <option value="Completion of Elementary / Primary Cycle">
                        Completion of Elementary / Primary Cycle
                      </option>
                      <option value="Transition to Board Matriculation Wing">
                        Transition to Board Matriculation Wing
                      </option>
                      <option value="Family personal circumstances">
                        Family personal circumstances
                      </option>
                    </select>
                  </div>
                )}

                {/* Moral Conduct */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">General Conduct &amp; Character</label>
                  <input
                    type="text"
                    value={formState.generalConduct}
                    onChange={(e) => setFormState({ ...formState, generalConduct: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>

                {/* Merit Award Title */}
                {(activeType === 'Merit / Honor' || activeType === 'Sports & Co-Curricular') && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Citation / Award Title</label>
                    <input
                      type="text"
                      value={formState.achievementTitle}
                      onChange={(e) => setFormState({ ...formState, achievementTitle: e.target.value })}
                      placeholder="e.g. First Position in Annual Exam / Best Athlete"
                      className="w-full px-3 py-1.5 border rounded font-semibold text-amber-800"
                    />
                  </div>
                )}

                {/* Remarks */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Remarks</label>
                  <textarea
                    rows={2}
                    value={formState.remarks}
                    onChange={(e) => setFormState({ ...formState, remarks: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded text-xs"
                  />
                </div>

                {/* Dues Cleared Checkbox */}
                <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                  <input
                    type="checkbox"
                    id="dues-cleared"
                    checked={formState.duesCleared}
                    onChange={(e) => setFormState({ ...formState, duesCleared: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="dues-cleared" className="text-[11px] font-bold text-emerald-900 cursor-pointer">
                    All Institutional &amp; Library Dues Cleared (Accounts Clearance Verified)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Generate Official {activeType} Certificate</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: High Definition Certificate Layout (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#fcfbf9] border-8 border-double border-amber-900/30 p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden text-slate-900">
              {/* Classical Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <span className="text-8xl font-black tracking-widest text-slate-900 rotate-[-25deg]">
                  THE EDUCATORS
                </span>
              </div>

              {/* Certificate Top Header */}
              <div className="text-center space-y-1.5 border-b-2 border-amber-900/20 pb-4 relative z-10">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-b from-emerald-800 to-teal-900 text-amber-300 flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-400">
                  TE
                </div>
                <h1 className="text-2xl font-black tracking-wider text-[#002147] uppercase font-serif">
                  THE EDUCATORS
                </h1>
                <p className="text-xs text-amber-900 font-semibold tracking-wide uppercase">
                  A Project of Beaconhouse Group • Main Campus Lahore
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Govt. Registration: PEF-LHR-2018-8821 • Affiliated with BISE Punjab
                </div>

                {/* Certificate Title Badge */}
                <div className="pt-2">
                  <span className="inline-block px-5 py-1 rounded-full bg-[#002147] text-amber-300 font-serif font-black text-sm uppercase tracking-widest shadow-sm">
                    {activeType === 'Leaving (SLC)'
                      ? 'SCHOOL LEAVING CERTIFICATE'
                      : activeType === 'Character'
                      ? 'CHARACTER & CONDUCT CERTIFICATE'
                      : activeType === 'Bonafide / Enrollment'
                      ? 'BONAFIDE ENROLLMENT CERTIFICATE'
                      : activeType === 'Merit / Honor'
                      ? 'CERTIFICATE OF MERIT & DISTINCTION'
                      : 'CERTIFICATE OF CO-CURRICULAR EXCELLENCE'}
                  </span>
                </div>
              </div>

              {/* Metadata Bar */}
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2 font-mono text-slate-600">
                <div>
                  <span className="font-bold text-slate-800">Serial No: </span>
                  <span className="font-black text-sky-900">
                    {previewCert?.serialNo || 'TE/LHR/SLC/2024/0082'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Issue Date: </span>
                  <span>{formState.issueDate}</span>
                </div>
              </div>

              {/* Certificate Formal Wording Body */}
              <div className="text-sm leading-relaxed text-slate-800 font-serif space-y-4 px-2">
                <p className="text-justify">
                  This is to solemnly certify that{' '}
                  <span className="font-bold text-slate-900 text-base border-b border-dotted border-slate-700 pb-0.5 font-sans">
                    {currentStudent?.name || 'Muhammad Ali Raza'}
                  </span>
                  , Son / Daughter of{' '}
                  <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5 font-sans">
                    {currentStudent?.fatherName || 'Tariq Mehmood Raza'}
                  </span>
                  , bearing Student Registration Code{' '}
                  <span className="font-bold font-mono text-sky-900">
                    {currentStudent?.studentCode || 'STD-2024-001'}
                  </span>{' '}
                  and NADRA B-Form No.{' '}
                  <span className="font-bold font-mono text-slate-900">{formState.bFormNo}</span>, was
                  duly enrolled as a bona fide student of this institution in{' '}
                  <span className="font-bold font-sans">{currentStudent?.className}</span> (Section{' '}
                  <span className="font-bold font-sans">{currentStudent?.section}</span>, Roll No.{' '}
                  <span className="font-bold font-mono">{currentStudent?.rollNo}</span>).
                </p>

                {activeType === 'Leaving (SLC)' && (
                  <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/80 text-xs space-y-1.5 font-sans">
                    <div>
                      <span className="font-bold text-slate-700">Date of Admission: </span>
                      <span className="font-mono">{formState.admissionDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Date of Leaving: </span>
                      <span className="font-mono">{formState.leavingDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Reason for Leaving: </span>
                      <span className="font-semibold text-slate-900">{formState.reasonForLeaving}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Accounts &amp; Library Clearance: </span>
                      <span className="font-bold text-emerald-800">
                        {formState.duesCleared
                          ? 'All dues and fees fully cleared up to departure.'
                          : 'Pending settlement.'}
                      </span>
                    </div>
                  </div>
                )}

                {(activeType === 'Merit / Honor' || activeType === 'Sports & Co-Curricular') && (
                  <div className="p-4 bg-amber-100/50 rounded-xl border border-amber-300 text-center space-y-1 font-sans">
                    <div className="text-xs uppercase tracking-wider text-amber-900 font-bold">
                      Honored for Exceptional Merit
                    </div>
                    <div className="text-base font-black text-amber-950">
                      "{formState.achievementTitle}"
                    </div>
                  </div>
                )}

                <p className="text-justify">
                  During their stay at this institution, their moral conduct, obedience and diligence were
                  found to be{' '}
                  <span className="font-bold text-slate-900 border-b border-dotted border-slate-700 pb-0.5">
                    {formState.generalConduct}
                  </span>
                  . {formState.remarks}
                </p>

                <p className="italic text-xs text-slate-600">
                  We pray for their continued academic triumphs and bright future in all subsequent endeavors.
                </p>
              </div>

              {/* Signatures & Institutional Seal Row */}
              <div className="pt-8 border-t-2 border-amber-900/20 grid grid-cols-3 gap-4 text-center text-xs">
                {/* QR Verification Seal */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-1.5 bg-white rounded border border-slate-300 shadow-xs">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    {previewCert?.verificationCode || 'VER-SLC-99281'}
                  </span>
                </div>

                {/* Class Incharge */}
                <div className="flex flex-col justify-end space-y-1">
                  <div className="w-28 border-b border-slate-800 mx-auto" />
                  <span className="font-bold text-slate-800 text-[11px] block">Class Incharge</span>
                  <span className="text-[10px] text-slate-500">Academic Wing</span>
                </div>

                {/* Principal Seal */}
                <div className="flex flex-col justify-end space-y-1">
                  <div className="w-32 border-b-2 border-amber-900 mx-auto" />
                  <span className="font-black text-[#002147] text-xs block">
                    Prof. M. Usman Farooqi
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 uppercase">
                    Executive Principal &amp; Director
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* REGISTRY & VERIFICATION LOG */
        /* ============================================================ */
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Institutional Certificate Registry &amp; Verification Audit
              </h3>
              <p className="text-slate-500 text-xs">
                Searchable master repository of all issued leaving, character, and bonafide certificates
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search Serial, Name, QR..."
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border rounded text-xs bg-white text-slate-800 w-52"
                />
              </div>

              <select
                value={registryFilter}
                onChange={(e) => setRegistryFilter(e.target.value)}
                className="px-3 py-1.5 border rounded text-xs bg-white font-semibold text-slate-800"
              >
                <option value="All">All Certificate Types</option>
                <option value="Leaving (SLC)">Leaving (SLC)</option>
                <option value="Character">Character</option>
                <option value="Bonafide / Enrollment">Bonafide / Enrollment</option>
                <option value="Merit / Honor">Merit / Honor</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Serial #</th>
                  <th className="py-2.5 px-3">Certificate Type</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3">B-Form No.</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3 text-center">Verification Code</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistry.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-800">{cert.serialNo}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {cert.certificateType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{cert.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{cert.fatherName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{cert.bFormNo}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{cert.issueDate}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-emerald-800 font-bold">
                      {cert.verificationCode}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 w-20 mx-auto">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewCert(cert);
                          setActiveType(cert.certificateType);
                        }}
                        className="px-2.5 py-1 bg-[#002147] hover:bg-slate-800 text-white rounded font-bold text-[11px] inline-flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3 h-3 text-amber-300" />
                        <span>Inspect &amp; Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

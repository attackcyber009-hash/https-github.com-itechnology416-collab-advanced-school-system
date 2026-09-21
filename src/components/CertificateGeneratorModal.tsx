import { useState } from 'react';
import { Award, Printer, Download, CheckCircle, X, Shield, FileText, Calendar, School } from 'lucide-react';
import { Student } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  certificateType: 'Transfer' | 'Character' | 'Bonafide';
}

export default function CertificateGeneratorModal({
  isOpen,
  onClose,
  student,
  certificateType,
}: CertificateGeneratorModalProps) {
  const [certType, setCertType] = useState<'Transfer' | 'Character' | 'Bonafide'>(certificateType);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [leavingDate, setLeavingDate] = useState(new Date().toISOString().split('T')[0]);
  const [reasonForLeaving, setReasonForLeaving] = useState('Parent relocation / Transfer of residence');
  const [conduct, setConduct] = useState('Exemplary and well-mannered');
  const [duesCleared, setDuesCleared] = useState(true);
  const [lastExamPassed, setLastExamPassed] = useState('Annual Examination with First Division (Grade A)');
  const [remarks, setRemarks] = useState('He/She bears a good moral character and demonstrated keen interest in co-curricular activities.');

  if (!isOpen || !student) return null;

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const certificateNumber = `TE-${certType.toUpperCase().slice(0, 3)}-2024-${student.rollNo || '01'}`;

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Record issuance in Firestore
      await addDoc(collection(db, 'issuedCertificates'), {
        studentId: student.id,
        studentName: student.name,
        certificateType: certType,
        certificateNumber,
        issueDate,
        issuedBy: 'Admin',
        timestamp: new Date().toISOString(),
      });
      
      // Give the UI a moment to render the "Recording..." state before triggering the blocking print dialog
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.print();
          setIsPrinting(false);
        }, 100);
      });
      
    } catch (error) {
      console.error('Error recording certificate issuance:', error);
      alert('Failed to record certificate issuance. Please try again.');
      setIsPrinting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Record issuance
      await addDoc(collection(db, 'issuedCertificates'), {
        studentId: student.id,
        studentName: student.name,
        certificateType: certType,
        certificateNumber,
        issueDate,
        issuedBy: 'Admin',
        timestamp: new Date().toISOString(),
      });

      const input = document.getElementById('official-certificate-document');
      if (input) {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate_${student.name}_${certType}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[95vh]">
        {/* Top Header Controls (Hidden during print) */}
        <div className="bg-[#002147] text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">
                Official Institutional Certificate Issuance Portal
              </h3>
              <p className="text-[11px] text-sky-200">
                Authorized for {student.name} ({student.studentCode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Certificate Type Switcher */}
            <div className="bg-white/10 rounded p-0.5 flex text-xs">
              <button
                type="button"
                onClick={() => setCertType('Transfer')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  certType === 'Transfer' ? 'bg-amber-500 text-slate-900 font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                Leaving (SLC)
              </button>
              <button
                type="button"
                onClick={() => setCertType('Character')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  certType === 'Character' ? 'bg-amber-500 text-slate-900 font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                Character
              </button>
              <button
                type="button"
                onClick={() => setCertType('Bonafide')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  certType === 'Bonafide' ? 'bg-amber-500 text-slate-900 font-bold' : 'text-white hover:bg-white/10'
                }`}
              >
                Bonafide
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className={`px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow flex items-center gap-1.5 transition cursor-pointer ${isPrinting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? 'Recording...' : 'Print Official Seal'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded shadow flex items-center gap-1.5 transition cursor-pointer ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Configuration Drawer (Interactive parameters for administrator) */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Date of Issue</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1"
            />
          </div>

          {certType === 'Transfer' && (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Leaving Date</label>
                <input
                  type="date"
                  value={leavingDate}
                  onChange={(e) => setLeavingDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Reason for Leaving</label>
                <input
                  type="text"
                  value={reasonForLeaving}
                  onChange={(e) => setReasonForLeaving(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">General Conduct Assessment</label>
            <input
              type="text"
              value={conduct}
              onChange={(e) => setConduct(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Principal's Formal Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Printable Official Certificate Stage */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-200/70 flex justify-center items-center">
          <div
            id="official-certificate-document"
            className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-lg shadow-xl border-8 border-double border-[#002147] text-slate-900 relative"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(254, 243, 199, 0.08) 0%, transparent 70%)',
            }}
          >
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
              <div className="w-80 h-80 rounded-full border-12 border-[#002147] flex items-center justify-center text-7xl font-black text-[#002147]">
                TE
              </div>
            </div>

            {/* Certificate Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-12 h-12 rounded bg-[#002147] text-white flex items-center justify-center font-black text-xl shadow">
                  TE
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-[#002147] uppercase font-serif">
                    THE EDUCATORS
                  </h1>
                  <p className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                    A Project of Beaconhouse Group
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-medium">
                Model Town Main Campus • Affiliated with Board of Intermediate &amp; Secondary Education
              </div>
              <div className="text-[10px] text-slate-500">
                Phone: +92 42 35881234 • Email: info@educators.edu.pk • Web: www.educators.edu.pk
              </div>

              {/* Certificate Ribbon */}
              <div className="mt-4">
                <span className="inline-block px-6 py-1.5 bg-[#002147] text-amber-300 font-bold uppercase tracking-widest text-sm rounded shadow-sm font-serif">
                  {certType === 'Transfer' && 'School Leaving Certificate'}
                  {certType === 'Character' && 'Certificate of Character & Conduct'}
                  {certType === 'Bonafide' && 'Bonafide Student Certificate'}
                </span>
              </div>
            </div>

            {/* Certificate Metadata Bar */}
            <div className="flex justify-between text-xs font-mono text-slate-600 mb-6 pb-2 border-b border-slate-200">
              <div>
                <strong>Certificate No:</strong> {certificateNumber}
              </div>
              <div>
                <strong>Registration Code:</strong> {student.studentCode}
              </div>
              <div>
                <strong>Date:</strong> {issueDate}
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-800 font-serif">
              <p className="indent-6 text-justify">
                This is to solemnly certify that{' '}
                <strong className="text-slate-950 font-sans uppercase border-b border-slate-400 pb-0.5">
                  {student.name}
                </strong>
                , son / daughter of Mr.{' '}
                <strong className="text-slate-950 font-sans uppercase border-b border-slate-400 pb-0.5">
                  {student.fatherName}
                </strong>
                , bearing National B-Form / Roll No.{' '}
                <strong className="text-slate-950 font-sans">{student.rollNo}</strong>, has been a bonafide student
                of this institution in{' '}
                <strong className="text-slate-950 font-sans">{student.className}</strong> (Section {student.section})
                from the date of admission{' '}
                <strong className="text-slate-950 font-sans">{student.admissionDate}</strong>
                {certType === 'Transfer' && (
                  <span>
                    {' '}
                    until leaving the school on{' '}
                    <strong className="text-slate-950 font-sans">{leavingDate}</strong>
                  </span>
                )}
                .
              </p>

              {certType === 'Transfer' && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1.5 font-sans">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500">Reason for Withdrawal:</span>{' '}
                      <span className="font-semibold text-slate-800">{reasonForLeaving}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Institutional Dues:</span>{' '}
                      <span className="font-bold text-emerald-700">
                        {duesCleared ? 'All Dues Paid in Full (Clearance Complete)' : 'Pending Clearance'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Academic Standing:</span>{' '}
                      <span className="font-semibold text-slate-800">{lastExamPassed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Attendance Track:</span>{' '}
                      <span className="font-semibold text-slate-800">
                        {student.attendanceRate || 98}% (Regular &amp; Punctual)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {certType === 'Character' && (
                <p className="indent-6 text-justify">
                  During his / her period of study at this institution, his / her general conduct, discipline, and
                  deportment have been{' '}
                  <strong className="text-emerald-800 font-sans">{conduct}</strong>. He / she participated enthusiastically in
                  scholastic, sports, and house competitions, demonstrating high integrity and respect towards faculty and
                  fellow students.
                </p>
              )}

              {certType === 'Bonafide' && (
                <p className="indent-6 text-justify">
                  This certificate is issued at the specific request of the parents for{' '}
                  <strong>Passport / Visa / Scholarship verification purposes</strong>. The student is currently in good standing,
                  actively enrolled, and following the prescribed national curriculum with full attendance compliance.
                </p>
              )}

              <p className="text-justify font-italic text-slate-700">
                Remarks: "{remarks}"
              </p>

              <p className="text-justify">
                We wish him / her every success and bright future in all forthcoming academic endeavors.
              </p>
            </div>

            {/* Official Seals & Signatures */}
            <div className="mt-12 pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-24 h-12 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center pb-1 text-slate-400 font-serif italic">
                  Class Teacher
                </div>
                <span className="font-bold text-slate-700 text-[10px]">Incharge Teacher</span>
                <span className="text-[9px] text-slate-500">Verified &amp; Checked</span>
              </div>

              {/* Embossed School Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-50/50 flex flex-col items-center justify-center text-amber-800 shadow-inner">
                  <Shield className="w-4 h-4 text-amber-600 mb-0.5" />
                  <span className="text-[7px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
                  <span className="text-[6px] font-mono">2024–2025</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-28 h-12 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center pb-1 text-[#002147] font-serif font-bold italic">
                  Prof. M. Akhtar
                </div>
                <span className="font-bold text-slate-800 text-[10px]">Principal / Headmaster</span>
                <span className="text-[9px] text-slate-500">The Educators (Model Town)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

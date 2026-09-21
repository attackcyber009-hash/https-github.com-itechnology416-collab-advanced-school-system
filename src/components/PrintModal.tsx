import { Printer, Download, X, Check } from 'lucide-react';
import { FeeVoucher, Student, StudentMarkEntry } from '../types';

interface PrintModalProps {
  type:
    | 'fee_voucher'
    | 'id_card'
    | 'admit_card'
    | 'report_card'
    | 'transfer_certificate'
    | 'character_certificate'
    | 'bonafide_certificate'
    | 'merit_certificate'
    | 'datesheet'
    | 'visitor_pass'
    | 'student_gate_pass'
    | 'hostel_outing_pass'
    | 'book_barcode_label'
    | 'house_merit_certificate'
    | 'medical_fitness_certificate'
    | 'lab_asset_tag'
    | 'formal_exam_paper'
    | 'admission_offer_letter'
    | 'teacher_cpd_certificate'
    | 'ptm_evaluation_slip'
    | 'alumni_recommendation_letter'
    | 'lesson_plan_dossier'
    | 'career_counseling_dossier'
    | 'sports_winner_certificate'
    | 'procurement_purchase_order'
    | 'executive_audit_report'
    | 'lms_course_completion_certificate'
    | 'helpdesk_grievance_dossier'
    | 'master_class_timetable'
    | 'facility_work_order'
    | 'fleet_vehicle_dossier'
    | 'hostel_room_dossier'
    | 'mess_menu_card'
    | 'cafeteria_barcode_tag'
    | 'exam_paper_document'
    | 'question_item_card'
    | 'localized_portal_dossier';
  data: any;
  onClose: () => void;
}

export default function PrintModal({ type, data, onClose }: PrintModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="print-preview-modal"
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Modal Action Header */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {type === 'fee_voucher' && 'Official 3-Copy Bank Fee Voucher Preview'}
              {type === 'id_card' && 'Institutional Student / Staff ID Card Preview'}
              {type === 'admit_card' && 'Examination Roll Number Slip & Admit Card'}
              {type === 'report_card' && 'Term Academic Mark Sheet & Transcript'}
              {type === 'transfer_certificate' && 'Official School Leaving Certificate (SLC)'}
              {type === 'character_certificate' && 'Official Character & Conduct Certificate'}
              {type === 'bonafide_certificate' && 'Official Bonafide Enrollment Certificate'}
              {type === 'merit_certificate' && 'Official Certificate of Academic Distinction & Merit'}
              {type === 'datesheet' && 'Official Examination Datesheet & Schedule'}
              {type === 'visitor_pass' && 'Official Campus Visitor Gate Pass Slip'}
              {type === 'student_gate_pass' && 'Emergency Student Early-Leave Authorization Pass'}
              {type === 'hostel_outing_pass' && 'Hostel Residential Boarding Outing Pass'}
              {type === 'sports_winner_certificate' && 'Official Annual Sports Gala & National Olympiad Gold/Silver Certificate'}
              {type === 'procurement_purchase_order' && 'Official Institutional Purchase Order (PO) & 3-Way Comparative Statement'}
              {type === 'executive_audit_report' && 'Campus Quality Assurance & Institutional Accreditation Audit Dossier'}
              {type === 'lms_course_completion_certificate' && 'Single National Curriculum E-Learning & SLO Mastery Certificate'}
              {type === 'helpdesk_grievance_dossier' && 'Official Parent Helpdesk Inquiry & SLA Resolution Dossier'}
              {type === 'master_class_timetable' && 'Official Institutional Master Class Weekly Timetable & Room Allocation Schedule'}
              {type === 'facility_work_order' && 'Official Campus Facility Maintenance Work Order & Material Job Card'}
              {type === 'fleet_vehicle_dossier' && 'Official School Fleet Vehicle Safety, GPS & Fitness Inspection Dossier'}
              {type === 'hostel_room_dossier' && 'Official Boarding Hostel Room Bed Allotment & Clearance Dossier'}
              {type === 'mess_menu_card' && 'Official Boarding Mess Weekly Dietary Menu Card'}
              {type === 'cafeteria_barcode_tag' && 'Cafeteria & Tuck Shop POS Barcode Tag'}
              {type === 'exam_paper_document' && 'Official Single National Curriculum (SNC) Examination Question Paper & Marking Scheme'}
              {type === 'question_item_card' && 'SNC Question Bank Master Item & Model Solution Card'}
              {type === 'localized_portal_dossier' && 'Official Tri-Lingual Multi-Campus Portal Communication Dossier'}
              {type === 'book_barcode_label' && 'Library Accession Tag & Barcode Label'}
              {type === 'house_merit_certificate' && 'Official House Championship & Sports Distinction Certificate'}
              {type === 'medical_fitness_certificate' && 'Official Campus Medical Health & Fitness Certificate'}
              {type === 'lab_asset_tag' && 'Science & IT Lab Asset Barcode Inspection Tag'}
              {type === 'formal_exam_paper' && 'Official Terminal Examination Question Paper'}
              {type === 'admission_offer_letter' && 'Official Provisional Admission Offer & Enrolment Letter'}
              {type === 'teacher_cpd_certificate' && 'Official Faculty Continuous Professional Development (CPD) Certificate'}
              {type === 'ptm_evaluation_slip' && 'Official Parent-Teacher Meeting (PTM) Evaluation & Agreement Slip'}
              {type === 'alumni_recommendation_letter' && 'Official Principal Recommendation Letter & Higher Education Dossier'}
              {type === 'lesson_plan_dossier' && 'Official Single National Curriculum (SNC) Lesson Plan Dossier'}
              {type === 'career_counseling_dossier' && 'Official Career Counseling & Higher Education Placement Roadmap'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Stage */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex justify-center text-slate-900 select-text">
          
          {/* ========================================================= */}
          {/* 1. 3-COPY BANK FEE VOUCHER (BANK, SCHOOL, STUDENT COPIES) */}
          {/* ========================================================= */}
          {type === 'fee_voucher' && (
            <div className="w-full bg-white p-4 rounded shadow-sm border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-slate-400 gap-4 text-[10px]">
                {(['BANK COPY', 'SCHOOL COPY', 'STUDENT COPY'] as const).map((copyName, idx) => (
                  <div key={idx} className="flex flex-col justify-between space-y-2 px-2 pt-2 md:pt-0">
                    {/* Header */}
                    <div className="text-center border-b border-slate-300 pb-2">
                      <div className="font-extrabold text-[11px] text-emerald-800 uppercase tracking-tight">
                        THE EDUCATORS
                      </div>
                      <div className="text-[8px] text-slate-500 uppercase font-semibold">A Project of Beaconhouse</div>
                      <div className="font-bold text-[10px] text-slate-800">MAIN CAMPUS</div>
                      <div className="inline-block mt-1 px-2 py-0.5 bg-slate-800 text-white font-bold text-[8px] rounded uppercase">
                        {copyName}
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200 font-mono text-[9px]">
                      <div><strong>Bank:</strong> Meezan Bank Ltd.</div>
                      <div><strong>A/C Title:</strong> The Educators School</div>
                      <div><strong>A/C No:</strong> 0214-0103994812</div>
                    </div>

                    {/* Voucher & Student Details */}
                    <div className="space-y-0.5 text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Voucher #:</span>
                        <span className="font-bold font-mono">{(data as FeeVoucher)?.voucherNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Student Code:</span>
                        <span className="font-bold font-mono">{(data as FeeVoucher)?.studentCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Student Name:</span>
                        <span className="font-bold">{(data as FeeVoucher)?.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Father Name:</span>
                        <span>{(data as FeeVoucher)?.fatherName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Class:</span>
                        <span className="font-bold">{(data as FeeVoucher)?.className} ({(data as FeeVoucher)?.section})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Month:</span>
                        <span className="font-semibold">{(data as FeeVoucher)?.month}</span>
                      </div>
                      <div className="flex justify-between text-red-600 font-semibold">
                        <span>Due Date:</span>
                        <span className="font-mono font-bold">{(data as FeeVoucher)?.dueDate}</span>
                      </div>
                    </div>

                    {/* Fee Heads Table */}
                    <div className="border border-slate-300 rounded overflow-hidden">
                      <table className="w-full text-left text-[9px]">
                        <thead className="bg-slate-100 font-bold border-b border-slate-300">
                          <tr>
                            <th className="p-1">Particulars</th>
                            <th className="p-1 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono">
                          {(data as FeeVoucher)?.feeHeads?.map((h, i) => (
                            <tr key={i}>
                              <td className="p-1">{h.head}</td>
                              <td className="p-1 text-right">Rs. {h.amount}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50 font-bold">
                            <td className="p-1">Total Payable:</td>
                            <td className="p-1 text-right">Rs. {(data as FeeVoucher)?.totalAmount}</td>
                          </tr>
                          <tr className="bg-emerald-50 text-emerald-800 font-black text-[10px]">
                            <td className="p-1">NET AMOUNT:</td>
                            <td className="p-1 text-right">Rs. {(data as FeeVoucher)?.netPayable}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Barcode & Signature */}
                    <div className="pt-2 text-center border-t border-slate-200">
                      {/* Stylized Barcode */}
                      <div className="font-mono text-[8px] tracking-widest bg-neutral-900 text-white py-0.5 px-2 rounded inline-block mb-2">
                        ||| | |||| | ||||| | || | |||
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-400 pt-3">
                        <span>Cashier Stamp</span>
                        <span>Authorized Sign</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. STUDENT / STAFF ID CARD                                */}
          {/* ========================================================= */}
          {type === 'id_card' && (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Front Side */}
              <div className="w-64 h-96 bg-white rounded-xl shadow-lg border-2 border-slate-300 overflow-hidden flex flex-col justify-between relative">
                <div className="bg-[#1b3b6f] text-white p-3 text-center">
                  <div className="text-[11px] font-black tracking-wider uppercase text-amber-300">THE EDUCATORS</div>
                  <div className="text-[8px] opacity-80 uppercase">A Project of Beaconhouse</div>
                </div>

                <div className="flex flex-col items-center p-3 text-center">
                  <img
                    src={(data as Student)?.avatarUrl}
                    alt=""
                    className="w-24 h-24 rounded-full border-4 border-emerald-600 object-cover shadow mb-2"
                  />
                  <h3 className="font-black text-sm text-slate-900">{(data as Student)?.name}</h3>
                  <div className="text-[11px] font-bold text-sky-800 font-mono">{(data as Student)?.studentCode}</div>
                  <div className="mt-2 text-[10px] text-slate-600 font-medium space-y-0.5">
                    <div>Class: <strong>{(data as Student)?.className}</strong></div>
                    <div>Roll No: <strong>{(data as Student)?.rollNo}</strong></div>
                    <div>Blood Group: <strong className="text-red-600">{(data as Student)?.bloodGroup}</strong></div>
                  </div>
                </div>

                <div className="bg-emerald-700 text-white p-2 text-center text-[9px] font-bold uppercase tracking-wider">
                  STUDENT IDENTITY CARD • 2024-2025
                </div>
              </div>

              {/* Back Side */}
              <div className="w-64 h-96 bg-white rounded-xl shadow-lg border-2 border-slate-300 p-4 flex flex-col justify-between text-[9px]">
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 border-b pb-1">INSTRUCTIONS &amp; CONTACT</div>
                  <p className="text-slate-500 leading-relaxed">
                    This card is institutional property and must be worn on campus at all times. If found, please return to The Educators Administration Office.
                  </p>
                  <div>
                    <strong>Emergency Phone:</strong> {(data as Student)?.parentPhone}
                  </div>
                  <div>
                    <strong>Campus Helpline:</strong> +92 42 111-777-888
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-200">
                  <div className="font-cursive text-sm text-sky-800 mb-0.5 italic">Dr. Principal Office</div>
                  <div className="font-bold text-[8px] uppercase tracking-wider text-slate-400">Principal Signature</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. EXAM ADMIT CARD / ROLL NO SLIP                         */}
          {/* ========================================================= */}
          {type === 'admit_card' && (
            <div className="w-full max-w-xl bg-white p-6 rounded-lg border-2 border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase">THE EDUCATORS HIGH SCHOOL</h2>
                  <div className="text-[11px] font-bold text-slate-600">OFFICIAL EXAMINATION ROLL NUMBER SLIP</div>
                  <div className="text-[10px] text-slate-500">Mid-Term Assessment • Session 2024-2025</div>
                </div>
                <div className="w-20 h-24 border border-slate-400 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                  Photo
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-medium">
                <div>Candidate Name: <strong>{(data as Student)?.name || 'Hamza Aslam'}</strong></div>
                <div>Roll Number: <strong className="font-mono text-sky-800 font-bold">101</strong></div>
                <div>Father Name: <strong>{(data as Student)?.fatherName || 'Muhammad Aslam'}</strong></div>
                <div>Class: <strong>{(data as Student)?.className || 'Class One'} (Sec A)</strong></div>
              </div>

              {/* Schedule Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b font-bold">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Timing</th>
                    <th className="p-2 text-right">Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  <tr>
                    <td className="p-2">15 Oct 2024</td>
                    <td className="p-2 font-sans font-semibold">Mathematics</td>
                    <td className="p-2">09:00 AM - 12:00 PM</td>
                    <td className="p-2 text-right text-slate-300">______</td>
                  </tr>
                  <tr>
                    <td className="p-2">17 Oct 2024</td>
                    <td className="p-2 font-sans font-semibold">English Language</td>
                    <td className="p-2">09:00 AM - 12:00 PM</td>
                    <td className="p-2 text-right text-slate-300">______</td>
                  </tr>
                  <tr>
                    <td className="p-2">19 Oct 2024</td>
                    <td className="p-2 font-sans font-semibold">General Science</td>
                    <td className="p-2">09:00 AM - 12:00 PM</td>
                    <td className="p-2 text-right text-slate-300">______</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 border-t flex justify-between items-end text-[10px]">
                <div className="text-slate-500">Center: Main Auditorium Hall</div>
                <div className="text-center font-bold">
                  <div className="border-t border-slate-400 w-32 pt-1">Controller of Exams</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. STUDENT REPORT CARD / TRANSCRIPT                       */}
          {/* ========================================================= */}
          {type === 'report_card' && (
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg border-2 border-emerald-800 space-y-4 text-xs">
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <h2 className="text-lg font-black text-emerald-900 uppercase tracking-wide">
                  THE EDUCATORS SCHOOL &amp; COLLEGE
                </h2>
                <div className="text-xs font-bold text-slate-700">ANNUAL ACADEMIC PROGRESS REPORT</div>
                <div className="text-[10px] text-slate-500 font-medium">Affiliated with Beaconhouse Educational System</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded border">
                <div>Student Name: <strong className="block text-slate-900">{(data as StudentMarkEntry)?.studentName}</strong></div>
                <div>Roll No: <strong className="block text-slate-900 font-mono">{(data as StudentMarkEntry)?.rollNo}</strong></div>
                <div>Class &amp; Section: <strong className="block text-slate-900">{(data as StudentMarkEntry)?.className} ({(data as StudentMarkEntry)?.section})</strong></div>
                <div>Class Rank: <strong className="block text-emerald-700 font-bold text-sm">{(data as StudentMarkEntry)?.position ? `#${(data as StudentMarkEntry)?.position} Position` : 'Pass'}</strong></div>
              </div>

              {/* Subject Breakdown Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-emerald-800 text-white font-bold">
                  <tr>
                    <th className="p-2">Subject Name</th>
                    <th className="p-2 text-center">Max Marks</th>
                    <th className="p-2 text-center">Obtained Marks</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {(data as StudentMarkEntry)?.subjectMarks?.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-sans font-semibold text-slate-800">{sub.subject}</td>
                      <td className="p-2 text-center">{sub.totalMarks}</td>
                      <td className="p-2 text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-sans">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td className="p-2">Grand Total:</td>
                    <td className="p-2 text-center">{(data as StudentMarkEntry)?.totalMax}</td>
                    <td className="p-2 text-center text-emerald-700 font-black">{(data as StudentMarkEntry)?.totalObtained}</td>
                    <td className="p-2 text-center text-emerald-700 font-black">{(data as StudentMarkEntry)?.overallGrade} ({(data as StudentMarkEntry)?.percentage}%)</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <div className="font-bold text-amber-900 text-[11px] mb-0.5">Teacher's Assessment Remarks:</div>
                <div className="text-slate-700 italic">"{(data as StudentMarkEntry)?.teacherRemarks}"</div>
              </div>

              <div className="pt-6 flex justify-between items-end text-[10px] text-slate-600">
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 pt-1">Class Teacher</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 pt-1">Parent Signature</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 pt-1">Principal Seal</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. TRANSFER CERTIFICATE (SLC)                             */}
          {/* ========================================================= */}
          {type === 'transfer_certificate' && (
            <div className="w-full max-w-xl bg-white p-8 rounded-lg border-4 border-double border-slate-800 space-y-4 text-xs font-serif leading-relaxed">
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                <h2 className="text-lg font-black tracking-wider uppercase text-slate-900">
                  THE EDUCATORS HIGH SCHOOL
                </h2>
                <div className="text-xs uppercase font-sans font-bold text-slate-600 tracking-wide">
                  School Leaving Certificate (SLC)
                </div>
                <div className="text-[10px] font-sans text-slate-400">Govt. Registration No. ED-LHR-2018/991</div>
              </div>

              <div className="space-y-3 pt-2">
                <p>
                  This is to certify that <strong>{(data as Student)?.name || data?.studentName || 'Hamza Aslam'}</strong>, son/daughter of{' '}
                  <strong>{(data as Student)?.fatherName || data?.fatherName || 'Muhammad Aslam'}</strong>, was a bonafide student of this institution
                  enrolled in <strong>{(data as Student)?.className || data?.className || 'Class One'}</strong> under Student Registration Code{' '}
                  <strong className="font-mono">{(data as Student)?.studentCode || data?.studentId || 'EDU-2024-001'}</strong>.
                </p>
                <p>
                  He/She has cleared all institutional tuition dues up to date. His/Her general conduct and character during his/her tenure at this school has been satisfactory and commendable.
                </p>
                <p>
                  Reason for leaving: <em>{data?.reasonForLeaving || 'At the request of parents due to relocation'}</em>.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end font-sans text-[10px]">
                <div>Date of Issue: {data?.issueDate || new Date().toLocaleDateString()}</div>
                <div className="text-center">
                  <div className="border-t border-slate-500 w-36 pt-1 font-bold">Principal &amp; Campus Head</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. CHARACTER & CONDUCT CERTIFICATE                        */}
          {/* ========================================================= */}
          {type === 'character_certificate' && (
            <div className="w-full max-w-xl bg-white p-8 rounded-lg border-4 border-slate-800 space-y-4 text-xs font-serif leading-relaxed shadow-sm">
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                <h2 className="text-lg font-black tracking-wider uppercase text-slate-900">
                  THE EDUCATORS HIGH SCHOOL
                </h2>
                <div className="text-xs uppercase font-sans font-bold text-emerald-800 tracking-wide">
                  Official Character &amp; Conduct Certificate
                </div>
                <div className="text-[10px] font-sans text-slate-400">Affiliated with BISE Lahore &amp; PEF</div>
              </div>

              <div className="space-y-3 pt-2">
                <p>
                  This is to solemnly certify that <strong>{data?.name || data?.studentName || 'Ayesha Khan'}</strong>, son/daughter of{' '}
                  <strong>{data?.fatherName || 'Tariq Mehmood Khan'}</strong>, has been a bonafide student of this institution in{' '}
                  <strong>{data?.className || 'Class Eight'}</strong> (Roll No. <strong>{data?.rollNo || '04'}</strong>).
                </p>
                <p>
                  During their academic tenure at this school, their moral conduct, discipline, and devotion towards studies have been{' '}
                  <strong>{data?.generalConduct || 'Exemplary and highly commendable'}</strong>. They have exhibited active participation in co-curricular activities, maintaining high civic sense and institutional decorum.
                </p>
                <p>
                  To the best of our knowledge and official institutional records, they bear an untarnished moral character.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end font-sans text-[10px]">
                <div>Serial: {data?.serialNo || 'TE/CHR/2024/0912'}</div>
                <div className="text-center">
                  <div className="border-t border-slate-500 w-36 pt-1 font-bold">Executive Principal</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. BONAFIDE / ENROLLMENT CERTIFICATE                      */}
          {/* ========================================================= */}
          {type === 'bonafide_certificate' && (
            <div className="w-full max-w-xl bg-white p-8 rounded-lg border-2 border-indigo-900 space-y-4 text-xs font-serif leading-relaxed shadow-sm">
              <div className="text-center space-y-1 border-b-2 border-indigo-900 pb-3">
                <h2 className="text-lg font-black tracking-wider uppercase text-[#002147]">
                  THE EDUCATORS SCHOOL &amp; COLLEGE
                </h2>
                <div className="text-xs uppercase font-sans font-bold text-indigo-800 tracking-wide">
                  Bonafide Student &amp; Enrollment Certificate
                </div>
                <div className="text-[10px] font-sans text-slate-400">For Official NADRA / Passport / Embassy Verification</div>
              </div>

              <div className="space-y-3 pt-2">
                <p>
                  This is to certify that <strong>{data?.name || data?.studentName || 'Hamza Bilal'}</strong>, Son/Daughter of{' '}
                  <strong>{data?.fatherName || 'Bilal Ahmad'}</strong>, is a regular bonafide student currently enrolled in{' '}
                  <strong>{data?.className || 'Class Nine'}</strong> (Section {data?.section || 'A'}).
                </p>
                <div className="p-3 bg-slate-50 border rounded font-sans text-[11px] grid grid-cols-2 gap-2">
                  <div>Date of Birth: <strong>{data?.dob || '2012-05-14'}</strong></div>
                  <div>NADRA B-Form No: <strong>{data?.bFormNo || '35202-9988112-3'}</strong></div>
                  <div>Date of Admission: <strong>{data?.admissionDate || '2021-04-01'}</strong></div>
                  <div>Student Code: <strong>{data?.studentCode || 'EDU-2024-082'}</strong></div>
                </div>
                <p>
                  This certificate is issued on the specific request of the parents for legal verification and record purposes without any liability on this institution.
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end font-sans text-[10px]">
                <div>Date of Issue: {new Date().toLocaleDateString()}</div>
                <div className="text-center">
                  <div className="border-t border-slate-500 w-36 pt-1 font-bold">Authorized Signatory</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. MERIT / HONOR ROLL CERTIFICATE                         */}
          {/* ========================================================= */}
          {type === 'merit_certificate' && (
            <div className="w-full max-w-2xl bg-amber-50/60 p-8 rounded-xl border-4 border-amber-600 space-y-4 text-xs font-serif leading-relaxed shadow-lg text-center">
              <div className="space-y-1 border-b-2 border-amber-600 pb-3">
                <div className="text-[10px] uppercase font-sans font-bold text-amber-800 tracking-widest">
                  THE EDUCATORS EDUCATIONAL SYSTEM
                </div>
                <h2 className="text-2xl font-black tracking-wider uppercase text-amber-950 font-serif">
                  Certificate of Academic Distinction
                </h2>
                <div className="text-xs font-sans font-semibold text-amber-900">Awarded for Scholastic Excellence</div>
              </div>

              <div className="py-4 space-y-3 font-sans">
                <div className="text-slate-600 text-xs italic">This distinction is proudly presented to:</div>
                <div className="text-2xl font-black text-slate-900 border-b-2 border-amber-400 inline-block px-8 pb-1">
                  {data?.studentName || data?.name || 'Mustafa Raza'}
                </div>
                <div className="text-xs text-slate-700">
                  Son/Daughter of <strong>{data?.fatherName || 'Raza Farooq'}</strong>, of <strong>{data?.className || 'Class Ten'}</strong>
                </div>
                <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-lg max-w-md mx-auto">
                  <div className="font-bold text-amber-950 text-sm">
                    "{data?.achievementTitle || 'First Position in Annual Board Assessment 2024'}"
                  </div>
                  <div className="text-[11px] text-amber-900 font-mono mt-0.5">
                    Total Marks Obtained: {data?.totalObtained || 490} / {data?.totalMax || 500} ({data?.percentage || 98}%)
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-end font-sans text-[10px] text-slate-700">
                <div>Award Serial: {data?.serialNo || 'TE/MRT/2024/001'}</div>
                <div className="text-center">
                  <div className="border-t border-amber-800 w-36 pt-1 font-bold text-amber-950">Campus Principal</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. VISITOR GATE PASS SLIP                                 */}
          {/* ========================================================= */}
          {type === 'visitor_pass' && (
            <div className="w-full max-w-md bg-white p-6 rounded-xl border-2 border-slate-800 space-y-4 text-xs font-sans shadow-md">
              <div className="text-center border-b pb-2 space-y-0.5">
                <div className="font-black text-sm uppercase text-[#002147] tracking-wider">
                  THE EDUCATORS SCHOOL SYSTEM
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Official Campus Security Directorate</div>
                <div className="inline-block mt-1 px-3 py-0.5 bg-slate-900 text-white font-mono font-bold text-[11px] rounded">
                  GATE PASS #{data?.passNo || 'GP-2024-0941'}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">VISITOR BADGE NUMBER</div>
                <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">
                  {data?.badgeNumber || 'VIS-08'}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Visitor Full Name:</span>
                  <span className="font-bold text-slate-900">{data?.visitorName || 'Chaudhry Muhammad Aslam'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">NADRA CNIC:</span>
                  <span className="font-mono font-bold text-slate-800">{data?.cnicNo || '35202-1892811-5'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-mono">{data?.contactNo || '0300-4819283'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Official to Meet:</span>
                  <span className="font-bold text-slate-900">{data?.personToMeet || 'Campus Principal'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Purpose of Visit:</span>
                  <span className="text-slate-800 text-right max-w-[200px]">{data?.purposeOfVisit || 'Parent Consultation'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Vehicle / Transport:</span>
                  <span className="font-mono font-bold text-slate-800">{data?.vehicleNo || 'None (On Foot)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Entry Timestamp:</span>
                  <span className="font-mono font-bold text-emerald-700">{data?.entryTime || '09:15 AM'}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between items-end text-[10px] text-slate-500">
                <div>Security: {data?.securityOfficer || 'Subedar (R) M. Rafiq'}</div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 pt-1 text-slate-700 font-bold">Gate Officer Stamp</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. EMERGENCY STUDENT EARLY-LEAVE PASS                    */}
          {/* ========================================================= */}
          {type === 'student_gate_pass' && (
            <div className="w-full max-w-md bg-white p-6 rounded-xl border-2 border-rose-800 space-y-4 text-xs font-sans shadow-md">
              <div className="text-center border-b pb-2 space-y-0.5">
                <div className="font-black text-sm uppercase text-[#002147] tracking-wider">
                  THE EDUCATORS SCHOOL SYSTEM
                </div>
                <div className="text-[10px] text-rose-800 font-bold uppercase">Emergency Student Early-Departure Pass</div>
                <div className="inline-block mt-1 px-3 py-0.5 bg-rose-700 text-white font-mono font-bold text-[11px] rounded">
                  PASS #{data?.passNo || 'EGP-2024-041'}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{data?.studentName || 'Hamza Aslam'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Class &amp; Roll #:</span>
                  <span className="font-bold text-slate-800">{data?.className || 'Class One'} (Roll #{data?.rollNo || '01'})</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Authorized Guardian:</span>
                  <span className="font-bold text-slate-900">{data?.parentGuardianName || 'Muhammad Aslam'} ({data?.relationship || 'Father'})</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Guardian CNIC:</span>
                  <span className="font-mono text-slate-800">{data?.guardianCnic || '35202-1892811-5'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Reason for Early Leave:</span>
                  <span className="text-slate-800 text-right max-w-[200px] font-medium">{data?.reasonForLeave || 'Medical consultation / Illness'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exit Departure Time:</span>
                  <span className="font-mono font-bold text-rose-700">{data?.issueTime || '11:30 AM'}</span>
                </div>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4 text-center text-[10px] text-slate-700">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold">Class Incharge Signature</div>
                  <div className="text-slate-500 text-[9px]">{data?.approvedByTeacher || 'Mrs. Farzana'}</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold">Principal Authorizer</div>
                  <div className="text-slate-500 text-[9px]">{data?.approvedByPrincipal || 'Prof. Tariq Mahmood'}</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. HOSTEL RESIDENTIAL OUTING PASS                        */}
          {/* ========================================================= */}
          {type === 'hostel_outing_pass' && (
            <div className="w-full max-w-md bg-white p-6 rounded-xl border-2 border-blue-900 space-y-4 text-xs font-sans shadow-md">
              <div className="text-center border-b pb-2 space-y-0.5">
                <div className="font-black text-sm uppercase text-[#002147] tracking-wider">
                  THE EDUCATORS RESIDENTIAL HOSTEL
                </div>
                <div className="text-[10px] text-blue-800 font-bold uppercase">Boarder Student Outing / Weekend Pass</div>
                <div className="inline-block mt-1 px-3 py-0.5 bg-[#002147] text-white font-mono font-bold text-[11px] rounded">
                  PASS #{data?.leaveCode || 'HLP-2024-0081'}
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{data?.studentName || 'Mustafa Raza'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Hostel Wing &amp; Room:</span>
                  <span className="font-bold text-slate-800">{data?.wingName || 'Quaid-e-Azam Wing'} • {data?.roomNo || 'Room 204'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Leave Category:</span>
                  <span className="font-bold text-blue-900">{data?.leaveType || 'Weekend Home Outing'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Departure Timestamp:</span>
                  <span className="font-mono text-slate-800">{data?.departureDate || '2024-09-13 (04:30 PM)'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Expected Return Time:</span>
                  <span className="font-mono font-bold text-amber-700">{data?.expectedReturnDate || '2024-09-15 (07:00 PM)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination Address:</span>
                  <span className="text-slate-800 text-right max-w-[200px]">{data?.destinationAddress || 'DHA Phase 3, Lahore'}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between items-end text-[10px] text-slate-500">
                <div>Parent Verification: <strong className="text-emerald-700">VERIFIED VIA CALL</strong></div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-28 pt-1 text-slate-700 font-bold">Hostel Warden Seal</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 12. LIBRARY BOOK ACCESSION TAG & BARCODE SPINE LABEL      */}
          {/* ========================================================= */}
          {type === 'book_barcode_label' && (
            <div className="w-full max-w-sm bg-white p-5 rounded-xl border-2 border-slate-900 space-y-3 text-xs font-sans shadow-md text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                THE EDUCATORS CENTRAL LIBRARY
              </div>
              <div className="font-black text-sm text-[#002147]">
                {data?.title || 'Oxford Secondary Science for Pakistan'}
              </div>
              <div className="text-[11px] text-slate-600 font-serif">
                {data?.titleUrdu}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 font-mono space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  ACCESSION: {data?.accessionNo || 'LIB-2024-0101'}
                </div>
                <div className="text-[10px] text-slate-500">
                  SHELF: {data?.shelfLocation || 'Rack S1 - Shelf 3'}
                </div>
                <div className="text-[10px] text-slate-500">
                  ISBN: {data?.isbn || '978-0199068212'}
                </div>
              </div>

              <div className="pt-2">
                <div className="h-10 bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center tracking-widest rounded">
                  ||||| | |||| ||| ||||||| ||| |||
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  *{data?.barcode || '9780199068212'}*
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 13. HOUSE MERIT & SPORTS DISTINCTION CERTIFICATE         */}
          {/* ========================================================= */}
          {type === 'house_merit_certificate' && (
            <div className="w-full max-w-2xl bg-[#fdfbf7] p-8 rounded-xl border-8 border-double border-amber-600 space-y-4 text-center text-slate-900 shadow-md">
              <div className="space-y-1 border-b-2 border-amber-600/50 pb-3">
                <div className="text-xl font-serif font-black text-[#002147] uppercase tracking-wider">
                  THE EDUCATORS
                </div>
                <div className="text-[10px] text-amber-700 font-bold uppercase tracking-widest">
                  ANNUAL HOUSE CHAMPIONSHIP &amp; SPORTS OLYMPIAD
                </div>
                <div className="text-sm font-serif font-bold text-amber-900 italic">
                  Certificate of Sportsmanship &amp; House Merit
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs leading-relaxed">
                <p>This prestigious award is proudly conferred upon</p>
                <div className="text-xl font-serif font-black text-[#002147] border-b-2 border-slate-400 inline-block px-8 py-0.5">
                  {data?.studentName || 'Hamza Aslam'}
                </div>
                <p>
                  representing <strong>{data?.houseName || 'Jinnah House (Eagles)'}</strong> for distinguished excellence in:
                </p>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 font-bold text-sm inline-block">
                  🏆 {data?.category || 'Inter-House Annual Cricket Championship Distinction'}
                </div>
                <p className="text-slate-600 text-[11px]">
                  In recognition of steadfast dedication, discipline, teamwork, and upholding the timeless motto of the House.
                </p>
              </div>

              <div className="pt-6 border-t-2 border-amber-600/40 flex justify-between items-end text-xs text-slate-800">
                <div className="text-center">
                  <div className="font-mono text-[10px] text-slate-500">{data?.date || '2024-09-20'}</div>
                  <div className="border-t border-slate-400 w-32 pt-1 font-bold">Date of Concurrence</div>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center font-bold text-[9px] text-amber-800 uppercase tracking-tighter shadow-inner">
                  OFFICIAL SEAL
                </div>
                <div className="text-center">
                  <div className="font-bold text-[11px] text-[#002147]">{data?.issuedBy || 'Sir Tariq Mahmood'}</div>
                  <div className="border-t border-slate-400 w-36 pt-1 font-bold">Principal / House Master</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 14. CAMPUS MEDICAL & FITNESS CERTIFICATE                  */}
          {/* ========================================================= */}
          {type === 'medical_fitness_certificate' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-emerald-800 space-y-4 text-slate-900 shadow-md">
              <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-3">
                <div className="text-lg font-black text-emerald-900 uppercase tracking-wider">
                  THE EDUCATORS CAMPUS INFIRMARY &amp; HEALTH DIRECTORATE
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Comprehensive Student Health &amp; Physical Fitness Record
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><strong>Student Name:</strong> {data?.studentName || 'Hamza Aslam'}</div>
                <div><strong>Class &amp; Section:</strong> {data?.className || 'Class One (A)'}</div>
                <div><strong>Blood Group:</strong> <span className="font-mono font-bold text-rose-700">{data?.bloodGroup || 'B+'}</span></div>
                <div><strong>BMI Index:</strong> {data?.bmi || '16.4'} (Normal Range)</div>
                <div><strong>Height / Weight:</strong> {data?.heightCm || 122} cm / {data?.weightKg || 24.5} kg</div>
                <div><strong>Date of Examination:</strong> {data?.date || '2024-09-20'}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="font-bold text-emerald-900">Physician Clinical Assessment:</div>
                  <p className="text-slate-800 mt-1">
                    {data?.doctorNotes || 'Student is medically fit for sports, academic activities, and physical education routines. Immunizations are verified.'}
                  </p>
                  {data?.allergies && (
                    <div className="mt-2 text-rose-800 font-semibold">
                      Known Allergies / Alerts: {data.allergies}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t flex justify-between items-end text-xs text-slate-700">
                <div>
                  <div>License: PMDC #48291-P</div>
                  <div className="font-mono text-[10px] text-slate-500">Ref: {data?.visitNo || 'MED-2024-098'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900">{data?.doctorName || 'Dr. Shahida Parveen (Medical Officer)'}</div>
                  <div className="border-t border-slate-400 w-44 pt-1 font-semibold">Attending Doctor / Nurse Seal</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 15. LAB ASSET BARCODE TAG & CALIBRATION INSPECTION SLIP   */}
          {/* ========================================================= */}
          {type === 'lab_asset_tag' && (
            <div className="w-full max-w-sm bg-white p-5 rounded-xl border-2 border-slate-900 space-y-3 text-xs font-sans shadow-md text-center">
              <div className="text-[10px] font-bold text-cyan-900 uppercase tracking-widest">
                THE EDUCATORS SCIENCE &amp; IT LABS
              </div>
              <div className="font-black text-sm text-[#002147]">
                {data?.itemName || 'Vernier Calipers (0.01cm LC)'}
              </div>
              <div className="text-[11px] text-slate-600">
                {data?.labType || 'Physics Lab'} • {data?.rackLocation || 'Cabinet A'}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 font-mono space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  ASSET CODE: {data?.assetCode || 'LAB-PHY-001'}
                </div>
                <div className="text-[10px] text-slate-500">
                  INCHARGE: {data?.inCharge || 'Sir Tariq Jamil'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  PCSIR CALIBRATION: VERIFIED COMPLIANT
                </div>
              </div>

              <div className="pt-2">
                <div className="h-10 bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center tracking-widest rounded">
                  ||||| ||| |||| | |||||| |||| | |||
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  *{data?.assetCode || 'LAB-PHY-001'}*
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 16. FORMAL TERMINAL EXAM QUESTION PAPER                   */}
          {/* ========================================================= */}
          {type === 'formal_exam_paper' && (
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl border-2 border-slate-900 space-y-5 text-slate-900 shadow-md">
              <div className="text-center space-y-2 border-b-2 border-slate-900 pb-3">
                <div className="text-base font-serif font-bold text-slate-800">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <div className="text-lg font-black text-[#002147] uppercase tracking-wider">
                  THE EDUCATORS (A PROJECT OF BEACONHOUSE)
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {data?.examTitle || 'Annual Terminal Examination 2024'}
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs font-bold pt-2 border-t border-slate-300">
                  <div>Class: {data?.className || 'Class 9'}</div>
                  <div>Subject: {data?.subject || 'Physics'}</div>
                  <div>Total Marks: {data?.totalMarks || 60}</div>
                  <div>Time: {data?.allowedTimeMinutes || 120} Mins</div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {data?.sections?.map((sec: any, sIdx: number) => (
                  <div key={sIdx} className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between font-black text-slate-900 bg-slate-100 p-2 rounded">
                      <span>{sec.sectionName}</span>
                      <span>[{sec.sectionMarks} Marks]</span>
                    </div>
                    <div className="italic text-slate-600 pl-1">{sec.instructions}</div>
                    <div className="space-y-2 pl-1 pt-1">
                      {sec.questions?.map((q: any) => (
                        <div key={q.questionNo} className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <div><strong>Q{q.questionNo}.</strong> {q.text}</div>
                            {q.textUrdu && (
                              <div className="font-serif text-right text-slate-700 dir-rtl">{q.textUrdu}</div>
                            )}
                            {q.options && (
                              <div className="grid grid-cols-4 gap-2 pl-4 pt-1 font-mono text-[11px]">
                                {q.options.map((opt: string, oIdx: number) => (
                                  <div key={oIdx}>({String.fromCharCode(65 + oIdx)}) {opt}</div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="font-mono font-bold text-slate-600">({q.marks})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-center text-xs font-bold text-slate-800">
                <div>Prepared: {data?.preparedBy || 'Academic Faculty'}</div>
                <div>Controller of Examinations</div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 17. OFFICIAL PROVISIONAL ADMISSION OFFER LETTER           */}
          {/* ========================================================= */}
          {type === 'admission_offer_letter' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-4 border-[#002147] space-y-6 text-slate-900 shadow-md">
              <div className="text-center space-y-1.5 border-b-2 border-slate-300 pb-4">
                <div className="text-xl font-black text-[#002147] uppercase tracking-wider">
                  THE EDUCATORS (A PROJECT OF BEACONHOUSE)
                </div>
                <div className="text-xs font-bold text-teal-800 tracking-widest uppercase">
                  DIRECTORATE OF ADMISSIONS &amp; STUDENT ENROLMENT
                </div>
                <div className="text-[11px] text-slate-500">
                  Ref No: EDU/ADM-OFFER/2024/{data?.applicationNo || '901'} • Date: {data?.testDate || '2024-09-20'}
                </div>
              </div>

              <div className="text-center py-2 bg-teal-50 border border-teal-200 rounded-lg">
                <h3 className="text-base font-black text-teal-950 uppercase tracking-wide">
                  OFFICIAL PROVISIONAL ADMISSION OFFER LETTER (SESSION 2024-2025)
                </h3>
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-slate-800">
                <p>
                  Dear Mr. / Mrs. <strong>{data?.fatherName || 'Parent / Guardian'}</strong>,
                </p>
                <p>
                  We are pleased to inform you that your child, <strong>{data?.candidateName}</strong>, has successfully qualified the institutional entrance assessment and has been offered provisional admission in <strong>{data?.intendedClass}</strong> on the basis of <strong>{data?.quotaCategory || 'Open Merit'}</strong>.
                </p>

                {/* Candidate Academic Scorecard */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-[11px] uppercase border-b pb-1">
                    Entrance Assessment Scorecard &amp; Standing
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-slate-500 text-[10px]">Written (100)</div>
                      <div className="font-bold text-slate-900">{data?.writtenMarks?.totalWritten || 93}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Interview (30)</div>
                      <div className="font-bold text-slate-900">{data?.interviewMarks?.totalInterview || 28}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Merit Rank</div>
                      <div className="font-bold text-teal-800">Rank #{data?.meritRank || 1}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Aggregate %</div>
                      <div className="font-mono font-black text-teal-900">{data?.aggregatePercentage || 93.1}%</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] space-y-1 text-amber-900">
                  <strong className="block">Mandatory Enrolment Next Steps:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Deposit admission fee voucher at designated Allied Bank / MCB / HBL branch within 5 banking days.</li>
                    <li>Submit original School Leaving Certificate (SLC) &amp; NADRA B-Form copy to the campus registrar office.</li>
                    <li>Collect uniform and textbook bundle from the campus book store.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div className="text-center">
                  <div className="font-bold text-slate-900">Admission Coordinator</div>
                  <div className="text-[10px] text-slate-500">The Educators Admissions</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-[10px] text-slate-400 font-bold mx-auto mb-1">
                    OFFICIAL SEAL
                  </div>
                  <div className="text-[10px] text-slate-500">Main Campus Lahore</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900">Campus Principal</div>
                  <div className="text-[10px] text-slate-500">The Educators (Beaconhouse)</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 18. TEACHER CPD TRAINING CERTIFICATE                      */}
          {/* ========================================================= */}
          {type === 'teacher_cpd_certificate' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-8 border-indigo-900 space-y-6 text-slate-900 shadow-md">
              <div className="text-center space-y-2 border-b-2 border-indigo-900 pb-4">
                <div className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
                  BEACONHOUSE STAFF DEVELOPMENT CENTER
                </div>
                <div className="text-2xl font-black text-indigo-950 uppercase tracking-wider">
                  CERTIFICATE OF PROFESSIONAL DEVELOPMENT
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Accredited by Punjab Education Foundation &amp; British Council
                </div>
              </div>

              <div className="text-center space-y-4 text-xs leading-relaxed text-slate-800">
                <p className="italic text-sm text-slate-600">This is to officially certify that</p>
                <div className="text-xl font-black text-indigo-900 border-b-2 border-dotted border-indigo-400 pb-1 max-w-sm mx-auto">
                  {data?.staffName || 'Sir Tariq Jamil'}
                </div>
                <p className="text-slate-700">
                  has successfully completed the intensive professional training program on:
                </p>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-sm text-indigo-950">
                  {data?.training?.moduleTitle || 'Single National Curriculum (SNC) & SLO-Based Assessment Mastery'}
                </div>
                <p className="text-slate-600 text-[11px]">
                  comprising <strong>{data?.training?.durationHours || 16} Credit Hours</strong> of pedagogical theory, micro-teaching simulation, and classroom assessment rubrics conducted on {data?.training?.date || '2024-09-28'}.
                </p>
              </div>

              <div className="pt-8 border-t-2 border-indigo-900 flex justify-between items-end text-xs">
                <div className="text-center">
                  <div className="font-bold text-slate-900">{data?.training?.trainerName || 'Dr. Shahbaz Cheema'}</div>
                  <div className="text-[10px] text-slate-500">Lead Master Trainer</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-indigo-800 rounded-full flex items-center justify-center text-[9px] text-indigo-900 font-bold mx-auto mb-1 bg-indigo-50">
                    ACCREDITED
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900">Director Academics</div>
                  <div className="text-[10px] text-slate-500">The Educators Head Office</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 19. OFFICIAL PTM EVALUATION & AGREEMENT SLIP              */}
          {/* ========================================================= */}
          {type === 'ptm_evaluation_slip' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-emerald-900 space-y-5 text-slate-900 shadow-md">
              <div className="text-center space-y-1 border-b-2 border-emerald-900 pb-3">
                <div className="text-lg font-black text-[#002147] uppercase tracking-wider">
                  THE EDUCATORS (A PROJECT OF BEACONHOUSE)
                </div>
                <div className="text-xs font-bold text-emerald-800 uppercase">
                  PARENT-TEACHER MEETING (PTM) ACADEMIC &amp; CONDUCT EVALUATION
                </div>
                <div className="text-[10px] text-slate-500">Term: First Term Evaluation 2024-2025</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border">
                <div><strong>Student Name:</strong> {data?.studentName}</div>
                <div><strong>Class &amp; Section:</strong> {data?.className} (Roll No: {data?.rollNo})</div>
                <div><strong>Parent / Guardian:</strong> {data?.parentName} ({data?.parentContact})</div>
                <div><strong>Teacher Incharge:</strong> {data?.teacherName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Academic Standing</span>
                  <div className="text-base font-black text-emerald-950 mt-0.5">{data?.academicProgressRating || 'Excellent'}</div>
                  <div className="text-[11px] text-slate-600 mt-1">{data?.attendanceComment}</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">Behavioral Conduct</span>
                  <div className="text-base font-black text-teal-950 mt-0.5">{data?.behavioralConductRating || 'Exemplary'}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Punctual &amp; Active Learner</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded border">
                  <strong>Teacher's Notes:</strong> {data?.teacherNotes}
                </div>
                <div className="p-2.5 bg-slate-50 rounded border">
                  <strong>Parent Feedback / Concern:</strong> {data?.parentRequests}
                </div>
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                  <strong>Mutual Agreed Action Plan:</strong> {data?.actionPlan}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-center text-xs">
                <div className="text-center">
                  <div className="font-bold text-slate-800">Class Teacher Signature</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800">Parent / Guardian Signature</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800">Campus Section Head</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 20. ALUMNI RECOMMENDATION LETTER                          */}
          {/* ========================================================= */}
          {type === 'alumni_recommendation_letter' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-cyan-900 space-y-6 text-slate-900 shadow-md">
              <div className="text-center space-y-1.5 border-b-2 border-cyan-900 pb-4">
                <div className="text-xl font-black text-[#002147] uppercase tracking-wider">
                  THE EDUCATORS (A PROJECT OF BEACONHOUSE)
                </div>
                <div className="text-xs font-bold text-cyan-800 uppercase tracking-widest">
                  OFFICE OF THE PRINCIPAL &amp; CAREER COUNSELING DIRECTORATE
                </div>
                <div className="text-[10px] text-slate-500">Ref: EDU/REC-ALM/2024/049 • Confidential</div>
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-slate-800">
                <p><strong>TO WHOM IT MAY CONCERN / ADMISSIONS COMMITTEE</strong></p>
                <p>
                  It gives me immense pleasure to write this letter of institutional recommendation for <strong>{data?.name}</strong> (Alumni Code: <strong>{data?.alumniCode || 'ALM-2021-012'}</strong>), who completed their <strong>{data?.programCompleted || 'Matric (Science)'}</strong> from The Educators with distinction, scoring <strong>{data?.boardMarks || '1068/1100 (97.1%)'}</strong> in Board of Intermediate &amp; Secondary Education (BISE) examinations.
                </p>
                <p>
                  During their tenure at our institution, {data?.name} displayed exceptional intellectual maturity, scientific curiosity, and exemplary ethical character. Their analytical foundations, leadership within student societies, and academic consistency were of the highest calibre.
                </p>
                <p>
                  Currently enrolled / positioned in <strong>{data?.currentUniversityOrInstitution}</strong> pursuing <strong>{data?.degreeProgram}</strong>, we have the utmost confidence that {data?.name} will excel in higher studies, research fellowships, and professional responsibilities.
                </p>
                <p>We recommend them without reservation.</p>
              </div>

              <div className="pt-10 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold text-slate-900">Prof. Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Principal &amp; Senior Academic Director</div>
                  <div className="text-[10px] text-slate-400">The Educators (Beaconhouse System)</div>
                </div>
                <div className="w-20 h-20 border-2 border-dashed border-cyan-700 rounded-full flex items-center justify-center text-[10px] text-cyan-800 font-bold">
                  PRINCIPAL SEAL
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 21. SPORTS GALA & NATIONAL OLYMPIAD WINNER CERTIFICATE     */}
          {/* ========================================================= */}
          {type === 'sports_winner_certificate' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-4 border-amber-600 space-y-6 text-slate-900 shadow-md text-center">
              <div className="space-y-1 border-b-2 border-amber-600 pb-3">
                <div className="text-xl font-black text-[#002147] tracking-wider uppercase">
                  THE EDUCATORS (A PROJECT OF BEACONHOUSE)
                </div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  DIRECTORATE OF PHYSICAL EDUCATION &amp; NATIONAL OLYMPIADS
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Ref: EDU/SPO-OLY/2024/{data?.eventCode || 'SPO-001'}</div>
              </div>

              <div className="space-y-2 py-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  Certificate of Athletic / Academic Distinction
                </div>
                <div className="text-xl font-black text-amber-900 underline decoration-amber-500 underline-offset-4">
                  {data?.goldWinner?.name || 'Muhammad Bilal'}
                </div>
                <div className="text-xs text-slate-700">
                  representing <strong>{data?.goldWinner?.houseOrSchool || 'Jinnah House'}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                has secured <strong>1st Place (Gold Medal)</strong> in the prestigious event:
                <br />
                <span className="font-bold text-sm text-[#002147] block mt-1">
                  "{data?.title || 'Annual 100m Sprint Championship'}"
                </span>
                with an outstanding record of <strong>{data?.goldWinner?.scoreOrRecord || '11.42s'}</strong> at the{' '}
                {data?.venue || 'Main Campus Stadium'} on {data?.date || 'October 2024'}.
              </p>

              <div className="pt-8 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div className="text-left">
                  <div className="font-bold text-slate-900">{data?.officialJudge || 'Coach Shaukat Hayat'}</div>
                  <div className="text-[10px] text-slate-500">Official Chief Referee / Judge</div>
                </div>
                <div className="w-16 h-16 border-2 border-amber-600 rounded-full flex items-center justify-center font-bold text-amber-700 text-[10px]">
                  GOLD SEAL
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">Principal Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Institutional Head</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 22. PROCUREMENT PURCHASE ORDER & 3-WAY COMPARATIVE PO       */}
          {/* ========================================================= */}
          {type === 'procurement_purchase_order' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-slate-800 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE SYSTEM)
                  </div>
                  <div className="text-xs font-bold text-slate-700">CENTRAL PROCUREMENT &amp; STORES ERP</div>
                  <div className="text-[10px] text-slate-500">Official Purchase Order (PO) &amp; Vendor Award</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-blue-900 text-sm">
                    {data?.poNumber || 'PO-2024-088'}
                  </div>
                  <div className="text-[10px] text-slate-500">PR Ref: {data?.prNumber}</div>
                  <div className="text-[10px] text-slate-500">Date: {data?.requestDate || '2024-09-20'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Awarded Vendor Details:</div>
                  <div className="font-bold text-sm text-slate-900">
                    {data?.quotations?.[0]?.vendorName || 'Scientific Supplies Corp'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Delivery SLA: {data?.quotations?.[0]?.deliveryDays || 5} Business Days
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Warranty: {data?.quotations?.[0]?.warrantyTerms || '2 Years Replacement'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Requisitioning Department:</div>
                  <div className="font-bold text-slate-900">{data?.department || 'Science Labs'}</div>
                  <div className="text-[11px] text-slate-600">Requisitioner: {data?.requestedBy}</div>
                  <div className="text-[11px] text-slate-600">Purpose: {data?.purpose}</div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr className="border-b border-slate-300">
                      <th className="p-2 border-r border-slate-300">Item Description</th>
                      <th className="p-2 border-r border-slate-300">Specifications</th>
                      <th className="p-2 border-r border-slate-300 text-center">Qty</th>
                      <th className="p-2 text-right">Total Quoted (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.itemsList || [
                      { itemName: 'Laboratory Compound Microscopes', specification: '1000x Oil immersion LED', quantity: 6, unit: 'Units' }
                    ]).map((item: any, i: number) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 font-bold">{item.itemName}</td>
                        <td className="p-2 border-r border-slate-200 text-slate-600 text-[11px]">{item.specification}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-bold">{item.quantity} {item.unit}</td>
                        <td className="p-2 text-right font-black">
                          PKR {(data?.quotations?.[0]?.quotedTotal || data?.estimatedCost || 275000).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-900">
                <strong>Approval Remark:</strong> {data?.approverComments || 'Approved on lowest evaluated responsive quotation by Finance Committee.'}
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end">
                <div>
                  <div className="font-bold">Accounts &amp; Stores Officer</div>
                  <div className="text-[10px] text-slate-500">Finance Directorate</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Principal / Campus Director</div>
                  <div className="text-[10px] text-slate-500">Authorized Signatory</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 23. CAMPUS QUALITY AUDIT & ACCREDITATION DOSSIER           */}
          {/* ========================================================= */}
          {type === 'executive_audit_report' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-indigo-900 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS CENTRAL QUALITY ASSURANCE
                  </div>
                  <div className="text-xs font-bold text-indigo-900">
                    INSTITUTIONAL PERFORMANCE &amp; ACCREDITATION AUDIT
                  </div>
                  <div className="text-[10px] text-slate-500">Academic Year 2024–2025 Comprehensive Assessment</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-950 font-black rounded-lg text-sm">
                    Grade: {data?.gradeCategory || 'A+ (Exemplary)'}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Score: {data?.overallQualityScore || 96.2} / 100</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border">
                <div className="font-bold text-sm text-slate-900">{data?.campusName || 'Main Campus Lahore'}</div>
                <div className="text-slate-600 text-[11px]">
                  Campus Code: <strong>{data?.campusCode || 'LHR-MAIN'}</strong> • Total Enrolled Learners:{' '}
                  <strong>{data?.totalStudents || 1420}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-white rounded border space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">BISE Board Pass Rate</div>
                  <div className="font-black text-base text-emerald-700">{data?.biseBoardPassRate || 98.8}%</div>
                  <div className="text-[10px] text-slate-500">Standard: &gt;95% Metric achieved</div>
                </div>
                <div className="p-2.5 bg-white rounded border space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Fee Recovery Realization</div>
                  <div className="font-black text-base text-blue-700">{data?.feeRecoveryRate || 95.4}%</div>
                  <div className="text-[10px] text-slate-500">Cash-flow compliance verified</div>
                </div>
                <div className="p-2.5 bg-white rounded border space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">PTM Satisfaction Index</div>
                  <div className="font-black text-base text-indigo-700">{data?.ptmSatisfactionIndex || 4.85} / 5.0</div>
                  <div className="text-[10px] text-slate-500">Evaluated across all parent feedback slips</div>
                </div>
                <div className="p-2.5 bg-white rounded border space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Faculty Attendance Rate</div>
                  <div className="font-black text-base text-teal-700">{data?.teacherAttendanceRate || 98.1}%</div>
                  <div className="text-[10px] text-slate-500">Biometric time and substitution audit</div>
                </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-300 flex justify-between items-end">
                <div>
                  <div className="font-bold">Director Quality Assurance</div>
                  <div className="text-[10px] text-slate-500">Beaconhouse Central Academic Board</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Chief Executive Officer (CEO)</div>
                  <div className="text-[10px] text-slate-500">The Educators Pakistan Network</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 24. LMS COURSE COMPLETION & SLO MASTERY CERTIFICATE        */}
          {/* ========================================================= */}
          {type === 'lms_course_completion_certificate' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-4 border-blue-900 space-y-6 text-slate-900 shadow-md text-center">
              <div className="space-y-1 border-b-2 border-blue-900 pb-3">
                <div className="text-xl font-black text-[#002147] tracking-wider uppercase">
                  THE EDUCATORS DIGITAL LEARNING ACADEMY
                </div>
                <div className="text-xs font-bold text-blue-800 uppercase tracking-widest">
                  SINGLE NATIONAL CURRICULUM (SNC) E-LEARNING CERTIFICATION
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Certificate ID: {data?.id || 'LMS-CERT-2024-001'}</div>
              </div>

              <div className="space-y-2 py-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  This is to certify that
                </div>
                <div className="text-xl font-black text-[#002147] underline decoration-blue-500 underline-offset-4">
                  {data?.studentName || 'Hamza Aslam'}
                </div>
                <div className="text-xs text-slate-700">
                  Class: <strong>{data?.className || 'Class 9 (Science)'}</strong> (Roll #{data?.rollNo || '01'})
                </div>
              </div>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                has successfully completed all digital lecture modules and demonstrated objective mastery in the Single National Curriculum (SNC) benchmark assessment for course:
                <br />
                <span className="font-bold text-sm text-blue-900 block mt-1">
                  "{data?.courseCode || 'SNC-PHY-901'}: Advanced Kinematics &amp; Motion Analysis"
                </span>
                with an outstanding score of <strong>{data?.percentage || 90}% ({data?.correctAnswers || 9}/{data?.totalQuestions || 10} Correct)</strong>.
              </p>

              <div className="pt-8 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div className="text-left">
                  <div className="font-bold text-slate-900">Lead Master Instructor</div>
                  <div className="text-[10px] text-slate-500">Digital Curriculum Faculty</div>
                </div>
                <div className="w-16 h-16 border-2 border-blue-800 rounded-full flex items-center justify-center font-bold text-blue-900 text-[10px]">
                  ACCREDITED
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">Prof. Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Principal &amp; Director of Studies</div>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================= */}
          {/* 25. PARENT HELPDESK INQUIRY & SLA RESOLUTION DOSSIER       */}
          {/* ========================================================= */}
          {type === 'helpdesk_grievance_dossier' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-indigo-950 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-indigo-950 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE SYSTEM)
                  </div>
                  <div className="text-xs font-bold text-indigo-900">
                    PARENT HELPDESK &amp; CITIZEN CHARTER GRIEVANCE DOSSIER
                  </div>
                  <div className="text-[10px] text-slate-500">Official Dispute Resolution &amp; Escalation Record</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-indigo-950 text-sm">
                    {data?.ticketNumber || 'TKT-8941'}
                  </div>
                  <div className="text-[10px] text-slate-500">Priority: {data?.priority}</div>
                  <div className="text-[10px] text-slate-500">Date Logged: {data?.createdAt}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Complainant / Guardian:</div>
                  <div className="font-bold text-sm text-slate-900">{data?.parentName}</div>
                  <div className="text-[11px] text-slate-600">Phone: {data?.parentPhone}</div>
                  <div className="text-[11px] text-slate-600">
                    Student: <strong>{data?.studentName}</strong> ({data?.className} - Roll #{data?.studentRollNo})
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Assigned Directorate:</div>
                  <div className="font-bold text-sm text-indigo-900">{data?.assignedDepartment}</div>
                  <div className="text-[11px] text-slate-600">Case Officer: {data?.assignedOfficer}</div>
                  <div className="text-[11px] text-slate-600">SLA Target: {data?.slaDeadline}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900">Subject: {data?.subject}</div>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  {data?.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Case Investigation &amp; Resolution Actions:
                </div>
                <div className="space-y-1.5">
                  {(data?.messages || []).map((m: any, idx: number) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span className="text-slate-400 font-normal">{m.timestamp}</span>
                      </div>
                      <div className="text-slate-700 mt-0.5">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {data?.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-semibold text-[11px]">
                  <strong>Final Resolution Summary:</strong> {data.resolutionNotes}
                </div>
              )}

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">{data?.assignedOfficer || 'Helpdesk Officer'}</div>
                  <div className="text-[10px] text-slate-500">Case Lead Signatory</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Principal Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Director of Campus Administration</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 26. MASTER CLASS WEEKLY TIMETABLE SCHEDULE                */}
          {/* ========================================================= */}
          {type === 'master_class_timetable' && (
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl border-2 border-slate-900 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE NETWORK)
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    ACADEMIC MASTER TIMETABLE &amp; FACULTY ROOM ALLOCATION
                  </div>
                  <div className="text-[10px] text-slate-500">Academic Session 2024–2025 • Punjab BISE Curriculum Alignment</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-950 text-sm">
                    {data?.className || 'Class 9-A (Science)'}
                  </div>
                  <div className="text-[10px] text-slate-500">Room: {data?.roomNumber || 'Room 204'}</div>
                  <div className="text-[10px] text-slate-500">Class In-charge: {data?.classTeacher}</div>
                </div>
              </div>

              <div className="space-y-4">
                {(data?.days || []).map((day: any, dIdx: number) => (
                  <div key={dIdx} className="space-y-1">
                    <div className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-[11px] uppercase tracking-wider flex justify-between">
                      <span>{day.dayName}</span>
                      <span className="text-[10px] text-slate-500 font-normal">7 Teaching Periods + 1 Practical/Break</span>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5 text-[10px]">
                      {(day.periods || []).map((p: any, pIdx: number) => (
                        <div key={pIdx} className="p-1.5 border rounded bg-slate-50 space-y-0.5">
                          <div className="font-bold text-slate-900 truncate">{p.subjectName}</div>
                          <div className="text-slate-600 truncate">{p.teacherName}</div>
                          <div className="text-[9px] text-cyan-800 font-mono">{p.roomOrLab}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">Academic Coordinator</div>
                  <div className="text-[10px] text-slate-500">Time-Table Directorate</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-600">SMART SUBSTITUTION VERIFIED</div>
                  <div className="text-[9px] text-slate-400"> पंजाब स्कूल शिक्षा बोर्ड / BISE</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Prof. Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Principal &amp; Director of Studies</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 27. CAMPUS FACILITY WORK ORDER & JOB CARD                 */}
          {/* ========================================================= */}
          {type === 'facility_work_order' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-amber-950 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-amber-950 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE NETWORK)
                  </div>
                  <div className="text-xs font-bold text-amber-900">
                    CAMPUS FACILITY MAINTENANCE WORK ORDER &amp; JOB CARD
                  </div>
                  <div className="text-[10px] text-slate-500">Computerized Maintenance Management System (CMMS)</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-amber-950 text-sm">
                    {data?.workOrderNumber || 'WO-2024-089'}
                  </div>
                  <div className="text-[10px] text-slate-500">Priority: {data?.priority}</div>
                  <div className="text-[10px] text-slate-500">Date: {data?.reportedAt}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Category &amp; Location:</div>
                  <div className="font-bold text-sm text-slate-900">{data?.category}</div>
                  <div className="text-[11px] text-slate-600">{data?.location}</div>
                  <div className="text-[11px] text-slate-600">Reported By: <strong>{data?.reportedBy}</strong></div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Assigned Specialist Tech:</div>
                  <div className="font-bold text-sm text-amber-900">{data?.assignedTechnician}</div>
                  <div className="text-[11px] text-slate-600">Status: <strong>{data?.status}</strong></div>
                  <div className="text-[11px] text-slate-600">
                    Est Budget: <strong>Rs. {data?.estimatedCostPkr?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900">Problem Summary / Scope of Work:</div>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  {data?.problemSummary}
                </p>
              </div>

              {data?.materialsUsed && data.materialsUsed.length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-[11px] uppercase">Requisitioned Parts &amp; Consumables:</div>
                  <ul className="list-disc list-inside bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-700 space-y-0.5">
                    {data.materialsUsed.map((mat: string, idx: number) => (
                      <li key={idx}>{mat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data?.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                  <strong>Technician Resolution &amp; Safety Compliance:</strong> {data.resolutionNotes}
                </div>
              )}

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">{data?.assignedTechnician || 'Master Electrician'}</div>
                  <div className="text-[10px] text-slate-500">Assigned Technician Sign</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Subedar (R) Farooq</div>
                  <div className="text-[10px] text-slate-500">Director of Campus Facilities</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 28. SCHOOL FLEET VEHICLE SAFETY & FITNESS DOSSIER          */}
          {/* ========================================================= */}
          {type === 'fleet_vehicle_dossier' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-blue-950 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-blue-950 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE SYSTEM)
                  </div>
                  <div className="text-xs font-bold text-blue-900">
                    CAMPUS TRANSPORT FLEET SAFETY &amp; FITNESS AUDIT DOSSIER
                  </div>
                  <div className="text-[10px] text-slate-500">Motor Transport Wing • Safety &amp; GPS Telemetry Record</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-blue-950 text-base">
                    {data?.vehicleNumber || 'LEA-2021-9844'}
                  </div>
                  <div className="text-[10px] text-slate-500">{data?.vehicleType}</div>
                  <div className="text-[10px] text-slate-500">Fitness: {data?.fitnessCertificateExpiry}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Assigned Transport Route:</div>
                  <div className="font-bold text-sm text-slate-900">{data?.routeAssigned}</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Driver: <strong>{data?.driverName}</strong> ({data?.driverPhone})
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Telemetry &amp; Fuel Compliance:</div>
                  <div className="text-[11px] text-slate-700">Odometer: <strong>{data?.currentOdometerKm?.toLocaleString()} km</strong></div>
                  <div className="text-[11px] text-slate-700">Efficiency: <strong>{data?.fuelEfficiencyKmPerLiter} km/L</strong></div>
                  <div className="text-[11px] text-emerald-800 font-bold">Safety Rating: {data?.safetyRating}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-950 space-y-1">
                <div className="font-bold">Safety Equipment Inspection Checklist:</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>✓ Dry Chemical Powder Fire Extinguisher (Inspected)</div>
                  <div>✓ First Aid Trauma Medical Kit (Stocked)</div>
                  <div>✓ Emergency Exit Window Latches (Functional)</div>
                  <div>✓ GPS Live Tracker &amp; Speed Limiter 50 km/h (Active)</div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">{data?.driverName || 'Vehicle Driver'}</div>
                  <div className="text-[10px] text-slate-500">Designated Fleet Pilot</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Subedar (R) Farooq</div>
                  <div className="text-[10px] text-slate-500">Head of Transport &amp; Security Operations</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 29. BOARDING HOSTEL ROOM BED ALLOTMENT & CLEARANCE DOSSIER  */}
          {/* ========================================================= */}
          {type === 'hostel_room_dossier' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-emerald-950 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-emerald-950 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE NETWORK)
                  </div>
                  <div className="text-xs font-bold text-emerald-900">
                    BOARDING HOSTEL BED ALLOTMENT &amp; RESIDENTIAL DOSSIER
                  </div>
                  <div className="text-[10px] text-slate-500">Residential Boarding Wing • House Master Audit</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-950 text-sm">
                    {data?.roomNumber || 'Jinnah Hall - Room 304'}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold">{data?.wingName}</div>
                  <div className="text-[10px] text-slate-500">Grade: {data?.roomInspectionGrade}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">House Warden &amp; Supervision:</div>
                  <div className="font-bold text-sm text-slate-900">{data?.wardenName}</div>
                  <div className="text-[11px] text-slate-600">Monthly Fee: <strong>Rs. {data?.monthlyHostelFeePkr?.toLocaleString()}</strong></div>
                  <div className="text-[11px] text-slate-600">AC System: {data?.airConditioningStatus}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Bed Occupancy:</div>
                  <div className="font-bold text-sm text-emerald-900">
                    {data?.occupiedBeds} / {data?.capacityBeds} Beds Occupied
                  </div>
                  <div className="text-[11px] text-slate-600">Status: Active Residential Clearance</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900">Assigned Boarder Students:</div>
                <div className="p-3 bg-emerald-50/50 rounded border border-emerald-200 text-slate-800 font-bold text-xs space-y-1">
                  {data?.assignedStudentNames?.map((st: string, idx: number) => (
                    <div key={idx} className="flex justify-between border-b border-emerald-200/50 pb-1">
                      <span>• {st}</span>
                      <span className="text-[10px] text-emerald-900 font-normal">Registered Boarder</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">{data?.wardenName || 'House Warden'}</div>
                  <div className="text-[10px] text-slate-500">Resident House Master / Warden</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Prof. Tariq Mahmood</div>
                  <div className="text-[10px] text-slate-500">Chief Superintendent of Boarding Hostels</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 30. BOARDING MESS WEEKLY DIETARY MENU CARD                */}
          {/* ========================================================= */}
          {type === 'mess_menu_card' && (
            <div className="w-full max-w-xl bg-white p-6 rounded-xl border-2 border-amber-950 space-y-4 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-amber-950 pb-2">
                <div>
                  <div className="text-base font-black text-[#002147] uppercase">
                    CAMPUS BOARDING MESS NUTRITION CARD
                  </div>
                  <div className="text-xs font-bold text-amber-900">
                    {data?.dayOfWeek} • {data?.mealType}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-amber-950 text-base">{data?.caloricContentKcal} Kcal</div>
                  <div className="text-[10px] text-emerald-800 font-bold">Halal &amp; Hygiene Certified</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-slate-900 font-bold text-sm">
                {data?.dishItems}
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {data?.dietaryTags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded border font-semibold">
                    ✓ {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-between items-center text-[11px] text-slate-600">
                <div>Chef Incharge: <strong>{data?.chefInCharge}</strong></div>
                <div>Satisfaction Index: <strong>★ {data?.studentSatisfactionRating} / 5.0</strong></div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 31. CAFETERIA & TUCK SHOP POS BARCODE TAG                 */}
          {/* ========================================================= */}
          {type === 'cafeteria_barcode_tag' && (
            <div className="w-full max-w-sm bg-white p-5 rounded-xl border-2 border-slate-900 space-y-3 text-slate-900 shadow-md text-xs">
              <div className="text-center border-b pb-2">
                <div className="font-black text-sm uppercase text-[#002147]">CAMPUS TUCK SHOP POS</div>
                <div className="text-[10px] text-slate-500">Official Retail Price &amp; Barcode Tag</div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-bold text-sm text-slate-900">{data?.itemName}</div>
                <div className="font-mono text-emerald-800 font-black text-xl">Rs. {data?.unitPricePkr}</div>
                <div className="text-[10px] text-slate-500">{data?.category} • Code: {data?.itemCode}</div>
              </div>

              <div className="p-2 bg-slate-100 rounded text-center font-mono font-bold text-slate-700 tracking-widest text-xs border">
                ||||||||||||||||||||||||||||||
                <div className="text-[9px] font-normal">{data?.itemCode}</div>
              </div>

              <div className="text-[10px] text-emerald-800 font-bold text-center">
                ✓ Halal &amp; Quality Inspected
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 32. SNC EXAMINATION PAPER & MARKING SCHEME RUBRIC         */}
          {/* ========================================================= */}
          {type === 'exam_paper_document' && (
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl border-2 border-purple-950 space-y-6 text-slate-900 shadow-md text-xs">
              <div className="text-center border-b-2 border-purple-950 pb-4 space-y-1">
                <div className="text-xl font-black text-[#002147] uppercase tracking-wide">
                  THE EDUCATORS (BEACONHOUSE NETWORK)
                </div>
                <div className="text-sm font-bold text-purple-950">
                  {data?.paperTitle || 'Terminal Examination Question Paper'}
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Subject: <strong>{data?.subject}</strong> | Grade: <strong>{data?.gradeClass}</strong> | Code: <strong className="font-mono text-purple-900">{data?.paperCode}</strong>
                </div>
                <div className="flex justify-center gap-6 pt-1 text-xs font-bold text-slate-800">
                  <span>Total Marks: {data?.totalMarks}</span>
                  <span>•</span>
                  <span>Time Allowed: {data?.durationMinutes} Minutes</span>
                  <span>•</span>
                  <span>Term: {data?.termExamName}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded border border-purple-200 text-[11px] text-purple-950 space-y-1">
                <div className="font-bold uppercase">General Instructions to Candidates:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  <li>Write your Roll Number, Section, and Campus Name clearly on the top right corner of the answer sheet.</li>
                  <li>Overwriting or cutting in Section A (MCQs) will result in zero marks.</li>
                  <li>Calculators are allowed for Physics/Chemistry/Mathematics numerical sections only where specified.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="font-bold text-sm text-[#002147] border-b pb-1 uppercase">
                  Examination Questions:
                </div>
                {data?.questions?.map((q: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded border space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q{idx + 1}. ({q.questionCode}) [{q.marks} Marks]</span>
                      <span className="text-[10px] text-purple-900 font-mono">{q.sloRefCode}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-800">{q.questionText}</div>
                    {q.mcqOptions && q.mcqOptions.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] pl-2 font-medium">
                        {q.mcqOptions.map((opt: string, i: number) => (
                          <div key={i}>({String.fromCharCode(65 + i)}) {opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-950 uppercase">Confidential Teacher Marking Scheme &amp; Rubric:</div>
                <div className="text-emerald-900 font-medium">{data?.markingSchemeRubric}</div>
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">Prof. Arshad Mahmood</div>
                  <div className="text-[10px] text-slate-500">Controller of Examinations • Beaconhouse Network</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Subject HOD Signature</div>
                  <div className="text-[10px] text-slate-500">Quality Assurance Academic Audit</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 33. QUESTION ITEM CARD & MODEL SOLUTION                    */}
          {/* ========================================================= */}
          {type === 'question_item_card' && (
            <div className="w-full max-w-xl bg-white p-6 rounded-xl border-2 border-purple-950 space-y-4 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-purple-950 pb-2">
                <div>
                  <div className="text-base font-black text-[#002147] uppercase">SNC QUESTION MASTER ITEM</div>
                  <div className="text-xs font-bold text-purple-900">{data?.subject} • {data?.gradeClass}</div>
                  <div className="text-[10px] text-slate-500">{data?.chapterTopic}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-purple-950 text-sm">{data?.questionCode}</div>
                  <div className="text-[10px] text-emerald-800 font-bold">{data?.marks} Marks • {data?.difficultyLevel}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border font-semibold text-slate-900 text-xs">
                {data?.questionText}
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-slate-900 text-xs space-y-1">
                <div className="font-bold text-emerald-950">Model Answer &amp; Solution:</div>
                <div>{data?.correctAnswer}</div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 border-t pt-2">
                <span>SLO Reference: <strong className="text-purple-900">{data?.sloRefCode}</strong></span>
                <span>Cognitive Domain: <strong>{data?.cognitiveDomain}</strong></span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 34. TRI-LINGUAL PORTAL COMMUNICATION DOSSIER             */}
          {/* ========================================================= */}
          {type === 'localized_portal_dossier' && (
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-teal-950 space-y-5 text-slate-900 shadow-md text-xs">
              <div className="flex justify-between items-start border-b-2 border-teal-950 pb-3">
                <div>
                  <div className="text-lg font-black text-[#002147] uppercase">
                    THE EDUCATORS (BEACONHOUSE NETWORK)
                  </div>
                  <div className="text-xs font-bold text-teal-900">
                    PORTAL LOCALIZATION &amp; TRI-LINGUAL COMMUNICATION DOSSIER
                  </div>
                  <div className="text-[10px] text-slate-500">English • አማርኛ (Amharic) • Afaan Oromoo</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-teal-950 text-sm">
                    Language: {data?.language?.toUpperCase() || 'EN'}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold">Verified &amp; Active</div>
                </div>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200 space-y-2">
                <div className="font-bold text-teal-950 text-sm">
                  {data?.customDict?.system_title || 'The Educators School Management System'}
                </div>
                <div className="text-slate-700 font-semibold">
                  {data?.customDict?.welcome_message || 'Welcome to the Multi-Campus Academic Portal'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border text-[11px]">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Parent Portal String:</div>
                  <div className="font-bold text-slate-900">{data?.customDict?.parent_child_attendance}</div>
                  <div className="text-slate-600">{data?.customDict?.parent_fee_status}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Teacher Portal String:</div>
                  <div className="font-bold text-slate-900">{data?.customDict?.teacher_mark_attendance}</div>
                  <div className="text-slate-600">{data?.customDict?.teacher_upload_marks}</div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold">Portal Systems Administrator</div>
                  <div className="text-[10px] text-slate-500">Information Technology &amp; Localization Department</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Prof. Arshad Mahmood</div>
                  <div className="text-[10px] text-slate-500">Chief Academic Director</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

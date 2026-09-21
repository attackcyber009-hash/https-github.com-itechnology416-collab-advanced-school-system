import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Receipt,
  FileText,
  MessageSquare,
  Printer,
  Calendar,
  Send,
  UserCheck,
  UserPlus,
  Key,
  Phone,
  ShieldCheck,
  Search,
  Download,
  Filter,
  Eye,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { Student, FeeVoucher } from '../types';

interface ParentPortalViewProps {
  students: Student[];
  vouchers: FeeVoucher[];
  initialAction?: 'manage' | 'requests' | 'reports' | null;
  onPrintVoucher: (voucher: FeeVoucher) => void;
}

export default function ParentPortalView({
  students,
  vouchers,
  initialAction = null,
  onPrintVoucher,
}: ParentPortalViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'manage' | 'requests' | 'reports'>('manage');
  const [selectedChildId, setSelectedChildId] = useState(students[0]?.id || 'std-1');
  const [complaintText, setComplaintText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  useEffect(() => {
    if (initialAction) {
      setActiveSubTab(initialAction);
    }
  }, [initialAction]);

  const child = students.find((s) => s.id === selectedChildId) || students[0];
  const childVoucher = (child ? vouchers.find((v) => v.studentId === child.id) : undefined) || vouchers[0];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! Your feedback has been lodged directly with the Campus Head Office.');
    setComplaintText('');
  };

  // Mock Parent Account Requests
  const [accountRequests, setAccountRequests] = useState([
    {
      id: 'REQ-PAR-01',
      parentName: 'Mian Tariq Mehmood',
      studentName: 'Muhammad Ayan',
      className: 'Class Prep',
      cnic: '35202-1234567-1',
      phone: '+92 300 1234567',
      email: 'tariq.mehmood@gmail.com',
      date: '2026-09-19',
      status: 'Pending',
    },
    {
      id: 'REQ-PAR-02',
      parentName: 'Chaudhry Kamran Akmal',
      studentName: 'Fatima Noor',
      className: 'Class Four',
      cnic: '35201-9876543-3',
      phone: '+92 321 9876543',
      email: 'kamran.akmal@yahoo.com',
      date: '2026-09-19',
      status: 'Pending',
    },
    {
      id: 'REQ-PAR-03',
      parentName: 'Dr. Shahid Khan',
      studentName: 'Zayn Shah',
      className: 'Class One',
      cnic: '35202-5551234-5',
      phone: '+92 333 5551234',
      email: 'dr.shahid@health.gov.pk',
      date: '2026-09-20',
      status: 'Pending',
    },
    {
      id: 'REQ-PAR-04',
      parentName: 'Engr. Zahid Hussain',
      studentName: 'Mustafa Zahid',
      className: 'Class Five',
      cnic: '35202-8889900-7',
      phone: '+92 301 4443322',
      email: 'zahid.hussain@wateen.net',
      date: '2026-09-20',
      status: 'Pending',
    },
  ]);

  return (
    <div id="parent-portal-module" className="space-y-4 text-xs">
      {/* Subtab Header Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-900 font-bold">
            <Users className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800">Parent Accounts Management Hub</h2>
            <p className="text-[11px] text-slate-500">
              Manage parent access credentials, approve account requests, and export guardian information reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('manage')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'manage'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manage Accounts</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('requests')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Account Requests</span>
            <span className="px-1.5 py-0.2 bg-purple-500 text-white rounded-full text-[10px] font-bold">
              {accountRequests.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('reports')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'reports'
                ? 'bg-[#002147] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Parent Information Reports</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MANAGE ACCOUNTS */}
      {activeSubTab === 'manage' && (
        <div className="space-y-4">
          {/* Welcome Banner & Live Child Preview */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="bg-purple-800/80 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-purple-200">
                SUPER ADMIN • PARENTS &amp; GUARDIANS PORTAL MONITORING
              </span>
              <h2 className="text-xl font-black mt-1">Parent &amp; Guardian Access Control</h2>
              <p className="text-purple-100 text-xs mt-0.5">
                {child ? `Active Student Live Preview: ${child.name} (${child.className}, Sec ${child.section}) • Roll No: ${child.rollNo}` : 'No student record selected'}
              </p>
            </div>

            {/* Child Selector */}
            <div className="flex items-center gap-2 bg-purple-950/60 p-1.5 rounded-lg border border-purple-500/50 text-xs">
              <span className="text-purple-200 font-medium">Preview Linked Student:</span>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="bg-purple-900 text-white font-bold px-3 py-1.5 rounded outline-none border border-purple-400"
              >
                {students.slice(0, 5).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Child Today Status & Attendance */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Child Attendance Live Feed</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-1">
                <div className="text-2xl font-black text-emerald-800">PRESENT</div>
                <div className="text-emerald-700 font-medium text-[11px]">
                  Turnstile Gate Check-in: <strong>07:44 AM</strong>
                </div>
                <div className="text-slate-500 text-[10px]">Monthly Attendance Rate: 96.4%</div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Total Academic Days:</span>
                  <span className="font-bold">22 Days</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Days Present:</span>
                  <span className="font-bold">21 Days</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Absences:</span>
                  <span className="font-bold">1 Day</span>
                </div>
              </div>
            </div>

            {/* Current Fee Voucher Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Billing &amp; Fee Status</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {childVoucher.paymentStatus}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Voucher No:</span>
                  <span className="font-bold text-slate-800">{childVoucher.voucherNo}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Billing Month:</span>
                  <span className="font-bold text-slate-800">{childVoucher.month}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Due Date:</span>
                  <span className="font-bold text-red-600">{childVoucher.dueDate}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-bold text-sm text-slate-900">
                  <span>Payable:</span>
                  <span className="text-emerald-700">Rs. {childVoucher.netPayable.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPrintVoucher(childVoucher)}
                className="w-full py-2 bg-[#002147] hover:bg-sky-950 text-white font-bold rounded shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bank Voucher</span>
              </button>
            </div>

            {/* Today's Homework Diary */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b pb-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Today's Homework Diary</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-sky-50 rounded border border-sky-100">
                  <span className="font-bold text-sky-900 block mb-0.5">Mathematics</span>
                  <p className="text-slate-700">Complete Exercises 4.1 Questions 1 to 5. Learn times tables of 8.</p>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-0.5">English</span>
                  <p className="text-slate-700">Read Unit 3: "The Little Explorer". Write 5 new vocabulary sentences.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Parent Accounts Directory */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Registered Parent Accounts &amp; Access Log</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Monitor parent login activity, reset mobile passwords, and bind student profiles
                </p>
              </div>

              <button
                type="button"
                onClick={() => alert('New Parent Account Registration Wizard opened.')}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Parent Account</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#002147] text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Parent ID</th>
                    <th className="py-2.5 px-3">Guardian Name</th>
                    <th className="py-2.5 px-3">Linked Student(s)</th>
                    <th className="py-2.5 px-3">Primary Contact</th>
                    <th className="py-2.5 px-3">Portal Username</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.slice(0, 6).map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">PAR-2024-0{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{std.fatherName}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-purple-900">{std.name}</span>
                        <span className="text-[11px] text-slate-500 block">
                          ({std.className} - Roll #{std.rollNo})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{std.parentPhone}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 bg-slate-50 rounded">
                        parent.{std.studentCode.toLowerCase()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">Today, 08:15 AM</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => alert(`Password reset SMS sent to ${std.parentPhone} for ${std.fatherName}.`)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] flex items-center gap-1 transition"
                          >
                            <Key className="w-3 h-3 text-amber-600" />
                            <span>Reset Password</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parent Helpline & Suggestion Desk */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Parent Helpline &amp; Direct Campus Desk</span>
            </div>

            <p className="text-slate-600">
              Inquiries, transport concerns, or academic feedback lodged directly with the Campus Head Office:
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-2">
              <textarea
                rows={3}
                required
                placeholder="Type your concern, complaint, or query for the campus principal..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                className="w-full p-3 border rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Message to Campus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACCOUNT REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-700" />
                <span>Pending Parent Portal Account Registration Requests</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Review, verify student enrollment match, and issue portal sign-in credentials
              </p>
            </div>

            <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded font-bold text-xs">
              {accountRequests.length} Pending Approval
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#002147] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Guardian Name</th>
                  <th className="py-2.5 px-3">Guardian CNIC</th>
                  <th className="py-2.5 px-3">Linked Student</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Mobile Contact</th>
                  <th className="py-2.5 px-3">Request Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {accountRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{req.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{req.parentName}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{req.cnic}</td>
                    <td className="py-3 px-3 font-bold text-purple-900">{req.studentName}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{req.className}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{req.phone}</td>
                    <td className="py-3 px-3 text-slate-500">{req.date}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Approved! Credentials dispatched via SMS Gateway to ${req.phone} for ${req.parentName}.`);
                            setAccountRequests((prev) => prev.filter((r) => r.id !== req.id));
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition cursor-pointer"
                        >
                          Approve &amp; Send Credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountRequests((prev) => prev.filter((r) => r.id !== req.id))}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px] transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {accountRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                      All parent account requests have been verified and approved.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PARENT INFORMATION REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-700" />
                <span>Parent Information &amp; Guardian Contact Master Directory</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Generate, filter, and export comprehensive father/mother details, CNIC indexes, and emergency contacts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Exporting Parent Master Directory as CSV/Excel...')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Directory CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#002147] hover:bg-sky-950 text-white font-bold rounded flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Father Name, CNIC, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="All">All Student Classes</option>
                <option value="Class Prep">Class Prep</option>
                <option value="Class One">Class One</option>
                <option value="Class Four">Class Four</option>
                <option value="Class Five">Class Five</option>
              </select>
            </div>

            <div className="flex items-center justify-end text-slate-500 text-[11px] font-mono">
              Total Records: {students.length} Guardians
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#002147] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">S.No</th>
                  <th className="py-2.5 px-3">Father / Guardian Name</th>
                  <th className="py-2.5 px-3">Father CNIC</th>
                  <th className="py-2.5 px-3">Primary Contact</th>
                  <th className="py-2.5 px-3">Occupation / Profession</th>
                  <th className="py-2.5 px-3">Enrolled Ward(s)</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Residential Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students
                  .filter((std) => {
                    const matchSearch =
                      std.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      std.parentPhone.includes(searchQuery);
                    const matchClass =
                      selectedClassFilter === 'All' || std.className === selectedClassFilter;
                    return matchSearch && matchClass;
                  })
                  .map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{std.fatherName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">35202-1847293-{(idx % 9) + 1}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-800 font-semibold">{std.parentPhone}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {['Business Executive', 'Government Officer', 'Civil Engineer', 'Doctor / Physician', 'Advocate'][idx % 5]}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-purple-900">{std.name}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{std.className}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        House #{idx + 12}, Block C, Johar Town, Lahore
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


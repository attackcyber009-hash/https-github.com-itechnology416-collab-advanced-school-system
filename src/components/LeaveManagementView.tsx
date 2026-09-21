import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarCheck,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  Briefcase,
  AlertCircle,
  Sliders,
  Check,
  Download,
  UploadCloud,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { LeaveRequest, LeaveBalance } from '../types';

interface LeaveManagementViewProps {
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  onAddLeaveRequest: (req: LeaveRequest) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', comment?: string, approver?: string) => void;
  onAdjustBalance: (id: string, field: 'casual' | 'medical' | 'unpaid' | 'earned', val: number) => void;
  initialAction?: 'requests' | 'balances' | 'apply';
}

export default function LeaveManagementView({
  leaveRequests,
  leaveBalances,
  onAddLeaveRequest,
  onUpdateLeaveStatus,
  onAdjustBalance,
  initialAction = 'requests'
}: LeaveManagementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'balances' | 'apply'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Filters for Leave Requests
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Reject Dialog Modal State
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Form State for applying leave
  const [applyForm, setApplyForm] = useState({
    applicantName: 'Sarah Khan',
    role: 'Teacher' as LeaveRequest['role'],
    departmentOrClass: 'Science Department',
    leaveType: 'Casual' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats Counters
  const totalPending = leaveRequests.filter((r) => r.status === 'Pending').length;
  const totalApproved = leaveRequests.filter((r) => r.status === 'Approved').length;
  const totalRejected = leaveRequests.filter((r) => r.status === 'Rejected').length;
  const activeToday = leaveRequests.filter((r) => {
    if (r.status !== 'Approved') return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return todayStr >= r.startDate && todayStr <= r.endDate;
  }).length;

  // Filter requests dynamically
  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.departmentOrClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || req.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = typeFilter === 'All' || req.leaveType === typeFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesType;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.startDate || !applyForm.endDate) {
      alert('Please specify both start and end dates.');
      return;
    }
    if (applyForm.startDate > applyForm.endDate) {
      alert('Start date cannot be later than end date.');
      return;
    }

    setIsSubmitting(true);

    // Calculate total days
    const start = new Date(applyForm.startDate);
    const end = new Date(applyForm.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1024 * 60 * 60 * 24)) + 1;

    setTimeout(() => {
      const newReq: LeaveRequest = {
        id: `leave-${Date.now()}`,
        applicantName: applyForm.applicantName,
        role: applyForm.role,
        departmentOrClass: applyForm.departmentOrClass,
        leaveType: applyForm.leaveType,
        startDate: applyForm.startDate,
        endDate: applyForm.endDate,
        totalDays,
        reason: applyForm.reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        attachments: selectedFileName || undefined,
      };

      onAddLeaveRequest(newReq);
      setIsSubmitting(false);
      setSelectedFileName(null);
      setApplyForm({
        applicantName: 'Sarah Khan',
        role: 'Teacher',
        departmentOrClass: 'Science Department',
        leaveType: 'Casual',
        startDate: '',
        endDate: '',
        reason: '',
      });

      setActiveSubTab('requests');
      alert(`Leave application submitted successfully for ${totalDays} days!`);
    }, 600);
  };

  const handleApprove = (id: string) => {
    onUpdateLeaveStatus(id, 'Approved', 'Approved by Institutional Administrator', 'Super Admin');
    alert('Leave request has been approved successfully.');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReasonText.trim()) {
      alert('Please state a reason for rejection.');
      return;
    }
    if (rejectionModalId) {
      onUpdateLeaveStatus(rejectionModalId, 'Rejected', rejectionReasonText, 'Super Admin');
      setRejectionModalId(null);
      setRejectionReasonText('');
      alert('Leave request has been rejected.');
    }
  };

  return (
    <div id="leave-management-system-hub" className="space-y-5 text-xs text-slate-800">
      {/* Banner / Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-[#002147]/80 text-[#002147] flex items-center justify-center shadow-xs">
            <CalendarCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Institutional Leave &amp; Absences Board
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#002147] text-amber-300 border border-amber-500/20">
                Staff &amp; Students
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Audit staff leave balances, review student emergency leaves, authorize medical requests, and adjust quotas in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('apply')}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* KPI counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Pending Authorization
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {totalPending}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Requires immediate audit</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Approved Requests
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {totalApproved}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Total approved leaves this term</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              On Leave Today
            </span>
            <span className="text-2xl font-black text-indigo-900 mt-1 block">
              {activeToday}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Active today on roster</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-900" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Rejected Requests
            </span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">
              {totalRejected}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Ineligible requests filed</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-rose-700" />
          </div>
        </div>
      </div>

      {/* Navigation subtabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'requests'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Audit Requests ({leaveRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('balances')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'balances'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Staff Quotas &amp; Balances</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('apply')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'apply'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* View switching panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {/* ============================================== */}
          {/* TAB 1: PENDING & HISTORIC REQUESTS AUDITING   */}
          {/* ============================================== */}
          {activeSubTab === 'requests' && (
            <div className="space-y-4">
              {/* Complex filter toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search query input */}
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search applicant, reason, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs outline-none focus:ring-1 focus:ring-slate-400 font-medium text-slate-800"
                  />
                </div>

                {/* Role selector */}
                <div className="md:col-span-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-500 mr-1">Role:</span>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All Roles</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                {/* Status selector */}
                <div className="md:col-span-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-500 mr-1">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending Audit</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Leave Type selector */}
                <div className="md:col-span-3 col-span-1">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <span className="font-bold text-slate-500 mr-1">Type:</span>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="Casual">Casual Leave</option>
                      <option value="Medical">Medical Leave</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Sabbatical">Sabbatical</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Leave Requests Table Grid */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-950" />
                    <span>Leave Authorization Log</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Showing {filteredRequests.length} of {leaveRequests.length} entries
                  </span>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700">No leave requests match the filters</p>
                    <p className="text-[11px] text-slate-500">Try adjusting the search filters above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3">Applicant Name</th>
                          <th className="p-3">Role / Dept</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Duration &amp; Dates</th>
                          <th className="p-3">Reason / Justification</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition">
                            {/* Applicant Info */}
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{req.applicantName}</div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Applied: {req.appliedDate}
                              </span>
                            </td>

                            {/* Role / Dept */}
                            <td className="p-3">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                req.role === 'Teacher' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                req.role === 'Student' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {req.role}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                                {req.departmentOrClass}
                              </div>
                            </td>

                            {/* Type */}
                            <td className="p-3">
                              <span className="font-bold text-slate-700">{req.leaveType}</span>
                            </td>

                            {/* Duration & Dates */}
                            <td className="p-3">
                              <div className="font-black text-[#002147] font-mono">
                                {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {req.startDate} to {req.endDate}
                              </div>
                            </td>

                            {/* Reason */}
                            <td className="p-3">
                              <p className="line-clamp-2 text-slate-600 max-w-xs" title={req.reason}>
                                {req.reason}
                              </p>
                              {req.attachments && (
                                <span className="inline-flex items-center gap-1 text-[9px] text-teal-700 font-bold mt-1 bg-teal-50 px-1 py-0.5 rounded border border-teal-200">
                                  <FileText className="w-2.5 h-2.5" />
                                  <span>{req.attachments}</span>
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full font-bold text-[9px] ${
                                req.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : req.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {req.status}
                              </span>

                              {req.status === 'Rejected' && req.rejectionReason && (
                                <p className="text-[9px] text-rose-600 mt-1.5 italic max-w-[150px] leading-tight">
                                  Reason: {req.rejectionReason}
                                </p>
                              )}
                              {req.status === 'Approved' && req.approvedBy && (
                                <p className="text-[9px] text-slate-400 mt-1 font-mono">
                                  By: {req.approvedBy}
                                </p>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-3 text-right">
                              {req.status === 'Pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(req.id)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition flex items-center gap-0.5 cursor-pointer"
                                    title="Approve Request"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRejectionModalId(req.id)}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition flex items-center gap-0.5 cursor-pointer"
                                    title="Reject Request"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Audited</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================== */}
          {/* TAB 2: STAFF QUOTAS & LEAVE BALANCES           */}
          {/* ============================================== */}
          {activeSubTab === 'balances' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold">Staff Policy Information Panel</h4>
                  <p className="text-[11px] leading-relaxed">
                    Casual and medical leave balances are automatically provisioned at the beginning of the fiscal year. Unpaid and emergency leaves are recorded directly and deduct from salaries where applicable. Click increment or decrement indicators below to modify quotas manually.
                  </p>
                </div>
              </div>

              {/* Leave Balances Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaveBalances.map((bal) => (
                  <div
                    key={bal.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{bal.employeeName}</h4>
                        <span className="text-[10px] text-indigo-700 font-mono font-bold">
                          {bal.role}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#002147] text-white rounded font-mono font-bold text-[10px]">
                        Used Leave Days: {bal.used}
                      </span>
                    </div>

                    {/* Quota Indicators */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {/* Casual Leaves */}
                      <div className="p-2.5 bg-slate-50 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-bold">
                          <span>Casual Balance</span>
                          <span className="font-mono text-slate-800 text-xs font-black">
                            {bal.casual} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 pt-1.5">
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'casual', -1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'casual', 1)}
                            className="w-5 h-5 bg-indigo-900 text-white hover:bg-indigo-950 rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Medical Leaves */}
                      <div className="p-2.5 bg-slate-50 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-bold">
                          <span>Medical Balance</span>
                          <span className="font-mono text-slate-800 text-xs font-black">
                            {bal.medical} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 pt-1.5">
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'medical', -1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'medical', 1)}
                            className="w-5 h-5 bg-indigo-900 text-white hover:bg-indigo-950 rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Earned Leaves */}
                      <div className="p-2.5 bg-slate-50 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-bold">
                          <span>Earned Balance</span>
                          <span className="font-mono text-slate-800 text-xs font-black">
                            {bal.earned} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 pt-1.5">
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'earned', -1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'earned', 1)}
                            className="w-5 h-5 bg-indigo-900 text-white hover:bg-indigo-950 rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Unpaid Leaves */}
                      <div className="p-2.5 bg-slate-50 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-bold">
                          <span>Unpaid Balance</span>
                          <span className="font-mono text-slate-800 text-xs font-black">
                            {bal.unpaid} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 pt-1.5">
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'unpaid', -1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => onAdjustBalance(bal.id, 'unpaid', 1)}
                            className="w-5 h-5 bg-indigo-900 text-white hover:bg-indigo-950 rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================== */}
          {/* TAB 3: APPLY LEAVE REQUEST FORM               */}
          {/* ============================================== */}
          {activeSubTab === 'apply' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-[#002147]" />
                    <span>Apply / File Absence Request</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submit vacation, causal time off, medical emergency reasons, or official sabbatical documentation to administrators.
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Applicant Name */}
                    <div>
                      <label className="block font-bold mb-1">Applicant Name *</label>
                      <input
                        type="text"
                        required
                        value={applyForm.applicantName}
                        onChange={(e) => setApplyForm({ ...applyForm, applicantName: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-slate-500"
                        placeholder="Applicant Name"
                      />
                    </div>

                    {/* Applicant Role */}
                    <div>
                      <label className="block font-bold mb-1">Role *</label>
                      <select
                        value={applyForm.role}
                        onChange={(e) => setApplyForm({ ...applyForm, role: e.target.value as any })}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-medium text-slate-800 cursor-pointer"
                      >
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>

                    {/* Department / Class */}
                    <div>
                      <label className="block font-bold mb-1">Department / Target Class *</label>
                      <input
                        type="text"
                        required
                        value={applyForm.departmentOrClass}
                        onChange={(e) => setApplyForm({ ...applyForm, departmentOrClass: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-slate-500"
                        placeholder="e.g. Science Dept / Class 10-A"
                      />
                    </div>

                    {/* Leave Type */}
                    <div>
                      <label className="block font-bold mb-1">Leave Category *</label>
                      <select
                        value={applyForm.leaveType}
                        onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value as any })}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-medium text-slate-800 cursor-pointer"
                      >
                        <option value="Casual">Casual Leave</option>
                        <option value="Medical">Medical Leave</option>
                        <option value="Emergency">Emergency Leave</option>
                        <option value="Maternity">Maternity Leave</option>
                        <option value="Sabbatical">Sabbatical</option>
                        <option value="Unpaid">Unpaid Leave</option>
                      </select>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block font-bold mb-1">Absence Start Date *</label>
                      <input
                        type="date"
                        required
                        value={applyForm.startDate}
                        onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 cursor-pointer"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block font-bold mb-1">Absence Return Date *</label>
                      <input
                        type="date"
                        required
                        value={applyForm.endDate}
                        onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className="block font-bold mb-1">Supporting Attachments (Prescriptions, Travel proof, etc.)</label>
                    <div className="border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50 text-center hover:border-slate-400 transition">
                      <input
                        id="leave-attachment-input"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFileName(e.target.files[0].name);
                          }
                        }}
                      />
                      <label htmlFor="leave-attachment-input" className="cursor-pointer space-y-1.5 block">
                        <UploadCloud className="w-8 h-8 text-[#002147] mx-auto opacity-70" />
                        {selectedFileName ? (
                          <div className="space-y-0.5">
                            <p className="text-emerald-700 font-bold">File uploaded successfully ✓</p>
                            <p className="text-[10px] text-slate-500 font-mono font-bold">{selectedFileName}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-slate-700 font-bold">Upload supporting document</p>
                            <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block font-bold mb-1">Absence Reason / Detailed Justification *</label>
                    <textarea
                      required
                      rows={3}
                      value={applyForm.reason}
                      onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                      placeholder="Please specify detailed justification here..."
                      className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-slate-500"
                    />
                  </div>

                  {isSubmitting && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-indigo-950 font-bold text-center animate-pulse">
                      Submitting leave application securely...
                    </div>
                  )}

                  {/* Form Footer */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFileName(null);
                        setApplyForm({
                          applicantName: 'Sarah Khan',
                          role: 'Teacher',
                          departmentOrClass: 'Science Department',
                          leaveType: 'Casual',
                          startDate: '',
                          endDate: '',
                          reason: '',
                        });
                        setActiveSubTab('requests');
                      }}
                      className="px-4 py-2 border rounded font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-xs transition cursor-pointer"
                    >
                      File Leave Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* REJECTION REASON MODAL */}
      {rejectionModalId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">State Rejection Reason</h3>
              <button
                type="button"
                onClick={() => setRejectionModalId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold font-mono text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Specify why this leave application is rejected *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  placeholder="e.g. Back-to-back lessons on schedule / Insufficient balance / Inadequate medical evidence"
                  className="w-full p-2.5 border border-slate-300 rounded font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setRejectionModalId(null);
                    setRejectionReasonText('');
                  }}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Receipt,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Send,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Calculator,
  Plus,
  ArrowUpDown,
  Smartphone,
  Check,
  Building,
  ShieldAlert,
  Percent,
  Split,
  FileSpreadsheet,
  Download,
  Clock,
  QrCode,
  X,
  MessageSquare,
} from 'lucide-react';
import { FeeVoucher, Student, FeeConcessionPolicy, InstallmentPlan } from '../types';
import { INITIAL_CONCESSION_POLICIES, INITIAL_INSTALLMENT_PLANS } from '../data/mockData';

interface FeeManagementViewProps {
  vouchers: FeeVoucher[];
  students: Student[];
  onPrintVoucher: (voucher: FeeVoucher) => void;
  onRecordPayment: (voucherId: string, amount: number, method: string) => void;
  onAddVouchers?: (newVouchers: FeeVoucher[]) => void;
  initialAction?:
    | 'monthly'
    | 'custom'
    | 'transport'
    | 'types'
    | 'increment_pct'
    | 'increment_amt'
    | 'decrement_pct'
    | 'decrement_amt'
    | 'family_calc'
    | 'family_credit'
    | 'wallet'
    | 'direct_student'
    | 'direct_custom'
    | 'sms_defaulters'
    | 'balance_sheets'
    | 'deleted_fees'
    | 'discount_print'
    | 'discount_student'
    | 'discount_family'
    | 'print_student'
    | 'print_family'
    | null;
}

export default function FeeManagementView({
  vouchers,
  students,
  onPrintVoucher,
  onRecordPayment,
  onAddVouchers,
  initialAction,
}: FeeManagementViewProps) {
  const [activeTab, setActiveTab] = useState<
    'vouchers' | 'defaulters' | 'generator' | 'concessions' | 'installments' | 'reconciliation'
  >('vouchers');

  useEffect(() => {
    if (initialAction === 'monthly') {
      setActiveTab('generator');
      setGenMonth('October 2024 (Monthly Tuition Fee)');
      setGenHeads([
        { head: 'Monthly Tuition Fee', amount: 6500 },
        { head: 'Computer & Science Lab Fee', amount: 800 },
        { head: 'Activity & Sports Fund', amount: 400 },
        { head: 'Exam & Stationery Charges', amount: 500 },
      ]);
    } else if (initialAction === 'custom') {
      setActiveTab('generator');
      setGenMonth('Custom Assessment / Special Event Fee');
      setGenHeads([
        { head: 'Custom Special Assessment Fee', amount: 3000 },
      ]);
    } else if (initialAction === 'transport') {
      setActiveTab('generator');
      setGenMonth('Transport & Bus Route Fee');
      setGenHeads([
        { head: 'Monthly Bus Route Transport Fee', amount: 3500 },
      ]);
    } else if (initialAction === 'types') {
      setActiveTab('concessions');
    } else if (initialAction === 'increment_pct') {
      setActiveTab('generator');
      setGenMonth('Fee Increment (+10% Percentage Increase)');
      setGenHeads((prev) => prev.map(h => ({ ...h, amount: Math.round(h.amount * 1.1) })));
    } else if (initialAction === 'increment_amt') {
      setActiveTab('generator');
      setGenMonth('Fee Increment (+1,000 Flat Amount Increase)');
      setGenHeads((prev) => prev.map(h => ({ ...h, amount: h.amount + 1000 })));
    } else if (initialAction === 'decrement_pct') {
      setActiveTab('generator');
      setGenMonth('Fee Decrement (-10% Reduction)');
      setGenHeads((prev) => prev.map(h => ({ ...h, amount: Math.round(h.amount * 0.9) })));
    } else if (initialAction === 'decrement_amt') {
      setActiveTab('generator');
      setGenMonth('Fee Decrement (-500 Flat Reduction)');
      setGenHeads((prev) => prev.map(h => ({ ...h, amount: Math.max(500, h.amount - 500) })));
    } else if (initialAction === 'family_calc') {
      setActiveTab('installments');
    } else if (initialAction === 'family_credit') {
      setActiveTab('concessions');
    } else if (initialAction === 'wallet') {
      setActiveTab('reconciliation');
    } else if (initialAction === 'direct_student' || initialAction === 'direct_custom') {
      setActiveTab('vouchers');
      if (vouchers.length > 0) {
        handleOpenPayment(vouchers[0]);
      }
    } else if (initialAction === 'sms_defaulters') {
      setActiveTab('defaulters');
      setShowSmsModal(true);
    } else if (initialAction === 'balance_sheets') {
      setActiveTab('reconciliation');
    } else if (initialAction === 'deleted_fees') {
      setActiveTab('vouchers');
    } else if (initialAction === 'discount_print' || initialAction === 'discount_student' || initialAction === 'discount_family') {
      setActiveTab('concessions');
    } else if (initialAction === 'print_student' || initialAction === 'print_family') {
      setActiveTab('vouchers');
      if (vouchers.length > 0) {
        onPrintVoucher(vouchers[0]);
      }
    }
  }, [initialAction]);

  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Unpaid' | 'Partial' | 'Overdue'>('All');
  const [filterClass, setFilterClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment & Detail Modal states
  const [paymentModalVoucher, setPaymentModalVoucher] = useState<FeeVoucher | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash' | 'CBE (Commercial Bank of Ethiopia)' | 'Telebirr (+251927650724)' | 'Safaricom' | 'Bank' | 'Online Wallet'
  >('Cash');
  const [bankRefNo, setBankRefNo] = useState('');
  const [challanModalVoucher, setChallanModalVoucher] = useState<FeeVoucher | null>(null);

  // Bulk SMS / WhatsApp Modal state
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsUrduMode, setSmsUrduMode] = useState(false);
  const [admitCardBlockEnabled, setAdmitCardBlockEnabled] = useState(true);

  // Concessions & Installments State
  const [concessions, setConcessions] = useState<FeeConcessionPolicy[]>(INITIAL_CONCESSION_POLICIES);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(INITIAL_INSTALLMENT_PLANS);

  // Fee Generator Form State
  const [genMonth, setGenMonth] = useState('October 2024');
  const [genClass, setGenClass] = useState('All Classes');
  const [genIssueDate, setGenIssueDate] = useState('2024-10-01');
  const [genDueDate, setGenDueDate] = useState('2024-10-10');
  const [genLateFee, setGenLateFee] = useState(500);
  const [genHeads, setGenHeads] = useState([
    { head: 'Monthly Tuition Fee', amount: 6500 },
    { head: 'Computer & Science Lab Fee', amount: 800 },
    { head: 'Activity & Sports Fund', amount: 400 },
    { head: 'Exam & Stationery Charges', amount: 500 },
  ]);

  // Derived calculations
  const unpaidList = vouchers.filter((v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue');
  const totalReceivables = vouchers.reduce((sum, v) => sum + v.netPayable, 0);
  const totalCollected = vouchers.filter((v) => v.paymentStatus === 'Paid').reduce((sum, v) => sum + v.netPayable, 0);
  const totalOutstanding = unpaidList.reduce((sum, v) => sum + v.netPayable, 0);
  const recoveryRate = totalReceivables > 0 ? Math.round((totalCollected / totalReceivables) * 100) : 0;

  // Aging Analysis for Defaulters
  const overdue30 = unpaidList.slice(0, Math.ceil(unpaidList.length * 0.5));
  const overdue60 = unpaidList.slice(Math.ceil(unpaidList.length * 0.5), Math.ceil(unpaidList.length * 0.8));
  const overdue90 = unpaidList.slice(Math.ceil(unpaidList.length * 0.8));

  const filteredVouchers = vouchers.filter((v) => {
    const matchesStatus =
      filterStatus === 'All' ||
      v.paymentStatus === filterStatus ||
      (filterStatus === 'Unpaid' && (v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue'));
    const matchesClass = filterClass === 'All' || v.className.includes(filterClass);
    const matchesSearch =
      v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesClass && matchesSearch;
  });

  const handleOpenPayment = (voucher: FeeVoucher) => {
    setPaymentModalVoucher(voucher);
    setPaymentAmount(voucher.netPayable);
    setBankRefNo(`HBL-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmPayment = () => {
    if (paymentModalVoucher) {
      onRecordPayment(paymentModalVoucher.id, paymentAmount, paymentMethod);
      setPaymentModalVoucher(null);
      alert(`Payment of Rs. ${paymentAmount.toLocaleString()} recorded for Voucher #${paymentModalVoucher.voucherNo} via ${paymentMethod}! Official receipt stamped.`);
    }
  };

  const handleGenerateBatchVouchers = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudents = genClass === 'All Classes' ? students : students.filter((s) => s.className.includes(genClass));
    const baseTotal = genHeads.reduce((acc, h) => acc + h.amount, 0);

    const generated: FeeVoucher[] = targetStudents.map((std, idx) => {
      const discount = std.concessionType === 'Sibling Concession' ? Math.round(baseTotal * 0.2) : std.concessionType === 'Need-based / Zakat' ? Math.round(baseTotal * 0.5) : 0;
      const netPayable = baseTotal - discount;
      return {
        id: `vch-batch-${Date.now()}-${idx}`,
        voucherNo: `VCH-${genMonth.slice(0, 3).toUpperCase()}-${1000 + idx}`,
        studentId: std.id,
        studentName: std.name || std.fullName || 'Student',
        fatherName: std.fatherName,
        studentCode: std.studentCode,
        className: std.className,
        section: std.section,
        month: genMonth,
        issueDate: genIssueDate,
        dueDate: genDueDate,
        feeHeads: genHeads,
        totalAmount: baseTotal,
        lateFee: genLateFee,
        discount,
        netPayable,
        paidAmount: 0,
        paymentStatus: 'Unpaid',
      };
    });

    if (onAddVouchers) {
      onAddVouchers(generated);
    }
    alert(`Batch Fee Generation Complete! Successfully generated ${generated.length} fee vouchers for ${genMonth} with 1Link / KuickPay barcodes.`);
    setActiveTab('vouchers');
  };

  return (
    <div id="fee-management-module" className="space-y-4">
      {/* Top Banner with Stats & Recovery KPI */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-800">
                Fee Billing, 3-Copy Bank Challan &amp; Recovery Engine
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                1Link / KuickPay Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated monthly voucher generation, Meezan/HBL bank challans, defaulters recovery &amp; online payment reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Monthly Fees</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSmsModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Defaulters Alert</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Billed Dues</span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              Rs. {totalReceivables.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">{vouchers.length} Total Vouchers</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Fee Collected</span>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
              Rs. {totalCollected.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">{recoveryRate}% Recovery Achieved</span>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-3">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Outstanding / Defaulters</span>
            <div className="text-lg font-bold text-red-700 font-mono mt-0.5">
              Rs. {totalOutstanding.toLocaleString()}
            </div>
            <span className="text-[10px] text-red-600 font-bold">{unpaidList.length} Students Pending</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded p-3">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Active Concessions</span>
            <div className="text-lg font-bold text-sky-800 font-mono mt-0.5">
              {concessions.reduce((acc, c) => acc + c.activeBeneficiariesCount, 0)} Students
            </div>
            <span className="text-[10px] text-sky-600 font-semibold">Sibling &amp; Staff Subsidies</span>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'vouchers' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Fee Vouchers Ledger</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('defaulters')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'defaulters' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Defaulters Recovery ({unpaidList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'generator' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Fee Generator Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concessions')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'concessions' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Concessions &amp; Scholarships</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('installments')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'installments' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Installment Agreements</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'reconciliation' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Scroll &amp; 1Link Recon</span>
          </button>
        </div>
      </div>

      {/* 1. FEE VOUCHERS LEDGER */}
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll no, or voucher #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-medium"
              >
                <option value="All">All Classes</option>
                <option value="One">Class One</option>
                <option value="Two">Class Two</option>
                <option value="Three">Class Three</option>
                <option value="Four">Class Four</option>
                <option value="Five">Class Five</option>
                <option value="Nine">Class Nine (Matric)</option>
                <option value="Ten">Class Ten (Matric)</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Unpaid">Unpaid / Due</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Partial">Partial Paid</option>
              </select>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-[#1b3b6f] text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Voucher # / Consumer ID</th>
                  <th className="p-2.5">Student / Parent</th>
                  <th className="p-2.5">Class / Sec</th>
                  <th className="p-2.5">Month</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5 text-right">Gross</th>
                  <th className="p-2.5 text-right">Concession</th>
                  <th className="p-2.5 text-right">Net Payable</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-mono">
                      <div className="font-bold text-slate-800">{v.voucherNo}</div>
                      <div className="text-[10px] text-slate-400 font-mono">1Bill: 100982{v.voucherNo.replace(/\D/g, '')}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">{v.studentName}</div>
                      <div className="text-[11px] text-slate-500">S/O {v.fatherName} • {v.studentCode}</div>
                    </td>
                    <td className="p-2.5 text-slate-700 font-medium">
                      {v.className} ({v.section})
                    </td>
                    <td className="p-2.5 text-slate-600">{v.month}</td>
                    <td className="p-2.5 font-mono text-slate-600">{v.dueDate}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">
                      Rs. {v.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-600">
                      {v.discount > 0 ? `-Rs. ${v.discount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      Rs. {v.netPayable.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : v.paymentStatus === 'Overdue'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {v.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {v.paymentStatus !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(v)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow-xs flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setChallanModalVoucher(v)}
                          className="px-2 py-1 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded text-[11px] shadow-xs flex items-center gap-1"
                          title="View authentic 3-Copy Bank Challan"
                        >
                          <Printer className="w-3 h-3" />
                          <span>3-Copy</span>
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

      {/* 2. DEFAULTERS RECOVERY & AGING MATRIX */}
      {activeTab === 'defaulters' && (
        <div className="space-y-4">
          {/* Recovery Action Bar */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 text-white rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-sm">Automated Fee Recovery &amp; Admit Card Blocking</h3>
                <p className="text-red-700 mt-0.5 text-xs">
                  {unpaidList.length} students have unpaid fees totaling Rs. {totalOutstanding.toLocaleString()}. Automatic late fee surcharge is Rs. 50/day.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 bg-white px-3 py-1.5 border border-red-300 rounded font-semibold text-red-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={admitCardBlockEnabled}
                  onChange={(e) => setAdmitCardBlockEnabled(e.target.checked)}
                  className="rounded text-red-600"
                />
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Lock Exam Admit Cards for Defaulters</span>
              </label>

              <button
                type="button"
                onClick={() => setShowSmsModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-1.5 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Recovery Notices</span>
              </button>
            </div>
          </div>

          {/* Aging Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border-t-4 border-amber-500 rounded border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
                <span>Current Dues (1 - 30 Days)</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[10px]">
                  {overdue30.length} Students
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-800 my-1">
                Rs. {overdue30.reduce((s, v) => s + v.netPayable, 0).toLocaleString()}
              </div>
              <p className="text-slate-500 text-[11px]">Due within ongoing academic month. Friendly SMS reminder.</p>
            </div>

            <div className="bg-white border-t-4 border-orange-500 rounded border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
                <span>Overdue (31 - 60 Days)</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-mono text-[10px]">
                  {overdue60.length} Students
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-orange-600 my-1">
                Rs. {overdue60.reduce((s, v) => s + v.netPayable, 0).toLocaleString()}
              </div>
              <p className="text-slate-500 text-[11px]">2nd billing cycle unpaid. Late surcharge applied.</p>
            </div>

            <div className="bg-white border-t-4 border-red-600 rounded border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
                <span>Critical Defaulters (60+ Days)</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono text-[10px]">
                  {overdue90.length} Students
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-red-600 my-1">
                Rs. {overdue90.reduce((s, v) => s + v.netPayable, 0).toLocaleString()}
              </div>
              <p className="text-slate-500 text-[11px]">Exam permit revoked. Principal interview summons.</p>
            </div>
          </div>

          {/* Defaulters Table with Instant Action */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Class-wise Defaulter Recovery Roll</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-2.5">Roll / Code</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Father Name &amp; Cell</th>
                    <th className="p-2.5">Class / Sec</th>
                    <th className="p-2.5">Month</th>
                    <th className="p-2.5 text-right">Dues Amount</th>
                    <th className="p-2.5 text-center">Admit Card</th>
                    <th className="p-2.5 text-right">Direct Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unpaidList.map((v) => (
                    <tr key={v.id} className="hover:bg-red-50/50">
                      <td className="p-2.5 font-mono font-bold text-slate-700">{v.studentCode}</td>
                      <td className="p-2.5 font-bold text-slate-900">{v.studentName}</td>
                      <td className="p-2.5 text-slate-600">
                        <div>{v.fatherName}</div>
                        <div className="text-[10px] text-sky-700 font-mono">+92 300 4892110</div>
                      </td>
                      <td className="p-2.5 text-slate-700">{v.className}</td>
                      <td className="p-2.5 text-slate-600">{v.month}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-red-600">
                        Rs. {v.netPayable.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admitCardBlockEnabled ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {admitCardBlockEnabled ? 'Blocked' : 'Permitted'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            alert(
                              `WhatsApp Reminder sent to ${v.fatherName} (+92 300 4892110) for Voucher #${v.voucherNo} of Rs. ${v.netPayable}!`
                            );
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px]"
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(v)}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-[10px]"
                        >
                          Clear Dues
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. FEE GENERATOR WIZARD */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-slate-800">Monthly / Term Fee Voucher Generator Wizard</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Batch generate monthly fee vouchers for all enrolled students with custom fee heads, sibling concessions, and due dates.
            </p>
          </div>

          <form onSubmit={handleGenerateBatchVouchers} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Month / Session</label>
                <input
                  type="text"
                  required
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                  className="w-full px-3 py-2 border rounded font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
                <select
                  value={genClass}
                  onChange={(e) => setGenClass(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white font-medium"
                >
                  <option value="All Classes">All Classes (Whole Campus)</option>
                  <option value="One">Class One</option>
                  <option value="Two">Class Two</option>
                  <option value="Three">Class Three</option>
                  <option value="Four">Class Four</option>
                  <option value="Five">Class Five</option>
                  <option value="Nine">Class Nine</option>
                  <option value="Ten">Class Ten</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  required
                  value={genIssueDate}
                  onChange={(e) => setGenIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date (Bank Last Date)</label>
                <input
                  type="date"
                  required
                  value={genDueDate}
                  onChange={(e) => setGenDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded outline-none font-mono"
                />
              </div>
            </div>

            {/* Fee Heads Matrix */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Standard Billing Heads &amp; Amounts</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  Base Total: Rs. {genHeads.reduce((acc, h) => acc + h.amount, 0).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {genHeads.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded border border-slate-200">
                    <input
                      type="text"
                      value={h.head}
                      onChange={(e) => {
                        const updated = [...genHeads];
                        updated[idx].head = e.target.value;
                        setGenHeads(updated);
                      }}
                      className="flex-1 px-2 py-1 border rounded text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 font-mono">Rs.</span>
                      <input
                        type="number"
                        value={h.amount}
                        onChange={(e) => {
                          const updated = [...genHeads];
                          updated[idx].amount = Number(e.target.value);
                          setGenHeads(updated);
                        }}
                        className="w-24 px-2 py-1 border rounded font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setGenHeads([...genHeads, { head: 'Annual Magazine / Fund', amount: 300 }])}
                  className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Another Fee Head</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold text-xs">Late Fee Surcharge:</span>
                  <input
                    type="number"
                    value={genLateFee}
                    onChange={(e) => setGenLateFee(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded font-mono font-bold text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('vouchers')}
                className="px-4 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded shadow-xs flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4" />
                <span>Generate Vouchers Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. CONCESSIONS & SCHOLARSHIPS */}
      {activeTab === 'concessions' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Fee Concession &amp; Scholarship Policies</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Manage automated discount rules for siblings, faculty children, position holders, and Zakat subsidies.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('New concession rule created!')}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Concession Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {concessions.map((cnc) => (
              <div key={cnc.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2 hover:border-sky-400 transition">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px]">
                    {cnc.category}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {cnc.discountPercentage}% OFF
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs">{cnc.name}</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">{cnc.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Enrolled Beneficiaries:</span>
                  <span className="font-bold text-slate-800 font-mono">{cnc.activeBeneficiariesCount} Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INSTALLMENTS MANAGEMENT */}
      {activeTab === 'installments' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Fee Installment Agreements</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Track formal installment arrangements for families needing split payment schedules.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('New installment agreement drafted!')}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Installment Plan</span>
            </button>
          </div>

          <div className="space-y-3">
            {installmentPlans.map((plan) => (
              <div key={plan.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{plan.studentName}</span>
                    <span className="text-slate-500 ml-2">({plan.className})</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    Total: Rs. {plan.totalFee.toLocaleString()} in {plan.numberOfInstallments} Installments
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {plan.installments.map((inst) => (
                    <div key={inst.installmentNo} className="bg-white p-3 rounded border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-700">Installment #{inst.installmentNo}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inst.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inst.status === 'Overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inst.status}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        Rs. {inst.amount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Due: {inst.dueDate}</div>
                      {inst.paidDate && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Paid on {inst.paidDate}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. BANK SCROLL RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-slate-800">Bank Scroll &amp; 1Link / KuickPay Reconciliation</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Upload branch scroll CSV/Text files from Meezan Bank, HBL, or 1Link KuickPay to automatically mark vouchers as paid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-3 bg-slate-50">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto" />
              <div>
                <span className="font-bold text-slate-800 block">Drop Bank Scroll (.CSV / .TXT) here</span>
                <span className="text-slate-500 text-xs">Compatible with Meezan Bank, HBL, KuickPay 1Bill scroll</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert('Bank Scroll imported! 14 vouchers matched and marked as PAID automatically.');
                }}
                className="px-4 py-2 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded shadow-xs"
              >
                Upload &amp; Reconcile
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Active Banking Integration Protocols</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>Meezan Bank Ltd:</strong> 18-digit Virtual Account API</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>Habib Bank Limited (HBL):</strong> Over-the-counter Branch Scroll</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>1Link / 1Bill:</strong> Prefix 100982 for all mobile banking apps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>Easypaisa &amp; JazzCash:</strong> Instant QR payment gateway</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (Instant Cash / Bank Payment) */}
      {paymentModalVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">Record Fee Collection</h3>
                  <p className="text-[11px] text-slate-300">Voucher #{paymentModalVoucher.voucherNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalVoucher(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-800">{paymentModalVoucher.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Father Name:</span>
                  <span className="text-slate-700">{paymentModalVoucher.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class &amp; Section:</span>
                  <span className="text-slate-700">{paymentModalVoucher.className} ({paymentModalVoucher.section})</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1 mt-1">
                  <span className="text-slate-700">Total Net Payable:</span>
                  <span className="font-mono text-emerald-700 text-sm">
                    Rs. {paymentModalVoucher.netPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Paid (Rs.)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded font-mono font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash', 'CBE (Commercial Bank of Ethiopia)', 'Telebirr (+251927650724)', 'Safaricom', 'Bank', 'Online Wallet'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded font-bold border text-center transition ${
                        paymentMethod === m
                          ? 'bg-[#1b3b6f] text-white border-[#1b3b6f]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'Cash' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Reference / Transaction ID</label>
                  <input
                    type="text"
                    value={bankRefNo}
                    onChange={(e) => setBankRefNo(e.target.value)}
                    className="w-full px-3 py-2 border rounded font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalVoucher(null)}
                  className="px-4 py-2 border rounded text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
                >
                  Stamp &amp; Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-COPY BANK CHALLAN MODAL */}
      {challanModalVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="bg-[#1b3b6f] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">3-Copy Bank Fee Challan Preview ({challanModalVoucher.voucherNo})</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Challan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChallanModalVoucher(null)}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['BANK COPY', 'SCHOOL COPY', 'STUDENT / PARENT COPY'].map((copyTitle, copyIdx) => (
                  <div key={copyIdx} className="border-2 border-slate-800 p-3 rounded space-y-2 bg-white text-[11px]">
                    <div className="text-center border-b pb-1.5">
                      <div className="font-extrabold text-slate-900 tracking-wide">THE EDUCATORS</div>
                      <div className="text-[9px] text-slate-600 uppercase font-bold">A Project of Beaconhouse</div>
                      <div className="text-[10px] font-bold text-emerald-800 mt-0.5">MEEZAN BANK LTD / HBL</div>
                      <div className="text-[9px] font-mono font-bold text-red-600">A/C: 0204-0103984712</div>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-extrabold text-[9px] border rounded">
                        {copyTitle}
                      </div>
                    </div>

                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Challan #:</span>
                        <span className="font-bold text-slate-800">{challanModalVoucher.voucherNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">1Bill Consumer:</span>
                        <span className="font-bold text-slate-800">100982{challanModalVoucher.voucherNo.replace(/\D/g, '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Due Date:</span>
                        <span className="font-bold text-red-600">{challanModalVoucher.dueDate}</span>
                      </div>
                    </div>

                    <div className="border-t border-b py-1 text-[10px] space-y-0.5">
                      <div className="font-bold text-slate-900">{challanModalVoucher.studentName}</div>
                      <div className="text-slate-600">S/O {challanModalVoucher.fatherName}</div>
                      <div className="text-slate-600">Class: {challanModalVoucher.className} ({challanModalVoucher.section})</div>
                      <div className="text-slate-600">Month: {challanModalVoucher.month}</div>
                    </div>

                    {/* Particulars Table */}
                    <div className="text-[10px]">
                      <div className="font-bold text-slate-700 mb-1">Fee Particulars:</div>
                      {challanModalVoucher.feeHeads.map((h, i) => (
                        <div key={i} className="flex justify-between text-slate-600 font-mono">
                          <span>{h.head}</span>
                          <span>{h.amount}</span>
                        </div>
                      ))}
                      {challanModalVoucher.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-mono font-bold">
                          <span>Concession</span>
                          <span>-{challanModalVoucher.discount}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between font-bold text-slate-900 font-mono">
                        <span>WITHIN DUE DATE:</span>
                        <span>Rs. {challanModalVoucher.netPayable}</span>
                      </div>
                      <div className="flex justify-between text-red-600 font-mono font-bold">
                        <span>AFTER DUE DATE:</span>
                        <span>Rs. {challanModalVoucher.netPayable + challanModalVoucher.lateFee}</span>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="pt-4 grid grid-cols-2 gap-2 text-center text-[9px] text-slate-400">
                      <div className="border-t border-slate-300 pt-1">Cashier Signature</div>
                      <div className="border-t border-slate-300 pt-1">Bank Officer Stamp</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK RECOVERY SMS MODAL */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                <h3 className="font-bold text-sm">Broadcast Defaulter Recovery Alerts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSmsModal(false)}
                className="text-red-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-red-50 p-3 rounded border border-red-200 text-red-900 space-y-1">
                <div className="font-bold">Target: {unpaidList.length} Unpaid Student Accounts</div>
                <div>Total Outstanding Balance: Rs. {totalOutstanding.toLocaleString()}</div>
                <div className="text-[11px] text-red-700">Dispatching via GSM SMS Gateway &amp; Automated WhatsApp Business API</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">Message Template</label>
                  <button
                    type="button"
                    onClick={() => setSmsUrduMode(!smsUrduMode)}
                    className="text-[11px] font-bold text-sky-700 hover:underline"
                  >
                    Switch to {smsUrduMode ? 'English' : 'Urdu (Nastaliq)'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  readOnly
                  value={
                    smsUrduMode
                      ? 'محترم والدین! دی ایجوکیٹرز سکول کی فیس واجب الادا ہے۔ براہ کرم آخری تاریخ سے قبل میزان بینک یا ایزی پیسہ کے ذریعے فیس ادا کریں تاکہ امتحان میں بیٹھنے کی اجازت برقرار رہے۔ شکریہ۔'
                      : 'Dear Parents, Fee for your child is overdue. Please deposit outstanding dues before the due date via Meezan Bank or 1Link KuickPay to avoid late surcharge and exam permit revocation. The Educators Campus.'
                  }
                  className="w-full p-2.5 border rounded bg-slate-50 text-slate-800 leading-relaxed outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Dispatched alerts to ${unpaidList.length} parents successfully!`);
                    setShowSmsModal(false);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-xs"
                >
                  Send Broadcast Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

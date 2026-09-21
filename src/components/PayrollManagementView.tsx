import { useState } from 'react';
import {
  Coins,
  DollarSign,
  Briefcase,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  Building,
  Clock,
  Calendar,
  X,
  CreditCard,
  Download,
  FileSpreadsheet,
  Check,
  Percent,
} from 'lucide-react';
import { SalarySlip, StaffLoanRecord, StaffMember } from '../types';
import { INITIAL_SALARY_SLIPS, INITIAL_STAFF_LOANS } from '../data/mockData';

interface PayrollManagementViewProps {
  staff: StaffMember[];
  onDisburseSalary?: (slipId: string, paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque') => void;
}

export default function PayrollManagementView({
  staff,
  onDisburseSalary,
}: PayrollManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'slips' | 'generator' | 'loans' | 'bank_advice'>('slips');
  const [slips, setSlips] = useState<SalarySlip[]>(INITIAL_SALARY_SLIPS);
  const [loans, setLoans] = useState<StaffLoanRecord[]>(INITIAL_STAFF_LOANS);

  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Payslip Modal State
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<SalarySlip | null>(null);

  // New Loan Modal State
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState({
    staffId: staff[0]?.id || 'stf-1',
    amount: 30000,
    purpose: 'Family Medical Emergency',
    monthlyDeduction: 5000,
  });

  // Payroll Generator Form State
  const [genMonth, setGenMonth] = useState('October 2024');
  const [selectedStaffToGenerate, setSelectedStaffToGenerate] = useState(staff[0]?.id || 'stf-1');
  const [genBasic, setGenBasic] = useState(50000);
  const [genHra, setGenHra] = useState(12000);
  const [genMedical, setGenMedical] = useState(4000);
  const [genConveyance, setGenConveyance] = useState(5000);
  const [genSpecial, setGenSpecial] = useState(3000);
  const [genTax, setGenTax] = useState(1500);
  const [genEobi, setGenEobi] = useState(1200);
  const [genAbsentCut, setGenAbsentCut] = useState(0);
  const [genLoanCut, setGenLoanCut] = useState(0);

  // Derived metrics
  const totalPayrollBudget = slips.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalNetDisbursed = slips.filter((s) => s.paymentStatus === 'Paid').reduce((sum, s) => sum + s.netSalary, 0);
  const totalPendingPayout = slips.filter((s) => s.paymentStatus === 'Pending').reduce((sum, s) => sum + s.netSalary, 0);
  const totalActiveLoansBalance = loans.filter((l) => l.status === 'Active').reduce((sum, l) => sum + l.remainingBalance, 0);

  const filteredSlips = slips.filter((s) => {
    const matchesDept = filterDepartment === 'All' || s.department.includes(filterDepartment);
    const matchesStatus = filterStatus === 'All' || s.paymentStatus === filterStatus;
    const matchesSearch =
      s.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const handleMarkAsPaid = (slipId: string) => {
    setSlips((prev) =>
      prev.map((s) =>
        s.id === slipId
          ? {
              ...s,
              paymentStatus: 'Paid',
              disbursementDate: new Date().toISOString().split('T')[0],
            }
          : s
      )
    );
    if (onDisburseSalary) {
      onDisburseSalary(slipId, 'Bank Transfer');
    }
    alert('Salary marked as PAID! Bank disbursement record synchronized.');
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember = staff.find((s) => s.id === newLoanForm.staffId);
    if (!staffMember) return;

    const newLoan: StaffLoanRecord = {
      id: `lon-${Date.now()}`,
      loanCode: `LN-2024-${Math.floor(10 + Math.random() * 90)}`,
      staffId: staffMember.id,
      staffName: staffMember.name,
      designation: staffMember.designation,
      loanAmount: Number(newLoanForm.amount),
      purpose: newLoanForm.purpose,
      requestDate: new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      monthlyDeduction: Number(newLoanForm.monthlyDeduction),
      totalPaid: 0,
      remainingBalance: Number(newLoanForm.amount),
      status: 'Active',
    };

    setLoans([newLoan, ...loans]);
    setShowLoanModal(false);
    alert(`Staff Emergency Loan of Rs. ${newLoan.loanAmount.toLocaleString()} approved for ${newLoan.staffName}! Monthly installment Rs. ${newLoan.monthlyDeduction} scheduled.`);
  };

  const handleGenerateSingleSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember = staff.find((s) => s.id === selectedStaffToGenerate);
    if (!staffMember) return;

    const allowances = [
      { name: 'House Rent Allowance (HRA)', amount: genHra },
      { name: 'Medical Allowance', amount: genMedical },
      { name: 'Conveyance Allowance', amount: genConveyance },
      { name: 'Special Allowance', amount: genSpecial },
    ];
    const totalAllowances = genHra + genMedical + genConveyance + genSpecial;
    const grossSalary = genBasic + totalAllowances;

    const deductions = [
      { name: 'Income Tax Withholding', amount: genTax },
      { name: 'EOBI Contribution', amount: genEobi },
      { name: 'Attendance Absenteeism Deduction', amount: genAbsentCut },
      { name: 'Staff Loan Repayment EMI', amount: genLoanCut },
    ];
    const totalDeductions = genTax + genEobi + genAbsentCut + genLoanCut;
    const netSalary = grossSalary - totalDeductions;

    const newSlip: SalarySlip = {
      id: `slp-${Date.now()}`,
      slipNo: `PAY-${genMonth.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      staffId: staffMember.id,
      staffName: staffMember.name,
      designation: staffMember.designation,
      department: staffMember.department,
      month: genMonth,
      basicSalary: genBasic,
      allowances,
      totalAllowances,
      grossSalary,
      deductions,
      taxDeduction: genTax,
      eobiDeduction: genEobi,
      absentDeduction: genAbsentCut,
      loanDeduction: genLoanCut,
      totalDeductions,
      netSalary,
      paymentStatus: 'Pending',
      paymentMethod: 'Bank Transfer',
      bankName: 'Meezan Bank Ltd',
      accountNo: '0204-7711882201',
    };

    setSlips([newSlip, ...slips]);
    alert(`Salary Slip generated for ${newSlip.staffName}! Gross: Rs. ${grossSalary.toLocaleString()}, Net: Rs. ${netSalary.toLocaleString()}`);
    setActiveTab('slips');
  };

  return (
    <div id="payroll-management-module" className="space-y-4">
      {/* Top Banner with Financial Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800">
                Staff Payroll, Salary Slips &amp; Loan Ledger
              </h2>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-full border border-sky-200">
                FBR / EOBI Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated salary computation, biometric absent deductions, EOBI, staff loan recovery, and Meezan/HBL bank advice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLoanModal(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Staff Loan / Advance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Compute New Payroll</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Payroll Budget</span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              Rs. {totalPayrollBudget.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">{slips.length} Active Pay Slips</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Disbursed (Paid)</span>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
              Rs. {totalNetDisbursed.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Credited to Bank / Cash</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Disbursement</span>
            <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">
              Rs. {totalPendingPayout.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-600 font-bold">
              {slips.filter((s) => s.paymentStatus === 'Pending').length} Slips Awaiting Approval
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Active Staff Loans</span>
            <div className="text-lg font-bold text-purple-800 font-mono mt-0.5">
              Rs. {totalActiveLoansBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold">{loans.filter((l) => l.status === 'Active').length} Active Accounts</span>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('slips')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'slips' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Monthly Salary Slips Ledger</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'generator' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Salary Calculation Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'loans' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff Loans &amp; Advance Salary</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank_advice')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'bank_advice' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Meezan / HBL Bank Advice</span>
          </button>
        </div>
      </div>

      {/* 1. MONTHLY SALARY SLIPS LEDGER */}
      {activeTab === 'slips' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by staff name, designation, or slip #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-medium"
              >
                <option value="All">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Sciences">Sciences</option>
                <option value="Computer">Computer &amp; IT</option>
                <option value="Primary">Primary &amp; Junior Wing</option>
                <option value="Languages">Languages</option>
                <option value="Islamic">Islamic Studies</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Payroll</span>
              </button>
            </div>
          </div>

          {/* Slips Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-[#1b3b6f] text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Slip #</th>
                  <th className="p-2.5">Employee Name</th>
                  <th className="p-2.5">Designation &amp; Dept</th>
                  <th className="p-2.5">Month</th>
                  <th className="p-2.5 text-right">Basic Pay</th>
                  <th className="p-2.5 text-right">Allowances</th>
                  <th className="p-2.5 text-right">Deductions</th>
                  <th className="p-2.5 text-right">Net Payable</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSlips.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-mono font-bold text-slate-800">{s.slipNo}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">{s.staffName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {s.paymentMethod} {s.accountNo ? `• ${s.accountNo}` : ''}
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div className="text-slate-800 font-medium">{s.designation}</div>
                      <div className="text-[10px] text-slate-500">{s.department}</div>
                    </td>
                    <td className="p-2.5 text-slate-600 font-mono">{s.month}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">
                      Rs. {s.basicSalary.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-600 font-medium">
                      +Rs. {s.totalAllowances.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-red-600 font-medium">
                      -Rs. {s.totalDeductions.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      Rs. {s.netSalary.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {s.paymentStatus === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(s.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Disburse</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedSlipForPrint(s)}
                          className="px-2 py-1 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded text-[11px] shadow-xs flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Payslip</span>
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

      {/* 2. SALARY CALCULATION WIZARD */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-slate-800">Individual Staff Salary Computation Wizard</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Customize basic pay, allowances, FBR withholding taxes, biometric absence cut, and loan recoveries.
            </p>
          </div>

          <form onSubmit={handleGenerateSingleSlip} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Month</label>
                <input
                  type="text"
                  required
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                  className="w-full px-3 py-2 border rounded font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Staff Member</label>
                <select
                  value={selectedStaffToGenerate}
                  onChange={(e) => setSelectedStaffToGenerate(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white font-medium"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.designation} ({st.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Basic Monthly Pay (Rs.)</label>
                <input
                  type="number"
                  required
                  value={genBasic}
                  onChange={(e) => setGenBasic(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded font-mono font-bold outline-none"
                />
              </div>
            </div>

            {/* Earnings Allowances Matrix */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Gross Allowances &amp; Benefits</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  Total Allowances: Rs. {(genHra + genMedical + genConveyance + genSpecial).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">House Rent (HRA)</label>
                  <input
                    type="number"
                    value={genHra}
                    onChange={(e) => setGenHra(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Medical Allowance</label>
                  <input
                    type="number"
                    value={genMedical}
                    onChange={(e) => setGenMedical(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Conveyance Allowance</label>
                  <input
                    type="number"
                    value={genConveyance}
                    onChange={(e) => setGenConveyance(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Special / Duty Allowance</label>
                  <input
                    type="number"
                    value={genSpecial}
                    onChange={(e) => setGenSpecial(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Matrix */}
            <div className="border border-slate-200 rounded-lg p-4 bg-red-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900 text-xs">Standard &amp; Attendance Deductions</span>
                <span className="font-mono font-bold text-red-700 text-sm">
                  Total Deductions: Rs. {(genTax + genEobi + genAbsentCut + genLoanCut).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Income Tax (Withholding)</label>
                  <input
                    type="number"
                    value={genTax}
                    onChange={(e) => setGenTax(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs text-red-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">EOBI Contribution</label>
                  <input
                    type="number"
                    value={genEobi}
                    onChange={(e) => setGenEobi(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs text-red-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Biometric Absent Cut</label>
                  <input
                    type="number"
                    value={genAbsentCut}
                    onChange={(e) => setGenAbsentCut(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs text-red-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Staff Loan EMI</label>
                  <input
                    type="number"
                    value={genLoanCut}
                    onChange={(e) => setGenLoanCut(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded font-mono text-xs text-red-700 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Net Calculation Summary */}
            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-xs">Computed Net Take-Home Salary:</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  Rs. {(genBasic + genHra + genMedical + genConveyance + genSpecial - (genTax + genEobi + genAbsentCut + genLoanCut)).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Salary Slip</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. STAFF LOANS & ADVANCE SALARY LEDGER */}
      {activeTab === 'loans' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Staff Loans &amp; Advance Salary Management</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Record emergency advances, medical loans, and track automated monthly payroll deductions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLoanModal(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply for New Loan</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-[#1b3b6f] text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Loan Code</th>
                  <th className="p-2.5">Employee Name</th>
                  <th className="p-2.5">Designation</th>
                  <th className="p-2.5">Purpose</th>
                  <th className="p-2.5 text-right">Principal Amount</th>
                  <th className="p-2.5 text-right">Monthly EMI</th>
                  <th className="p-2.5 text-right">Recovered</th>
                  <th className="p-2.5 text-right">Remaining Balance</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loans.map((lon) => (
                  <tr key={lon.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-slate-800">{lon.loanCode}</td>
                    <td className="p-2.5 font-bold text-slate-900">{lon.staffName}</td>
                    <td className="p-2.5 text-slate-600">{lon.designation}</td>
                    <td className="p-2.5 text-slate-700">{lon.purpose}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                      Rs. {lon.loanAmount.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-purple-700 font-bold">
                      Rs. {lon.monthlyDeduction.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-700">
                      Rs. {lon.totalPaid.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-red-600">
                      Rs. {lon.remainingBalance.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          lon.status === 'Active'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {lon.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. BANK ADVICE EXPORT */}
      {activeTab === 'bank_advice' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Bank Salary Transfer Advice (Meezan &amp; HBL)</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Generate formatted bank transfer list with account numbers, IBANs, and net payable figures for bulk upload.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Bank Salary Transfer Sheet exported as CSV / Excel!');
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bank CSV Advice</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] font-sans border-b">
                <tr>
                  <th className="p-2.5">Sr #</th>
                  <th className="p-2.5">Beneficiary Name</th>
                  <th className="p-2.5">Bank Name</th>
                  <th className="p-2.5">Account # / IBAN</th>
                  <th className="p-2.5 text-right">Net Amount (PKR)</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slips.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500">{idx + 1}</td>
                    <td className="p-2.5 font-sans font-bold text-slate-800">{s.staffName}</td>
                    <td className="p-2.5 font-sans text-slate-600">{s.bankName || 'Meezan Bank Ltd'}</td>
                    <td className="p-2.5 text-slate-700">{s.accountNo || '0204-7788112201'}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      Rs. {s.netSalary.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-sans">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        Ready for Batch Switch
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINTABLE SALARY PAYSLIP MODAL */}
      {selectedSlipForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="bg-[#1b3b6f] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Official Salary Payslip ({selectedSlipForPrint.slipNo})</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlipForPrint(null)}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="border-2 border-slate-800 p-5 rounded space-y-3 bg-white">
                {/* Header */}
                <div className="text-center border-b pb-2">
                  <h2 className="text-base font-extrabold text-slate-900">THE EDUCATORS</h2>
                  <p className="text-[10px] text-slate-600 uppercase font-bold">A Project of Beaconhouse Group</p>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">CONFIDENTIAL SALARY PAY SLIP — {selectedSlipForPrint.month}</p>
                </div>

                {/* Staff Particulars */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-sans">Employee Name: </span>
                    <strong className="text-slate-900 font-sans">{selectedSlipForPrint.staffName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Designation: </span>
                    <strong className="text-slate-900 font-sans">{selectedSlipForPrint.designation}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Department: </span>
                    <span className="text-slate-700 font-sans">{selectedSlipForPrint.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Payment Mode: </span>
                    <span className="text-slate-700 font-sans">{selectedSlipForPrint.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Bank &amp; Account: </span>
                    <span className="text-slate-700">{selectedSlipForPrint.bankName} ({selectedSlipForPrint.accountNo || 'N/A'})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Disbursement Date: </span>
                    <span className="text-slate-700">{selectedSlipForPrint.disbursementDate || 'Pending Release'}</span>
                  </div>
                </div>

                {/* Earnings & Deductions Tables */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Earnings */}
                  <div className="border border-slate-200 rounded p-3 space-y-1.5">
                    <div className="font-bold text-slate-800 border-b pb-1 text-xs">EARNINGS (PKR)</div>
                    <div className="flex justify-between font-mono">
                      <span>Basic Pay:</span>
                      <span>Rs. {selectedSlipForPrint.basicSalary.toLocaleString()}</span>
                    </div>
                    {selectedSlipForPrint.allowances.map((a, i) => (
                      <div key={i} className="flex justify-between font-mono text-slate-600">
                        <span>{a.name}:</span>
                        <span>Rs. {a.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between font-mono font-bold text-emerald-700">
                      <span>GROSS PAY:</span>
                      <span>Rs. {selectedSlipForPrint.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="border border-slate-200 rounded p-3 space-y-1.5">
                    <div className="font-bold text-red-900 border-b pb-1 text-xs">DEDUCTIONS (PKR)</div>
                    {selectedSlipForPrint.deductions.map((d, i) => (
                      <div key={i} className="flex justify-between font-mono text-slate-600">
                        <span>{d.name}:</span>
                        <span>Rs. {d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between font-mono font-bold text-red-700">
                      <span>TOTAL DEDUCTIONS:</span>
                      <span>Rs. {selectedSlipForPrint.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Take-Home */}
                <div className="bg-slate-100 p-3 rounded flex items-center justify-between font-bold text-slate-900 border">
                  <span className="text-xs">NET TAKE-HOME SALARY (CREDITED):</span>
                  <span className="text-base font-mono text-emerald-800">
                    Rs. {selectedSlipForPrint.netSalary.toLocaleString()}
                  </span>
                </div>

                {/* Signatures */}
                <div className="pt-6 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-500">
                  <div className="border-t border-slate-300 pt-1">Accounts Officer</div>
                  <div className="border-t border-slate-300 pt-1">Principal Signature</div>
                  <div className="border-t border-slate-300 pt-1">Employee Signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW LOAN APPLICATION MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-sm">Issue Staff Loan / Emergency Advance</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLoanModal(false)}
                className="text-amber-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="p-5 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Beneficiary</label>
                <select
                  value={newLoanForm.staffId}
                  onChange={(e) => setNewLoanForm({ ...newLoanForm, staffId: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-white font-medium outline-none"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  value={newLoanForm.amount}
                  onChange={(e) => setNewLoanForm({ ...newLoanForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical emergency, motorbike overhaul..."
                  value={newLoanForm.purpose}
                  onChange={(e) => setNewLoanForm({ ...newLoanForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Deduction (EMI)</label>
                <input
                  type="number"
                  required
                  value={newLoanForm.monthlyDeduction}
                  onChange={(e) => setNewLoanForm({ ...newLoanForm, monthlyDeduction: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded font-mono font-bold text-purple-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs"
                >
                  Approve &amp; Disburse Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

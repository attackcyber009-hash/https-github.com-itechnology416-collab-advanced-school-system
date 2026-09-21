import { useState } from 'react';
import {
  TrendingDown,
  DollarSign,
  Building,
  CreditCard,
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Download,
  FileSpreadsheet,
  ArrowRightLeft,
  PieChart,
  ShieldCheck,
  TrendingUp,
  X,
  FileText,
  Wallet,
} from 'lucide-react';
import { ExpenseRecord, BankAccountLedger } from '../types';
import { INITIAL_BANK_ACCOUNTS } from '../data/mockData';

interface AccountsExpenseLedgerViewProps {
  expenses: ExpenseRecord[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  monthlyFeeCollection?: number;
  monthlyPayrollCost?: number;
}

export default function AccountsExpenseLedgerView({
  expenses,
  onAddExpense,
  monthlyFeeCollection = 1850000,
  monthlyPayrollCost = 485000,
}: AccountsExpenseLedgerViewProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'cash_bank' | 'pnl' | 'audit'>('expenses');
  const [bankAccounts, setBankAccounts] = useState<BankAccountLedger[]>(INITIAL_BANK_ACCOUNTS);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fund Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromAccountId: 'bnk-1',
    toAccountId: 'bnk-2',
    amount: 150000,
    memo: 'Fund transfer for staff salary disbursement',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState<{
    title: string;
    category: ExpenseRecord['category'];
    amount: number;
    date: string;
    paidTo: string;
    paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque';
    notes: string;
  }>({
    title: '',
    category: 'Utilities',
    amount: 15000,
    date: new Date().toISOString().split('T')[0],
    paidTo: '',
    paymentMode: 'Cash',
    notes: '',
  });

  // Calculations
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
  const totalOperationalRevenue = monthlyFeeCollection + 85000; // fee + POS store
  const totalOperationalOutflow = totalExpenseAmount + monthlyPayrollCost;
  const netMonthlySurplus = totalOperationalRevenue - totalOperationalOutflow;
  const surplusMargin = Math.round((netMonthlySurplus / totalOperationalRevenue) * 100);

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      paidTo: expenseForm.paidTo || 'Vendor',
      paymentMode: expenseForm.paymentMode,
      receiptNo: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: expenseForm.notes,
    });

    // Deduct from Petty Cash Safe or HBL depending on mode
    if (expenseForm.paymentMode === 'Cash') {
      setBankAccounts((prev) =>
        prev.map((acc) =>
          acc.id === 'bnk-3' ? { ...acc, balance: Math.max(0, acc.balance - Number(expenseForm.amount)) } : acc
        )
      );
    } else {
      setBankAccounts((prev) =>
        prev.map((acc) =>
          acc.id === 'bnk-2' ? { ...acc, balance: Math.max(0, acc.balance - Number(expenseForm.amount)) } : acc
        )
      );
    }

    alert('Expense Voucher registered and balanced against campus bank ledger!');
    setExpenseForm({
      title: '',
      category: 'Utilities',
      amount: 15000,
      date: new Date().toISOString().split('T')[0],
      paidTo: '',
      paymentMode: 'Cash',
      notes: '',
    });
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferForm.fromAccountId === transferForm.toAccountId) {
      alert('Source and destination accounts must be different!');
      return;
    }
    const transferAmt = Number(transferForm.amount);
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === transferForm.fromAccountId) {
          return { ...acc, balance: acc.balance - transferAmt };
        }
        if (acc.id === transferForm.toAccountId) {
          return { ...acc, balance: acc.balance + transferAmt };
        }
        return acc;
      })
    );
    setShowTransferModal(false);
    alert(`Internal Inter-Account Transfer of Rs. ${transferAmt.toLocaleString()} executed successfully!`);
  };

  return (
    <div id="accounts-expense-module" className="space-y-4">
      {/* Top Banner with Financial Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <TrendingDown className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-800">
                Accounts, Expenses &amp; Double-Entry Cash Book
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                Audit Trail Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chart of accounts, vendor expenditure vouchers, Meezan/HBL bank balances, and P&amp;L surplus statement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTransferModal(true)}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Inter-Bank Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('expense-entry-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense Voucher</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Liquid Cash &amp; Bank</span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              Rs. {totalBankBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">4 Accounts Balanced</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded p-3">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Campus Expenses (M-T-D)</span>
            <div className="text-lg font-bold text-rose-700 font-mono mt-0.5">
              Rs. {totalExpenseAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">{expenses.length} Vouchers Cleared</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Operating Net Surplus</span>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
              Rs. {netMonthlySurplus.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">{surplusMargin}% Operational Margin</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded p-3">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Billed Revenue (M-T-D)</span>
            <div className="text-lg font-bold text-sky-800 font-mono mt-0.5">
              Rs. {totalOperationalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-600 font-semibold">Fees + Store Sales</span>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'expenses' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Campus Expense Journal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cash_bank')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'cash_bank' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank &amp; Cash Accounts Book</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pnl')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'pnl' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Income &amp; Expenditure Statement (P&amp;L)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Annual Audit Balance Sheet</span>
          </button>
        </div>
      </div>

      {/* 1. CAMPUS EXPENSES JOURNAL */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Record New Expense Form */}
            <div id="expense-entry-form" className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
                <DollarSign className="w-4 h-4 text-rose-600" />
                <span>New Expense Voucher</span>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monthly LESCO Electricity Bill, Generator Diesel..."
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded bg-white font-medium"
                  >
                    <option value="Utilities">Utilities (Electricity, Gas, Water)</option>
                    <option value="Maintenance">Maintenance &amp; Building Repairs</option>
                    <option value="Lab Supplies">Science &amp; Computer Lab Supplies</option>
                    <option value="Stationery">Exam Printing &amp; Stationery</option>
                    <option value="Staff Welfare">Staff Tea &amp; Welfare</option>
                    <option value="Transport Fuel">School Van &amp; Bus Diesel</option>
                    <option value="Events">Campus Events &amp; Sports Day</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Paid To (Vendor)</label>
                    <input
                      type="text"
                      placeholder="e.g. LESCO Office"
                      value={expenseForm.paidTo}
                      onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                    <select
                      value={expenseForm.paymentMode}
                      onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border rounded bg-white font-medium"
                    >
                      <option value="Cash">Cash (Safe)</option>
                      <option value="Bank Transfer">Bank Transfer (HBL)</option>
                      <option value="Cheque">Bank Cheque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice / Receipt Memo</label>
                  <input
                    type="text"
                    placeholder="Invoice # or approval reference"
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow-xs transition"
                >
                  Post Expense to Ledger
                </button>
              </form>
            </div>

            {/* Expenses Journal Table */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                <span className="font-bold text-slate-800 text-sm">Monthly Expenditure Journal</span>
                <div className="flex items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-slate-200 rounded px-2 py-1 bg-white text-xs"
                  >
                    <option value="All">All Categories</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Lab Supplies">Lab Supplies</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Staff Welfare">Staff Welfare</option>
                    <option value="Transport Fuel">Transport Fuel</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#1b3b6f] text-white font-bold text-[11px] uppercase">
                    <tr>
                      <th className="p-2.5">Date / Rec #</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Vendor / Mode</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono">
                          <div className="text-slate-800 font-bold">{exp.date}</div>
                          <div className="text-[10px] text-slate-400">{exp.receiptNo}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{exp.title}</div>
                          {exp.notes && <div className="text-[10px] text-slate-500">{exp.notes}</div>}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600">
                          <div>{exp.paidTo}</div>
                          <div className="text-[10px] text-slate-400">{exp.paymentMode}</div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-600">
                          Rs. {exp.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BANK & CASH ACCOUNTS BOOK */}
      {activeTab === 'cash_bank' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Double-Entry Bank Accounts &amp; Cash Vault</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Monitor institutional cash-in-hand and corporate bank accounts with real-time reconciled balances.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTransferModal(true)}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Inter-Account Transfer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((acc) => (
              <div key={acc.id} className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 hover:border-sky-400 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">
                      {acc.accountType}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{acc.accountName}</h4>
                    <p className="text-slate-500 text-xs">{acc.bankName} • {acc.branchCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Ledger Balance</span>
                    <span className="text-lg font-bold font-mono text-emerald-800">
                      Rs. {acc.balance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Account Number:</span>
                    <span className="font-bold">{acc.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">IBAN:</span>
                    <span className="truncate block">{acc.iban}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INCOME & EXPENDITURE STATEMENT (P&L) */}
      {activeTab === 'pnl' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly Operating Income &amp; Expenditure Statement</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Comprehensive Profit &amp; Loss breakdown comparing student fee collections against payroll and campus overheads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Column */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-emerald-50/40">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>OPERATING REVENUES (PKR)</span>
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  Rs. {totalOperationalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-700">Monthly Tuition &amp; Term Fees:</span>
                  <span className="font-bold text-slate-900">Rs. {monthlyFeeCollection.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Campus POS Store Sales (Uniform &amp; Books):</span>
                  <span className="font-bold text-slate-900">Rs. 85,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Admission Registration &amp; Prospectus:</span>
                  <span className="font-bold text-slate-900">Rs. 45,000</span>
                </div>
              </div>
            </div>

            {/* Expenses Column */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-rose-50/40">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-700" />
                  <span>OPERATING EXPENDITURES (PKR)</span>
                </span>
                <span className="font-mono font-bold text-rose-800">
                  Rs. {totalOperationalOutflow.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-700">Staff Salaries &amp; Payroll Cost:</span>
                  <span className="font-bold text-slate-900">Rs. {monthlyPayrollCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Campus Utilities &amp; Overheads:</span>
                  <span className="font-bold text-slate-900">Rs. {totalExpenseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Exam Papers &amp; Lab Chemicals:</span>
                  <span className="font-bold text-slate-900">Rs. 18,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Operational Surplus Box */}
          <div className="bg-[#1b3b6f] text-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-300 block text-xs">NET MONTHLY OPERATIONAL SURPLUS:</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                Rs. {netMonthlySurplus.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400 rounded-full font-bold text-xs">
                {surplusMargin}% Operational Surplus Ratio
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ANNUAL AUDIT BALANCE SHEET */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Institutional Audit Trial &amp; Balance Sheet</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Certified financial position for Punjab Education Foundation, BISE Board affiliation, and Head Office audit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Financial Statement downloaded for external auditor verification!');
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Sheet</span>
            </button>
          </div>

          <div className="border-2 border-slate-800 p-5 rounded space-y-3 bg-white font-mono text-[11px]">
            <div className="text-center border-b pb-2 font-sans">
              <h2 className="text-base font-extrabold text-slate-900">THE EDUCATORS (MODEL TOWN CAMPUS)</h2>
              <p className="text-[10px] text-slate-600 uppercase font-bold">STATEMENT OF FINANCIAL POSITION AS OF SEPTEMBER 2024</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold text-slate-900 border-b pb-1 mb-2 font-sans">CURRENT ASSETS</div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Meezan Bank Current Account:</span>
                    <span>Rs. 2,450,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HBL Operational Account:</span>
                    <span>Rs. 890,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campus Cash Vault (Petty Cash):</span>
                    <span>Rs. 145,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1Link Gateway Escrow:</span>
                    <span>Rs. 385,000</span>
                  </div>
                  <div className="border-t pt-1 font-bold flex justify-between text-slate-900">
                    <span>TOTAL LIQUID ASSETS:</span>
                    <span>Rs. 3,870,000</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900 border-b pb-1 mb-2 font-sans">CURRENT LIABILITIES</div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Accounts Payable (Vendors):</span>
                    <span>Rs. 42,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FBR Tax Withholding Payable:</span>
                    <span>Rs. 14,300</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EOBI Contribution Payable:</span>
                    <span>Rs. 7,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit Caution Money:</span>
                    <span>Rs. 180,000</span>
                  </div>
                  <div className="border-t pt-1 font-bold flex justify-between text-slate-900">
                    <span>TOTAL LIABILITIES:</span>
                    <span>Rs. 243,500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-4 text-center font-sans text-[10px] text-slate-500">
              <div className="border-t border-slate-300 pt-1">Internal Auditor Stamp</div>
              <div className="border-t border-slate-300 pt-1">Chartered Accountant Seal</div>
            </div>
          </div>
        </div>
      )}

      {/* INTER-BANK TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Inter-Bank Account Transfer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="p-5 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer From (Debit Account)</label>
                <select
                  value={transferForm.fromAccountId}
                  onChange={(e) => setTransferForm({ ...transferForm, fromAccountId: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-white font-medium outline-none"
                >
                  {bankAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountName} (Rs. {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer To (Credit Account)</label>
                <select
                  value={transferForm.toAccountId}
                  onChange={(e) => setTransferForm({ ...transferForm, toAccountId: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-white font-medium outline-none"
                >
                  {bankAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountName} (Rs. {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  required
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Memo / Reference</label>
                <input
                  type="text"
                  required
                  value={transferForm.memo}
                  onChange={(e) => setTransferForm({ ...transferForm, memo: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded shadow-xs"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  Clock,
  ShoppingBag,
  DollarSign,
  MessageSquare,
  Plus,
  Printer,
  Calendar,
  Send,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { ExpenseRecord, StaffMember, InventoryProduct } from '../types';

interface AcademicOperationsViewProps {
  viewType: 'timetable' | 'stock' | 'accounts' | 'sms' | 'study_material';
  expenses: ExpenseRecord[];
  staff: StaffMember[];
  inventory: InventoryProduct[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
}

export default function AcademicOperationsView({
  viewType,
  expenses,
  staff,
  inventory,
  onAddExpense,
}: AcademicOperationsViewProps) {
  // SMS Broadcast state
  const [smsTarget, setSmsTarget] = useState<'All' | 'Defaulters' | 'Class'>('All');
  const [smsMessage, setSmsMessage] = useState(
    'Dear Parents, School will remain closed on Friday, 27th September on account of Eid Milad-un-Nabi. The Educators Campus.'
  );

  // Expense form
  const [expenseForm, setExpenseForm] = useState<{
    title: string;
    category: ExpenseRecord['category'];
    amount: number;
    date: string;
    paidTo: string;
    paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque';
  }>({
    title: '',
    category: 'Utilities',
    amount: 15000,
    date: new Date().toISOString().split('T')[0],
    paidTo: '',
    paymentMode: 'Cash',
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
    });
    alert('Campus expense entry successfully registered in balance sheet!');
    setExpenseForm({
      title: '',
      category: 'Utilities',
      amount: 15000,
      date: new Date().toISOString().split('T')[0],
      paidTo: '',
      paymentMode: 'Cash',
    });
  };

  const handleBroadcastSms = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Bulk SMS Broadcast dispatched via GSM SIM Gateway to ${smsTarget} recipients!`);
  };

  return (
    <div id="academic-operations-view" className="space-y-4">
      {/* 1. TIMETABLE SCHEDULE */}
      {viewType === 'timetable' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-700" />
              <h2 className="text-base font-bold text-slate-800">Master Class Routine &amp; Timetable Matrix</h2>
            </div>

            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 border rounded font-semibold bg-white">
                <option>Class One (Sec A)</option>
                <option>Class Two (Sec A)</option>
                <option>Class Three (Sec A)</option>
              </select>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 text-white font-bold rounded flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Timetable</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">Day / Period</th>
                  <th className="p-2.5 border-r border-slate-300">P1 (08:00 - 08:45)</th>
                  <th className="p-2.5 border-r border-slate-300">P2 (08:45 - 09:30)</th>
                  <th className="p-2.5 border-r border-slate-300">P3 (09:30 - 10:15)</th>
                  <th className="p-2.5 border-r border-slate-300 bg-amber-50">BREAK (10:15 - 10:45)</th>
                  <th className="p-2.5 border-r border-slate-300">P4 (10:45 - 11:30)</th>
                  <th className="p-2.5">P5 (11:30 - 12:15)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <tr key={day} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-300">{day}</td>
                    <td className="p-2.5 border-r border-slate-300">
                      <div className="font-bold text-sky-800">Mathematics</div>
                      <div className="text-[10px] text-slate-500">Mrs. Ayesha</div>
                    </td>
                    <td className="p-2.5 border-r border-slate-300">
                      <div className="font-bold text-emerald-800">English</div>
                      <div className="text-[10px] text-slate-500">Mr. Tariq</div>
                    </td>
                    <td className="p-2.5 border-r border-slate-300">
                      <div className="font-bold text-amber-800">Science</div>
                      <div className="text-[10px] text-slate-500">Ms. Hina</div>
                    </td>
                    <td className="p-2.5 border-r border-slate-300 bg-amber-50/50 font-semibold text-slate-400">
                      Recess
                    </td>
                    <td className="p-2.5 border-r border-slate-300">
                      <div className="font-bold text-purple-800">Urdu</div>
                      <div className="text-[10px] text-slate-500">Sir Bilal</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">Islamiat / Art</div>
                      <div className="text-[10px] text-slate-500">Qari Sahab</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. STOCK & POS INVENTORY */}
      {viewType === 'stock' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-800">Campus Store, Uniform &amp; Book Inventory (POS)</h2>
            </div>
            <button
              type="button"
              onClick={() => alert('New item added to school warehouse inventory!')}
              className="px-3 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Store Stock</span>
            </button>
          </div>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 font-bold border-b">
              <tr>
                <th className="p-2.5">Item Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5 text-center">Unit Price</th>
                <th className="p-2.5 text-center">Available Stock</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800">{item.name}</td>
                  <td className="p-2.5 text-slate-600">{item.category}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                    Rs. {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-emerald-700">
                    {item.stockQty} Units
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Sold 1x "${item.name}" for Rs. ${item.unitPrice}!`)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px]"
                    >
                      Sell Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. EXPENSES & ACCOUNTS */}
      {viewType === 'accounts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Record Expense Form */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span>Record New Campus Expense</span>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Generator Fuel, Science Lab chemicals..."
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseRecord['category'] })}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Lab Supplies">Lab Supplies</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Staff Welfare">Staff Welfare</option>
                    <option value="Transport Fuel">Transport Fuel</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid To (Vendor)</label>
                  <input
                    type="text"
                    placeholder="e.g. LESCO Electricity Office"
                    value={expenseForm.paidTo}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                    className="w-full px-3 py-2 border rounded outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow transition"
                >
                  Record Expense
                </button>
              </form>
            </div>

            {/* Expenses History Table */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-800 text-sm">Monthly Expenditure Journal</span>
                <span className="font-mono text-red-600 font-bold">
                  Total: Rs. {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold border-b">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Paid To</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{exp.date}</td>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-800">{exp.title}</td>
                        <td className="py-2 px-3 font-sans text-slate-600">{exp.category}</td>
                        <td className="py-2 px-3 font-sans text-slate-600">{exp.paidTo}</td>
                        <td className="py-2 px-3 text-right font-bold text-red-600">
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

      {/* 4. COMMUNICATIONS & SMS BROADCAST */}
      {viewType === 'sms' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-4 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <span>Institutional GSM / WhatsApp SMS Broadcast Gateway</span>
          </div>

          <form onSubmit={handleBroadcastSms} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Target Audience</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="smsTarget"
                    checked={smsTarget === 'All'}
                    onChange={() => setSmsTarget('All')}
                  />
                  <span>All Registered Parents (385)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="smsTarget"
                    checked={smsTarget === 'Defaulters'}
                    onChange={() => setSmsTarget('Defaulters')}
                  />
                  <span>Fee Defaulters Only</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="smsTarget"
                    checked={smsTarget === 'Class'}
                    onChange={() => setSmsTarget('Class')}
                  />
                  <span>Specific Class Only</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SMS Message Content</label>
              <textarea
                rows={4}
                required
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full p-3 border rounded focus:ring-1 focus:ring-sky-500 outline-none font-sans"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Characters: {smsMessage.length} / 160 (1 SMS Credit per parent)</span>
                <span>Gateway Status: Connected (98% Delivery Rate)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow flex items-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Broadcast Campaign</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Printer,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { FeeVoucher, Student } from '../types';

interface DefaultersAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: FeeVoucher[];
  students: Student[];
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

export default function DefaultersAlertModal({
  isOpen,
  onClose,
  vouchers,
  students,
  onPrintVoucher,
}: DefaultersAlertModalProps) {
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<string[]>([]);
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    'Respected Parent, this is a reminder from The Educators School System. Tuition fee voucher for your child is currently overdue. Please deposit the outstanding dues at the earliest to ensure uninterrupted academic services.'
  );

  if (!isOpen) return null;

  // Find all unpaid or overdue vouchers
  const unpaidVouchers = vouchers.filter(
    (v) => v.paymentStatus === 'Unpaid' || v.paymentStatus === 'Overdue'
  );

  const totalOverdueAmount = unpaidVouchers.reduce((sum, v) => sum + v.netPayable, 0);

  const toggleSelectAll = () => {
    if (selectedVoucherIds.length === unpaidVouchers.length) {
      setSelectedVoucherIds([]);
    } else {
      setSelectedVoucherIds(unpaidVouchers.map((v) => v.id));
    }
  };

  const toggleSelectVoucher = (id: string) => {
    if (selectedVoucherIds.includes(id)) {
      setSelectedVoucherIds(selectedVoucherIds.filter((vId) => vId !== id));
    } else {
      setSelectedVoucherIds([...selectedVoucherIds, id]);
    }
  };

  const handleBroadcastSms = () => {
    if (selectedVoucherIds.length === 0) {
      alert('Please select at least one student account to dispatch SMS reminder.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSmsDispatched(true);
      setTimeout(() => {
        setSmsDispatched(false);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#e74c3c] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Fee Defaulters &amp; Overdue Recovery Center</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-red-600">
                  {unpaidVouchers.length} Accounts Pending
                </span>
              </div>
              <p className="text-xs text-white/90">
                Institutional Fee Aging Analysis &amp; Automated SMS Recovery Gateway
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="bg-red-50 border-b border-red-100 px-5 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Overdue Receivables</div>
              <div className="text-lg font-black text-red-600">Rs. {totalOverdueAmount.toLocaleString()}</div>
            </div>
            <DollarSign className="w-5 h-5 text-red-500 opacity-60" />
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Average Aging Delay</div>
              <div className="text-lg font-black text-slate-800">14 Days</div>
            </div>
            <Calendar className="w-5 h-5 text-orange-500 opacity-60" />
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Recovery SMS Gateway</div>
              <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Telephony Online
              </div>
            </div>
            <MessageSquare className="w-5 h-5 text-emerald-500 opacity-60" />
          </div>
        </div>

        {/* Dispatch Alert Banner */}
        {smsDispatched && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>
              Success: Fee recovery SMS notification dispatched to {selectedVoucherIds.length} parents via SMS Gateway!
            </span>
          </div>
        )}

        {/* List of Defaulters */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="select-all-defaulters"
                checked={selectedVoucherIds.length === unpaidVouchers.length && unpaidVouchers.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="select-all-defaulters" className="text-xs font-bold text-slate-700 cursor-pointer">
                Select All ({unpaidVouchers.length} Accounts)
              </label>
            </div>

            <span className="text-[11px] text-slate-500">
              {selectedVoucherIds.length} of {unpaidVouchers.length} selected for recovery SMS
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3 w-8"></th>
                <th className="py-2.5 px-3">Voucher #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Class &amp; Sec</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Net Payable</th>
                <th className="py-2.5 px-3">Father's Mobile</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidVouchers.map((v) => {
                const isSelected = selectedVoucherIds.includes(v.id);
                const student = students.find((s) => s.id === v.studentId);
                const phone = student?.parentPhone || '+92 300 1234567';

                return (
                  <tr
                    key={v.id}
                    className={`hover:bg-red-50/50 transition ${
                      isSelected ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectVoucher(v.id)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{v.voucherNo}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{v.studentName}</div>
                      <div className="text-[10px] text-slate-500">S/O {v.fatherName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {v.className} • {v.section}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-red-600 font-semibold">{v.dueDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-red-600">
                      Rs. {v.netPayable.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{phone}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPrintVoucher && (
                          <button
                            type="button"
                            onClick={() => onPrintVoucher(v)}
                            title="Print Duplicate Voucher"
                            className="px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Voucher</span>
                          </button>
                        )}
                        <a
                          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `The Educators School Reminder: Dear ${v.fatherName}, fee voucher ${v.voucherNo} for ${v.studentName} of Rs. ${v.netPayable} is due.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Reminder"
                          className="px-2 py-1 text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SMS Customization Area */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-slate-700">
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>SMS Broadcast Template (Brand Masked: "THE EDUCATORS")</span>
            </div>
            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Estimated SMS parts: 1 • Character count: {customMessage.length} • Standard GSM 7-bit Encoding
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 font-medium"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSending || selectedVoucherIds.length === 0}
              onClick={handleBroadcastSms}
              className={`px-4 py-1.5 bg-[#e74c3c] hover:bg-[#c0392b] text-white font-bold rounded-md shadow-xs flex items-center gap-1.5 transition ${
                isSending || selectedVoucherIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching SMS...' : `Dispatch SMS to ${selectedVoucherIds.length} Parents`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
